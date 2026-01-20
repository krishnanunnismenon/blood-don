import { AdminRequestDetails } from "@/components/admin-request-details";

export default function AdminRequestPage({
  params,
}: {
  params: { requestId: string };
}) {
  return <AdminRequestDetails requestId={params.requestId} />;
}
