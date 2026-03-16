export type MessageType = 'user' | 'assistant' | 'tool_call';
export type ToolStatus = 'running' | 'completed';
export type ToolCategory = 'db' | 'email' | 'calendar' | 'file';

export interface ChatMessage {
  id: string;
  type: MessageType;
  content?: string;
  toolName?: string;
  toolCategory?: ToolCategory;
  toolStatus?: ToolStatus;
  toolResult?: string;
}

export interface ScenarioStep {
  type: MessageType;
  delay: number;
  content?: string;
  toolName?: string;
  toolResult?: string;
}

export interface ScenarioDefinition {
  id: string;
  label: string;
  trigger: string;
  keywords: string[];
  steps: ScenarioStep[];
}

export function getToolCategory(toolName: string): ToolCategory {
  if (toolName.startsWith('db_')) return 'db';
  if (toolName.startsWith('email_')) return 'email';
  if (toolName.startsWith('calendar_')) return 'calendar';
  if (toolName.startsWith('file_')) return 'file';
  return 'db';
}
