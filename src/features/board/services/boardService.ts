// src/features/board/services/boardService.ts

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  columnId: string;
  assigneeId?: string | null;
  assignee?: string | null;       // Eklendi
  assigneeAvatar?: string | null; // Eklendi
}

export const boardService = {
  async getBoardData(projectId: string): Promise<any> {
    const response = await fetch(`/api/projects/${projectId}/board`);
    if (!response.ok) {
      throw new Error('Board verileri alınamadı.');
    }
    return response.json();
  },

  async createTask(projectId: string, columnId: string, title: string): Promise<Task> {
    const response = await fetch(`/api/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ columnId, title }),
    });
    if (!response.ok) {
      throw new Error('Görev oluşturulamadı.');
    }
    return response.json();
  },

  async moveTask(projectId: string, taskId: string, columnId: string): Promise<any> {
    const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}/move`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ columnId }),
    });
    if (!response.ok) {
      throw new Error('Görev taşınamadı.');
    }
    return response.json();
  },

  async getTaskDetails(projectId: string, taskId: string): Promise<Task> {
    const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`);
    if (!response.ok) {
      throw new Error('Görev detayları alınamadı.');
    }
    return response.json();
  },

  async updateTask(projectId: string, task: Task): Promise<Task> {
    const response = await fetch(`/api/projects/${projectId}/tasks/${task.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString() : null,
        columnId: task.columnId,
        assigneeId: task.assigneeId || null,
      }),
    });

    if (!response.ok) {
      throw new Error('Görev güncellenirken bir hata oluştu.');
    }

    return response.json();
  },

  async deleteTask(projectId: string, taskId: string): Promise<any> {
    const response = await fetch(`/api/projects/${projectId}/tasks/${taskId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Görev silinemedi.');
    }
    return response.json();
  },
};