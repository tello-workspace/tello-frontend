'use client';

import { useGetMyOrganizationsQuery } from '@/features/organizations/organizationsApi';
import Link from 'next/link';
import { useState } from 'react';

export default function ProjectsPage() {
  const { data: orgs, isLoading, error } = useGetMyOrganizationsQuery();
  const [showCreateOrg, setShowCreateOrg] = useState(false);
  const [orgName, setOrgName] = useState('');
  const [orgDesc, setOrgDesc] = useState('');

  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <p className="text-slate-500">Yükleniyor...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <p className="text-red-500">Organizasyonlar yüklenirken hata oluştu.</p>
      </main>
    );
  }

  // Hiç organizasyon yoksa onboarding göster
  if (!orgs || orgs.length === 0) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-slate-800 mb-4">Tello&apos;ya Hoş Geldin!</h1>
          <p className="text-slate-500 mb-8">Başlamak için bir organizasyon oluştur.</p>

          {showCreateOrg ? (
            <form onSubmit={async (e) => {
              e.preventDefault();
              const token = localStorage.getItem('token');
              if (!token) return;

              try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/organizations`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify({ name: orgName, description: orgDesc || undefined }),
                });

                if (res.ok) {
                  setOrgName('');
                  setOrgDesc('');
                  setShowCreateOrg(false);
                  window.location.reload();
                } else {
                  const data = await res.json();
                  alert(data?.error?.message || 'Oluşturulamadı');
                }
              } catch {
                alert('Bir hata oluştu');
              }
            }} className="max-w-md mx-auto space-y-4">
              <input
                type="text"
                placeholder="Organizasyon adı"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-slate-900"
                required
              />
              <input
                type="text"
                placeholder="Açıklama (opsiyonel)"
                value={orgDesc}
                onChange={(e) => setOrgDesc(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 text-slate-900"
              />
              <button
                type="submit"
                className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Oluştur
              </button>
              <button
                type="button"
                onClick={() => setShowCreateOrg(false)}
                className="w-full py-2 text-slate-500 hover:text-slate-700"
              >
                İptal
              </button>
            </form>
          ) : (
            <button
              onClick={() => setShowCreateOrg(true)}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              + Organizasyon Oluştur
            </button>
          )}
        </div>
      </main>
    );
  }

  // Organizasyon varsa ilkinin projelerini göster
  return (
    <main className="max-w-4xl mx-auto p-6">
      <OrgTabs orgs={orgs} />
    </main>
  );
}

function OrgTabs({ orgs }: { orgs: { id: string; name: string; projectCount: number }[] }) {
  const [activeOrgId, setActiveOrgId] = useState(orgs[0]?.id);
  const activeOrg = orgs.find((o) => o.id === activeOrgId) || orgs[0];

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {orgs.map((org) => (
            <button
              key={org.id}
              onClick={() => setActiveOrgId(org.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeOrgId === org.id
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {org.name}
            </button>
          ))}
        </div>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">
          + Yeni Proje
        </button>
      </div>

      <ProjectList orgId={activeOrg.id} />
    </>
  );
}

function ProjectList({ orgId }: { orgId: string }) {
  const { data: projects, isLoading, error } = useGetProjectsQuery({ orgId });

  if (isLoading) return <p className="text-slate-500">Yükleniyor...</p>;
  if (error) return <p className="text-red-500">Projeler yüklenemedi.</p>;
  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500 mb-4">Henüz proje yok.</p>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm">
          + İlk Projeyi Oluştur
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {projects.map((project) => (
        <Link
          key={project.id}
          href={`/projects/${project.id}`}
          className="block p-5 bg-white rounded-lg shadow border border-gray-100 hover:shadow-md transition"
        >
          <h2 className="font-semibold text-slate-800">{project.name}</h2>
          <p className="text-sm text-slate-500 mt-1">{project.description}</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
            <span>{project._count?.columns ?? 0} sütun</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Hook'u projenin kendi api'sinden import et
import { useGetProjectsQuery } from '@/features/projects/projectsApi';