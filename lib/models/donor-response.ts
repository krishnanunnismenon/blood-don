import mongoose, { Schema, type InferSchemaType } from "mongoose";
import { bloodGroups, donorResponseStatuses } from "@/lib/constants";

const donorResponseSchema = new Schema(
  {
    requestId: { type: String, required: true, index: true },
    bloodRequestObjectId: {
      type: Schema.Types.ObjectId,
      ref: "BloodRequest",
      required: true,
      index: true,
    },
    donorName: { type: String, required: true, trim: true },
    donorEmail: { type: String, required: true, trim: true, lowercase: true },
    donorPhone: { type: String, required: true, trim: true },
    bloodGroup: { type: String, required: true, enum: bloodGroups },
    availableDate: { type: Date, required: true },
    availableTime: { type: String, required: true, trim: true },
    preferredHospital: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: donorResponseStatuses,
      default: "pending",
    },
    isSelected: { type: Boolean, default: false },
    respondedAt: { type: Date, default: Date.now },
    previousDonations: { type: Number, default: 0 },
    notes: { type: String, default: null, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

donorResponseSchema.index({ requestId: 1 });
donorResponseSchema.index({ bloodRequestObjectId: 1 });
donorResponseSchema.index({ donorEmail: 1 });
donorResponseSchema.index({ status: 1 });
donorResponseSchema.index({ createdAt: -1 });

export type DonorResponseDocument =
  InferSchemaType<typeof donorResponseSchema> & mongoose.Document;

export const DonorResponse =
  mongoose.models.DonorResponse ||
  mongoose.model("DonorResponse", donorResponseSchema);
