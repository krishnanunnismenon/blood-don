import type { bloodGroups, requestStatuses, donorResponseStatuses, urgencyLevels } from "@/lib/constants";

export type BloodGroup = (typeof bloodGroups)[number];
export type RequestStatus = (typeof requestStatuses)[number];
export type DonorResponseStatus = (typeof donorResponseStatuses)[number];
export type UrgencyLevel = (typeof urgencyLevels)[number];

export type BloodRequestSummary = {
  requestId: string;
  patientName: string;
  bloodGroup: BloodGroup;
  unitsRequired: number;
  hospital: string;
  urgency: UrgencyLevel;
  status: RequestStatus;
  createdAt: string;
};

export type BloodRequestPublic = BloodRequestSummary & {
  additionalNotes?: string;
  approvedAt?: string | null;
};

export type BloodRequestAdmin = BloodRequestSummary & {
  contactNumber: string;
  contactEmail?: string;
  additionalNotes?: string;
};

export type DonorResponsePublic = {
  _id: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  bloodGroup: BloodGroup;
  availableDate: string;
  availableTime: string;
  preferredHospital: string;
  status: DonorResponseStatus;
  isSelected: boolean;
  previousDonations?: number;
  notes?: string | null;
  respondedAt: string;
};
