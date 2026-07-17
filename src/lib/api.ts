import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Tek bir base API; her feature kendi endpoint'lerini
// api.injectEndpoints(...) ile buraya ekler. Cache tek merkezde kalır.
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    prepareHeaders: (headers) => {
      // Next.js kodu sunucuda da çalışabildiği için localStorage'a
      // dokunmadan önce tarayıcıda olduğumuzu kontrol ediyoruz
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) headers.set('Authorization', `Bearer ${token}`)
      }
      return headers
    },
  }),
  // Cache invalidation etiketleri: bir mutation 'Project' tag'ini invalidate
  // ederse o tag'i sağlayan query'ler otomatik yeniden çekilir
  tagTypes: ['Project', 'Card', 'Notification', 'Insight'],
  endpoints: () => ({}),
})
