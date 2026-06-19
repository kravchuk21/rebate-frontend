export type AccountStatus = "pending" | "approved" | "rejected" | "revoked";

export const getStatusColor = (status: string): "warning" | "success" | "danger" | "default" => {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    case "pending":
      return "warning";
    default:
      return "default";
  }
};
