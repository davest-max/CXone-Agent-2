import { useState } from "react";
import { Menu, History, Search, LayoutList, BookUser, Ellipsis, Atom, Contact, CalendarDays } from "lucide-react";
import { AIPanel } from "./ai-panel";
import { AppSearchBar } from "./search-bar";
import { SearchPage }    from "@/components/agent/pages/search-page";
import { QueuePage }     from "@/components/agent/pages/queue-page";
import { DirectoryPage } from "@/components/agent/pages/directory-page";
import { SchedulePage }  from "@/components/agent/pages/schedule-page";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Contact as ContactType } from "@/lib/mock-data";

// className applied to every embedded page — strips the page's own card
// border/shadow/rounded so the App Space card shell is the only frame.
const EMBEDDED = "h-full border-0 shadow-none rounded-none";

export type AppTab = "copilot" | "customer" | "history" | "search" | "queue" | "directory" | "schedule" | "more";

interface AppSpaceProps {
  contact: ContactType;
  activeTab?: AppTab;
  onTabChange?: (tab: AppTab) => void;
  className?: string;
}

type TabItem =
  | { type: "tab"; id: AppTab; icon: React.ElementType; label: string }
  | { type: "separator" };

const appTabs: TabItem[] = [
  { type: "tab", id: "copilot",   icon: Atom,         label: "Copilot" },
  { type: "tab", id: "customer",  icon: Contact,      label: "Customer Card" },
  { type: "separator" },
  { type: "tab", id: "history",   icon: History,      label: "Contact History" },
  { type: "tab", id: "search",    icon: Search,       label: "Search" },
  { type: "tab", id: "queue",     icon: LayoutList,   label: "Queue" },
  { type: "tab", id: "directory", icon: BookUser,     label: "Directory" },
  { type: "tab", id: "schedule",  icon: CalendarDays, label: "Schedule" },
  { type: "tab", id: "more",      icon: Ellipsis,     label: "More" },
];

export function AppSpace({ contact, activeTab: controlledTab, onTabChange, className }: AppSpaceProps) {
  const [internalTab, setInternalTab] = useState<AppTab>("copilot");
  const activeTab = controlledTab ?? internalTab;
  const [queries, setQueries] = useState<string[]>([]);

  function setActiveTab(tab: AppTab) {
    setInternalTab(tab);
    onTabChange?.(tab);
  }

  function handleCopilotQuery(query: string) {
    setQueries((prev) => [...prev, query]);
    setActiveTab("copilot");
  }

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white border border-[#D2D8DB] rounded-lg shadow-sm overflow-hidden",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 shrink-0">
        <span className="text-[15px] font-semibold text-[#333]">App space</span>
        <button className="p-1 rounded hover:bg-[#ECF3F8] transition-colors text-[#526b7a]">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Icon tab bar */}
      <TooltipProvider delayDuration={300}>
        <div className="flex items-center border-b border-[#D2D8DB] px-1 shrink-0 bg-white">
          {appTabs.map((item, i) => {
            if (item.type === "separator") {
              return (
                <div key={`sep-${i}`} className="w-px h-5 bg-[#D2D8DB] mx-1 shrink-0" />
              );
            }
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger
                  onClick={() => setActiveTab(item.id)}
                  className={cn(
                    "flex items-center justify-center w-9 h-9 transition-colors relative",
                    isActive
                      ? "text-[#005C99]"
                      : "text-[#526b7a] hover:text-[#003D7A] hover:bg-[#ECF3F8]"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#005C99] rounded-t-sm" />
                  )}
                </TooltipTrigger>
                <TooltipContent side="bottom" className="text-xs">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>

      {/* Tab content — grows to fill, pages embedded without their card shell */}
      <div className="flex-1 overflow-hidden min-h-0">
        {activeTab === "copilot" && (
          <AIPanel contact={contact} queries={queries} className="h-full" />
        )}
        {activeTab === "search" && (
          <SearchPage className={EMBEDDED} />
        )}
        {activeTab === "queue" && (
          <QueuePage className={EMBEDDED} />
        )}
        {activeTab === "directory" && (
          <DirectoryPage className={EMBEDDED} />
        )}
        {activeTab === "schedule" && (
          <SchedulePage className={EMBEDDED} />
        )}
        {(activeTab === "customer" || activeTab === "history" || activeTab === "more") && (
          <div className="flex items-center justify-center h-full text-[12px] text-[#526b7a]">
            {appTabs.find((t): t is Extract<TabItem, { type: "tab" }> => t.type === "tab" && t.id === activeTab)?.label} — coming soon
          </div>
        )}
      </div>

      {/* Bottom search bar */}
      <div className="border-t border-[#D2D8DB]">
        <AppSearchBar onSubmit={handleCopilotQuery} />
      </div>
    </div>
  );
}
