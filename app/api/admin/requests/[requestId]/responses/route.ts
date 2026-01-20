import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { DonorResponse } from "@/lib/models/donor-response";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  await connectToDatabase();

  const responses = await DonorResponse.find({ requestId: params.requestId })
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({
    success: true,
    data: {
      responses: responses.map((response) => ({
        _id: response._id,
        donorName: response.donorName,
        donorEmail: response.donorEmail,
        donorPhone: response.donorPhone,
        bloodGroup: response.bloodGroup,
        availableDate: response.availableDate,
        availableTime: response.availableTime,
        preferredHospital: response.preferredHospital,
        status: response.status,
        isSelected: response.isSelected,
        previousDonations: response.previousDonations,
        notes: response.notes,
        respondedAt: response.respondedAt,
      })),
    },
  });
}
