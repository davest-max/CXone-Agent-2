"use client";

import { useState } from "react";
import {
  LayoutList,
  ChevronRight,
  ChevronLeft,
  PhoneIncoming,
  Voicemail,
  ClipboardList,
  Hexagon,
  Check,
  Minus,
  Dot,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CARD = "flex flex-col h-full bg-white border border-[#D2D8DB] rounded-lg shadow-sm overflow-hidden";

/* ─── Types ──────────────────────────────────────────────────────────────── */

type Channel = {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
};

interface AgentStates {
  available: number;
  busy: number;
  unavailable: number;
}

interface Skill {
  id: string;
  name: string;
  inQueue: number;
  longestWaitSecs: number;
  agentStates: AgentStates;
}

/* ─── Data ───────────────────────────────────────────────────────────────── */

const CHANNELS: Channel[] = [
  { id: "digital",       label: "Digital",       icon: Hexagon,       color: "#f59e0b" },
  { id: "inbound-voice", label: "Inbound Voice",  icon: PhoneIncoming, color: "#7c3aed" },
  { id: "voicemail",     label: "Voicemail",      icon: Voicemail,     color: "#ef4444" },
  { id: "work-item",     label: "Work Item",      icon: ClipboardList, color: "#3b82f6" },
];

const CHANNEL_SKILLS: Record<string, Skill[]> = {
  "digital": [
    { id: "d1", name: "UX Chat",        inQueue: 2, longestWaitSecs: 185, agentStates: { available: 3, busy: 1, unavailable: 0 } },
    { id: "d2", name: "UX Email",       inQueue: 5, longestWaitSecs: 420, agentStates: { available: 2, busy: 2, unavailable: 1 } },
    { id: "d3", name: "UX SMS",         inQueue: 0, longestWaitSecs: 0,   agentStates: { available: 1, busy: 0, unavailable: 0 } },
    { id: "d4", name: "Social Support", inQueue: 1, longestWaitSecs: 60,  agentStates: { available: 2, busy: 1, unavailable: 0 } },
  ],
  "inbound-voice": [
    { id: "v1", name: "Auto Attendant",   inQueue: 0, longestWaitSecs: 0, agentStates: { available: 1, busy: 0, unavailable: 0 } },
    { id: "v2", name: "AV.Operations",    inQueue: 0, longestWaitSecs: 0, agentStates: { available: 1, busy: 0, unavailable: 0 } },
    { id: "v3", name: "AV.Reservations",  inQueue: 0, longestWaitSecs: 0, agentStates: { available: 1, busy: 0, unavailable: 0 } },
    { id: "v4", name: "Español",          inQueue: 0, longestWaitSecs: 0, agentStates: { available: 1, busy: 0, unavailable: 0 } },
    { id: "v5", name: "Phone skill",      inQueue: 0, longestWaitSecs: 0, agentStates: { available: 1, busy: 0, unavailable: 0 } },
    { id: "v6", name: "SS.Freight",       inQueue: 0, longestWaitSecs: 0, agentStates: { available: 1, busy: 0, unavailable: 0 } },
    { id: "v7", name: "SS.Maintenance",   inQueue: 0, longestWaitSecs: 0, agentStates: { available: 1, busy: 0, unavailable: 0 } },
    { id: "v8", name: "UX Inbound Phone", inQueue: 0, longestWaitSecs: 0, agentStates: { available: 1, busy: 0, unavailable: 0 } },
  ],
  "voicemail": [
    { id: "vm1", name: "UX Voicemail",     inQueue: 3, longestWaitSecs: 900,  agentStates: { available: 1, busy: 0, unavailable: 1 } },
    { id: "vm2", name: "After-Hours VM",   inQueue: 0, longestWaitSecs: 0,    agentStates: { available: 0, busy: 0, unavailable: 0 } },
  ],
  "work-item": [
    { id: "wi1", name: "Case Management",  inQueue: 4, longestWaitSecs: 1800, agentStates: { available: 2, busy: 3, unavailable: 0 } },
    { id: "wi2", name: "Escalations",      inQueue: 1, longestWaitSecs: 600,  agentStates: { available: 1, busy: 1, unavailable: 0 } },
    { id: "wi3", name: "Billing Review",   inQueue: 0, longestWaitSecs: 0,    agentStates: { available: 1, busy: 0, unavailable: 0 } },
  ],
};

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function formatWait(secs: number): string {
  if (secs === 0) return "0s";
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

/* ─── Agent state indicator ──────────────────────────────────────────────── */

function StateIndicator({
  type,
  count,
}: {
  type: "available" | "busy" | "unavailable";
  count: number;
}) {
  return (
    <div className="flex items-center gap-1">
      {type === "available" && (
        <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
          <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
        </div>
      )}
      {type === "busy" && (
        <div className="w-4 h-4 rounded-full bg-orange-400 flex items-center justify-center shrink-0">
          <Dot className="w-4 h-4 text-white" />
        </div>
      )}
      {type === "unavailable" && (
        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0">
          <Minus className="w-2.5 h-2.5 text-white stroke-[3]" />
        </div>
      )}
      <span className="text-[12px] text-[#333] tabular-nums">{count}</span>
    </div>
  );
}

/* ─── Column headers ─────────────────────────────────────────────────────── */

function TableHeader() {
  return (
    <div className="grid grid-cols-[2fr_100px_120px_180px] items-center px-4 py-2.5 border-b border-[#D2D8DB] bg-[#F5F8FA] shrink-0">
      <span className="text-[11px] font-semibold text-[#005C99] uppercase tracking-wide">
        Skill Name
      </span>
      <span className="text-[11px] font-semibold text-[#005C99] uppercase tracking-wide">
        In Queue
      </span>
      <span className="text-[11px] font-semibold text-[#005C99] uppercase tracking-wide">
        Longest Wait
      </span>
      <span className="text-[11px] font-semibold text-[#005C99] uppercase tracking-wide">
        Agent States
      </span>
    </div>
  );
}

/* ─── Skill row ──────────────────────────────────────────────────────────── */

function SkillRow({ skill, channel }: { skill: Skill; channel: Channel }) {
  const Icon = channel.icon;
  return (
    <div className="grid grid-cols-[2fr_100px_120px_180px] items-center px-4 py-3.5 border-b border-[#D2D8DB] hover:bg-[#F5F8FA] transition-colors">
      {/* Skill name with channel icon */}
      <div className="flex items-center gap-2.5 min-w-0">
        <Icon
          className="w-4 h-4 shrink-0"
          style={{ color: channel.color }}
        />
        <span className="text-[13px] text-[#333] truncate">{skill.name}</span>
      </div>

      {/* In queue */}
      <span className="text-[13px] text-[#333] tabular-nums">
        {skill.inQueue}
      </span>

      {/* Longest wait */}
      <span className="text-[13px] text-[#333] tabular-nums">
        {formatWait(skill.longestWaitSecs)}
      </span>

      {/* Agent states */}
      <div className="flex items-center gap-3">
        <StateIndicator type="available"   count={skill.agentStates.available}   />
        <StateIndicator type="busy"        count={skill.agentStates.busy}        />
        <StateIndicator type="unavailable" count={skill.agentStates.unavailable} />
      </div>
    </div>
  );
}

/* ─── List view ──────────────────────────────────────────────────────────── */

function QueueList({ onSelect }: { onSelect: (ch: Channel) => void }) {
  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="grid grid-cols-[1fr_auto_auto_auto] items-center px-4 py-2 border-b border-[#D2D8DB] bg-[#F5F8FA] shrink-0">
        <span className="text-[11px] font-semibold text-[#526b7a] uppercase tracking-wide">Channel</span>
        <span className="text-[11px] font-semibold text-[#526b7a] uppercase tracking-wide w-32 text-left">Contacts in Queue</span>
        <span className="text-[11px] font-semibold text-[#526b7a] uppercase tracking-wide w-16 text-left">Wait</span>
        <span className="w-6" />
      </div>
      {CHANNELS.map((ch) => {
        const Icon = ch.icon;
        const skills = CHANNEL_SKILLS[ch.id] ?? [];
        const totalInQueue = skills.reduce((sum, s) => sum + s.inQueue, 0);
        const longestWait = Math.max(...skills.map((s) => s.longestWaitSecs), 0);
        return (
          <button
            key={ch.id}
            onClick={() => onSelect(ch)}
            className={cn(
              "grid grid-cols-[1fr_auto_auto_auto] items-center px-4 py-3 border-b border-[#D2D8DB] w-full text-left",
              "hover:bg-[#F5F8FA] transition-colors group"
            )}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon className="w-4 h-4 shrink-0" style={{ color: ch.color }} />
              <span className="text-[13px] text-[#333] truncate">{ch.label}</span>
            </div>
            <span className="text-[13px] text-[#333] w-32 text-left tabular-nums">{totalInQueue}</span>
            <span className="text-[13px] text-[#333] w-16 text-left tabular-nums">{formatWait(longestWait)}</span>
            <ChevronRight className="w-4 h-4 text-[#526b7a] shrink-0 group-hover:text-[#333] transition-colors" />
          </button>
        );
      })}
    </div>
  );
}

/* ─── Detail view ────────────────────────────────────────────────────────── */

function QueueDetail({ channel, onBack }: { channel: Channel; onBack: () => void }) {
  const skills = CHANNEL_SKILLS[channel.id] ?? [];
  const totalInQueue = skills.reduce((sum, s) => sum + s.inQueue, 0);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Back navigation */}
      <div className="flex items-center gap-1 px-3 py-2 bg-[#F5F8FA] border-b border-[#D2D8DB] shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-[13px] text-[#005C99] hover:text-[#003D7A] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{channel.label}</span>
        </button>
      </div>

      {/* Summary stats */}
      <div className="flex items-center justify-center gap-6 px-4 py-4 shrink-0">
        <div className="flex flex-col items-center border border-[#D2D8DB] rounded px-8 py-2 bg-white min-w-[100px]">
          <span className="text-[10px] font-semibold text-[#526b7a] uppercase tracking-wide mb-1">Skills</span>
          <span className="text-[18px] font-semibold text-[#005C99]">{skills.length}</span>
        </div>
        <div className="flex flex-col items-center border border-[#D2D8DB] rounded px-8 py-2 bg-white min-w-[100px]">
          <span className="text-[10px] font-semibold text-[#526b7a] uppercase tracking-wide mb-1">Contacts</span>
          <span className="text-[18px] font-semibold text-[#005C99]">{totalInQueue}</span>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
        <TableHeader />
        <div className="flex-1 overflow-y-auto">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <SkillRow key={skill.id} skill={skill} channel={channel} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
              <LayoutList className="w-10 h-10 text-[#C3C5C9]" />
              <span className="text-[13px] text-[#526b7a]">No Skills Assigned</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Queue content (shared between page and app-space panel) ────────────── */

export function QueueContent({ className }: { className?: string }) {
  const [selected, setSelected] = useState<Channel | null>(null);
  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      {selected ? (
        <QueueDetail channel={selected} onBack={() => setSelected(null)} />
      ) : (
        <QueueList onSelect={setSelected} />
      )}
    </div>
  );
}

/* ─── Full page (sidebar master) ─────────────────────────────────────────── */

export function QueuePage({ className }: { className?: string }) {
  return (
    <div className={cn(CARD, className)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#D2D8DB] shrink-0">
        <LayoutList className="w-4 h-4 text-[#005C99]" />
        <span className="text-[15px] font-semibold text-[#333]">Queue</span>
      </div>
      <QueueContent className="flex-1 min-h-0" />
    </div>
  );
}
