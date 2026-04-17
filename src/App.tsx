import { useEffect, useRef, useState } from "react";
import { TopNav } from "@/components/agent/top-nav";
import { AgentSidebarRail } from "@/components/agent/sidebar-rail";
import { AssignmentPanel } from "@/components/agent/assignment-panel";
import { InteractionSpace } from "@/components/agent/interaction-space";
import { AppSpace } from "@/components/agent/app-space";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { mockContacts, mockMessages } from "@/lib/mock-data";
import type { Message } from "@/lib/mock-data";
import type { ImperativePanelHandle } from "react-resizable-panels";

const APP_SPACE_DEFAULT_PX = 360;
const HANDLE_WIDTH_PX = 16; // w-4 = 1rem = 16px

export default function App() {
  const [activeContactId, setActiveContactId] = useState("sarah-mitchell");
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);

  const panelContainerRef = useRef<HTMLDivElement>(null);
  const appPanelRef = useRef<ImperativePanelHandle>(null);

  const activeContact =
    mockContacts.find((c) => c.id === activeContactId) ?? mockContacts[0];

  const activeMessages = messages[activeContactId] ?? [];

  /** Convert 360px to a percentage of the available panel group width. */
  function calcDefaultPct(): number {
    const containerWidth = panelContainerRef.current?.getBoundingClientRect().width ?? 0;
    if (!containerWidth) return 38; // fallback
    // Subtract p-4 padding (16px × 2 sides) to get inner group width
    const groupWidth = containerWidth - 32;
    const available = groupWidth - HANDLE_WIDTH_PX;
    return Math.round((APP_SPACE_DEFAULT_PX / available) * 1000) / 10; // 1dp
  }

  // Set App Space to exactly 360px once the panel group is mounted and laid out
  useEffect(() => {
    const id = setTimeout(() => {
      appPanelRef.current?.resize(calcDefaultPct());
    }, 0);
    return () => clearTimeout(id);
  }, []);

  function resetPanelLayout() {
    appPanelRef.current?.resize(calcDefaultPct());
  }

  function handleSend(text: string) {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: "Agent Smith",
      role: "agent",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] ?? []), newMessage],
    }));
  }

  return (
    <div className="flex flex-col w-full h-screen bg-[#F5F8FA] overflow-hidden">
      {/* Top navigation — full width */}
      <TopNav />

      {/* Body row — fills remaining height, never wraps */}
      <div className="flex flex-1 min-w-0 overflow-hidden">

        {/* Icon rail — fixed 54px, never shrinks */}
        <div className="relative w-[54px] shrink-0 border-r border-[#D2D8DB] bg-white">
          <AgentSidebarRail />
        </div>

        {/* Assignment panel — fixed 232px */}
        <div className="w-[232px] shrink-0 overflow-hidden">
          <AssignmentPanel
            contacts={mockContacts}
            activeContactId={activeContactId}
            onContactSelect={setActiveContactId}
            className="h-full"
          />
        </div>

        {/* Resizable panels */}
        <div ref={panelContainerRef} className="flex-1 min-w-0 overflow-hidden p-4">
          <ResizablePanelGroup
            direction="horizontal"
            className="h-full"
          >
            <ResizablePanel minSize={25}>
              <InteractionSpace
                contact={activeContact}
                messages={activeMessages}
                onSend={handleSend}
                className="h-full"
              />
            </ResizablePanel>

            <ResizableHandle
              withHandle
              onDoubleClick={resetPanelLayout}
            />

            <ResizablePanel
              ref={appPanelRef}
              defaultSize={38}
              minSize={15}
            >
              <AppSpace contact={activeContact} className="h-full" />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
}
