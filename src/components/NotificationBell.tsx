'use client';

import { Popover } from '@headlessui/react';
import { BellIcon } from '@heroicons/react/24/outline';
import {
  useGetNotificationsQuery,
  useGetUnreadCountQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} from '@/features/notifications/notificationsApi';

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'az önce';
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

export default function NotificationBell() {
  const { data: unreadCount = 0 } = useGetUnreadCountQuery(undefined, { pollingInterval: 30000 });
  const { data: notifications = [] } = useGetNotificationsQuery();
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  return (
    <Popover className="relative">
      <Popover.Button className="relative p-2 rounded-full hover:bg-slate-100 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
        <BellIcon className="h-5 w-5 text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-semibold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </Popover.Button>

      <Popover.Panel className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white rounded-lg shadow-xl border border-slate-200 z-50">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
          <span className="text-sm font-semibold text-slate-800">Bildirimler</span>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              className="text-xs text-indigo-600 hover:underline"
            >
              Tümünü okundu işaretle
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <p className="px-4 py-6 text-sm text-slate-400 text-center">Henüz bildirim yok.</p>
        ) : (
          <ul>
            {notifications.map((n) => (
              <li
                key={n.id}
                onClick={() => !n.read && markAsRead(n.id)}
                className={`px-4 py-3 text-sm border-b border-slate-50 last:border-0 cursor-pointer hover:bg-slate-50 transition ${
                  n.read ? 'text-slate-500' : 'text-slate-800 bg-indigo-50/40'
                }`}
              >
                <div className="flex items-start gap-2">
                  {!n.read && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />}
                  <div>
                    <p className={n.read ? '' : 'font-medium'}>{n.message}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Popover.Panel>
    </Popover>
  );
}
