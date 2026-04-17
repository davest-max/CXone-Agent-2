
import { ChannelTabBar } from "./channel-tab-bar";
import { SubjectLine } from "./subject-line";
import { MessageThread } from "./message-thread";
import { ReplyBox } from "./reply-box";
import { cn } from "@/lib/utils";
import type { Contact, Message } from "@/lib/mock-data";

interface InteractionSpaceProps {
  contact: Contact;
  messages: Message[];
  onSend: (text: string) => void;
  className?: string;
}

export function InteractionSpace({
  contact,
  messages,
  onSend,
  className,
}: InteractionSpaceProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border border-[#D2D8DB] rounded-lg shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Channel tabs header */}
      <ChannelTabBar contact={contact} />

      {/* Subject line */}
      <SubjectLine contact={contact} />

      {/* Message thread — grows to fill */}
      <MessageThread messages={messages} className="bg-white" />

      {/* Reply box */}
      <ReplyBox onSend={onSend} contact={contact} />
    </div>
  );
}
