import { Badge } from "@/components/ui/badge";
import { statusBadgeStyles, urgencyBadgeStyles } from "@/lib/constants";
import type { RequestStatus, UrgencyLevel } from "@/types";

export function StatusBadge({ status }: { status: RequestStatus }) {
  return (
    <Badge className={statusBadgeStyles[status] ?? "bg-slate-100 text-slate-700"}>
      {status}
    </Badge>
  );
}

export function UrgencyBadge({ urgency }: { urgency: UrgencyLevel }) {
  return (
    <Badge className={urgencyBadgeStyles[urgency] ?? "bg-slate-100 text-slate-700"}>
      {urgency}
    </Badge>
  );
}
