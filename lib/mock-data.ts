export type Channel = "webchat" | "phone" | "email" | "facebook" | "sms" | "twitter";
export type ContactStatus = "active" | "waiting" | "hold";

export interface Contact {
  id: string;
  name: string;
  queue: string;
  channel: Channel;
  duration: string;
  status: ContactStatus;
  unread: boolean;
  caseNumber: string;
}

export type MessageRole = "agent" | "customer";

export interface Message {
  id: string;
  sender: string;
  role: MessageRole;
  text: string;
  timestamp: string;
}

export const mockContacts: Contact[] = [
  {
    id: "sarah-mitchell",
    name: "Sarah Mitchell",
    queue: "Customer Support",
    channel: "webchat",
    duration: "15 min",
    status: "active",
    unread: false,
    caseNumber: "22073579",
  },
  {
    id: "maggie-wilson",
    name: "Maggie Wilson",
    queue: "Customer Support",
    channel: "facebook",
    duration: "15 min",
    status: "waiting",
    unread: true,
    caseNumber: "22073580",
  },
  {
    id: "peter-brier",
    name: "Peter Brier",
    queue: "Sales Support",
    channel: "email",
    duration: "2 hr",
    status: "waiting",
    unread: false,
    caseNumber: "22073581",
  },
];

export const mockMessages: Record<string, Message[]> = {
  "sarah-mitchell": [
    {
      id: "m1",
      sender: "Sarah Mitchell",
      role: "customer",
      text: "Hi, I just got an alert about charges on my account that I didn't make. I'm really worried — what's happening?",
      timestamp: "10:02 AM",
    },
    {
      id: "m2",
      sender: "Agent Smith",
      role: "agent",
      text: "Hi Sarah, I'm so glad you called right away — that was absolutely the right thing to do. I can already see what's happened and I want to take action immediately. I'm blocking your card right now to prevent any further charges, and I'm opening a dispute for both transactions. You'll receive a provisional credit of $341.99 within one business day while we investigate.",
      timestamp: "10:03 AM",
    },
    {
      id: "m3",
      sender: "Sarah Mitchell",
      role: "customer",
      text: "Thank you — will I get a new card quickly? I need it for grocery shopping this week.",
      timestamp: "10:04 AM",
    },
    {
      id: "m4",
      sender: "Agent Smith",
      role: "agent",
      text: "Is your address still – 1 AT&T Way, Arlington, TX 76001?",
      timestamp: "10:05 AM",
    },
    {
      id: "m5",
      sender: "Sarah Mitchell",
      role: "customer",
      text: "Sure is – except the zip code is incorrect. It should be 76011.",
      timestamp: "10:05 AM",
    },
    {
      id: "m6",
      sender: "Agent Smith",
      role: "agent",
      text: "Absolutely. As a Premier member you qualify for complimentary expedited delivery — your new card will arrive in one to two business days. I'd also like to enroll you in real-time transaction alerts so you're notified instantly of any future charges. Would that be helpful?",
      timestamp: "10:06 AM",
    },
    {
      id: "m7",
      sender: "Sarah Mitchell",
      role: "customer",
      text: "Yes please, that would be great. Thank you so much — I feel so much better.",
      timestamp: "10:07 AM",
    },
    {
      id: "m8",
      sender: "Agent Smith",
      role: "agent",
      text: "Great. Can I help you with anything else?",
      timestamp: "10:07 AM",
    },
    {
      id: "m9",
      sender: "Sarah Mitchell",
      role: "customer",
      text: "That's it, thanks.",
      timestamp: "10:08 AM",
    },
    {
      id: "m10",
      sender: "Agent Smith",
      role: "agent",
      text: "Please stay on the call for a quick survey on how I performed and would love a 5 of 5.",
      timestamp: "10:08 AM",
    },
  ],
  "maggie-wilson": [
    {
      id: "m1",
      sender: "Maggie Wilson",
      role: "customer",
      text: "Hi, I have a question about my account statement.",
      timestamp: "9:45 AM",
    },
    {
      id: "m2",
      sender: "Agent Smith",
      role: "agent",
      text: "Hi Maggie! I'd be happy to help. What's your question?",
      timestamp: "9:46 AM",
    },
  ],
  "peter-brier": [
    {
      id: "m1",
      sender: "Peter Brier",
      role: "customer",
      text: "Hello, I'm interested in upgrading my plan.",
      timestamp: "8:30 AM",
    },
    {
      id: "m2",
      sender: "Agent Smith",
      role: "agent",
      text: "Hi Peter! Great to hear from you. Let me pull up your account details.",
      timestamp: "8:32 AM",
    },
  ],
};

export const customerSentimentData = {
  sentiment: "negative" as const,
  summary: "Sarah is worried about the fraudulent charge on her card.",
  score: 2,
};

export const agentName = "Agent Smith";
export const agentInitials = "SE";
export const agentStatus = "Unavailable";
export const agentTimer = "00:21";
