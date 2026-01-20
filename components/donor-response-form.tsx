"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { donorResponseSchema } from "@/lib/validations/donor-response";
import { bloodGroups } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

type DonorResponseInput = z.input<typeof donorResponseSchema>;

export function DonorResponseForm({
  requestId,
  preferredHospital,
  defaultBloodGroup,
}: {
  requestId: string;
  preferredHospital?: string;
  defaultBloodGroup?: string;
}) {
  const [submitted, setSubmitted] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DonorResponseInput>({
    resolver: zodResolver(donorResponseSchema),
    defaultValues: {
      donorName: "",
      donorEmail: "",
      donorPhone: "",
      bloodGroup:
        (defaultBloodGroup as DonorResponseInput["bloodGroup"]) || "A+",
      availableDate: new Date().toISOString().slice(0, 10),
      availableTime: "",
      preferredHospital: preferredHospital || "",
      previousDonations: 0,
      notes: "",
    },
  });

  const onSubmit = async (values: DonorResponseInput) => {
    try {
      const response = await fetch(`/api/requests/${requestId}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload?.error?.message ?? "Unable to send response");
        return;
      }

      toast.success("Thank you for responding!");
      setSubmitted(true);
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-900">
        <p className="font-semibold">Thanks for stepping up!</p>
        <p className="mt-1">
          The requester has been notified. We will reach out if you are selected.
        </p>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="donorName">Your Name</Label>
          <Input id="donorName" {...register("donorName")} aria-invalid={!!errors.donorName} />
          {errors.donorName && (
            <p className="text-sm text-red-600" role="alert">
              {errors.donorName.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="donorEmail">Email</Label>
          <Input id="donorEmail" type="email" {...register("donorEmail")} aria-invalid={!!errors.donorEmail} />
          {errors.donorEmail && (
            <p className="text-sm text-red-600" role="alert">
              {errors.donorEmail.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="donorPhone">Phone</Label>
          <Input id="donorPhone" type="tel" {...register("donorPhone")} aria-invalid={!!errors.donorPhone} />
          {errors.donorPhone && (
            <p className="text-sm text-red-600" role="alert">
              {errors.donorPhone.message}
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
          <Label htmlFor="availableDate">Available Date</Label>
          <Input id="availableDate" type="date" {...register("availableDate")} />
          {errors.availableDate && (
            <p className="text-sm text-red-600" role="alert">
              {errors.availableDate.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="availableTime">Available Time</Label>
          <Input id="availableTime" placeholder="10:00 AM - 2:00 PM" {...register("availableTime")} />
          {errors.availableTime && (
            <p className="text-sm text-red-600" role="alert">
              {errors.availableTime.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="preferredHospital">Preferred Hospital</Label>
          <Input id="preferredHospital" {...register("preferredHospital")} aria-invalid={!!errors.preferredHospital} />
          {errors.preferredHospital && (
            <p className="text-sm text-red-600" role="alert">
              {errors.preferredHospital.message}
            </p>
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="previousDonations">Previous Donations</Label>
          <Input
            id="previousDonations"
            type="number"
            min={0}
            max={100}
            {...register("previousDonations", { valueAsNumber: true })}
          />
        </div>
      </div>
      <div className="space-y-1">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea id="notes" {...register("notes")} />
      </div>
      <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
        {isSubmitting ? "Submitting..." : "Send Response"}
      </Button>
    </form>
  );
}
