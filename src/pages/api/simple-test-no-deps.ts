import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ locals }) => {
  try {
    const runtime = (locals as any)?.runtime;
    const env = runtime?.env;
    
    console.log('🧪 Simple test bez product-manager - start');

    // Mock response bez ProductManager żeby sprawdzić czy problem jest tam
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Simple test bez ProductManager - działa!',
        mockStats: {
          totalProducts: 2130,
          categories: 68,
          avgPrice: 1020,
          priceRange: { min: 50, max: 15000 }
        },
        mockCategories: [
          'Biurka', 'Krzesła', 'Szafy', 'Stoły', 'Łóżka',
          'Komody', 'Regały', 'Fotele', 'Sofy', 'Szafki'
        ],
        debug: {
          nodeEnv: process?.env?.NODE_ENV,
          hasDB: !!env?.DB,
          hasAI: !!env?.AI,
          hasVectorize: !!env?.VECTORIZE_INDEX,
          timestamp: Date.now()
        }
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('❌ Simple test error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};