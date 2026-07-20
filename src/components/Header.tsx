'use client';
import { useRouter } from 'next/navigation'
import { useDispatch } from 'react-redux';
import { api } from '@/lib/api';
export default function Header(){
    const router = useRouter();
const dispatch = useDispatch();
    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
            <span className='text-lg font-bold text-slate-800'>Tello</span>
            <button
            onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-700"
                >Çıkıs yap
                </button>
            
        </header>
    );
}