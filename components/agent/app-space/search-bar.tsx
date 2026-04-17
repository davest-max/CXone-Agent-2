
import { Search } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  onSubmit?: (query: string) => void;
}

export function AppSearchBar({
  placeholder = "How can I help?",
  onSubmit,
  className,
}: SearchBarProps) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
    setValue("");
  }

  return (
    <div className={cn("px-4 pb-3 pt-2 shrink-0", className)}>
      <div className="flex items-center gap-2 border border-[#D2D8DB] rounded-lg px-3 py-2 bg-white hover:border-[#005C99] focus-within:border-[#005C99] transition-colors">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSubmit(); }}
          placeholder={placeholder}
          className="flex-1 text-[12px] font-semibold text-[#637a87] placeholder:text-[#637a87] bg-transparent focus:outline-none"
        />
        <button onClick={handleSubmit} className="shrink-0 text-[#637a87] hover:text-[#005C99] transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
