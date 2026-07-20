import { api } from '@/lib/api';

export interface Me {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const meApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<Me, void>({
      query: () => '/auth/me',
      transformResponse: (response: ApiEnvelope<Me>) => response.data,
    }),
  }),
});

export const { useGetMeQuery } = meApi;
