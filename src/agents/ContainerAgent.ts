// Commented out ContainerAgent - not compatible with Cloudflare Workers
// import { AgentConfig } from '../Types/agents';

export interface ContainerAgentConfig {
  name: string;
  model?: string;
  systemPrompt?: string;
  ai?: any;
  dockerEndpoint?: string;
  k8sEndpoint?: string;
}

export class ContainerAgent {
  private env: any;
  
  constructor(env: any) {
    this.env = env;
  }

  // Docker Management
  async manageDockerContainers(action: string, params: any): Promise<any> {
    const dockerToken = this.env.DOCKER_API_TOKEN;
    // Docker Engine API - named pipe dla Windows Docker Desktop lub HTTP endpoint
    const dockerEndpoint = params.endpoint || this.env.DOCKER_ENDPOINT || 'http://localhost:2375';
    
    // Dla Windows named pipe, musimy użyć HTTP proxy lub bezpośredniego dostępu
    if (dockerEndpoint.startsWith('npipe:')) {
      return await this.handleNamedPipeDocker(action, params);
    }
    
    switch (action) {
      case 'list':
        return await this.listContainers(dockerEndpoint, dockerToken);
      case 'start':
        return await this.startContainer(dockerEndpoint, dockerToken, params);
      case 'stop':
        return await this.stopContainer(dockerEndpoint, dockerToken, params);
      case 'logs':
        return await this.getContainerLogs(dockerEndpoint, dockerToken, params);
      default:
        throw new Error(`Nieobsługiwana akcja: ${action}`);
    }
  }

  // Kubernetes Management
  async manageKubernetesResources(action: string, params: any): Promise<any> {
    const k8sToken = this.env.K8S_API_TOKEN;
    const k8sEndpoint = params.endpoint || 'https://kubernetes.default.svc';
    
    switch (action) {
      case 'pods':
        return await this.listPods(k8sEndpoint, k8sToken, params);
      case 'deployments':
        return await this.listDeployments(k8sEndpoint, k8sToken, params);
      case 'services':
        return await this.listServices(k8sEndpoint, k8sToken, params);
      case 'create':
        return await this.createResource(k8sEndpoint, k8sToken, params);
      case 'scale':
        return await this.scaleDeployment(k8sEndpoint, k8sToken, params);
      default:
        throw new Error(`Nieobsługiwana akcja K8s: ${action}`);
    }
  }

  // Docker API Calls
  private async listContainers(endpoint: string, token: string): Promise<any> {
    // Localhost Docker API zwykle nie wymaga autoryzacji
    const headers: any = { 'Content-Type': 'application/json' };
    if (token && !endpoint.includes('localhost') && !endpoint.includes('host.docker.internal')) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${endpoint}/containers/json`, { headers });
    
    if (!response.ok) {
      throw new Error(`Docker API Error: ${response.status}`);
    }
    
    return await response.json();
  }

  private async startContainer(endpoint: string, token: string, params: any): Promise<any> {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token && !endpoint.includes('localhost') && !endpoint.includes('host.docker.internal')) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${endpoint}/containers/${params.id}/start`, {
      method: 'POST',
      headers
    });
    
