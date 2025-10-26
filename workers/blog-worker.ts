// Cloudflare Worker for R2 Blog System
// Handles automatic numbering, indexing, and image tag processing

/// <reference types="@cloudflare/workers-types" />

export interface Env {
  R2_BUCKET: R2Bucket;
  BLOG_API_TOKEN: string;
}

interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  fileName: string;
  content?: string;
  images: string[];
}

interface BlogIndex {
  posts: BlogPost[];
  lastNumber: number;
  lastUpdated: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers for all responses
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // API Routes
      if (path.startsWith('/api/blog')) {
        const response = await handleBlogAPI(request, env, path);
        return new Response(response.body, {
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Static file serving from R2
      if (path.startsWith('/blog/')) {
        const response = await serveFromR2(path, env);
        return new Response(response.body, {
          status: response.status,
          headers: { ...corsHeaders, ...response.headers }
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500, 
        headers: corsHeaders 
      });
    }
  },
};

async function handleBlogAPI(request: Request, env: Env, path: string) {
  const method = request.method;
  const pathParts = path.split('/').filter(Boolean);
  
  switch (method) {
    case 'GET':
      if (pathParts[2] === 'index') {
        return await getBlogIndex(env);
      }
      if (pathParts[2] === 'post' && pathParts[3]) {
        return await getBlogPost(pathParts[3], env);
      }
      if (pathParts[2] === 'refresh') {
        return await refreshBlogIndex(env);
      }
      break;
      
    case 'POST':
      if (pathParts[2] === 'upload') {
        return await uploadBlogPost(request, env);
      }
      if (pathParts[2] === 'upload-image') {
        return await uploadImage(request, env);
      }
      break;
      
    case 'PUT':
      if (pathParts[2] === 'update' && pathParts[3]) {
        return await updateBlogPost(pathParts[3], request, env);
      }
      break;
      
    case 'DELETE':
      if (pathParts[2] === 'delete' && pathParts[3]) {
        return await deleteBlogPost(pathParts[3], env);
      }
      break;
  }
  
  return { status: 404, body: JSON.stringify({ error: 'Endpoint not found' }) };
}

async function getBlogIndex(env: Env) {
  try {
    const indexObj = await env.R2_BUCKET.get('blog/blog-index.json');
    
    if (!indexObj) {
      // Create initial index if it doesn't exist
      const emptyIndex: BlogIndex = {
        posts: [],
        lastNumber: 0,
        lastUpdated: new Date().toISOString()
      };
      await env.R2_BUCKET.put('blog/blog-index.json', JSON.stringify(emptyIndex, null, 2));
      return { status: 200, body: JSON.stringify(emptyIndex) };
    }
    
    const indexContent = await indexObj.text();
    return { status: 200, body: indexContent };
  } catch (error) {
    console.error('Error getting blog index:', error);
    return { status: 500, body: JSON.stringify({ error: 'Failed to get blog index' }) };
  }
}

async function getBlogPost(postId: string, env: Env) {
  try {
    const postObj = await env.R2_BUCKET.get(`blog/${postId}.md`);
    
    if (!postObj) {
      return { status: 404, body: JSON.stringify({ error: 'Post not found' }) };
    }
    
    let content = await postObj.text();
    
    // Process image tags [[001-1.jpg]] -> proper image URLs
    content = await processImageTags(content, postId, env);
    
    // Parse frontmatter and content
    const { metadata, body } = parseFrontmatter(content);
    
    return { 
      status: 200, 
      body: JSON.stringify({ 
        ...metadata, 
        content: body,
        id: postId 
      }) 
    };
  } catch (error) {
    console.error('Error getting blog post:', error);
    return { status: 500, body: JSON.stringify({ error: 'Failed to get blog post' }) };
  }
}

async function refreshBlogIndex(env: Env) {
  try {
    // List all .md files in /blog/
    const list = await env.R2_BUCKET.list({ prefix: 'blog/', delimiter: '/' });
    const mdFiles = list.objects
      .filter(obj => obj.key.endsWith('.md') && obj.key !== 'blog/blog-index.json')
      .sort((a, b) => a.key.localeCompare(b.key));
    
    const posts: BlogPost[] = [];
    let lastNumber = 0;
    
    for (const file of mdFiles) {
      const postId = file.key.replace('blog/', '').replace('.md', '');
      const postNumber = parseInt(postId);
      
      if (!isNaN(postNumber)) {
        lastNumber = Math.max(lastNumber, postNumber);
      }
      
      try {
        const postObj = await env.R2_BUCKET.get(file.key);
        if (postObj) {
          const content = await postObj.text();
          const { metadata } = parseFrontmatter(content);
          
          // Find related images
          const images = await findPostImages(postId, env);
          
          posts.push({
            id: postId,
            fileName: file.key,
            images,
            title: metadata.title || `Post ${postId}`,
            date: metadata.date || file.uploaded?.toISOString() || new Date().toISOString(),
            excerpt: metadata.excerpt || metadata.description || ''
          });
        }
      } catch (error) {
        console.error(`Error processing post ${postId}:`, error);
      }
    }
    
    const newIndex: BlogIndex = {
      posts: posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
      lastNumber,
      lastUpdated: new Date().toISOString()
    };
    
    await env.R2_BUCKET.put('blog/blog-index.json', JSON.stringify(newIndex, null, 2));
    
    return { status: 200, body: JSON.stringify(newIndex) };
  } catch (error) {
    console.error('Error refreshing blog index:', error);
    return { status: 500, body: JSON.stringify({ error: 'Failed to refresh blog index' }) };
  }
}

async function uploadBlogPost(request: Request, env: Env) {
  try {
    const formData = await request.formData();
    const content = formData.get('content') as string;
    const title = formData.get('title') as string;
    const excerpt = formData.get('excerpt') as string;
    
    if (!content || !title) {
      return { status: 400, body: JSON.stringify({ error: 'Content and title are required' }) };
    }
    
    // Get current index to determine next number
    const indexResponse = await getBlogIndex(env);
    const index: BlogIndex = JSON.parse(indexResponse.body);
    const nextNumber = index.lastNumber + 1;
    const postId = nextNumber.toString().padStart(3, '0');
    
    // Create frontmatter
    const frontmatter = `---
title: "${title}"
date: "${new Date().toISOString().split('T')[0]}"
excerpt: "${excerpt || ''}"
---

${content}`;
    
    // Upload the markdown file
    await env.R2_BUCKET.put(`blog/${postId}.md`, frontmatter);
    
    // Refresh index
    await refreshBlogIndex(env);
    
    return { 
      status: 201, 
      body: JSON.stringify({ 
        success: true, 
        postId, 
        message: `Post ${postId} created successfully` 
      }) 
    };
  } catch (error) {
    console.error('Error uploading blog post:', error);
    return { status: 500, body: JSON.stringify({ error: 'Failed to upload blog post' }) };
  }
}

async function updateBlogPost(postId: string, request: Request, env: Env) {
  try {
    const data = await request.json() as { title: string; content: string; excerpt?: string };
    const { title, content, excerpt } = data;
    
    // Get existing post
    const existingPost = await env.R2_BUCKET.get(`blog/${postId}.md`);
    if (!existingPost) {
      return { status: 404, body: JSON.stringify({ error: 'Post not found' }) };
    }
    
    const existingContent = await existingPost.text();
    const { metadata: existingMetadata } = parseFrontmatter(existingContent);
    
    // Update frontmatter
    const updatedFrontmatter = `---
title: "${title || existingMetadata.title}"
date: "${existingMetadata.date}"
excerpt: "${excerpt || existingMetadata.excerpt || ''}"
updated: "${new Date().toISOString().split('T')[0]}"
---

${content || existingContent.split('---')[2]?.trim() || ''}`;
    
    // Upload updated file
    await env.R2_BUCKET.put(`blog/${postId}.md`, updatedFrontmatter);
    
    // Refresh index
    await refreshBlogIndex(env);
    
    return { 
      status: 200, 
      body: JSON.stringify({ 
        success: true, 
        message: `Post ${postId} updated successfully` 
      }) 
    };
  } catch (error) {
    console.error('Error updating blog post:', error);
    return { status: 500, body: JSON.stringify({ error: 'Failed to update blog post' }) };
  }
}

async function deleteBlogPost(postId: string, env: Env) {
  try {
    // Delete the markdown file
    await env.R2_BUCKET.delete(`blog/${postId}.md`);
    
    // Delete related images
    const images = await findPostImages(postId, env);
    for (const image of images) {
      await env.R2_BUCKET.delete(`blog/images/${image}`);
    }
    
    // Refresh index
    await refreshBlogIndex(env);
    
    return { 
      status: 200, 
      body: JSON.stringify({ 
        success: true, 
        message: `Post ${postId} deleted successfully` 
      }) 
    };
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return { status: 500, body: JSON.stringify({ error: 'Failed to delete blog post' }) };
  }
}

async function uploadImage(request: Request, env: Env) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File | null;
    const postId = formData.get('postId') as string | null;
    const imageName = formData.get('imageName') as string | null;
    
    if (!imageFile || !postId) {
      return { status: 400, body: JSON.stringify({ error: 'Image file and postId are required' }) };
    }
    
    // Generate image name if not provided
    let finalImageName = imageName;
    if (!finalImageName) {
      const extension = imageFile.name.split('.').pop() || 'jpg';
      const imageNumber = await getNextImageNumber(postId, env);
      finalImageName = `${postId}-${imageNumber}.${extension}`;
    }
    
    // Upload image to R2
    const imageBuffer = await imageFile.arrayBuffer();
    await env.R2_BUCKET.put(`blog/images/${finalImageName}`, imageBuffer, {
      httpMetadata: {
        contentType: imageFile.type || 'image/jpeg'
      }
    });
    
    return { 
      status: 200, 
      body: JSON.stringify({ 
        success: true, 
        imageName: finalImageName,
        imageUrl: `https://mybonzo-blog-worker.stolarnia-ams.workers.dev/blog/images/${finalImageName}`,
        message: `Image ${finalImageName} uploaded successfully` 
      }) 
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return { status: 500, body: JSON.stringify({ error: 'Failed to upload image' }) };
  }
}

async function getNextImageNumber(postId: string, env: Env): Promise<number> {
  try {
    const images = await findPostImages(postId, env);
    if (images.length === 0) return 1;
    
    const numbers = images
      .map(img => {
        const match = img.match(new RegExp(`^${postId}-(\\d+)\\.`));
        return match ? parseInt(match[1]) : 0;
      })
      .filter(num => num > 0);
    
    return numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  } catch (error) {
    console.error('Error getting next image number:', error);
    return 1;
  }
}

async function serveFromR2(path: string, env: Env) {
  try {
    const key = path.startsWith('/') ? path.substring(1) : path;
    const obj = await env.R2_BUCKET.get(key);
    
    if (!obj) {
      return { status: 404, body: 'File not found', headers: {} };
    }
    
    const headers: { [key: string]: string } = {};
    
    // Set content type based on file extension
    if (key.endsWith('.jpg') || key.endsWith('.jpeg')) {
      headers['Content-Type'] = 'image/jpeg';
    } else if (key.endsWith('.png')) {
      headers['Content-Type'] = 'image/png';
    } else if (key.endsWith('.webp')) {
      headers['Content-Type'] = 'image/webp';
    } else if (key.endsWith('.md')) {
      headers['Content-Type'] = 'text/markdown';
    } else if (key.endsWith('.json')) {
      headers['Content-Type'] = 'application/json';
    }
    
    // Cache for 1 hour
    headers['Cache-Control'] = 'public, max-age=3600';
    
    return { 
      status: 200, 
      body: obj.body, 
      headers 
    };
  } catch (error) {
    console.error('Error serving from R2:', error);
    return { status: 500, body: 'Internal Server Error', headers: {} };
  }
}

async function processImageTags(content: string, postId: string, env: Env): Promise<string> {
  // Replace [[001-1.jpg]] tags with proper image URLs
  const imageTagRegex = /\[\[([^\]]+\.(jpg|jpeg|png|webp|gif))\]\]/gi;
  
