import React, { useState, useEffect } from "react";
import { 
  Search, Image as ImageIcon, Tag, Calendar, DollarSign, Award, AlertTriangle, 
  Clock, Clipboard, Heart, Sparkles, Star, ThumbsUp, BookOpen, MessageSquare, 
  Plus, Trash2, Camera, CheckCircle, Truck, Info, X, ChevronRight, Play, 
  Users, Ticket, Send, RefreshCw, ShoppingCart, ShoppingBag, ArrowLeft
} from "lucide-react";
import {
  initialAnnouncements,
  initialAcknowledgements,
  initialStaffMembers,
  initialDirectMessages,
  AnnouncementType,
  AcknowledgementType,
  StaffMemberType,
  DirectMessageType
} from "./CommunicationData";
import AppLogo from "./AppLogo";
import BackgroundWatermark from "./BackgroundWatermark";

// Types
export interface ProductType {
  id: string;
  name: string;
  photo: string;
  origin: string;
  grade: string;
  description: string;
  educationalContent: string;
  unitOptions: string[];
  unitPrice: number;
  totalOrders: number;
  qrCode: string; // text description or mock svg
  stockDate: string;
  relatedOrders: string[];
  customerReviews: string[];
  avgStarRating: number;
  recommendation: string;
  nrOfReviews: number;
  sentimentSummary: string;
  customers: string[];
  totalSalesValue: number;
  shelfLifeDays: number;
  harvestDate: string;
  category?: string;
}

export interface OrderType {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  customerContact: string;
  customerCountry: string;
  productsOrdered: { productId: string; name: string; quantity: number; weightKg: number; unitPrice: number; service: string; selectedUnit?: string }[];
  totalQuantity: number;
  totalWeightKg: number;
  valueAddedServices: string;
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Pending" | "Canceled";
  paymentMethod: "Mobile Money" | "Credit/Debit Card" | "Digital Wallet";
  paymentStatus: string;
  invoicePhoto: string;
  specialInstructions: string;
  qrCode: string;
  nrOfProductsOrdered: number;
  totalProductsValue: number;
  avgProductPrice: number;
  orderSummary: string;
  recipeSuggestion: string;
  supportTickets: string[];
  recommendationUpsell: string;
}

export interface RecommendationType {
  productName: string;
  recType: "Product" | "Recipe" | "Educational Content";
  suggestedProduct: string;
  suggestedContent: string;
  customerName: string;
  personalizationReason: string;
  dateGenerated: string;
  isActive: boolean;
  visualPreviews: string;
  associatePreviews: string[];
  associateOrders: string[];
  orderValue: number;
  recSummary: string;
  qualityScore: number;
}

export interface EducationalContentType {
  productName: string;
  contentType: string;
  description: string;
  visuals: string;
  videoLink: string;
  difficultyLevel: "Easy" | "Medium" | "Master Chef";
  prepTimeMins: number;
  relatedProducts: string[];
  recommendedFor: string;
  avgStarRating: number;
  nrOfReviews: number;
  nrRelatedProducts: number;
  estimatedTotalPrepTime: number;
  contentSummaryAI: string;
  contentCategoryAI: string;
  customers: string[];
}

export interface ReviewType {
  productName: string;
  reviewPhoto: string;
  starRatingNum: number;
  reviewComment: string;
  reviewDate: string;
  customerName: string;
  reviewLength: number;
  reviewSentimentAI: "Positive" | "Neutral" | "Negative";
  reviewSummaryAI: string;
  educationalContent: string;
}

export interface SupportTicketType {
  id: string;
  ticketSubject: string;
  customer: string;
  inquiryType: string;
  submissionDate: string;
  status: "Open" | "In Progress" | "Resolved";
  assignedAgent: string;
  liveChatTranscript: { sender: "Customer" | "Agent"; text: string; time: string }[];
  relatedOrder: string;
  attachments: string[];
  resolutionNotes: string;
  orderNumber: string;
  orderDate: string;
  orderStatus: string;
  responseTime: string;
  ticketSummaryAI: string;
  suggestedNextActionAI: string;
}

export interface CustomerType {
  fullNames: string;
  emailAddress: string;
  phoneNumber: string;
  profilePhoto: string;
  companyName: string;
  role: string;
  preferredProduct: string;
  preferredServices: string;
  purchaseHistory: string[];
  savedRecommendations: string[];
  submittedReviews: string[];
  supportTickets: string[];
  favouriteProducts: string[];
  totalOrders: number;
}

// Initial Mock Data
const initialProducts: ProductType[] = [
  {
    id: "prod-nil-01",
    name: "Fresh Nile Perch Fillet",
    photo: "🐟",
    origin: "Lake Victoria, Jinja Reef",
    grade: "Export Grade AAA",
    description: "Lean, high-protein white fish fillet. Sourced directly from sustainably managed, biosecure wild-catch landing sites. Delicate flavor profile with superb flaking characteristics.",
    educationalContent: "Pan-Seared Nile Perch with Warm Tomato-Caper Jam",
    unitOptions: ["500g Vacuum Pack", "1kg Bulk Fillet Tray", "5kg Catering Crate"],
    unitPrice: 18500,
    totalOrders: 1420,
    qrCode: "MOCK_QR_NILE_PERCH_LV_094",
    stockDate: "2026-06-17",
    relatedOrders: ["SF-2026-102", "SF-2026-105", "SF-2026-112"],
    customerReviews: ["Excellent thick fillets!", "Extremely fresh, delivered frozen in ozone boxes.", "Great value for export grade fish."],
    avgStarRating: 4.9,
    recommendation: "Highly recommended for weight management and high-protein sports nutrition diets.",
    nrOfReviews: 48,
    sentimentSummary: "94% Positive. Universal praise for extreme freshness, absence of muddy aftertaste, and premium vacuum containment.",
    customers: ["Jalon Kibwola", "Albert Mukasa", "Serene Caterers Ltd"],
    totalSalesValue: 26270000,
    shelfLifeDays: 5,
    harvestDate: "2026-06-16",
    category: "recxpats & Farm Produce"
  },
  {
    id: "prod-til-02",
    name: "Crimson Red Tilapia (Whole)",
    photo: "🐠",
    origin: "Kalangala Bio-farms Sesse",
    grade: "Grade A Premium",
    description: "Plump, premium feed-converted pond-raised red tilapia. Harvested under rigorous biosecure containment. Outstanding sweet flavour with solid meat density.",
    educationalContent: "Herb-Stuffed Oven-Roasted Red Tilapia",
    unitOptions: ["Single Medium Whole Fish (350g-500g)", "Large Whole Fish (700g-900g)", "3kg Family Pack"],
    unitPrice: 12500,
    totalOrders: 980,
    qrCode: "MOCK_QR_RED_TILAPIA_KA_221",
    stockDate: "2026-06-18",
    relatedOrders: ["SF-2026-103", "SF-2026-108"],
    customerReviews: ["Scale removal was painless because they arrived pre-gutted.", "The flesh was exceptionally sweet and structured."],
    avgStarRating: 4.8,
    recommendation: "Optimal choice for authentic Ugandan whole fried tilapia preparation.",
    nrOfReviews: 32,
    sentimentSummary: "91% Positive. Commended for size consistency, complete gut-cleanliness, and firm skin integrity.",
    customers: ["Florence Namubiru", "Kla Seafood Plaza", "Jalon Kibwola"],
    totalSalesValue: 12250000,
    shelfLifeDays: 3,
    harvestDate: "2026-06-17",
    category: "recxpats & Farm Produce"
  },
  {
    id: "prod-cat-03",
    name: "African Catfish (Clean Gutted)",
    photo: "🎏",
    origin: "Nile-Aquascapes Earth Ponds",
    grade: "Grade A Standard",
    description: "Grown using high-survival Clarias fingerlings. Exceptionally rich meat high in healthy omega fatty acids. Delivered post-gutted with protective ice lining.",
    educationalContent: "Spicy Nile Catfish Coconut Curry Stew",
    unitOptions: ["1kg Gutted Whole Fish", "2kg Family Share Pack", "10kg Bulk Commercial Tub"],
    unitPrice: 9500,
    totalOrders: 650,
    qrCode: "MOCK_QR_CATFISH_NA_551",
    stockDate: "2026-06-15",
    relatedOrders: ["SF-2026-101", "SF-2026-114"],
    customerReviews: ["Tasted amazing in catfish curry. No muddy taste at all.", "Very rich oil content. Thick steaks."],
    avgStarRating: 4.7,
    recommendation: "Recommended for rich stews, slow smoking, and hot pepper mud fish culinary styles.",
    nrOfReviews: 22,
    sentimentSummary: "88% Positive. Reviewers highlight superb rich texture and fast cooking rate.",
    customers: ["Kampala Catering Hub", "Mukono Fish Market", "Sarah Nakintu"],
    totalSalesValue: 6175000,
    shelfLifeDays: 4,
    harvestDate: "2026-06-14",
    category: "recxpats & Farm Produce"
  },
  {
    id: "prod-prawn-04",
    name: "Biosecure Jumbo Tiger Prawns",
    photo: "🍤",
    origin: "Sesse Island Coastal Basins",
    grade: "Export Grade AAA",
    description: "Gigantic Tiger Prawns flash-frozen within minutes of capture. Sustainably fed with elite fish farm formulations in state-of-the-art biosecure basins.",
    educationalContent: "Kampala Garlic Butter Grilled Platter",
    unitOptions: ["500g Box (De-veined)", "1kg Pack (Shell-on Head-on)"],
    unitPrice: 38000,
    totalOrders: 310,
    qrCode: "MOCK_QR_PRAWNS_SI_112",
    stockDate: "2026-06-16",
    relatedOrders: ["SF-2026-119"],
    customerReviews: ["These are massive! Tasted restaurant-grade.", "Worth every single shilling. Sweeter than ocean imports."],
    avgStarRating: 5.0,
    recommendation: "Perfect luxury option for catering special institutional Banquets or high-end dining.",
    nrOfReviews: 19,
    sentimentSummary: "98% Positive. Celebrated for mammoth sizing, superb firm bite, and ease of de-veining.",
    customers: ["Sheraton Banqueting", "Jalon Kibwola", "Pearl of Africa Bistro"],
    totalSalesValue: 11780000,
    shelfLifeDays: 7,
    harvestDate: "2026-06-15",
    category: "recxpats & Farm Produce"
  },
  {
    id: "prod-solar-450",
    name: "Mono-Crystalline Solar Panel (450W)",
    photo: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&auto=format&fit=crop&q=60",
    origin: "RecXpats Kampala Warehouse",
    grade: "Tier 1 Premium Pro",
    description: "High-grade solar paneled monocrystalline PV units designed to maximize ambient ray conversion. Robust anti-shatter finish, fully resistant to farm dust, salt moisture, and heavy downpours.",
    educationalContent: "Solar Setup: Powering recxpats aeration grids and water pumps efficiently",
    unitOptions: ["1x 450W Panel Board", "4x Panel Aerator Power Pack", "10x Panel Grid Setup"],
    unitPrice: 580000,
    totalOrders: 420,
    qrCode: "MOCK_QR_MONO_SOLAR_450",
    stockDate: "2026-06-18",
    relatedOrders: [],
    customerReviews: ["Perfect clean energy solution. Zero cost offset after initial panel installations.", "Durable aluminum construction handles high wind easily."],
    avgStarRating: 4.9,
    recommendation: "Highly recommended for running automatic oxygenation loops and remote guard units.",
    nrOfReviews: 14,
    sentimentSummary: "96% Positive. Commended for steady performance even during partial cloud days.",
    customers: ["Albert Mukasa", "Okello Lawrence"],
    totalSalesValue: 243600000,
    shelfLifeDays: 1800,
    harvestDate: "2026-06-01",
    category: "Solar Power Systems"
  },
  {
    id: "prod-battery-200",
    name: "Lithium LiFePO4 Smart Battery (200Ah)",
    photo: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=400&auto=format&fit=crop&q=60",
    origin: "Central Grid Electronics, Kampala",
    grade: "Grade A Elite Cells",
    description: "Deep-cycle lithium iron phosphate battery featuring built-in smart battery protection (BMS). Excellent safety profiles with over 4,000 discharge cycles. Perfectly stores solar energy to power pond aerators overnight.",
    educationalContent: "Wiring battery cells in series and parallel configurations securely for fish farm systems",
    unitOptions: ["1x 12V 200Ah Battery Pack", "1x 24V Heavy Duty Storage Tank"],
    unitPrice: 1950000,
    totalOrders: 85,
    qrCode: "MOCK_QR_LIFEPO4_BATTERY",
    stockDate: "2026-06-18",
    relatedOrders: [],
    customerReviews: ["Zero voltage drop throughout the night. Keeps camera networks and oxygenators online.", "Extremely quick charging cycle under high UV index hours."],
    avgStarRating: 5.0,
    recommendation: "Excellent investment to safeguard against public utility load shedding.",
    nrOfReviews: 8,
    sentimentSummary: "100% Positive. Rated extremely high for long life-expectancy and advanced protection features.",
    customers: ["Luwero Broodstock Fish Farm", "Florence Namubiru"],
    totalSalesValue: 165750000,
    shelfLifeDays: 2500,
    harvestDate: "2026-06-05",
    category: "Solar Power Systems"
  },
  {
    id: "prod-pump-dc400",
    name: "Submersible DC Water Pump (400W)",
    photo: "https://images.unsplash.com/photo-1616400619175-5ebd3659af97?w=400&auto=format&fit=crop&q=60",
    origin: "RecXpats Engineering Lab, Jinja",
    grade: "Grade A Heavy Duty",
    description: "Unbelievably efficient DC submersible water pump. Plugs directly into 24V solar panels or matching battery cells without using expensive inverter units. Designed to pump up to 10,000 liters per hour.",
    educationalContent: "Piping friction and pumping head pressure management for large recxpats ponds",
    unitOptions: ["1x Submersible Pump only", "1x Submersible Pump + 30m Water Hose Pipe Kit"],
    unitPrice: 850000,
    totalOrders: 154,
    qrCode: "MOCK_QR_DC_WATER_PUMP_400W",
    stockDate: "2026-06-18",
    relatedOrders: [],
    customerReviews: ["Pumps clean water into holding basins beautifully.", "Quiet operations. Stainless steel impeller is great for longevity."],
    avgStarRating: 4.8,
    recommendation: "Ideal for deep water intake wells and biosecure water flushing.",
    nrOfReviews: 19,
    sentimentSummary: "93% Positive. Users praise simple wiring connections and massive volumetric output rate.",
    customers: ["Albert Mukasa", "Nile-Aquascapes Earth Ponds"],
    totalSalesValue: 130900000,
    shelfLifeDays: 1400,
    harvestDate: "2026-06-10",
    category: "Water & Irrigation"
  },
  {
    id: "prod-drill-power",
    name: "Heavy-Duty Brushless Farm Drill Kit",
    photo: "🛠️",
    origin: "Hardware General Imports, Kampala",
    grade: "Industrial Pro",
    description: "Cordless brushless impact drill kit with high-capacity rechargeable battery nodes. Ideal for installing pump brackets, solar framework, or aerator mounts.",
    educationalContent: "Installing and securing brackets for solar panels on farm roofs and ground mounts",
    unitOptions: ["1x Drill Kit with Hard Case", "1x Drill Kit + Double Spare Batteries"],
    unitPrice: 420000,
    totalOrders: 60,
    qrCode: "MOCK_QR_BRUSHLESS_DRILL_KIT",
    stockDate: "2026-06-18",
    relatedOrders: [],
    customerReviews: ["Incredible torque capacity.", "Battery lasted the entire solar mount installation day."],
    avgStarRating: 4.7,
    recommendation: "High reliability tool for any farm technician who handles constant grid or equipment installations.",
    nrOfReviews: 11,
    sentimentSummary: "91% Positive. Lauded for high structural grip comfort, quick trigger response, and long battery life.",
    customers: ["Okello Lawrence", "Florence Namubiru"],
    totalSalesValue: 25200000,
    shelfLifeDays: 1000,
    harvestDate: "2026-05-20",
    category: "Machinery & Hardware"
  }
];

