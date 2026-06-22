export type AiMessageRole = 'user' | 'ai';

export type AiUiMessage = {
  id: string;
  role: AiMessageRole;
  text: string;
  time: string;
  attachment?: string;
  replyTo?: {
    role: AiMessageRole;
    text: string;
  };
};

export type AiHistoryListItem = {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

type ApiHistoryMessage = {
  id: string;
  role: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type AiHistoryDetail = AiHistoryListItem & {
  messages: ApiHistoryMessage[];
};

export type AiChatResponse = {
  success: boolean;
  chatHistoryId?: string;
  type?: 'prediction_answer' | 'general_counselling_answer' | string;
  intent?: string;
  extracted?: Record<string, unknown>;
  summary?: Record<string, unknown>;
  data?: unknown[];
  answer?: string;
};

const API_BASE = resolveApiBase();

function resolveApiBase() {
  const raw = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
  const trimmed = raw.replace(/\/$/, '');
  return trimmed.endsWith('/api') ? trimmed : `${trimmed}/api`;
}

function timeFromDate(value?: string) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

async function readJson(response: Response) {
  return response.json().catch(() => ({}));
}

async function aiRequest<T>(path: string, token: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      Authorization: `Bearer ${token}`,
      ...init?.headers,
    },
  });
  const data = await readJson(response);

  if (!response.ok) {
    throw new Error((data as { message?: string }).message || `AI request failed (${response.status})`);
  }

  return data as T;
}

export function mapApiMessages(messages: ApiHistoryMessage[]): AiUiMessage[] {
  return messages.map(message => ({
    id: message.id,
    role: message.role === 'user' ? 'user' : 'ai',
    text: message.content,
    time: timeFromDate(message.createdAt),
  }));
}

export async function getAiHistories(token: string) {
  return aiRequest<AiHistoryListItem[]>('/ai/history', token, { method: 'GET' });
}

export async function getAiHistory(token: string, historyId: string) {
  return aiRequest<AiHistoryDetail>(`/ai/history/${historyId}`, token, { method: 'GET' });
}

export async function deleteAiHistory(token: string, historyId: string) {
  return aiRequest<{ success: boolean; message: string }>(`/ai/history/${historyId}`, token, { method: 'DELETE' });
}

export async function sendAiMessage(token: string, body: { message: string; chatHistoryId?: string }) {
  return aiRequest<AiChatResponse>('/ai/chat', token, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
