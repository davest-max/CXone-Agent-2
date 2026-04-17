import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

const CARD = "flex flex-col h-full bg-white border border-[#D2D8DB] rounded-lg shadow-sm overflow-hidden";

export function SchedulePage({ className }: { className?: string }) {
  return (
    <div className={cn(CARD, className)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#D2D8DB] shrink-0">
        <CalendarDays className="w-4 h-4 text-[#005C99]" />
        <span className="text-[15px] font-semibold text-[#333]">Schedule</span>
      </div>
      <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center px-8">
        <CalendarDays className="w-10 h-10 text-[#D2D8DB]" />
        <p className="text-[13px] font-semibold text-[#333]">Schedule</p>
        <p className="text-[12px] text-[#526b7a] max-w-xs">View your shifts, breaks, and scheduled callbacks.</p>
        <span className="text-[11px] text-[#8fa3b1] border border-[#D2D8DB] rounded px-2 py-0.5">Coming soon</span>
      </div>
    </div>
  );
}
