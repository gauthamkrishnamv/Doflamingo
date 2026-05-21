"use client";

import dynamic from "next/dynamic";
import React from "react";

const LogisticsMap = dynamic(() => import("../maps/LogisticsMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] lg:min-h-[480px] rounded-2xl border border-white/[0.08] bg-[#070d19]/40 backdrop-blur-md flex flex-col items-center justify-center gap-3">
      <div className="relative w-12 h-12">
        {/* Loading Radar Animation */}
        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/10 border-t-cyan-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border border-dashed border-cyan-500/20 animate-spin-reverse" />
      </div>
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest animate-pulse mt-2">
        Initializing Spatial Engine...
      </span>
    </div>
  ),
});

interface Shipment {
  id: string;
  source: string;
  sourceCoords: [number, number];
  destination: string;
  destinationCoords: [number, number];
  status: string;
  delayHours: number;
  riskLevel: string;
  inventoryStatus: string;
  cargoType: string;
}

export default function MapWrapper({ shipments }: { shipments: Shipment[] }) {
  return <LogisticsMap shipments={shipments} />;
}
