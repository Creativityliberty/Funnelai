export interface Project {
  id: string;
  name: string;
  date: string;
  request: string;
  result: any;
  heroImage?: string;
  templateId?: string;
}

export type GeneratorStep = 
  | 'template-selection' 
  | 'customize' 
  | 'input' 
  | 'review' 
  | 'generating' 
  | 'result';

export type AppView = 
  | 'generator' 
  | 'tunnels' 
  | 'dashboard' 
  | 'settings' 
  | 'integrations';

export type AgentExecutionStatus = 'idle' | 'running' | 'done';
