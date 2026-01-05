// Types for AI Agents

export interface AgentConfig {
  name: string;
  model?: string;
  systemPrompt?: string;
  ai?: any;
}

export interface Agent {
  config: AgentConfig;
  callLLM(params: any): Promise<any>;
}

export interface ContainerInfo {
  id: string;
  name: string;
  state: string;
  status: string;
  created: number;
  image: string;
}

export interface KubernetesResource {
  metadata: {
    name: string;
    namespace: string;
    createdTimestamp: string;
  };
  status: any;
  spec: any;
}

export interface HealthAnalysis {
  healthScore: number;
  recommendations: string[];
  aiAnalysis: string;
  containers: any[];
}