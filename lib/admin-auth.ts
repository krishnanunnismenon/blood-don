import type { NextRequest } from "next/server";

export function isAdminRequest(request: NextRequest) {
  const adminSecret = process.env.ADMIN_SECRET;
  if (!adminSecret) {
    return true;
  }

  const headerSecret = request.headers.get("x-admin-secret");
  return headerSecret === adminSecret;
}
