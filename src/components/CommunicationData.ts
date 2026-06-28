export interface AnnouncementType {
  id: string;
  title: string;
  messageBody: string;
  dateSent: string;
  image: string;
  sentBy: string;
  acknowledgementDate: string;
  announcementSummaryAI: string;
  suggestedFollowUpActionsAI: string;
  preferredCommunicationChannels: string; // e.g. "SMS", "Email", "App Push"
}

export interface AcknowledgementType {
  id: string;
  name: string;
  acknowledgementDate: string;
  staffMember: string;
  announcement: string;
  directMessage: string;
  confirmed: boolean;
  staffPhoto: string;
  notes: string;
  announcementTitle: string;
  staffRole: string;
  acknowledgementQualityAssessment: string; // e.g. "Immediate", "Slight Delay but Compliant"
}

export interface StaffMemberType {
  id: string;
  fullNames: string;
  photo: string;
  role: string;
  contactNumber: string;
  emailAddress: string;
  announcementSent: number;
  directMessagesSent: number;
  acknowledgements: number;
  totalAcknowledgementsSent: number;
  totalDirectMessagesSent: number;
  totalAcknowledgements: number;
  totalAnnouncementSentDate: string; // e.g. "2026-06-18"
  lastDirectMessageSentDate: string;  // e.g. "2026-06-19"
  acknowledgementRate: number; // e.g. 94%
  recentCommunicationSummaryAI: string;
  communicationEngagementScoreAI: number; // e.g. 98
  directMessagesRecipient: string; // recipient summary or notes
}

export interface DirectMessageType {
  id: string;
  messageName: string; // Message Title
  messageContent: string;
  sentAt: string;
  sender: string;
  recipient: string;
  photos: string[];
  acknowledgementDateTime: string;
  confirmed: boolean;
  senderRole: string;
  recipientRole: string;
  messageSentiment: "Positive" | "Neutral" | "Negative";
  messageSummary: string;
}

export const initialAnnouncements: AnnouncementType[] = [
  {
    id: "ann-01",
    title: "Fresh Harvest Logistics: cold room maintenance schedule",
    messageBody: "Please note that Cold Room B will undergo preventative ozone system maintenance on Saturday 20th June, 21:00 UTC. All perishable stock (mainly fresh Nile Perch fillets and Crimson Red Tilapia whole packs) must be moved to Cold Room A to ensure uncompromised shelf life.",
    dateSent: "2026-06-18 09:12",
    image: "❄️",
    sentBy: "Ivan (Lead Marketer & Operator)",
    acknowledgementDate: "2026-06-18 14:30",
    announcementSummaryAI: "Ozone sanitisation maintenance scheduled for Saturday evening. Highly critical temperature protocol transition to prevent spoilage of 3.5 tons of fresh water listing.",
    suggestedFollowUpActionsAI: "1. Staff must complete physical transfer before 18:00 on Saturday; 2. Verification log must be signed off by cold chain supervisor.",
    preferredCommunicationChannels: "Dashboard Alert & SMS Broadcast"
  },
  {
    id: "ann-02",
    title: "New Biosecure Lobster Tail Unit Prices Activated",
    messageBody: "New shipment of high-yield Giant Spiny Lobsters has arrived. The grade-AAA units are now set to Ush 55,000 per pack. Please update customer quotes and ensure traceability QR codes are correctly printed for checkout receipts.",
    dateSent: "2026-06-19 03:45",
    image: "🦞",
    sentBy: "Ivan (Lead Marketer & Operator)",
    acknowledgementDate: "2026-06-19 06:12",
    announcementSummaryAI: "New Giant Spiny Lobster SKU price update. Direct price point calibration to address high-margin catering accounts.",
    suggestedFollowUpActionsAI: "Check all active cart transactions for lobster and ensure dynamic multi-unit pricing calculates correctly.",
    preferredCommunicationChannels: "Slack, WhatsApp & Mobile SMS"
  },
  {
    id: "ann-03",
    title: "Mandatory Perishable Shelf-life Audit Guidelines",
    messageBody: "All warehouse specialists are strictly required to double-check digital sensor expiry indicators every morning at 07:00. Any item within 48 hours of its sell-by date must be marked down by 25% or prioritized for the immediate cook-and-serve channels.",
    dateSent: "2026-06-17 11:20",
    image: "📋",
    sentBy: "Senior Operations Director",
    acknowledgementDate: "2026-06-17 15:10",
    announcementSummaryAI: "Daily 07:00 shelf-life checking protocol. Standardises markdown action at the 48-hour remaining window to maintain zero-waste policy.",
    suggestedFollowUpActionsAI: "Ensure real-time sync with database API is maintained to avoid displaying stale inventory metrics.",
    preferredCommunicationChannels: "In-App Announcement Hub"
  }
];

