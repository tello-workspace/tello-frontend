// src/features/board/components/BoardCard.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../services/boardService';
import { CalendarDaysIcon, UserIcon } from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface BoardCardProps {
  task: Task;
  onClick: () => void;
}

function initials(name: string): string {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase();
}

const MAX_VISIBLE_ASSIGNEES = 3;

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
      className="bg-card p-3 rounded-xl border border-border shadow-sm cursor-pointer hover:border-primary transition group"
    >
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-1.5">
          {task.labels.map((label) => (
            <Badge
              key={label.id}
              className="text-white border-0 text-[10px]"
              style={{ backgroundColor: label.color }}
            >
              {label.name}
            </Badge>
          ))}
        </div>
      )}

      <h4 className="text-sm font-medium text-foreground mb-1">
        {task.title}
      </h4>

      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1">
          {task.dueDate && (
            <>
              <CalendarDaysIcon className="h-3.5 w-3.5" />
              <span>{task.dueDate}</span>
            </>
          )}
        </div>

        {task.assignees && task.assignees.length > 0 ? (
          <div className="flex items-center -space-x-1.5">
            {task.assignees.slice(0, MAX_VISIBLE_ASSIGNEES).map((a) => (
              <Avatar key={a.id} size="sm" className="border-2 border-background">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                  {initials(a.name)}
                </AvatarFallback>
              </Avatar>
            ))}
            {task.assignees.length > MAX_VISIBLE_ASSIGNEES && (
              <Avatar size="sm" className="border-2 border-background">
                <AvatarFallback className="text-[9px]">
                  +{task.assignees.length - MAX_VISIBLE_ASSIGNEES}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ) : (
          <UserIcon className="h-3.5 w-3.5 text-muted-foreground/50" />
        )}
      </div>
    </div>
  );
};
