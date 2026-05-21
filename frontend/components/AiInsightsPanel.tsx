"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Card,
  Button,
  Input,
  Upload,
  Avatar,
  Tooltip,
  Spin,
  Typography,
} from "antd";
import {
  Bot,
  Send,
  Mic,
  Paperclip,
  Sparkles,
  User,
  UploadCloud,
  X,
} from "lucide-react";
import type { UploadProps } from "antd";

const { Text } = Typography;

// ---------- Mock AI Response Engine ----------

interface AIResponseEntry {
  keywords: string[];
  response: string;
  delay: number;
}

const responseMap: AIResponseEntry[] = [
  {
    keywords: ["shipment", "delay", "late", "delayed"],
    response:
      "Shipment Delay Analysis\n\nBased on current telemetry from your logistics network:\n\n• CP-1093 — Chennai Port: +14h delay (customs documentation pending)\n• CP-1096 — Kerala-Karnataka route: +12h (monsoon weather disruption)\n• CP-1098 — Mumbai-Pune expressway: minor +2h (within standard buffer)\n\nRecommendation:\nPre-schedule customs filings 24h prior for Chennai-bound shipments. Consider NH-48 alternate for Pune cargo to reduce congestion exposure.",
    delay: 2200,
  },
  {
    keywords: ["warehouse", "storage", "inventory", "stock", "capacity"],
    response:
      "Warehouse Optimization Report\n\nCurrent hub capacity status:\n\n• Kochi Hub — 78% capacity — Nominal\n• Chennai Hub — 94% capacity — Critical\n• Hyderabad Hub — 62% capacity — Available\n• Bangalore Hub — 15% safety stock — Alert\n\nSuggestion:\nTransfer 500 units of Category-A electronics from Chennai to Hyderabad within 48h to balance load and mitigate stockout risk at Bangalore.",
    delay: 2500,
  },
  {
    keywords: ["route", "optimiz", "delivery", "path", "reroute", "alternative"],
    response:
      "Route Optimization Results\n\nAnalysis of your active fleet suggests:\n\n• NH-48 alternative: 18% fuel savings for Pune-bound cargo\n• Mysore bypass: 2h saved for Kerala-Karnataka during monsoon\n• Krishnapatnam port: 3h faster clearance vs Chennai\n\nProjected Weekly Impact:\n• Fuel saved: ~1,200 litres\n• Path reduction: ~14.8%\n• Cost savings: ~₹84,000",
    delay: 2500,
  },
  {
    keywords: ["risk", "global", "supply chain", "disruption", "threat", "security"],
    response:
      "Global Supply Chain Risk Summary\n\nHIGH   Red Sea Crisis        — +22% freight costs, 10-14d delays\nHIGH   Kerala Flooding      — Port closed, cold chain at risk\nMEDIUM Singapore Congestion  — 3-5d berthing delays\nMEDIUM China Export Slowdown — -15% export volume\nLOW    US Warehouse         — Vacancy improving to 4.2%\n\nRecommended Actions:\n1. Reroute Red Sea cargo via Cape of Good Hope\n2. Activate Kerala emergency logistics protocol\n3. Consider Krishnapatnam as Chennai alternate port",
    delay: 3000,
  },
  {
    keywords: ["predict", "shortage", "forecast", "future", "trend"],
    response:
      "Predictive Intelligence Report\n\nForecasted risks in your supply chain (next 72h):\n\n• Delhi Hub: +38% congestion tomorrow (national holiday spillover)\n• Mumbai Port: Clearance queue dropping 45% — good window for scheduling\n• Bangalore: Electronics stock at 15% safety threshold — critical\n\nAction:\nRoute Delhi-bound shipments before 06:00 to beat queue buildup. Schedule Mumbai clearances within the next 12h window.",
    delay: 2800,
  },
  {
    keywords: ["bottleneck", "congestion", "traffic", "blockage", "throughput"],
    response:
      "Operational Bottleneck Analysis\n\nDetected bottlenecks in your logistics network:\n\n• Chennai Port — Customs clearance: avg 14h delay (documentation processing)\n• Delhi Hub — Inbound queue: +38% congestion expected tomorrow\n• Mumbai-Pune Expressway — Peak-hour throughput reduced by 22%\n• Bangalore Last-Mile — Delivery slot saturation at 91%\n\nRecommendations:\n1. Route Chennai cargo via Krishnapatnam (3h faster clearance)\n2. Schedule Delhi deliveries before 06:00 IST\n3. Activate secondary fleet for Bangalore last-mile overflow",
    delay: 2700,
  },
];

