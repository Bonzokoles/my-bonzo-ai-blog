import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    console.log('🔍 Test API wywołane');
    
    const body = await request.json();
    console.log('📝 Otrzymano body:', body);
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Test API działa!',
      received: body,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
  } catch (error) {
    console.error('❌ Błąd w test API:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Unknown error',
      stack: error.stack
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};