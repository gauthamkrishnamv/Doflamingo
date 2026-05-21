"use client";

import React from "react";
import { Bell, Search, Menu, X, Shield, Globe, Power } from "lucide-react";
import { Badge, Dropdown, MenuProps } from "antd";
import { useDashboard } from "@/lib/DashboardContext";

interface NavbarProps {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}

export default function Navbar({ onToggleSidebar, sidebarOpen }: NavbarProps) {
  const { searchQuery, setSearchQuery } = useDashboard();
  const notificationsItems: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div className="p-2 max-w-xs">
          <div className="font-semibold text-rose-400 text-xs">CRITICAL DELAY</div>
          <p className="text-slate-300 text-xs mt-1">CP-1093 is delayed by 48h at Chennai hub.</p>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="p-2 max-w-xs border-t border-white/[0.06]">
          <div className="font-semibold text-amber-400 text-xs">WEATHER ALERT</div>
          <p className="text-slate-300 text-xs mt-1">Heavy rainfall predicted on Kerala route.</p>
        </div>
      ),
    },
    {
      key: "3",
      label: (
        <div className="p-2 text-center text-xs text-cyan-400 hover:underline cursor-pointer border-t border-white/[0.06]">
          View all logs
        </div>
      ),
    },
  ];

  const profileItems: MenuProps["items"] = [
    {
      key: "1",
      icon: <Shield className="w-4 h-4 text-cyan-400" />,
      label: <span className="text-slate-300 text-xs">Administrator Mode</span>,
    },
    {
      key: "2",
      icon: <Globe className="w-4 h-4 text-slate-400" />,
      label: <span className="text-slate-300 text-xs">HQ Connection: Active</span>,
    },
    {
      key: "3",
      danger: true,
      icon: <Power className="w-4 h-4 text-rose-500" />,
      label: <span className="text-rose-500 text-xs font-semibold">Terminate Session</span>,
    },
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 h-20 border-b border-[rgba(255,255,255,0.08)] bg-[#060b13]/85 backdrop-blur-md">
      {/* Left side: Hamburger and Title */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.05] lg:hidden transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="hidden sm:block">
          <h1 className="font-bold text-xl tracking-tight text-white flex items-center gap-2">
            ChainPulse AI
            <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              PRO
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">Supply Chain Command Center</p>
        </div>
      </div>

      {/* Right side: Search, Notifications, Avatar */}
      <div className="flex items-center gap-5 flex-1 max-w-md justify-end sm:flex-none">
        {/* Search bar */}
        <div className="relative w-full max-w-[240px] md:max-w-[280px]">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search shipment / route..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0d1423]/70 text-slate-200 text-xs rounded-full pl-9 pr-4 py-2 border border-white/[0.08] focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder-slate-500"
          />
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-3">
          {/* Notifications Dropdown */}
          <Dropdown menu={{ items: notificationsItems }} placement="bottomRight" arrow trigger={["click"]}>
            <button className="relative p-2 rounded-full border border-white/[0.08] bg-[#0d1423]/50 text-slate-300 hover:text-white hover:border-cyan-500/30 transition-all cursor-pointer">
              <Badge count={2} size="small" offset={[2, -2]}>
                <Bell className="w-4 h-4 text-slate-300" />
              </Badge>
            </button>
          </Dropdown>

          {/* User Profile */}
          <Dropdown menu={{ items: profileItems }} placement="bottomRight" arrow trigger={["click"]}>
            <div className="flex items-center gap-2 cursor-pointer group pl-2 border-l border-white/[0.08]">
              <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 via-cyan-500 to-emerald-400 p-[1.5px] transition-transform duration-300 group-hover:rotate-6">
                <div className="w-full h-full rounded-full bg-[#0d1423] flex items-center justify-center text-xs font-bold text-cyan-400">
                  JD
                </div>
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-slate-200 leading-tight">John Doe</div>
                <div className="text-[10px] text-slate-500 leading-none">Ops Director</div>
              </div>
            </div>
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