  return content.replace(imageTagRegex, (match, imageName) => {
    // Ensure image name matches post ID pattern
    if (!imageName.startsWith(postId)) {
      imageName = `${postId}-${imageName}`;
    }
    
    return `![Image](https://your-worker-domain.com/blog/images/${imageName})`;
  });
}

async function findPostImages(postId: string, env: Env): Promise<string[]> {
  try {
    const list = await env.R2_BUCKET.list({ prefix: 'blog/images/' });
    const postImages = list.objects
      .filter(obj => {
        const fileName = obj.key.split('/').pop() || '';
        return fileName.startsWith(`${postId}-`) && 
               /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName);
      })
      .map(obj => obj.key.split('/').pop() || '');
    
    return postImages;
  } catch (error) {
    console.error('Error finding post images:', error);
    return [];
  }
}

function parseFrontmatter(content: string): { metadata: any; body: string } {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { metadata: {}, body: content };
  }
  
  const frontmatterText = match[1];
  const body = match[2];
  
  // Simple YAML parsing (basic implementation)
  const metadata: any = {};
  const lines = frontmatterText.split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.substring(0, colonIndex).trim();
      let value = line.substring(colonIndex + 1).trim();
      
      // Remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      
      metadata[key] = value;
    }
  }
  
  return { metadata, body };
}