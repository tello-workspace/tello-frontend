// src/features/auth/authApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Backend .env dosyasındaki NEXT_PUBLIC_API_URL'den beslenecek
const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;