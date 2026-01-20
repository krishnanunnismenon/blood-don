import { headers } from "next/headers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BloodGroupBadge } from "@/components/blood-group-badge";
import { StatusBadge, UrgencyBadge } from "@/components/status-badge";
import { DonorResponseForm } from "@/components/donor-response-form";
import { RealTimeDonorCount } from "@/components/real-time-donor-count";
import type { BloodGroup, RequestStatus, UrgencyLevel } from "@/types";

async function getRequest(requestId: string) {
  const headerList = headers();
  const host = headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "http";
  const fallbackBaseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const baseUrl = host ? `${protocol}://${host}` : fallbackBaseUrl;

  const response = await fetch(
    `${baseUrl}/api/requests/${requestId}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return null;
  }

  const payload = await response.json();
  return payload.data.request as {
    requestId: string;
    patientName: string;
    bloodGroup: string;
    unitsRequired: number;
    hospital: string;
    urgency: string;
    status: string;
    additionalNotes?: string;
  };
}

export default async function RequestPage({
  params,
}: {
  params: { requestId: string };
}) {
  const { requestId } = params;
  const request = await getRequest(requestId);

  if (!request) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Request not found</CardTitle>
          <CardDescription>
            This request is unavailable or not approved yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="space-y-6">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={request.status as RequestStatus} />
              <BloodGroupBadge bloodGroup={request.bloodGroup as BloodGroup} />
              <UrgencyBadge urgency={request.urgency as UrgencyLevel} />
            </div>
            <CardTitle className="mt-2">{request.patientName}</CardTitle>
            <CardDescription>
              {request.unitsRequired} unit(s) needed at {request.hospital}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                <span className="font-medium text-slate-900">Request ID:</span>{" "}
                {request.requestId}
              </p>
              {request.additionalNotes && (
                <p>
                  <span className="font-medium text-slate-900">Notes:</span>{" "}
                  {request.additionalNotes}
                </p>
              )}
              <RealTimeDonorCount requestId={request.requestId} />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Respond to this request</CardTitle>
          <CardDescription>
            Share your availability and we will connect you with the requester.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DonorResponseForm
            requestId={request.requestId}
            preferredHospital={request.hospital}
            defaultBloodGroup={request.bloodGroup}
          />
        </CardContent>
      </Card>
    </div>
  );
}
