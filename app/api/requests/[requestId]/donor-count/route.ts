import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { DonorResponse } from "@/lib/models/donor-response";

export async function GET(
  _request: NextRequest,
  { params }: { params: { requestId: string } }
) {
  await connectToDatabase();

  const count = await DonorResponse.countDocuments({
    requestId: params.requestId,
  });

  const response = NextResponse.json({
    success: true,
    data: { count, lastUpdated: new Date().toISOString() },
  });

  response.headers.set("Cache-Control", "s-maxage=10, stale-while-revalidate=10");
  return response;
}
