
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/mock-data";

interface MessageThreadProps {
  messages: Message[];
  className?: string;
}

export function MessageThread({ messages, className }: MessageThreadProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={cn("flex-1 overflow-y-auto px-4 py-3", className)}>
      <div className="flex flex-col gap-2">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isAgent = message.role === "agent";

  return (
    <div
      className={cn(
        "flex flex-col gap-1",
        isAgent ? "items-end" : "items-start"
      )}
    >
      <span
        className={cn(
          "text-[12px] font-bold leading-tight",
          isAgent ? "text-[#333]" : "text-[#191C21]"
        )}
      >
        {message.sender}
      </span>

      <div
        className={cn(
          "px-3 py-2 rounded-lg max-w-[360px] text-[12px] leading-normal",
          isAgent
            ? "bg-[#067EFF] text-white"
            : "bg-[#E6E6E6] text-black"
        )}
      >
        {message.text}
      </div>

      <span className="text-[11px] text-[#404040]">{message.timestamp}</span>
    </div>
  );
}
