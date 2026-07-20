// src/features/board/components/BoardCard.tsx
'use client';

import React from 'react';
import { Task } from '../services/boardService';
import { CalendarDays, User } from 'lucide-react';

interface BoardCardProps {
  task: Task;
  onClick: () => void;
}

export const BoardCard: React.FC<BoardCardProps> = ({ task, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white p-3 rounded-lg border border-zinc-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-2"
    >
      <h4 className="font-medium text-sm text-zinc-900 mb-2">{task.title}</h4>
      
      <div className="flex items-center justify-between text-xs text-zinc-500">
        {task.dueDate && (
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3.5 w-3.5" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        <div className="flex items-center">
          {task.assigneeAvatar ? (
            <div 
              className="flex items-center justify-center w-6 h-6 rounded-full overflow-hidden bg-zinc-100"
              title={task.assignee || ''}
            >
              <img src={task.assigneeAvatar} alt={task.assignee || 'Assignee'} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div 
              className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100"
              title={task.assignee || 'Atanan yok'}
            >
              <User className="h-3.5 w-3.5 text-zinc-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};