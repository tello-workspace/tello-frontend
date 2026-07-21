// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/, '');

let socket: Socket | null = null;

// Backend'e tek bir soket baglantisi kurar (token degismedigi surece tekrar kullanilir)
export function getSocket(): Socket | null {
  if (typeof window === 'undefined') return null;

  const token = localStorage.getItem('token');
  if (!token) return null;

  if (socket && socket.connected) return socket;

  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token },
      autoConnect: false,
    });
  }

  if (!socket.connected) {
    socket.auth = { token };
    socket.connect();
  }

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
