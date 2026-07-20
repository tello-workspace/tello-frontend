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
import { boardService, Task, BoardData } from '../services/boardService';
import { TaskModal } from '@/components/ui/TaskModal';

interface ProjectBoardProps {
  projectId: string;
}

export const ProjectBoard: React.FC<ProjectBoardProps> = ({ projectId }) => {
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
    boardService.getBoardData(projectId)
      .then((data) => setBoardData(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
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
      if (!newTask) return;

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
    <>
      <DndContext 
        sensors={sensors} 
        onDragStart={handleDragStart} 
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto p-4 h-[calc(100vh-120px)]">
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

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskId={selectedTaskId}
        fetchTaskDetails={(id) => boardService.getTaskDetails(projectId, id)}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
      />
    </>
  );
};
