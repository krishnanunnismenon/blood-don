import { z } from "zod";
import { bloodGroups, urgencyLevels } from "@/lib/constants";
import { normalizePhone } from "@/lib/utils";

const phoneSchema = z
  .string()
  .min(7, "Enter a valid phone number")
  .max(20, "Enter a valid phone number")
  .transform((value) => normalizePhone(value))
  .refine((value) => value.length >= 7, "Enter a valid phone number");

export const bloodRequestCreateSchema = z.object({
  patientName: z.string().min(2, "Patient name is required").trim(),
  bloodGroup: z.enum(bloodGroups),
  unitsRequired: z.coerce
    .number()
    .min(1, "Minimum 1 unit")
    .max(10, "Maximum 10 units"),
  hospital: z.string().min(2, "Hospital is required").trim(),
  contactNumber: phoneSchema,
  contactEmail: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
  urgency: z.enum(urgencyLevels).optional(),
  additionalNotes: z
    .string()
    .max(500)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
});

export const bloodRequestUpdateSchema = bloodRequestCreateSchema.partial();

export const bloodRequestRejectSchema = z.object({
  rejectionReason: z
    .string()
    .min(5, "Please provide a reason")
    .max(500, "Keep it under 500 characters"),
});
