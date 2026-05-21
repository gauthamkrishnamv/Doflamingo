"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Truck, 
  TrendingUp, 
  Sparkles, 
  Bell, 
  Settings as SettingsIcon,
  Activity
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { id: "shipments", label: "Shipments", icon: Truck, href: "/shipments" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, href: "/analytics" },
    { id: "insights", label: "AI Insights", icon: Sparkles, href: "/ai-insights" },
    { id: "alerts", label: "Alerts", icon: Bell, href: "/alerts" },
    { id: "settings", label: "Settings", icon: SettingsIcon, href: "/settings" },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r border-[rgba(255,255,255,0.08)] bg-[#070d19]/90 backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-20 border-b border-[rgba(255,255,255,0.08)]">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Activity className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-400">
              ChainPulse AI
            </div>
            <div className="text-[10px] text-cyan-400 font-semibold uppercase tracking-widest leading-none">
              Control System
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 text-left group cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-[rgba(6,182,212,0.15)] to-[rgba(99,102,241,0.05)] border border-[rgba(6,182,212,0.3)] shadow-[0_0_15px_rgba(6,182,212,0.1)] text-cyan-400"
                    : "border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                  isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-300"
                }`} />
                <span className="font-medium text-sm tracking-wide">{item.label}</span>
                
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* System Status Footer */}
        <div className="p-4 border-t border-[rgba(255,255,255,0.08)] bg-black/20">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/40 border border-white/[0.04]">
            <div className="relative">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-slate-300">All Systems Nominal</div>
              <div className="text-[10px] text-slate-500">Latency: 14ms • v1.2.0</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
