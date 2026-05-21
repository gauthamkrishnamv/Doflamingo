import React from "react";
import { AlertCircle, CloudRain, ShieldAlert, Navigation, Clock, Activity } from "lucide-react";

interface Alert {
  id: string;
  type: string;
  title: string;
  description: string;
  recommendation: string;
  priority: string;
  timestamp: string;
  shipmentId: string;
}

interface AiAlertPanelProps {
  alerts: Alert[];
  onTriggerReroute?: (shipmentId: string, alertId: string) => void;
}

export default function AiAlertPanel({ alerts, onTriggerReroute }: AiAlertPanelProps) {
  return (
    <div className="cyber-card rounded-2xl p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
          <h4 className="text-base font-bold text-white tracking-wide">AI Live Threat Matrix</h4>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/25 text-[10px] font-bold text-rose-400 animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
          <span>{alerts.filter(a => a.priority === "HIGH").length} Critical threats</span>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-4 overflow-y-auto flex-1 max-h-[460px] pr-1">
        {alerts.map((alert) => {
          let priorityGlow = "glow-green border-emerald-500/20";
          let priorityTagBg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
          let Icon = AlertCircle;

          if (alert.priority === "HIGH") {
            priorityGlow = "glow-red border-rose-500/25";
            priorityTagBg = "bg-rose-500/10 text-rose-400 border-rose-500/20";
          } else if (alert.priority === "MEDIUM") {
            priorityGlow = "glow-orange border-orange-500/25";
            priorityTagBg = "bg-orange-500/10 text-orange-400 border-orange-500/20";
          }

          if (alert.type === "weather") Icon = CloudRain;
          if (alert.type === "delay" || alert.type === "congestion") Icon = Clock;
          if (alert.type === "inventory") Icon = ShieldAlert;

          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border bg-[#0d1423]/60 relative transition-transform duration-300 hover:scale-[1.01] ${priorityGlow}`}
            >
              {/* Alert Meta */}
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg bg-white/[0.04] text-slate-300`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{alert.title}</h5>
                    <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                  </div>
                </div>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${priorityTagBg}`}>
                  {alert.priority} Priority
                </span>
              </div>

              {/* Alert Content */}
              <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
                {alert.description}
              </p>

              {/* AI Recommendation */}
              <div className="mt-3 p-3 rounded bg-cyan-500/[0.04] border border-cyan-500/15 flex items-start gap-2">
                <div className="mt-0.5">
                  <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="flex-1">
                  <span className="text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider">
                    AI Auto-Recommendation:
                  </span>
                  <p className="text-xs text-cyan-200/90 mt-0.5 leading-relaxed">
                    {alert.recommendation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 mt-3">
                <button
                  onClick={() => onTriggerReroute && onTriggerReroute(alert.shipmentId, alert.id)}
                  className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-600 active:scale-95 text-black font-semibold text-[10px] flex items-center gap-1 cursor-pointer transition-all uppercase tracking-wider"
                >
                  <Navigation className="w-3 h-3 text-black fill-current" />
                  <span>Execute Reroute</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
