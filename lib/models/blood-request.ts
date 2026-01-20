import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { bloodGroups, requestStatuses, urgencyLevels } from "@/lib/constants";

const bloodRequestSchema = new Schema(
  {
    requestId: { type: String, required: true, unique: true },
    patientName: { type: String, required: true, trim: true },
    bloodGroup: {
      type: String,
      required: true,
      enum: bloodGroups,
    },
    unitsRequired: { type: Number, required: true, min: 1, max: 10 },
    hospital: { type: String, required: true, trim: true },
    contactNumber: { type: String, required: true, trim: true },
    contactEmail: { type: String, trim: true },
    urgency: {
      type: String,
      enum: urgencyLevels,
      default: "routine",
    },
    additionalNotes: { type: String, trim: true },
    status: {
      type: String,
      enum: requestStatuses,
      default: "pending",
    },
    approvedAt: { type: Date, default: null },
    fulfilledAt: { type: Date, default: null },
    approvedBy: { type: Schema.Types.ObjectId, default: null },
    rejectionReason: { type: String, default: null },
    n8nWorkflowExecutionId: { type: String, default: null },
    broadcastedAt: { type: Date, default: null },
    ipAddress: { type: String, required: true },
    userAgent: { type: String, required: true },
  },
  { timestamps: true }
);

bloodRequestSchema.index({ requestId: 1 }, { unique: true });
bloodRequestSchema.index({ status: 1 });
bloodRequestSchema.index({ createdAt: -1 });
bloodRequestSchema.index({ bloodGroup: 1 });

export type BloodRequestDocument = InferSchemaType<typeof bloodRequestSchema> &
  mongoose.Document;

export const BloodRequest =
  mongoose.models.BloodRequest ||
  mongoose.model("BloodRequest", bloodRequestSchema);
