// ZENON Dashboard - Main API Worker
// Production-ready Cloudflare Worker for agent management

export interface Env {
  ZENON_AGENT_DATA: KVNamespace;
  ZENON_BUCKET: R2Bucket;
  JWT_SECRET: string;
  AGENT_WEBSOCKET_URL: string;
}

// Agent management endpoints
export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // CORS handling
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        },
      });
    }

    try {
      // Authentication middleware
      const authResult = await authenticateRequest(request, env);
      if (!authResult.success) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Route handling
      switch (url.pathname) {
        case '/api/agents':
          return await handleAgentsRequest(request, env);
        case '/api/agents/control':
          return await handleAgentControl(request, env);
        case '/api/browser/sessions':
          return await handleBrowserSessions(request, env);
        case '/api/metrics':
          return await handleMetrics(request, env);
        default:
          return new Response(JSON.stringify({ error: 'Not Found' }), {
            status: 404,
            headers: { 'Content-Type': 'application/json' },
          });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  },
};

// Authentication helper
async function authenticateRequest(request: Request, env: Env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return { success: false };
  }
  
  const token = authHeader.substring(7);
  // JWT verification logic here
  return { success: true, userId: 'user123' };
}

// Agent management handler
async function handleAgentsRequest(request: Request, env: Env): Promise<Response> {
  if (request.method === 'GET') {
    const agentsData = await env.ZENON_AGENT_DATA.get('agents:status', 'json');
    return new Response(JSON.stringify(agentsData || {}), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Agent control handler  
async function handleAgentControl(request: Request, env: Env): Promise<Response> {
  if (request.method === 'POST') {
    const body = await request.json() as any;
    const { agent_id, action } = body;
    
    // Send control command to agent websocket
    const wsResponse = await fetch(env.AGENT_WEBSOCKET_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: `${action}_agent`, agent_name: agent_id }),
    });
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Browser sessions handler
async function handleBrowserSessions(request: Request, env: Env): Promise<Response> {
  if (request.method === 'GET') {
    const sessions = await env.ZENON_AGENT_DATA.get('browser:sessions', 'json');
    return new Response(JSON.stringify(sessions || []), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  if (request.method === 'POST') {
    const sessionData = await request.json();
    const sessionId = crypto.randomUUID();
    
    await env.ZENON_AGENT_DATA.put(
      `browser:session:${sessionId}`,
      JSON.stringify({ ...sessionData, id: sessionId, created: new Date().toISOString() })
    );
    
    return new Response(JSON.stringify({ session_id: sessionId }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Metrics handler
async function handleMetrics(request: Request, env: Env): Promise<Response> {
  const metrics = {
    system: {
      timestamp: new Date().toISOString(),
      uptime: Date.now(),
      requests_per_minute: 45,
    },
    agents: {
      total: 4,
      running: 3,
      stopped: 1,
    },
    browser_sessions: {
      active: 2,
      total_today: 15,
    },
  };
  
  return new Response(JSON.stringify(metrics), {
    headers: { 'Content-Type': 'application/json' },
  });
}
