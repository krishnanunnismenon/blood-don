"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { bloodRequestCreateSchema } from "@/lib/validations/blood-request";
import { bloodGroups, urgencyLevels } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const defaultValues: z.infer<typeof bloodRequestCreateSchema> = {
  patientName: "",
  bloodGroup: "A+",
  unitsRequired: 1,
  hospital: "",
  contactNumber: "",
  contactEmail: "",
  urgency: "routine",
  additionalNotes: "",
};

export function BloodRequestForm() {
  const [requestId, setRequestId] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof bloodRequestCreateSchema>>({
    resolver: zodResolver(bloodRequestCreateSchema),
    defaultValues,
  });

  const onSubmit = async (values: z.infer<typeof bloodRequestCreateSchema>) => {
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload?.error?.message ?? "Unable to submit request");
        return;
      }

      setRequestId(payload.data.requestId);
      toast.success("Request submitted successfully");
      reset(defaultValues);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleCopyLink = async () => {
    if (!requestId) {
      return;
    }

    const url = `${window.location.origin}/request/${requestId}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Unable to copy. Please copy the link manually.");
    }
  };

  return (
    <div className="space-y-4">
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input id="patientName" {...register("patientName")} aria-invalid={!!errors.patientName} />
            {errors.patientName && (
              <p className="text-sm text-red-600" role="alert">
                {errors.patientName.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="bloodGroup">Blood Group</Label>
            <Select id="bloodGroup" {...register("bloodGroup")}>
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
              {...register("unitsRequired", { valueAsNumber: true })}
              aria-invalid={!!errors.unitsRequired}
            />
            {errors.unitsRequired && (
              <p className="text-sm text-red-600" role="alert">
                {errors.unitsRequired.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="hospital">Hospital</Label>
            <Input id="hospital" {...register("hospital")} aria-invalid={!!errors.hospital} />
            {errors.hospital && (
              <p className="text-sm text-red-600" role="alert">
                {errors.hospital.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="contactNumber">Contact Number</Label>
            <Input
              id="contactNumber"
              type="tel"
              {...register("contactNumber")}
              aria-invalid={!!errors.contactNumber}
            />
            {errors.contactNumber && (
              <p className="text-sm text-red-600" role="alert">
                {errors.contactNumber.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="contactEmail">Contact Email (optional)</Label>
            <Input id="contactEmail" type="email" {...register("contactEmail")} />
            {errors.contactEmail && (
              <p className="text-sm text-red-600" role="alert">
                {errors.contactEmail.message}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <Label htmlFor="urgency">Urgency</Label>
            <Select id="urgency" {...register("urgency")}>
              {urgencyLevels.map((urgency) => (
                <option key={urgency} value={urgency}>
                  {urgency}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="additionalNotes">Additional Notes (optional)</Label>
          <Textarea id="additionalNotes" {...register("additionalNotes")} />
          {errors.additionalNotes && (
            <p className="text-sm text-red-600" role="alert">
              {errors.additionalNotes.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "Submitting..." : "Submit Request"}
        </Button>
      </form>

      {requestId && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
          <p className="font-semibold">Request submitted successfully.</p>
          <p className="mt-1">Your request ID: {requestId}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleCopyLink}>
              Copy tracking link
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
