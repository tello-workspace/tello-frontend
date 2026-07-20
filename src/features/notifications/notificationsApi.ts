import { api } from '@/lib/api';

export interface Notification {
  id: string;
  userId: string;
  cardId: string | null;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
  card: { id: string; title: string } | null;
}

interface ApiEnvelope<T> {
  success: boolean;
  data: T;
}

export const notificationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<Notification[], void>({
      query: () => '/notifications',
      transformResponse: (response: ApiEnvelope<Notification[]>) => response.data,
      providesTags: ['Notification'],
    }),
    getUnreadCount: builder.query<number, void>({
      query: () => '/notifications/unread-count',
      transformResponse: (response: ApiEnvelope<{ count: number }>) => response.data.count,
      providesTags: ['Notification'],
    }),
    markAsRead: builder.mutation<void, string>({
      query: (id) => ({
        url: `/notifications/${id}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
    markAllAsRead: builder.mutation<void, void>({
      query: () => ({
        url: '/notifications/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationsApi;
