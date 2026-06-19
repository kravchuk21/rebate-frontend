export enum Routes {
  Home = "/",
  Dashboard = "/dashboard",
  Accounts = "/accounts",
  Rebate = "/rebate",
  Withdrawal = "/withdrawal",
  Referrals = "/referrals",
  Admin = "/admin",
  AdminUsers = "/admin/users",
  AdminBrokerAccounts = "/admin/broker-accounts",
  AdminWithdrawals = "/admin/withdrawals",
  AdminRebate = "/admin/rebate",
  AdminConfig = "/admin/config",
  AdminAuditLog = "/admin/audit-log",
  Profile = "/profile",
  Faq = "/faq",
  Blog = "/blog",
}

/**
 * Identifiers for every modal that is reflected in the URL via `?modal=<id>`.
 * Access rules for each id live in `@/shared/lib/modals` (MODAL_ACCESS).
 */
export enum Modals {
  // public (auth flow)
  Login = "login",
  Register = "register",
  TwoFa = "twoFa",
  // authenticated
  CreateWithdrawal = "create-withdrawal",
  AddPayoutMethod = "add-payout-method",
  SubmitAccount = "submit-account",
  TwoFASetup = "twofa-setup",
  TwoFADisable = "twofa-disable",
  // admin
  AdjustBalance = "adjust-balance",
  ChangeReferrer = "change-referrer",
  AdjustCalculation = "adjust-calculation",
  TriggerCalculation = "trigger-calculation",
  ImportBrokerData = "import-broker-data",
  UpdateWithdrawalStatus = "update-withdrawal-status",
  AuditDetails = "audit-details",
}