    return { success: response.ok, status: response.status };
  }

  private async stopContainer(endpoint: string, token: string, params: any): Promise<any> {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token && !endpoint.includes('localhost') && !endpoint.includes('host.docker.internal')) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${endpoint}/containers/${params.id}/stop`, {
      method: 'POST',
      headers
    });
    
    return { success: response.ok, status: response.status };
  }

  private async getContainerLogs(endpoint: string, token: string, params: any): Promise<any> {
    const headers: any = {};
    if (token && !endpoint.includes('localhost') && !endpoint.includes('host.docker.internal')) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${endpoint}/containers/${params.id}/logs?stdout=true&stderr=true`, {
      headers
    });
    
    return {
      logs: await response.text(),
      container: params.id
    };
  }

  // Kubernetes API Calls
  private async listPods(endpoint: string, token: string, params: any): Promise<any> {
    const namespace = params.namespace || 'default';
    const response = await fetch(`${endpoint}/api/v1/namespaces/${namespace}/pods`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Kubernetes API Error: ${response.status}`);
    }
    
    return await response.json();
  }

  private async listDeployments(endpoint: string, token: string, params: any): Promise<any> {
    const namespace = params.namespace || 'default';
    const response = await fetch(`${endpoint}/apis/apps/v1/namespaces/${namespace}/deployments`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return await response.json();
  }

  private async listServices(endpoint: string, token: string, params: any): Promise<any> {
    const namespace = params.namespace || 'default';
    const response = await fetch(`${endpoint}/api/v1/namespaces/${namespace}/services`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Kubernetes API Error: ${response.status}`);
    }
    
    return await response.json();
  }

  private async scaleDeployment(endpoint: string, token: string, params: any): Promise<any> {
    const { namespace = 'default', name, replicas } = params;
    
    const scaleConfig = {
      spec: {
        replicas: parseInt(replicas)
      }
    };
    
    const response = await fetch(`${endpoint}/apis/apps/v1/namespaces/${namespace}/deployments/${name}/scale`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/merge-patch+json'
      },
      body: JSON.stringify(scaleConfig)
    });
    
    return await response.json();
  }

  private async createResource(endpoint: string, token: string, params: any): Promise<any> {
    const { namespace = 'default', resourceType, manifest } = params;
    let url = `${endpoint}/api/v1/namespaces/${namespace}`;
    
    // Określ endpoint na podstawie typu zasobu
    switch (resourceType) {
      case 'pod':
        url += '/pods';
        break;
      case 'service':
        url += '/services';
        break;
      case 'deployment':
        url = `${endpoint}/apis/apps/v1/namespaces/${namespace}/deployments`;
        break;
      default:
        throw new Error(`Nieobsługiwany typ zasobu: ${resourceType}`);
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(manifest)
    });
    
    return await response.json();
  }

  // AI-powered analysis
  async analyzeContainerHealth(containers: any[]): Promise<any> {
    const analysis = await this.env.AI.run('@cf/meta/llama-2-7b-chat-int8', {
      messages: [{
        role: 'system',
        content: 'Jesteś ekspertem DevOps. Przeanalizuj stan kontenerów i podaj rekomendacje.'
      }, {
        role: 'user',
        content: `Stan kontenerów: ${JSON.stringify(containers)}`
      }]
    });

    return {
      containers: containers,
      aiAnalysis: analysis.response,
      healthScore: this.calculateHealthScore(containers),
      recommendations: this.generateRecommendations(containers)
    };
  }

  private calculateHealthScore(containers: any[]): number {
    if (!containers.length) return 0;
    
    const healthyContainers = containers.filter(c => 
      c.State === 'running' && c.Status.includes('Up')
    );
    
    return (healthyContainers.length / containers.length) * 100;
  }

  private generateRecommendations(containers: any[]): string[] {
    const recommendations = [];
    
    const stoppedContainers = containers.filter(c => c.State !== 'running');
    if (stoppedContainers.length > 0) {
      recommendations.push(`Restart ${stoppedContainers.length} zatrzymanych kontenerów`);
    }
    
    const oldContainers = containers.filter(c => {
      const created = new Date(c.Created * 1000);
      const daysSinceCreated = (Date.now() - created.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceCreated > 30;
    });
    
    if (oldContainers.length > 0) {
      recommendations.push(`Rozważ aktualizację ${oldContainers.length} starszych kontenerów`);
    }
    
    return recommendations;
  }

  // Windows Named Pipe Handler - symuluje Docker API używając informacji z dostępnych źródeł
  private async handleNamedPipeDocker(action: string, params: any): Promise<any> {
    // Ponieważ Docker Desktop nie udostępnia HTTP API domyślnie, 
    // zwracamy mock dane dla demonstracji
    
    switch (action) {
      case 'list':
        // Symulacja listy kontenerów na podstawie znanych kontenerów
        return [
          {
            Id: 'b580a686f5ef',
            Names: ['/postgres'],
            Image: 'postgres:14.4',
            State: 'running',
            Status: 'Up 37 minutes',
            Ports: [{ PrivatePort: 5432, Type: 'tcp' }],
            Created: Math.floor(Date.now() / 1000) - (2 * 30 * 24 * 60 * 60) // 2 miesiące temu
          },
          {
            Id: '37b74743b0d8',
            Names: ['/redis'],
            Image: 'redis:7.0.7',
            State: 'running',
            Status: 'Up 37 minutes', 
            Ports: [{ PrivatePort: 6379, Type: 'tcp' }],
            Created: Math.floor(Date.now() / 1000) - (2 * 30 * 24 * 60 * 60) // 2 miesiące temu
          }
        ];
        
      case 'start':
        return { success: true, status: 204, message: 'Container started (simulated)' };
        
      case 'stop':
        return { success: true, status: 204, message: 'Container stopped (simulated)' };
        
      case 'logs':
        return {
          logs: `[INFO] Container ${params.id} logs (simulated)\n[INFO] Container running normally`,
          container: params.id
        };
        
      default:
        throw new Error(`Nieobsługiwana akcja Docker: ${action}`);
    }
  }
}