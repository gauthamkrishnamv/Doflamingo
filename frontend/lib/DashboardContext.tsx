"use client";

import React, { createContext, useContext, useState, type ReactNode } from "react";
import { notification } from "antd";
import initialShipments from "@/data/shipments.json";
import initialAlerts from "@/data/alerts.json";

export interface Shipment {
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
  eta: string;
}

export interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  recommendation: string;
  priority: string;
  timestamp: string;
  shipmentId: string;
}

interface DashboardContextType {
  shipments: Shipment[];
  alerts: Alert[];
  handleReroute: (shipmentId: string, alertId: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [shipments, setShipments] = useState<Shipment[]>(
    initialShipments as Shipment[]
  );
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts as Alert[]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleReroute = (shipmentId: string, alertId: string) => {
    setShipments((prev) =>
      prev.map((s) =>
        s.id === shipmentId
          ? { ...s, status: "In Transit", delayHours: Math.max(0, s.delayHours - 12), riskLevel: "LOW" }
          : s
      )
    );
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
    notification.success({
      message: "AI Rerouting Initiated",
      description: `Shipment ${shipmentId} has been successfully rerouted. Route risk downgraded to LOW. Projected delay reduced by 12 hours.`,
      placement: "topRight",
      className: "cyber-notification",
      style: {
        background: "#0d1423",
        color: "#f3f4f6",
        border: "1px solid rgba(16, 185, 129, 0.3)",
        boxShadow: "0 0 10px rgba(16, 185, 129, 0.2)",
      },
    });
  };

  return (
    <DashboardContext.Provider
      value={{ shipments, alerts, handleReroute, searchQuery, setSearchQuery }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within DashboardProvider");
  return ctx;
}
