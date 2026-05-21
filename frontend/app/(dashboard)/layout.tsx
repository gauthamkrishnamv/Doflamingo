"use client";

import React, { useState } from "react";
import { ShieldCheck, Clock } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { DashboardProvider } from "@/lib/DashboardContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <DashboardProvider>
      <div className="min-h-screen bg-[#060b13] flex">
        <Sidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
        />
        <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
          <Navbar
            onToggleSidebar={() => setSidebarOpen((p) => !p)}
            sidebarOpen={sidebarOpen}
          />
          <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
            {/* Dashboard Header Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.04] pb-4">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>COMMAND CENTRE CONTROL DECK</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-extrabold uppercase border border-emerald-500/20 tracking-wider">
                    Operational
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Overview of national transport logs, threat alerts, and automated reroutes
                </p>
              </div>
              <div className="flex items-center gap-3 self-start md:self-auto text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1423]/60 border border-white/[0.06]">
                  <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                  <span>SSL Secured</span>
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1423]/60 border border-white/[0.06]">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    UTC Time:{" "}
                    {new Date().toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </span>
              </div>
            </div>
            {/* Page Content */}
            {children}
          </main>
        </div>
      </div>
    </DashboardProvider>
  );
}
