import { useState } from "react";
import { X, GripVertical, Pin, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CustomizeItem {
  id: string;
  label: string;
  enabled: boolean;
  pinned?: boolean;
}

const SECTIONS: { heading?: string; items: CustomizeItem[] }[] = [
  {
    items: [
      { id: "customer-card", label: "Customer Card", enabled: false },
      { id: "multi-party", label: "Multi-party", enabled: false },
      { id: "agent-assist", label: "Agent Assist", enabled: false },
      { id: "copilot", label: "Copilot", enabled: false },
      { id: "quick-responses", label: "Quick Responses", enabled: false },
      { id: "screen-pop", label: "Screen Pop", enabled: false },
    ],
  },
  {
    items: [
      { id: "desk", label: "Desk", enabled: false },
      { id: "contact-history", label: "Contact History", enabled: true },
      { id: "search", label: "Search", enabled: true },
      { id: "queue", label: "Queue", enabled: true },
      { id: "directory", label: "Directory", enabled: true },
      { id: "schedule", label: "Schedule", enabled: true },
      { id: "launch", label: "Launch", enabled: false },
      { id: "wem", label: "WEM", enabled: true },
    ],
  },
  {
    items: [
      { id: "settings", label: "Settings", enabled: true },
      { id: "custom-workspace", label: "Custom Workspace", enabled: false },
      { id: "reporting", label: "Reporting", enabled: true },
      { id: "help", label: "Help", enabled: true, pinned: true },
    ],
  },
];

interface CustomizePanelProps {
  open: boolean;
  onClose: () => void;
}

export function CustomizePanel({ open, onClose }: CustomizePanelProps) {
  const [sections, setSections] = useState(SECTIONS);
  const [selectedId, setSelectedId] = useState<string | null>("help");

  if (!open) return null;

  const allItems = sections.flatMap((s) => s.items);
  const selectedItem = allItems.find((i) => i.id === selectedId);
  const selectedFlatIdx = allItems.findIndex((i) => i.id === selectedId);

  function moveSelected(dir: -1 | 1) {
    if (selectedFlatIdx < 0) return;
    const newIdx = selectedFlatIdx + dir;
    if (newIdx < 0 || newIdx >= allItems.length) return;

    // Rebuild sections with the item moved
    const flatCopy = [...allItems];
    const [removed] = flatCopy.splice(selectedFlatIdx, 1);
    flatCopy.splice(newIdx, 0, removed);

    // Redistribute back into sections preserving lengths
    setSections((prev) => {
      let cursor = 0;
      return prev.map((sec) => {
        const slice = flatCopy.slice(cursor, cursor + sec.items.length);
        cursor += sec.items.length;
        return { ...sec, items: slice };
      });
    });
  }

  return (
    <div className="absolute top-0 left-[54px] z-50 h-full w-[260px] bg-white border-r border-[#D2D8DB] shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#D2D8DB] shrink-0">
        <span className="font-bold text-[15px] text-[#191919]">Customize</span>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded border border-[#D2D8DB] hover:bg-[#ECF3F8] transition-colors"
        >
          <X className="w-4 h-4 text-[#526b7a]" />
        </button>
      </div>

      {/* Scrollable item list */}
      <div className="flex-1 overflow-y-auto">
        {sections.map((sec, sIdx) => (
          <div key={sIdx}>
            {sIdx > 0 && <div className="h-px bg-[#D2D8DB] mx-0" />}
            {sec.items.map((item) => {
              const isSelected = item.id === selectedId;
              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2.5 text-left transition-colors",
                    isSelected ? "bg-[#ECF3F8]" : "hover:bg-[#F5F8FA]"
                  )}
                >
                  <GripVertical
                    className={cn(
                      "w-4 h-4 shrink-0",
                      item.enabled ? "text-[#526b7a]" : "text-[#C3C5C9]"
                    )}
                  />
                  <span
                    className={cn(
                      "text-[13px] leading-snug",
                      item.enabled
                        ? "font-bold text-[#191919]"
                        : "font-normal text-[#9AA5AB]"
                    )}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer controls */}
      <div className="flex items-center justify-end gap-1 px-3 py-2 border-t border-[#D2D8DB] shrink-0">
        <button
          title="Pin"
          className={cn(
            "p-1.5 rounded hover:bg-[#ECF3F8] transition-colors",
            selectedItem?.pinned ? "text-[#007CBE]" : "text-[#526b7a]"
          )}
        >
          <Pin className="w-4 h-4" />
        </button>
        <button
          onClick={() => moveSelected(-1)}
          disabled={selectedFlatIdx <= 0}
          className="p-1.5 rounded border border-[#D2D8DB] hover:bg-[#ECF3F8] transition-colors disabled:opacity-40"
          title="Move up"
        >
          <ChevronUp className="w-4 h-4 text-[#526b7a]" />
        </button>
        <button
          onClick={() => moveSelected(1)}
          disabled={selectedFlatIdx >= allItems.length - 1}
          className="p-1.5 rounded border border-[#D2D8DB] hover:bg-[#ECF3F8] transition-colors disabled:opacity-40"
          title="Move down"
        >
          <ChevronDown className="w-4 h-4 text-[#526b7a]" />
        </button>
      </div>
    </div>
  );
}
