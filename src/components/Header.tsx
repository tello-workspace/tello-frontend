'use client';
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux';
import { api } from '@/lib/api';
import { useGetMeQuery } from '@/features/auth/meApi';

export default function Header(){
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: me } = useGetMeQuery();

    const handleLogout = () => {
        localStorage.removeItem('token');
        dispatch(api.util.resetApiState());
        router.push('/login');
    };
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <span className='text-lg font-bold text-slate-800'>
              {me ? `Hoşgeldin, ${me.name}` : 'Tello'}
            </span>
            <button
            onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700"
                >Çıkıs yap
                </button>
        </header>
    );
}
