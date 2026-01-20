import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BloodRequest } from "@/lib/models/blood-request";
import { bloodRequestUpdateSchema } from "@/lib/validations/blood-request";
import { isAdminRequest } from "@/lib/admin-auth";
import { triggerBroadcast } from "@/lib/n8n";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const parsed = bloodRequestUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { message: parsed.error.errors[0]?.message ?? "Invalid data" },
      },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const updated = await BloodRequest.findOneAndUpdate(
    { requestId: params.requestId, status: { $ne: "fulfilled" } },
    {
      ...parsed.data,
      status: "approved",
      approvedAt: new Date(),
      rejectionReason: null,
    },
    { new: true }
  );

  if (!updated) {
    return NextResponse.json(
      { success: false, error: { message: "Request not found" } },
      { status: 404 }
    );
  }

  try {
    await triggerBroadcast(updated);
  } catch (error) {
    console.error("Failed to trigger n8n broadcast", error);
  }

  return NextResponse.json({
    success: true,
    data: { request: updated },
  });
}
