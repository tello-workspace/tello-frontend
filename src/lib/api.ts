import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { BaseQueryApi } from '@reduxjs/toolkit/query'

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) headers.set('Authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithLogout = async (args: unknown, api: BaseQueryApi, extraOptions: unknown) => {
  const result = await baseQuery(args, api, extraOptions)

  // 401 → token geçersiz/süresi dolmuş → logout + full reload (store sıfırlanır)
  if (result.error && 'status' in result.error && result.error.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
  }

  return result
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLogout,
  tagTypes: ['Project', 'Card', 'Notification', 'Insight'],
  endpoints: () => ({}),
})
