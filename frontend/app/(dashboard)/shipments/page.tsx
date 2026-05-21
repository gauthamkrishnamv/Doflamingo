"use client";

import React from "react";
import ShipmentTable from "@/components/ShipmentTable";
import { useDashboard } from "@/lib/DashboardContext";

export default function ShipmentsPage() {
  const { shipments, searchQuery } = useDashboard();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Active Consignments
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Detailed operational registry, custom query, and delay trackers.
          </p>
        </div>
      </div>
      <ShipmentTable shipments={shipments} searchQuery={searchQuery} />
    </div>
  );
}
