import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { DonorResponse } from "@/lib/models/donor-response";
import { isAdminRequest } from "@/lib/admin-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { responseId: string } }
) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  await connectToDatabase();

  const responseDoc = await DonorResponse.findByIdAndUpdate(
    params.responseId,
    { status: "accepted", isSelected: true },
    { new: true }
  );

  if (!responseDoc) {
    return NextResponse.json(
      { success: false, error: { message: "Response not found" } },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: { response: responseDoc } });
}
