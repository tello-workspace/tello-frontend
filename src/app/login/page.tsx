// src/app/login/page.tsx
import LoginForm from "@/features/auth/components/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <LoginForm />
      <p className="mt-4 text-sm text-gray-600">
        Hesabın yok mu?{' '}
        <Link href="/register" className="text-indigo-600 hover:underline">
          Kayıt Ol
        </Link>
      </p>
    </div>
  );
}