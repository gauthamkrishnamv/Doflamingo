import React from "react";
import { Truck, Clock, AlertTriangle, PackageOpen, TrendingUp, TrendingDown } from "lucide-react";

interface Shipment {
  id: string;
  source: string;
  destination: string;
  status: string;
  delayHours: number;
  riskLevel: string;
  inventoryStatus: string;
  cargoType: string;
}

interface KpiCardsProps {
  shipments: Shipment[];
}

export default function KpiCards({ shipments }: KpiCardsProps) {
  // Compute metrics dynamically
  const totalShipments = shipments.length;
  const delayedShipments = shipments.filter((s) => s.status === "Delayed").length;
  const highRiskShipments = shipments.filter((s) => s.riskLevel === "HIGH").length;
  const inventoryAlerts = shipments.filter((s) => s.inventoryStatus !== "Normal").length;

  const cardData = [
    {
      title: "Total Shipments",
      value: totalShipments,
      trend: "+12.4% vs last week",
      trendUp: true,
      icon: Truck,
      colorClass: "text-cyan-400",
      bgGlow: "glow-cyan",
      borderAccent: "border-cyan-500/20",
      accentBg: "bg-cyan-500/10",
    },
    {
      title: "Delayed Shipments",
      value: delayedShipments,
      trend: "+4.1% vs last week",
      trendUp: true,
      icon: Clock,
      colorClass: "text-orange-400",
      bgGlow: "glow-orange",
      borderAccent: "border-orange-500/20",
      accentBg: "bg-orange-500/10",
    },
    {
      title: "High Risk Shipments",
      value: highRiskShipments,
      trend: "-15.2% vs last week",
      trendUp: false,
      icon: AlertTriangle,
      colorClass: "text-rose-400",
      bgGlow: "glow-red",
      borderAccent: "border-rose-500/20",
      accentBg: "bg-rose-500/10",
    },
    {
      title: "Inventory Alerts",
      value: inventoryAlerts,
      trend: "6 critical items",
      trendUp: false,
      icon: PackageOpen,
      colorClass: "text-emerald-400",
      bgGlow: "glow-green",
      borderAccent: "border-emerald-500/20",
      accentBg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {cardData.map((card, i) => {
        const Icon = card.icon;
        return (
          <div
            key={i}
            className={`cyber-card p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between ${card.bgGlow}`}
          >
            {/* Top Row: Title and Icon */}
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {card.title}
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">
                  {card.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-xl ${card.accentBg} ${card.colorClass} border ${card.borderAccent} shadow-sm`}>
                <Icon className="w-5 h-5 animate-pulse" />
              </div>
            </div>

            {/* Bottom Row: Trend and decorative graphics */}
            <div className="flex justify-between items-center mt-6">
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                {card.trendUp ? (
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 text-rose-400" />
                )}
                <span>{card.trend}</span>
              </span>

              {/* Decorative corner light strip */}
              <div className={`absolute bottom-0 right-0 w-24 h-1 bg-gradient-to-r from-transparent to-current ${card.colorClass} opacity-60`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
