// API Route: /api/media/delete - usuwanie plików z R2
// POST /api/media/delete

import type { APIRoute } from 'astro';

export const prerender = false;

interface DeleteRequest {
  key: string;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    console.log('🗑️ Media delete request');

    // Parse request body
    let requestData: DeleteRequest;
    try {
      requestData = await request.json();
    } catch (error) {
      console.error('❌ Invalid JSON in request body:', error);
      return new Response(JSON.stringify({
        success: false,
        error: 'Nieprawidłowe dane JSON w żądaniu'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const { key } = requestData;

    if (!key || typeof key !== 'string') {
      console.error('❌ Missing or invalid key parameter');
      return new Response(JSON.stringify({
        success: false,
        error: 'Brak wymaganego parametru "key" lub nieprawidłowy typ'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Sanitize key (prevent path traversal)
    const sanitizedKey = key.replace(/\.\./g, '').replace(/\/+/g, '/');
    if (sanitizedKey !== key) {
      console.error('❌ Invalid key format:', key);
      return new Response(JSON.stringify({
        success: false,
        error: 'Nieprawidłowy format klucza pliku'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

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

    // Check if file exists before deletion
    const existingObject = await MEDIA_BUCKET.head(sanitizedKey);
    if (!existingObject) {
      console.error('❌ File not found:', sanitizedKey);
      return new Response(JSON.stringify({
        success: false,
        error: 'Plik nie został znaleziony'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete the file from R2
    await MEDIA_BUCKET.delete(sanitizedKey);

    console.log(`✅ Successfully deleted file: ${sanitizedKey}`);

    return new Response(JSON.stringify({
      success: true,
      message: 'Plik został pomyślnie usunięty',
      deletedKey: sanitizedKey
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('❌ Error deleting media file:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Nieznany błąd podczas usuwania pliku',
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
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  });
};