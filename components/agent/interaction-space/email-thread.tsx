
import { useState, useRef, useEffect } from "react";
import { ChevronDown, FileText, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Contact, Message, EmailAttachment } from "@/lib/mock-data";

/* ─── Helpers ────────────────────────────────────────────────────────────── */

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ─── Avatar ─────────────────────────────────────────────────────────────── */

function EmailAvatar({
  initials,
  role,
}: {
  initials: string;
  role: "agent" | "customer";
}) {
  return (
    <div
      className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-[13px] font-semibold leading-none",
        role === "customer"
          ? "bg-[#003D7A] text-white"
          : "bg-[#DBE6F0] text-[#3F5C69]"
      )}
    >
      {initials}
    </div>
  );
}

/* ─── Attachment chip ────────────────────────────────────────────────────── */

function AttachmentChip({ attachment }: { attachment: EmailAttachment }) {
  const Icon = attachment.type === "pdf" ? FileText : ImageIcon;
  return (
    <div className="flex items-center gap-1.5 bg-[#E6E6E6] rounded px-2 py-1.5 text-[11px] cursor-pointer hover:bg-[#D2D8DB] transition-colors">
      <Icon className="w-3.5 h-3.5 text-[#005C99] shrink-0" />
      <div className="min-w-0">
        <p className="font-semibold text-[#005C99] truncate max-w-[120px]">
          {attachment.name}
        </p>
        <p className="text-[#526b7a] text-[10px]">{attachment.size}</p>
      </div>
    </div>
  );
}

/* ─── Single email entry ─────────────────────────────────────────────────── */

interface EmailItemProps {
  message: Message;
  contact: Contact;
  isExpanded: boolean;
  onToggle: () => void;
  isLast: boolean;
}

function EmailItem({
  message,
  contact,
  isExpanded,
  onToggle,
  isLast,
}: EmailItemProps) {
  const toAddress =
    message.role === "customer"
      ? "support@businessbanking.com"
      : contact.contactEmail ?? "customer@email.com";

  const initials = getInitials(message.sender);

  return (
    <div>
      <div className="px-4 py-3">
        {/* Header row: avatar + name/to + timestamp + expand toggle */}
        <div className="flex items-start gap-2">
          <EmailAvatar initials={initials} role={message.role} />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              {/* Left: name + to */}
              <div className="min-w-0">
                <p className="font-bold text-[14px] text-[#333] leading-tight">
                  {message.sender}
                </p>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <span className="text-[11px] text-[#333]">
                    To: {toAddress}
                  </span>
                  <ChevronDown className="w-3 h-3 text-[#526b7a] shrink-0" />
                </div>
              </div>

              {/* Right: timestamp + collapse toggle */}
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] text-[#333] text-right whitespace-nowrap">
                  {message.timestamp}
                </span>
                <button
                  onClick={onToggle}
                  className="text-[#526b7a] hover:text-[#333] transition-colors p-0.5 rounded hover:bg-[#ECF3F8]"
                >
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 transition-transform duration-200",
                      isExpanded && "rotate-180"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Expanded: body + attachments */}
            {isExpanded && (
              <div className="mt-3">
                <p className="text-[12px] text-[#333] leading-relaxed whitespace-pre-wrap">
                  {message.text}
                </p>

                {message.attachments && message.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {message.attachments.map((att, i) => (
                      <AttachmentChip key={i} attachment={att} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Divider between messages */}
      {!isLast && <div className="h-px bg-[#D2D8DB]" />}
    </div>
  );
}

/* ─── Email thread ───────────────────────────────────────────────────────── */

interface EmailThreadProps {
  messages: Message[];
  contact: Contact;
  className?: string;
}

export function EmailThread({ messages, contact, className }: EmailThreadProps) {
  // Only last message expanded by default
  const [expanded, setExpanded] = useState<boolean[]>(() =>
    messages.map((_, i) => i === messages.length - 1)
  );

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  // Keep expanded array in sync if messages change
  useEffect(() => {
    setExpanded((prev) => {
      if (prev.length === messages.length) return prev;
      return messages.map((_, i) => i === messages.length - 1);
    });
  }, [messages.length]);

  function toggle(i: number) {
    setExpanded((prev) => prev.map((e, j) => (j === i ? !e : e)));
  }

  return (
    <div className={cn("flex-1 overflow-y-auto min-h-0 bg-white", className)}>
      {messages.map((message, i) => (
        <EmailItem
          key={message.id}
          message={message}
          contact={contact}
          isExpanded={expanded[i] ?? false}
          onToggle={() => toggle(i)}
          isLast={i === messages.length - 1}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
