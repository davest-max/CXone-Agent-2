
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Paperclip,
  Link,
  ImageIcon,
  Table2,
  Trash2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Contact } from "@/lib/mock-data";
import { agentInitials } from "@/lib/mock-data";

interface EmailReplyBoxProps {
  contact: Contact;
  onSend: (text: string) => void;
  className?: string;
}

/* ─── "A" text-formatting button (matches Figma exactly) ─────────────────── */
function TextFormatButton() {
  return (
    <button
      title="Text formatting"
      className="flex flex-col items-center justify-center w-7 h-7 rounded hover:bg-[#ECF3F8] transition-colors p-1 shrink-0"
    >
      <span className="font-bold text-[#333] text-[14px] leading-none select-none">
        A
      </span>
      <div className="w-[14px] h-[2px] bg-[#333] rounded mt-[1px]" />
    </button>
  );
}

/* ─── Send Options split button ─────────────────────────────────────────── */
function SendOptionsButton({ onSend }: { onSend: () => void }) {
  return (
    <div className="flex items-center h-7 rounded overflow-hidden shrink-0">
      <button
        onClick={onSend}
        className="bg-[#005C99] hover:bg-[#004a80] text-white text-[12px] font-bold px-3 h-full transition-colors whitespace-nowrap"
      >
        Send Options
      </button>
      <div className="w-px h-full bg-[#004080]" />
      <button className="bg-[#005C99] hover:bg-[#004a80] text-white px-1.5 h-full transition-colors">
        <ChevronUp className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ─── Email reply box ────────────────────────────────────────────────────── */

export function EmailReplyBox({ contact, onSend, className }: EmailReplyBoxProps) {
  const [body, setBody] = useState("");
  const [toExpanded, setToExpanded] = useState(false);

  const agentInits = agentInitials;
  const customerName = contact.name;
  const customerEmail = contact.contactEmail ?? "";

  function handleSend() {
    const trimmed = body.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setBody("");
  }

  return (
    <div className={cn("flex gap-2 px-4 pb-4 shrink-0", className)}>
      {/* Agent avatar */}
      <div className="w-8 h-8 rounded-full bg-[#DBE6F0] flex items-center justify-center shrink-0 mt-1 text-[12px] font-semibold text-[#3F5C69] select-none">
        {agentInits}
      </div>

      {/* Compose card */}
      <div className="flex-1 min-w-0 bg-white border border-[#EBEBEB] rounded shadow-[0px_4px_8px_-2px_rgba(16,24,40,0.3),0px_2px_4px_-2px_rgba(16,24,40,0.15)] overflow-hidden">

        {/* To: header */}
        <button
          onClick={() => setToExpanded((v) => !v)}
          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-[#F5F8FA] transition-colors text-left"
        >
          <span className="font-bold text-[12px] text-[#333] shrink-0">
            To: {customerName}
          </span>
          {customerEmail && (
            <span className="text-[11px] text-[#333] truncate flex-1">
              {customerEmail}
            </span>
          )}
          <ChevronDown
            className={cn(
              "w-3.5 h-3.5 text-[#526b7a] shrink-0 transition-transform duration-200",
              toExpanded && "rotate-180"
            )}
          />
        </button>

        {/* Divider */}
        <div className="h-px bg-[#D2D8DB]" />

        {/* Body textarea */}
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={`Reply to ${customerName}…`}
          className="border-0 rounded-none resize-none min-h-[80px] focus-visible:ring-0 shadow-none text-[12px] text-[#333] placeholder:text-[#526b7a]"
        />

        {/* Divider */}
        <div className="h-px bg-[#D2D8DB]" />

        {/* Bottom toolbar */}
        <div className="flex items-center gap-0.5 px-2 py-2">
          {/* Formatting tools */}
          <TextFormatButton />
          <Button
            variant="ghost"
            size="icon"
            title="Attach file"
            className="w-7 h-7 text-[#526b7a]"
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Insert link"
            className="w-7 h-7 text-[#526b7a]"
          >
            <Link className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Insert image"
            className="w-7 h-7 text-[#526b7a]"
          >
            <ImageIcon className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            title="Insert table"
            className="w-7 h-7 text-[#526b7a]"
          >
            <Table2 className="w-4 h-4" />
          </Button>

          <div className="flex-1" />

          {/* Discard */}
          <Button
            variant="ghost"
            size="icon"
            title="Discard draft"
            className="w-7 h-7 text-[#526b7a] mr-1"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          {/* Replies */}
          <Button variant="outline" size="sm" className="h-7 text-[12px] gap-1 mr-1">
            <Zap className="w-3.5 h-3.5" />
            Replies
          </Button>

          {/* Send Options split button */}
          <SendOptionsButton onSend={handleSend} />
        </div>
      </div>
    </div>
  );
}
