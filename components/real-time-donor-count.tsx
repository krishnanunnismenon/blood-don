"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchDonorCount(requestId: string) {
  const response = await fetch(`/api/requests/${requestId}/donor-count`);
  if (!response.ok) {
    throw new Error("Failed to load donor count");
  }
  const data = await response.json();
  return data.data as { count: number; lastUpdated: string };
}

export function RealTimeDonorCount({ requestId }: { requestId: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["donor-count", requestId],
    queryFn: () => fetchDonorCount(requestId),
    refetchInterval: 10000,
  });

  if (isLoading) {
    return <p className="text-sm text-slate-500">Loading donor responses...</p>;
  }

  if (isError || !data) {
    return <p className="text-sm text-slate-500">Donor count unavailable.</p>;
  }

  return (
    <p className="text-sm text-slate-600">
      <span className="font-semibold text-slate-900">{data.count}</span> donors have responded
    </p>
  );
}