export const initialAcknowledgements: AcknowledgementType[] = [
  {
    id: "ack-01",
    name: "Albert Mukasa",
    acknowledgementDate: "2026-06-18 11:04",
    staffMember: "Albert Mukasa",
    announcement: "Fresh Harvest Logistics: cold room maintenance schedule",
    directMessage: "None",
    confirmed: true,
    staffPhoto: "👨‍💻",
    notes: "I have reviewed the cold storage relocation map. I'll take responsibility for the shifting process during my afternoon shift on Friday.",
    announcementTitle: "Fresh Harvest Logistics: cold room maintenance schedule",
    staffRole: "Logistics Specialist",
    acknowledgementQualityAssessment: "Immediate • Compliant within 2 hours of post"
  },
  {
    id: "ack-02",
    name: "Florence Namubiru",
    acknowledgementDate: "2026-06-19 04:15",
    staffMember: "Florence Namubiru",
    announcement: "New Biosecure Lobster Tail Unit Prices Activated",
    directMessage: "None",
    confirmed: true,
    staffPhoto: "👩‍💼",
    notes: "Verified the inventory pricing interface. Pricing guidelines updated for corporate caterer catalog views.",
    announcementTitle: "New Biosecure Lobster Tail Unit Prices Activated",
    staffRole: "Sales Associate",
    acknowledgementQualityAssessment: "Prompt • Compliant within 30 mins"
  },
  {
    id: "ack-03",
    name: "Dennis Okello",
    acknowledgementDate: "2026-06-17 14:00",
    staffMember: "Dennis Okello",
    announcement: "Mandatory Perishable Shelf-life Audit Guidelines",
    directMessage: "None",
    confirmed: true,
    staffPhoto: "👨‍🌾",
    notes: "Got it. I will supervise compliance of sensors on Pond B and Fish Farm Cold-store rooms.",
    announcementTitle: "Mandatory Perishable Shelf-life Audit Guidelines",
    staffRole: "recxpats Manager",
    acknowledgementQualityAssessment: "Compliant with minor delay (3 hours)"
  }
];

