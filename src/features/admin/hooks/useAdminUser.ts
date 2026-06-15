import '@/shared/api/instance';

import { useGetAdminUserByUserIDQuery } from '@/shared/api/generated/hooks/admin/useGetAdminUserByUserIDQuery.gen';

export const useAdminUser = (userID: string) =>
  useGetAdminUserByUserIDQuery({ request: { path: { userID } } });
