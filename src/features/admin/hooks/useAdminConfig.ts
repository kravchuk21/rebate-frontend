import '@/shared/api/instance';

import { useGetAdminConfigQuery } from '@/shared/api/generated/hooks/admin/useGetAdminConfigQuery.gen';

export const useAdminConfig = () => useGetAdminConfigQuery();
