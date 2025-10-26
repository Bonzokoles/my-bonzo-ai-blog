#!/usr/bin/env node

/**
 * Migration script to upload blog posts from local MDX files to Cloudflare R2
 * Run with: node migrate-to-r2.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const WORKER_URL = 'https://mybonzo-blog-worker.stolarnia-ams.workers.dev';
const BLOG_DIR = '../src/data/blog';
const IMAGES_DIR = '../src/data/blog/images';

// API endpoints
const UPLOAD_ENDPOINT = `${WORKER_URL}/api/blog/upload`;
const REFRESH_ENDPOINT = `${WORKER_URL}/api/blog/refresh`;

class BlogMigrator {
  constructor() {
    this.blogDir = path.resolve(__dirname, BLOG_DIR);
    this.imagesDir = path.resolve(__dirname, IMAGES_DIR);
    this.postCounter = 1;
  }

  async migrate() {
    console.log('🚀 Starting blog migration to R2...');
    
    try {
      // Read all MDX files
      const mdxFiles = fs.readdirSync(this.blogDir)
        .filter(file => file.endsWith('.mdx'))
        .sort();

      console.log(`📁 Found ${mdxFiles.length} blog posts to migrate`);

      // Upload each post
      for (const file of mdxFiles) {
        await this.uploadPost(file);
        this.postCounter++;
      }

      // Upload images
      await this.uploadImages();

      // Refresh blog index
      await this.refreshIndex();

      console.log('✅ Migration completed successfully!');
    } catch (error) {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    }
  }

  async uploadPost(filename) {
    const filePath = path.join(this.blogDir, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    
    console.log(`📝 Processing: ${filename}`);

    // Parse MDX frontmatter
    const { title, excerpt, date, content: bodyContent } = this.parseMDX(content);
    
    // Convert to numbered format (001, 002, etc.)
    const postId = this.postCounter.toString().padStart(3, '0');
    
    // Prepare markdown content with image tags converted
    const markdownContent = this.convertToMarkdown(bodyContent, postId);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('excerpt', excerpt || '');
      formData.append('content', markdownContent);
      formData.append('date', date || new Date().toISOString().split('T')[0]);

      const response = await this.makeRequest(UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData
      });

      if (response.success) {
        console.log(`✅ Uploaded: ${filename} -> ${postId}.md`);
      } else {
        console.error(`❌ Failed to upload ${filename}:`, response.error);
      }
    } catch (error) {
      console.error(`❌ Error uploading ${filename}:`, error.message);
    }
  }

  async uploadImages() {
    if (!fs.existsSync(this.imagesDir)) {
      console.log('📷 No images directory found, skipping...');
      return;
    }

    const imageFiles = fs.readdirSync(this.imagesDir)
      .filter(file => /\.(jpg|jpeg|png|webp|gif)$/i.test(file));

    console.log(`📷 Found ${imageFiles.length} images to upload`);

    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      const filePath = path.join(this.imagesDir, file);
      
      // Generate numbered image name (001-1.jpg, 001-2.jpg, etc.)
      const postId = Math.floor(i / 3) + 1; // Assuming max 3 images per post
      const imageIndex = (i % 3) + 1;
      const newName = `${postId.toString().padStart(3, '0')}-${imageIndex}${path.extname(file)}`;
      
      try {
        const imageData = fs.readFileSync(filePath);
        
        // Upload to R2 via Worker (you might need to implement image upload endpoint)
        console.log(`📷 Would upload: ${file} -> ${newName}`);
        // TODO: Implement image upload to R2
        
      } catch (error) {
        console.error(`❌ Error uploading image ${file}:`, error.message);
      }
    }
  }

  async refreshIndex() {
    try {
      console.log('🔄 Refreshing blog index...');
      const response = await this.makeRequest(REFRESH_ENDPOINT, {
        method: 'GET'
      });

      if (response.posts) {
        console.log(`✅ Index refreshed: ${response.posts.length} posts indexed`);
      }
    } catch (error) {
      console.error('❌ Error refreshing index:', error.message);
    }
  }

  parseMDX(content) {
    // Simple MDX/Markdown frontmatter parser
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return {
        title: 'Untitled Post',
        excerpt: '',
        date: new Date().toISOString().split('T')[0],
        content: content
      };
    }

    const frontmatter = match[1];
    const body = match[2];

    // Parse YAML-like frontmatter
    const metadata = {};
    frontmatter.split('\n').forEach(line => {
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
    });

    return {
      title: metadata.title || 'Untitled Post',
      excerpt: metadata.excerpt || metadata.description || '',
      date: metadata.date || new Date().toISOString().split('T')[0],
      content: body
    };
  }

  convertToMarkdown(content, postId) {
    // Convert MDX components to Markdown
    let markdown = content;
    
    // Convert image references to numbered format
    // Example: ![alt](./images/logo.webp) -> [[001-1.jpg]]
    markdown = markdown.replace(/!\[([^\]]*)\]\(\.\/images\/([^)]+)\)/g, (match, alt, filename) => {
      const ext = path.extname(filename);
      const imageNumber = this.getImageNumber(filename);
      return `[[${postId}-${imageNumber}${ext}]]`;
    });

    // Remove MDX imports
    markdown = markdown.replace(/^import\s+.*$/gm, '');
    
    // Convert MDX components to HTML/Markdown equivalent
    markdown = markdown.replace(/<([A-Z][A-Za-z0-9]*)[^>]*>(.*?)<\/\1>/gs, (match, tag, content) => {
      switch (tag.toLowerCase()) {
        case 'callout':
          return `> **${content.trim()}**`;
        case 'note':
          return `📝 **Note:** ${content.trim()}`;
        default:
          return content.trim();
      }
    });

    return markdown.trim();
  }

  getImageNumber(filename) {
    // Simple image numbering logic - you can customize this
    const hash = filename.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return Math.abs(hash % 9) + 1; // 1-9
  }

  async makeRequest(url, options = {}) {
    // Simple fetch polyfill for Node.js
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      const req = https.request(requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            resolve(result);
          } catch (error) {
            resolve({ error: 'Invalid JSON response', data });
          }
        });
      });

      req.on('error', reject);

      if (options.body) {
        if (typeof options.body === 'string') {
          req.write(options.body);
        } else {
          req.write(JSON.stringify(options.body));
        }
      }

      req.end();
    });
  }
}

// Run migration
if (require.main === module) {
  const migrator = new BlogMigrator();
  migrator.migrate();
}

module.exports = BlogMigrator;