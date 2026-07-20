// src/features/board/services/boardService.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function extractData<T>(response: { success: boolean; data: T }): T {
  if (!response.success) throw new Error('API hatası');
  return response.data;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  columnId: string;
  assigneeId?: string | null;
  assignee?: string | null;
  assigneeAvatar?: string | null;
}

export interface Column {
  id: string;
  title: string;
  wipLimit: number | null;
  taskIds: string[];
}

export interface BoardData {
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
}

export const boardService = {
  async getBoardData(projectId: string): Promise<BoardData | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${projectId}/board`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        console.warn("Backend'e ulaşılamadı, yerel veriler kullanılıyor.");
        return null;
      }
      const json = await res.json();
      return extractData(json);
    } catch (error) {
      console.warn("Ağ hatası: Backend çalışmıyor olabilir.", error);
      return null;
    }
  },

  async createTask(projectId: string, columnId: string, title: string): Promise<Task | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ columnId, title }),
      });
      if (!res.ok) throw new Error('Kart oluşturulamadı.');
      const json = await res.json();
      return extractData(json);
    } catch {
      return null;
    }
  },

  async moveTask(projectId: string, taskId: string, targetColumnId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/cards/${taskId}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ columnId: targetColumnId }),
      });
      if (!res.ok) throw new Error('Kart taşınamadı.');
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  async getTaskDetails(projectId: string, taskId: string): Promise<Task> {
    const res = await fetch(`${API_BASE_URL}/cards/${taskId}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Görev detayları yüklenemedi.');
    const json = await res.json();
    return extractData(json);
  },

  async updateTask(projectId: string, task: Task): Promise<Task> {
    const body: Record<string, unknown> = {
      title: task.title,
      description: task.description,
      dueDate: task.dueDate || null,
      columnId: task.columnId,
    };
    // assigneeId varsa backend'e gönder, boş string ise null yap (atamayı kaldır)
    if (task.assigneeId !== undefined) {
      body.assigneeId = task.assigneeId || null;
    }

    const res = await fetch(`${API_BASE_URL}/cards/${task.id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error('Görev güncellenemedi.');
    const json = await res.json();
    return extractData(json);
  },

  async deleteTask(projectId: string, taskId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/cards/${taskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Görev silinemedi.');
  },
};
