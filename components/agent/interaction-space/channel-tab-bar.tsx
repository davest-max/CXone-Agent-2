
import { MessageCircle, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Contact } from "@/lib/mock-data";

interface ChannelTabBarProps {
  contact: Contact;
  className?: string;
}

const channelLabels: Record<string, string> = {
  webchat: "Webchat",
  phone: "Phone",
  email: "Email",
  facebook: "Facebook",
  twitter: "Twitter",
  sms: "SMS",
};

export function ChannelTabBar({ contact, className }: ChannelTabBarProps) {
  return (
    <div
      className={cn(
        "flex items-end gap-1 px-1 pt-1 bg-[#ECF3F8] border-b border-[#D2D8DB]",
        className
      )}
    >
      {/* Active channel tab — styled as a browser tab */}
      <div className="relative flex items-center gap-1.5 px-2 pt-1 pb-px bg-white border border-[#D2D8DB] border-b-white rounded-t-lg -mb-px min-w-0 max-w-[140px]">
        <MessageCircle className="w-4 h-4 text-[#005C99] shrink-0" />
        <span className="text-[13px] text-black truncate">
          {channelLabels[contact.channel] ?? contact.channel}
        </span>
      </div>

      {/* Add channel button */}
      <button className="flex items-center justify-center w-7 h-7 mb-0.5 rounded hover:bg-[#D2D8DB] transition-colors text-[#526b7a]">
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