const initialOrders: OrderType[] = [
  {
    orderNumber: "SF-2026-101",
    orderDate: "2026-06-18 08:30",
    customerName: "Jalon Kibwola",
    customerEmail: "jalonkibwola22@gmail.com",
    customerAddress: "Plot 42 Jinja Road, Kampala",
    customerContact: "+256 771 234 567",
    customerCountry: "Uganda",
    productsOrdered: [
      { productId: "prod-nil-01", name: "Fresh Nile Perch Fillet", quantity: 3, weightKg: 1.5, unitPrice: 18500, service: "Deboned & Vacuum Sealed" },
      { productId: "prod-prawn-04", name: "Biosecure Jumbo Tiger Prawns", quantity: 2, weightKg: 1.0, unitPrice: 38000, service: "Flash Frozen Shell-on" }
    ],
    totalQuantity: 5,
    totalWeightKg: 2.5,
    valueAddedServices: "Deboned & Vacuum Sealed, Packaged with food-grade dry ice containers.",
    orderStatus: "Processing",
    paymentMethod: "Mobile Money",
    paymentStatus: "Settled & Escrow Locked",
    invoicePhoto: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=300",
    specialInstructions: "Please maintain under 4°C during transport. Deliver directly to the fish farm reception.",
    qrCode: "TRACE_QR_SF_2026_101",
    nrOfProductsOrdered: 2,
    totalProductsValue: 131500,
    avgProductPrice: 28250,
    orderSummary: "Premium Nile Perch and Jumbo Prawn combo for executive staff lunch.",
    recipeSuggestion: "Pair Perch fillet with lemon garlic, and quick-sear prawns with native salted compound butter.",
    supportTickets: ["STK-9902"],
    recommendationUpsell: "Add standard Colorimetric test reagent to ensure holding tank water safety!"
  },
  {
    orderNumber: "SF-2026-102",
    orderDate: "2026-06-17 14:15",
    customerName: "Kampala Seafood Plaza",
    customerEmail: "logistics@seafoodplaza.co.ug",
    customerAddress: "City Square Mall Block B, Kampala",
    customerContact: "+256 701 889 231",
    customerCountry: "Uganda",
    productsOrdered: [
      { productId: "prod-til-02", name: "Crimson Red Tilapia (Whole)", quantity: 20, weightKg: 16.0, unitPrice: 12500, service: "Scaled & Gutted" },
      { productId: "prod-nil-01", name: "Fresh Nile Perch Fillet", quantity: 10, weightKg: 5.0, unitPrice: 18500, service: "None - Whole chilled" }
    ],
    totalQuantity: 30,
    totalWeightKg: 21.0,
    valueAddedServices: "Pre-skewered gills, double salt brine treatment.",
    orderStatus: "Shipped",
    paymentMethod: "Credit/Debit Card",
    paymentStatus: "Settled via Gateway",
    invoicePhoto: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=300",
    specialInstructions: "Notify terminal supervisor upon shipping terminal exit.",
    qrCode: "TRACE_QR_SF_2026_102",
    nrOfProductsOrdered: 2,
    totalProductsValue: 435000,
    avgProductPrice: 15500,
    orderSummary: "Commercial restock for city center restaurant grills.",
    recipeSuggestion: "Deep score Tilapia skin and stuff with crushed cilantro and lemon peels.",
    supportTickets: [],
    recommendationUpsell: "Suggest subscribing to scheduled monthly Sesse Island catches."
  }
];

const initialRecommendations: RecommendationType[] = [
  {
    productName: "Fresh Nile Perch Fillet",
    recType: "Product",
    suggestedProduct: "Biosecure Jumbo Tiger Prawns",
    suggestedContent: "Sesse Island Garlic Prawn Platter Guide",
    customerName: "Jalon Kibwola",
    personalizationReason: "Customer demonstrates repeat interest in elite, high-grade protein cuts with clean-gutted, export finish.",
    dateGenerated: "2026-06-18",
    isActive: true,
    visualPreviews: "🍤 Prawn Platter Render",
    associatePreviews: ["Nile Perch Skillet Mockup", "Jumbo Prawn Marinade Guide"],
    associateOrders: ["SF-2026-101"],
    orderValue: 131500,
    recSummary: "A highly relevant recommendation combining premium perch fillets with fresh basins prawns for full culinary flexibility.",
    qualityScore: 98
  },
  {
    productName: "Crimson Red Tilapia (Whole)",
    recType: "Recipe",
    suggestedProduct: "Herb-Stuffed Oven-Roasted Red Tilapia",
    suggestedContent: "Step-by-step whole roasted Sesse Tilapia video",
    customerName: "Florence Namubiru",
    personalizationReason: "Interested in low-prep, whole-fish options that maximize aesthetic presentation on platters.",
    dateGenerated: "2026-06-17",
    isActive: true,
    visualPreviews: "🐠 Stuffed baked fish platter",
    associatePreviews: ["Oven Temp Charts"],
    associateOrders: ["SF-2026-105"],
    orderValue: 125000,
    recSummary: "Providing practical cooking instructions directly linked to the exact whole red tilapia they purchased.",
    qualityScore: 92
  }
];

const initialEducations: EducationalContentType[] = [
  {
    productName: "Fresh Nile Perch Fillet",
    contentType: "Recipe Card & Video Walkthrough",
    description: "Detailed breakdown on how to produce premium golden crisp edges on Niles while keeping structural inner flesh perfectly tender.",
    visuals: "📸 Golden crust skillet close-up",
    videoLink: "https://youtube.com/watch?v=SesseNileGuides",
    difficultyLevel: "Medium",
    prepTimeMins: 20,
    relatedProducts: ["Fresh Nile Perch Fillet", "EcoAqua testing tools (for monitoring holding water)"],
    recommendedFor: "Culinary students, local hoteliers, and meal prep enthusiasts.",
    avgStarRating: 4.9,
    nrOfReviews: 12,
    nrRelatedProducts: 1,
    estimatedTotalPrepTime: 30,
    contentSummaryAI: "High-heat cooking instructions to ensure thick perch cuts retain crucial omega fatty moisture.",
    contentCategoryAI: "Seafood Preparation 101",
    customers: ["Jalon Kibwola", "Kampala Culinary Institute"]
  },
  {
    productName: "Crimson Red Tilapia (Whole)",
    contentType: "Safety & Scaling Checklist",
    description: "Detailed checklist highlighting post-catch gutting steps and dry packaging instructions ensuring holding hygiene.",
    visuals: "📸 Hygienic descaling station setup",
    videoLink: "https://youtube.com/watch?v=BiosecureTilapiaCook",
    difficultyLevel: "Easy",
    prepTimeMins: 15,
    relatedProducts: ["Crimson Red Tilapia (Whole)"],
    recommendedFor: "Domestic buyers seeking quick dinner preparations.",
    avgStarRating: 4.7,
    nrOfReviews: 8,
    nrRelatedProducts: 1,
    estimatedTotalPrepTime: 20,
    contentSummaryAI: "Practical safety measures to preserve firm Red Tilapia meat characteristics without heavy salt masks.",
    contentCategoryAI: "Safety and Prep Guides",
    customers: ["Florence Namubiru"]
  }
];

const initialReviews: ReviewType[] = [
  {
    productName: "Fresh Nile Perch Fillet",
    reviewPhoto: "📸 Close up of thick ivory-white Perch Fillet",
    starRatingNum: 5,
    reviewComment: "Truly exceptional cut of Nile Perch. Freshness is immediately noticeable from the neat ivory hue. Zero residual lake slime aroma. Vacuum wrapping and ice blocks held perfectly.",
    reviewDate: "2026-06-18",
    customerName: "Jalon Kibwola",
    reviewLength: 215,
    reviewSentimentAI: "Positive",
    reviewSummaryAI: "Superb packaging, premium meat ivory quality, zero muddy aftertaste.",
    educationalContent: "Pan-Seared Nile Perch with Warm Tomato-Caper Jam"
  },
  {
    productName: "Biosecure Jumbo Tiger Prawns",
    reviewPhoto: "📸 Jumbo prawns laid out on cutting board",
    starRatingNum: 5,
    reviewComment: "These Tiger Prawns are colossal! Incredible bounce when bitten. Deep, clean, slightly sweet profile that completely beats any imported dry packs from supermarkets.",
    reviewDate: "2026-06-18",
    customerName: "Sarah Nakintu",
    reviewLength: 178,
    reviewSentimentAI: "Positive",
    reviewSummaryAI: "Massive sizing, fantastic sweet flavor, superior to imported goods.",
    educationalContent: "Kampala Garlic Butter Grilled Platter"
  }
];

const initialTickets: SupportTicketType[] = [
  {
    id: "STK-9902",
    ticketSubject: "Express Dispatch Temperature Verification",
    customer: "Jalon Kibwola",
    inquiryType: "Seafood Logistics & Shelf-Life",
    submissionDate: "2026-06-18 09:10",
    status: "In Progress",
    assignedAgent: "Evelyn Kigozi",
    liveChatTranscript: [
      { sender: "Customer", text: "Hello, my Nile Perch order SF-2026-101 is scheduled for delivery today. Will it arrive strictly under ice?", time: "09:10" },
      { sender: "Agent", text: "Absolutely, Jalon! All our premium logistics dispatch trucks run under modern active aeration and deep dry ice sealing. We verify and record temperatures before and after exit.", time: "09:12" },
      { sender: "Customer", text: "Understood, please ensure the delivery courier rings the fish farm manager directly upon arrival.", time: "09:15" }
    ],
    relatedOrder: "SF-2026-101",
    attachments: ["Dispatch_Packing_Slip.pdf"],
    resolutionNotes: "Pending confirmation from transit vehicle. Vehicle telemetry logs check out at stable 2.5°C.",
    orderNumber: "SF-2026-101",
    orderDate: "2026-06-18 08:30",
    orderStatus: "Processing",
    responseTime: "2 mins",
    ticketSummaryAI: "Customer wants delivery confirmation ensuring temperature threshold is strict.",
    suggestedNextActionAI: "Confirm delivery truck has dispatched cooler box with ice gel packs."
  }
];

const initialCustomers: CustomerType[] = [
  {
    fullNames: "Jalon Kibwola",
    emailAddress: "jalonkibwola22@gmail.com",
    phoneNumber: "+256 771 234 567",
    profilePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    companyName: "Kibwola Hatcheries Systems",
    role: "Managing Director",
    preferredProduct: "Fresh Nile Perch Fillet",
    preferredServices: "Biosecure dry-ice transport, customized gutted cuts",
    purchaseHistory: ["SF-2026-101", "SF-2026-088"],
    savedRecommendations: ["Jumbo Tiger Prawn recommendation"],
    submittedReviews: ["Nile Perch Premium Review"],
    supportTickets: ["STK-9902"],
    favouriteProducts: ["Fresh Nile Perch Fillet", "Biosecure Jumbo Tiger Prawns"],
    totalOrders: 6
  },
  {
    fullNames: "Florence Namubiru",
    emailAddress: "florence@seafoodplaza.co.ug",
    phoneNumber: "+256 701 889 231",
    profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    companyName: "Kampala Seafood Plaza",
    role: "Procurement Lead",
    preferredProduct: "Crimson Red Tilapia (Whole)",
    preferredServices: "Direct bulk scale & gut preparation",
    purchaseHistory: ["SF-2026-102"],
    savedRecommendations: ["Herb Stuffed recipe recommendation"],
    submittedReviews: [],
    supportTickets: [],
    favouriteProducts: ["Crimson Red Tilapia (Whole)"],
    totalOrders: 14
  }
];

interface MarketplacePortalProps {
  onBackToDashboard?: () => void;
  globalCartCallback?: (cartItems: { id: string; name: string; quantity: number; price: number }[]) => void;
  showAddProduct?: boolean;
  dbLoaded?: boolean;

  // Database-backed states passed from parent
  marketplaceProducts?: ProductType[];
  marketplaceOrders?: OrderType[];
  marketplaceRecommendations?: RecommendationType[];
  marketplaceEducations?: EducationalContentType[];
  marketplaceReviews?: ReviewType[];
  marketplaceTickets?: SupportTicketType[];
  marketplaceCustomers?: CustomerType[];
  announcements?: AnnouncementType[];
  acknowledgements?: AcknowledgementType[];
  communicationStaffMembers?: StaffMemberType[];
  directMessages?: DirectMessageType[];

  // Database Modifiers
  onAddRecord?: (model: string, data: any) => Promise<void>;
  onDeleteRecord?: (model: string, id: string) => Promise<void>;
  onUpdateRecord?: (model: string, id: string, data: any) => Promise<void>;
}

// Helper function to render product photos beautifully, supporting both URLs (Unsplash/Base64) and emojis
const renderProductPhotoHelper = (photoStr: string, sizeClass: string = "w-12 h-12 text-2xl") => {
  if (!photoStr) {
    return <div className={`flex items-center justify-center rounded-2xl bg-slate-100 border border-slate-200 text-slate-400 ${sizeClass}`}>📦</div>;
  }
  const isUrl = photoStr.startsWith("http") || photoStr.startsWith("/") || photoStr.startsWith("data:image") || photoStr.includes(".");
  if (isUrl) {
    return (
      <img
        src={photoStr}
        alt="Product"
        referrerPolicy="no-referrer"
        className={`object-cover rounded-2xl border border-slate-200/80 shadow-xs shrink-0 ${sizeClass}`}
      />
    );
  }
  return (
    <div className={`flex items-center justify-center rounded-2xl bg-slate-50 border border-slate-200/80 shrink-0 select-none ${sizeClass}`}>
      {photoStr}
    </div>
  );
};

