import React, { useState } from "react";
import { Table, Tag, Badge, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Truck, MapPin, AlertCircle, Calendar } from "lucide-react";

interface Shipment {
  id: string;
  source: string;
  destination: string;
  status: string;
  delayHours: number;
  riskLevel: string;
  inventoryStatus: string;
  cargoType: string;
  eta: string;
}

interface ShipmentTableProps {
  shipments: Shipment[];
  searchQuery: string;
}

export default function ShipmentTable({ shipments, searchQuery }: ShipmentTableProps) {
  // Filter shipments based on search query
  const filteredData = shipments.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.id.toLowerCase().includes(query) ||
      item.source.toLowerCase().includes(query) ||
      item.destination.toLowerCase().includes(query) ||
      item.cargoType.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
    );
  });

  const columns: ColumnsType<Shipment> = [
    {
      title: "Shipment ID",
      dataIndex: "id",
      key: "id",
      sorter: (a, b) => a.id.localeCompare(b.id),
      render: (text) => (
        <div className="flex items-center gap-2 font-mono font-semibold text-cyan-400">
          <Truck className="w-3.5 h-3.5" />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Route",
      key: "route",
      render: (_, record) => (
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-200">{record.source}</span>
          <span className="text-slate-500">→</span>
          <span className="text-slate-300 font-semibold">{record.destination}</span>
        </div>
      ),
    },
    {
      title: "Cargo Type",
      dataIndex: "cargoType",
      key: "cargoType",
      responsive: ["md"],
      render: (text) => <span className="text-xs text-slate-400">{text}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "In Transit", value: "In Transit" },
        { text: "Delayed", value: "Delayed" },
        { text: "Out for Delivery", value: "Out for Delivery" },
        { text: "Delivered", value: "Delivered" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        let badgeStatus: "success" | "warning" | "error" | "processing" = "processing";
        if (status === "Delayed") badgeStatus = "error";
        if (status === "Out for Delivery") badgeStatus = "warning";
        if (status === "Delivered") badgeStatus = "success";

        return (
          <div className="flex items-center gap-1.5">
            <Badge status={badgeStatus} />
            <span className="text-xs font-medium text-slate-200">{status}</span>
          </div>
        );
      },
    },
    {
      title: "Delay Hours",
      dataIndex: "delayHours",
      key: "delayHours",
      sorter: (a, b) => a.delayHours - b.delayHours,
      render: (hours) => (
        <span className={`text-xs font-semibold font-mono ${hours > 24 ? "text-rose-400" : hours > 0 ? "text-orange-400" : "text-slate-400"}`}>
          {hours > 0 ? `+${hours} hrs` : "On Time"}
        </span>
      ),
    },
    {
      title: "Risk Level",
      dataIndex: "riskLevel",
      key: "riskLevel",
      filters: [
        { text: "HIGH", value: "HIGH" },
        { text: "MEDIUM", value: "MEDIUM" },
        { text: "LOW", value: "LOW" },
      ],
      onFilter: (value, record) => record.riskLevel === value,
      render: (risk) => {
        let color = "green";
        let glowClass = "glow-green";
        if (risk === "HIGH") {
          color = "red";
          glowClass = "glow-red animate-pulse-red";
        } else if (risk === "MEDIUM") {
          color = "orange";
          glowClass = "glow-orange animate-pulse-orange";
        }

        return (
          <div className="inline-flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full bg-${color === "red" ? "rose" : color === "orange" ? "orange" : "emerald"}-500 ${glowClass}`} />
            <span className={`text-xs font-extrabold uppercase tracking-wide text-${color === "red" ? "rose" : color === "orange" ? "orange" : "emerald"}-400`}>
              {risk}
            </span>
          </div>
        );
      },
    },
    {
      title: "Inventory Status",
      dataIndex: "inventoryStatus",
      key: "inventoryStatus",
      render: (inventory) => {
        let color = "blue";
        if (inventory === "Normal") color = "success";
        else if (inventory === "Shortage") color = "error";
        else if (inventory === "Re-order") color = "warning";
        else if (inventory === "Surplus") color = "processing";

        return (
          <Tag color={color === "success" ? "rgba(16, 185, 129, 0.1)" : color === "error" ? "rgba(239, 68, 68, 0.1)" : color === "warning" ? "rgba(249, 115, 22, 0.1)" : "rgba(59, 130, 246, 0.1)"} className={`border-none ${color === "success" ? "text-emerald-400" : color === "error" ? "text-rose-400" : color === "warning" ? "text-orange-400" : "text-blue-400"} text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded`}>
            {inventory}
          </Tag>
        );
      },
    },
    {
      title: "ETA",
      dataIndex: "eta",
      key: "eta",
      responsive: ["lg"],
      render: (dateStr) => {
        const date = new Date(dateStr);
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>{date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        );
      },
    },
  ];

  return (
    <div className="cyber-card rounded-2xl overflow-hidden p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h4 className="text-base font-bold text-white tracking-wide">Shipment Monitoring Matrix</h4>
          <p className="text-xs text-slate-400">Live operational registry of active transport contracts</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 border border-cyan-500/20 bg-cyan-500/5 px-3 py-1 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse-cyan" />
          <span>Active Operations: {filteredData.length}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={filteredData.map((item, index) => ({ ...item, key: item.id }))}
          pagination={{ pageSize: 5 }}
          className="dark-table-override"
          locale={{
            emptyText: (
              <div className="py-8 text-center text-slate-500">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <span>No active shipments found matching the query</span>
              </div>
            )
          }}
        />
      </div>
    </div>
  );
}
