import { z } from "zod";
import { bloodGroups } from "@/lib/constants";
import { normalizePhone } from "@/lib/utils";

const phoneSchema = z
  .string()
  .min(7, "Enter a valid phone number")
  .max(20, "Enter a valid phone number")
  .transform((value) => normalizePhone(value))
  .refine((value) => value.length >= 7, "Enter a valid phone number");

export const donorResponseSchema = z.object({
  donorName: z.string().min(2, "Name is required").trim(),
  donorEmail: z.string().email("Enter a valid email").trim(),
  donorPhone: phoneSchema,
  bloodGroup: z.enum(bloodGroups),
  availableDate: z.coerce.date(),
  availableTime: z.string().min(2, "Time is required").trim(),
  preferredHospital: z.string().min(2, "Hospital is required").trim(),
  previousDonations: z.coerce.number().min(0).max(100).optional(),
  notes: z
    .string()
    .max(500)
    .optional()
    .or(z.literal(""))
    .transform((value) => (value ? value : undefined)),
});
