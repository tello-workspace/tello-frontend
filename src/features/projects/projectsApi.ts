import { api } from '@/lib/api';

interface Project {
  id: string;
  name: string;
  description: string | null;
  organizationId: string;
  ownerId: string;
  createdAt: string;
  _count: {
    columns: number;
  };
}

interface ProjectsResponse {
  success: boolean;
  data: Project[];
}

export const projectsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], { orgId: string }>({
      query: ({ orgId }) => `/organizations/${orgId}/projects`,
      transformResponse: (response: ProjectsResponse) => response.data,
      providesTags: ['Project'],
    }),
    getProjectById: builder.query<Project, { orgId: string; projectId: string }>({
      query: ({ orgId, projectId }) => `/organizations/${orgId}/projects/${projectId}`,
      transformResponse: (response: { success: boolean; data: Project }) => response.data,
      providesTags: (_result, _error, { projectId }) => [{ type: 'Project', id: projectId }],
    }),
  }),
});

export const { useGetProjectsQuery, useGetProjectByIdQuery } = projectsApi;
