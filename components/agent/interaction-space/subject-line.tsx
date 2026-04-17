
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Contact } from "@/lib/mock-data";

interface SubjectLineProps {
  contact: Contact;
  className?: string;
}

export function SubjectLine({ contact, className }: SubjectLineProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 h-7 border-b border-[#D2D8DB] bg-white shrink-0",
        className
      )}
    >
      {/* Left: message count, case number, status */}
      <div className="flex items-center gap-2 text-[12px]">
        <span className="font-semibold text-[#333]">
          5 private messages
        </span>
        <span className="text-[#333]">|</span>
        <span className="font-bold text-[#333] uppercase tracking-wide">
          # {contact.caseNumber}
        </span>
        <span className="text-[#333]">|</span>

        {/* Status badge */}
        <div className="flex items-center gap-1 border border-[#CC8605] rounded px-1 py-px">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          <span className="font-semibold text-[#333] text-[11px]">Open</span>
          <ChevronDown className="w-3 h-3 text-[#333]" />
        </div>

      </div>

      {/* Right: view details + menu */}
      <div className="flex items-center gap-1">
        <button className="flex items-center gap-0.5 text-[#007AB8] text-[12px] hover:underline transition-colors">
          View Details
          <ChevronUp className="w-3 h-3 rotate-90" />
        </button>
        <button className="p-1 rounded hover:bg-[#ECF3F8] transition-colors text-[#526b7a]">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
