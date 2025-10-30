import type { APIRoute } from 'astro';

interface ContainerRequest {
  action: string;
  target: 'docker' | 'kubernetes' | 'k8s';
  params: any;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // Prostszy test bez ContainerAgent na razie
    const { action, target = 'docker', params }: ContainerRequest = await request.json();
    
    // Mock response dla testów
    const mockContainers = [
      {
        Id: 'b580a686f5ef',
        Names: ['/postgres'],
        Image: 'postgres:14.4',
        State: 'running',
        Status: 'Up 37 minutes',
        Ports: [{ PrivatePort: 5432, Type: 'tcp' }],
        Created: Math.floor(Date.now() / 1000) - (2 * 30 * 24 * 60 * 60)
      },
      {
        Id: '37b74743b0d8',
        Names: ['/redis'], 
        Image: 'redis:7.0.7',
        State: 'running',
        Status: 'Up 37 minutes',
        Ports: [{ PrivatePort: 6379, Type: 'tcp' }],
        Created: Math.floor(Date.now() / 1000) - (2 * 30 * 24 * 60 * 60)
      }
    ];
    
    // Symulacja różnych akcji
    let result;
    switch (action) {
      case 'list':
        result = mockContainers;
        break;
      case 'start':
      case 'stop':
        result = { success: true, status: 204, message: `Container ${action}ed (simulated)` };
        break;
      case 'logs':
        result = { logs: `[INFO] Container ${params.id} logs (simulated)`, container: params.id };
        break;
      default:
        throw new Error(`Nieobsługiwana akcja: ${action}`);
    }
    
    // Mock AI analysis dla list action
    if (action === 'list') {
      const analysis = {
        healthScore: 100,
        recommendations: [
          'Wszystkie kontenery działają poprawnie',
          'System jest stabilny - brak akcji wymaganych'
        ],
        aiAnalysis: 'Kontenery PostgreSQL i Redis działają bez problemów. Uptime jest dobry.',
        containers: result
      };
      
      return new Response(JSON.stringify({
        success: true,
        data: result,
        analysis: analysis
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: result
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const GET: APIRoute = async ({ url }) => {
  try {
    const action = url.searchParams.get('action') || 'list';
    
    // Prostka lista kontenerów dla GET
    if (action === 'list') {
      const containers = [
        { id: 'b580a686f5ef', name: 'postgres', status: 'running' },
        { id: '37b74743b0d8', name: 'redis', status: 'running' }
      ];
      
      return new Response(JSON.stringify({
        success: true,
        containers: containers
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      success: true,
      action: action,
      message: 'GET endpoint works'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};