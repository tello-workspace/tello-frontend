'use client';

import { useParams } from 'next/navigation';
import { useGetProjectsQuery } from '@/features/projects/projectsApi';

export default function BoardPage() {
  const params = useParams();
  const projectId = params?.projectId as string;

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-slate-800">Board</h1>
        <p className="mt-2 text-slate-500">
          Proje: <code className="rounded bg-slate-200 px-1">{projectId}</code> — yakında inşa edilecek.
        </p>
      </div>
    </main>
  );
}
