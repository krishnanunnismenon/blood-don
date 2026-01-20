import { NextResponse, type NextRequest } from "next/server";
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

  console.error("n8n broadcast failed", body);
  return NextResponse.json({ success: true });
}
