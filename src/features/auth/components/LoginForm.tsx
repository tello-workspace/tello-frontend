// src/features/auth/components/LoginForm.tsx
"use client";

import React, { useState } from 'react';
import { useLoginMutation } from '../authApi';
import { useRouter } from 'next/navigation';

interface ApiError {
  data?: {
    error?: string;
  };
}

interface LoginResponse {
  data?: { token?: string };
  token?: string;
}

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [login, { isLoading }] = useLoginMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg('');

    try {
      const response = await login({ email, password }).unwrap();

      const resp = response as LoginResponse;
      const token = resp.data?.token ?? resp.token;
      if (token) {
        localStorage.setItem('token', token);
        router.push('/projects');
      } else {
        setErrorMsg('Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
      }
    } catch (err) {
      const apiError = err as ApiError;
      setErrorMsg(apiError?.data?.error || 'Giriş yapılırken bir hata oluştu.');
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Tello&apos;ya Giriş Yap</h2>
      <p className="text-sm text-gray-500 text-center mb-8">Projelerini ve görevlerini yönetmeye hemen başla.</p>

      {errorMsg && (
        <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">E-posta Adresi</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900"
            placeholder="ornek@tello.com"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Şifre</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none transition text-gray-900"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-medium rounded-lg shadow-md transition duration-200 flex justify-center items-center"
        >
          {isLoading ? (
            <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            'Giriş Yap'
          )}
        </button>
      </form>
    </div>
  );
}