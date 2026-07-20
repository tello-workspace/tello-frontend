import { api } from '@/lib/api';

interface Organization {
  id: string;
  name: string;
  description: string | null;
  role: 'ADMIN' | 'MEMBER';
  memberCount: number;
  projectCount: number;
}

interface OrgsResponse {
  success: boolean;
  data: Organization[];
}

export const organizationsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrganizations: builder.query<Organization[], void>({
      query: () => '/organizations',
      transformResponse: (response: OrgsResponse) => response.data,
      providesTags: ['Project'],
    }),
  }),
});

export const { useGetMyOrganizationsQuery } = organizationsApi;
