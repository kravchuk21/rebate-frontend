import '@/shared/api/instance';

import { useGetAdminUsersQuery } from '@/shared/api/generated/hooks/admin/useGetAdminUsersQuery.gen';

export const useAdminUsers = (params?: {
  search?: string;
  status?: string;
  role?: string;
  limit?: number;
  offset?: number;
}) => useGetAdminUsersQuery({ request: { query: params } });
