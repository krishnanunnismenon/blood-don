"use client";

import * as React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { bloodGroups, requestStatuses, urgencyLevels } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge, UrgencyBadge } from "@/components/status-badge";
import { BloodGroupBadge } from "@/components/blood-group-badge";
import { Button } from "@/components/ui/button";
import type { BloodRequestSummary } from "@/types";

const adminHeaders: HeadersInit = process.env.NEXT_PUBLIC_ADMIN_SECRET
  ? { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET }
  : {};

async function fetchRequests(params: URLSearchParams) {
  const response = await fetch(`/api/admin/requests?${params.toString()}`, {
    headers: adminHeaders,
  });

  if (!response.ok) {
    throw new Error("Failed to fetch requests");
  }

  const data = await response.json();
  return data.data as { requests: BloodRequestSummary[]; pagination: { total: number } };
}

export function AdminRequestsTable() {
  const [status, setStatus] = React.useState<string>("");
  const [bloodGroup, setBloodGroup] = React.useState<string>("");
  const [urgency, setUrgency] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");

  const params = React.useMemo(() => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", "1");
    searchParams.set("limit", "20");

    if (status) searchParams.set("status", status);
    if (bloodGroup) searchParams.set("bloodGroup", bloodGroup);
    if (urgency) searchParams.set("urgency", urgency);
    if (search) searchParams.set("search", search);

    return searchParams;
  }, [status, bloodGroup, urgency, search]);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-requests", params.toString()],
    queryFn: () => fetchRequests(params),
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <Input
          placeholder="Search by request ID or patient"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Select value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="">All statuses</option>
          {requestStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select value={bloodGroup} onChange={(event) => setBloodGroup(event.target.value)}>
          <option value="">All blood groups</option>
          {bloodGroups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </Select>
        <Select value={urgency} onChange={(event) => setUrgency(event.target.value)}>
          <option value="">All urgency</option>
          {urgencyLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {data?.pagination.total ?? 0} requests
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Refresh
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Request ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Blood Group</TableHead>
            <TableHead>Units</TableHead>
            <TableHead>Hospital</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Urgency</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={9}>Loading requests...</TableCell>
            </TableRow>
          )}
          {isError && (
            <TableRow>
              <TableCell colSpan={9}>Unable to load requests.</TableCell>
            </TableRow>
          )}
          {!isLoading && !isError && data?.requests.length === 0 && (
            <TableRow>
              <TableCell colSpan={9}>No requests found.</TableCell>
            </TableRow>
          )}
          {data?.requests.map((request) => (
            <TableRow key={request.requestId}>
              <TableCell className="font-medium text-slate-900">
                {request.requestId}
              </TableCell>
              <TableCell>{request.patientName}</TableCell>
              <TableCell>
                <BloodGroupBadge bloodGroup={request.bloodGroup} />
              </TableCell>
              <TableCell>{request.unitsRequired}</TableCell>
              <TableCell>{request.hospital}</TableCell>
              <TableCell>
                <StatusBadge status={request.status} />
              </TableCell>
              <TableCell>
                <UrgencyBadge urgency={request.urgency} />
              </TableCell>
              <TableCell>
                {new Date(request.createdAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Link href={`/admin/requests/${request.requestId}`} className="text-sm text-red-600 hover:underline">
                  View
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
