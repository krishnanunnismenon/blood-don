"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { bloodGroups, urgencyLevels } from "@/lib/constants";
import { bloodRequestUpdateSchema } from "@/lib/validations/blood-request";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge, UrgencyBadge } from "@/components/status-badge";
import { BloodGroupBadge } from "@/components/blood-group-badge";
import { DonorResponsesList } from "@/components/donor-responses-list";
import { toast } from "sonner";
import type { BloodRequestAdmin } from "@/types";

const adminHeaders: HeadersInit = process.env.NEXT_PUBLIC_ADMIN_SECRET
  ? { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET }
  : {};

async function fetchRequest(requestId: string) {
  const response = await fetch(`/api/admin/requests?requestId=${requestId}`, {
    headers: adminHeaders,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch request");
  }
  const data = await response.json();
  return (data.data.requests?.[0] ?? null) as BloodRequestAdmin | null;
}

export function AdminRequestDetails({ requestId }: { requestId: string }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-request", requestId],
    queryFn: () => fetchRequest(requestId),
  });

  const form = useForm<z.infer<typeof bloodRequestUpdateSchema>>({
    resolver: zodResolver(bloodRequestUpdateSchema),
    defaultValues: {
      patientName: "",
      bloodGroup: "A+",
      unitsRequired: 1,
      hospital: "",
      contactNumber: "",
      contactEmail: "",
      urgency: "routine",
      additionalNotes: "",
    },
  });

  React.useEffect(() => {
    if (data) {
      form.reset({
        patientName: data.patientName,
        bloodGroup: data.bloodGroup,
        unitsRequired: data.unitsRequired,
        hospital: data.hospital,
        contactNumber: data.contactNumber ?? "",
        contactEmail: data.contactEmail ?? "",
        urgency: data.urgency,
        additionalNotes: data.additionalNotes ?? "",
      });
    }
  }, [data, form]);

  const handleApprove = async () => {
    try {
      const values = form.getValues();
      const response = await fetch(`/api/admin/requests/${requestId}/approve`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...adminHeaders },
        body: JSON.stringify(values),
      });
      const payload = await response.json();
      if (!response.ok) {
        toast.error(payload?.error?.message ?? "Unable to approve request");
        return;
      }
      toast.success("Request approved and broadcast queued");
      refetch();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleReject = async () => {
    const reason = window.prompt("Reason for rejection?");
    if (!reason) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/requests/${requestId}/reject`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...adminHeaders },
        body: JSON.stringify({ rejectionReason: reason }),
      });
      const payload = await response.json();
      if (!response.ok) {
        toast.error(payload?.error?.message ?? "Unable to reject request");
        return;
      }
      toast.success("Request rejected");
      refetch();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleFulfill = async () => {
    if (!window.confirm("Mark this request as fulfilled?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/requests/${requestId}/fulfill`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...adminHeaders },
      });
      const payload = await response.json();
      if (!response.ok) {
        toast.error(payload?.error?.message ?? "Unable to fulfill request");
        return;
      }
      toast.success("Request marked as fulfilled");
      refetch();
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading request...</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-slate-500">Request not found.</p>;
  }

  const isPending = data.status === "pending";

  return (
    <div className="space-y-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500">Request ID</p>
            <p className="text-lg font-semibold text-slate-900">{data.requestId}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={data.status} />
            <BloodGroupBadge bloodGroup={data.bloodGroup} />
            <UrgencyBadge urgency={data.urgency} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Request Information</h2>
        <form className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input id="patientName" disabled={!isPending} {...form.register("patientName")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Select id="bloodGroup" disabled={!isPending} {...form.register("bloodGroup")}>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="unitsRequired">Units Required</Label>
            <Input
              id="unitsRequired"
              type="number"
              min={1}
              max={10}
              disabled={!isPending}
              {...form.register("unitsRequired", { valueAsNumber: true })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="hospital">Hospital</Label>
            <Input id="hospital" disabled={!isPending} {...form.register("hospital")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input id="contactNumber" disabled={!isPending} {...form.register("contactNumber")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="contactEmail">Contact Email</Label>
            <Input id="contactEmail" type="email" disabled={!isPending} {...form.register("contactEmail")} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="urgency">Urgency</Label>
            <Select id="urgency" disabled={!isPending} {...form.register("urgency")}>
              {urgencyLevels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea id="additionalNotes" disabled={!isPending} {...form.register("additionalNotes")} />
          </div>
        </form>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button onClick={handleApprove} disabled={!isPending}>
            Approve & Broadcast
          </Button>
          <Button variant="outline" onClick={handleReject} disabled={!isPending}>
            Reject
          </Button>
          <Button variant="secondary" onClick={handleFulfill} disabled={data.status !== "approved"}>
            Mark Fulfilled
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">Donor Responses</h2>
        <div className="mt-4">
          <DonorResponsesList requestId={data.requestId} />
        </div>
      </div>
    </div>
  );
}
