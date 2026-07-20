// src/components/ui/TaskModal.tsx
'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, CalendarDaysIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Task } from '@/features/board/services/boardService';
import { useGetOrganizationByIdQuery } from '@/features/organizations/organizationsApi';

interface TaskModalProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
  orgId: string;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  fetchTaskDetails: (taskId: string) => Promise<Task>;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  taskId,
  isOpen,
  onClose,
  orgId,
  onUpdateTask,
  onDeleteTask,
  fetchTaskDetails,
}) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: org } = useGetOrganizationByIdQuery({ orgId }, { skip: !orgId || !isOpen });
  const members = org?.members ?? [];

  useEffect(() => {
    if (taskId && isOpen) {
      setLoading(true);
      fetchTaskDetails(taskId)
        .then((data) => setTask(data))
        .catch((err) => console.error('Görev detayları yüklenemedi:', err))
        .finally(() => setLoading(false));
    } else if (!isOpen) {
      setTask(null);
    }
  }, [taskId, isOpen, fetchTaskDetails]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!task) return;
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleAssigneeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!task) return;
    const userId = e.target.value;
    const member = members.find((m) => m.userId === userId);
    const displayName = member?.user.name ?? '';
    const avatar = displayName
      ? displayName.split(' ').map((n) => n[0]).join('').toUpperCase()
      : '';
    setTask({
      ...task,
      assigneeId: userId || null,
      assignee: displayName,
      assigneeAvatar: avatar,
    });
  };

  const handleSave = () => {
    if (task) {
      onUpdateTask(task);
      onClose();
    }
  };

  const handleDelete = () => {
    if (task && window.confirm('Bu görevi silmek istediğinizden emin misiniz?')) {
      onDeleteTask(task.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-950 p-6 text-left align-middle shadow-xl transition-all border border-zinc-200 dark:border-zinc-800">
                {loading ? (
                  <div className="text-center py-10 text-zinc-500">Yükleniyor...</div>
                ) : task ? (
                  <>
                    <div className="flex justify-between items-start mb-5">
                      <Dialog.Title as="h3" className="text-lg font-semibold leading-6 text-zinc-900 dark:text-zinc-50 w-full mr-4">
                        <input
                          type="text"
                          name="title"
                          value={task.title}
                          onChange={handleChange}
                          className="w-full bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 rounded px-1 -mx-1"
                          placeholder="Görev Başlığı"
                        />
                      </Dialog.Title>
                      <button
                        type="button"
                        className="rounded-full p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                        onClick={onClose}
                      >
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>

                    <div className="mt-4 space-y-6">
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                          Açıklama
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          rows={5}
                          value={task.description || ''}
                          onChange={handleChange}
                          className="w-full text-sm p-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                          placeholder="Görev için bir açıklama ekleyin..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4 items-center">
                        <div>
                          <label htmlFor="dueDate" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1 flex items-center gap-1.5">
                            <CalendarDaysIcon className="h-4 w-4" />
                            Son Teslim Tarihi
                          </label>
                          <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={task.dueDate || ''}
                            onChange={handleChange}
                            className="w-full text-sm p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label htmlFor="assignee" className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                            Atanan Kişi
                          </label>
                          <select
                            id="assignee"
                            name="assigneeId"
                            value={task.assigneeId || ''}
                            onChange={handleAssigneeChange}
                            className="w-full text-sm p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="">Atanan Yok</option>
                            {members.map((m) => (
                              <option key={m.userId} value={m.userId}>
                                {m.user.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <p className="text-xs text-zinc-500 dark:text-zinc-600 font-mono">
                          ID: {task.id} | Sütun: {task.columnId}
                      </p>
                    </div>

                    <div className="mt-8 flex justify-between items-center pt-4 border-t border-zinc-100 dark:border-zinc-800">
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 transition"
                      >
                        <TrashIcon className="h-4 w-4" />
                        Görevi Sil
                      </button>
                      <div className="flex gap-3">
                          <button
                              type="button"
                              onClick={onClose}
                              className="inline-flex justify-center rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                          >
                              İptal
                          </button>
                          <button
                              type="button"
                              onClick={handleSave}
                              className="inline-flex justify-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                          >
                              Değişiklikleri Kaydet
                          </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10 text-red-500">Görev yüklenemedi veya bulunamadı.</div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};