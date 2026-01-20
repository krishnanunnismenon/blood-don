import { NextResponse, type NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BloodRequest } from "@/lib/models/blood-request";
import { isAdminRequest } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json(
      { success: false, error: { message: "Unauthorized" } },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const bloodGroup = searchParams.get("bloodGroup");
  const urgency = searchParams.get("urgency");
  const search = searchParams.get("search");
  const requestId = searchParams.get("requestId");
  const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") ?? 20), 1), 50);

  const query: Record<string, unknown> = {};

  if (status) {
    query.status = status;
  }
  if (bloodGroup) {
    query.bloodGroup = bloodGroup;
  }
  if (urgency) {
    query.urgency = urgency;
  }
  if (requestId) {
    query.requestId = requestId;
  }
  if (search) {
    query.$or = [
      { requestId: new RegExp(search, "i") },
      { patientName: new RegExp(search, "i") },
    ];
  }

  await connectToDatabase();

  const total = await BloodRequest.countDocuments(query);
  const requests = await BloodRequest.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const mapped = requests.map((item) => ({
    requestId: item.requestId,
    patientName: item.patientName,
    bloodGroup: item.bloodGroup,
    unitsRequired: item.unitsRequired,
    hospital: item.hospital,
    status: item.status,
    urgency: item.urgency,
    createdAt: item.createdAt?.toISOString?.() ?? item.createdAt,
    contactNumber: item.contactNumber,
    contactEmail: item.contactEmail,
    additionalNotes: item.additionalNotes,
  }));

  return NextResponse.json({
    success: true,
    data: {
      requests: mapped,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
}
