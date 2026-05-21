"use client";

import React from "react";
import AiAlertPanel from "@/components/AiAlertPanel";
import { useDashboard } from "@/lib/DashboardContext";

export default function AlertsPage() {
  const { alerts, handleReroute } = useDashboard();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Active Disruption Log
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Real-time alerts triggered by external telemetry nodes.
        </p>
      </div>
      <div className="max-w-3xl">
        <AiAlertPanel alerts={alerts} onTriggerReroute={handleReroute} />
      </div>
    </div>
  );
}
