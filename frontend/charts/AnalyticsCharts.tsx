"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";
import { BarChart3, PieChartIcon, TrendingUp } from "lucide-react";

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

interface AnalyticsChartsProps {
  shipments: Shipment[];
}

export default function AnalyticsCharts({ shipments }: AnalyticsChartsProps) {
  // 1. Compute Risk Level Counts for Pie Chart
  const riskCounts = shipments.reduce((acc, curr) => {
    acc[curr.riskLevel] = (acc[curr.riskLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const riskData = [
    { name: "HIGH Risk", value: riskCounts["HIGH"] || 0, color: "#ef4444" },
    { name: "MEDIUM Risk", value: riskCounts["MEDIUM"] || 0, color: "#f97316" },
    { name: "LOW Risk", value: riskCounts["LOW"] || 0, color: "#10b981" },
  ];

  // 2. Filter Delayed Shipments for Bar Chart
  const delayedData = shipments
    .filter((s) => s.delayHours > 0)
    .map((s) => ({
      id: s.id,
      route: `${s.source} → ${s.destination.substring(0, 3)}`,
      delay: s.delayHours,
    }))
    .sort((a, b) => b.delay - a.delay);

  // 3. Mock Inventory Trend Levels (over past 7 days)
  const inventoryTrendData = [
    { day: "Mon", electronics: 82, pharma: 45, machinery: 60 },
    { day: "Tue", electronics: 78, pharma: 52, machinery: 58 },
    { day: "Wed", electronics: 70, pharma: 75, machinery: 64 },
    { day: "Thu", electronics: 65, pharma: 68, machinery: 72 },
    { day: "Fri", electronics: 55, pharma: 60, machinery: 80 },
    { day: "Sat", electronics: 68, pharma: 58, machinery: 82 },
    { day: "Sun", electronics: 85, pharma: 62, machinery: 79 },
  ];

  // Custom Glassmorphism Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0b101c]/95 border border-white/[0.08] backdrop-blur-md rounded-xl p-3.5 shadow-xl text-xs">
          {label && <p className="font-bold text-white mb-1.5">{label}</p>}
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 mt-1">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              <span className="text-slate-400">{entry.name}:</span>
              <span className="font-bold text-white">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* 1. Risk Distribution Pie Chart */}
      <div className="cyber-card rounded-2xl p-5 flex flex-col h-[340px]">
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white tracking-wide">Risk Distribution Spectrum</h4>
        </div>
        <div className="flex-1 min-h-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                formatter={(value) => <span className="text-xs text-slate-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2. Shipment Delay Bar Chart */}
      <div className="cyber-card rounded-2xl p-5 flex flex-col h-[340px]">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white tracking-wide">Shipment Latency Chart (Hours)</h4>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={delayedData} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis
                dataKey="id"
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="delay" fill="url(#delayGrad)" radius={[4, 4, 0, 0]}>
                {delayedData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.delay > 24 ? "url(#highRiskGrad)" : "url(#mediumRiskGrad)"}
                  />
                ))}
              </Bar>
              <defs>
                <linearGradient id="highRiskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#b91c1c" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="mediumRiskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#c2410c" stopOpacity={0.2} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. Inventory Trend Line/Area Chart */}
      <div className="cyber-card rounded-2xl p-5 flex flex-col h-[340px]">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white tracking-wide">Weekly Warehouse Inventory Trend</h4>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={inventoryTrendData} margin={{ left: -10, right: 10, top: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="electronicsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="pharmaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={30}
                iconType="circle"
                formatter={(value) => <span className="text-xs text-slate-400 capitalize">{value}</span>}
              />
              <Area
                type="monotone"
                dataKey="electronics"
                name="Electronics"
                stroke="#06b6d4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#electronicsGrad)"
              />
              <Area
                type="monotone"
                dataKey="pharma"
                name="Pharmaceuticals"
                stroke="#a855f7"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#pharmaGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
