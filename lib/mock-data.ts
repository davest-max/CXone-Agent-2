export type Channel = "webchat" | "phone" | "email" | "facebook" | "sms" | "twitter" | "whatsapp";
export type ContactStatus = "active" | "waiting" | "hold";

export interface ContactBadge {
  label: string;
  /** "default" = outline only; "green" = light green bg + green border; "red" = light red bg + red border */
  type: "default" | "green" | "red";
}

export interface CustomerProfile {
  initials: string;
  accountType: string;
  tenureYears: number;
  balance: string;
  fraudRiskScore: number;
  priorDisputes: number;
  cardBlocked: boolean;
  badges: ContactBadge[];
  contextSummary: string;
}

export interface Contact {
  id: string;
  name: string;
  queue: string;
  channel: Channel;
  duration: string;
  status: ContactStatus;
  unread: boolean;
  caseNumber: string;
  profile: CustomerProfile;
  /** Phone number displayed on the active phone-call tile (phone channel only) */
  phoneNumber?: string;
  /** Email subject line (email channel only) */
  emailSubject?: string;
  /** Customer's email address (email channel only) */
  contactEmail?: string;
}

export type MessageRole = "agent" | "customer";

export interface EmailAttachment {
  name: string;
  size: string;
  type: "image" | "pdf" | "file";
}

export interface Message {
  id: string;
  sender: string;
  role: MessageRole;
  text: string;
  timestamp: string;
  /** Attachments (email channel only) */
  attachments?: EmailAttachment[];
}

export const mockContacts: Contact[] = [
  {
    id: "james-harrington",
    name: "James Harrington",
    queue: "BAC OB Phone",
    channel: "phone",
    duration: "3 min",
    phoneNumber: "253-895-8956",
    status: "active",
    unread: false,
    caseNumber: "22073582",
    profile: {
      initials: "JH",
      accountType: "Personal Banking",
      tenureYears: 4,
      balance: "$12,800.00",
      fraudRiskScore: 22,
      priorDisputes: 0,
      cardBlocked: false,
      badges: [
        { label: "Premier", type: "default" },
        { label: "IVR Auth ✓", type: "green" },
      ],
      contextSummary:
        "4-year Premier client calling about a recent transaction inquiry. IVR authentication passed. Sentiment: Calm and straightforward.",
    },
  },
  {
    id: "sarah-mitchell",
    name: "Sarah Mitchell",
    queue: "Customer Support",
    channel: "webchat",
    duration: "15 min",
    status: "active",
    unread: false,
    caseNumber: "22073579",
    profile: {
      initials: "SM",
      accountType: "Personal Banking",
      tenureYears: 3,
      balance: "$8,420.50",
      fraudRiskScore: 71,
      priorDisputes: 2,
      cardBlocked: true,
      badges: [
        { label: "Premier", type: "default" },
        { label: "Card Blocked", type: "red" },
      ],
      contextSummary:
        "3-year Premier client. Card currently blocked due to suspected fraudulent charges. Two prior disputes on record. Sentiment: Worried and seeking reassurance.",
    },
  },
  {
    id: "alex-chen",
    name: "Alex Chen",
    queue: "Social Support",
    channel: "twitter",
    duration: "8 min",
    status: "waiting",
    unread: true,
    caseNumber: "22073583",
    profile: {
      initials: "AC",
      accountType: "Personal Banking",
      tenureYears: 1,
      balance: "$2,340.00",
      fraudRiskScore: 45,
      priorDisputes: 0,
      cardBlocked: false,
      badges: [
        { label: "Standard", type: "default" },
      ],
      contextSummary:
        "New client (1 year) reaching out via Twitter/X about a delayed transfer. First contact via social channel. Sentiment: Frustrated but polite.",
    },
  },
  {
    id: "fatima-al-hassan",
    name: "Fatima Al-Hassan",
    queue: "Customer Support",
    channel: "whatsapp",
    duration: "12 min",
    status: "waiting",
    unread: true,
    caseNumber: "22073584",
    profile: {
      initials: "FA",
      accountType: "Personal Banking",
      tenureYears: 2,
      balance: "$5,670.25",
      fraudRiskScore: 18,
      priorDisputes: 1,
      cardBlocked: false,
      badges: [
        { label: "Standard", type: "default" },
      ],
      contextSummary:
        "2-year client messaging via WhatsApp about a recurring subscription charge. One prior dispute resolved in her favor. Sentiment: Concerned but cooperative.",
    },
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
    profile: {
      initials: "MW",
      accountType: "Personal Banking",
      tenureYears: 2,
      balance: "$3,150.75",
      fraudRiskScore: 28,
      priorDisputes: 0,
      cardBlocked: false,
      badges: [
        { label: "Standard", type: "default" },
      ],
      contextSummary:
        "2-year client with a clean dispute history and account in good standing. Inquiring about a statement discrepancy. Sentiment: Curious and cooperative.",
    },
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
    emailSubject: "Account Upgrade Inquiry — Enterprise Plan Options",
    contactEmail: "peter.brier@techcorp.com",
    profile: {
      initials: "PB",
      accountType: "Business Banking",
      tenureYears: 7,
      balance: "$245,000.00",
      fraudRiskScore: 12,
      priorDisputes: 1,
      cardBlocked: false,
      badges: [
        { label: "Enterprise", type: "default" },
        { label: "IVR Auth ✓", type: "green" },
      ],
      contextSummary:
        "Long-standing business client (7 years). Interested in a plan upgrade. Account in excellent standing with strong payment history. Sentiment: Professional and motivated.",
    },
  },
];

