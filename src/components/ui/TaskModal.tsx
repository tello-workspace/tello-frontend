// src/components/ui/TaskModal.tsx (veya ilgili modal dosyan)
'use client';

import React, { useState, useEffect } from 'react';
import { Task } from '@/features/board/services/boardService';

interface Member {
  id: string;
  name: string;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
  fetchTaskDetails: (id: string) => Promise<Task>;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  organizationId?: string; // Organizasyon ID'si bileşene prop olarak gelmeli veya projenin yapısına göre çekilmeli
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskId,
  fetchTaskDetails,
  onUpdateTask,
  onDeleteTask,
}) => {
  const [task, setTask] = useState<Task | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && taskId) {
      setLoading(true);
      fetchTaskDetails(taskId)
        .then((data) => setTask(data))
        .catch((err) => console.error("Görev detayları alınamadı:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, taskId, fetchTaskDetails]);

  // Organizasyon üyelerini çekme (Örnek endpoint yapısı)
  useEffect(() => {
    if (isOpen) {
      fetch('/organizations/current/members') // Kendi organizationsApi yapına göre burayı güncelleyebilirsin
        .then((res) => res.json())
        .then((data) => setMembers(data))
        .catch((err) => console.error("Üyeler yüklenemedi:", err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!task) return;
    const { name, value } = e.target;
    setTask({ ...task, [name]: value === "" ? null : value });
  };

  const handleSave = () => {
    if (task) {
      onUpdateTask(task);
      onClose();
    }
  };

  if (loading || !task) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl text-zinc-900">
        <h2 className="text-xl font-bold mb-4">Görevi Düzenle</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Görev Başlığı</label>
            <input
              type="text"
              name="title"
              value={task.title}
              onChange={handleChange}
              className="mt-1 w-full border border-zinc-300 rounded-md p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Açıklama</label>
            <textarea
              name="description"
              value={task.description || ''}
              onChange={handleChange}
              className="mt-1 w-full border border-zinc-300 rounded-md p-2 text-sm"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Son Teslim Tarihi</label>
            <input
              type="date"
              name="dueDate"
              value={task.dueDate ? task.dueDate.split('T')[0] : ''}
              onChange={handleChange}
              className="mt-1 w-full border border-zinc-300 rounded-md p-2 text-sm"
            />
          </div>

          {/* Gerçek Üyelerin Listelendiği Dropdown */}
          <div>
            <label className="block text-sm font-medium text-zinc-700">Atanan Kişi</label>
            <select
              name="assigneeId"
              value={task.assigneeId || ''}
              onChange={handleChange}
              className="mt-1 w-full border border-zinc-300 rounded-md p-2 text-sm bg-white"
            >
              <option value="">Atanmamış</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => {
              onDeleteTask(task.id);
              onClose();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
          >
            Görevi Sil
          </button>
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-zinc-200 text-zinc-700 rounded-md text-sm hover:bg-zinc-300"
            >
              İptal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};