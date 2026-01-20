import { AdminRequestsTable } from "@/components/admin-requests-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Requests Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">
            Review pending requests, approve broadcasts, and track donor
            responses in real time.
          </p>
        </CardContent>
      </Card>
      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>All Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminRequestsTable />
        </CardContent>
      </Card>
    </div>
  );
}
