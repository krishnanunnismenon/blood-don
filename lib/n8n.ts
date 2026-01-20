import type { BloodRequestDocument } from "@/lib/models/blood-request";

const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;
const N8N_THANKYOU_WEBHOOK_URL = process.env.N8N_THANKYOU_WEBHOOK_URL;
const N8N_WEBHOOK_SECRET = process.env.N8N_WEBHOOK_SECRET;

function buildHeaders() {
  return {
    "Content-Type": "application/json",
    ...(N8N_WEBHOOK_SECRET ? { "x-n8n-secret": N8N_WEBHOOK_SECRET } : {}),
  };
}

export async function triggerBroadcast(request: BloodRequestDocument) {
  if (!N8N_WEBHOOK_URL) {
    return { skipped: true, reason: "N8N_WEBHOOK_URL not set" };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const responseUrl = `${appUrl}/request/${request.requestId}`;

  const payload = {
    requestId: request.requestId,
    patientName: request.patientName,
    bloodGroup: request.bloodGroup,
    unitsRequired: request.unitsRequired,
    hospital: request.hospital,
    urgency: request.urgency,
    responseUrl,
  };

  const response = await fetch(N8N_WEBHOOK_URL, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return { ok: response.ok, status: response.status };
}

export async function triggerThankYou(request: BloodRequestDocument) {
  if (!N8N_THANKYOU_WEBHOOK_URL) {
    return { skipped: true, reason: "N8N_THANKYOU_WEBHOOK_URL not set" };
  }

  const payload = {
    requestId: request.requestId,
    patientName: request.patientName,
    bloodGroup: request.bloodGroup,
  };

  const response = await fetch(N8N_THANKYOU_WEBHOOK_URL, {
    method: "POST",
    headers: buildHeaders(),
    body: JSON.stringify(payload),
  });

  return { ok: response.ok, status: response.status };
}

export function verifyN8nSecret(secret: string | null) {
  if (!N8N_WEBHOOK_SECRET) {
    return true;
  }

  return secret === N8N_WEBHOOK_SECRET;
}