export const mockMessages: Record<string, Message[]> = {
  "james-harrington": [
    {
      id: "m1",
      sender: "James Harrington",
      role: "customer",
      text: "Hi, I just noticed a charge on my account from yesterday that I don't recognize. Can you help me look into it?",
      timestamp: "10:15 AM",
    },
    {
      id: "m2",
      sender: "Agent Smith",
      role: "agent",
      text: "Hi James, I'll pull up your account now. Can you confirm the last four digits of your card?",
      timestamp: "10:16 AM",
    },
  ],
  "alex-chen": [
    {
      id: "m1",
      sender: "Alex Chen",
      role: "customer",
      text: "Hey @BankSupport — I sent a transfer 3 days ago and it still hasn't arrived. This is really frustrating.",
      timestamp: "9:52 AM",
    },
    {
      id: "m2",
      sender: "Agent Smith",
      role: "agent",
      text: "Hi Alex, sorry to hear that! I'm looking into your transfer now. Can you DM me your account number or case reference?",
      timestamp: "9:54 AM",
    },
  ],
  "fatima-al-hassan": [
    {
      id: "m1",
      sender: "Fatima Al-Hassan",
      role: "customer",
      text: "Hello, I keep getting charged $14.99 every month for a service I cancelled 2 months ago. Can you help?",
      timestamp: "10:01 AM",
    },
    {
      id: "m2",
      sender: "Agent Smith",
      role: "agent",
      text: "Hi Fatima! I can see the recurring charge on your account. Let me pull up the details and get this resolved for you.",
      timestamp: "10:02 AM",
    },
  ],
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
      text: "Hello,\n\nI've been a Business Banking client for 7 years and would like to explore upgrading to an Enterprise plan. We process roughly 500 transactions per month and need higher transfer limits, advanced reporting, and multi-user access with role-based permissions for a team of 12.\n\nCould you please send me details on available options and pricing?\n\nBest regards,\nPeter Brier\nDirector of Finance, TechCorp",
      timestamp: "Mon, July 25 8:30 AM (2 days ago)",
      attachments: [
        { name: "current-plan-summary.pdf", size: "214 KB", type: "pdf" },
        { name: "team-structure.png", size: "88 KB", type: "image" },
      ],
    },
    {
      id: "m2",
      sender: "Agent Smith",
      role: "agent",
      text: "Dear Peter,\n\nThank you for reaching out and for your continued loyalty as a 7-year client. I'd be happy to walk you through our Enterprise plan options.\n\nBased on your requirements — 500+ monthly transactions, high transfer limits, multi-user access, and advanced reporting — our Business Enterprise tier would be an excellent fit. I'm attaching a detailed feature comparison and pricing sheet for your review.\n\nWould you be available for a 30-minute call this week to discuss further?\n\nBest regards,\nCustomer Service",
      timestamp: "Mon, July 25 10:13 AM (2 days ago)",
    },
    {
      id: "m3",
      sender: "Peter Brier",
      role: "customer",
      text: "Hi,\n\nThank you for the quick response and the comparison sheet — very helpful. Thursday at 2 PM works well for a call. Please send over a calendar invite.\n\nOne follow-up question: is there a migration path from our current plan that avoids service interruption? We can't afford any downtime during month-end processing.\n\nLooking forward to the conversation.\n\nBest,\nPeter Brier",
      timestamp: "Mon, July 26 9:19 AM (Yesterday)",
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
