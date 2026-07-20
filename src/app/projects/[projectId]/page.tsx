'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ProjectBoard } from '@/features/board/components/ProjectBoard';

export default function ProjectDetailPage() {
  const params = useParams();

  // URL'deki [projectId] dinamik parametresini güvenli bir şekilde alıyoruz
  const projectId = (params?.projectId as string) || 'default-project';

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Proje Panosu
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Aktif Proje ID: <span className="font-mono text-blue-500">{projectId}</span>
          </p>
        </div>

        {/* Kanban Board Bileşeni */}
        <ProjectBoard projectId={projectId} />
      </div>
    </main>
  );
}