export const initialStaffMembers: StaffMemberType[] = [
  {
    id: "stf-01",
    fullNames: "Ivan Nabwire",
    photo: "💼",
    role: "Lead Marketer & Operator",
    contactNumber: "+256 701 556 211",
    emailAddress: "ivan@marketer.com",
    announcementSent: 12,
    directMessagesSent: 48,
    acknowledgements: 15,
    totalAcknowledgementsSent: 15,
    totalDirectMessagesSent: 48,
    totalAcknowledgements: 15,
    totalAnnouncementSentDate: "2026-06-19",
    lastDirectMessageSentDate: "2026-06-19 09:30",
    acknowledgementRate: 100,
    recentCommunicationSummaryAI: "High-volume communication driver. Direct focus on cold-chain logistics coordination and real-time seafood pricing calibration lists.",
    communicationEngagementScoreAI: 99,
    directMessagesRecipient: "Liaises directly with Albert (Logistics) and Florence (Sales) regarding orders."
  },
  {
    id: "stf-02",
    fullNames: "Albert Mukasa",
    photo: "👨‍💻",
    role: "Logistics Specialist",
    contactNumber: "+256 782 119 234",
    emailAddress: "albert@logistics.com",
    announcementSent: 2,
    directMessagesSent: 14,
    acknowledgements: 18,
    totalAcknowledgementsSent: 18,
    totalDirectMessagesSent: 14,
    totalAcknowledgements: 18,
    totalAnnouncementSentDate: "2026-06-14",
    lastDirectMessageSentDate: "2026-06-18 15:45",
    acknowledgementRate: 98,
    recentCommunicationSummaryAI: "Consistently acknowledges operational directives. Handles outbound freight dispatch logs and temperature monitor warnings.",
    communicationEngagementScoreAI: 95,
    directMessagesRecipient: "Mainly exchanges thermal shipping lists with Ivan and client support teams."
  },
  {
    id: "stf-03",
    fullNames: "Florence Namubiru",
    photo: "👩‍💼",
    role: "Sales Associate",
    contactNumber: "+256 772 458 901",
    emailAddress: "florence@sales.com",
    announcementSent: 1,
    directMessagesSent: 29,
    acknowledgements: 22,
    totalAcknowledgementsSent: 22,
    totalDirectMessagesSent: 29,
    totalAcknowledgements: 22,
    totalAnnouncementSentDate: "2026-06-18",
    lastDirectMessageSentDate: "2026-06-19 08:15",
    acknowledgementRate: 96,
    recentCommunicationSummaryAI: "Keeps client pricing sheets up to date. Excellent responsiveness to inbound catering and retail pre-orders.",
    communicationEngagementScoreAI: 96,
    directMessagesRecipient: "Regular updates with Florence regarding customized orders and corporate discounts."
  },
  {
    id: "stf-04",
    fullNames: "Dennis Okello",
    photo: "👨‍🌾",
    role: "recxpats Manager",
    contactNumber: "+256 752 990 120",
    emailAddress: "okello@manager.com",
    announcementSent: 5,
    directMessagesSent: 8,
    acknowledgements: 12,
    totalAcknowledgementsSent: 12,
    totalDirectMessagesSent: 8,
    totalAcknowledgements: 12,
    totalAnnouncementSentDate: "2026-06-16",
    lastDirectMessageSentDate: "2026-06-17 11:10",
    acknowledgementRate: 85,
    recentCommunicationSummaryAI: "Highly responsive during harvest cycles but has slight delays during pond feeding shifts.",
    communicationEngagementScoreAI: 84,
    directMessagesRecipient: "Exchanges feed efficiency indices and post-larvae stocking updates with the hatcheries."
  }
];

export const initialDirectMessages: DirectMessageType[] = [
  {
    id: "dm-01",
    messageName: "URGENT: Albert, confirm Cold Space A relocation",
    messageContent: "Hi Albert, please ensure you double-check the temperature controls on Cold Space A. The Nile Perch fillets are ultra-sensitive export grade and require a steady 1.4°C limit.",
    sentAt: "2026-06-19 01:20",
    sender: "Ivan Nabwire",
    recipient: "Albert Mukasa",
    photos: ["❄️", "🐟"],
    acknowledgementDateTime: "2026-06-19 01:45",
    confirmed: true,
    senderRole: "Lead Marketer & Operator",
    recipientRole: "Logistics Specialist",
    messageSentiment: "Neutral",
    messageSummary: "Temperature validation request for Nile Perch relocation. High priority export preservation."
  },
  {
    id: "dm-02",
    messageName: "Inquiry regarding custom scale-and-gut service fee",
    messageContent: "Florence, did the customer at Sesse Seafood joint agree to the +Ush 2,500 value-added cleaning fee? Or should we swallow the expense in the bulk discount matrix?",
    sentAt: "2026-06-18 10:15",
    sender: "Ivan Nabwire",
    recipient: "Florence Namubiru",
    photos: ["🔪"],
    acknowledgementDateTime: "2026-06-18 11:30",
    confirmed: true,
    senderRole: "Lead Marketer & Operator",
    recipientRole: "Sales Associate",
    messageSentiment: "Positive",
    messageSummary: "LPO price margin agreement for value-added scaling services. Confirmed compliance with customer expectations."
  },
  {
    id: "dm-03",
    messageName: "Ozone alert test logs",
    messageContent: "Dennis, can you confirm that the water quality parameters in Pond A-4 match our digital dashboard telemetry rules?",
    sentAt: "2026-06-17 16:50",
    sender: "Lead Operations Director",
    recipient: "Dennis Okello",
    photos: ["🌊"],
    acknowledgementDateTime: "2026-06-17 18:12",
    confirmed: true,
    senderRole: "Senior Operations Director",
    recipientRole: "recxpats Manager",
    messageSentiment: "Neutral",
    messageSummary: "Water telemetry verify protocols for Pond A-4 recxpats check."
  }
];
