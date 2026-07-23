'use client';

import React, { useState } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { ProjectBoard } from '@/features/board/components/ProjectBoard';
import {
  useGetProjectByIdQuery,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from '@/features/projects/projectsApi';
import { useGetOrganizationByIdQuery } from '@/features/organizations/organizationsApi';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ProjectDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const projectId = params?.projectId as string;
  const orgId = searchParams.get('orgId') ?? '';

  const { data: project } = useGetProjectByIdQuery({ orgId, projectId }, { skip: !orgId });
  const { data: org } = useGetOrganizationByIdQuery({ orgId }, { skip: !orgId });
  const isAdmin = org?.myRole === 'ADMIN';

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const [deleteProject, { isLoading: isDeleting }] = useDeleteProjectMutation();

  const startEditing = () => {
    setName(project?.name ?? '');
    setIsEditing(true);
  };

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId || !name.trim()) return;
    try {
      await updateProject({ orgId, projectId, name: name.trim() }).unwrap();
      toast.success('Proje yeniden adlandırıldı');
      setIsEditing(false);
    } catch (err: any) {
      const errData = err?.data?.error;
      setErrorMsg(typeof errData === 'string' ? errData : errData?.message || 'Güncellenemedi.');
    }
  };

  const handleDelete = async () => {
    if (!orgId) return;
    if (!confirm('Bu projeyi silmek istediğine emin misin? Bu işlem geri alınamaz.')) return;
    try {
      await deleteProject({ orgId, projectId }).unwrap();
      toast.success('Proje silindi');
      router.push('/projects');
    } catch (err: any) {
      const errData = err?.data?.error;
      alert(typeof errData === 'string' ? errData : errData?.message || 'Silinemedi.');
    }
  };

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            {isEditing ? (
              <form onSubmit={handleRename} className="flex items-center gap-2">
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-2xl font-bold h-auto py-1 px-2"
                  autoFocus
                />
                <Button type="submit" disabled={isUpdating} size="sm">Kaydet</Button>
                <Button type="button" variant="ghost" onClick={() => setIsEditing(false)} size="sm">İptal</Button>
              </form>
            ) : (
              <h1 className="text-2xl font-bold text-foreground">
                {project?.name ?? 'Proje Panosu'}
              </h1>
            )}
            {errorMsg && <p className="text-xs text-destructive mt-1">{errorMsg}</p>}
          </div>

          {orgId && isAdmin && !isEditing && (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={startEditing}>
                Yeniden Adlandır
              </Button>
              <Button variant="destructive" size="sm" disabled={isDeleting} onClick={handleDelete}>
                Sil
              </Button>
            </div>
          )}
        </div>

        <ProjectBoard projectId={projectId} orgId={orgId} />
      </div>
    </main>
  );
}
