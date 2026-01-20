export const bloodGroups = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const requestStatuses = [
  "pending",
  "approved",
  "rejected",
  "fulfilled",
  "cancelled",
] as const;

export const donorResponseStatuses = [
  "pending",
  "accepted",
  "declined",
  "fulfilled",
] as const;

export const urgencyLevels = ["routine", "urgent", "emergency"] as const;

export const statusBadgeStyles: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  fulfilled: "bg-blue-100 text-blue-800",
  cancelled: "bg-slate-100 text-slate-700",
};

export const urgencyBadgeStyles: Record<string, string> = {
  routine: "bg-slate-100 text-slate-700",
  urgent: "bg-amber-100 text-amber-800",
  emergency: "bg-red-100 text-red-800",
};

export const bloodGroupBadgeStyles =
  "bg-red-50 text-red-700 border border-red-200";
