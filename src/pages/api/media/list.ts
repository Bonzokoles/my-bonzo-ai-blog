// API Route: /api/media/list - lista wszystkich przesłanych plików
// GET /api/media/list

import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    console.log('📋 Media list request');

    // Check if we have Cloudflare runtime access
    if (!locals.runtime?.env) {
      console.error('❌ No Cloudflare runtime access');
      return new Response(JSON.stringify({
        success: false,
        error: 'Brak dostępu do środowiska Cloudflare'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { MEDIA_BUCKET } = locals.runtime.env;

    if (!MEDIA_BUCKET) {
      console.error('❌ MEDIA_BUCKET not configured');
      return new Response(JSON.stringify({
        success: false,
        error: 'Bucket R2 nie jest skonfigurowany'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // List all objects in R2 bucket
    const listResponse = await MEDIA_BUCKET.list();
    
    if (!listResponse.objects) {
      console.log('📁 No objects found in bucket');
      return new Response(JSON.stringify({
        success: true,
        files: [],
        count: 0
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Transform R2 objects to file info
    const files = listResponse.objects.map(obj => {
      // Extract metadata from custom metadata or guess from filename
      const extension = obj.key.split('.').pop()?.toLowerCase() || '';
      let mimeType = 'application/octet-stream';
      
      // Guess MIME type from extension
      const mimeTypes: Record<string, string> = {
        // Images
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'webp': 'image/webp',
        'svg': 'image/svg+xml',
        'bmp': 'image/bmp',
        'ico': 'image/x-icon',
        
        // Video
        'mp4': 'video/mp4',
        'webm': 'video/webm',
        'ogg': 'video/ogg',
        'avi': 'video/avi',
        'mov': 'video/quicktime',
        'wmv': 'video/x-ms-wmv',
        'flv': 'video/x-flv',
        
        // Audio
        'mp3': 'audio/mpeg',
        'wav': 'audio/wav',
        'ogg': 'audio/ogg',
        'flac': 'audio/flac',
        'aac': 'audio/aac',
        'm4a': 'audio/mp4',
        
        // Documents
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'txt': 'text/plain',
        'json': 'application/json',
        'xml': 'application/xml',
        'csv': 'text/csv'
      };
      
      if (extension && mimeTypes[extension]) {
        mimeType = mimeTypes[extension];
      }

      // Use custom metadata if available
      const customMetadata = obj.customMetadata || {};
      if (customMetadata.contentType) {
        mimeType = customMetadata.contentType;
      }

      // Build public URL (assuming we have a custom domain or using R2 public URL)
      const baseUrl = locals.runtime.env.R2_PUBLIC_URL || `https://pub-${locals.runtime.env.CLOUDFLARE_ACCOUNT_ID}.r2.dev`;
      const publicUrl = `${baseUrl}/${obj.key}`;

      return {
        key: obj.key,
        name: obj.key.split('/').pop() || obj.key, // Extract filename from path
        size: obj.size,
        type: mimeType,
        url: publicUrl,
        lastModified: obj.uploaded?.toISOString(),
        uploaded: obj.uploaded?.toISOString(),
        etag: obj.etag,
        metadata: customMetadata
      };
    });

    // Sort by upload date (newest first)
    files.sort((a, b) => {
      const dateA = new Date(a.uploaded || 0);
      const dateB = new Date(b.uploaded || 0);
      return dateB.getTime() - dateA.getTime();
    });

    console.log(`✅ Listed ${files.length} files from R2 bucket`);

    return new Response(JSON.stringify({
      success: true,
      files,
      count: files.length,
      truncated: listResponse.truncated || false,
      cursor: listResponse.cursor || null
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error) {
    console.error('❌ Error listing media files:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Nieznany błąd podczas listowania plików',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// Options for CORS
export const OPTIONS: APIRoute = async () => {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
};