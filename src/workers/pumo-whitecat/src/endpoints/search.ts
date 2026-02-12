
import { SearchService } from '../services/search-service';
import type { Env } from '../types';

export async function handleSearchAPI(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    // CORS Headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }

    try {
        let searchQuery: any;
        try {
            searchQuery = await request.json();
        } catch (e) {
            return new Response(JSON.stringify({ success: false, error: 'Invalid JSON body' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        if (!searchQuery || !searchQuery.query) {
            return new Response(JSON.stringify({ success: false, error: 'Missing query parameter' }), {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const searchService = new SearchService(env);
        const results = await searchService.search(searchQuery);

        return new Response(JSON.stringify({
            success: true,
            data: results,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('Search API error:', error);
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
}
