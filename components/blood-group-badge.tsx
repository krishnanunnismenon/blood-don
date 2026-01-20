import { Badge } from "@/components/ui/badge";
import { bloodGroupBadgeStyles } from "@/lib/constants";
import type { BloodGroup } from "@/types";

export function BloodGroupBadge({ bloodGroup }: { bloodGroup: BloodGroup }) {
  return <Badge className={bloodGroupBadgeStyles}>{bloodGroup}</Badge>;
}
