// src/features/board/services/boardService.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  columnId: string;
  assignee?: string;
  assigneeAvatar?: string;
}

const fallbackBoardData = {
  columns: {
    todo: { id: 'todo', title: 'To Do', wipLimit: 3, taskIds: ['task-1', 'task-2'] },
    in_progress: { id: 'in_progress', title: 'In Progress', wipLimit: 2, taskIds: ['task-3'] },
    done: { id: 'done', title: 'Done', taskIds: [] },
  },
  tasks: {
    'task-1': { 
      id: 'task-1', 
      title: 'Proje iskeletini kur', 
      description: 'Next.js ve Tailwind ayarla', 
      columnId: 'todo',
      assignee: 'Ahmet Y.',
      assigneeAvatar: 'AY'
    },
    'task-2': { 
      id: 'task-2', 
      title: 'Veritabanı bağlantısı', 
      description: 'Prisma şemasını oluştur', 
      columnId: 'todo',
      assignee: 'Zeynep K.',
      assigneeAvatar: 'ZK'
    },
    'task-3': { 
      id: 'task-3', 
      title: 'Kanban bileşenleri', 
      description: 'dnd-kit entegrasyonu', 
      columnId: 'in_progress',
      assignee: 'Ahmet Y.',
      assigneeAvatar: 'AY'
    },
  },
};

export const boardService = {
  async getBoardData(projectId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/board`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (!response.ok) {
        console.warn("Backend'e ulaşılamadı, yerel veriler kullanılıyor.");
        return fallbackBoardData;
      }
      
      return await response.json();
    } catch (error) {
      console.warn("Ağ hatası: Backend çalışmıyor olabilir. Yedek veriye dönülüyor.", error);
      return fallbackBoardData;
    }
  },

  async createTask(projectId: string, columnId: string, title: string): Promise<Task> {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ columnId, title }),
      });
      if (!response.ok) throw new Error('Kart oluşturulamadı.');
      return await response.json();
    } catch {
      return { 
        id: `task-${Date.now()}`, 
        title, 
        columnId, 
        description: '', 
        dueDate: '',
        assignee: '',
        assigneeAvatar: ''
      };
    }
  },

  async moveTask(projectId: string, taskId: string, targetColumnId: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/move`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, targetColumnId }),
      });
      if (!response.ok) throw new Error('Kart taşınamadı.');
      return await response.json();
    } catch {
      return { success: true };
    }
  },

  async getTaskDetails(projectId: string, taskId: string): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Görev detayları yüklenemedi.');
    return response.json();
  },

  async updateTask(projectId: string, task: Task): Promise<Task> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${task.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!response.ok) throw new Error('Görev güncellenemedi.');
    return response.json();
  },

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!response.ok) throw new Error('Görev silinemedi.');
  },
};