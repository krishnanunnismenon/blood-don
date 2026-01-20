import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BloodRequest } from "@/lib/models/blood-request";
import { DonorResponse } from "@/lib/models/donor-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  await connectToDatabase();

  const request = await BloodRequest.findOne({
    requestId: params.requestId,
    status: { $in: ["approved", "fulfilled"] },
  }).lean();

  if (!request) {
    return NextResponse.json(
      { success: false, error: { message: "Request not found" } },
      { status: 404 }
    );
  }

  const donorCount = await DonorResponse.countDocuments({
    requestId: params.requestId,
  });

  const publicRequest = {
    requestId: request.requestId,
    patientName: request.patientName,
    bloodGroup: request.bloodGroup,
    unitsRequired: request.unitsRequired,
    hospital: request.hospital,
    urgency: request.urgency,
    status: request.status,
    additionalNotes: request.additionalNotes,
    approvedAt: request.approvedAt,
  };

  return NextResponse.json({
    success: true,
    data: { request: publicRequest, donorCount },
  });
}
