// src/features/board/components/BoardColumn.tsx
'use client';

import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { BoardCard } from './BoardCard';
import { Task } from '@/features/board/services/boardService';
import { Plus } from 'lucide-react';

interface BoardColumnProps {
  id: string;
  title: string;
  tasks: Task[];
  wipLimit?: number;
  onAddTask: (columnId: string, title: string) => void;
  onTaskClick: (taskId: string) => void;
}

export const BoardColumn: React.FC<BoardColumnProps> = ({
  id,
  title,
  tasks,
  wipLimit,
  onAddTask,
  onTaskClick,
}) => {
  const { setNodeRef } = useDroppable({ id });
  const [isAdding, setIsAdding] = useState(false);
  const [titleInput, setTitleInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleInput.trim()) return;
    onAddTask(id, titleInput.trim());
    setTitleInput('');
    setIsAdding(false);
  };

  const isLimitExceeded = wipLimit !== undefined && tasks.length >= wipLimit;

  return (
    <div 
      ref={setNodeRef}
      className={`flex flex-col w-80 shrink-0 bg-sky-950/40 rounded-xl p-4 border shadow-sm ${
        isLimitExceeded 
          ? 'border-amber-400 bg-amber-50/50' 
          : 'border-sky-900/60'
      }`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sky-100 text-sm">{title}</h3>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-sky-900/50 text-sky-200">
            {tasks.length} {wipLimit ? `/ ${wipLimit}` : ''}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 overflow-y-auto flex-1 min-h-[150px] pr-1">
        {tasks.map((task) => (
          <BoardCard 
            key={task.id} 
            task={task} 
            onClick={() => onTaskClick(task.id)} 
          />
        ))}
      </div>

      <div className="mt-3 pt-2 border-t border-sky-900/40">
        {isAdding ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              type="text"
              autoFocus
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              placeholder="Görev başlığı yazın..."
              className="w-full text-sm p-2 rounded-lg border border-sky-800 bg-sky-950 text-sky-100 placeholder-sky-400 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1 text-xs text-sky-300 hover:bg-sky-900/50 rounded"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs bg-sky-600 text-white rounded hover:bg-sky-700"
              >
                Ekle
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 text-xs font-medium text-sky-300 hover:text-white w-full p-1.5 rounded-lg hover:bg-sky-900/40 transition"
          >
            <Plus className="h-4 w-4" />
            Yeni kart ekle
          </button>
        )}
      </div>
    </div>
  );
};