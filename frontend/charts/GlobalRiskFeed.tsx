"use client";

import React, { useState, useEffect } from "react";
import { Card, Tag, Badge, Typography } from "antd";
import {
  Globe,
  Clock,
  Radio,
  MapPin,
  ChevronRight,
} from "lucide-react";
import riskNewsData from "../data/globalRiskNews.json";

const { Paragraph } = Typography;

interface RiskNewsItem {
  id: string;
  riskLevel: "HIGH" | "MEDIUM" | "LOW";
  headline: string;
  summary: string;
  impacts: string[];
  affectedSectors: string[];
  timestamp: string;
  region: string;
}

const riskConfig = {
  HIGH: {
    border: "border-red-500/50",
    glow: "glow-red",
    tagColor: "red" as const,
    dotBg: "bg-red-500",
    textColor: "text-red-400",
    bgHint: "bg-red-500/[0.03]",
    label: "HIGH",
    pulseClass: "animate-pulse-red",
    indicator: "error" as const,
  },
  MEDIUM: {
    border: "border-orange-500/50",
    glow: "glow-orange",
    tagColor: "orange" as const,
    dotBg: "bg-orange-500",
    textColor: "text-orange-400",
    bgHint: "bg-orange-500/[0.03]",
    label: "MEDIUM",
    pulseClass: "animate-pulse-orange",
    indicator: "warning" as const,
  },
  LOW: {
    border: "border-green-500/50",
    glow: "glow-green",
    tagColor: "green" as const,
    dotBg: "bg-green-500",
    textColor: "text-green-400",
    bgHint: "bg-green-500/[0.03]",
    label: "LOW",
    pulseClass: "animate-pulse-green",
    indicator: "success" as const,
  },
};

export default function GlobalRiskFeed() {
  const [news, setNews] = useState<RiskNewsItem[]>(
    riskNewsData as RiskNewsItem[]
  );
  const [lastUpdated, setLastUpdated] = useState("Just now");

  useEffect(() => {
    const interval = setInterval(() => {
      setNews((prev) => {
        const rotated = [...prev];
        const first = rotated.shift();
        if (first) rotated.push(first);
        return rotated;
      });
      setLastUpdated("Updated 1 min ago");
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const highCount = news.filter((n) => n.riskLevel === "HIGH").length;
  const mediumCount = news.filter((n) => n.riskLevel === "MEDIUM").length;
  const lowCount = news.filter((n) => n.riskLevel === "LOW").length;

  const tickerText = news
    .map(
      (item) =>
        `[${item.riskLevel}] ${item.headline}`
    )
    .join("  ◆  ");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Globe className="w-5 h-5 text-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full animate-pulse-green border-2 border-[#060b13]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">
                Global Supply Chain Risk Intelligence
              </h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-red-500/15 text-red-400 text-[10px] font-extrabold uppercase tracking-widest border border-red-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse-red" />
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time global disruption monitoring &amp; AI-powered risk assessment
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge
            status="error"
            text={<span className="text-red-400 text-xs font-semibold">{highCount} HIGH</span>}
          />
          <Badge
            status="warning"
            text={<span className="text-orange-400 text-xs font-semibold">{mediumCount} MED</span>}
          />
          <Badge
            status="success"
            text={<span className="text-green-400 text-xs font-semibold">{lowCount} LOW</span>}
          />
          <div className="h-4 w-px bg-white/10 mx-1" />
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
            <Clock className="w-3 h-3" />
            <span>{lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* News Ticker */}
      <div className="cyber-card rounded-xl overflow-hidden border border-white/5">
        <div className="flex items-center">
          <div className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/10 border-r border-white/5 shrink-0">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
              Flash
            </span>
          </div>
          <div className="overflow-hidden relative flex-1 px-4 py-2.5">
            <div
              className="ticker-scroll whitespace-nowrap text-xs text-slate-400"
            >
              {tickerText}&nbsp;&nbsp;◆&nbsp;&nbsp;{tickerText}
            </div>
          </div>
        </div>
      </div>

      {/* Risk Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {news.map((item, index) => {
          const cfg = riskConfig[item.riskLevel];
          return (
            <Card
              key={item.id}
              className={`
                cyber-card rounded-2xl overflow-hidden border-t-2 ${cfg.border} ${cfg.glow}
                hover:scale-[1.02] transition-all duration-300 ${cfg.bgHint}
                animate-fade-in-up
              `}
              style={{ animationDelay: `${index * 100}ms` }}
              bordered={false}
            >
              {/* Card Header: Risk Badge + Timestamp */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${cfg.dotBg} ${cfg.pulseClass}`}
                  />
                  <Tag
                    color={cfg.tagColor}
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0 border-0"
                  >
                    {cfg.label} Risk
                  </Tag>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-[10px]">
                  <Clock className="w-3 h-3" />
                  <span>{item.timestamp}</span>
                </div>
              </div>

              {/* Headline */}
              <h3 className="text-sm font-bold text-white mb-2 leading-relaxed">
                {item.headline}
              </h3>

              {/* Summary */}
              <Paragraph className="text-xs text-slate-400 mb-3 leading-relaxed">
                {item.summary}
              </Paragraph>

              {/* Potential Impacts */}
              <div className="mb-3">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Potential Impact
                </span>
                <ul className="space-y-1">
                  {item.impacts.map((impact, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-1.5 text-xs text-slate-300"
                    >
                      <ChevronRight
                        className={`w-3 h-3 ${cfg.textColor} mt-0.5 shrink-0`}
                      />
                      <span>{impact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Affected Sectors + Region */}
              <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/[0.04]">
                <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                {item.affectedSectors.map((sector) => (
                  <Tag
                    key={sector}
                    className="text-[10px] border-white/10 bg-white/5 text-slate-300 rounded-md px-2 py-0"
                  >
                    {sector}
                  </Tag>
                ))}
                <span className="text-[10px] text-slate-600 ml-auto">
                  {item.region}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
