import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BloodRequest } from "@/lib/models/blood-request";
import { verifyN8nSecret } from "@/lib/n8n";

export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-n8n-secret");
  if (!verifyN8nSecret(secret)) {
    return NextResponse.json(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body?.requestId) {
    return NextResponse.json(
      { success: false, error: { message: "Invalid payload" } },
      { status: 400 }
    );
  }

  await connectToDatabase();

  await BloodRequest.findOneAndUpdate(
    { requestId: body.requestId },
    {
      n8nWorkflowExecutionId: body.executionId ?? null,
      broadcastedAt: new Date(),
    }
  );

  return NextResponse.json({ success: true });
}
