import { api } from '@/lib/api';

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  success: boolean;
  data: { reply: string };
}

export const aiApi = api.injectEndpoints({
  endpoints: (builder) => ({
    sendAiMessage: builder.mutation<string, { projectId: string; messages: ChatMessage[] }>({
      query: ({ projectId, messages }) => ({
        url: '/ai/chat',
        method: 'POST',
        body: { projectId, messages },
      }),
      transformResponse: (response: ChatResponse) => response.data.reply,
    }),
  }),
});

export const { useSendAiMessageMutation } = aiApi;
