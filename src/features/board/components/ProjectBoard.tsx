// src/features/board/components/ProjectBoard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragStartEvent, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { BoardColumn } from './BoardColumn';
import { boardService, Task } from '../services/boardService';
import { TaskModal } from '@/components/ui/TaskModal';

interface Column {
  id: string;
  title: string;
  wipLimit?: number;
  taskIds: string[];
}

interface BoardData {
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
}

interface ProjectBoardProps {
  projectId: string;
  organizationId?: string;
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({ projectId, organizationId }) => {
  const [boardData, setBoardData] = useState<BoardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [, setActiveId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    })
  );

  useEffect(() => {
    let isMounted = true;

    boardService.getBoardData(projectId)
      .then((data: BoardData) => {
        if (isMounted) {
          setBoardData(data);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          console.error(err);
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [projectId]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || !boardData) return;

    const activeTaskId = active.id as string;
    const overId = over.id as string;

    const sourceColumn = Object.values(boardData.columns).find((col) =>
      col.taskIds.includes(activeTaskId)
    );

    if (!sourceColumn) return;

    let targetColumnId = overId;
    const targetColumn = Object.values(boardData.columns).find((col) =>
      col.taskIds.includes(overId)
    );

    if (targetColumn) {
      targetColumnId = targetColumn.id;
    }

    const destinationColumn = boardData.columns[targetColumnId];

    if (!destinationColumn || sourceColumn.id === destinationColumn.id) return;

    if (
      destinationColumn.wipLimit && 
      destinationColumn.taskIds.length >= destinationColumn.wipLimit
    ) {
      alert(`Bu sütun için WIP limiti (${destinationColumn.wipLimit}) doludur!`);
      return;
    }

    const sourceTaskIds = sourceColumn.taskIds.filter((id) => id !== activeTaskId);
    const destTaskIds = [...destinationColumn.taskIds, activeTaskId];

    setBoardData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        columns: {
          ...prev.columns,
          [sourceColumn.id]: { ...sourceColumn, taskIds: sourceTaskIds },
          [destinationColumn.id]: { ...destinationColumn, taskIds: destTaskIds },
        },
      };
    });

    try {
      await boardService.moveTask(projectId, activeTaskId, destinationColumn.id);
    } catch (error) {
      console.error("Kart taşınırken veritabanı hatası:", error);
    }
  };

  const handleAddTask = async (columnId: string, title: string) => {
    try {
      const newTask = await boardService.createTask(projectId, columnId, title);

      setBoardData((prev) => {
        if (!prev) return prev;
        const column = prev.columns[columnId];
        return {
          ...prev,
          tasks: {
            ...prev.tasks,
            [newTask.id]: newTask,
          },
          columns: {
            ...prev.columns,
            [columnId]: {
              ...column,
              taskIds: [...column.taskIds, newTask.id],
            },
          },
        };
      });
    } catch (error) {
      console.error("Kart eklenirken hata oluştu:", error);
    }
  };

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsModalOpen(true);
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await boardService.updateTask(projectId, updatedTask);
      setBoardData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks: {
            ...prev.tasks,
            [updatedTask.id]: updatedTask,
          },
        };
      });
    } catch (error) {
      console.error("Görev güncellenirken hata:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await boardService.deleteTask(projectId, taskId);
      setBoardData((prev) => {
        if (!prev) return prev;
        
        const newColumns = { ...prev.columns };
        for (const colId of Object.keys(newColumns)) {
          newColumns[colId] = {
            ...newColumns[colId],
            taskIds: newColumns[colId].taskIds.filter((id) => id !== taskId),
          };
        }

        const newTasks = { ...prev.tasks };
        delete newTasks[taskId];

        return {
          ...prev,
          columns: newColumns,
          tasks: newTasks,
        };
      });
    } catch (error) {
      console.error("Görev silinirken hata:", error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Board yükleniyor...</div>;
  }

  if (!boardData) {
    return <div className="p-8 text-center text-red-500">Veriler yüklenemedi.</div>;
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900 p-6 relative overflow-hidden">
      <style jsx>{`
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(12px); }
        }
        @keyframes fallDown1 {
          0% { transform: translateY(-40px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(120px); opacity: 0.8; }
        }
        @keyframes fallDown2 {
          0% { transform: translateY(-60px); opacity: 0; }
          60% { opacity: 1; }
          100% { transform: translateY(100px); opacity: 0.8; }
        }
        @keyframes fallDown3 {
          0% { transform: translateY(-30px); opacity: 0; }
          40% { opacity: 1; }
          100% { transform: translateY(140px); opacity: 0.8; }
        }
        .animate-cat-slow {
          animation: floatSlow 4s ease-in-out infinite;
        }
        .animate-fall-1 {
          animation: fallDown1 3.5s ease-in infinite;
        }
        .animate-fall-2 {
          animation: fallDown2 4.2s ease-in infinite;
          animation-delay: 1s;
        }
        .animate-fall-3 {
          animation: fallDown3 3.8s ease-in infinite;
          animation-delay: 2s;
        }
      `}</style>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Proje Panosu</h1>
          <p className="text-sm text-zinc-600">Aktif Proje ID: <span className="font-medium text-blue-600">{projectId}</span></p>
        </div>
      </div>

      <div className="relative z-10">
        <DndContext 
          sensors={sensors} 
          onDragStart={handleDragStart} 
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-180px)]">
            {Object.values(boardData.columns).map((column) => {
              const columnTasks = column.taskIds
                .map((taskId) => boardData.tasks[taskId])
                .filter((task): task is Task => task !== undefined);

              return (
                <BoardColumn
                  key={column.id}
                  id={column.id}
                  title={column.title}
                  tasks={columnTasks}
                  wipLimit={column.wipLimit}
                  onAddTask={handleAddTask}
                  onTaskClick={handleTaskClick}
                />
              );
            })}
          </div>
        </DndContext>

        <div className="absolute right-10 bottom-6 flex flex-col items-center select-none pointer-events-none z-20">
          <div className="relative w-24 h-16 mb-1">
            <span className="absolute left-2 text-xs animate-fall-1">🐟</span>
            <span className="absolute left-10 text-xs animate-fall-2">🥩</span>
            <span className="absolute left-18 text-xs animate-fall-3">🐟</span>
          </div>

          <div className="text-6xl animate-cat-slow" title="Miyav!">
            🐱
          </div>
        </div>

        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          taskId={selectedTaskId}
          fetchTaskDetails={(id) => boardService.getTaskDetails(projectId, id)}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
          organizationId={organizationId}
        />
      </div>
    </div>
  );
};