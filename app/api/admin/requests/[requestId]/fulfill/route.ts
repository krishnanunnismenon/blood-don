import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BloodRequest } from "@/lib/models/blood-request";
import { isAdminRequest } from "@/lib/admin-auth";
import { triggerThankYou } from "@/lib/n8n";

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

  await connectToDatabase();

  const updated = await BloodRequest.findOneAndUpdate(
    { requestId: params.requestId, status: "approved" },
    {
      status: "fulfilled",
      fulfilledAt: new Date(),
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
    await triggerThankYou(updated);
  } catch (error) {
    console.error("Failed to trigger n8n thank you", error);
  }

  return NextResponse.json({ success: true, data: { request: updated } });
}
