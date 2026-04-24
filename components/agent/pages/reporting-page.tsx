"use client";

import { useState } from "react";
import {
  ChartColumnBig,
  Check,
  Dot,
  Minus,
  PhoneIncoming,
  PhoneOutgoing,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell } from "recharts";
import {
  useAgentStatus,
  getCategory,
  formatHMS,
} from "@/lib/agent-status-context";

const CARD = "flex flex-col h-full bg-white border border-[#D2D8DB] rounded-lg shadow-sm overflow-hidden";

type ReportingTab = "productivity" | "performance";
type TimePeriod = "today" | "yesterday" | "last7" | "custom";

const REPORT_TABS: { id: ReportingTab; label: string }[] = [
  { id: "productivity", label: "Productivity" },
  { id: "performance",  label: "Performance" },
];

const PERIODS: { id: TimePeriod; label: string }[] = [
  { id: "today",     label: "Today" },
  { id: "yesterday", label: "Yesterday" },
  { id: "last7",     label: "Last 7 days" },
  { id: "custom",    label: "Custom" },
];

function TimePeriodSelector({
  period,
  onChange,
}: {
  period: TimePeriod;
  onChange: (p: TimePeriod) => void;
}) {
  return (
    <div className="flex border border-[#D2D8DB] rounded overflow-hidden shrink-0">
      {PERIODS.map((p) => {
        const isActive = period === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={cn(
              "px-3 py-1.5 text-[12px] transition-colors border-r border-[#D2D8DB] last:border-r-0",
              isActive
                ? "bg-[#ECF3F8] text-[#005C99] font-medium"
                : "text-[#526b7a] hover:bg-[#F5F8FA]"
            )}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}

const PRODUCTIVITY_CHART_CONFIG = {
  Available:   { label: "Available",   color: "#22c55e" },
  Working:     { label: "Working",     color: "#f59e0b" },
  Unavailable: { label: "Unavailable", color: "#ef4444" },
};

function ProductivityTab({ period, onPeriodChange }: { period: TimePeriod; onPeriodChange: (p: TimePeriod) => void }) {
  const { status, elapsed, accumulated } = useAgentStatus();

  // Live seconds per individual status code.
  const liveCode = {
    "available": accumulated["available"] + (status === "available" ? elapsed : 0),
    "bio-break": accumulated["bio-break"] + (status === "bio-break" ? elapsed : 0),
    "break":     accumulated["break"]     + (status === "break"     ? elapsed : 0),
    "meeting":   accumulated["meeting"]   + (status === "meeting"   ? elapsed : 0),
  };

  // Category-level totals.
  const liveSecs = {
    available:   liveCode["available"],
    working:     0,
    unavailable: liveCode["bio-break"] + liveCode["break"] + liveCode["meeting"],
  };

  const total = liveSecs.available + liveSecs.working + liveSecs.unavailable || 1;
  function pct(secs: number) { return Math.round((secs / total) * 100); }

  const productivityData = [
    { name: "Available",   value: pct(liveSecs.available),   color: "#22c55e" },
    { name: "Working",     value: pct(liveSecs.working),     color: "#f59e0b" },
    { name: "Unavailable", value: pct(liveSecs.unavailable), color: "#ef4444" },
  ];

  // Bar widths — proportional to the largest category.
  const maxSecs = Math.max(liveSecs.available, liveSecs.working, liveSecs.unavailable, 1);
  function barPct(secs: number) { return `${Math.round((secs / maxSecs) * 100)}%`; }

  const availPct = pct(liveSecs.available);

  return (
    <div className="flex flex-col flex-1 overflow-auto">
      {/* Sub-header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <span className="text-[14px] font-semibold text-[#333]">
          Productivity ({availPct}%)
        </span>
        <TimePeriodSelector period={period} onChange={onPeriodChange} />
      </div>

      {/* Donut chart summary */}
      <div className="flex items-center gap-6 px-4 pb-4 shrink-0">
        <ChartContainer config={PRODUCTIVITY_CHART_CONFIG} className="h-[120px] w-[120px] shrink-0">
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie data={productivityData} dataKey="value" innerRadius={36} outerRadius={54} strokeWidth={2}>
              {productivityData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div className="flex flex-col gap-2">
          {productivityData.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-sm">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}</span>
              <span className="font-semibold ml-auto pl-4">{entry.value}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-4 border border-[#D2D8DB] rounded-md overflow-hidden shrink-0">
      <Table>
        <TableHeader className="bg-[#ECF3F8]">
          <TableRow className="hover:bg-[#ECF3F8]">
            <TableHead className="text-[#526b7a] w-48">Agent states</TableHead>
            <TableHead className="text-[#526b7a]">{/* bar */}</TableHead>
            <TableHead className="text-[#526b7a] text-right w-24">Time</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Available */}
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-2 font-semibold">
                <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0"><Check className="w-2.5 h-2.5 text-white stroke-[3]" /></div>
                Available ({pct(liveSecs.available)}%)
              </div>
            </TableCell>
            <TableCell>
              <div className="relative h-5">
                {liveSecs.available > 0
                  ? <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 bg-[#22c55e] rounded-sm transition-all" style={{ width: barPct(liveSecs.available) }} />
                  : <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#22c55e]" />}
              </div>
            </TableCell>
            <TableCell className="text-right font-semibold tabular-nums">{formatHMS(liveSecs.available)}</TableCell>
          </TableRow>
          {/* Available — Team (mirrors agent) */}
          <TableRow className="bg-muted/30 hover:bg-muted/40">
            <TableCell className="pl-8 text-muted-foreground text-xs">Team ({pct(liveSecs.available)}%)</TableCell>
            <TableCell>
              <div className="relative h-4">
                {liveSecs.available > 0
                  ? <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3 bg-[#86efac] rounded-sm transition-all" style={{ width: barPct(liveSecs.available) }} />
                  : <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-3 bg-[#86efac]" />}
              </div>
            </TableCell>
            <TableCell className="text-right text-muted-foreground text-xs tabular-nums">{formatHMS(liveSecs.available)}</TableCell>
          </TableRow>

          {/* Working */}
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-2 font-semibold">
                <div className="w-4 h-4 rounded-full bg-orange-400 flex items-center justify-center shrink-0"><Dot className="w-4 h-4 text-white" /></div>
                Working ({pct(liveSecs.working)}%)
              </div>
            </TableCell>
            <TableCell>
              <div className="relative h-5">
                {liveSecs.working > 0
                  ? <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 bg-[#f59e0b] rounded-sm transition-all" style={{ width: barPct(liveSecs.working) }} />
                  : <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#f59e0b]" />}
              </div>
            </TableCell>
            <TableCell className="text-right font-semibold tabular-nums">{formatHMS(liveSecs.working)}</TableCell>
          </TableRow>
          {/* Working — Team */}
          <TableRow className="bg-muted/30 hover:bg-muted/40">
            <TableCell className="pl-8 text-muted-foreground text-xs">Team ({pct(liveSecs.working)}%)</TableCell>
            <TableCell>
              <div className="relative h-4">
                {liveSecs.working > 0
                  ? <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3 bg-[#fcd34d] rounded-sm transition-all" style={{ width: barPct(liveSecs.working) }} />
                  : <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-3 bg-[#fcd34d]" />}
              </div>
            </TableCell>
            <TableCell className="text-right text-muted-foreground text-xs tabular-nums">{formatHMS(liveSecs.working)}</TableCell>
          </TableRow>

          {/* Unavailable — parent row */}
          <TableRow>
            <TableCell>
              <div className="flex items-center gap-2 font-semibold">
                <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0"><Minus className="w-2.5 h-2.5 text-white stroke-[3]" /></div>
                Unavailable ({pct(liveSecs.unavailable)}%)
              </div>
            </TableCell>
            <TableCell>
              <div className="relative h-5">
                {liveSecs.unavailable > 0
                  ? <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4 bg-[#ef4444] rounded-sm transition-all" style={{ width: barPct(liveSecs.unavailable) }} />
                  : <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#ef4444]" />}
              </div>
            </TableCell>
            <TableCell className="text-right font-semibold tabular-nums">{formatHMS(liveSecs.unavailable)}</TableCell>
          </TableRow>
          {/* Unavailable — per-status-code sub-rows */}
          {(["bio-break", "break", "meeting"] as const).map((code) => {
            const secs  = liveCode[code];
            const label = code === "bio-break" ? "Bio Break" : code === "break" ? "Break" : "Meeting";
            return (
              <TableRow key={code} className="bg-muted/30 hover:bg-muted/40">
                <TableCell className="pl-8 text-muted-foreground text-xs">{label} ({pct(secs)}%)</TableCell>
                <TableCell>
                  <div className="relative h-4">
                    {secs > 0
                      ? <div className="absolute left-0 top-1/2 -translate-y-1/2 h-3 bg-[#fca5a5] rounded-sm transition-all" style={{ width: barPct(secs) }} />
                      : <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-3 bg-[#fca5a5]" />}
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-xs tabular-nums">{formatHMS(secs)}</TableCell>
              </TableRow>
            );
          })}
          {/* Unavailable — Team */}
          <TableRow className="bg-muted/30 hover:bg-muted/40">
            <TableCell className="pl-8 text-muted-foreground text-xs">Team ({pct(liveSecs.unavailable)}%)</TableCell>
            <TableCell>
              {liveSecs.unavailable > 0
                ? <div className="h-4 bg-[#fca5a5] rounded-sm transition-all" style={{ width: barPct(liveSecs.unavailable) }} />
                : <div className="relative h-4"><div className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-3 bg-[#fca5a5]" /></div>}
            </TableCell>
            <TableCell className="text-right text-muted-foreground text-xs tabular-nums">{formatHMS(liveSecs.unavailable)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      </div>
    </div>
  );
}

function PerformanceTab({ period, onPeriodChange }: { period: TimePeriod; onPeriodChange: (p: TimePeriod) => void }) {
  return (
    <div className="flex flex-col flex-1 overflow-auto">
      {/* Sub-header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <span className="text-[14px] font-semibold text-[#333]">Performance (0%)</span>
        <TimePeriodSelector period={period} onChange={onPeriodChange} />
      </div>

      {/* Table */}
      <div className="mx-4 border border-[#D2D8DB] rounded-md overflow-hidden shrink-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#526b7a]">Channel Type</TableHead>
              <TableHead className="text-[#526b7a] text-center">You</TableHead>
              <TableHead className="text-[#526b7a] text-center">Team</TableHead>
              <TableHead className="text-[#526b7a] text-center">% of Team</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <PhoneIncoming className="w-4 h-4 text-[#526b7a] shrink-0" />
                Inbound
              </TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center">0%</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="flex items-center gap-2">
                <PhoneOutgoing className="w-4 h-4 text-[#526b7a] shrink-0" />
                Outbound
              </TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center">0</TableCell>
              <TableCell className="text-center">0%</TableCell>
            </TableRow>
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell className="font-semibold">Overall</TableCell>
              <TableCell className="text-center font-semibold">0</TableCell>
              <TableCell className="text-center font-semibold">0</TableCell>
              <TableCell className="text-center font-semibold">0%</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}

export function ReportingPage({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<ReportingTab>("productivity");
  const [period, setPeriod] = useState<TimePeriod>("today");

  return (
    <div className={cn(CARD, className)}>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 shrink-0">
        <ChartColumnBig className="w-4 h-4 text-[#005C99]" />
        <span className="text-[15px] font-semibold text-[#333]">Reporting</span>
      </div>

      {/* Tab bar */}
      <div className="flex items-end px-4 border-b border-[#D2D8DB] shrink-0">
        {REPORT_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative px-4 py-2.5 text-[13px] font-medium transition-colors",
                isActive
                  ? "text-[#005C99]"
                  : "text-[#526b7a] hover:text-[#333]"
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#005C99] rounded-t-sm" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      {activeTab === "productivity" ? (
        <ProductivityTab period={period} onPeriodChange={setPeriod} />
      ) : (
        <PerformanceTab period={period} onPeriodChange={setPeriod} />
      )}
    </div>
  );
}
