import "@/shared/api/instance";

import { useGetAdminAuditLogQuery } from "@/shared/api/generated/hooks/admin/useGetAdminAuditLogQuery.gen";

export const useAdminAuditLog = (params?: {
  action?: string;
  entity_type?: string;
  admin_id?: string;
  limit?: number;
  offset?: number;
}) => useGetAdminAuditLogQuery({ request: { query: params } });
