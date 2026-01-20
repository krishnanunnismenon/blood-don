"use client";

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import type { DonorResponsePublic } from "@/types";

const adminHeaders: HeadersInit = process.env.NEXT_PUBLIC_ADMIN_SECRET
  ? { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET }
  : {};

async function fetchResponses(requestId: string) {
  const response = await fetch(`/api/admin/requests/${requestId}/responses`, {
    headers: adminHeaders,
  });
  if (!response.ok) {
    throw new Error("Failed to fetch responses");
  }
  const data = await response.json();
  return data.data.responses as DonorResponsePublic[];
}

export function DonorResponsesList({ requestId }: { requestId: string }) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["donor-responses", requestId],
    queryFn: () => fetchResponses(requestId),
  });

  const handleAccept = async (responseId: string) => {
    try {
      const response = await fetch(`/api/admin/responses/${responseId}/accept`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...adminHeaders },
      });
      const payload = await response.json();
      if (!response.ok) {
        toast.error(payload?.error?.message ?? "Unable to accept response");
        return;
      }
      toast.success("Donor response accepted");
      refetch();
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Donor</TableHead>
          <TableHead>Contact</TableHead>
          <TableHead>Availability</TableHead>
          <TableHead>Hospital</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={6}>Loading responses...</TableCell>
          </TableRow>
        )}
        {isError && (
          <TableRow>
            <TableCell colSpan={6}>Unable to load responses.</TableCell>
          </TableRow>
        )}
        {!isLoading && !isError && data?.length === 0 && (
          <TableRow>
            <TableCell colSpan={6}>No donor responses yet.</TableCell>
          </TableRow>
        )}
        {data?.map((response) => (
          <TableRow key={response._id}>
            <TableCell>
              <p className="font-medium text-slate-900">{response.donorName}</p>
              <p className="text-xs text-slate-500">{response.bloodGroup}</p>
            </TableCell>
            <TableCell>
              <p>{response.donorEmail}</p>
              <p className="text-xs text-slate-500">{response.donorPhone}</p>
            </TableCell>
            <TableCell>
              <p>{new Date(response.availableDate).toLocaleDateString()}</p>
              <p className="text-xs text-slate-500">{response.availableTime}</p>
            </TableCell>
            <TableCell>{response.preferredHospital}</TableCell>
            <TableCell>{response.status}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAccept(response._id)}
                disabled={response.status === "accepted"}
              >
                {response.status === "accepted" ? "Accepted" : "Accept"}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