function findResponse(input: string): { response: string; delay: number } {
  const lower = input.toLowerCase();
  for (const entry of responseMap) {
    if (entry.keywords.some((kw) => lower.includes(kw))) {
      return { response: entry.response, delay: entry.delay };
    }
  }
  return {
    response:
      "I'm your logistics AI co-pilot. I can help with:\n\n• Shipment risk analysis — delay predictions, alternative routing\n• Warehouse optimization — capacity balancing, stock alerts\n• Route optimization — fuel savings, time reduction\n• Global risk intelligence — disruption monitoring, geopolitical impacts\n• Inventory forecasting — shortage predictions, redistribution\n• Bottleneck detection — congestion analysis, throughput optimization\n\nHow can I assist your operations today?",
    delay: 1200,
  };
}

// ---------- Suggested Prompts ----------

const SUGGESTED_PROMPTS = [
  "Analyze shipment delays",
  "Predict warehouse shortages",
  "Optimize delivery routes",
  "Summarize global supply chain risks",
  "Detect operational bottlenecks",
];

// ---------- Component ----------

export default function AiInsightsPanel() {
  const msgId = useRef(1);
  const [messages, setMessages] = useState<
    { id: string; role: "user" | "assistant"; content: string; timestamp: Date }[]
  >([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome aboard, Commander.\n\nI'm your ChainPulse AI logistics co-pilot. I have real-time access to your shipment telemetry, warehouse capacities, route data, and global risk intelligence. Ask me anything about your operations.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadZone, setShowUploadZone] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  const nextId = () => `msg-${msgId.current++}`;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addUserMessage = useCallback((text: string) => {
    const id = nextId();
    const userMsg = {
      id,
      role: "user" as const,
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    const { response, delay } = findResponse(text);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: "assistant",
          content: response,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, delay);
  }, []);

  const handleSend = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isTyping) return;
    setInputValue("");
    addUserMessage(text);
  }, [inputValue, isTyping, addUserMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (prompt: string) => {
    if (isTyping) return;
    addUserMessage(prompt);
  };

  const toggleListening = () => {
    setIsListening((prev) => !prev);
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        setInputValue((prev) => prev || "Analyze shipment delays");
      }, 3000);
    }
  };

  const handleUpload: UploadProps["beforeUpload"] = (file) => {
    setUploading(true);
    setUploadProgress(0);
    const fileName = file.name;
    const id = nextId();
    const timer = setInterval(() => {
      setUploadProgress((prev) => {
        const next = prev + 8;
        if (next >= 100) {
          clearInterval(timer);
          setUploading(false);
          setUploadProgress(0);
          setShowUploadZone(false);
          setMessages((prev) => [
            ...prev,
            {
              id,
              role: "assistant" as const,
              content: `File Processed: ${fileName}\n\nI've analyzed your uploaded file. Here's a quick summary:\n\n• Records found: 24\n• High-risk shipments: 3\n• Optimization opportunities: 5\n• Anomalies detected: 2\n\nWould you like me to elaborate on any specific section?`,
              timestamp: new Date(),
            },
          ]);
          return 0;
        }
        return next;
      });
    }, 200);
    return false;
  };

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <Card
      className="cyber-card rounded-2xl overflow-hidden !border-white/[0.06]"
      bordered={false}
      styles={{ body: { padding: 0, height: "100%", display: "flex", flexDirection: "column" } }}
    >
      <div className="flex flex-col relative" style={{ minHeight: 560 }}>
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

        {/* ===== Header ===== */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/[0.08] px-5 py-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-[0_0_12px_rgba(6,182,212,0.35)]">
              <Sparkles className="w-4 h-4 text-white animate-spin-slow" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white tracking-wide">🧠 AI Insights</h4>
              <p className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase font-mono">
                AI-powered Supply Chain Copilot
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-green" />
            <span className="text-[10px] text-emerald-400 font-semibold">Online</span>
          </div>
        </div>

        {/* ===== Chat Messages ===== */}
        <div
          ref={chatAreaRef}
          className="relative z-10 flex-1 overflow-y-auto px-5 py-4 space-y-4"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-start animate-fade-in-up`}
            >
              <Avatar
                size={32}
                className={`shrink-0 flex items-center justify-center ${
                  msg.role === "assistant"
                    ? "bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-cyan-500/30"
                    : "bg-slate-700/50 border border-white/10"
                }`}
                icon={
                  msg.role === "assistant" ? (
                    <Bot className="w-4 h-4 text-cyan-400" />
                  ) : (
                    <User className="w-4 h-4 text-slate-300" />
                  )
                }
              />

              <div
                className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-slate-900/60 border border-white/[0.06] text-slate-200"
                    : "bg-cyan-500/10 border border-cyan-500/20 text-cyan-100"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                <div
                  className={`text-[10px] mt-1.5 font-mono ${
                    msg.role === "assistant" ? "text-slate-600" : "text-cyan-700"
                  }`}
                >
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator with Spin */}
          {isTyping && (
            <div className="flex gap-3 items-start animate-fade-in-up">
              <Avatar
                size={32}
                className="shrink-0 bg-gradient-to-br from-cyan-500/20 to-indigo-600/20 border border-cyan-500/30"
                icon={<Bot className="w-4 h-4 text-cyan-400" />}
              />
              <div className="bg-slate-900/60 border border-white/[0.06] rounded-2xl px-5 py-3.5 flex items-center gap-3">
                <Spin size="small" className="[&_.ant-spin-dot-item]:bg-cyan-400" />
                <Text className="text-[11px] text-slate-500 font-mono">Analyzing supply chain data...</Text>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* ===== Upload Drag & Drop Zone ===== */}
        {showUploadZone && (
          <div className="relative z-10 px-5 py-3 border-t border-white/[0.04] animate-fade-in-up shrink-0">
            <div className="relative">
              <Upload.Dragger
                beforeUpload={handleUpload}
                showUploadList={false}
                accept=".csv,.pdf,.xlsx,.xls,.json,.xml"
                className="!bg-white/[0.02] !border-dashed !border-white/[0.12] !rounded-2xl hover:!border-cyan-500/40 hover:!bg-cyan-500/[0.02] transition-all"
              >
                <div className="py-6 flex flex-col items-center gap-2">
                  {uploading ? (
                    <>
                      <Spin size="small" className="[&_.ant-spin-dot-item]:bg-cyan-400" />
                      <Text className="text-xs text-slate-400">Processing {uploadProgress}%</Text>
                      <div className="w-48 h-1 rounded-full bg-white/5 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-200"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-cyan-400/60" />
                      <Text className="text-xs text-slate-500">
                        Drag &amp; drop files here, or <span className="text-cyan-400">browse</span>
                      </Text>
                      <Text className="text-[10px] text-slate-600">CSV, PDF, XLSX, JSON, XML</Text>
                    </>
                  )}
                </div>
              </Upload.Dragger>
              <button
                onClick={() => setShowUploadZone(false)}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* ===== Suggested Prompts ===== */}
        <div className="relative z-10 px-5 py-3 border-t border-white/[0.04] shrink-0">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handlePromptClick(prompt)}
                disabled={isTyping}
                className="shrink-0 text-[11px] px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.02] text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30 hover:bg-cyan-500/5 hover:shadow-[0_0_10px_rgba(6,182,212,0.1)] transition-all duration-200 whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* ===== Chat Input Area ===== */}
        <div className="relative z-10 px-5 pb-5 pt-3 border-t border-white/[0.04] shrink-0">
          <div className="flex items-end gap-2">
            <Tooltip title="Upload shipment files">
              <Button
                type="text"
                icon={<Paperclip className="w-4 h-4" />}
                onClick={() => setShowUploadZone((prev) => !prev)}
                className="!flex !items-center !justify-center !w-10 !h-10 !rounded-xl !border !border-white/10 !bg-white/[0.03] !text-slate-500 hover:!text-cyan-400 hover:!border-cyan-500/30 !transition-all !shrink-0"
              />
            </Tooltip>

            <Tooltip title={isListening ? "Listening..." : "Voice input"}>
              <Button
                type="text"
                icon={<Mic className={`w-4 h-4 ${isListening ? "animate-pulse" : ""}`} />}
                onClick={toggleListening}
                className={`!flex !items-center !justify-center !w-10 !h-10 !rounded-xl !border !transition-all !duration-300 !shrink-0 ${
                  isListening
                    ? "!bg-red-500/15 !border-red-500/40 !text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.3)]"
                    : "!border-white/10 !bg-white/[0.03] !text-slate-500 hover:!text-cyan-400 hover:!border-cyan-500/30"
                }`}
              />
            </Tooltip>

            <div className="flex-1 relative group">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask AI about shipment risks, inventory, logistics optimization, or route disruptions…"
                className="!bg-white/[0.03] !border-white/10 !text-slate-200 !text-sm !rounded-2xl !px-4 !py-3 !h-auto placeholder:!text-slate-600 focus:!border-cyan-500/40 !shadow-none transition-all group-hover:!border-white/20"
                variant="borderless"
                disabled={isTyping}
              />
              <div className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 ring-1 ring-cyan-500/20 shadow-[0_0_16px_rgba(6,182,212,0.08)]" />
            </div>

            <Tooltip title="Send message">
              <Button
                type="primary"
                icon={<Send className="w-4 h-4" />}
                onClick={handleSend}
                disabled={!inputValue.trim() || isTyping}
                className="!flex !items-center !justify-center !w-10 !h-10 !rounded-xl !border-0 !shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:!shadow-[0_0_20px_rgba(6,182,212,0.4)] !transition-all !duration-200 !shrink-0 disabled:!opacity-30 disabled:!cursor-not-allowed"
                style={{
                  background: !inputValue.trim() || isTyping
                    ? "linear-gradient(135deg, rgba(6,182,212,0.3), rgba(79,70,229,0.3))"
                    : "linear-gradient(135deg, #06b6d4, #6366f1)",
                }}
              />
            </Tooltip>
          </div>
        </div>
      </div>
    </Card>
  );
}
