
import {
  MessageCircle,
  Phone,
  Mail,
  Facebook,
  Twitter,
  MessageSquare,
  ArrowUpRight,
  CheckCircle,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Contact, Channel } from "@/lib/mock-data";

interface ContactTileProps {
  contact: Contact;
  isActive: boolean;
  onClick: () => void;
}

function ChannelIcon({ channel, className }: { channel: Channel; className?: string }) {
  const icons: Record<Channel, React.ElementType> = {
    webchat: MessageCircle,
    phone: Phone,
    email: Mail,
    facebook: Facebook,
    twitter: Twitter,
    sms: MessageSquare,
  };
  const Icon = icons[channel];
  const colors: Record<Channel, string> = {
    webchat: "text-[#005C99]",
    phone: "text-green-600",
    email: "text-pink-600",
    facebook: "text-blue-600",
    twitter: "text-sky-500",
    sms: "text-purple-600",
  };
  return <Icon className={cn("w-4 h-4", colors[channel], className)} />;
}

export function ContactTile({ contact, isActive, onClick }: ContactTileProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onClick(); }}
      className={cn(
        "relative w-full text-left rounded transition-colors group cursor-pointer",
        "border-l-[3px]",
        isActive
          ? "bg-[#EAF1F7] border-l-[#003D7A]"
          : "bg-white border-l-transparent hover:bg-[#F5F8FA] hover:border-l-[#D2D8DB]"
      )}
    >
      {/* Main row */}
      <div className="flex items-start gap-2 px-2 pt-2 pb-1">
        {/* Name + queue */}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-[14px] text-[#191C21] leading-tight truncate">
            {contact.name}
          </div>
          <div className="text-[12px] text-[#333] leading-snug truncate mt-0.5">
            {contact.queue}
          </div>
        </div>

        {/* Duration + channel */}
        <div className="flex items-center gap-1 shrink-0">
          <div className="text-[12px] font-semibold text-black text-center leading-none">
            {contact.duration}
          </div>
          <div className="w-px h-8 bg-[#D2D8DB] mx-1" />
          <div className="flex flex-col items-center gap-0.5">
            <ChannelIcon channel={contact.channel} />
            <ArrowUpRight className="w-3 h-3 text-[#333]" />
          </div>
        </div>
      </div>

      {/* Action row — visible on active tile */}
      {isActive && (
        <div className="flex items-center gap-2 px-2 pb-2 mt-1">
          <div className="flex-1 bg-white rounded shadow-sm border border-[#D2D8DB] flex items-center justify-around p-1">
            <button
              className="p-1 rounded hover:bg-[#ECF3F8] transition-colors"
              title="Transfer"
              onClick={(e) => e.stopPropagation()}
            >
              <ArrowRightLeft className="w-4 h-4 text-[#526b7a]" />
            </button>
            <div className="w-px h-6 bg-[#D2D8DB]" />
            <button
              className="p-1 rounded hover:bg-[#ECF3F8] transition-colors"
              title="Verify"
              onClick={(e) => e.stopPropagation()}
            >
              <CheckCircle className="w-4 h-4 text-[#526b7a]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
