"use client";

import React from "react";
import { Sliders } from "lucide-react";
import { notification } from "antd";

export default function SettingsPage() {
  return (
    <div className="cyber-card rounded-2xl p-6 max-w-2xl">
      <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
        <Sliders className="w-5 h-5 text-cyan-400" />
        Operational Config Parameters
      </h3>
      <p className="text-xs text-slate-400 mb-6">
        Adjust system warning values for risk detection.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            High Risk Trigger Threshold (Hours Delayed)
          </label>
          <input
            type="number"
            defaultValue={24}
            className="bg-[#0b101c] border border-white/[0.08] text-slate-300 text-xs rounded p-2 w-full focus:border-cyan-500/50 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2">
            Weather Feed Integration
          </label>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse-green" />
            <span className="text-xs text-slate-400">
              OpenWeatherMap Hub API: Connected
            </span>
          </div>
        </div>
        <div className="pt-4 border-t border-white/[0.08] flex justify-end">
          <button
            onClick={() => {
              notification.success({
                message: "Configuration Saved",
                description:
                  "Operational system settings updated successfully.",
                placement: "topRight",
              });
            }}
            className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-600 active:scale-95 text-black font-bold text-xs cursor-pointer transition-all"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
