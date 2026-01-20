import { NextResponse, type NextRequest } from "next/server";
import { nanoid } from "nanoid";
import { connectToDatabase } from "@/lib/mongodb";
import { BloodRequest } from "@/lib/models/blood-request";
import { bloodRequestCreateSchema } from "@/lib/validations/blood-request";
import { rateLimit } from "@/lib/rate-limit";

const REQUEST_LIMIT = 5;
const REQUEST_WINDOW_MS = 60 * 60 * 1000;

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = rateLimit(`request:${ip}`, REQUEST_LIMIT, REQUEST_WINDOW_MS);

  if (!limit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: { message: "Too many requests. Please try again later." },
      },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = bloodRequestCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: { message: parsed.error.errors[0]?.message ?? "Invalid request" },
      },
      { status: 400 }
    );
  }

  await connectToDatabase();

  const requestId = `BR-${nanoid(6).toUpperCase()}`;

  await BloodRequest.create({
    ...parsed.data,
    requestId,
    ipAddress: ip,
    userAgent: request.headers.get("user-agent") ?? "unknown",
  });

  return NextResponse.json({
    success: true,
    data: {
      requestId,
      message: "Request submitted successfully",
    },
  });
}
