export interface Server {
  id: string;
  url: string;
  name: string;
  token?: string;
}

export interface PairingResponse {
  paired: boolean;
  token: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface WsMessage {
  type: 'message' | 'chunk' | 'tool_call' | 'tool_result' | 'done' | 'error';
  content?: string;
  name?: string;
  args?: Record<string, unknown>;
  output?: string;
  full_response?: string;
  message?: string;
}

export interface ChatCompletionRequest {
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
}

export interface ChatCompletionResponse {
  id: string;
  choices: { message: { role: string; content: string } }[];
}

export interface SystemStatus {
  provider: string;
  model: string;
  uptime: number;
  channels: string[];
  health: 'healthy' | 'degraded' | 'unhealthy';
}

export interface Tool {
  name: string;
  description: string;
  enabled: boolean;
}

export interface MemoryEntry {
  id: string;
  content: string;
  category: 'core' | 'daily' | 'conversation';
  timestamp: number;
}

export interface CostSummary {
  session: { usd: number; tokens: number };
  daily: { usd: number; tokens: number };
  monthly: { usd: number; tokens: number };
}

export interface CronJob {
  id: string;
  expression: string;
  command: string;
  nextRun: number;
  enabled: boolean;
}

export interface Config {
  [key: string]: string | number | boolean;
}

export interface HealthCheck {
  [component: string]: 'healthy' | 'degraded' | 'unhealthy';
}

export interface SSEEvent {
  type: 'llm_request' | 'tool_call' | 'agent_start' | 'agent_end' | 'error';
  data: Record<string, unknown>;
  timestamp: number;
}