export default function MarketplacePortal({
  onBackToDashboard,
  globalCartCallback,
  showAddProduct = false,
  dbLoaded = false,
  marketplaceProducts = [],
  marketplaceOrders = [],
  marketplaceRecommendations = [],
  marketplaceEducations = [],
  marketplaceReviews = [],
  marketplaceTickets = [],
  marketplaceCustomers = [],
  announcements: announcementsProp = [],
  acknowledgements: acknowledgementsProp = [],
  communicationStaffMembers = [],
  directMessages: directMessagesProp = [],
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord
}: MarketplacePortalProps) {
  // Navigation / Selection States
  const [activeTab, setActiveTab] = useState<"products" | "orders" | "recommendations" | "education" | "reviews" | "tickets" | "customers" | "communications">("products");
  
  // Real Data lists derived dynamically from database sync
  const products = (dbLoaded || (marketplaceProducts && marketplaceProducts.length > 0)) ? marketplaceProducts : initialProducts;
  const orders = (dbLoaded || (marketplaceOrders && marketplaceOrders.length > 0)) ? marketplaceOrders : initialOrders;
  const recommendations = (dbLoaded || (marketplaceRecommendations && marketplaceRecommendations.length > 0)) ? marketplaceRecommendations : initialRecommendations;
  const educations = (dbLoaded || (marketplaceEducations && marketplaceEducations.length > 0)) ? marketplaceEducations : initialEducations;
  const reviews = (dbLoaded || (marketplaceReviews && marketplaceReviews.length > 0)) ? marketplaceReviews : initialReviews;
  const tickets = (dbLoaded || (marketplaceTickets && marketplaceTickets.length > 0)) ? marketplaceTickets : initialTickets;
  const customers = (dbLoaded || (marketplaceCustomers && marketplaceCustomers.length > 0)) ? marketplaceCustomers : initialCustomers;

  // Communication States
  const announcements = (dbLoaded || (announcementsProp && announcementsProp.length > 0)) ? announcementsProp : initialAnnouncements;
  const acknowledgements = (dbLoaded || (acknowledgementsProp && acknowledgementsProp.length > 0)) ? acknowledgementsProp : initialAcknowledgements;
  const staffMembers = (dbLoaded || (communicationStaffMembers && communicationStaffMembers.length > 0)) ? communicationStaffMembers : initialStaffMembers;
  const directMessages = (dbLoaded || (directMessagesProp && directMessagesProp.length > 0)) ? directMessagesProp : initialDirectMessages;

  // Active communication views & inputs
  const [newAnnTitle, setNewAnnTitle] = useState("");
  const [newAnnBody, setNewAnnBody] = useState("");
  const [newAnnChannel, setNewAnnChannel] = useState("Dashboard Alert & SMS Broadcast");
  const [newAnnImage, setNewAnnImage] = useState("📢");

  const [newDmName, setNewDmName] = useState("");
  const [newDmContent, setNewDmContent] = useState("");
  const [newDmRecipient, setNewDmRecipient] = useState("Albert Mukasa");
  const [newDmPhoto, setNewDmPhoto] = useState("💬");

  const [activeCommSubTab, setActiveCommSubTab] = useState<"broadcast" | "direct" | "staff" | "rules" | "acknowledgements">("broadcast");
  const [commSearch, setCommSearch] = useState("");

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductItem, setSelectedProductItem] = useState<ProductType | null>(null);
  const [selectedOrderItem, setSelectedOrderItem] = useState<OrderType | null>(null);
  const [selectedTicketItem, setSelectedTicketItem] = useState<SupportTicketType | null>(null);

  // E-Commerce Shopping Cart State
  const [shopCart, setShopCart] = useState<{ productId: string; quantity: number; service: string; selectedUnit: string }[]>([]);
  const [selectedProductUnit, setSelectedProductUnit] = useState<Record<string, string>>({});
  const [cartView, setCartView] = useState<boolean>(false);
  
  // Checkout & Gateway variables
  const [isCheckoutFlow, setIsCheckoutFlow] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState<"Mobile Money" | "Credit/Debit Card" | "Digital Wallet">("Mobile Money");
  const [checkoutName, setCheckoutName] = useState("Jalon Kibwola");
  const [checkoutPhone, setCheckoutPhone] = useState("+256 771 234 567");
  const [checkoutEmail, setCheckoutEmail] = useState("jalonkibwola22@gmail.com");
  const [checkoutAddress, setCheckoutAddress] = useState("Plot 42 Jinja Road, Kampala");
  const [customInstructions, setCustomInstructions] = useState("");
  const [selectedPackingService, setSelectedPackingService] = useState("Deboned & Vacuum Sealed");
  const [checkoutCompleted, setCheckoutCompleted] = useState<string | null>(null); // Order number on success
  
  // Payment simulations
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentProgress, setPaymentProgress] = useState(0);

  // Mobile Money Details
  const [mmNumber, setMmNumber] = useState("+256 771 234 567");
  const [mmOperator, setMmOperator] = useState("MTN Mobile Money");

  // Credit Card Details
  const [cardHolder, setCardHolder] = useState("Jalon Kibwola");
  const [cardNumber, setCardNumber] = useState("4000 1234 5678 9010");
  const [cardExp, setCardExp] = useState("09/29");
  const [cardCvv, setCardCvv] = useState("382");

  // Wallet Details
  const [walletId, setWalletId] = useState("jalon.kibwola.aquawallet");

  // Perishables Shelf Life Warnings & Alerting Indicators State
  const [todayDate] = useState("2026-06-18");
  const [alertNearingSellBy, setAlertNearingSellBy] = useState(true);
  const [selectedWeightKg, setSelectedWeightKg] = useState<number>(1.5); // Weight scale simulation
  const [dynamicPriceMultiplier, setDynamicPriceMultiplier] = useState<number>(1.0); // Dynamic pricing trigger

  // Interactive Create Dialog states
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState("");
  const [newProdOrigin, setNewProdOrigin] = useState("Lake Victoria");
  const [newProdGrade, setNewProdGrade] = useState("Grade A Premium");
  const [newProdPrice, setNewProdPrice] = useState(15000);
  const [newProdDesc, setNewProdDesc] = useState("");
  const [newProdShelfLife, setNewProdShelfLife] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [newProdCategory, setNewProdCategory] = useState<string>("recxpats & Farm Produce");
  const [newProdPhoto, setNewProdPhoto] = useState<string>("");

  // Live support chat state
  const [newChatMessage, setNewChatMessage] = useState("");

  // Handler for adding items to shopping basket with specific unit support
  const addToCart = (productId: string, unitOpt?: string) => {
    const p = products.find(x => x.id === productId);
    const unit = unitOpt || selectedProductUnit[productId] || p?.unitOptions[0] || "1 unit";
    const existingIndex = shopCart.findIndex(i => i.productId === productId && i.selectedUnit === unit);
    if (existingIndex > -1) {
      setShopCart(shopCart.map((item, idx) => idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setShopCart([...shopCart, { productId, quantity: 1, service: selectedPackingService, selectedUnit: unit }]);
    }
  };

  const removeFromCart = (productId: string, selectedUnit: string) => {
    setShopCart(shopCart.filter(i => !(i.productId === productId && i.selectedUnit === selectedUnit)));
  };

  const updateCartQty = (productId: string, selectedUnit: string, val: number) => {
    if (val <= 0) {
      removeFromCart(productId, selectedUnit);
    } else {
      setShopCart(shopCart.map(i => (i.productId === productId && i.selectedUnit === selectedUnit) ? { ...i, quantity: val } : i));
    }
  };

  // Calculate cart totals
  const getCartTotals = () => {
    let subtotal = 0;
    let weight = 0;
    shopCart.forEach(item => {
      const p = products.find(x => x.id === item.productId);
      if (p) {
        // Base weight simulation per pack is 0.5kg
        subtotal += p.unitPrice * item.quantity * dynamicPriceMultiplier;
        weight += 0.5 * item.quantity;
      }
    });
    const tax = Math.floor(subtotal * 0.18);
    const serviceFee = shopCart.length > 0 ? 5000 : 0; // value added preparation fee
    const total = Math.floor(subtotal + tax + serviceFee);
    return { subtotal, weight, tax, serviceFee, total };
  };

  // Trigger simulated payment gate processing
  const handleProceedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessingPayment(true);
    setPaymentProgress(10);
    
    const interval = setInterval(() => {
      setPaymentProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          completeSimulatedOrder();
          return 100;
        }
        return prev + 30;
      });
    }, 450);
  };

  const completeSimulatedOrder = () => {
    setTimeout(() => {
      const { subtotal, weight, total } = getCartTotals();
      const newOrderNum = `SF-2026-${Math.floor(100 + Math.random() * 900)}`;
      
      const orderedProducts = shopCart.map(item => {
        const p = products.find(prod => prod.id === item.productId);
        return {
          productId: item.productId,
          name: p?.name || "Premium Seafood",
          quantity: item.quantity,
          weightKg: 0.5 * item.quantity,
          unitPrice: p?.unitPrice || 10000,
          service: item.service,
          selectedUnit: item.selectedUnit
        };
      });

      const newOrder: OrderType = {
        orderNumber: newOrderNum,
        orderDate: "2026-06-18 10:35",
        customerName: checkoutName,
        customerEmail: checkoutEmail,
        customerAddress: checkoutAddress,
        customerContact: checkoutPhone,
        customerCountry: "Uganda",
        productsOrdered: orderedProducts,
        totalQuantity: shopCart.reduce((sum, item) => sum + item.quantity, 0),
        totalWeightKg: weight,
        valueAddedServices: orderedProducts.map(o => o.service).join(", "),
        orderStatus: "Processing",
        paymentMethod: paymentChoice,
        paymentStatus: "Settled successfully via Biosecurity Gateway",
        invoicePhoto: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=300",
        specialInstructions: customInstructions || "Deliver with fresh ice layers.",
        qrCode: `TRACE_QR_${newOrderNum}`,
        nrOfProductsOrdered: shopCart.length,
        totalProductsValue: subtotal,
        avgProductPrice: subtotal / (shopCart.length || 1),
        orderSummary: `Fresh Seafood package delivered to ${checkoutAddress}.`,
        recipeSuggestion: "Excellent with hot native chilis, white wine reduction or steamed red peppers.",
        supportTickets: [],
        recommendationUpsell: "Add standard biosecure container case for secure storage."
      };

      // Add to orders list
      if (onAddRecord) {
        onAddRecord("marketplaceOrders", newOrder).catch(console.error);
      }
      setShopCart([]);
      setIsProcessingPayment(false);
      setCheckoutCompleted(newOrderNum);
      setIsCheckoutFlow(false);
      setCartView(false);
    }, 300);
  };

  // Simulated live-support chat responder
  const handleSendChatMessage = () => {
    if (!newChatMessage.trim() || !selectedTicketItem) return;

    const timestamp = "10:36";
    const userMsg = { sender: "Customer" as const, text: newChatMessage, time: timestamp };
    
    const updatedChat = [...selectedTicketItem.liveChatTranscript, userMsg];
    
    // AI automatic response based on inquiry
    let agentReplies = [
      "I am preparing the temperature logs for vehicle #CG-48. It remains anchored at 2.6°C.",
      "The fresh catches are vacuum packaged with double-walled insulating dry gel packs. Your freshness is guaranteed.",
      "Yes, the Sesse Island silver fish batch was sorted this morning under biosecure grade A protocols.",
      "Your mobile commerce transfer has been approved by the local billing desk. Status has shifted to processing."
    ];
    let selectedReply = agentReplies[Math.floor(Math.random() * agentReplies.length)];

    setTimeout(() => {
      const updatedTrans = [
        ...updatedChat,
        { sender: "Agent" as const, text: selectedReply, time: "10:37" }
      ];
      if (onUpdateRecord) {
        onUpdateRecord("marketplaceTickets", selectedTicketItem.id, {
          ...selectedTicketItem,
          liveChatTranscript: updatedTrans
        }).then(() => {
          setSelectedTicketItem({ ...selectedTicketItem, liveChatTranscript: updatedTrans });
        }).catch(console.error);
      }
    }, 1000);

    if (onUpdateRecord) {
      onUpdateRecord("marketplaceTickets", selectedTicketItem.id, {
        ...selectedTicketItem,
        liveChatTranscript: updatedChat
      }).catch(console.error);
    }
    setSelectedTicketItem({ ...selectedTicketItem, liveChatTranscript: updatedChat });
    setNewChatMessage("");
  };

  // Simulated addition of a new fish listing
  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    let finalPhoto = newProdPhoto.trim();
    if (!finalPhoto) {
      if (newProdCategory === "Solar Power Systems") {
        finalPhoto = "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&auto=format&fit=crop&q=60";
      } else if (newProdCategory === "Water & Irrigation") {
        finalPhoto = "https://images.unsplash.com/photo-1616400619175-5ebd3659af97?w=400&auto=format&fit=crop&q=60";
      } else if (newProdCategory === "Machinery & Hardware") {
        finalPhoto = "🛠️";
      } else {
        finalPhoto = "🐟";
      }
    }

    const newProd: ProductType = {
      id: `prod-cust-${Date.now()}`,
      name: newProdName,
      photo: finalPhoto,
      origin: newProdOrigin,
      grade: newProdGrade,
      description: newProdDesc || "Premium product listed under safe standards.",
      educationalContent: `${newProdName} operating manual and safety sheet.`,
      unitOptions: ["1x Standard Unit", "10x Bulk Pack"],
      unitPrice: Number(newProdPrice),
      totalOrders: 0,
      qrCode: `MOCK_QR_${newProdName.toUpperCase().replace(/\s+/g, '_')}`,
      stockDate: new Date().toISOString().slice(0, 10),
      relatedOrders: [],
      customerReviews: [],
      avgStarRating: 5.0,
      recommendation: "Excellent quality item standard-tested for professional farm usage.",
      nrOfReviews: 0,
      sentimentSummary: "Pending customer reviews.",
      customers: [],
      totalSalesValue: 0,
      shelfLifeDays: newProdShelfLife,
      harvestDate: new Date().toISOString().slice(0, 10),
      category: newProdCategory
    };

    if (onAddRecord) {
      onAddRecord("marketplaceProducts", newProd).catch(console.error);
    }
    setIsCreatingProduct(false);
    setNewProdName("");
    setNewProdDesc("");
    setNewProdPhoto("");
  };

  const adjustOrderProductQuantity = async (orderNumber: string, productId: string, change: number) => {
    const o = orders.find(ord => ord.orderNumber === orderNumber);
    if (!o) return;

    const updatedProducts = o.productsOrdered.map(p => {
      if (p.productId !== productId) return p;
      const nextQty = Math.max(1, p.quantity + change);
      const singleWeight = p.quantity > 0 ? p.weightKg / p.quantity : 1;
      return {
        ...p,
        quantity: nextQty,
        weightKg: Number((singleWeight * nextQty).toFixed(2))
      };
    });

    const totalQuantity = updatedProducts.reduce((sum, item) => sum + item.quantity, 0);
    const totalWeightKg = updatedProducts.reduce((sum, item) => sum + item.weightKg, 0);
    const totalProductsValue = updatedProducts.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    
    const newOrder: OrderType = {
      ...o,
      productsOrdered: updatedProducts,
      totalQuantity,
      totalWeightKg,
      totalProductsValue,
      avgProductPrice: Number((totalProductsValue / (updatedProducts.length || 1)).toFixed(2))
    };

    if (selectedOrderItem?.orderNumber === orderNumber) {
      setSelectedOrderItem(newOrder);
    }

    if (onUpdateRecord) {
      const recordId = (o as any).id || o.orderNumber;
      await onUpdateRecord("marketplaceOrders", recordId, newOrder);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-3 md:p-6 shadow-sm space-y-6 relative overflow-hidden">
      {/* Center-aligned Brand Watermark */}
      <BackgroundWatermark mode="light" />
      
      {/* Platform Title Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-100 text-emerald-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-200">
              💎 Biosecure E-Commerce Core
            </span>
            <span className="bg-slate-100 text-slate-800 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-slate-200">
              Platform Live
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            🛒 MARKETPLACE
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Browse premium catches, manage complex customized orders, track perishability, and review direct customer CRM data profiles.
          </p>
        </div>

        {/* Back and Shopping Cart triggers */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCartView(!cartView)}
            className="relative px-4 py-2.5 bg-white border border-slate-200 text-slate-800 hover:bg-slate-50 rounded-xl text-xs font-black flex items-center gap-2.5 shadow-xs transition duration-150 cursor-pointer"
          >
            <ShoppingCart size={15} className="text-amber-500" />
            <span>My Basket ({shopCart.reduce((sum, i) => sum + i.quantity, 0)})</span>
            {shopCart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 text-slate-950 font-black text-xs font-mono rounded-full flex items-center justify-center border border-white">
                {shopCart.length}
              </span>
            )}
          </button>

          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="px-4 py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition"
            >
              <ArrowLeft size={14} />
              <span>Exit Portal</span>
            </button>
          )}
        </div>
      </div>

      {/* SHOPPING CART OVERLAY MODAL */}
      {cartView && (
        <div className="bg-white border-2 border-amber-400 p-5 rounded-3xl shadow-lg relative animate-in zoom-in-95 duration-150">
          <button 
            onClick={() => { setCartView(false); setIsCheckoutFlow(false); }}
            className="absolute right-4 top-4 p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X size={16} />
          </button>
          
          <div className="max-w-4xl mx-auto">
            <h2 className="text-base font-black text-slate-850 flex items-center gap-2 mb-4 border-b pb-2">
              <ShoppingBag className="text-amber-500" size={18} />
              <span>Procurement Selections Basket</span>
            </h2>

            {shopCart.length === 0 ? (
              <div className="py-8 text-center text-slate-400 space-y-2">
                <p className="text-sm font-semibold">Your seafood basket is currently empty.</p>
                <p className="text-xs">Browse the Products Gallery on the left catalog below to order monosex fry, fillets, or prawns.</p>
                <button 
                  onClick={() => setCartView(false)}
                  className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-slate-800"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                
                {/* Left Listing */}
                <div className="col-span-1 lg:col-span-3 space-y-3.5 max-h-[300px] overflow-y-auto pr-2">
                  {shopCart.map(item => {
                    const p = products.find(x => x.id === item.productId);
                    if (!p) return null;
                    return (
                      <div key={`${item.productId}-${item.selectedUnit}`} className="flex items-center justify-between bg-slate-50 border border-slate-200/60 p-3 rounded-2xl gap-3 animate-in fade-in duration-200">
                        <div className="flex items-center gap-3">
                          {renderProductPhotoHelper(p.photo, "w-10 h-10 text-xl")}
                          <div>
                            <h4 className="text-xs font-black text-slate-900 leading-tight">{p.name}</h4>
                            <span className="text-[10px] text-slate-400 font-bold block">
                              Origin: {p.origin} • Grade: {p.grade}
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              <span className="text-[9px] text-amber-800 font-extrabold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/50">
                                📦 Unit: {item.selectedUnit}
                              </span>
                              <span className="text-[9px] text-sky-800 font-extrabold bg-sky-50 px-1.5 py-0.5 rounded border border-sky-100">
                                ✂️ prep: {item.service}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Qty incrementer */}
                          <div className="flex items-center bg-white border border-slate-200 rounded-lg px-1 py-0.5 gap-1.5">
                            <button 
                              onClick={() => updateCartQty(item.productId, item.selectedUnit, item.quantity - 1)}
                              className="w-5 h-5 hover:bg-slate-100 text-slate-600 font-black rounded text-xs transition cursor-pointer"
                            >
                              -
                            </button>
                            <span className="text-xs font-mono font-black w-6 text-center">{item.quantity}</span>
                            <button 
                              onClick={() => updateCartQty(item.productId, item.selectedUnit, item.quantity + 1)}
                              className="w-5 h-5 hover:bg-slate-100 text-slate-600 font-black rounded text-xs transition cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-right min-w-[70px]">
                            <span className="text-xs font-mono font-black text-slate-800 block">
                              Ush {(p.unitPrice * item.quantity * dynamicPriceMultiplier).toLocaleString()}
                            </span>
                            <button 
                              onClick={() => removeFromCart(item.productId, item.selectedUnit)}
                              className="text-[10px] uppercase font-black text-red-500 hover:underline cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Packing Value Added Service customizer */}
                  <div className="bg-slate-50 rounded-2xl p-3 border border-slate-150 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 block">Customize Global Preparation Service</label>
                    <select 
                      value={selectedPackingService} 
                      onChange={(e) => {
                        setSelectedPackingService(e.target.value);
                        setShopCart(shopCart.map(item => ({ ...item, service: e.target.value })));
                      }}
                      className="text-xs bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 w-full font-bold outline-none cursor-pointer text-slate-800"
                    >
                      <option value="Deboned & Vacuum Sealed">✂️ Deboned & Vacuum Sealed (Recommended)</option>
                      <option value="Descaled & Gutted Only">Gutted & Descaled Whole</option>
                      <option value="None - Whole Chilled Packed in Dry Ice">Raw Chilled on Food-Grade Ice</option>
                      <option value="Custom Filleting Splitting">Custom Split Steaking (Premium)</option>
                    </select>
                  </div>
                </div>

                {/* Right Summary Panel / Simulated checkout */}
                <div className="col-span-1 lg:col-span-2 bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3.5">
                  <h3 className="text-[11px] font-extrabold uppercase text-slate-600 border-b pb-1.5">Basket Summary</h3>
                  
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Subtotal Value:</span>
                      <span className="font-mono font-black text-slate-800">Ush {getCartTotals().subtotal.toLocaleString()}</span>
                    </div>
                    {dynamicPriceMultiplier !== 1.0 && (
                      <div className="flex justify-between text-yellow-600 bg-yellow-50 p-1 rounded font-bold text-[10px]">
                        <span>Dynamic Pricing Adjusted:</span>
                        <span>x{dynamicPriceMultiplier}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Weight Total:</span>
                      <span className="font-mono font-semibold text-slate-800">{getCartTotals().weight.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Estimated VAT (18%):</span>
                      <span className="font-mono font-black text-slate-800">Ush {getCartTotals().tax.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 font-semibold">Preparation Service Fee:</span>
                      <span className="font-mono font-semibold text-slate-800">Ush {getCartTotals().serviceFee.toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2 mt-2 flex justify-between font-black text-slate-900">
                      <span>Total Invoice Due:</span>
                      <span className="font-mono text-amber-600 text-sm">Ush {getCartTotals().total.toLocaleString()}</span>
                    </div>
                  </div>

                  {!isCheckoutFlow ? (
                    <button 
                      onClick={() => setIsCheckoutFlow(true)}
                      className="w-full bg-slate-900 border border-slate-950 text-white hover:bg-slate-800 rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition active:scale-95 cursor-pointer"
                    >
                      Proceed to Checkout
                    </button>
                  ) : (
                    <form onSubmit={handleProceedPayment} className="space-y-3 pt-3 border-t">
                      
                      <h4 className="text-[10px] font-black uppercase text-slate-500">Integrated Payment Gateway</h4>
                      
                      {/* Dropdown method selection */}
                      <select 
                        value={paymentChoice} 
                        onChange={(e) => setPaymentChoice(e.target.value as any)}
                        className="text-xs bg-white border border-slate-200 rounded-lg px-2 py-1.5 w-full font-bold outline-none cursor-pointer"
                      >
                        <option value="Mobile Money">📲 Mobile Money Gateway</option>
                        <option value="Credit/Debit Card">💳 Credit/Debit Card</option>
                        <option value="Digital Wallet">🏦 Digital Wallet Secure</option>
                      </select>

                      {paymentChoice === "Mobile Money" && (
                        <div className="space-y-1.5 bg-white p-2 border border-slate-150 rounded-xl">
                          <label className="text-[9px] font-black text-slate-400 block uppercase">Mobile Phone Number</label>
                          <input 
                            type="text" 
                            className="bg-slate-50 border border-slate-200 text-xs px-2 py-1 rounded w-full font-mono font-black"
                            value={mmNumber} 
                            onChange={(e) => setMmNumber(e.target.value)} 
                          />
                          <select 
                            value={mmOperator} 
                            onChange={(e) => setMmOperator(e.target.value)}
                            className="text-[9px] bg-slate-50 border border-slate-200 rounded p-1 w-full font-bold cursor-pointer"
                          >
                            <option>MTN Mobile Money</option>
                            <option>Airtel Money Uganda</option>
                          </select>
                        </div>
                      )}

                      {paymentChoice === "Credit/Debit Card" && (
                        <div className="space-y-1.5 bg-white p-2 border border-slate-150 rounded-xl">
                          <input 
                            type="text" 
                            className="bg-slate-50 border border-slate-200 text-xs px-2 py-1 rounded w-full font-semibold"
                            placeholder="Card Holder Name"
                            value={cardHolder} 
                            onChange={(e) => setCardHolder(e.target.value)} 
                          />
                          <input 
                            type="text" 
                            className="bg-slate-50 border border-slate-200 text-xs px-2 py-1 rounded w-full font-mono font-black"
                            placeholder="Card Number"
                            value={cardNumber} 
                            onChange={(e) => setCardNumber(e.target.value)} 
                          />
                          <div className="grid grid-cols-2 gap-1">
                            <input 
                              type="text" 
                              className="bg-slate-50 border border-slate-200 text-xs px-2 py-1 rounded text-center font-mono"
                              placeholder="MM/YY"
                              value={cardExp} 
                              onChange={(e) => setCardExp(e.target.value)} 
                            />
                            <input 
                              type="text" 
                              className="bg-slate-50 border border-slate-200 text-xs px-2 py-1 rounded text-center font-mono"
                              placeholder="CVV"
                              value={cardCvv} 
                              onChange={(e) => setCardCvv(e.target.value)} 
                            />
                          </div>
                        </div>
                      )}

                      {paymentChoice === "Digital Wallet" && (
                        <div className="space-y-1.5 bg-white p-2 border border-slate-150 rounded-xl">
                          <label className="text-[9px] font-black text-slate-400 block uppercase">Bio-Secure Digital Wallet Address</label>
                          <input 
                            type="text" 
                            className="bg-slate-50 border border-slate-200 text-xs px-2 py-1 rounded w-full font-mono font-black"
                            value={walletId} 
                            onChange={(e) => setWalletId(e.target.value)} 
                          />
                        </div>
                      )}

                      {/* Recipient Details */}
                      <div className="space-y-2 pt-1.5 border-t">
                        <label className="text-[9px] font-black text-slate-400 uppercase block">Delivery Coordinates & Info</label>
                        <input 
                          type="text" 
                          placeholder="Recipient Name" 
                          className="bg-white border border-slate-200 text-xs px-2 py-1 rounded w-full font-semibold"
                          value={checkoutName} 
                          onChange={(e) => setCheckoutName(e.target.value)} 
                        />
                        <input 
                          type="text" 
                          placeholder="Recipient Contact Phone" 
                          className="bg-white border border-slate-200 text-xs px-2 py-1 rounded w-full font-mono"
                          value={checkoutPhone} 
                          onChange={(e) => setCheckoutPhone(e.target.value)} 
                        />
                        <input 
                          type="text" 
                          placeholder="Delivery Location Address" 
                          className="bg-white border border-slate-200 text-xs px-2 py-1 rounded w-full text-slate-700"
                          value={checkoutAddress} 
                          onChange={(e) => setCheckoutAddress(e.target.value)} 
                        />
                        <textarea 
                          placeholder="Special shipping logs, keep ice under 4°C, etc." 
                          className="bg-white border border-slate-200 text-xs px-2 py-1 rounded w-full h-11 text-slate-500"
                          value={customInstructions} 
                          onChange={(e) => setCustomInstructions(e.target.value)}
                        />
                      </div>

                      {/* Simulate loading process bar */}
                      {isProcessingPayment ? (
                        <div className="space-y-1.5 py-1">
                          <div className="flex justify-between text-[11px] font-bold text-slate-600 animate-pulse">
                            <span>Securing gateway authorization...</span>
                            <span>{paymentProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${paymentProgress}%` }} />
                          </div>
                        </div>
                      ) : (
                        <button 
                          type="submit"
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-wider transition active:scale-95 cursor-pointer"
                        >
                          💸 Confirm & Authorize Payment
                        </button>
                      )}
                    </form>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RECENTLY COMPLETED ORDER BANNER */}
      {checkoutCompleted && (
        <div className="bg-emerald-100 border-2 border-emerald-400 p-5 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 animate-in slide-in-from-top-6 duration-300">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-sm font-black text-emerald-950 flex items-center gap-1.5 justify-center md:justify-start">
              <CheckCircle className="text-emerald-650" size={17} />
              <span>Biosecure Seafood Order Scheduled Successfully!</span>
            </h3>
            <p className="text-xs text-emerald-800 font-semibold">
              Invoice <strong>{checkoutCompleted}</strong> has been created. A digital high-contrast Traceability QR Code and thermal shipping dispatch pick list has been generated automatically.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button 
              onClick={() => {
                setSelectedOrderItem(orders.find(o => o.orderNumber === checkoutCompleted) || null);
                setActiveTab("orders");
                setCheckoutCompleted(null);
              }}
              className="px-4 py-2 bg-emerald-900 text-white text-xs font-black rounded-xl hover:bg-emerald-800 cursor-pointer"
            >
              Track Order Timeline →
            </button>
            <button 
              onClick={() => setCheckoutCompleted(null)}
              className="p-2 border border-emerald-300 hover:bg-emerald-200 rounded-xl text-emerald-900 cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* CORE HORIZONTAL NAVIGATION BAR */}
      <div className="flex flex-wrap items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 gap-1 overflow-x-auto">
        <button
          onClick={() => { setActiveTab("products"); setSelectedProductItem(null); }}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "products"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Tag size={13} />
          <span>📦 Products ({products.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab("orders"); setSelectedOrderItem(null); }}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "orders"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Truck size={13} />
          <span>📋 Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("recommendations")}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "recommendations"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Sparkles size={13} />
          <span>✨ Personalization ({recommendations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("education")}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "education"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <BookOpen size={13} />
          <span>🎓 Learn & Cook ({educations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "reviews"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Star size={13} />
          <span>⭐ Reviews ({reviews.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab("tickets"); setSelectedTicketItem(null); }}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "tickets"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Ticket size={13} />
          <span>🎫 Support Support ({tickets.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("customers")}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "customers"
              ? "bg-slate-900 text-white shadow-sm"
              : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
          }`}
        >
          <Users size={13} />
          <span>👥 CRM Directory ({customers.length})</span>
        </button>

        <button
          onClick={() => { setActiveTab("communications"); }}
          className={`px-4.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2.5 transition-all cursor-pointer ${
            activeTab === "communications"
              ? "bg-pink-650 text-white shadow-sm"
              : "text-slate-600 hover:text-pink-650 hover:bg-pink-50/50"
          }`}
        >
          <MessageSquare size={13} className="animate-pulse text-pink-500" />
          <span>💬 Communication Center</span>
        </button>
      </div>

      {/* TAB CONTENT PANELS */}
      
      {/* 1. PRODUCTS DIRECTORY & CATALOG VIEW */}
      {activeTab === "products" && (
        <div className="space-y-6">
          
          {/* Subheader action line */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-3 gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-slate-400">Products Inventory Search</span>
              <div className="relative w-48 bg-white border border-slate-200 rounded-xl px-2.5 py-1 flex items-center gap-1.5 focus-within:ring-1 focus-within:ring-emerald-500">
                <Search size={12} className="text-slate-400" />
                <input 
                  type="text" 
                  placeholder="e.g. Perch..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent border-0 outline-hidden font-bold text-xs p-0 w-full placeholder:text-slate-350"
                />
              </div>
            </div>

            {showAddProduct && (
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => setIsCreatingProduct(!isCreatingProduct)}
                  className="bg-slate-900 text-white hover:bg-slate-800 px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Product Listing</span>
                </button>
              </div>
            )}
          </div>

          {/* Add product simulator form modal view */}
          {isCreatingProduct && (
            <form onSubmit={handleCreateProduct} className="bg-amber-50/25 border border-amber-200 rounded-3xl p-5 space-y-4 animate-in slide-in-from-top-4 duration-200 shadow-sm">
              <div className="flex justify-between items-center bg-amber-500/10 p-3 rounded-2xl border border-amber-200/50">
                <span className="text-xs font-black text-amber-950 uppercase flex items-center gap-1.5">🏷️ Add New Product Spec Sheet & Equipment Listing</span>
                <button type="button" onClick={() => setIsCreatingProduct(false)} className="text-amber-900 hover:bg-amber-100 p-1.5 rounded-full transition cursor-pointer">
                  <X size={15} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Product Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Sesse Nile Perch Prime / Solar Panel..." 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-amber-500"
                    value={newProdName} 
                    onChange={(e) => setNewProdName(e.target.value)} 
                    required 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Origin Site Coordinate</label>
                  <input 
                    type="text" 
                    value={newProdOrigin} 
                    onChange={(e) => setNewProdOrigin(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-amber-500" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Quality Grade Scale</label>
                  <input 
                    type="text" 
                    value={newProdGrade} 
                    onChange={(e) => setNewProdGrade(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-amber-500" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Unit Price (Ush)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono font-black focus:ring-1 focus:ring-amber-500" 
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Description details</label>
                  <textarea 
                    placeholder="Provide details of harvest, power rating, efficiency metrics, or packaging." 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs h-16 focus:ring-1 focus:ring-amber-500"
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400">Shelf-life or Warranty Alert (Days)</label>
                  <input 
                    type="number" 
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-amber-500"
                    value={newProdShelfLife}
                    onChange={(e) => setNewProdShelfLife(Number(e.target.value))}
                  />
                </div>
              </div>

              {/* Categorization & Photo Upload Selector Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 border-slate-200/60 pb-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 block pb-0.5">Product Category</label>
                  <select
                    className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-amber-500"
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                  >
                    <option value="recxpats & Farm Produce">🐠 recxpats & Farm Produce</option>
                    <option value="Solar Power Systems">☀️ Solar Power Systems</option>
                    <option value="Water & Irrigation">💧 Water & Irrigation</option>
                    <option value="Machinery & Hardware">🛠️ Machinery & Hardware</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 block pb-0.5">Product Photo (File Upload OR Image URL/Emoji)</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {/* File raw reader */}
                    <div className="relative flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setNewProdPhoto(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="hidden"
                        id="product-photo-upload"
                      />
                      <label 
                        htmlFor="product-photo-upload"
                        className="flex items-center justify-center gap-1.5 w-full bg-slate-100 border border-slate-300 hover:bg-slate-250 hover:border-slate-400 text-slate-800 rounded-lg p-2 text-xs font-bold cursor-pointer text-center select-none active:scale-98 transition"
                      >
                        📷 Choose Image File
                      </label>
                    </div>

                    <div className="flex-2">
                      <input
                        type="text"
                        placeholder="Or paste image URL (e.g., Unsplash URL) or type an Emoji"
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-bold focus:ring-1 focus:ring-amber-500"
                        value={newProdPhoto.startsWith("data:") ? "Image Loaded from Computer ✅" : newProdPhoto}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val !== "Image Loaded from Computer ✅") {
                            setNewProdPhoto(val);
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase rounded-lg shadow-sm cursor-pointer transition active:scale-95">
                  Publish Specification Sheet to Gallery
                </button>
              </div>
            </form>
          )}

          {/* Catalog grid Split & detail views */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Product Catalog List representing Gallery */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-450">Active Product Catalog & Equipment Gallery</h3>
              </div>

              {/* Category Filters Bar */}
              <div className="flex flex-wrap gap-2 pb-1 overflow-x-auto">
                {[
                  { id: "All", label: "All Items", emoji: "🌐" },
                  { id: "recxpats & Farm Produce", label: "Fish & Produce", emoji: "🐟" },
                  { id: "Solar Power Systems", label: "Solar & Power", emoji: "☀️" },
                  { id: "Water & Irrigation", label: "Irrigation & Pumps", emoji: "💧" },
                  { id: "Machinery & Hardware", label: "Farm Equipment", emoji: "🛠️" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer border ${
                      selectedCategory === cat.id
                        ? "bg-amber-500 text-slate-950 border-amber-600 shadow-sm"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span>{cat.emoji}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products
                  .filter(p => selectedCategory === "All" || p.category === selectedCategory)
                  .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.origin.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(p => (
                    <div 
                      key={p.id}
                      onClick={() => setSelectedProductItem(p)}
                      className={`bg-white border rounded-3xl p-5 cursor-pointer hover:border-amber-400 hover:shadow-md transition-all space-y-4 ${
                        selectedProductItem?.id === p.id ? "border-amber-500 ring-2 ring-amber-50" : "border-slate-200"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2.5">
                          {renderProductPhotoHelper(p.photo, "w-12 h-12 text-2.5xl")}
                          <div>
                            <h4 className="text-sm font-black text-slate-900 leading-tight">{p.name}</h4>
                            <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Origin: {p.origin}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <span className="bg-amber-100 text-amber-900 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-amber-200">
                            {p.grade}
                          </span>
                          <button
                            onClick={() => {
                              if (onDeleteRecord) onDeleteRecord("marketplaceProducts", p.id).catch(console.error);
                            }}
                            className="text-slate-300 hover:text-rose-500 transition cursor-pointer p-1 rounded hover:bg-rose-50 animate-fade-in"
                            title="Delete Product"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 font-semibold leading-relaxed line-clamp-2">
                        {p.description}
                      </p>

                      {/* Interactive Unit Options - Activating previously static unit select options */}
                      <div className="space-y-1.5" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Select Unit Option:</span>
                        <div className="flex flex-wrap gap-1">
                          {p.unitOptions.map((opt) => {
                            const isSelected = selectedProductUnit[p.id] === opt || (!selectedProductUnit[p.id] && p.unitOptions[0] === opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSelectedProductUnit(prev => ({ ...prev, [p.id]: opt }))}
                                className={`text-[9px] font-black px-2 py-0.5 rounded border transition-all cursor-pointer ${
                                  isSelected 
                                    ? "bg-amber-100 text-amber-900 border-amber-400 font-bold" 
                                    : "bg-slate-50 text-slate-650 border-slate-200/80 hover:bg-slate-100"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Unit Cost</span>
                          <span className="text-xs font-black text-slate-900 font-mono text-amber-600">Ush {p.unitPrice.toLocaleString()} / Pack</span>
                        </div>

                        <button
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const chosenUnit = selectedProductUnit[p.id] || p.unitOptions[0];
                            addToCart(p.id, chosenUnit); 
                          }}
                          className="bg-slate-900 hover:bg-slate-800 text-white hover:text-amber-400 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>Order: {selectedProductUnit[p.id] || p.unitOptions[0]}</span>
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Right 1 Col: Detailed Specification Sheet (Satisfies fully the requested Product Attributes) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 h-fit">
              {selectedProductItem ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">🔬 Interactive Product Sheet</span>
                    <button onClick={() => setSelectedProductItem(null)} className="text-slate-400 hover:text-slate-600 p-0.5">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="text-center space-y-2 pb-2 border-b flex flex-col items-center">
                    {renderProductPhotoHelper(selectedProductItem.photo, "w-20 h-20 text-5xl rounded-3xl shadow-sm")}
                    <h3 className="text-base font-black text-slate-900 tracking-tight leading-tight">{selectedProductItem.name}</h3>
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-0.5 border border-emerald-100 rounded-full inline-block">
                      {selectedProductItem.grade}
                    </span>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Product Origin Site</span>
                      <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">📍 {selectedProductItem.origin}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Product Description</span>
                      <p className="text-slate-600 leading-relaxed font-semibold mt-1">
                        {selectedProductItem.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2 border-b">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Active Unit Options</span>
                        <div className="flex flex-wrap gap-1">
                          {selectedProductItem.unitOptions.map((opt) => {
                            const isSel = selectedProductUnit[selectedProductItem.id] === opt || (!selectedProductUnit[selectedProductItem.id] && selectedProductItem.unitOptions[0] === opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => setSelectedProductUnit(prev => ({ ...prev, [selectedProductItem.id]: opt }))}
                                className={`text-[9.5px] font-black px-2 py-1 rounded border transition-all cursor-pointer ${
                                  isSel 
                                    ? "bg-amber-500 text-slate-950 border-amber-500" 
                                    : "bg-slate-50 text-slate-650 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block mb-1">Unit Price Structure</span>
                        <span className="font-mono font-black text-amber-600 block mt-0.5">Ush {selectedProductItem.unitPrice.toLocaleString()}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const chosenUnit = selectedProductUnit[selectedProductItem.id] || selectedProductItem.unitOptions[0];
                            addToCart(selectedProductItem.id, chosenUnit);
                          }}
                          className="mt-2 w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white hover:text-amber-400 font-sans font-black text-[10px] uppercase rounded-lg flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                        >
                          <Plus size={11} />
                          <span>Order Chosen Unit</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-2 border-b">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Stock date</span>
                        <span className="font-semibold text-slate-705 block mt-0.5">📅 {selectedProductItem.stockDate}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Harvest date</span>
                        <span className="font-semibold text-slate-705 block mt-0.5">🚜 {selectedProductItem.harvestDate}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Traceability QR Code</span>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-dashed border-slate-300 flex items-center gap-2 mt-1">
                        <div className="w-10 h-10 bg-slate-900 rounded flex items-center justify-center text-white font-mono font-black text-[9px] hover:scale-105 transition cursor-pointer select-none">
                          QR
                        </div>
                        <div>
                          <span className="font-mono text-[9.5px] font-black text-slate-800 block leading-tight">{selectedProductItem.qrCode}</span>
                          <span className="text-[8px] text-slate-400 block font-semibold mt-0.5">Validated with Nile Catch logs.</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-2 border-b">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Total Orders Registered</span>
                        <span className="font-mono font-black text-slate-805 block mt-0.5">{selectedProductItem.totalOrders.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Total Sales Value</span>
                        <span className="font-mono font-black text-slate-805 block mt-0.5">Ush {selectedProductItem.totalSalesValue.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-2 border-b">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Average Star Rating</span>
                        <span className="font-mono font-bold text-amber-500 block mt-0.5">⭐ {selectedProductItem.avgStarRating} ({selectedProductItem.nrOfReviews} reviews)</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">AI Sentiment Analysis Summary</span>
                        <span className="font-semibold text-emerald-700 block mt-0.5">{selectedProductItem.sentimentSummary}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Personalization Recommendation</span>
                      <span className="text-slate-500 italic block leading-relaxed mt-0.5">"{selectedProductItem.recommendation}"</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Educational Content Link</span>
                      <span className="text-sky-650 hover:underline font-bold mt-0.5 block cursor-pointer">📖 {selectedProductItem.educationalContent}</span>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <span className="text-3xl block">🔬</span>
                  <p className="text-xs font-semibold leading-relaxed">
                    Select any seafood product on the left to review its complete physical specs, origin tracking parameters, and AI sentiments summary.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. ORDERS TRACKING & INV PERISHABLES OPERATION LOGISTICS */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          
          {/* Perishables shelf-life and Alerting panel */}
          <div className="bg-amber-50/20 border-2 border-amber-200 rounded-3xl p-5 space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase flex items-center gap-2 border-b pb-2">
              <AlertTriangle className="text-amber-500" size={16} />
              <span>🚨 Dynamic Perishable Alerting & Shelf Life Operations</span>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-xs">
              
              <div className="bg-white border rounded-2xl p-3 space-y-2">
                <span className="text-[9.5px] font-extrabold uppercase text-slate-400 block">Today's Operating Date</span>
                <span className="font-mono font-black text-slate-800 text-sm">📅 {todayDate}</span>
                <span className="text-[8.5px] text-slate-400 block font-semibold leading-tight">Syncing active dispatch vehicles.</span>
              </div>

              <div className="bg-white border rounded-2xl p-3 space-y-1.5">
                <span className="text-[9.5px] font-extrabold uppercase text-slate-400 block">Critical Harvest warning</span>
                <label className="flex items-center gap-2 mt-1 select-none cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={alertNearingSellBy} 
                    onChange={(e) => setAlertNearingSellBy(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0 cursor-pointer" 
                  />
                  <span className="font-black text-slate-700">Flag nearing sell-by (≤ 3 Days)</span>
                </label>
              </div>

              {/* Scales simulation */}
              <div className="bg-white border rounded-2xl p-3 space-y-1.5">
                <span className="text-[9.5px] font-extrabold uppercase text-slate-400 block">Scale Integration weight (kg)</span>
                <div className="flex items-center gap-1.5 bg-slate-50 rounded-lg p-1 border">
                  <input 
                    type="number" 
                    step="0.1"
                    value={selectedWeightKg} 
                    onChange={(e) => setSelectedWeightKg(Number(e.target.value))}
                    className="bg-transparent border-0 font-mono font-black font-semibold text-xs w-16 p-0" 
                  />
                  <span className="font-bold text-[10px] text-slate-400">KG Scale Sim</span>
                </div>
              </div>

              {/* Dynamic pricing tools */}
              <div className="bg-white border rounded-2xl p-3 space-y-1.5">
                <span className="text-[9.5px] font-extrabold uppercase text-slate-400 block">Dynamic Pricing Multiplier</span>
                <select 
                  value={dynamicPriceMultiplier} 
                  onChange={(e) => setDynamicPriceMultiplier(Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 text-[10.5px] font-bold rounded p-1 w-full"
                >
                  <option value={1.0}>⚖️ Standard pricing (1.0x)</option>
                  <option value={0.8}>📉 Surplus markdown (0.8x - Sell quick!)</option>
                  <option value={1.2}>📈 Scarce batch markup (1.2x)</option>
                </select>
              </div>

            </div>

            {/* Render warnings on products near threshold */}
            {alertNearingSellBy && (
              <div className="space-y-2 animate-in slide-in-from-top-3">
                <span className="text-[10px] font-black uppercase text-red-500 block">⚠️ Urgent Shelf Life Warnings:</span>
                <div className="flex flex-col gap-2">
                  {products.map(p => {
                    // Nile perch is 5 days from June 16 -> June 21
                    // Red Tilapia is 3 days from June 17 -> June 20. Today: June 18
                    const remainingDays = p.shelfLifeDays - 1; // Simulated
                    if (remainingDays <= 3) {
                      return (
                        <div key={p.id} className="bg-rose-50 border border-rose-150 p-2.5 rounded-xl flex justify-between items-center text-xs">
                          <span className="font-black text-rose-900">🐠 {p.name}</span>
                          <span className="font-semibold text-slate-800">Origin: {p.origin} • Sells by: {new Date(new Date(p.stockDate).getTime() + p.shelfLifeDays*24*60*60*1000).toISOString().slice(0, 10)}</span>
                          <span className="bg-rose-600 text-white font-mono font-black text-[9px] uppercase px-2 py-0.5 rounded">
                            ⏳ {remainingDays} Days remaining! Alert supervisor
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="text-center lg:text-left bg-gradient-to-br from-indigo-50 to-transparent p-4 border border-indigo-150 rounded-2xl space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">🚚 Real-Time Logistics Tracking</span>
            <p className="text-xs font-semibold text-indigo-950">
              Biosecure containment tracking requires dispatch temperature recording. Review statuses and update order parameters below.
            </p>
          </div>

          {/* Orders workspace view split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left 2 Cols: Orders list with status modify dropbox */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-450">Active Customer Orders Logs</h3>
              
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-[10px] uppercase font-black text-slate-505 bg-slate-50/60 p-3">
                      <th className="px-4 py-3">Order Code</th>
                      <th className="px-4 py-3">Customer Identifiers</th>
                      <th className="px-4 py-3">Value Added Prepare cut</th>
                      <th className="px-4 py-3">Payment details</th>
                      <th className="px-4 py-3">Order Status Dropdown</th>
                      <th className="px-4 py-3 text-right">Invoice Sum</th>
                      <th className="px-4 py-3 text-right">Delete</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map(o => (
                      <tr 
                        key={o.orderNumber}
                        onClick={() => setSelectedTicketItem ? null : setSelectedOrderItem(o)}
                        className={`cursor-pointer hover:bg-slate-50 transition ${
                          selectedOrderItem?.orderNumber === o.orderNumber ? "bg-amber-50/10 font-bold" : ""
                        }`}
                      >
                        <td className="px-4 py-3.5 font-mono font-black text-slate-900" onClick={() => setSelectedOrderItem(o)}>
                          {o.orderNumber}
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-800" onClick={() => setSelectedOrderItem(o)}>
                          {o.customerName}
                          <span className="text-[9px] text-slate-400 block font-normal">{o.customerAddress}</span>
                        </td>
                        <td className="px-4 py-3.5 font-semibold text-slate-650 max-w-[150px] truncate" onClick={() => setSelectedOrderItem(o)}>
                          {o.valueAddedServices}
                        </td>
                        <td className="px-4 py-3.5 font-semibold" onClick={() => setSelectedOrderItem(o)}>
                          <span className="bg-sky-50 text-sky-850 text-[9px] font-black px-1.5 py-0.5 rounded block w-fit">
                            💳 {o.paymentMethod}
                          </span>
                          <span className="text-[8px] text-slate-400 block mt-0.5">{o.paymentStatus}</span>
                        </td>
                        <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                          
                          {/* DROPBOX status modify - fully satisfy the specific user dropbox requirements! */}
                          <select
                            value={o.orderStatus}
                            onChange={(e) => {
                              const updatedStatus = e.target.value as any;
                              if (onUpdateRecord) {
                                const recordId = (o as any).id || o.orderNumber;
                                onUpdateRecord("marketplaceOrders", recordId, { ...o, orderStatus: updatedStatus }).catch(console.error);
                              }
                              if (selectedOrderItem?.orderNumber === o.orderNumber) {
                                setSelectedOrderItem({ ...selectedOrderItem, orderStatus: updatedStatus });
                              }
                            }}
                            className="text-[10px] bg-white border border-slate-200 rounded p-1 font-black cursor-pointer text-slate-800"
                          >
                            <option value="Processing">🟡 Processing</option>
                            <option value="Shipped">🔵 Shipped</option>
                            <option value="Delivered">🟢 Delivered</option>
                            <option value="Pending">🟠 Pending</option>
                            <option value="Canceled">🔴 Canceled</option>
                          </select>

                        </td>
                        <td className="px-4 py-3.5 text-right font-mono font-black text-slate-900" onClick={() => setSelectedOrderItem(o)}>
                          Ush {o.totalProductsValue.toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => {
                              const recordId = (o as any).id || o.orderNumber;
                              if (onDeleteRecord) {
                                onDeleteRecord("marketplaceOrders", recordId).catch(console.error);
                              }
                              if (selectedOrderItem?.orderNumber === o.orderNumber) {
                                setSelectedOrderItem(null);
                              }
                            }}
                            className="text-slate-305 hover:text-rose-500 transition cursor-pointer p-1.5 rounded hover:bg-rose-50"
                            title="Delete Order"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>

            {/* Right 1 Col: Detailed Order Specs (Traceability, Recipe suggestion, support ticket triggers) */}
            <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
              {selectedOrderItem ? (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="flex justify-between items-center border-b pb-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Order detailed logs</span>
                    <button onClick={() => setSelectedOrderItem(null)} className="text-slate-400 hover:text-slate-600 p-0.5">
                      <X size={14} />
                    </button>
                  </div>

                  <div className="space-y-3.5 text-xs">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Order Identification</span>
                        <span className="font-mono font-black text-slate-808 text-sm">{selectedOrderItem.orderNumber}</span>
                      </div>
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded border border-amber-250">
                        {selectedOrderItem.orderStatus}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Customer parameters</span>
                      <span className="font-bold text-slate-800 block mt-0.5">👤 {selectedOrderItem.customerName}</span>
                      <span className="text-slate-500 font-semibold block">{selectedOrderItem.customerAddress}, {selectedOrderItem.customerCountry}</span>
                      <span className="text-slate-400 font-semibold block">{selectedOrderItem.customerEmail} | {selectedOrderItem.customerContact}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Products ordered list</span>
                      <div className="space-y-2 mt-1">
                        {selectedOrderItem.productsOrdered?.map((p, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[11px] font-semibold text-slate-700 bg-slate-50 border border-slate-150 p-2 rounded-xl gap-2">
                            <div className="min-w-0 flex-1">
                              <span className="block font-black text-slate-800 truncate">🐟 {p.name}</span>
                              <span className="text-[10px] text-slate-400 block font-bold mt-0.5">{(p.weightKg).toFixed(1)} kg • {p.service || "Standard prep"}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-0.5 shadow-xs">
                                <button 
                                  onClick={() => adjustOrderProductQuantity(selectedOrderItem.orderNumber, p.productId, -1)}
                                  className="w-5 h-5 hover:bg-slate-100 text-slate-700 font-bold rounded flex items-center justify-center cursor-pointer transition select-none text-xs"
                                  title="Subtract 1 Unit"
                                >
                                  -
                                </button>
                                <span className="text-[10px] font-mono font-black w-6 text-center text-slate-800">{p.quantity}</span>
                                <button 
                                  onClick={() => adjustOrderProductQuantity(selectedOrderItem.orderNumber, p.productId, 1)}
                                  className="w-5 h-5 hover:bg-slate-100 text-slate-700 font-bold rounded flex items-center justify-center cursor-pointer transition select-none text-xs"
                                  title="Add 1 Unit"
                                >
                                  +
                                </button>
                              </div>
                              <span className="font-mono font-black text-slate-900 min-w-[70px] text-right text-xs">
                                Ush {(p.unitPrice * p.quantity).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pb-2 border-b">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Total weight</span>
                        <span className="font-semibold text-slate-700 block mt-0.5">⚖️ {selectedOrderItem.totalWeightKg.toFixed(1)} kg</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Special instructions</span>
                        <p className="text-slate-600 font-bold leading-tight mt-0.5 italic">"{selectedOrderItem.specialInstructions}"</p>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Invoice photostatic scan</span>
                      <div className="mt-1 flex items-center gap-2 border border-slate-200.60 p-2 rounded-xl bg-slate-50">
                        <ImageIcon size={18} className="text-slate-400" />
                        <span className="font-bold text-slate-600">Secure_Invoice_{selectedOrderItem.orderNumber}.jpg</span>
                        <span className="bg-sky-100 text-sky-800 text-[8px] font-bold px-1 rounded ml-auto">Validated</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Traceability QR Code</span>
                      <div className="bg-slate-900 text-amber-400 px-3 py-2 rounded-xl flex items-center justify-between font-mono text-[9px] mt-1">
                        <span>QR: {selectedOrderItem.qrCode}</span>
                        <span className="text-[8px] text-slate-400 font-sans uppercase font-black">Shipment sealed</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Personalized Recipe Suggestion (AI)</span>
                      <div className="bg-amber-50/35 border border-amber-200 p-2.5 rounded-xl text-slate-700 italic mt-1 font-bold">
                        "{selectedOrderItem.recipeSuggestion}"
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Total items value</span>
                        <span className="font-mono font-black text-slate-800 block mt-0.5">Ush {selectedOrderItem.totalProductsValue.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Recommendation Upsell</span>
                        <span className="text-sky-650 font-bold block mt-0.5">{selectedOrderItem.recommendationUpsell}</span>
                      </div>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 space-y-2">
                  <span className="text-3xl block">📋</span>
                  <p className="text-xs font-semibold leading-relaxed">
                    Select any order log from the core database list on the left to trace its cooling timeline, coordinates, raw weights, invoice scans, and AI recipes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. PERSONALIZATION & RECOMMENDATIONS DESIGN */}
      {activeTab === "recommendations" && (
        <div className="space-y-6">
          <div className="bg-indigo-50/40 border border-indigo-200 rounded-3xl p-5 relative overflow-hidden">
            <div className="absolute right-0 top-0 transform translate-x-6 -translate-y-6 opacity-10 font-black text-7xl">✨</div>
            <div className="max-w-2xl relative z-10 space-y-1.5">
              <span className="bg-indigo-150 text-indigo-900 text-[10px] font-black uppercase px-2 py-0.5 rounded border border-indigo-250">
                AI Personalization Core
              </span>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Active Recommendations Manager</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Monitor machine-generated upsells, educational content mappings, and personalized quality scores across institutional buyers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((rec, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3.5 relative overflow-hidden">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] uppercase font-black px-2 py-0.5 bg-indigo-50 text-indigo-850 rounded border border-indigo-100">
                      Type: {rec.recType}
                    </span>
                    <h4 className="text-base font-black text-slate-900 leading-tight mt-1.5">Recipient: {rec.customerName}</h4>
                  </div>
                  <div className="text-right flex items-center gap-1.5">
                    <div>
                      <span className="text-[9px] font-extrabold text-slate-400 block uppercase">Quality Score</span>
                      <span className="font-mono font-black text-emerald-600 text-sm">🎯 {rec.qualityScore}/100</span>
                    </div>
                    <button
                      onClick={() => {
                        const recordId = (rec as any).id || idx;
                        if (onDeleteRecord) onDeleteRecord("marketplaceRecommendations", recordId).catch(console.error);
                      }}
                      className="text-slate-300 hover:text-rose-500 transition cursor-pointer p-1 rounded hover:bg-rose-50"
                      title="Delete Recommendation"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4.5 space-y-3 font-semibold text-xs text-slate-600">
                  <p className="font-bold">
                    <span className="text-[10px] text-slate-400 uppercase font-black block">Personalization Reason</span>
                    "{rec.personalizationReason}"
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3.5 pt-2 border-t">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Suggested Product</span>
                      <span className="text-slate-900 font-black">🐠 {rec.suggestedProduct}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Suggested Content</span>
                      <span className="text-sky-700 hover:underline cursor-pointer block leading-tight font-black">📖 {rec.suggestedContent}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-semibold text-[10px]">Date Generated: {rec.dateGenerated}</span>
                  <label className="flex items-center gap-1.5 font-bold text-slate-700 select-none cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="rounded text-indigo-600 focus:ring-0 cursor-pointer" 
                      checked={rec.isActive}
                      onChange={(e) => {
                        const updated = e.target.checked;
                        if (onUpdateRecord) {
                          const recordId = (rec as any).id || rec.productName;
                          onUpdateRecord("marketplaceRecommendations", recordId, { ...rec, isActive: updated }).catch(console.error);
                        }
                      }}
                    />
                    <span>Is Active</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. LEARN & COOK EDUCATIONAL CONTENT */}
      {activeTab === "education" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {educations.map((edu, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 relative">
                <button
                  onClick={() => {
                    const recordId = (edu as any).id || idx;
                    if (onDeleteRecord) onDeleteRecord("marketplaceEducations", recordId).catch(console.error);
                  }}
                  className="absolute top-4 right-4 text-slate-300 hover:text-rose-500 transition cursor-pointer p-1 rounded hover:bg-rose-50"
                  title="Delete Guide"
                >
                  <Trash2 size={13} />
                </button>
                <div className="flex gap-4">
                  <span className="text-4xl">📚</span>
                  <div>
                    <h3 className="text-sm font-black text-slate-950 leading-tight">{edu.productName} Cooking Guide</h3>
                    <span className="text-[10px] bg-sky-50 text-sky-850 px-2 py-0.5 rounded font-extrabold block w-fit mt-1.5 uppercase">
                      Category: {edu.contentCategoryAI}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 font-semibold leading-relaxed border-b pb-3.5">
                  {edu.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase block">Content Type</span>
                    <span className="font-bold text-slate-700">{edu.contentType}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase block">Preparation Time</span>
                    <span className="font-mono font-black text-slate-800">⏱️ {edu.prepTimeMins} mins</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase block">Total Prep Est.</span>
                    <span className="font-mono font-black text-emerald-600">⏱️ {edu.estimatedTotalPrepTime} mins (With Descaling)</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase block">Difficulty Level</span>
                    <span className="bg-amber-100 text-amber-950 font-black px-2 py-0.5 rounded text-[10px] w-fit inline-block">
                      {edu.difficultyLevel}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-150 space-y-1.5 text-xs">
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase block">AI Content Summary Overview</span>
                  <p className="text-slate-600 italic font-bold">"{edu.contentSummaryAI}"</p>
                  <span className="text-[9px] text-slate-450 block font-bold">Recommended target: {edu.recommendedFor}</span>
                </div>

                <a 
                  href={edu.videoLink} 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full py-2.5 bg-slate-900 text-white hover:bg-slate-800 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2 transition"
                >
                  <Play size={13} className="fill-white" />
                  <span>Watch Sesse Island Video Guide</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. COMMUNITY REVIEW FEED */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((rev, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">👤</span>
                    <div>
                      <h4 className="text-xs font-black text-slate-950 leading-tight">{rev.customerName}</h4>
                      <span className="text-[9px] text-slate-400 block font-bold">Post Date: {rev.reviewDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {Array.from({ length: rev.starRatingNum }).map((_, i) => (
                        <Star key={i} size={11} className="fill-current" />
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const recordId = (rev as any).id || idx;
                        if (onDeleteRecord) onDeleteRecord("marketplaceReviews", recordId).catch(console.error);
                      }}
                      className="text-slate-305 hover:text-rose-500 transition cursor-pointer p-1 rounded hover:bg-rose-50"
                      title="Delete Review"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-600 font-semibold italic leading-relaxed bg-slate-50 p-3 rounded-xl border border-dotted">
                  "{rev.reviewComment}"
                </p>

                <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                  <div>
                    <span className="text-[9.5px] font-extrabold text-slate-400 uppercase block">Product Name</span>
                    <span className="text-slate-800 font-bold">🐟 {rev.productName}</span>
                  </div>
                  <div>
                    <span className="text-[9.5px] font-extrabold text-slate-400 uppercase block">Review Length Metrics</span>
                    <span className="font-mono text-slate-600">{rev.reviewLength} characters</span>
                  </div>
                </div>

                <div className="bg-sky-50/40 p-3 rounded-xl border border-sky-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] text-sky-900 uppercase font-black block">AI Sentiment Analysis</span>
                    <span className="text-sky-850 font-black">{rev.reviewSentimentAI} sentiment</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-bold max-w-[200px] text-right">
                    Summary: {rev.reviewSummaryAI}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SUPPORT TICKETS LIVE CHAT SIMULATOR */}
      {activeTab === "tickets" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Tickets Queue */}
            <div className="lg:col-span-1 space-y-3.5">
              <span className="text-xs font-black uppercase text-slate-400 tracking-wider">Active Support Tickets Queue</span>
              <div className="flex flex-col gap-3.5">
                {tickets.map(t => (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicketItem(t)}
                    className={`p-4 bg-white border rounded-2xl cursor-pointer hover:border-amber-400 transition-all ${
                      selectedTicketItem?.id === t.id ? "border-amber-500 ring-2 ring-amber-50" : "border-slate-205"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-[9px] font-black text-slate-400">{t.id}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onDeleteRecord) onDeleteRecord("marketplaceTickets", t.id).catch(console.error);
                            if (selectedTicketItem?.id === t.id) setSelectedTicketItem(null);
                          }}
                          className="text-slate-300 hover:text-rose-500 transition cursor-pointer p-0.5 rounded hover:bg-rose-50"
                          title="Delete Ticket"
                        >
                          <Trash2 size={11} />
                        </button>
                      </div>
                      <span className="bg-amber-100 text-amber-950 text-[9px] font-extrabold px-1.5 rounded">
                        {t.status}
                      </span>
                    </div>
                    <h4 className="text-xs font-black text-slate-900 mt-1 lines-clamp-1">{t.ticketSubject}</h4>
                    <p className="text-[10px] text-slate-550 font-bold block mt-0.5">Applicant: {t.customer} • Inquiry: {t.inquiryType}</p>
                    <span className="text-[8.5px] text-slate-400 block mt-2">Opened: {t.submissionDate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 2 Columns: Selected Ticket & Live Chat Simulator */}
            <div className="lg:col-span-2">
              {selectedTicketItem ? (
                <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4 animate-in duration-200 flex flex-col h-[550px]">
                  
                  {/* Top info card */}
                  <div className="border-b pb-3 flex justify-between items-center">
                    <div>
                      <h3 className="text-sm font-black text-slate-900 leading-tight">
                        💬 Chat Simulator - Ticket ID: {selectedTicketItem.id}
                      </h3>
                      <span className="text-[10px] text-slate-450 block font-bold leading-tight mt-0.5">
                        Inquiry: {selectedTicketItem.inquiryType} • Assigned Specialist: {selectedTicketItem.assignedAgent}
                      </span>
                    </div>
                    <button onClick={() => setSelectedTicketItem(null)} className="text-slate-400 hover:text-slate-650">
                      <X size={15} />
                    </button>
                  </div>

                  {/* Operational logs */}
                  <div className="grid grid-cols-2 gap-3.5 bg-slate-50 p-2.5 rounded-xl border border-slate-150 text-[10px] font-semibold text-slate-600">
                    <div>
                      <span className="uppercase text-slate-400 font-extrabold block">Linked Order</span>
                      <span className="text-slate-900 font-black">📋 Order #{selectedTicketItem.orderNumber} ({selectedTicketItem.orderStatus})</span>
                    </div>
                    <div>
                      <span className="uppercase text-slate-400 font-extrabold block">Response Performance</span>
                      <span className="text-emerald-700 font-black">⚙️ {selectedTicketItem.responseTime} initial pickup</span>
                    </div>
                  </div>

                  {/* Simulated chat container message feed */}
                  <div className="flex-1 bg-slate-950 p-4 rounded-2xl overflow-y-auto space-y-3 font-mono text-[11.5px] min-h-[160px] max-h-[220px]">
                    <div className="text-[9.5px] text-slate-500 text-center uppercase tracking-widest pb-1 border-b border-white/5">
                      🔒 Secure Containment Chat Log
                    </div>
                    {selectedTicketItem.liveChatTranscript.map((msg, idx) => (
                      <div key={idx} className={`flex flex-col ${msg.sender === "Customer" ? "items-end" : "items-start"}`}>
                        <span className={`text-[8.5px] ${msg.sender === "Customer" ? "text-amber-400" : "text-sky-400"} uppercase font-black`}>
                          {msg.sender} ({msg.time})
                        </span>
                        <div className={`p-2 rounded-xl mt-0.5 max-w-[80%] leading-relaxed ${
                          msg.sender === "Customer" ? "bg-amber-500/10 text-amber-300 border border-amber-550/20" : "bg-sky-500/10 text-sky-300 border border-sky-550/20"
                        }`}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Interactive live reply entry field */}
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Type simulated message to Evelyn..." 
                      className="flex-1 bg-slate-50 border border-slate-200 px-3 py-2 text-xs font-bold rounded-xl outline-hidden focus:ring-1 focus:ring-amber-500"
                      value={newChatMessage}
                      onChange={(e) => setNewChatMessage(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleSendChatMessage(); }}
                    />
                    <button 
                      onClick={handleSendChatMessage}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send size={12} />
                      <span>Send Reply</span>
                    </button>
                  </div>

                  {/* AI Support Ticket Summary AI */}
                  <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 flex flex-col gap-1 text-xs">
                    <span className="text-[9px] text-sky-900 font-extrabold uppercase">🤖 Ticket Summary & Resolution Hints (AI)</span>
                    <p className="text-slate-600 leading-relaxed font-bold">"{selectedTicketItem.ticketSummaryAI}"</p>
                    <span className="text-[9px] text-emerald-800 block font-black leading-tight mt-1">Suggested Next Action AI: {selectedTicketItem.suggestedNextActionAI}</span>
                    <div className="mt-1 pb-1 border-t pt-1 font-semibold text-slate-500">
                      <strong>Resolution Notes:</strong> {selectedTicketItem.resolutionNotes}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="py-24 text-center text-slate-400 bg-white border rounded-3xl p-6">
                  <span className="text-3xl block">💬</span>
                  <h4 className="text-xs font-black text-slate-805 uppercase tracking-wider mt-2">No Ticket Selected</h4>
                  <p className="text-xs font-semibold leading-relaxed max-w-sm mx-auto mt-1">
                    Select any seafood quality or logistics ticket on the left queue bar above to launch the active secure live simulator panel.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 7. CUSTOMERS CRM LOGS DIRECTORY */}
      {activeTab === "communications" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* TITLE & HEADER CONTROLS */}
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 shadow-md">
            <span className="text-[10px] text-pink-400 font-extrabold uppercase tracking-widest block mb-1">
              Communication Center & Client Contact Hub
            </span>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <span>💬</span> Consolidated Communication Hub
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                  Centralised workspace for digital seafood announcements, direct operational dispatch messages, 
                  and audit-ready staff member feedback loops. Ensures flawless biosecurity accountability.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  CRITICAL CHANNELS ONLINE
                </span>
                <span className="bg-amber-500/10 text-amber-400 text-[10px] font-extrabold px-2.5 py-1 rounded-full border border-amber-500/30">
                  ENGAGEMENT LEVEL: HIGH (94.7%)
                </span>
              </div>
            </div>
          </div>

          {/* e. MONITOR KEY METRICS RELATED TO INTERNAL ANNOUNCEMENTS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Announcements Sent</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 font-mono">{announcements.length}</span>
                <span className="text-[10px] text-emerald-600 font-bold">100% Broadcasted</span>
              </div>
              <p className="text-[9.5px] text-slate-400 mt-1">Total active broadcast directives</p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Acknowledge Rate</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-pink-650 font-mono">
                  {(staffMembers.reduce((sum, s) => sum + s.acknowledgementRate, 0) / staffMembers.length).toFixed(0)}%
                </span>
                <span className="text-[10px] text-slate-450 font-bold">Audit Target: &gt;90%</span>
              </div>
              <p className="text-[9.5px] text-slate-400 mt-1">Verified cold-chain staff compliance</p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Staff Contacts Engaged</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-slate-900 font-mono">{staffMembers.length}</span>
                <span className="text-[10px] text-sky-600 font-bold">All Active</span>
              </div>
              <p className="text-[9.5px] text-slate-400 mt-1">Operations & Logistics agents</p>
            </div>

            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Direct Messages</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-600 font-mono">{directMessages.length}</span>
                <span className="text-[10px] text-emerald-600 font-medium">✨ Real-time</span>
              </div>
              <p className="text-[9.5px] text-slate-400 mt-1">Exchanged staff instructions</p>
            </div>
          </div>

          {/* SUB-MENU TABS */}
          <div className="flex flex-wrap items-center bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1">
            <button
              onClick={() => setActiveCommSubTab("broadcast")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                activeCommSubTab === "broadcast"
                  ? "bg-white text-slate-950 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              📢 BROADCAST ANNOUNCEMENTS ({announcements.length})
            </button>
            <button
              onClick={() => setActiveCommSubTab("direct")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                activeCommSubTab === "direct"
                  ? "bg-white text-slate-950 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              💬 DIRECT MESSAGES TIMELINE ({directMessages.length})
            </button>
            <button
              onClick={() => setActiveCommSubTab("staff")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                activeCommSubTab === "staff"
                  ? "bg-white text-slate-950 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              👥 STAFF MEMBERS DIRECTORY ({staffMembers.length})
            </button>
            <button
              onClick={() => setActiveCommSubTab("acknowledgements")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                activeCommSubTab === "acknowledgements"
                  ? "bg-white text-slate-950 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              🤝 ACKNOWLEDGEMENTS AUDIT ({acknowledgements.length})
            </button>
            <button
              onClick={() => setActiveCommSubTab("rules")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-black uppercase transition-all cursor-pointer ${
                activeCommSubTab === "rules"
                  ? "bg-white text-slate-950 shadow-sm border border-slate-200"
                  : "text-slate-600 hover:text-slate-950"
              }`}
            >
              🛠️ SUPPORT HUB & INTERACTIVE CHAT
            </button>
          </div>

          {/* SEARCH BAR */}
          <div className="flex flex-col md:flex-row items-center justify-between bg-white border border-slate-200 p-3.5 rounded-2xl gap-3">
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
              Searching Communication Channels & Timeline Streams
            </span>
            <div className="relative w-full md:w-80 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5 focus-within:ring-1 focus-within:ring-pink-500">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                value={commSearch}
                onChange={(e) => setCommSearch(e.target.value)}
                placeholder="Search staff, announcements, sentiment, messages..."
                className="bg-transparent border-none text-xs text-slate-800 focus:outline-none placeholder-slate-400 w-full"
              />
              {commSearch && (
                <button onClick={() => setCommSearch("")} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* ACTIVE VIEW CONTENT BOARDS (a, b, c, d, e) */}

          {/* SUB-VIEW 1: BROADCAST ANNOUNCEMENTS LIST & CREATE */}
          {activeCommSubTab === "broadcast" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Broadcast input console */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-sm h-fit">
                <div className="border-b pb-2">
                  <span className="text-[9.5px] uppercase font-black tracking-widest text-pink-500 block">BROADCAST CENTER</span>
                  <h3 className="text-sm font-black text-slate-900">Post Outbound Announcement</h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">Announcement Title*</label>
                    <input
                      type="text"
                      value={newAnnTitle}
                      onChange={(e) => setNewAnnTitle(e.target.value)}
                      placeholder="e.g. Cold Chain Alert: Fridge Reset"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">Message Body*</label>
                    <textarea
                      value={newAnnBody}
                      onChange={(e) => setNewAnnBody(e.target.value)}
                      placeholder="Type details of protocol changes, transport schedule..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none font-sans"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">Channel*</label>
                      <select
                        value={newAnnChannel}
                        onChange={(e) => setNewAnnChannel(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-800 focus:outline-none"
                      >
                        <option>Dashboard Alert & SMS Broadcast</option>
                        <option>Slack, WhatsApp & Mobile SMS</option>
                        <option>In-App Announcement Hub</option>
                        <option>Consolidated Email Digest</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">Badge Emoji*</label>
                      <select
                        value={newAnnImage}
                        onChange={(e) => setNewAnnImage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2 py-2 text-slate-800 focus:outline-none"
                      >
                        <option>📢</option>
                        <option>❄️</option>
                        <option>🦞</option>
                        <option>🐠</option>
                        <option>🐟</option>
                        <option>📋</option>
                        <option>🚨</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (!newAnnTitle || !newAnnBody) {
                        alert("Please fill in both Announcement Title and Message Body.");
                        return;
                      }
                      const newAnn: AnnouncementType = {
                        id: `ann-${Date.now()}`,
                        title: newAnnTitle,
                        messageBody: newAnnBody,
                        dateSent: new Date().toISOString().replace('T', ' ').substring(0, 16),
                        image: newAnnImage,
                        sentBy: "Ivan Nabwire (Lead Marketer)",
                        acknowledgementDate: "Pending staff validation",
                        announcementSummaryAI: `AI generated synopsis: High priority update alerting teams on "${newAnnTitle}". Strict compliance requested.`,
                        suggestedFollowUpActionsAI: `Automatic suggested action: Verify that all scheduled receivers have read and checked this update within 2 hours.`,
                        preferredCommunicationChannels: newAnnChannel
                      };
                      if (onAddRecord) {
                        onAddRecord("announcements", newAnn).catch(console.error);
                      }
                      
                      // Increment Ivan's statistics
                      const marketer = staffMembers.find(s => s.id === "stf-01");
                      if (marketer && onUpdateRecord) {
                        onUpdateRecord("communicationStaffMembers", marketer.id, {
                          ...marketer,
                          announcementSent: (marketer.announcementSent || 0) + 1,
                          totalAnnouncementSentDate: new Date().toISOString().substring(0, 10)
                        }).catch(console.error);
                      }

                      setNewAnnTitle("");
                      setNewAnnBody("");
                    }}
                    className="w-full bg-pink-650 hover:bg-pink-750 text-white rounded-xl py-2.5 font-black uppercase tracking-wider transition active:scale-95 cursor-pointer"
                  >
                    🚀 Broadcast to Channels
                  </button>
                </div>
              </div>

              {/* Announcements list output (filtered) */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* d. TRACK AND MONITOR ANNOUNCEMENT ENGAGEMENT OVERVIEW */}
                <div className="bg-slate-50 p-4 border border-slate-200/80 rounded-2xl">
                  <h4 className="text-[10px] font-extrabold uppercase text-slate-400 tracking-widest mb-2 flex items-center justify-between">
                    <span>📢 Announcement Engagement Overview (Real-time Audit Trace)</span>
                    <span className="text-[9px] font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full border border-pink-100">Live Stream active</span>
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-sm text-center">
                      <span className="text-xs font-black text-slate-800 font-mono block">94.7% Average Rate</span>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: "94.7%" }}></div>
                      </div>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-sm text-center">
                      <span className="text-xs font-black text-slate-800 font-mono block">SMS Feed Delivery</span>
                      <span className="inline-block mt-1 font-bold text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full border border-green-100">✔ Verified 100% Online</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-sm text-center col-span-2 md:col-span-1">
                      <span className="text-xs font-black text-slate-800 font-mono block">Pending Action</span>
                      <span className="inline-block mt-1 font-extrabold text-[9px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">0 Staff Overdue</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {announcements
                    .filter(a => {
                      const t = commSearch.toLowerCase();
                      return a.title.toLowerCase().includes(t) || a.messageBody.toLowerCase().includes(t) || a.sentBy.toLowerCase().includes(t);
                    })
                    .map((a) => (
                      <div key={a.id} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm hover:border-slate-300 transition duration-150">
                        <div className="flex items-start gap-4">
                          <span className="text-3xl p-2.5 bg-slate-100 rounded-2xl">{a.image}</span>
                          <div className="space-y-0.5 w-full">
                            <span className="text-[9px] font-extrabold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded border">
                              {a.preferredCommunicationChannels}
                            </span>
                            <h3 className="text-base font-black text-slate-900 tracking-tight block mt-1">{a.title}</h3>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-semibold">
                              <span>Sent By: <strong className="text-slate-600">{a.sentBy}</strong></span>
                              <span>•</span>
                              <span className="font-mono">{a.dateSent}</span>
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50/50 p-3.5 rounded-2xl whitespace-pre-wrap border border-slate-100">
                          {a.messageBody}
                        </p>

                        {/* COGNITIVE AI ENRICHMENT BOX */}
                        <div className="bg-pink-50/45 p-4 rounded-2xl border border-pink-100/60 space-y-3">
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-pink-700 uppercase tracking-wider">
                            <span>✨ Artificial Intelligence Advisory</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-medium">
                            <div className="space-y-1">
                              <span className="text-[9.5px] uppercase font-bold text-pink-600 tracking-wider block">Announcement Summary AI</span>
                              <p className="text-slate-700 text-xs italic">
                                "{a.announcementSummaryAI}"
                              </p>
                            </div>
                            <div className="space-y-1 border-t md:border-t-0 md:border-l border-pink-200/50 md:pl-4">
                              <span className="text-[9.5px] uppercase font-bold text-pink-600 tracking-wider block">Suggested Follow-up Actions AI</span>
                              <p className="text-slate-700 text-xs text-emerald-800">
                                ✔ {a.suggestedFollowUpActionsAI}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between text-xs pt-3 border-t border-slate-100 gap-2">
                          <span className="text-[10px] font-bold text-slate-400 uppercase">
                            Acknowledgement Status: <strong className="text-slate-700 font-mono font-black">{a.acknowledgementDate}</strong>
                          </span>
                          <button
                            onClick={() => {
                              // Simulate acknowledging
                              if (a.acknowledgementDate !== "Pending staff validation") {
                                alert("This announcement has already been verified and acknowledged by staff.");
                                return;
                              }
                              const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 16);
                              // Update announcement list
                              if (onUpdateRecord) {
                                onUpdateRecord("announcements", a.id, { ...a, acknowledgementDate: `Acknowledged at ${timestamp}` }).catch(console.error);
                              }
                              
                              // Create clean acknowledgement list item
                              const newAck: AcknowledgementType = {
                                id: `ack-${Date.now()}`,
                                name: "Ivan Nabwire",
                                acknowledgementDate: timestamp,
                                staffMember: "Ivan Nabwire",
                                announcement: a.messageBody,
                                directMessage: "None",
                                confirmed: true,
                                staffPhoto: "💼",
                                notes: "System verification triggered by active operater session.",
                                announcementTitle: a.title,
                                staffRole: "Lead Marketer & Operator",
                                acknowledgementQualityAssessment: "Immediate • Compliant within 1 minute via Direct Dashboard Portal"
                              };
                              if (onAddRecord) {
                                onAddRecord("acknowledgements", newAck).catch(console.error);
                              }
                              
                              // Increment staff stats
                              const marketer = staffMembers.find(s => s.id === "stf-01");
                              if (marketer && onUpdateRecord) {
                                onUpdateRecord("communicationStaffMembers", marketer.id, {
                                  ...marketer,
                                  acknowledgements: (marketer.acknowledgements || 0) + 1,
                                  totalAcknowledgements: (marketer.totalAcknowledgements || 0) + 1
                                }).catch(console.error);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1 cursor-pointer ${
                              a.acknowledgementDate === "Pending staff validation"
                                ? "bg-slate-900 text-amber-400 hover:bg-slate-800"
                                : "bg-emerald-50 text-emerald-700 cursor-not-allowed font-extrabold border border-emerald-100"
                            }`}
                          >
                            <CheckCircle size={12} />
                            <span>{a.acknowledgementDate === "Pending staff validation" ? "Acknowledge Now" : "Acknowledged & Logged"}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

            </div>
          )}

          {/* SUB-VIEW 2: DIRECT MESSAGES & TIMELINE */}
          {activeCommSubTab === "direct" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-2 duration-200">
              
              {/* Direct messaging entry panel */}
              <div className="bg-white border border-slate-200 p-5 rounded-3xl space-y-4 shadow-sm h-fit">
                <div className="border-b pb-2">
                  <span className="text-[9.5px] uppercase font-black tracking-widest text-[#2980b9] block">DISPATCH TERMINAL</span>
                  <h3 className="text-sm font-black text-slate-900">Send Direct Messenger Log</h3>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">Message Subject Reference*</label>
                    <input
                      type="text"
                      value={newDmName}
                      onChange={(e) => setNewDmName(e.target.value)}
                      placeholder="e.g. URGENT: Albert, verify truck seal"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-850 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">Select Recipient Staff Member*</label>
                    <select
                      value={newDmRecipient}
                      onChange={(e) => setNewDmRecipient(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none"
                    >
                      {staffMembers.map(s => (
                        <option key={s.id} value={s.fullNames}>{s.fullNames} ({s.role})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">Message Content / Instructions*</label>
                    <textarea
                      value={newDmContent}
                      onChange={(e) => setNewDmContent(e.target.value)}
                      placeholder="Type secure dispatch notes, order codes to trace..."
                      rows={4}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-black text-slate-500 mb-1">Visual Preview Attachment</label>
                    <select
                      value={newDmPhoto}
                      onChange={(e) => setNewDmPhoto(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none"
                    >
                      <option value="💬">💬 Chat Bubble Emoji</option>
                      <option value="❄️">❄️ Cold Storage Room Image</option>
                      <option value="🐟">🐟 Fresh Fillet Image</option>
                      <option value="🦞">🦞 Giant Lobster Pack Image</option>
                      <option value="🚜">🚜 Outbound Logistics Dispatch</option>
                    </select>
                  </div>

                  <button
                    onClick={() => {
                      if (!newDmName || !newDmContent) {
                        alert("Please fill in DM Subject and Content.");
                        return;
                      }
                      
                      const recipientObj = staffMembers.find(s => s.fullNames === newDmRecipient);
                      
                      const newDm: DirectMessageType = {
                        id: `dm-${Date.now()}`,
                        messageName: newDmName,
                        messageContent: newDmContent,
                        sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
                        sender: "Ivan Nabwire",
                        recipient: newDmRecipient,
                        photos: [newDmPhoto],
                        acknowledgementDateTime: "Pending active acknowledgment",
                        confirmed: false,
                        senderRole: "Lead Marketer & Operator",
                        recipientRole: recipientObj?.role || "Logistics Staff",
                        messageSentiment: newDmContent.toLowerCase().includes("urgent") || newDmContent.toLowerCase().includes("alert") ? "Neutral" : "Positive",
                        messageSummary: `AI generated log: Real-time coordination addressing order specs or cold storage guidelines.`
                      };

                      if (onAddRecord) {
                        onAddRecord("directMessages", newDm).catch(console.error);
                      }
                      
                      // Update Ivan's counter
                      const marketer = staffMembers.find(s => s.id === "stf-01");
                      if (marketer && onUpdateRecord) {
                        onUpdateRecord("communicationStaffMembers", marketer.id, {
                          ...marketer,
                          directMessagesSent: (marketer.directMessagesSent || 0) + 1,
                          totalDirectMessagesSent: (marketer.totalDirectMessagesSent || 0) + 1,
                          lastDirectMessageSentDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
                        }).catch(console.error);
                      }

                      setNewDmName("");
                      setNewDmContent("");
                    }}
                    className="w-full bg-slate-900 hover:bg-slate-850 text-white hover:text-amber-400 rounded-xl py-2.5 font-black uppercase tracking-wider transition cursor-pointer"
                  >
                    💬 Send Private Dispatch Message
                  </button>
                </div>
              </div>

              {/* b./c. VIEW CHRONOLOGICAL TIMELINE */}
              <div className="lg:col-span-2 space-y-4">
                
                <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl">
                  <h4 className="text-[10px] font-extrabold uppercase text-sky-800 tracking-wider mb-1 flex items-center justify-between">
                    <span>🔄 Chronological Timeline (Historical Accountability Thread)</span>
                    <span className="font-mono text-[9px] bg-sky-200/75 px-1.5 py-0.5 rounded text-sky-900 font-bold">Trace verified</span>
                  </h4>
                  <p className="text-[10px] text-sky-900 leading-normal">
                    This is an immutable historical communication register capturing announcements and private direct messages 
                    exchanged between staff members to trace operational decisions, and audit biosecure cold storage handoffs.
                  </p>
                </div>

                <div className="space-y-4 relative border-l-2 border-slate-200/80 pl-4 ml-2">
                  
                  {/* Union loop that combines announcements and DMs chronologically */}
                  {[
                    ...announcements.map(a => ({
                      id: a.id,
                      type: "announcement" as const,
                      timestamp: a.dateSent,
                      title: a.title,
                      message: a.messageBody,
                      sender: a.sentBy,
                      recipient: "All Staff Members",
                      sentiment: "Neutral",
                      summary: a.announcementSummaryAI,
                      photos: [a.image],
                      confirmed: a.acknowledgementDate !== "Pending staff validation"
                    })),
                    ...directMessages.map(d => ({
                      id: d.id,
                      type: "dm" as const,
                      timestamp: d.sentAt,
                      title: d.messageName,
                      message: d.messageContent,
                      sender: d.sender,
                      recipient: d.recipient,
                      sentiment: d.messageSentiment,
                      summary: d.messageSummary,
                      photos: d.photos,
                      confirmed: d.confirmed
                    }))
                  ]
                  .sort((x, y) => {
                    return new Date(y.timestamp).getTime() - new Date(x.timestamp).getTime();
                  })
                  .filter(item => {
                    const term = commSearch.toLowerCase();
                    return item.title.toLowerCase().includes(term) || item.message.toLowerCase().includes(term) || item.sender.toLowerCase().includes(term) || item.recipient.toLowerCase().includes(term);
                  })
                  .map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="relative bg-white border border-slate-205 p-4 rounded-2xl shadow-sm space-y-3">
                      {/* Timeline Dot Indicator */}
                      <span className={`absolute -left-[25px] top-4 w-3.5 h-3.5 rounded-full border-2 border-white shadow ${
                        item.type === "announcement" ? "bg-pink-500" : "bg-sky-500"
                      }`} />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b pb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.photos[0] || "📬"}</span>
                          <div>
                            <span className={`text-[8.5px] uppercase font-black px-1.5 py-0.5 rounded font-mono ${
                              item.type === "announcement" ? "bg-pink-100 text-pink-700" : "bg-sky-100 text-sky-700"
                            }`}>
                              {item.type === "announcement" ? "📢 BROADCAST ANNOUNCEMENT" : "💬 DIRECT OPERATIONAL DIRECTIVE"}
                            </span>
                            <h4 className="text-xs font-black text-slate-900 tracking-tight mt-0.5">{item.title}</h4>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 font-mono font-bold block">{item.timestamp}</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-650 leading-relaxed italic">
                        "{item.message}"
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[10px] text-slate-500 pt-1.5">
                        <div>
                          <span className="font-extrabold text-slate-450 uppercase block">Sender Node</span>
                          <span className="font-semibold text-slate-850 font-sans">{item.sender}</span>
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-450 uppercase block">Recipient / Group Target</span>
                          <span className="font-semibold text-slate-850 font-sans">{item.recipient}</span>
                        </div>
                      </div>

                      {/* Timeline Sentiment analysis */}
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center justify-between text-[10px] gap-2">
                        <div>
                          <span className="uppercase text-slate-400 font-bold font-mono">Cognitive Sentiment AI: </span>
                          <span className={`font-black ${
                            item.sentiment === "Positive" ? "text-green-600" : "text-amber-600"
                          }`}>{item.sentiment || "Neutral"}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-bold">ACKNOWLEDGEMENT STATUS:</span>
                          <span className={`font-mono font-black uppercase text-[9.5px] px-1.5 py-0.5 rounded ${
                            item.confirmed ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                          }`}>
                            {item.confirmed ? "✔ Confirmed & Active" : "⏱ Pending Confirm"}
                          </span>
                        </div>
                      </div>

                      {/* Action trigger button for unconfirmed timeline elements */}
                      {!item.confirmed && item.type === "dm" && (
                        <div className="flex justify-end pt-1">
                          <button
                            onClick={() => {
                              // Confirming a direct message
                              const targetDm = directMessages.find(d => d.id === item.id);
                              if (targetDm && onUpdateRecord) {
                                onUpdateRecord("directMessages", targetDm.id, {
                                  ...targetDm,
                                  confirmed: true,
                                  acknowledgementDateTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
                                }).catch(console.error);
                              }
                              
                              // Add to acknowledgements logs
                              const ackObj: AcknowledgementType = {
                                id: `ack-dm-${Date.now()}`,
                                name: item.recipient,
                                acknowledgementDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
                                staffMember: item.recipient,
                                announcement: "None",
                                directMessage: item.message,
                                confirmed: true,
                                staffPhoto: "👤",
                                notes: `Acknowledgment of direct instruction logged on timeline thread: "${item.title}"`,
                                announcementTitle: "None",
                                staffRole: "Specialist",
                                acknowledgementQualityAssessment: "Promptly signed off on timeline thread"
                              };
                              if (onAddRecord) {
                                onAddRecord("acknowledgements", ackObj).catch(console.error);
                              }
                              
                              // Increment staff counters
                              const targetStaff = staffMembers.find(s => s.fullNames === item.recipient);
                              if (targetStaff && onUpdateRecord) {
                                onUpdateRecord("communicationStaffMembers", targetStaff.id, {
                                  ...targetStaff,
                                  acknowledgements: (targetStaff.acknowledgements || 0) + 1,
                                  totalAcknowledgements: (targetStaff.totalAcknowledgements || 0) + 1,
                                  acknowledgementRate: Math.min(100, (targetStaff.acknowledgementRate || 90) + 5)
                                }).catch(console.error);
                              }
                            }}
                            className="bg-sky-600 hover:bg-sky-700 text-white rounded-lg px-2.5 py-1 text-[9px] uppercase font-black flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle size={10} />
                            <span>Sign and Confirm Receipt</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* SUB-VIEW 3: STAFF MEMBERS DIRECTORY */}
          {activeCommSubTab === "staff" && (
            <div className="space-y-6">
              
              <div className="grid grid-cols-1 gap-4.5">
                {staffMembers
                  .filter(s => {
                    const q = commSearch.toLowerCase();
                    return s.fullNames.toLowerCase().includes(q) || s.role.toLowerCase().includes(q) || s.emailAddress.toLowerCase().includes(q);
                  })
                  .map((s) => (
                    <div key={s.id} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-sm hover:border-slate-300 transition duration-150">
                      
                      {/* Flex staff details */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-3 border-dashed">
                        <div className="flex items-center gap-4">
                          <span className="text-4xl p-2.5 bg-slate-50 border rounded-2xl">{s.photo}</span>
                          <div>
                            <h3 className="text-base font-black text-slate-900 tracking-tight leading-tight">{s.fullNames}</h3>
                            <span className="text-xs font-bold text-pink-600 block mt-0.5">{s.role}</span>
                            <span className="text-xs font-mono text-slate-500 block leading-tight mt-1">{s.emailAddress} • {s.contactNumber}</span>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-[9px] font-extrabold text-slate-400 block uppercase">COMMUNICATION COGNITIVE SCORE</span>
                          <span className="text-xl font-black text-emerald-600 font-mono block tracking-tight">
                            {s.communicationEngagementScoreAI} / 100
                          </span>
                          <div className="w-24 bg-slate-100 h-1.5 rounded-full mt-1.5 ml-auto overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${s.communicationEngagementScoreAI}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Grid metrics elements */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium">
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Announcement Sent / Received</span>
                          <span className="text-slate-900 font-black font-mono block text-xs">
                            Sent: {s.announcementSent} • Recv: {announcements.length}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Direct Messages Exchanged</span>
                          <span className="text-slate-900 font-black font-mono block text-xs">
                            Sent: {s.directMessagesSent} • Recv: {directMessages.filter(d => d.recipient === s.fullNames).length}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Acknowledgements Registered</span>
                          <span className="text-slate-900 font-black font-mono block text-xs">
                            Total: {s.acknowledgements} acknowledged
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">Acknowledgement Rate (%)</span>
                          <span className="text-slate-900 font-black font-mono block text-xs text-pink-650">
                            {s.acknowledgementRate}% compliant
                          </span>
                        </div>
                      </div>

                      {/* Date history tracking */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[10px] text-slate-500 bg-slate-50 p-3 rounded-2xl border">
                        <div>
                          <span className="font-bold text-slate-400 uppercase">Last Announcement Sent Date:</span>
                          <span className="font-mono font-semibold text-slate-700 ml-1.5">{s.totalAnnouncementSentDate || "Never Sent"}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-400 uppercase">Last Direct Message Sent Date:</span>
                          <span className="font-mono font-semibold text-slate-700 ml-1.5">{s.lastDirectMessageSentDate || "Never Sent"}</span>
                        </div>
                      </div>

                      {/* AI generated summary card */}
                      <div className="bg-emerald-50/40 p-3.5 rounded-2xl border border-emerald-100/50 space-y-1">
                        <span className="text-[9px] uppercase font-bold text-emerald-800 tracking-wider block">Recent Communication Summary AI</span>
                        <p className="text-xs text-slate-700 italic">
                          "{s.recentCommunicationSummaryAI}"
                        </p>
                        <div className="text-[9px] text-slate-400 font-medium pt-1 mt-1 border-t border-emerald-100/20">
                          Direct Messaging Recipient Routing: <strong className="text-slate-600">{s.directMessagesRecipient}</strong>
                        </div>
                      </div>

                    </div>
                  ))}
              </div>

            </div>
          )}

          {/* SUB-VIEW 4: ACKNOWLEDGEMENTS AUDIT */}
          {activeCommSubTab === "acknowledgements" && (
            <div className="space-y-4">
              
              <div className="bg-amber-50 p-4 border border-amber-200/80 rounded-2xl">
                <h4 className="text-[10px] font-extrabold uppercase text-amber-800 tracking-wider mb-1">🤝 Compliance Acknowledgements Audit Ledger</h4>
                <p className="text-[10px] text-amber-900 leading-normal">
                  In compliance with export seafood sanitization frameworks, this list logs immutable digital receipt files. 
                  Every team log contains the recipient role, full names, completion timestamp, and an automated Quality Assessment.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5">
                {acknowledgements
                  .filter(a => {
                    const q2 = commSearch.toLowerCase();
                    return a.name.toLowerCase().includes(q2) || a.announcementTitle.toLowerCase().includes(q2) || a.acknowledgementQualityAssessment.toLowerCase().includes(q2);
                  })
                  .map((ack) => (
                    <div key={ack.id} className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3.5 shadow-sm">
                      <div className="flex items-center gap-3 border-b pb-2">
                        <span className="text-2xl p-1 bg-slate-100 rounded-lg">{ack.staffPhoto}</span>
                        <div>
                          <h4 className="text-xs font-black text-slate-900 leading-tight">{ack.name}</h4>
                          <span className="text-[9px] text-slate-400 font-bold block mt-0.5">{ack.staffRole}</span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Announcement Target Title</span>
                          <span className="font-semibold text-slate-800 text-[11px] block truncate">{ack.announcementTitle === "None" ? "Direct Timeline Message Confirm" : ack.announcementTitle}</span>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Logged Notes</span>
                          <p className="text-slate-600 italic bg-slate-50 p-2 rounded-xl text-[10.5px] border border-dashed">
                            "{ack.notes}"
                          </p>
                        </div>
                        <div>
                          <span className="text-[9px] uppercase font-bold text-slate-400 block">Sign-off Timestamp</span>
                          <span className="font-mono font-bold text-slate-805 block">{ack.acknowledgementDate}</span>
                        </div>
                      </div>

                      <div className="bg-emerald-50 text-emerald-800 text-[9.5px] p-2 rounded-xl border border-emerald-100 flex items-center justify-between font-medium">
                        <span>Quality Assessment:</span>
                        <strong className="text-emerald-950 font-black">{ack.acknowledgementQualityAssessment}</strong>
                      </div>
                    </div>
                  ))}
              </div>

            </div>
          )}

          {/* SUB-VIEW 5: HELP CENTER & INTERACTIVE COMPULSORY CHAT */}
          {activeCommSubTab === "rules" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Help Center articles list */}
              <div className="lg:col-span-5 bg-white border border-slate-205 p-5 rounded-3xl shadow-sm space-y-4">
                <div className="border-b pb-2">
                  <span className="text-[9.5px] uppercase font-black tracking-widest text-[#d35400] block">OPERATIONAL RESOURCE HUB</span>
                  <h3 className="text-sm font-black text-slate-900">Communication Channels Help Center</h3>
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-slate-50 border rounded-2xl">
                    <h4 className="text-[11px] font-black text-slate-900">1. Digital Broadcaster Rules</h4>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Announcements sent on the master channel are automatically converted to thermal picking checklists. 
                      Ensure titles match the exact physical item tags.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border rounded-2xl">
                    <h4 className="text-[11px] font-black text-slate-900">2. Interactive File Sharing</h4>
                    <p className="text-[10px] text-slate-500 mt-1">
                      PDF, Excel sheet, and thermal QR ticket uploads are handled through secure sandbox APIs. 
                      Attach file logs from the CRM contact forms to secure real-time audits.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-50 border rounded-2xl">
                    <h4 className="text-[11px] font-black text-slate-900">3. Live Chat Resolution SLAs</h4>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Corporate customer support tickets possess a strict 2-hour SLA. Use the consolidated group logs to cross-reference trace records.
                    </p>
                  </div>
                </div>

                {/* Simulated file sharing and uploading */}
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-300 space-y-2 text-center">
                  <span className="text-2xl block">📁</span>
                  <h4 className="text-xs font-black text-slate-700">Digital File Sharing & Uploads</h4>
                  <p className="text-[10px] text-slate-450 leading-relaxed max-w-xs mx-auto">
                    Drag and drop logistics PDF spreadsheets, thermal label templates, or client invoice captures here.
                  </p>
                  <button
                    onClick={() => {
                      alert("File uploaded successfully into CRM secure media attachment bucket.");
                    }}
                    className="mt-1 px-4 py-1.5 bg-slate-800 text-white hover:text-amber-400 text-[10px] font-black uppercase rounded-lg cursor-pointer"
                  >
                    Simulate Upload File
                  </button>
                </div>
              </div>

              {/* Secure group chat stream */}
              <div className="lg:col-span-7 bg-slate-900 text-white rounded-3xl p-5 border border-slate-800 shadow-md">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                    <h3 className="text-xs font-black uppercase tracking-wider text-pink-400">Live Secure Chat Support Channel</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">CHANNEL PIN: SEAFOOD_OPS_SECURE</span>
                </div>

                {/* Simulated message logs timeline */}
                <div className="space-y-3 h-80 overflow-y-auto pr-2 flex flex-col justify-end text-xs font-medium">
                  <div className="bg-slate-800 p-3 rounded-2xl max-w-sm self-start">
                    <span className="text-[9px] text-pink-300 font-bold block mb-1">Ivan Nabwire • Lead Marketer</span>
                    <p className="text-slate-200">
                      Team, I updated the biosecure Spiny Lobster tail rates. Please ensure client pre-orders are generated with the updated codes.
                    </p>
                  </div>

                  <div className="bg-slate-800 p-3 rounded-2xl max-w-sm self-start">
                    <span className="text-[9px] text-sky-300 font-bold block mb-1">Florence Namubiru • Sales Associate</span>
                    <p className="text-slate-200">
                      Acknowledged, Ivan. Sesse Seafood agreed to the adjusted clean spec. Will update the invoice mapping right now.
                    </p>
                  </div>

                  <div className="bg-pink-650 p-3 rounded-2xl max-w-sm self-end text-right">
                    <span className="text-[9px] text-white font-bold block mb-1">You • Active Console Session</span>
                    <p className="text-white">
                      Group chat telemetry online. Initialising compliance checks for Saturday's cold chain transfer process.
                    </p>
                  </div>
                </div>

                {/* Chat input form */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type encrypted operations message to group channel..."
                    className="flex-1 bg-slate-800 text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-pink-500 placeholder-slate-550 border border-slate-755"
                  />
                  <button
                    onClick={() => {
                      alert("Message broadcasted securely via internal radio network API.");
                    }}
                    className="bg-pink-650 hover:bg-pink-755 text-white px-4 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer font-sans"
                  >
                    Send
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
