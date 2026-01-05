// Blog API Client for R2 System
// Handles communication between Astro and Cloudflare Worker

export interface R2BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  fileName: string;
  content?: string;
  images: string[];
  updated?: string;
}

export interface R2BlogIndex {
  posts: R2BlogPost[];
  lastNumber: number;
  lastUpdated: string;
}

class BlogAPIClient {
  private baseUrl: string;
  private apiToken?: string;

  constructor(baseUrl: string = 'https://blog-api.mybonzo-ai-blog.pages.dev', apiToken?: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.apiToken = apiToken;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api/blog${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add existing headers if present
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.apiToken) {
      headers['Authorization'] = `Bearer ${this.apiToken}`;
    }

    const config: RequestInit = {
      ...options,
      headers: headers as HeadersInit,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json() as T;
    } catch (error) {
      console.error(`Blog API Error (${endpoint}):`, error);
      throw error;
    }
  }

  /**
   * Get the blog index with all posts metadata
   */
  async getBlogIndex(): Promise<R2BlogIndex> {
    return this.makeRequest<R2BlogIndex>('/index');
  }

  /**
   * Get a specific blog post by ID
   */
  async getBlogPost(postId: string): Promise<R2BlogPost> {
    return this.makeRequest<R2BlogPost>(`/post/${postId}`);
  }

  /**
   * Refresh the blog index (scan R2 for new posts)
   */
  async refreshBlogIndex(): Promise<R2BlogIndex> {
    return this.makeRequest<R2BlogIndex>('/refresh', { method: 'GET' });
  }

  /**
   * Upload a new blog post
   */
  async uploadBlogPost(title: string, content: string, excerpt?: string): Promise<{ success: boolean; postId: string; message: string }> {
    if (!this.apiToken) {
      throw new Error('API token is required for upload operations. Please set BLOG_API_TOKEN environment variable.');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (excerpt) {
      formData.append('excerpt', excerpt);
    }

    const response = await fetch(`${this.baseUrl}/api/blog/upload`, {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${this.apiToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Update an existing blog post
   */
  async updateBlogPost(postId: string, updates: { title?: string; content?: string; excerpt?: string }): Promise<{ success: boolean; message: string }> {
    if (!this.apiToken) {
      throw new Error('API token is required for update operations. Please set BLOG_API_TOKEN environment variable.');
    }

    return this.makeRequest(`/update/${postId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  /**
   * Delete a blog post
   */
  async deleteBlogPost(postId: string): Promise<{ success: boolean; message: string }> {
    if (!this.apiToken) {
      throw new Error('API token is required for delete operations. Please set BLOG_API_TOKEN environment variable.');
    }

    return this.makeRequest(`/delete/${postId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Upload an image for a blog post
   */
  async uploadImage(postId: string, imageFile: File, imageNumber: number = 1): Promise<{ success: boolean; imageUrl: string }> {
    if (!this.apiToken) {
      throw new Error('API token is required for image upload operations. Please set BLOG_API_TOKEN environment variable.');
    }

    const fileExtension = imageFile.name.split('.').pop() || 'jpg';
    const imageName = `${postId}-${imageNumber}.${fileExtension}`;

    const formData = new FormData();
    formData.append('image', imageFile, imageName);
    formData.append('postId', postId);

    const response = await fetch(`${this.baseUrl}/api/blog/upload-image`, {
      method: 'POST',
      body: formData,
      headers: { 'Authorization': `Bearer ${this.apiToken}` },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Image upload failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Get direct URL for blog assets
   */
  getAssetUrl(path: string): string {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${this.baseUrl}/${cleanPath}`;
  }

  /**
   * Get direct URL for blog images
   */
  getImageUrl(imageName: string): string {
    return this.getAssetUrl(`blog/images/${imageName}`);
  }

  /**
   * Process markdown content to convert image tags
   */
  processMarkdownImages(content: string, postId: string): string {
    const imageTagRegex = /\[\[([^\]]+\.(jpg|jpeg|png|webp|gif))\]\]/gi;
    
    return content.replace(imageTagRegex, (match, imageName) => {
      // Ensure image name has post ID prefix
      if (!imageName.startsWith(postId)) {
        imageName = `${postId}-${imageName}`;
      }
      
      const imageUrl = this.getImageUrl(imageName);
      return `![${imageName}](${imageUrl})`;
    });
  }

  /**
   * Extract image references from markdown content
   */
  extractImageReferences(content: string): string[] {
    const imageTagRegex = /\[\[([^\]]+\.(jpg|jpeg|png|webp|gif))\]\]/gi;
    const matches = [];
    let match;
    
    while ((match = imageTagRegex.exec(content)) !== null) {
      matches.push(match[1]);
    }
    
    return matches;
  }

  /**
   * Generate next available post ID
   */
  async getNextPostId(): Promise<string> {
    try {
      const index = await this.getBlogIndex();
      const nextNumber = index.lastNumber + 1;
      return nextNumber.toString().padStart(3, '0');
    } catch (error) {
      console.error('Error getting next post ID:', error);
      // Fallback: use timestamp
      return Date.now().toString();
    }
  }

  /**
   * Validate markdown frontmatter
   */
  validateFrontmatter(content: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
    const match = content.match(frontmatterRegex);
    
    if (!match) {
      errors.push('Missing frontmatter section');
      return { isValid: false, errors };
    }
    
    const frontmatterText = match[1];
    const lines = frontmatterText.split('\n');
    
    let hasTitle = false;
    let hasDate = false;
    
    for (const line of lines) {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        
        if (key === 'title') {
          hasTitle = true;
          if (!value || value === '""' || value === "''") {
            errors.push('Title cannot be empty');
          }
        }
        
        if (key === 'date') {
          hasDate = true;
          if (!value || isNaN(Date.parse(value.replace(/['"]/g, '')))) {
            errors.push('Date must be a valid date format');
          }
        }
      }
    }
    
    if (!hasTitle) {
      errors.push('Missing title in frontmatter');
    }
    
    if (!hasDate) {
      errors.push('Missing date in frontmatter');
    }
    
    return { isValid: errors.length === 0, errors };
  }
}

// Default client instance
// Note: For write operations (upload, update, delete), BLOG_API_TOKEN must be set
const apiUrl = import.meta.env?.PUBLIC_BLOG_API_URL || 'http://localhost:8787';
const apiToken = import.meta.env?.BLOG_API_TOKEN;

// Warn if token is missing in production
if (apiUrl.includes('mybonzo') && !apiToken) {
  console.warn('⚠️ BLOG_API_TOKEN is not set. Write operations will fail. Please configure environment variables.');
}

export const blogAPI = new BlogAPIClient(apiUrl, apiToken);

// Export the class for custom instances
export { BlogAPIClient };

// Helper functions for Astro pages
export async function getAllPosts(): Promise<R2BlogPost[]> {
  try {
    const index = await blogAPI.getBlogIndex();
    return index.posts;
  } catch (error) {
    console.error('Failed to get all posts:', error);
    return [];
  }
}

export async function getPost(postId: string): Promise<R2BlogPost | null> {
  try {
    return await blogAPI.getBlogPost(postId);
  } catch (error) {
    console.error(`Failed to get post ${postId}:`, error);
    return null;
  }
}

export async function getRecentPosts(limit: number = 5): Promise<R2BlogPost[]> {
  try {
    const posts = await getAllPosts();
    return posts.slice(0, limit);
  } catch (error) {
    console.error('Failed to get recent posts:', error);
    return [];
  }
}

export function formatPostDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dateString;
  }
}