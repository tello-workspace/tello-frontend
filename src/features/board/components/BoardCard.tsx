// src/features/board/components/BoardCard.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../services/boardService';
import { CalendarDaysIcon, UserIcon } from '@heroicons/react/24/outline';

interface BoardCardProps {
  task: Task;
  onClick: () => void;
}

export const BoardCard: React.FC<BoardCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className="bg-white dark:bg-zinc-950 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm cursor-pointer hover:border-blue-500 dark:hover:border-blue-500 transition group"
    >
      <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-100 mb-1">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-100 dark:border-zinc-900 text-[11px] text-zinc-400 dark:text-zinc-500">
        <div className="flex items-center gap-1">
          {task.dueDate && (
            <>
              <CalendarDaysIcon className="h-3.5 w-3.5" />
              <span>{task.dueDate}</span>
            </>
          )}
        </div>

        {task.assigneeAvatar ? (
          <div 
            className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold text-[10px]"
            title={task.assignee ?? undefined}
          >
            {task.assigneeAvatar}
          </div>
        ) : (
          <UserIcon className="h-3.5 w-3.5 text-zinc-400" />
        )}
      </div>
    </div>
  );
};