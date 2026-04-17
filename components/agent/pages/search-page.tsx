"use client";

import { useState } from "react";
import {
  Search,
  X,
  ListFilter,
  Columns3,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CARD = "flex flex-col h-full bg-white border border-[#D2D8DB] rounded-lg shadow-sm overflow-hidden";

type SearchTab = "interactions" | "messages" | "customers" | "threads";

const TABS: { id: SearchTab; label: string }[] = [
  { id: "interactions", label: "Interactions" },
  { id: "messages",     label: "Messages" },
  { id: "customers",    label: "Customers" },
  { id: "threads",      label: "Threads" },
];

const COLUMNS = ["TYPE", "CREATE DATE", "STATUS", "CHANNEL", "SKILL"];

export function SearchPage({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = useState<SearchTab>("interactions");
  const [searchValue, setSearchValue] = useState("");
  const [activeFilter, setActiveFilter] = useState("ownerAssignee IS");

  return (
    <div className={cn(CARD, className)}>

      {/* ── Search bar ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#D2D8DB] shrink-0">
        <Search className="w-4 h-4 text-[#526b7a] shrink-0" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search"
          className="flex-1 text-[14px] text-[#333] placeholder:text-[#526b7a] bg-transparent outline-none"
        />
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────── */}
      <div className="flex items-end gap-0 px-4 border-b border-[#D2D8DB] shrink-0">
        {TABS.map((tab) => {
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

      {/* ── Filter row ───────────────────────────────────────────── */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-[#D2D8DB] shrink-0 bg-[#F5F8FA]">
        {/* Active filter chip */}
        {activeFilter && (
          <div className="flex items-center gap-1.5 bg-white border border-[#D2D8DB] rounded px-2.5 py-1 text-[12px] text-[#333]">
            <span>{activeFilter}</span>
            <button
              onClick={() => setActiveFilter("")}
              className="text-[#526b7a] hover:text-[#333] transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <div className="flex-1" />

        {/* Filters button */}
        <button className="flex items-center gap-1.5 text-[12px] text-[#526b7a] hover:text-[#333] transition-colors px-2 py-1 rounded hover:bg-[#ECF3F8]">
          <ListFilter className="w-3.5 h-3.5" />
          Filters
        </button>

        {/* Columns button */}
        <button className="flex items-center gap-1.5 text-[12px] text-[#526b7a] hover:text-[#333] transition-colors px-2 py-1 rounded hover:bg-[#ECF3F8]">
          <Columns3 className="w-3.5 h-3.5" />
          Columns
        </button>
      </div>

      {/* ── Action row ───────────────────────────────────────────── */}
      <div className="flex items-center gap-0 px-4 py-1.5 border-b border-[#D2D8DB] shrink-0">
        <button className="flex items-center gap-1.5 text-[12px] text-[#005C99] hover:text-[#003D7A] transition-colors px-2 py-1 rounded hover:bg-[#ECF3F8]">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
        <button className="flex items-center gap-1.5 text-[12px] text-[#005C99] hover:text-[#003D7A] transition-colors px-2 py-1 rounded hover:bg-[#ECF3F8]">
          <Trash2 className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* ── Table header ─────────────────────────────────────────── */}
      <div className="flex items-center border-b border-[#D2D8DB] bg-white shrink-0 px-4">
        {/* Checkbox */}
        <div className="w-8 shrink-0 py-2.5">
          <input type="checkbox" className="w-3.5 h-3.5 accent-[#005C99]" />
        </div>
        {/* Columns */}
        {COLUMNS.map((col) => (
          <div
            key={col}
            className={cn(
              "py-2.5 text-[11px] font-semibold text-[#526b7a] uppercase tracking-wide flex items-center gap-1 select-none",
              col === "SKILL" ? "flex-1" : "w-32 shrink-0"
            )}
          >
            {col}
            {col === "CREATE DATE" && <ChevronDown className="w-3 h-3" />}
          </div>
        ))}
      </div>

      {/* ── Table body / empty state ──────────────────────────────── */}
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[13px] text-[#526b7a]">No results found</p>
      </div>

      {/* ── Pagination footer ─────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-2 px-4 py-2.5 border-t border-[#D2D8DB] shrink-0">
        <span className="text-[12px] text-[#526b7a]">0–0 of 0</span>
        <button
          disabled
          className="p-1 rounded text-[#526b7a] disabled:opacity-40"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          disabled
          className="p-1 rounded text-[#526b7a] disabled:opacity-40"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
