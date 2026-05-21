"use client";

import React from "react";
import { Map } from "lucide-react";
import KpiCards from "@/components/KpiCards";
import AiAlertPanel from "@/components/AiAlertPanel";
import MapWrapper from "@/components/MapWrapper";
import { useDashboard } from "@/lib/DashboardContext";

export default function DashboardPage() {
  const { shipments, alerts, handleReroute } = useDashboard();

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KpiCards shipments={shipments} />

      {/* Route Intelligence Map */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col h-[420px] lg:h-[580px]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Map className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Route Intelligence Center
              </h3>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Live routes plotted: {shipments.length}
            </span>
          </div>
          <div className="flex-1">
            <MapWrapper shipments={shipments} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <AiAlertPanel alerts={alerts} onTriggerReroute={handleReroute} />
        </div>
      </div>
    </div>
  );
}
