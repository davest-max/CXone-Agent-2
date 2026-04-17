
import { useState } from "react";
import { SendHorizontal, Zap, Paperclip, Bold, Italic, Underline, Strikethrough, Link } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { Contact } from "@/lib/mock-data";

interface ReplyBoxProps {
  placeholder?: string;
  onSend: (text: string) => void;
  contact?: Contact;
  className?: string;
}

export function ReplyBox({ placeholder, onSend, contact, className }: ReplyBoxProps) {
  const firstName = contact?.name?.split(" ")[0] ?? "Customer";
  const [value, setValue] = useState("");

  function handleSend() {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div
      className={cn(
        "flex flex-col border-t border-[#D2D8DB] bg-white shrink-0",
        className
      )}
    >
      {/* Label */}
      <div className="px-3 pt-3 pb-1">
        <span className="text-[11px] font-semibold text-[#526b7a]">Chat with {firstName}</span>
      </div>

      {/* Text area */}
      <div className="px-3 pb-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? `Message ${firstName}…`}
          className="bg-[#F5F8FA] resize-none overflow-hidden min-h-24 border-[#D2D8DB] focus-visible:border-[#D2D8DB] focus-visible:ring-0"
        />
      </div>

      {/* Bottom action row */}
      <div className="flex items-center gap-1 px-3 pb-3">
        {/* Attach button */}
        <Button variant="ghost" size="icon" title="Attach file" className="text-[#526b7a] shrink-0">
          <Paperclip />
        </Button>

        {/* Formatting controls */}
        <Button variant="ghost" size="icon" title="Bold" className="text-[#526b7a] shrink-0">
          <Bold />
        </Button>
        <Button variant="ghost" size="icon" title="Italic" className="text-[#526b7a] shrink-0">
          <Italic />
        </Button>
        <Button variant="ghost" size="icon" title="Underline" className="text-[#526b7a] shrink-0">
          <Underline />
        </Button>
        <Button variant="ghost" size="icon" title="Strikethrough" className="text-[#526b7a] shrink-0">
          <Strikethrough />
        </Button>
        <Button variant="ghost" size="icon" title="Insert link" className="text-[#526b7a] shrink-0">
          <Link />
        </Button>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Replies button */}
        <Button variant="outline" className="shrink-0">
          <Zap />
          Replies
        </Button>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={!value.trim()}
          className="shrink-0 bg-[#067EFF] hover:bg-[#005bbf] text-white"
        >
          <SendHorizontal />
        </Button>
      </div>
    </div>
  );
}
