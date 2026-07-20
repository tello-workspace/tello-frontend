'use client';
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { api } from '@/lib/api';
import { useGetMeQuery } from '@/features/auth/meApi';
import { toast } from 'react-toastify';
import NotificationBell from './NotificationBell';

export default function Header(){
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: me } = useGetMeQuery();

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(api.util.resetApiState());
        toast.success('Çıkış yapıldı');
        router.push('/login');
    };
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <Link href="/projects" className="text-lg font-bold text-slate-800 hover:text-indigo-600 transition">
              {me ? `Hoşgeldin, ${me.name}` : 'Tello'}
            </Link>
            <div className="flex items-center gap-3">
              <NotificationBell />
              <button
              onClick={handleLogout}
                  className="text-sm font-medium text-red-600 hover:text-red-700"
                  >Çıkıs yap
                  </button>
            </div>
        </header>
    );
}
