
import { useState } from "react";
import { TopNav } from "@/components/agent/top-nav";
import { AgentSidebarRail } from "@/components/agent/sidebar-rail";
import { AssignmentPanel } from "@/components/agent/assignment-panel";
import { InteractionSpace } from "@/components/agent/interaction-space";
import { AppSpace } from "@/components/agent/app-space";
import { NavRouter } from "@/components/agent/pages";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { mockContacts, mockMessages } from "@/lib/mock-data";
import type { Message } from "@/lib/mock-data";

export default function AgentPage() {
  const [activeContactId, setActiveContactId] = useState("sarah-mitchell");
  const [activeNavId, setActiveNavId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(mockMessages);

  function handleContactSelect(id: string) {
    setActiveContactId(id);
    setActiveNavId(null);
  }

  const activeContact =
    mockContacts.find((c) => c.id === activeContactId) ?? mockContacts[0];

  const activeMessages = messages[activeContactId] ?? [];

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
    <div className="flex flex-col h-screen bg-[#F5F8FA] overflow-hidden">
      {/* Top navigation bar */}
      <TopNav />

      {/* Body: left fixed columns + resizable right panels */}
      <div className="flex flex-1 overflow-hidden">

        {/* Icon rail — fixed width, always visible */}
        <div className="w-[52px] shrink-0 border-r border-[#D2D8DB] bg-white flex flex-col">
          <AgentSidebarRail activeNavId={activeNavId} onNavSelect={setActiveNavId} />
        </div>

        {/* Assignment / contacts panel — 232px, fixed */}
        <div className="w-[232px] shrink-0 overflow-hidden">
          <AssignmentPanel
            contacts={mockContacts}
            activeContactId={activeContactId}
            onContactSelect={handleContactSelect}
            className="h-full"
          />
        </div>

        {/* Main content: nav page OR resizable interaction + app space */}
        <div className="flex-1 overflow-hidden p-2">
          {activeNavId ? (
            <NavRouter navId={activeNavId} className="h-full" />
          ) : (
            <ResizablePanelGroup
              direction="horizontal"
              className="h-full gap-2"
            >
              <ResizablePanel defaultSize={62} minSize={40}>
                <InteractionSpace
                  contact={activeContact}
                  messages={activeMessages}
                  onSend={handleSend}
                  className="h-full"
                />
              </ResizablePanel>

              <ResizableHandle withHandle className="bg-transparent w-2 mx-0" />

              <ResizablePanel defaultSize={38} minSize={25}>
                <AppSpace contact={activeContact} className="h-full" />
              </ResizablePanel>
            </ResizablePanelGroup>
          )}
        </div>
      </div>
    </div>
  );
}
