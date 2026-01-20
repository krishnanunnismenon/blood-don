import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BloodRequest } from "@/lib/models/blood-request";
import { DonorResponse } from "@/lib/models/donor-response";
import { donorResponseSchema } from "@/lib/validations/donor-response";

export async function POST(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  const body = await request.json().catch(() => null);
  const parsed = donorResponseSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { message: parsed.error.errors[0]?.message ?? "Invalid response" },
      },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const bloodRequest = await BloodRequest.findOne({
    requestId: params.requestId,
    status: "approved",
  });

  if (!bloodRequest) {
    return NextResponse.json(
      { success: false, error: { message: "Request is not accepting responses" } },
      { status: 404 }
    );
  }

  const existing = await DonorResponse.findOne({
    requestId: params.requestId,
    donorEmail: parsed.data.donorEmail.toLowerCase(),
  });

  if (existing) {
    return NextResponse.json(
      { success: false, error: { message: "You already responded to this request" } },
      { status: 409 }
    );
  }

  const responseDoc = await DonorResponse.create({
    ...parsed.data,
    donorEmail: parsed.data.donorEmail.toLowerCase(),
    requestId: params.requestId,
    bloodRequestObjectId: bloodRequest._id,
  });

  return NextResponse.json({
    success: true,
    data: { responseId: responseDoc._id },
  });
}
