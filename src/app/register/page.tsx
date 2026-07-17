import RegisterForm from '@/features/auth/components/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <RegisterForm />
      <p className="mt-4 text-sm text-gray-600">
        Zaten hesabın var mı?{' '}
        <Link href="/login" className="text-indigo-600 hover:underline">
          Giriş Yap
        </Link>
      </p>
    </div>
  );
}