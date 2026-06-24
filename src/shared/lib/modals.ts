import { Modals } from "./routes";

/**
 * Access level required to open a modal.
 * - `public`: anyone (auth flow modals)
 * - `auth`: any authenticated user
 * - `admin`: users whose JWT role is `admin`
 *
 * This is the client-side counterpart to the server route guards in
 * `(dashboard)/layout.tsx` and `(admin)/layout.tsx`. `useModal` consults it so a
 * modal can never be summoned via a crafted/shared `?modal=` link by a user who
 * lacks the required access, even if the component happened to be mounted.
 */
export type ModalAccess = "public" | "auth" | "admin";

export const MODAL_ACCESS: Record<Modals, ModalAccess> = {
  [Modals.Login]: "public",
  [Modals.Register]: "public",
  [Modals.TwoFa]: "public",

  [Modals.CreateWithdrawal]: "auth",
  [Modals.AddPayoutMethod]: "auth",
  [Modals.SubmitAccount]: "auth",
  [Modals.TwoFASetup]: "auth",
  [Modals.TwoFADisable]: "auth",

  [Modals.AdjustBalance]: "admin",
  [Modals.ChangeReferrer]: "admin",
  [Modals.AdjustCalculation]: "admin",
  [Modals.TriggerCalculation]: "admin",
  [Modals.ImportBrokerData]: "admin",
  [Modals.UpdateWithdrawalStatus]: "admin",
  [Modals.AuditDetails]: "admin",
  [Modals.BrokerForm]: "admin",
};

/**
 * Extra query-string keys each modal owns (entity ids / display values). They
 * are written by `open(...)` and stripped by `close()` so the URL stays clean.
 */
export const MODAL_PARAMS: Partial<Record<Modals, readonly string[]>> = {
  [Modals.TwoFa]: ["user_id"],
  [Modals.AdjustBalance]: ["userID"],
  [Modals.ChangeReferrer]: ["userID", "referrerEmail"],
  [Modals.AdjustCalculation]: ["calculationID", "gross"],
  [Modals.UpdateWithdrawalStatus]: ["withdrawalID"],
  [Modals.AuditDetails]: ["entryId"],
  [Modals.BrokerForm]: ["brokerID", "name", "slug", "rebateRate", "uidFormatRegex"],
};
