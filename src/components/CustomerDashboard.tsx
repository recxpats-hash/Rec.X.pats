/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState } from "react";
import { 
  Calendar, 
  Plus, 
  Filter, 
  Search, 
  Trash2, 
  Edit3, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Car, 
  Phone, 
  User, 
  BadgeDollarSign, 
  UserCheck, 
  FileText, 
  Compass, 
  Scaling, 
  Maximize2,
  Minimize2,
  Activity,
  Heart,
  Briefcase,
  MessageSquare,
  PhoneCall,
  ShoppingCart,
  Send,
  Check,
  ExternalLink,
  HelpCircle,
  Minus,
  ShoppingBag,
  CreditCard,
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react";
import { AppointmentBooking, ConsultancyRecord } from "../types";
import MarketplacePortal from "./MarketplacePortal";
import AppLogo from "./AppLogo";
import BackgroundWatermark from "./BackgroundWatermark";

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  emoji: string;
  rating: string;
  stock: number;
  minOrder: number;
  badge: string;
  details: string;
}

export const marketplaceProducts: MarketplaceProduct[] = [
  {
    id: "prod-tilapia-seed",
    name: "Monosex Tilapia Fingerlings (AAA+)",
    category: "Live Seed Stock",
    description: "Super-male hormone treated (99% monosex reversal parity). Sourced from selectively bred fast-growth biological broodstock.",
    price: 350,
    unit: "Pc",
    emoji: "🐟",
    rating: "4.9",
    stock: 45000,
    minOrder: 1000,
    badge: "Best Seller",
    details: "Reaches harvest-weight in 150-180 days with optimized feeding schedules. High tolerance to pH variations."
  },
  {
    id: "prod-catfish-seed",
    name: "African Catfish Fingerlings (Grade A)",
    category: "Live Seed Stock",
    description: "Clarias Gariepinus high stamina fingerlings. Resilient biological nursery stock with rapid growth capacity.",
    price: 400,
    unit: "Pc",
    emoji: "🎏",
    rating: "4.8",
    stock: 30000,
    minOrder: 1000,
    badge: "High Survival Rate",
    details: "Ideal for high-density recirculating systems or dirt-bottom earth ponds. Low oxygen threshold."
  },
  {
    id: "prod-starter-crumble",
    name: "Floating Starter Crumble (0.8mm - 1.2mm)",
    category: "Feeds & Formulation",
    description: "45% crude protein formula loaded with essential nursery immunization boosters and digestible lipids.",
    price: 120000,
    unit: "Bag (20kg)",
    emoji: "🥫",
    rating: "4.9",
    stock: 150,
    minOrder: 1,
    badge: "Premium Nursery",
    details: "Formulated specifically to ensure early fingerling stage uniformity and maximum structural bone strength."
  },
  {
    id: "prod-grower-pellets",
    name: "Sinking Grower Pellets (3mm)",
    category: "Feeds & Formulation",
    description: "Highly stable bottom pellets with 38% crude protein to stimulate massive grow-out weights in Catfish.",
    price: 95000,
    unit: "Bag (25kg)",
    emoji: "🎒",
    rating: "4.7",
    stock: 120,
    minOrder: 1,
    badge: "Standard Growout",
    details: "Optimized sinking velocity to prevent premature breakdown and limit water quality waste load."
  },
  {
    id: "prod-water-testkit",
    name: "Precision Colorimetric Water Test Kit",
    category: "Testing & Diagnostics",
    description: "Professional reagent kit to measure Dissolved Oxygen, pH, Ammonia, Nitrates, and hardness values.",
    price: 260000,
    unit: "Kit",
    emoji: "🧪",
    rating: "5.0",
    stock: 18,
    minOrder: 1,
    badge: "Must-Have",
    details: "Includes 150 tests, glass test vials, color match charts, and immediate troubleshooting actions guide."
  },
  {
    id: "prod-venturi",
    name: "Submersible Venturi Aeration Diffuser",
    category: "Testing & Diagnostics",
    description: "Continuous duty aeration nozzle utilizing passive air suction to deliver tiny micro-bubbles to ponds.",
    price: 450000,
    unit: "Unit",
    emoji: "🔌",
    rating: "4.8",
    stock: 12,
    minOrder: 1,
    badge: "High Efficiency",
    details: "Equipped with 220V standard connectors, heavy-duty anti-clog casing, and modular angle configurations."
  },
  {
    id: "prod-probiotics",
    name: "EcoAqua Probiotic Sludge Digester",
    category: "Testing & Diagnostics",
    description: "Nitrosomonas and Nitrobacter organic spores to consume decaying feeds and bottom sludge organic matter.",
    price: 180500,
    unit: "Can (1kg)",
    emoji: "🧴",
    rating: "4.6",
    stock: 35,
    minOrder: 1,
    badge: "Bio-Shield",
    details: "Reduces unionized ammonia toxic spikes, controls bottom gas bubbling, and drops water change frequency by 60%."
  }
];

interface CustomerDashboardProps {
  bookings: AppointmentBooking[];
  consultancies?: ConsultancyRecord[];
  onAddRecord: (model: string, payload: any) => Promise<void>;
  onDeleteRecord: (model: string, id: string) => Promise<void>;
  onUpdateRecord: (model: string, id: string, payload: any) => Promise<void>;
  currentUserEmail: string;
  currentUserRole?: string;
}

export default function CustomerDashboard({
  bookings,
  consultancies = [],
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  currentUserEmail,
  currentUserRole = "customer"
}: CustomerDashboardProps) {
  
  // Filtering states
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterPayment, setFilterPayment] = useState<string>("All");
  const [filterAppointmentType, setFilterAppointmentType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Views and details
  const [selectedBooking, setSelectedBooking] = useState<AppointmentBooking | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<AppointmentBooking | null>(null);

  // Contact Us Hub states
  const [showContactUsModal, setShowContactUsModal] = useState(false);
  const [contactTab, setContactTab] = useState<"consultance" | "communication" | "contact_centre">("consultance");
  const [msgSubject, setMsgSubject] = useState("");
  const [msgBody, setMsgBody] = useState("");
  const [msgUrgency, setMsgUrgency] = useState("Low");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState(false);

  // New Customer & Contact Centre Appointment Form States
  const [ccCustomerName, setCcCustomerName] = useState("");
  const [ccTransportMode, setCcTransportMode] = useState("Car");
  const [ccVehiclePlate, setCcVehiclePlate] = useState("");
  const [ccContactAddress, setCcContactAddress] = useState("");
  const [ccEmail, setCcEmail] = useState("");
  const [ccContactNumber, setCcContactNumber] = useState("");
  const [ccAppointmentType, setCcAppointmentType] = useState("Fry/ Fingerling/ Table-size Fish order");
  const [ccRelatedFishSales, setCcRelatedFishSales] = useState("");
  const [ccRelatedConsultancy, setCcRelatedConsultancy] = useState("");
  const [ccAppointmentDate, setCcAppointmentDate] = useState("");
  const [ccAppointmentTime, setCcAppointmentTime] = useState("");
  const [ccStatus, setCcStatus] = useState("Pending");
  const [ccStaffAssigned, setCcStaffAssigned] = useState("");
  const [ccPurposeNotes, setCcPurposeNotes] = useState("");
  
  // Staff & AI Sections
  const [ccFollowUpDetails, setCcFollowUpDetails] = useState("");
  const [ccCreatedBy, setCcCreatedBy] = useState("Customer self-service");
  const [ccGateFeePayment, setCcGateFeePayment] = useState("Not Paid");
  const [ccBiosecurityStatus, setCcBiosecurityStatus] = useState("Pending Verification");
  const [ccAiAnalysis, setCcAiAnalysis] = useState("");
  const [ccIsAiAnalyzing, setCcIsAiAnalyzing] = useState(false);
  const [ccSubmitting, setCcSubmitting] = useState(false);
  const [ccSubmitSuccess, setCcSubmitSuccess] = useState(false);

  // Form input states
  const [customersName, setCustomersName] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [transportMode, setTransportMode] = useState("Car");
  const [contactInfo, setContactInfo] = useState("");
  const [appointmentType, setAppointmentType] = useState("Fingerlings Order");
  const [relatedFishSales, setRelatedFishSales] = useState("Mono Sex Tilapia fry");
  const [selectedConsultancy, setSelectedConsultancy] = useState<string[]>([]);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [status, setStatus] = useState("Pending");
  const [staffAssigned, setStaffAssigned] = useState("Manager");
  const [purposeNotes, setPurposeNotes] = useState("");
  const [followUpRequired, setFollowUpRequired] = useState(false);
  const [followUpDetails, setFollowUpDetails] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [gateFeePayment, setGateFeePayment] = useState("Not Paid");
  const [biosecurityStatus, setBiosecurityStatus] = useState("Protocol Followed");
  const [healthEnvManagement, setHealthEnvManagement] = useState("");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiReport, setAiReport] = useState("");

  // Customer Consultancy Sub-states
  const [consSubTab, setConsSubTab] = useState<"services" | "submit" | "requests" | "responses" | "consultants" | "insights">("services");
  const [viewAllCons, setViewAllCons] = useState(true);
  const [custConsTitle, setCustConsTitle] = useState("");
  const [custConsNeeds, setCustConsNeeds] = useState("");
  const [custConsQuestions, setCustConsQuestions] = useState("");
  const [custConsServices, setCustConsServices] = useState("Water Quality & Soil Quality Analysis");
  const [custConsPhoto, setCustConsPhoto] = useState("");
  const [selectedRequestTrackerId, setSelectedRequestTrackerId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [dashboardView, setDashboardView] = useState<"engagements" | "consultancies" | "marketplace">("engagements");

  // Marketplace states
  const [cart, setCart] = useState<{ id: string; quantity: number }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedProd, setSelectedProd] = useState<any | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<"catalog" | "cart" | "payment" | "success">("catalog");
  const [paymentMethod, setPaymentMethod] = useState<"mobile_money" | "credit_card" | "wallet">("mobile_money");
  
  // Checkout & Order Info
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutPhone, setCheckoutPhone] = useState("");
  const [checkoutType, setCheckoutType] = useState<"delivery" | "pickup">("pickup");
  const [checkoutNotes, setCheckoutNotes] = useState("");
  
  // Payment Gateway Input fields
  const [mmNumber, setMmNumber] = useState("");
  const [mmProvider, setMmProvider] = useState("MTN Money");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [showCardCvv, setShowCardCvv] = useState(false);
  const [walletId, setWalletId] = useState("");
  
  // Payment Simulator tracking
  const [paymentPr, setPaymentPr] = useState(false);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [lastOrder, setLastOrder] = useState<any | null>(null);

  const transportOptions = [
    "Lorry", 
    "Motor Bike", 
    "Foot", 
    "Bus", 
    "Bicycle", 
    "Car", 
    "Pick Up"
  ];

  const appointmentTypes = [
    "Consultancy Service", 
    "Internship/Mentorship", 
    "On-Farm Stay", 
    "Institutional Farm Field Trips", 
    "Agritourism", 
    "R&D", 
    "Fingerlings Order"
  ];

  const fishSalesOptions = [
    "Mono Sex Tilapia fry", 
    "Mono Sex Catfish Fingerlings", 
    "Mirror Carp fry", 
    "Kgs of Mirror Carp Table Size", 
    "Mirror Carp Fingerlings"
  ];

  const consultancyServices = [
    "Feasibility Studies",
    "Financial Feasibility Analysis for recxpats",
    "recxpats Business Plan Development",
    "recxpats Project Management Services",
    "Fish Farm Design & Construction",
    "Water Quality & Soil Quality Analysis",
    "recxpats Engineering Services",
    "Start-Up Operations",
    "recxpats Genetics Program",
    "Fish Feeds Formulation & Supply",
    "Technical Training & Teaching( Apprenticeship)",
    "recxpats Company Audits",
    "Vetrinary Services",
    "R&D facility Hire"
  ];

  const systemConsultants = [
    {
      name: "Dr. Emily Tan",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      email: "emily.tan@aquaconsult.ug",
      phoneNumber: "+256 772 104592",
      expertiseAreas: "Water Chemistry, Larval Nutrition & Genetics",
      bio: "Dr. Emily Tan is an international recxpats geneticist with a decade of expertise in breeding-block engineering, low-FCR bio-feed development, and stress diagnostics. She leads our technical breeding audits.",
      yearsOfExperience: 12,
      consultancyResponses: [
        "Mitigating warm-season Nitrite flareups in fish farm grids",
        "Feed formulation using high-protein seed cake standard"
      ],
      activeStatus: "Active Status",
      totalResponses: 154,
      averageResponseRating: 4.9,
      followUpNeeded: "No Active Follow-up",
      lastResponseDateTime: "2026-06-18 09:30 AM",
      bioSummaryAi: "Geneticist focused on stock vigor, non-chemical pathogens suppression, and water quality bio-barrier optimization.",
      consultantStrengthAi: "Tilapia selective breeding, larval density stress triage, and rapid water chemistry restoration.",
      consultancyRequests: 168,
      estimatedHourlyRate: "Ush 150,000 / hr",
      recommendedPricingModelAi: "Milestone/Project-Based (Feasibility & Design); Retainer model (Weekly pond audit)",
      commentsOnValueDeliveredAi: "Emily's bio-pathway restructuring model has recorded a 32% increase in post-larvae fry survival ratios on 18 national standard farms.",
      hourlyRate: "Ush 150,000",
      projectBasedFees: "Ush 3,500,000",
      retainers: "Ush 1,200,000/mo",
      servicesOffered: [
        "Water Quality & Soil Quality Analysis",
        "recxpats Genetics Program",
        "Fish Feeds Formulation & Supply",
        "Start-Up Operations"
      ]
    },
    {
      name: "Eng. David Kigozi",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      email: "david.kigozi@aquadesign.ug",
      phoneNumber: "+256 701 889021",
      expertiseAreas: "RAS recirculating engineering, gravity drainage, and earth pond excavation",
      bio: "Eng. David Kigozi is a veteran civil and mechanical engineer specializing in water intake systems, earthen pond excavations, concrete raceway structures, and recirculation mechanical design.",
      yearsOfExperience: 15,
      consultancyResponses: [
        "Recirculating recxpats System (RAS) filter resizing guidelines",
        "Compaction diagnostics for heavy clay soil pond retaining levies"
      ],
      activeStatus: "Active Status",
      totalResponses: 112,
      averageResponseRating: 4.8,
      followUpNeeded: "Follow-up Scheduled (Visit scheduled for 21st Jun)",
      lastResponseDateTime: "2026-06-15 04:15 PM",
      bioSummaryAi: "Civil structural designer focusing on sustainable high-retentive engineering, clay compaction, and high-efficiency drainage.",
      consultantStrengthAi: "Recirculation filter sizing, solar energy pumps integration, and gravity run-off plumbing.",
      consultancyRequests: 124,
      estimatedHourlyRate: "Ush 180,000 / hr",
      recommendedPricingModelAi: "Project-Based (Detailed Blueprints); Retainer (Ongoing construction milestones checkups)",
      commentsOnValueDeliveredAi: "Engaged on over 30 earthen-pond construction programs, reducing operational water replacement costs through hybrid gravity drainage.",
      hourlyRate: "Ush 180,000",
      projectBasedFees: "Ush 5,000,000",
      retainers: "Ush 1,800,000/mo",
      servicesOffered: [
        "Fish Farm Design & Construction",
        "recxpats Engineering Services",
        "Feasibility Studies",
        "recxpats Project Management Services"
      ]
    },
    {
      name: "Dr. Florence Nabakooza",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
      email: "florence.naba@veterinary.go.ug",
      phoneNumber: "+256 752 443210",
      expertiseAreas: "Fish Pathology, Disease Barrier Planning & Biosecurity",
      bio: "Dr. Florence Nabakooza is a veterinary clinician who specializes in aquatic animal medicine. Her expertise covers microbiological culture assays, preventative pond bio-barriers, and chemical therapy dosage schedules.",
      yearsOfExperience: 10,
      consultancyResponses: [
        "Fungal control protocols (Saprolegnia) during cold temperatures",
        "Standard operating procedure for disinfectant footbaths across wet-labs"
      ],
      activeStatus: "Active Status",
      totalResponses: 95,
      averageResponseRating: 5.0,
      followUpNeeded: "No Active Follow-up",
      lastResponseDateTime: "2026-06-18 10:10 AM",
      bioSummaryAi: "Infectious pathogen specialist delivering fast veterinary scripts, biosecurity shields, and live-stock quarantine setups.",
      consultantStrengthAi: "Fish disease symptom mapping, anti-bacterial therapy schedules, and pre-release broodstock sanitation.",
      consultancyRequests: 99,
      estimatedHourlyRate: "Ush 200,000 / hr",
      recommendedPricingModelAi: "Hourly Triage Fees (Emergency alerts); Retainer plans (Monthly health screening audits)",
      commentsOnValueDeliveredAi: "Sourced and successfully implemented emergency salt treatments across nursery modules in the Victoria basin, saving multi-million fingerling margins.",
      hourlyRate: "Ush 200,000",
      projectBasedFees: "Ush 4,000,000",
      retainers: "Ush 1,500,000/mo",
      servicesOffered: [
        "Vetrinary Services",
        "recxpats Company Audits",
        "Water Quality & Soil Quality Analysis",
        "Technical Training & Teaching( Apprenticeship)"
      ]
    }
  ];

  const staffOptions = [
    "Manager", 
    "Finance Officer", 
    "Fish Farm Manager", 
    "Director"
  ];

  const statusOptions = [
    "Scheduled", 
    "No Show", 
    "Waiting Area", 
    "Pending"
  ];

  const paymentOptions = [
    "Paid", 
    "Not Paid"
  ];

  const biosecurityOptions = [
    "Protocol Followed", 
    "Protocol Not Followed", 
    "Not Sure"
  ];

  // Open form for a new booking
  const handleOpenNewForm = () => {
    setEditingBooking(null);
    setCustomersName("");
    setCustomerName("");
    setTransportMode("Car");
    setContactInfo("");
    setAppointmentType("Fingerlings Order");
    setRelatedFishSales("Mono Sex Tilapia fry");
    setSelectedConsultancy([]);
    setAppointmentDate(new Date().toISOString().substring(0, 10));
    setAppointmentTime("10:00");
    setStatus("Pending");
    setStaffAssigned("Manager");
    setPurposeNotes("");
    setFollowUpRequired(false);
    setFollowUpDetails("");
    setVehiclePlate("");
    setGateFeePayment("Not Paid");
    setBiosecurityStatus("Protocol Followed");
    setHealthEnvManagement("");
    setAiReport("");
    setIsFormOpen(true);
  };

  // Open form for editing an existing booking
  const handleEditClick = (booking: AppointmentBooking) => {
    setEditingBooking(booking);
    setCustomersName(booking.customersName || "");
    setCustomerName(booking.customerName || "");
    setTransportMode(booking.transportMode || "Car");
    setContactInfo(booking.contactInfo || "");
    setAppointmentType(booking.appointmentType || "Fingerlings Order");
    setRelatedFishSales(booking.relatedFishSales || "Mono Sex Tilapia fry");
    setSelectedConsultancy(booking.relatedConsultancy ? booking.relatedConsultancy.split(", ") : []);
    
    // Extract date and time
    let storedDate = "";
    let storedTime = "";
    if (booking.dateTime) {
      const parts = booking.dateTime.split(" ");
      storedDate = parts[0] || "";
      storedTime = parts[1] || "10:00";
    }
    setAppointmentDate(storedDate || new Date().toISOString().substring(0, 10));
    setAppointmentTime(storedTime || "10:00");
    
    setStatus(booking.status || "Pending");
    setStaffAssigned(booking.staffAssigned || "Manager");
    setPurposeNotes(booking.notes || "");
    setFollowUpRequired(booking.followUpRequired || false);
    setFollowUpDetails(booking.followUpDetails || "");
    setVehiclePlate(booking.vehiclePlate || "");
    setGateFeePayment(booking.gateFeePayment || "Not Paid");
    setBiosecurityStatus(booking.biosecurityStatus || "Protocol Followed");
    setHealthEnvManagement(booking.healthLink || "");
    setAiReport(booking.aiAnalysis || "");
    setIsFormOpen(true);
  };

  // Toggle consultancy checkboxes
  const handleConsultancyToggle = (service: string) => {
    if (selectedConsultancy.includes(service)) {
      setSelectedConsultancy(prev => prev.filter(item => item !== service));
    } else {
      setSelectedConsultancy(prev => [...prev, service]);
    }
  };

  // Submit appointment creation or update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !contactInfo) {
      alert("Please fill in the Customer Name and Contact Information.");
      return;
    }

    const payload: Omit<AppointmentBooking, "id"> = {
      customersName,
      customerName,
      transportMode,
      contactInfo,
      appointmentType,
      relatedFishSales,
      relatedConsultancy: selectedConsultancy.join(", "),
      dateTime: `${appointmentDate} ${appointmentTime}`,
      status,
      staffAssigned,
      notes: purposeNotes,
      followUpRequired,
      followUpDetails: followUpRequired ? followUpDetails : "",
      createdBy: currentUserEmail,
      vehiclePlate,
      gateFeePayment,
      biosecurityStatus,
      aiAnalysis: aiReport,
      healthLink: healthEnvManagement
    };

    if (editingBooking && editingBooking.id) {
      await onUpdateRecord("appointments", editingBooking.id, payload);
    } else {
      await onAddRecord("appointments", payload);
    }

    setIsFormOpen(false);
    setEditingBooking(null);
  };

  // Run on-screen smart AI simulation audit
  const runAiPreArrivalAnalysis = () => {
    setIsAiGenerating(true);
    setTimeout(() => {
      let analysis = "";
      if (biosecurityStatus === "Protocol Not Followed") {
        analysis = "[⚠️ HIGH BIOSECURITY RISK ALERT] Visitor is bringing transport equipment marked with non-compliance. Disinfection protocol check level 4 is standard required on tires and shoes. Recommend holding vehicle plate " + (vehiclePlate || "N/A") + " at gates pending manual ammonia/ph test spray.";
      } else if (biosecurityStatus === "Not Sure") {
        analysis = "[⚠️ WARNING] Biosecurity protocols status is indeterminate. Run gate audit check immediately for contact " + contactInfo + ". Assigning staff " + staffAssigned + " to inspect farm gate fee status: " + gateFeePayment;
      } else {
        analysis = "[✅ SECURE BIOSAFETY AUDIT] All standards follow official ISO biozone framework. Sourcing " + relatedFishSales + " verified clean. Scheduled arrival assigned to staff operator on " + appointmentDate + ". Safe to bypass quarantine stage.";
      }
      setAiReport(analysis);
      setIsAiGenerating(false);
    }, 900);
  };

  // Quick statistics rollups dynamically reflecting the active tab query
  const currentStatsBookings = bookings.filter(b => {
    if (dashboardView === "consultancies") {
      return b.appointmentType === "Consultancy Service" || (b.relatedConsultancy && b.relatedConsultancy.trim() !== "");
    }
    return true;
  });

  const totalBooked = currentStatsBookings.length;
  const pendingCount = currentStatsBookings.filter(b => b.status === "Pending").length;
  const scheduledCount = currentStatsBookings.filter(b => b.status === "Scheduled").length;
  const gateFeePaidCount = currentStatsBookings.filter(b => b.gateFeePayment === "Paid").length;

  // Filter & Search application
  const filteredBookings = bookings.filter(booking => {
    if (dashboardView === "consultancies") {
      const isConsultanceType = booking.appointmentType === "Consultancy Service" || (booking.relatedConsultancy && booking.relatedConsultancy.trim() !== "");
      if (!isConsultanceType) return false;
    }

    const matchesStatus = filterStatus === "All" || booking.status === filterStatus;
    const matchesPayment = filterPayment === "All" || booking.gateFeePayment === filterPayment;
    const matchesType = filterAppointmentType === "All" || booking.appointmentType === filterAppointmentType;
    
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      booking.customersName?.toLowerCase().includes(query) ||
      booking.customerName?.toLowerCase().includes(query) ||
      booking.notes?.toLowerCase().includes(query) ||
      booking.contactInfo?.toLowerCase().includes(query) ||
      booking.vehiclePlate?.toLowerCase().includes(query) ||
      booking.staffAssigned?.toLowerCase().includes(query) ||
      booking.relatedConsultancy?.toLowerCase().includes(query);

    return matchesStatus && matchesPayment && matchesType && matchesSearch;
  });

  const isCard1Active = filterStatus === "Scheduled" && filterPayment === "All";
  const isCard2Active = filterStatus === "Pending" && filterPayment === "All";
  const isCard3Active = filterPayment === "Paid" && filterStatus === "All";
  const isCard4Active = filterStatus === "All" && filterPayment === "All" && (dashboardView === "consultancies" || filterAppointmentType === "All") && searchQuery === "";

  return (
    <div className="space-y-6 relative overflow-hidden">
      {/* Center-aligned Brand Watermark */}
      <BackgroundWatermark mode="light" />
      
      {/* HEADER ACTION AREA */}
      <div className="bg-white border border-slate-200 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-emerald-600 font-extrabold text-[10px] uppercase tracking-wider block">Customer Booking Registry</span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Appointments & Scheduling Center</h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Manage live farm reservations, biosecurity protocols, gate-fees, and AI pre-admission assessments.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => {
              setDashboardView("marketplace");
              setCheckoutStep("catalog");
            }}
            className="border-2 border-amber-500 hover:bg-amber-500 hover:text-slate-950 text-amber-700 bg-amber-50/30 font-extrabold text-xs px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer shadow-xs"
          >
            <ShoppingCart size={14} />
            <span>Market Place</span>
          </button>

          <button
            onClick={() => {
              setContactTab("consultance");
              setShowContactUsModal(true);
            }}
            className="border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 font-extrabold text-xs px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition-all transform active:scale-95 cursor-pointer shadow-xs"
          >
            <PhoneCall size={14} />
            <span>Contact Us</span>
          </button>

          <button
            onClick={handleOpenNewForm}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-3 rounded-2xl flex items-center justify-center gap-2 transition-transform transform active:scale-95 cursor-pointer shadow-sm shadow-emerald-900/10"
          >
            <Plus size={15} />
            <span>Add Appointment Record</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Scheduled Visits */}
        <button
          type="button"
          onClick={() => {
            if (dashboardView === "marketplace") {
              setDashboardView("engagements");
            }
            setFilterStatus("Scheduled");
            setFilterPayment("All");
          }}
          className={`group hover:scale-[1.02] active:scale-98 transition-all duration-250 cursor-pointer text-left bg-gradient-to-br from-white to-sky-50/30 border p-4.5 rounded-2xl shadow-2xs relative overflow-hidden ${
            isCard1Active ? "border-sky-500 ring-2 ring-sky-500/15 bg-sky-50/40" : "border-slate-200 hover:border-sky-400 hover:shadow-xs"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 group-hover:text-sky-600 transition-colors">Scheduled Visits</span>
            <Calendar size={16} className={`transition-transform group-hover:scale-110 ${isCard1Active ? "text-sky-600" : "text-sky-500"}`} />
          </div>
          <div className="mt-2">
            <span className="text-2.5xl font-black text-slate-900 font-mono block leading-none">{scheduledCount}</span>
            <span className="text-[10px] font-bold text-emerald-600 block mt-1">Confirmed Calendar Spots</span>
          </div>
          {isCard1Active && (
            <div className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-sky-500 rounded-tl-lg" />
          )}
        </button>

        {/* Card 2: Awaiting Action */}
        <button
          type="button"
          onClick={() => {
            if (dashboardView === "marketplace") {
              setDashboardView("engagements");
            }
            setFilterStatus("Pending");
            setFilterPayment("All");
          }}
          className={`group hover:scale-[1.02] active:scale-98 transition-all duration-250 cursor-pointer text-left bg-gradient-to-br from-white to-amber-50/30 border p-4.5 rounded-2xl shadow-2xs relative overflow-hidden ${
            isCard2Active ? "border-amber-500 ring-2 ring-amber-500/15 bg-amber-50/40" : "border-slate-200 hover:border-amber-400 hover:shadow-xs"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 group-hover:text-amber-600 transition-colors">Awaiting Action</span>
            <Clock size={16} className={`transition-transform group-hover:scale-110 ${isCard2Active ? "text-amber-600" : "text-amber-500"}`} />
          </div>
          <div className="mt-2">
            <span className="text-2.5xl font-black text-slate-900 font-mono block leading-none">{pendingCount}</span>
            <span className="text-[10px] font-bold text-slate-500 block mt-1">Pending Gate-In Status</span>
          </div>
          {isCard2Active && (
            <div className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-amber-500 rounded-tl-lg" />
          )}
        </button>

        {/* Card 3: Collected Gate Fees */}
        <button
          type="button"
          onClick={() => {
            if (dashboardView === "marketplace") {
              setDashboardView("engagements");
            }
            setFilterStatus("All");
            setFilterPayment("Paid");
          }}
          className={`group hover:scale-[1.02] active:scale-98 transition-all duration-250 cursor-pointer text-left bg-gradient-to-br from-white to-emerald-50/30 border p-4.5 rounded-2xl shadow-2xs relative overflow-hidden ${
            isCard3Active ? "border-emerald-500 ring-2 ring-emerald-500/15 bg-emerald-50/40" : "border-slate-200 hover:border-emerald-400 hover:shadow-xs"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 group-hover:text-emerald-600 transition-colors">Collected Gate Fees</span>
            <BadgeDollarSign size={16} className={`transition-transform group-hover:scale-110 ${isCard3Active ? "text-emerald-600" : "text-emerald-500"}`} />
          </div>
          <div className="mt-2">
            <span className="text-2.5xl font-black text-emerald-750 font-mono block leading-none">
              {(gateFeePaidCount * 50000).toLocaleString()} Ush
            </span>
            <span className="text-[10px] font-bold text-slate-500 block mt-1">{gateFeePaidCount} Payments Paid @ 50k</span>
          </div>
          {isCard3Active && (
            <div className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-emerald-500 rounded-tl-lg" />
          )}
        </button>

        {/* Card 4: Traceable Registry */}
        <button
          type="button"
          onClick={() => {
            if (dashboardView === "marketplace") {
              setDashboardView("engagements");
            }
            setFilterStatus("All");
            setFilterPayment("All");
            setFilterAppointmentType("All");
            setSearchQuery("");
          }}
          className={`group hover:scale-[1.02] active:scale-98 transition-all duration-250 cursor-pointer text-left bg-gradient-to-br from-white to-purple-50/30 border p-4.5 rounded-2xl shadow-2xs relative overflow-hidden ${
            isCard4Active ? "border-purple-500 ring-2 ring-purple-500/15 bg-purple-50/40" : "border-slate-200 hover:border-purple-400 hover:shadow-xs"
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 group-hover:text-purple-600 transition-colors">Traceable Registry</span>
            <Activity size={16} className={`transition-transform group-hover:scale-110 ${isCard4Active ? "text-purple-600" : "text-purple-500"}`} />
          </div>
          <div className="mt-2">
            <span className="text-2.5xl font-black text-slate-900 font-mono block leading-none">{totalBooked}</span>
            <span className="text-[10px] font-bold text-slate-500 block mt-1">All Logged Transactions</span>
          </div>
          {isCard4Active && (
            <div className="absolute right-0 bottom-0 w-2.5 h-2.5 bg-purple-500 rounded-tl-lg" />
          )}
        </button>
      </div>

      {/* NEW PERSISTENT TAB SWITCHER */}
      <div className="bg-slate-100 p-1.5 rounded-2xl flex flex-wrap gap-2 shadow-inner border border-slate-200">
        <button
          type="button"
          onClick={() => {
            setDashboardView("engagements");
            setFilterAppointmentType("All");
          }}
          className={`flex-1 min-w-[150px] px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            dashboardView === "engagements"
              ? "bg-slate-900 text-white shadow-md font-extrabold"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
          }`}
        >
          <Calendar size={14} />
          <span>📅 Engagements & Visits ({bookings.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setDashboardView("consultancies");
            setFilterAppointmentType("Consultancy Service");
          }}
          className={`flex-1 min-w-[150px] px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            dashboardView === "consultancies"
              ? "bg-slate-900 text-white shadow-md font-extrabold"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
          }`}
        >
          <Briefcase size={14} />
          <span>💼 Consultancy Bookings ({bookings.filter(b => b.appointmentType === "Consultancy Service" || b.relatedConsultancy).length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setDashboardView("marketplace");
            setCheckoutStep("catalog");
          }}
          className={`flex-1 min-w-[150px] px-5 py-3 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            dashboardView === "marketplace"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-extrabold"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
          }`}
        >
          <ShoppingCart size={14} />
          <span>🛒 Live Marketplace Dashboard</span>
        </button>
      </div>

      {/* FILTER PANEL AND GRID */}
      {dashboardView === "marketplace" ? (
        <MarketplacePortal onBackToDashboard={() => setDashboardView("engagements")} />
      ) : false ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Marketplace header card */}
          <div className="bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border border-amber-200 p-6 rounded-3xl relative overflow-hidden">
            <div className="absolute right-0 top-0 transform translate-x-6 -translate-y-6 opacity-10 font-black text-9xl select-none">🛒</div>
            <div className="max-w-2xl relative z-10 space-y-2">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-amber-200">
                Live Fish Farm E-Commerce Portal
              </span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Biosecure Fingerlings & Premium Feed Store</h2>
              <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                Direct procurement for certified F1 monosex seed stock, high-conversion floating crumble nursery feeds, and professional grade testing reagents. Every shipment includes biosecure containment packaging.
              </p>
            </div>
          </div>

          {/* Sub-navigation & Cart Indicator */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex flex-wrap gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start">
              {["All", "Live Seed Stock", "Feeds & Formulation", "Testing & Diagnostics"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCheckoutStep("catalog");
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedCategory === cat && checkoutStep === "catalog"
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {checkoutStep !== "catalog" && (
                <button
                  onClick={() => setCheckoutStep("catalog")}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-705 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Product Catalog</span>
                </button>
              )}

              <button
                onClick={() => setCheckoutStep(checkoutStep === "cart" ? "catalog" : "cart")}
                className={`px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                  cart.length > 0 
                    ? "bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md animate-pulse" 
                    : "bg-slate-150 text-slate-400 border border-slate-205 cursor-not-allowed"
                }`}
                disabled={cart.length === 0}
              >
                <ShoppingBag size={14} />
                <span>Shopping Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                <span className="bg-slate-950 text-white text-[10px] font-mono px-1.5 py-0.5 rounded-md ml-1">
                  Ush {cart.reduce((sum, item) => {
                    const prod = marketplaceProducts.find(p => p.id === item.id);
                    return sum + (prod ? prod.price * item.quantity : 0);
                  }, 0).toLocaleString()}
                </span>
              </button>
            </div>
          </div>

          {/* MAIN WORKSPACE SPLIT */}
          {checkoutStep === "catalog" && (
            <div className="space-y-6">
              {/* Product catalog rendered in "flex square cards" */}
              <div className="flex flex-wrap gap-4 justify-start">
                {marketplaceProducts
                  .filter(p => selectedCategory === "All" || p.category === selectedCategory)
                  .map(prod => {
                    const cartItem = cart.find(item => item.id === prod.id);
                    return (
                      <div 
                        key={prod.id} 
                        className="flex-1 min-w-[260px] max-w-[310px] aspect-square border border-slate-200 bg-white hover:border-amber-500 hover:shadow-md transition-all rounded-3xl p-5 flex flex-col justify-between relative group shadow-xs cursor-pointer select-none"
                        onClick={() => setSelectedProd(prod)}
                      >
                        {/* Top section */}
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-[9px] uppercase font-bold text-amber-800 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md">
                              {prod.category}
                            </span>
                            <span className="text-[10px] font-bold text-slate-450 font-mono">
                              ⭐ {prod.rating}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-3xl filter drop-shadow-sm">{prod.emoji}</span>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
                                {prod.name}
                              </h4>
                              <span className="text-[9px] bg-sky-50 text-sky-850 font-bold px-1.5 py-0.5 rounded-sm inline-block mt-0.5">
                                {prod.badge}
                              </span>
                            </div>
                          </div>

                          <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold mt-2.5 line-clamp-2">
                            {prod.description}
                          </p>
                        </div>

                        {/* Bottom action bar inside card */}
                        <div className="border-t border-slate-100 pt-3 mt-auto flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold">Price per {prod.unit}</span>
                            <span className="text-xs font-black text-slate-900 font-mono text-amber-600">Ush {prod.price.toLocaleString()}</span>
                          </div>

                          {cartItem ? (
                            <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl px-1.5 py-1 gap-2">
                              <button
                                onClick={() => {
                                  if (cartItem.quantity <= prod.minOrder && prod.minOrder > 1) {
                                    // remove if drop below min order
                                    setCart(cart.filter(item => item.id !== prod.id));
                                  } else if (cartItem.quantity <= 1) {
                                    setCart(cart.filter(item => item.id !== prod.id));
                                  } else {
                                    setCart(cart.map(item => item.id === prod.id ? { ...item, quantity: item.quantity - (prod.minOrder > 1 ? 500 : 1) } : item));
                                  }
                                }}
                                className="w-5 h-5 bg-white border border-slate-200 hover:bg-slate-50 rounded-md flex items-center justify-center text-slate-600 font-extrabold text-xs cursor-pointer shadow-2xs"
                              >
                                -
                              </button>
                              <span className="text-xs font-black text-slate-800 font-mono">{cartItem.quantity.toLocaleString()}</span>
                              <button
                                onClick={() => {
                                  setCart(cart.map(item => item.id === prod.id ? { ...item, quantity: item.quantity + (prod.minOrder > 1 ? 500 : 1) } : item));
                                }}
                                className="w-5 h-5 bg-white border border-slate-200 hover:bg-slate-50 rounded-md flex items-center justify-center text-slate-600 font-extrabold text-xs cursor-pointer shadow-2xs"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setCart([...cart, { id: prod.id, quantity: prod.minOrder }]);
                              }}
                              className="bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black px-3.5 py-2 rounded-xl transition-all cursor-pointer shadow-xs active:scale-95"
                            >
                              Add ({prod.minOrder.toLocaleString()})
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* CART VIEW */}
          {checkoutStep === "cart" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column: Cart items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                      <ShoppingBag size={16} className="text-amber-500" />
                      <span>Review Your Procurements Basket</span>
                    </h3>
                    <button
                      onClick={() => setCart([])}
                      className="text-[10px] text-red-650 hover:text-red-700 font-black uppercase tracking-wider hover:bg-red-50 px-2.5 py-1.5 rounded-lg border border-red-100 transition cursor-pointer"
                    >
                      Clear All Selections
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {cart.map(item => {
                      const prod = marketplaceProducts.find(p => p.id === item.id);
                      if (!prod) return null;
                      return (
                        <div key={item.id} className="py-4 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <span className="text-3xl bg-slate-50 border border-slate-100 p-2 rounded-2xl block">{prod.emoji}</span>
                            <div>
                              <h4 className="text-xs font-black text-slate-900">{prod.name}</h4>
                              <span className="text-[10px] text-slate-400 font-bold justify-start">Category: {prod.category} • Price per {prod.unit}: Ush {prod.price.toLocaleString()}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-6">
                            <div className="flex items-center bg-slate-55 border border-slate-150 rounded-xl px-2 py-1 gap-2.5">
                              <button
                                onClick={() => {
                                  if (item.quantity <= prod.minOrder && prod.minOrder > 1) {
                                    setCart(cart.filter(i => i.id !== item.id));
                                  } else if (item.quantity <= 1) {
                                    setCart(cart.filter(i => i.id !== item.id));
                                  } else {
                                    setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity - (prod.minOrder > 1 ? 500 : 1) } : i));
                                  }
                                }}
                                className="w-6 h-6 bg-white border border-slate-200 rounded-md hover:bg-slate-100 flex items-center justify-center font-extrabold text-xs cursor-pointer shadow-2xs"
                              >
                                -
                              </button>
                              <span className="text-xs font-mono font-black text-slate-808">{item.quantity.toLocaleString()}</span>
                              <button
                                onClick={() => {
                                  setCart(cart.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (prod.minOrder > 1 ? 500 : 1) } : i));
                                }}
                                className="w-6 h-6 bg-white border border-slate-200 rounded-md hover:bg-slate-100 flex items-center justify-center font-extrabold text-xs cursor-pointer shadow-2xs"
                              >
                                +
                              </button>
                            </div>

                            <div className="text-right w-24">
                              <span className="text-xs font-black text-slate-900 font-mono block">Ush {(prod.price * item.quantity).toLocaleString()}</span>
                              <button
                                onClick={() => setCart(cart.filter(i => i.id !== item.id))}
                                className="text-[10px] font-bold text-slate-400 hover:text-red-655 transition cursor-pointer mt-0.5 hover:underline"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Checkout Info */}
              <div className="space-y-4">
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="text-xs font-black text-slate-900 tracking-wider uppercase border-b pb-3">Order Checkout Summary</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Gross Procurement Subtotal:</span>
                      <span className="font-mono text-slate-800">Ush {cart.reduce((sum, item) => sum + (marketplaceProducts.find(p => p.id === item.id)?.price || 0) * item.quantity, 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Bio-secure Container Packing:</span>
                      <span className="font-mono text-emerald-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-xs font-semibold text-slate-500">
                      <span>Estimated Value Added Tax (18%):</span>
                      <span className="font-mono text-slate-800">Ush {Math.floor(cart.reduce((sum, item) => sum + (marketplaceProducts.find(p => p.id === item.id)?.price || 0) * item.quantity, 0) * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-black text-slate-900">
                      <span>Total Invoice Due:</span>
                      <span className="font-mono text-amber-600">Ush {Math.floor(cart.reduce((sum, item) => sum + (marketplaceProducts.find(p => p.id === item.id)?.price || 0) * item.quantity, 0) * 1.18).toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setCheckoutStep("payment");
                        setCheckoutName(bookings[0]?.customerName || "Jalon Kibwola");
                        setCheckoutPhone(bookings[0]?.contactInfo || "0771234567");
                      }}
                      className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition cursor-pointer shadow-md text-center inline-block active:scale-95"
                    >
                      Proceed to Integrated Payment Gateway →
                    </button>
                    <p className="text-[10px] text-center text-slate-400 font-bold mt-2.5">
                      🔒 Transactions are secured via AAA Biosecure protocol standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHECKOUT & PAYMENTS GATEWAY STEP */}
          {checkoutStep === "payment" && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Left Side: Information Collection & Payment methods selection */}
              <div className="lg:col-span-3 space-y-6">
                
                {/* 1) Delivery Mode selection */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded-full">1</span>
                    <span>Order Dispatch Preferential Profile</span>
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setCheckoutType("pickup")}
                      className={`p-4 border-2 rounded-2xl text-left transition cursor-pointer ${
                        checkoutType === "pickup"
                          ? "border-amber-500 bg-amber-50/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <span>🚜 On-Farm Pickup</span>
                      </h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                        Ready in 24 hours. Free transport boxing & oxygen saturation included.
                      </p>
                    </button>

                    <button
                      onClick={() => setCheckoutType("delivery")}
                      className={`p-4 border-2 rounded-2xl text-left transition cursor-pointer ${
                        checkoutType === "delivery"
                          ? "border-amber-500 bg-amber-50/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <span>🚚 Express dispatch</span>
                      </h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-1 leading-relaxed">
                        Ship anywhere in Uganda via our temperature controlled, aerated tankers.
                      </p>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Recipient Full Name</label>
                      <input
                        type="text"
                        value={checkoutName}
                        onChange={(e) => setCheckoutName(e.target.value)}
                        placeholder="e.g. Kibwola recxpats"
                        className="w-full text-xs font-bold border border-slate-200 bg-slate-50 rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:bg-white focus:ring-0 outline-hidden"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Recipient Mobile Contact Phone</label>
                      <input
                        type="text"
                        value={checkoutPhone}
                        onChange={(e) => setCheckoutPhone(e.target.value)}
                        placeholder="e.g. 0771234567"
                        className="w-full text-xs font-bold border border-slate-200 bg-slate-50 rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:bg-white focus:ring-0 outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Special Handling/Aeration Instructions</label>
                    <textarea
                      value={checkoutNotes}
                      onChange={(e) => setCheckoutNotes(e.target.value)}
                      rows={2}
                      placeholder="e.g. Keep transport aerator active, delivery to Jinja district fish pond fish farm..."
                      className="w-full text-xs font-semibold border border-slate-200 bg-slate-50 rounded-2xl px-3.5 py-2.5 focus:border-amber-500 focus:bg-white focus:ring-0 outline-hidden"
                    />
                  </div>
                </div>

                {/* 2) Integrated Payment Gateway Selection */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="bg-slate-900 text-white text-[10px] font-mono px-2 py-0.5 rounded-full">2</span>
                    <span>Integrated Payments Gateway Selection</span>
                  </h3>

                  {/* Payment Gateway Tabs */}
                  <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    <button
                      onClick={() => setPaymentMethod("mobile_money")}
                      className={`py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        paymentMethod === "mobile_money"
                          ? "bg-white text-slate-950 shadow-xs"
                          : "text-slate-505 hover:text-slate-800"
                      }`}
                    >
                      📱 Mobile Money
                    </button>
                    <button
                      onClick={() => setPaymentMethod("credit_card")}
                      className={`py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        paymentMethod === "credit_card"
                          ? "bg-white text-slate-955 shadow-xs"
                          : "text-slate-505 hover:text-slate-800"
                      }`}
                    >
                      💳 Card Payment
                    </button>
                    <button
                      onClick={() => setPaymentMethod("wallet")}
                      className={`py-2 rounded-xl text-center text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer transition ${
                        paymentMethod === "wallet"
                          ? "bg-white text-slate-955 shadow-xs"
                          : "text-slate-505 hover:text-slate-800"
                      }`}
                    >
                      🌐 Digital Wallet
                    </button>
                  </div>

                  {/* Payment Gateways forms */}
                  <div className="bg-slate-50 border border-slate-150 p-5 rounded-2xl">
                    {paymentMethod === "mobile_money" && (
                      <div className="space-y-4">
                        <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl">
                          <p className="text-[10px] text-amber-900 leading-relaxed font-bold">
                            Supports instant telecom push notifications in Uganda. Enter phone contact below to prompt dynamic PIN authorize screen.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Telecom Carrier</label>
                            <select
                              value={mmProvider}
                              onChange={(e) => setMmProvider(e.target.value)}
                              className="w-full text-xs font-bold border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:ring-0 cursor-pointer"
                            >
                              <option value="MTN Mobile MoneyUganda">MTN Mobile Money (Uganda)</option>
                              <option value="Airtel Money Uganda">Airtel Money (Uganda)</option>
                              <option value="M-Pesa East Africa">M-Pesa (East Africa)</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Mobile Money Number</label>
                            <input
                              type="text"
                              value={mmNumber}
                              onChange={(e) => setMmNumber(e.target.value)}
                              placeholder="e.g. 0772000111"
                              className="w-full text-xs font-bold border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:ring-0 outline-hidden"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "credit_card" && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Cardholder Full Name</label>
                          <input
                            type="text"
                            value={cardHolder}
                            onChange={(e) => setCardHolder(e.target.value)}
                            placeholder="e.g. JALON KIBWOLA"
                            className="w-full text-xs font-bold border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:ring-0 outline-hidden"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 sm:col-span-1 space-y-1">
                            <label className="text-[10px] font-extrabold uppercase text-slate-400 block">16 Digit Credit Card Number</label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              placeholder="4000 1234 5678 9010"
                              className="w-full text-xs font-bold border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:ring-0 outline-hidden"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Expiry (MM/YY)</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="12/28"
                              className="w-full text-xs font-bold border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:ring-0 outline-hidden"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Security CVV Code</label>
                            <div className="relative">
                              <input
                                type={showCardCvv ? "text" : "password"}
                                value={cardCvv}
                                onChange={(e) => setCardCvv(e.target.value)}
                                maxLength={3}
                                placeholder="•••"
                                className="w-full text-xs font-bold border border-slate-200 bg-white rounded-xl pl-3.5 pr-10 py-2.5 focus:border-amber-500 focus:ring-0 outline-hidden"
                              />
                              <button
                                type="button"
                                onClick={() => setShowCardCvv(!showCardCvv)}
                                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                                title={showCardCvv ? "Hide CVV" : "Show CVV"}
                              >
                                {showCardCvv ? <EyeOff size={14} /> : <Eye size={14} />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === "wallet" && (
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-extrabold uppercase text-slate-400 block">Chipper Cash or PayPal Identifier</label>
                          <input
                            type="text"
                            value={walletId}
                            onChange={(e) => setWalletId(e.target.value)}
                            placeholder="e.g. @kibwolaFishFarm or pay@example.com"
                            className="w-full text-xs font-bold border border-slate-200 bg-white rounded-xl px-3.5 py-2.5 focus:border-amber-500 focus:ring-0 outline-hidden"
                          />
                        </div>
                        <p className="text-[10px] text-slate-450 font-semibold leading-relaxed">
                          Secure wallet callback redirects you automatically to authorize payment. Zero local fees applies.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Total summary & Authorize button */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white border border-slate-250 rounded-3xl p-6 shadow-xs space-y-5">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest border-b pb-3">Final Procurement Invoice</h3>

                  <div className="space-y-2.5">
                    {cart.map(item => {
                      const prod = marketplaceProducts.find(p => p.id === item.id);
                      if (!prod) return null;
                      return (
                        <div key={item.id} className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-700 truncate max-w-[180px]">{prod.emoji} {prod.name}</span>
                          <span className="font-mono text-slate-500 text-[11px] shrink-0">({item.quantity} units) Ush {(prod.price * item.quantity).toLocaleString()}</span>
                        </div>
                      );
                    })}

                    <div className="border-t border-slate-100 pt-3 space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-500 font-semibold">
                        <span>Items Subtotal:</span>
                        <span className="font-mono text-slate-750">Ush {cart.reduce((sum, item) => sum + (marketplaceProducts.find(p => p.id === item.id)?.price || 0) * item.quantity, 0).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 font-semibold">
                        <span>Delivery Service:</span>
                        <span className="font-mono text-emerald-600 font-bold">{checkoutType === "pickup" ? "FREE PICKUP" : "Ush 50,000"}</span>
                      </div>
                      <div className="flex justify-between text-xs text-slate-500 font-semibold">
                        <span>Uganda VAT Tax (18%):</span>
                        <span className="font-mono text-slate-750">Ush {Math.floor(cart.reduce((sum, item) => sum + (marketplaceProducts.find(p => p.id === item.id)?.price || 0) * item.quantity, 0) * 0.18).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-3.5 flex justify-between text-sm font-black text-slate-900">
                      <span>Invoice Total:</span>
                      <span className="font-mono text-amber-605 text-base">
                        Ush {(
                          cart.reduce((sum, item) => sum + (marketplaceProducts.find(p => p.id === item.id)?.price || 0) * item.quantity, 0) * 1.18 + 
                          (checkoutType === "delivery" ? 50000 : 0)
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {paymentPr ? (
                      <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-2xl text-center space-y-3">
                        <div className="relative w-12 h-12 mx-auto animate-spin">
                          <div className="absolute inset-0 border-4 border-amber-200 rounded-full"></div>
                          <div className="absolute inset-x-0 top-0 bottom-0 border-4 border-amber-500 rounded-full border-t-transparent"></div>
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-xs font-black text-slate-800">Processing Secure Transaction...</h5>
                          <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                            {paymentProgress < 30 && "Securing biosecure warehouse items..."}
                            {paymentProgress >= 30 && paymentProgress < 75 && "Transmitting handshake to Telecom/Bank node..."}
                            {paymentProgress >= 75 && "Compiling and spawning scheduling appointments..."}
                          </p>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-amber-500 h-1.5 transition-all duration-300" style={{ width: `${paymentProgress}%` }}></div>
                        </div>
                        <span className="text-[10px] font-mono font-black text-slate-450">{paymentProgress}% Completed</span>
                      </div>
                    ) : (
                      <button
                        onClick={async () => {
                          if (!checkoutName || !checkoutPhone) {
                            alert("Please provide the Recipient Full Name & Contact Phone to allow dispatch routing!");
                            return;
                          }
                          if (paymentMethod === "mobile_money" && !mmNumber) {
                            alert("Kindly enter your Mobile Money Number to authorize push PIN prompt.");
                            return;
                          }
                          if (paymentMethod === "credit_card" && (!cardNumber || !cardCvv)) {
                            alert("Kindly provide valid Credit Card credentials to authorize clearance.");
                            return;
                          }

                          // Trigger simulated payment flow
                          setPaymentPr(true);
                          setPaymentProgress(10);
                          const orderNo = `AAA-${Math.floor(10050 + Math.random() * 88900)}`;

                          // Stagger percentages
                          const interval = setInterval(() => {
                            setPaymentProgress(prev => {
                              if (prev >= 95) {
                                clearInterval(interval);
                                return 100;
                              }
                              return prev + Math.floor(15 + Math.random() * 20);
                            });
                          }, 450);

                          setTimeout(async () => {
                            clearInterval(interval);
                            setPaymentProgress(100);

                            // Construct descriptions of items
                            const subDescription = cart.map(item => {
                              const p = marketplaceProducts.find(x => x.id === item.id);
                              return `${p ? p.name : item.id} (Qty: ${item.quantity.toLocaleString()})`;
                            }).join(", ");

                            const finalNotes = `Order Reference ID: ${orderNo} • Via ${paymentMethod.toUpperCase()}.\nSpecial Handling: ${checkoutNotes || "None"}`;

                            // Create the related booking on-farm or dispatcher!
                            try {
                              const deliveryOrPickupDesc = checkoutType === "delivery" ? "Delivery Dispatch" : "On-Farm Pickup";
                              await onAddRecord("appointments", {
                                customerName: checkoutName,
                                customersName: `${checkoutName} (Fish Farm Procurements Order)`,
                                transportMode: "Car",
                                contactInfo: checkoutPhone,
                                appointmentType: "Fingerlings Order",
                                relatedFishSales: subDescription,
                                relatedConsultancy: "",
                                dateTime: `${new Date(Date.now() + 86400000).toISOString().split('T')[0]} 11:30`, // Scheduled for tomorrow morning
                                status: "Scheduled",
                                staffAssigned: "Warehouse Despatch Chief",
                                notes: finalNotes,
                                followUpRequired: true,
                                followUpDetails: `Fulfill order dispatch. Delivery preference: ${deliveryOrPickupDesc}. Phone: ${checkoutPhone}`,
                                vehiclePlate: checkoutType === "pickup" ? "PICKUP-T" : "DELIV-E",
                                gateFeePayment: "Paid",
                                biosecurityStatus: "Protocol Followed",
                                healthEnvManagement: "Bio-containment container checked & sealed under supervisor supervision."
                              });

                              setLastOrder({
                                orderNo,
                                invoiceTotal: cart.reduce((sum, item) => sum + (marketplaceProducts.find(p => p.id === item.id)?.price || 0) * item.quantity, 0) * 1.18 + (checkoutType === "delivery" ? 50000 : 0),
                                name: checkoutName,
                                phone: checkoutPhone,
                                method: paymentMethod,
                                date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
                                details: subDescription,
                                pickupType: checkoutType === "pickup" ? "🚜 On-Farm Pickup Scheduled" : "🚚 Express Home/Farm Delivery Scheduled",
                                items: [...cart]
                              });

                              setCart([]); // Clear Cart
                              setPaymentPr(false);
                              setCheckoutStep("success");
                            } catch (err) {
                              setPaymentPr(false);
                              alert("Order went through successfully but calendar synchronization timed out. It is still authorized!");
                            }
                          }, 3200);
                        }}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all cursor-pointer shadow-md text-center block active:scale-95 text-center justify-center items-center"
                      >
                        Authorize Payment & Complete Booking ✓
                      </button>
                    )}

                    <button
                      onClick={() => setCheckoutStep("cart")}
                      disabled={paymentPr}
                      className="w-full mt-2.5 py-3 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 font-bold text-xs rounded-2xl transition cursor-pointer text-center block"
                    >
                      ← Back to Basket
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUCCESS INVOICE RECEIPT MODAL TAB */}
          {checkoutStep === "success" && lastOrder && (
            <div className="max-w-2xl mx-auto bg-white border-2 border-emerald-300 rounded-3xl overflow-hidden shadow-2xl p-6 md:p-8 space-y-6 animate-in zoom-in-95">
              
              <div className="text-center space-y-3">
                <div className="bg-emerald-100 text-emerald-805 w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-inner border border-emerald-250">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Direct Procurement Completed!</h3>
                <p className="text-xs text-emerald-700 font-bold">
                  Sovereign digital payment authorized successfully. Synchronized live to appointments calendar!
                </p>
              </div>

              {/* High-fidelity Receipt box */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4 relative font-mono text-xs">
                <div className="flex justify-between font-black text-slate-905 uppercase text-[10px] border-b pb-3">
                  <span>RecXpats recxpats Fish Farm</span>
                  <span>Invoice Receipt</span>
                </div>

                <div className="grid grid-cols-2 gap-y-2 text-slate-650">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 font-sans uppercase block">Invoice Reference</span>
                    <span className="font-bold text-slate-850">{lastOrder.orderNo}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 font-sans uppercase block">Date Processed</span>
                    <span className="font-bold text-slate-850">{lastOrder.date}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 font-sans uppercase block">Order Dispatched To</span>
                    <span className="font-bold text-slate-850">{lastOrder.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 font-sans uppercase block">Gateway Method</span>
                    <span className="font-extrabold text-blue-700">{lastOrder.method.toUpperCase()} SECURE</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-slate-200 my-3"></div>

                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 font-sans uppercase block">Procured Biosecure items</span>
                  {lastOrder.items.map((item: any, i: number) => {
                    const pr = marketplaceProducts.find(x => x.id === item.id);
                    return (
                      <div key={i} className="flex justify-between text-[11px]">
                        <span>{pr ? pr.emoji : "📦"} {pr ? pr.name : item.id} (x{item.quantity.toLocaleString()})</span>
                        <span className="font-bold text-slate-800">Ush {((pr ? pr.price : 0) * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-dashed border-slate-200 my-3"></div>

                <div className="flex justify-between items-center text-slate-900 font-black text-sm pt-1">
                  <span>Grand Total Paid:</span>
                  <span className="text-amber-600">Ush {lastOrder.invoiceTotal.toLocaleString()}</span>
                </div>

                <div className="bg-emerald-50 text-emerald-805 p-3 rounded-xl text-center text-[10px] font-sans font-bold border border-emerald-100">
                  {lastOrder.pickupType}. Sourced tomorrow! Our logistics chief is notified. Look for this order on your Engagements Log dashboard.
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    setCheckoutStep("catalog");
                    setDashboardView("engagements");
                  }}
                  className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer text-center block animate-in fade-in"
                >
                  View Engagements Log 📅
                </button>
                <button
                  onClick={() => setCheckoutStep("catalog")}
                  className="flex-1 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-705 font-black text-xs uppercase tracking-wider rounded-xl transition cursor-pointer text-center block animate-in fade-in"
                >
                  Return to Store 🛒
                </button>
              </div>

            </div>
          )}

          {/* GRANULAR PRODUCT SPEC SHEET DETAILED MODAL */}
          {selectedProd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
              <div className="w-full max-w-lg bg-white rounded-3xl border border-amber-200 shadow-2xl p-6 md:p-8 flex flex-col gap-5 max-h-[85vh] overflow-y-auto animate-in zoom-in-95">
                <div className="flex items-start justify-between border-b pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl bg-slate-50 p-2.5 rounded-2xl block border border-slate-100">{selectedProd.emoji}</span>
                    <div>
                      <span className="text-[9px] uppercase font-black text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        {selectedProd.category}
                      </span>
                      <h3 className="text-base font-black text-slate-900 tracking-tight mt-1">{selectedProd.name}</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProd(null)}
                    className="hover:bg-slate-100 p-2 rounded-xl text-slate-400 hover:text-slate-700 transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider">Product Core Profile</span>
                    <p className="text-xs text-slate-600 font-semibold leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {selectedProd.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Fish Farm Stock Levels</span>
                      <p className="text-xs font-black text-slate-800 mt-0.5">🐟 {selectedProd.stock.toLocaleString()} units ready</p>
                    </div>

                    <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      <span className="text-[9px] text-slate-400 font-extrabold uppercase block">Minimum Order Rate</span>
                      <p className="text-xs font-black text-slate-800 mt-0.5">📦 Min: {selectedProd.minOrder.toLocaleString()} {selectedProd.unit}</p>
                    </div>

                    <div className="col-span-2 bg-amber-50/50 p-4.5 rounded-xl border border-amber-100">
                      <span className="text-[9px] text-amber-900 font-extrabold uppercase tracking-wider block">Bio-Security & Performance Specification</span>
                      <p className="text-xs text-amber-950 font-semibold mt-1 leading-relaxed">
                        {selectedProd.details}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 flex gap-3">
                  <button
                    onClick={() => setSelectedProd(null)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold transition"
                  >
                    Close Sheet
                  </button>
                  <button
                    onClick={() => {
                      const alreadyInCart = cart.find(i => i.id === selectedProd.id);
                      if (alreadyInCart) {
                        setCart(cart.map(i => i.id === selectedProd.id ? { ...i, quantity: i.quantity + (selectedProd.minOrder > 1 ? 500 : 1) } : i));
                      } else {
                        setCart([...cart, { id: selectedProd.id, quantity: selectedProd.minOrder }]);
                      }
                      setSelectedProd(null);
                    }}
                    className="flex-1 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
                  >
                    Add {selectedProd.minOrder.toLocaleString()} to Basket
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        
        {/* CONTROLS BAR */}
        <div className="p-4 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-50/40">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Status Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Status:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent border-0 focus:ring-0 p-0 cursor-pointer"
              >
                <option value="All">All statuses</option>
                {statusOptions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Appointment Type Dropdown - locked or selectable depending on view */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-xl">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">Type:</span>
              <select
                disabled={dashboardView === "consultancies"}
                value={filterAppointmentType}
                onChange={(e) => setFilterAppointmentType(e.target.value)}
                className="text-xs font-bold text-slate-700 bg-transparent border-0 focus:ring-0 p-0 cursor-pointer max-w-[150px] truncate disabled:opacity-75"
              >
                {dashboardView === "consultancies" ? (
                  <option value="Consultancy Service">Consultancy Service</option>
                ) : (
                  <>
                    <option value="All">All types</option>
                    {appointmentTypes.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </>
                )}
              </select>
            </div>

            {/* Clear Filters Button */}
            {(filterStatus !== "All" || filterPayment !== "All" || (dashboardView !== "consultancies" && filterAppointmentType !== "All") || searchQuery !== "") && (
              <button
                onClick={() => {
                  setFilterStatus("All");
                  setFilterPayment("All");
                  if (dashboardView !== "consultancies") {
                    setFilterAppointmentType("All");
                  }
                  setSearchQuery("");
                }}
                className="text-xs text-sky-600 hover:text-sky-800 font-bold hover:underline"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="relative w-full lg:max-w-xs">
            <Search size={14} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder={dashboardView === "consultancies" ? "Search expert bookings, notes..." : "Search name, notes, vehicle..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500 placeholder:text-slate-400"
            />
          </div>

        </div>

        {/* RESULTS TABLE */}
        <div className="overflow-x-auto">
          {dashboardView === "consultancies" ? (
            /* 1) CONSULTANCY SERVICE BOOKINGS TRACKER VIEW */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-black text-slate-500 tracking-wider bg-slate-50/40">
                  <th className="px-6 py-4">Client Identifiers & Contact</th>
                  <th className="px-6 py-4">Consultancy Service Details</th>
                  <th className="px-6 py-4">Required Diagnostics & Follow-ups</th>
                  <th className="px-6 py-4">Date & Scheduled Time</th>
                  <th className="px-6 py-4 text-center">Assigned Advisor</th>
                  <th className="px-6 py-4 text-center">Appointment Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((bk) => {
                    const servicesList = bk.relatedConsultancy 
                      ? bk.relatedConsultancy.split(", ").filter(x => x)
                      : [bk.appointmentType || "Consultancy Service"];
                    return (
                      <tr key={bk.id} className="hover:bg-amber-50/5/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-slate-900">{bk.customersName || "N/A Group"}</div>
                          <div className="text-[11px] font-medium text-slate-600 mt-0.5">{bk.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                            <Phone size={10} />
                            <span>{bk.contactInfo || "No phone"}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1.5 max-w-[240px]">
                            {servicesList.map((srv, idx) => (
                              <span key={idx} className="bg-amber-50 text-amber-850 px-2.5 py-0.5 rounded text-[10px] border border-amber-200/50 font-bold leading-tight">
                                💼 {srv}
                              </span>
                            ))}
                          </div>
                          {bk.notes && (
                            <p className="text-[10px] text-slate-500 italic mt-1.5 truncate max-w-[240px]" title={bk.notes}>
                              Ref: "{bk.notes}"
                            </p>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="max-w-[260px] space-y-1">
                            <div className="flex items-center gap-1.5">
                              {bk.followUpRequired ? (
                                <span className="bg-amber-100 text-amber-800 text-[9px] px-1.5 py-0.5 rounded font-black flex items-center gap-0.5 border border-amber-300">
                                  ⚠️ Follow-up Required
                                </span>
                              ) : (
                                <span className="bg-slate-100 text-slate-500 text-[9px] px-1.5 py-0.5 rounded font-bold">
                                  No follow-up activity scheduled
                                </span>
                              )}
                            </div>
                            {bk.followUpDetails && (
                              <div className="text-[10px] text-slate-500 font-medium italic bg-slate-50/60 p-2 border border-slate-100 rounded-lg">
                                {bk.followUpDetails}
                              </div>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 font-mono text-[11px] text-slate-700">
                          {bk.dateTime || "N/A"}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <div className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg text-[10.5px] font-bold">
                            <span>🧪</span>
                            <span>{bk.staffAssigned || "Unassigned"}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-tight block max-w-[100px] mx-auto text-center ${
                            bk.status === "Scheduled"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : bk.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : bk.status === "No Show"
                              ? "bg-rose-50 text-rose-700 border border-rose-100"
                              : "bg-slate-50 text-slate-700 border border-slate-100"
                          }`}>
                            {bk.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedBooking(bk)}
                              className="p-1 px-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 text-[10px] font-semibold transition"
                              title="Quick details view"
                            >
                              Details
                            </button>
                            
                            <button
                              onClick={() => handleEditClick(bk)}
                              className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition cursor-pointer"
                              title="Edit consultancy details"
                            >
                              <Edit3 size={13} />
                            </button>

                            <button
                              onClick={() => {
                                if (bk.id && confirm("Are you sure you want to delete this booking?")) {
                                  onDeleteRecord("appointments", bk.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-650 hover:bg-rose-100 transition cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-slate-400 bg-slate-50/10">
                      <p className="font-extrabold text-slate-600 text-sm">No consultancy bookings found matching details.</p>
                      <p className="text-[11px] mt-1 text-slate-400">Click some other filter status, or tap "Contact Us" to register a case file.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            /* 2) CUSTOMER APPOINTMENTS AND ENGAGEMENTS OVERVIEW VIEW */
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] uppercase font-black text-slate-450 tracking-wider bg-slate-50/20">
                  <th className="px-6 py-3.5">Customer Name / Contact</th>
                  <th className="px-6 py-3.5">Transport & Plate</th>
                  <th className="px-6 py-3.5">Engagement Visit Type & Sale Sourcing</th>
                  <th className="px-6 py-3.5">Date & Scheduled Time</th>
                  <th className="px-6 py-3.5 text-center">Assigned Staff</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                  <th className="px-6 py-3.5 text-center">Biosecurity</th>
                  <th className="px-6 py-3.5 text-center">Gate-Fee</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 text-xs">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((bk) => {
                    return (
                      <tr key={bk.id} className="hover:bg-sky-50/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-extrabold text-slate-900">{bk.customersName || "N/A Group"}</div>
                          <div className="text-[11px] font-medium text-slate-600 mt-0.5">Contact: {bk.customerName}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5 flex items-center gap-1">
                            <Phone size={10} />
                            <span>{bk.contactInfo || "No phone"}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-700 flex items-center gap-1">
                            <Car size={12} className="text-slate-400" />
                            <span>{bk.transportMode}</span>
                          </div>
                          {bk.vehiclePlate && (
                            <div className="text-[9px] font-mono uppercase bg-slate-100 text-slate-650 px-1.5 py-0.5 rounded font-black mt-1 inline-block">
                              {bk.vehiclePlate}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-800">{bk.appointmentType}</div>
                          {bk.relatedFishSales && (
                            <div className="text-[9px] font-bold text-teal-655 tracking-tight mt-0.5">
                              🐟 {bk.relatedFishSales}
                            </div>
                          )}
                        </td>

                        <td className="px-6 py-4 font-mono text-[11px] text-slate-600">
                          {bk.dateTime || "N/A"}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                            {bk.staffAssigned || "Manager"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-tight block max-w-[100px] mx-auto text-center ${
                            bk.status === "Scheduled"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : bk.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border border-amber-100"
                              : bk.status === "No Show"
                              ? "bg-rose-50 text-rose-700 border border-rose-100"
                              : "bg-slate-50 text-slate-700 border border-slate-100"
                          }`}>
                            {bk.status}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold block max-w-[120px] mx-auto ${
                            bk.biosecurityStatus === "Protocol Followed"
                              ? "bg-green-100/50 text-emerald-800"
                              : bk.biosecurityStatus === "Protocol Not Followed"
                              ? "bg-rose-100/60 text-red-800 border border-red-200"
                              : "bg-amber-100/60 text-amber-800"
                          }`}>
                            {bk.biosecurityStatus || "Not Checked"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-center">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono leading-none ${
                            bk.gateFeePayment === "Paid" 
                              ? "text-emerald-600 bg-emerald-50 font-bold" 
                              : "text-rose-600 bg-rose-50 font-bold"
                          }`}>
                            {bk.gateFeePayment || "Not Paid"}
                          </span>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedBooking(bk)}
                              className="p-1 px-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 text-[10px] font-semibold transition"
                              title="Quick details view"
                            >
                              Details
                            </button>
                            
                            <button
                              onClick={() => handleEditClick(bk)}
                              className="p-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 transition cursor-pointer"
                              title="Edit schedule record"
                            >
                              <Edit3 size={13} />
                            </button>

                            <button
                              onClick={() => {
                                if (bk.id && confirm("Are you sure you want to delete this booking?")) {
                                  onDeleteRecord("appointments", bk.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-rose-50 text-rose-650 hover:bg-rose-100 transition cursor-pointer"
                              title="Delete record"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center py-12 text-slate-400">
                      <p className="font-semibold text-slate-500">No appointments match your filter selection.</p>
                      <p className="text-[11px] mt-0.5">Try widening your search terms or register a brand-new appointment booking.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
      )}

      {/* QUICK DETAILS MODEL DRAWER */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-sky-100 shadow-2xl p-6 md:p-8 flex flex-col gap-6 max-h-[85vh] overflow-y-auto animate-in zoom-in-95">
            
            <div className="flex items-start justify-between border-b pb-4">
              <div>
                <span className="text-[9px] uppercase font-bold tracking-widest text-cyan-600 block">Airtable Data Sheet</span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">{selectedBooking.customersName || "N/A Group"}</h3>
                <span className="text-[11px] font-semibold text-slate-700 block mt-0.5">Contact Rep: {selectedBooking.customerName}</span>
                <span className="text-[10px] text-slate-450 block mt-0.5">Contact Phone: {selectedBooking.contactInfo}</span>
              </div>
              
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-xl transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-medium">
              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Transport Mode</span>
                <p className="text-slate-800 text-sm mt-0.5">{selectedBooking.transportMode}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Vehicle Plate</span>
                <p className="text-slate-800 text-sm font-mono mt-0.5">{selectedBooking.vehiclePlate || "N/A"}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Appointment Type</span>
                <p className="text-slate-850 font-bold mt-0.5">{selectedBooking.appointmentType}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Arrival Date & Time</span>
                <p className="text-slate-800 mt-0.5 font-mono">{selectedBooking.dateTime}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Assigned Staff</span>
                <p className="text-slate-800 mt-0.5 flex items-center gap-1">
                  <UserCheck size={12} className="text-sky-500" />
                  <span>{selectedBooking.staffAssigned || "No staff assigned"}</span>
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Gate fee payment</span>
                <p className="mt-0.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono ${selectedBooking.gateFeePayment === "Paid" ? "bg-emerald-50 text-emerald-600 font-bold" : "bg-red-50 text-red-650"}`}>
                    {selectedBooking.gateFeePayment}
                  </span>
                </p>
              </div>

              <div className="col-span-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Related Fish Sourcing</span>
                <p className="text-emerald-700 font-bold mt-0.5">🐟 {selectedBooking.relatedFishSales || "None"}</p>
              </div>

              {selectedBooking.relatedConsultancy && (
                <div className="col-span-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-bold">Related Consultancy Services Requested</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {selectedBooking.relatedConsultancy.split(", ").map((c, i) => (
                      <span key={i} className="bg-sky-50 text-sky-850 text-[10px] font-semibold px-2 py-0.5 rounded border border-sky-100">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="col-span-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-black">Purpose / Detailed operational Notes</span>
                <p className="text-slate-700 text-xs mt-1 leading-relaxed font-semibold italic">"{selectedBooking.notes || "No extra purpose notes registered."}"</p>
              </div>

              {selectedBooking.followUpRequired && (
                <div className="col-span-2 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <span className="text-[10px] text-amber-700 uppercase tracking-wider block font-black flex items-center gap-1">
                    <AlertTriangle size={12} />
                    <span>Follow Up Guidelines Required</span>
                  </span>
                  <p className="text-slate-700 text-xs mt-1 font-semibold">{selectedBooking.followUpDetails || "Action pending details"}</p>
                </div>
              )}

              {selectedBooking.aiAnalysis && (
                <div className="col-span-2 bg-cyan-950 text-cyan-200 p-4 rounded-2xl border border-cyan-800">
                  <span className="text-[9px] text-cyan-400 uppercase tracking-widest block font-black flex items-center gap-1.5 mb-1">
                    <Sparkles size={11} className="text-cyan-400 animate-pulse" />
                    <span>RecXpats AI Risk Analysis Response</span>
                  </span>
                  <p className="text-[11px] font-mono leading-relaxed font-semibold">{selectedBooking.aiAnalysis}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t pt-4">
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  handleEditClick(selectedBooking);
                }}
                className="px-4 py-2 bg-slate-150 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Modify Record
              </button>
              
              <button
                onClick={() => setSelectedBooking(null)}
                className="px-5 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Dismiss Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* COMPREHENSIVE ADD / EDIT FORM MODAL CONTAINER */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-sky-100 shadow-2xl p-6 md:p-8 flex flex-col gap-5 max-h-[92vh] overflow-y-auto my-4 animate-in zoom-in-95">
            
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-emerald-600 font-black text-[9px] uppercase tracking-wider block">RecXpats Breeder OS Registry</span>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                  {editingBooking ? "Edit Appointment Sheet & Audit" : "Create New recxpats Reservation"}
                </h3>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-black cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              
              {/* PRIMARY CREDENTIALS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Customer's Name (Company/Group)</label>
                  <div className="relative">
                    <Briefcase size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Koma recxpats Ltd"
                      value={customersName}
                      onChange={(e) => setCustomersName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Customer Name (Contact Person)</label>
                  <div className="relative">
                    <User size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Contact Information (Phone)</label>
                  <div className="relative">
                    <Phone size={13} className="absolute left-3.5 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 0700000001"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

              </div>

              {/* LOGISTICS SECTION */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-150">
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-500 block">Transport Mode</label>
                  <select
                    value={transportMode}
                    onChange={(e) => setTransportMode(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    {transportOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-500 block">Vehicle No. Plate</label>
                  <input
                    type="text"
                    placeholder="e.g. UBC 900C"
                    value={vehiclePlate}
                    onChange={(e) => setVehiclePlate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-500 block">Biosecurity Status</label>
                  <select
                    value={biosecurityStatus}
                    onChange={(e) => setBiosecurityStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    {biosecurityOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* SCHEDULING SPECIFICS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Arrival Time (HH:MM)</label>
                  <input
                    type="text"
                    placeholder="e.g. 15:00"
                    value={appointmentTime}
                    onChange={(e) => setAppointmentTime(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Specify the Staff to be assigned for your visit.</label>
                  <select
                    value={staffAssigned}
                    onChange={(e) => setStaffAssigned(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    {staffOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* CORE CATEGORIES & TYPES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Appointment Category Mode</label>
                  <select
                    value={appointmentType}
                    onChange={(e) => setAppointmentType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    {appointmentTypes.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Related Fish Sales Sourcing</label>
                  <select
                    value={relatedFishSales}
                    onChange={(e) => setRelatedFishSales(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    {fishSalesOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* RELATED CONSULTANCY SERVICES MULTI-SELECT CHECKBOXES */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black text-slate-500 block">Related Consultancy Services Required</label>
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl max-h-36 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {consultancyServices.map((service) => {
                    const isChecked = selectedConsultancy.includes(service);
                    return (
                      <label key={service} className="flex items-start gap-2 p-1 text-slate-700 hover:text-slate-900 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleConsultancyToggle(service)}
                          className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-semibold text-[11px] leading-tight">{service}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* PURPOSES, STATUS, GATE PAYMENTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Current Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-slate-500 block">Farm Gate Entry Fee Payment</label>
                  <select
                    value={gateFeePayment}
                    onChange={(e) => setGateFeePayment(e.target.value)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
                  >
                    {paymentOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

              </div>

              {/* DETAILED NOTES */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-500 block">Purpose/Notes; (Kindly specify in detail if need be)</label>
                <textarea
                  rows={3}
                  placeholder="Provide precise details of your recxpats visits, study requests, or broodstock collection needs..."
                  value={purposeNotes}
                  onChange={(e) => setPurposeNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {/* ADMINISTRATIVE & BIOSECURITY FIELDS */}
              {currentUserRole !== "customer" && (
                <>
                  {/* HEALTH LINK EXTRA FIELD */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-500 block">Health & Environmental Management Details</label>
                    <input
                      type="text"
                      placeholder="e.g. Tank hygiene records link, quarantine area assignment references..."
                      value={healthEnvManagement}
                      onChange={(e) => setHealthEnvManagement(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* FOLLOW UP FIELDS */}
                  <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 flex flex-col gap-3">
                    <label className="flex items-center gap-2 select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={followUpRequired}
                        onChange={(e) => setFollowUpRequired(e.target.checked)}
                        className="rounded text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-[11px] uppercase font-black text-sky-950">Specify if Follow Up is Required</span>
                    </label>
                    
                    {followUpRequired && (
                      <div className="space-y-1">
                        <label className="text-[9px] uppercase font-bold text-sky-800 block">Follow Up Guideline Instructions</label>
                        <input
                          type="text"
                          placeholder="e.g. recheck water ph on arrival, check payment receipt copy"
                          value={followUpDetails}
                          onChange={(e) => setFollowUpDetails(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-sky-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* SMART PRE-ADMISSION RISK AUDIT INTEGRATION */}
                  <div className="bg-cyan-950 text-cyan-200 p-4.5 rounded-2xl border border-cyan-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                        <span className="text-[10px] uppercase font-black tracking-wider text-cyan-300">Biosecurity Pre-Arrival Auditing</span>
                      </div>
                      
                      <button
                        type="button"
                        onClick={runAiPreArrivalAnalysis}
                        disabled={isAiGenerating}
                        className="text-[10px] bg-cyan-800 hover:bg-cyan-700 text-cyan-100 font-extrabold px-3 py-1 rounded-lg transition-transform active:scale-95 cursor-pointer"
                      >
                        {isAiGenerating ? "Simulating Audit..." : "Evaluate via Intel AI"}
                      </button>
                    </div>

                    {aiReport ? (
                      <p className="text-[10.5px] font-mono leading-relaxed bg-cyan-900/50 p-3 rounded-xl border border-cyan-800/80">
                        {aiReport}
                      </p>
                    ) : (
                      <p className="text-[10px] text-cyan-400/80 italic">Evaluate options to synthesize a biosecurity audit recommendation before saving the schedule.</p>
                    )}
                  </div>
                </>
              )}

              {/* ACTION ROW */}
              <div className="flex items-center justify-end gap-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel & Close
                </button>
                
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-transform transform active:scale-98"
                >
                  {editingBooking ? "Apply Registry Corrections" : "Commit Reservation Spot"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Contact Us Dialog Modal */}
      {showContactUsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-0 overflow-hidden animate-in fade-in duration-300">
          <div className="w-screen h-screen bg-slate-50 flex flex-col overflow-hidden animate-in zoom-in duration-300">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-800 via-teal-950 to-slate-900 px-8 py-8 md:py-10 text-white flex justify-between items-center shrink-0 relative shadow-md">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_0)] opacity-30 pointer-events-none" style={{ backgroundSize: '16px 16px' }}></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="bg-white/10 p-3 rounded-2xl border border-white/15 shadow-inner">
                  <PhoneCall size={32} className="text-teal-300 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl md:text-4xl font-extrabold tracking-tight font-sans">RecXpats Client Contact Hub</h3>
                  <p className="text-xs md:text-sm text-teal-200 uppercase font-mono tracking-wider mt-1">Consultation, Marketplace & Direct Support Hotline</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setShowContactUsModal(false);
                  setMsgSubject("");
                  setMsgBody("");
                  setMsgUrgency("Low");
                  setMsgSuccess(false);
                }}
                className="hover:bg-white/10 px-5 py-3 rounded-xl text-teal-200 hover:text-white transition cursor-pointer text-xs uppercase font-extrabold flex items-center justify-center gap-1.5 border border-white/10 hover:border-white/20 active:scale-95"
                title="Close Hub"
              >
                ✕ Close
              </button>
            </div>

            {/* Tab selection header */}
            <div className="bg-white border-b border-slate-205 px-8 py-4 flex gap-3 overflow-x-auto shrink-0 scrollbar-none shadow-xs">
              <button
                type="button"
                onClick={() => setContactTab("consultance")}
                className={`px-6 py-3.5 text-xs font-black rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                  contactTab === "consultance"
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-102"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <Briefcase size={16} />
                <span>Consultant Services Catalog</span>
              </button>

              <button
                type="button"
                onClick={() => setContactTab("communication")}
                className={`px-6 py-3.5 text-xs font-black rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                  contactTab === "communication"
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-102"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <MessageSquare size={16} />
                <span>Communication Center</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setContactTab("contact_centre");
                  if (!ccEmail) setCcEmail(currentUserEmail || "");
                  if (!ccCustomerName) setCcCustomerName(currentUserEmail ? currentUserEmail.split("@")[0] : "");
                }}
                className={`px-6 py-3.5 text-xs font-black rounded-2xl flex items-center gap-2 transition-all cursor-pointer ${
                  contactTab === "contact_centre"
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10 scale-102"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <PhoneCall size={16} />
                <span>Support Hotlines & Direct Line</span>
              </button>
            </div>

            {/* Scrollable Body Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8 bg-slate-50/50">
              
              {/* Tab 1: Consultant Services Dashboard */}
              {contactTab === "consultance" && (
                <div className="space-y-6">
                  
                  {/* Internal sub-tab selector inside Consultant Services */}
                  <div className="flex border-b border-slate-200 overflow-x-auto shrink-0 scrollbar-none gap-2">
                    {[
                      { id: "services", label: "💼 CONSULTANCY SERVICES" },
                      { id: "submit", label: "📝 Request Consultation" },
                      { id: "requests", label: "📋 Requests & Tracker" },
                      { id: "responses", label: "🖼️ Responses Gallery" },
                      { id: "consultants", label: "👥 Consultants Directory" },
                      { id: "insights", label: "📈 Insights & Timeline" }
                    ].map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setConsSubTab(st.id as any)}
                        className={`px-4 py-2.5 text-[11px] font-black uppercase tracking-wider border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                          consSubTab === st.id
                            ? "border-teal-600 text-teal-800 font-bold"
                            : "border-transparent text-slate-500 hover:text-slate-705"
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>

                  {/* Sub-Tab 1: Available Catalog list & Bookings (CONSULTANCY SERVICES) */}
                  {consSubTab === "services" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="bg-teal-50 border border-teal-100 p-5 rounded-2xl">
                        <h4 className="text-xs font-black text-teal-900 uppercase tracking-wider mb-1">recxpats Consultant Services Catalog</h4>
                        <p className="text-xs text-teal-800 leading-relaxed font-semibold">
                          Explore our elite, professional advisory solutions and services. Book direct appointments or submit detailed diagnosis inquiry files.
                        </p>
                      </div>

                      {/* Explicit 14 services catalog */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          {
                            title: "Feasibility Studies",
                            desc: "Comprehensive site evaluation, resource analysis, geographic risk metrics, and viability audits.",
                            price: "Ush 1,500,000",
                            timeline: "5 Days",
                            icon: "🏗️"
                          },
                          {
                            title: "Financial Feasibility Analysis for recxpats",
                            desc: "Cash velocity projections, payback calculations, and in-depth recxpats yield modeling.",
                            price: "Ush 2,000,000",
                            timeline: "7 Days",
                            icon: "📊"
                          },
                          {
                            title: "recxpats Business Plan Development",
                            desc: "Clear operations strategy, market integration mapping, and long-term scaling milestones.",
                            price: "Ush 3,500,000",
                            timeline: "14 Days",
                            icon: "📝"
                          },
                          {
                            title: "recxpats Project Management Services",
                            desc: "Coordination of construction, raw materials sourcing timeline audits, and expert supervision.",
                            price: "Ush 4,000,000",
                            timeline: "Ongoing",
                            icon: "💼"
                          },
                          {
                            title: "Fish Farm Design & Construction",
                            desc: "Engineering schematics for concrete tanks, earthen ponds design, recirculation (RAS), and biosecurity setups.",
                            price: "Ush 5,500,000",
                            timeline: "12 Days",
                            icon: "📐"
                          },
                          {
                            title: "Water Quality & Soil Quality Analysis",
                            desc: "Physical-chemical testing of dissolved oxygen, ammonia, nitrates, pH optimization, and clay retentive properties.",
                            price: "Ush 800,000",
                            timeline: "3 Days",
                            icon: "🧪"
                          },
                          {
                            title: "recxpats Engineering Services",
                            desc: "Specialized water-intake pipelines, drainage channels mapping, plumbing systems, and aeration grids setup.",
                            price: "Ush 3,800,000",
                            timeline: "10 Days",
                            icon: "⚙️"
                          },
                          {
                            title: "Start-Up Operations",
                            desc: "Pond bio-security priming, initial fish farm stocking guidelines, and customized feed program launch support.",
                            price: "Ush 1,800,000",
                            timeline: "4 Days Intensive",
                            icon: "🚀"
                          },
                          {
                            title: "recxpats Genetics Program",
                            desc: "Selective breeding schedules, family crossbreeding protocols, and genetic diversity audits.",
                            price: "Ush 2,800,000",
                            timeline: "5 Days",
                            icon: "🧬"
                          },
                          {
                            title: "Fish Feeds Formulation & Supply",
                            desc: "Custom high-protein feed ingredient formulation lists to maximize FCR and fast-track weight stages.",
                            price: "Ush 1,200,000",
                            timeline: "4 Days",
                            icon: "🐟"
                          },
                          {
                            title: "Technical Training & Teaching( Apprenticeship)",
                            desc: "Hands-on diagnostic mentoring, seed stock handling lessons, and water quality auditing labs.",
                            price: "Ush 1,000,000",
                            timeline: "3 Days Workshop",
                            icon: "🎓"
                          },
                          {
                            title: "recxpats Company Audits",
                            desc: "Full operations compliance assessments, facility biosecurity audits, and productivity evaluations.",
                            price: "Ush 3,200,000",
                            timeline: "6 Days",
                            icon: "🔍"
                          },
                          {
                            title: "Vetrinary Services",
                            desc: "Pathogen diagnostic scans, custom treatment programs, emergency health intervention guides, and biosecurity shields.",
                            price: "Ush 1,500,000",
                            timeline: "Urgent Callout",
                            icon: "⚕️"
                          },
                          {
                            title: "R&D facility Hire",
                            desc: "Leasing of incubation spaces, climate chambers, and advanced lab instruments for custom trial feeds analysis.",
                            price: "Ush 450,000 / Day",
                            timeline: "Flexible",
                            icon: "🏢"
                          }
                        ].map((srv, idx) => (
                          <div key={idx} className="border border-slate-150 p-5 rounded-2xl bg-white hover:border-teal-200 hover:shadow-xs transition-colors flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xl">{srv.icon}</span>
                                <h5 className="text-xs font-bold text-slate-800">{srv.title}</h5>
                              </div>
                              <p className="text-[11px] text-slate-550 leading-normal mb-4 font-semibold">{srv.desc}</p>
                            </div>
                            <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-auto">
                              <div>
                                <span className="text-[9px] text-slate-400 block font-bold">ESTIMATED COST</span>
                                <span className="text-xs font-bold font-mono text-emerald-800">{srv.price}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setCustConsTitle(`Inquiry regarding ${srv.title}`);
                                  setCustConsNeeds(`We require help with: ${srv.desc}`);
                                  setCustConsQuestions(`Is the timeline of ${srv.timeline} guaranteed? Can you provide previous references?`);
                                  setCustConsServices(srv.title);
                                  setConsSubTab("submit");
                                }}
                                className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black px-3.5 py-2 rounded-xl transition cursor-pointer"
                              >
                                Pre-fill Inquiry
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* w. Track and Monitor Consultancy Service Bookings */}
                      <div className="border border-slate-200 rounded-3xl bg-slate-50 p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                          <div>
                            <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5">
                              📅 consultancy service bookings & engagements
                            </h4>
                            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                              Track, manage, and monitor all customer bookings for consultancy services including appointment status, service details, assigned staff, and follow-ups.
                            </p>
                          </div>
                          <span className="bg-teal-100 text-teal-850 px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full border border-teal-200">
                            Live Bookings Portal
                          </span>
                        </div>

                        {/* ii. Overview of Customer Appointments and Visits */}
                        <div className="bg-white border border-slate-150 p-4.5 rounded-2xl">
                          <h5 className="text-[10px] font-black text-slate-800 uppercase tracking-wider mb-2">👤 Active Appointment & Engagement Registry</h5>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <span className="text-[9px] font-bold text-slate-400 uppercase block">Total Bookings</span>
                              <span className="text-lg font-black font-mono text-slate-805">{bookings.filter(b => b.appointmentType === "Consultancy Service" || b.relatedConsultancy).length}</span>
                            </div>
                            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100">
                              <span className="text-[9px] font-bold text-blue-500 uppercase block">Scheduled Visits</span>
                              <span className="text-lg font-black font-mono text-blue-805">{bookings.filter(b => (b.appointmentType === "Consultancy Service" || b.relatedConsultancy) && b.status === "Scheduled").length}</span>
                            </div>
                            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                              <span className="text-[9px] font-bold text-emerald-500 uppercase block">Completed Reviews</span>
                              <span className="text-lg font-black font-mono text-emerald-805">{bookings.filter(b => (b.appointmentType === "Consultancy Service" || b.relatedConsultancy) && b.status === "Completed").length}</span>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                              <span className="text-[9px] font-bold text-amber-500 uppercase block">Follow-ups Required</span>
                              <span className="text-lg font-black font-mono text-amber-805">{bookings.filter(b => (b.appointmentType === "Consultancy Service" || b.relatedConsultancy) && b.followUpRequired).length}</span>
                            </div>
                          </div>

                          <div className="overflow-x-auto scrollbar-thin">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100">
                                  <th className="p-3">Customer & Contact</th>
                                  <th className="p-3">Requested Consultancy Service</th>
                                  <th className="p-3">Date, Time & Status</th>
                                  <th className="p-3">Assigned staff</th>
                                  <th className="p-3">Engagement Logs & Follow-up</th>
                                  <th className="p-3">Transport</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {bookings
                                  .filter(b => b.appointmentType === "Consultancy Service" || b.relatedConsultancy)
                                  .map((bk, i) => (
                                    <tr key={bk.id || i} className="hover:bg-slate-50 transition-colors text-slate-700 font-medium">
                                      <td className="p-3">
                                        <div className="font-extrabold text-slate-900">{bk.customerName || bk.customersName}</div>
                                        <div className="text-[10px] font-mono text-slate-400">{bk.contactInfo || "No email/phone"}</div>
                                      </td>
                                      <td className="p-3">
                                        <span className="inline-block bg-teal-50 text-teal-850 text-[10px] px-2 py-0.5 rounded border border-teal-100 font-bold max-w-[180px]">
                                          {bk.relatedConsultancy || bk.appointmentType || "Consultancy Service"}
                                        </span>
                                      </td>
                                      <td className="p-3">
                                        <div className="text-[11px] font-semibold text-slate-600">{bk.dateTime}</div>
                                        <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 mt-1 rounded-full ${
                                          bk.status === "Scheduled"
                                            ? "bg-sky-50 text-sky-700 border border-sky-250"
                                            : bk.status === "Completed"
                                            ? "bg-emerald-50 text-emerald-700 border border-emerald-250"
                                            : "bg-amber-50 text-amber-700 border border-amber-250"
                                        }`}>
                                          ● {bk.status}
                                        </span>
                                      </td>
                                      <td className="p-3">
                                        <div className="text-[11px] font-bold text-slate-805">👤 {bk.staffAssigned || "Advisory Pool"}</div>
                                      </td>
                                      <td className="p-3 max-w-[200px]">
                                        <p className="text-[11px] text-slate-600 italic">"{bk.notes || "No custom engagement notes logged"}"</p>
                                        {bk.followUpRequired ? (
                                          <div className="mt-1 text-[9.5px] font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded px-1.5 py-0.5 block">
                                            ⚠️ Follow-up: {bk.followUpDetails || "Action Required"}
                                          </div>
                                        ) : (
                                          <div className="mt-1 text-[9px] text-emerald-600 font-bold block">✓ Solved - No active follow-up needed</div>
                                        )}
                                      </td>
                                      <td className="p-3 text-[10.5px] font-mono text-slate-500 font-bold uppercase">{bk.transportMode || "N/A"}</td>
                                    </tr>
                                  ))}
                                {bookings.filter(b => b.appointmentType === "Consultancy Service" || b.relatedConsultancy).length === 0 && (
                                  <tr>
                                    <td colSpan={6} className="p-8 text-center text-slate-400 italic font-semibold">
                                      No direct consultancy services booked currently. Submit the form below to secure your slots!
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* Interactive Direct Booking Form */}
                        <form
                          onSubmit={async (e) => {
                            e.preventDefault();
                            const cName = e.currentTarget.cust_name.value;
                            const cPhone = e.currentTarget.cust_phone.value;
                            const bDate = e.currentTarget.book_date.value;
                            const bTime = e.currentTarget.book_time.value;
                            const bNotes = e.currentTarget.book_notes.value;
                            const bStaff = e.currentTarget.book_staff.value;

                            if (!cName || !cPhone) {
                              alert("Customer Name and Contact Information are required.");
                              return;
                            }

                            await onAddRecord("bookings", {
                              customerName: cName,
                              customersName: cName,
                              transportMode: "Car",
                              contactInfo: cPhone,
                              appointmentType: "Consultancy Service",
                              relatedConsultancy: custConsServices,
                              dateTime: `${bDate} ${bTime}`,
                              status: "Scheduled",
                              staffAssigned: bStaff,
                              notes: bNotes,
                              followUpRequired: false,
                              createdBy: currentUserEmail
                            });

                            e.currentTarget.reset();
                            alert("Successfully recorded your new consultancy service appointment!");
                          }}
                          className="bg-white border border-slate-205 p-6 rounded-2xl space-y-4"
                        >
                          <h5 className="text-[10px] font-extrabold uppercase text-slate-900 tracking-wider flex items-center gap-1">
                            🎟️ Book New Direct Consultancy Appointment
                          </h5>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Customer Name</label>
                              <input
                                name="cust_name"
                                type="text"
                                required
                                placeholder="Your Name"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-hidden"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Contact Information (Phone/Email)</label>
                              <input
                                name="cust_phone"
                                type="text"
                                required
                                placeholder="e.g. jalon@fishfarm.com or +256..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-hidden"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Consultancy Service Selection</label>
                              <select
                                value={custConsServices}
                                onChange={(e) => setCustConsServices(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 font-bold cursor-pointer"
                              >
                                {consultancyServices.map((service) => (
                                  <option key={service} value={service}>{service}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Appointment Date</label>
                              <input
                                name="book_date"
                                type="date"
                                required
                                defaultValue={new Date().toISOString().substring(0, 10)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-hidden"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Desired Time</label>
                              <input
                                name="book_time"
                                type="time"
                                required
                                defaultValue="10:00"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-hidden"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Assign Consultant Expert</label>
                              <select
                                name="book_staff"
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-emerald-805 font-extrabold cursor-pointer"
                              >
                                {systemConsultants.map(c => (
                                  <option key={c.name} value={c.name}>{c.name}</option>
                                ))}
                              </select>
                            </div>
                            <div className="space-y-1 md:col-span-3">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Engagement Goals / Visit Objectives / Current Concerns</label>
                              <textarea
                                name="book_notes"
                                rows={2}
                                placeholder="State core issues or audit expectations (e.g., pH fluctuations, clay moisture control)..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-hidden"
                              />
                            </div>
                          </div>
                          <button
                            type="submit"
                            className="bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>🚀 Book Advisory Service & Lock Slot</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 2: Submit New Intake Case Form (Request Consultation) */}
                  {consSubTab === "submit" && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!custConsTitle || !custConsNeeds) {
                          alert("Request Title and Description of Needs are required.");
                          return;
                        }

                        const generatedAiSummary = custConsNeeds.slice(0, 100) + "...";

                        await onAddRecord("consultancies", {
                          requestTitle: custConsTitle,
                          descriptionOfNeeds: custConsNeeds,
                          questions: custConsQuestions,
                          dateSubmitted: new Date().toISOString().split('T')[0],
                          status: "Pending",
                          photosOfIssue: custConsPhoto || "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
                          fishFarmManager: currentUserEmail,
                          assignedConsultant: staffAssigned === "Manager" ? "Dr. Emily Tan" : staffAssigned,
                          consultancyResponses: "",
                          numberOfResponses: 0,
                          averageResponseRating: undefined,
                          firstResponseDate: undefined,
                          fishFarmManagerName: currentUserEmail,
                          assignedConsultantName: staffAssigned === "Manager" ? "Dr. Emily Tan" : staffAssigned,
                          summaryOfNeedsAi: generatedAiSummary,
                          suggestedExpertiseAreaAi: "Advisory Water Biology and Construction Audit",
                          requestedServices: custConsServices
                        });

                        setCustConsTitle("");
                        setCustConsNeeds("");
                        setCustConsQuestions("");
                        setCustConsPhoto("");
                        setConsSubTab("requests");
                        alert("Your consultancy request was added to our secure database!");
                      }}
                      className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-xs"
                    >
                      <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider border-b pb-2">
                        📝 Submit New Technical Advisory request
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500 block">Case Subject / Title (Request Title)</label>
                          <input
                            type="text"
                            required
                            value={custConsTitle}
                            onChange={(e) => setCustConsTitle(e.target.value)}
                            placeholder="e.g. Critical Nitrite flare up in Nursery Pond"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500 block">Consultancy Service Category</label>
                          <select
                            value={custConsServices}
                            onChange={(e) => setCustConsServices(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-755 font-bold cursor-pointer"
                          >
                            {consultancyServices.map((service) => (
                              <option key={service} value={service}>{service}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] uppercase font-bold text-slate-500 block">Describe Your Current Needs & Situation (Consultancy Request)</label>
                          <textarea
                            rows={3}
                            required
                            value={custConsNeeds}
                            onChange={(e) => setCustConsNeeds(e.target.value)}
                            placeholder="Specify physical traits, duration, species types affected, water quality values if known..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] uppercase font-bold text-slate-500 block">Specific Questions to advisor panel</label>
                          <textarea
                            rows={2}
                            value={custConsQuestions}
                            onChange={(e) => setCustConsQuestions(e.target.value)}
                            placeholder="What are the safest steps to mitigate this? Is the feed suspected?"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:outline-hidden"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500 block">Attachment (Direct Upload from Device OR Paste URL)</label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onloadend = () => {
                                      setCustConsPhoto(reader.result as string);
                                    };
                                    reader.readAsDataURL(file);
                                  }
                                }}
                                className="hidden"
                                id="customer-photo-upload"
                              />
                              <label
                                htmlFor="customer-photo-upload"
                                className="flex items-center justify-center gap-1.5 w-full bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-800 rounded-lg p-2.5 text-xs font-bold cursor-pointer text-center select-none transition"
                              >
                                📷 Choose Image
                              </label>
                            </div>
                            <div className="flex-2">
                              <input
                                type="text"
                                value={custConsPhoto.startsWith("data:") ? "Image Loaded from Device ✅" : custConsPhoto}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val !== "Image Loaded from Device ✅") {
                                    setCustConsPhoto(val);
                                  }
                                }}
                                placeholder="Paste image URL or load file"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold focus:outline-hidden"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500 block">Select Assigned Consultant</label>
                          <select
                            value={staffAssigned}
                            onChange={(e) => setStaffAssigned(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-emerald-805 font-extrabold cursor-pointer"
                          >
                            {systemConsultants.map(c => (
                              <option key={c.name} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-2.5 rounded-xl transition cursor-pointer"
                      >
                        Submit Technical Advisory Case File
                      </button>
                    </form>
                  )}

                  {/* Sub-Tab 3: Requests & Tracker */}
                  {consSubTab === "requests" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      
                      {/* z. Track and manage consultancy requests by status categories */}
                      <div className="bg-white border border-slate-200 p-4.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3">
                        <div>
                          <span className="text-xs font-black text-slate-800 uppercase tracking-widest block">📊 Requests Workflow Directory - Status categories</span>
                          <span className="text-[11px] text-slate-500 block font-semibold mt-0.5">
                            Filter and track your fish farm advisory cases through interactive status workflows.
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {["All", "Pending", "In Review", "Responded", "Closed"].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setStatusFilter(st)}
                              className={`px-3 py-1.5 text-[10px] font-black uppercase rounded-lg border transition-all cursor-pointer ${
                                statusFilter === st
                                  ? "bg-slate-900 text-white border-slate-900 shadow-3xs"
                                  : "bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-800 hover:bg-slate-100"
                              }`}
                            >
                              {st} ({st === "All" ? consultancies.length : consultancies.filter(c => c.status === st).length})
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* bb. Requests-Request tracker */}
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">📍 Interactive Request progress tracker</h5>
                        {consultancies.length > 0 ? (
                          <div className="space-y-4">
                            <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Select an active request to trace progress:</label>
                            <div className="flex gap-2 overflow-x-auto scrollbar-none pb-2">
                              {consultancies.map(c => (
                                <button
                                  key={c.id}
                                  type="button"
                                  onClick={() => setSelectedRequestTrackerId(c.id || null)}
                                  className={`px-3 py-2 rounded-xl text-left border transition-all text-xs font-bold whitespace-nowrap cursor-pointer shrink-0 ${
                                    selectedRequestTrackerId === c.id || (!selectedRequestTrackerId && consultancies[0].id === c.id)
                                      ? "bg-teal-50 border-teal-300 text-teal-850"
                                      : "bg-white border-slate-150 text-slate-600 hover:bg-slate-50"
                                  }`}
                                >
                                  {c.requestTitle.slice(0, 25)}... ({c.status})
                                </button>
                              ))}
                            </div>

                            {/* Active tracker visualization */}
                            {(() => {
                              const activeId = selectedRequestTrackerId || consultancies[0]?.id;
                              const currentCase = consultancies.find(c => c.id === activeId);
                              if (!currentCase) return null;

                              const steps = [
                                { label: "Logged & Approving", cond: true },
                                { label: "Under Technical Review", cond: currentCase.status === "In Review" || currentCase.status === "Responded" || currentCase.status === "Closed" },
                                { label: "Remedy Prescribed", cond: currentCase.status === "Responded" || currentCase.status === "Closed" },
                                { label: "Customer Evaluated & Closed", cond: currentCase.status === "Closed" }
                              ];

                              return (
                                <div className="bg-white border border-slate-200 rounded-xl p-4.5 space-y-3">
                                  <div className="flex justify-between items-center">
                                    <span className="text-xs font-black text-slate-800">Pipeline path for: <strong className="text-slate-900">"{currentCase.requestTitle}"</strong></span>
                                    <span className="font-mono text-[9px] text-slate-400">ID: {currentCase.id}</span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative pt-2">
                                    {steps.map((st, sidx) => (
                                      <div key={sidx} className={`p-3 rounded-lg border transition-all ${
                                        st.cond
                                          ? "bg-teal-50 border-teal-200 text-teal-900"
                                          : "bg-slate-50 border-slate-100 text-slate-400"
                                      }`}>
                                        <div className="flex items-center gap-1.5">
                                          <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-black ${
                                            st.cond ? "bg-teal-600 text-white" : "bg-slate-250 text-slate-500"
                                          }`}>{sidx + 1}</span>
                                          <span className="text-[10px] font-extrabold uppercase tracking-wide">{st.label}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-slate-400 text-xs font-bold leading-relaxed">No requests available yet to trace. Click 'Request Consultation' to start.</div>
                        )}
                      </div>

                      {/* cc. Fisheries Management Request Monitor / List of Submitted Requests */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
                        <div className="flex justify-between items-center border-b pb-2">
                          <h5 className="text-[10px] font-black uppercase tracking-wider text-slate-800">📋 Fisheries Management Request Monitor</h5>
                          <span className="text-[10px] text-slate-400 font-mono">Date Submitted and Triage Records</span>
                        </div>

                        <div className="overflow-x-auto scrollbar-thin">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-50 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-100">
                                <th className="p-3">Request Title</th>
                                <th className="p-3">Category</th>
                                <th className="p-3">Needs details</th>
                                <th className="p-3">Submitted questions</th>
                                <th className="p-3">Submission date</th>
                                <th className="p-3">Status</th>
                                <th className="p-3">Advisor Assigned</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-medium text-slate-705">
                              {consultancies
                                .filter(c => statusFilter === "All" || c.status === statusFilter)
                                .map((rec, ri) => (
                                  <tr key={rec.id || ri} className="hover:bg-slate-50/60 transition-colors">
                                    <td className="p-3 font-extrabold text-slate-900 whitespace-nowrap">{rec.requestTitle}</td>
                                    <td className="p-3 whitespace-nowrap">
                                      <span className="bg-slate-100 text-slate-705 px-2 py-0.5 rounded text-[10px] border border-slate-200 font-bold">{rec.requestedServices || "General inquiry"}</span>
                                    </td>
                                    <td className="p-3 max-w-[200px] text-[11px] truncate leading-normal" title={rec.descriptionOfNeeds}>
                                      {rec.descriptionOfNeeds}
                                    </td>
                                    <td className="p-3 max-w-[200px] text-[11px] font-semibold text-slate-500 italic truncate" title={rec.questions}>
                                      {rec.questions || "— No question logged"}
                                    </td>
                                    <td className="p-3 font-mono text-slate-505 whitespace-nowrap">{rec.dateSubmitted}</td>
                                    <td className="p-3 whitespace-nowrap">
                                      <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                        rec.status === "Pending"
                                          ? "bg-rose-50 text-rose-700 border border-rose-250"
                                          : rec.status === "In Review"
                                          ? "bg-amber-50 text-amber-700 border border-amber-250"
                                          : rec.status === "Responded"
                                          ? "bg-emerald-50 text-emerald-805 border border-emerald-255"
                                          : "bg-slate-100 text-slate-600 border border-slate-205"
                                      }`}>
                                        ● {rec.status}
                                      </span>
                                    </td>
                                    <td className="p-3 font-bold text-slate-805 whitespace-nowrap">👤 {rec.assignedConsultantName || rec.assignedConsultant || "Awaiting Director"}</td>
                                  </tr>
                                ))}
                              {consultancies.filter(c => statusFilter === "All" || c.status === statusFilter).length === 0 && (
                                  <tr>
                                    <td colSpan={7} className="p-10 text-center text-slate-400 italic">No submitted requests matched the selected status category.</td>
                                  </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      {/* ee. Requests-Consultancy calendar */}
                      <div className="bg-white border border-slate-200 rounded-2xl p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3 mb-4">
                          <div>
                            <h5 className="text-xs font-black uppercase tracking-widest text-slate-800">📅 Requests-Consultancy calendar</h5>
                            <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                              View consultancy requests by submission and response dates to track request status, monitor progress, and review responses or recommendations.
                            </p>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-100 px-2 py-1 rounded-lg">Month View (June 2026)</span>
                        </div>

                        {/* Styled June Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1.5 text-center font-bold text-[10px]">
                          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                            <div key={d} className="text-slate-400 p-2 uppercase tracking-wide bg-slate-50 rounded-md font-black">{d}</div>
                          ))}
                          {Array.from({ length: 30 }, (_, di) => {
                            const dateNum = di + 1;
                            const targetDateStr = `2026-06-${String(dateNum).padStart(2, "0")}`;
                            
                            // Check for bookings or requests on this date
                            const hasSubmittedRequest = consultancies.some(c => c.dateSubmitted === targetDateStr);
                            const hasResponse = consultancies.some(c => c.firstResponseDate === targetDateStr);
                            const hasBooking = bookings.some(b => b.dateTime && b.dateTime.startsWith(targetDateStr));

                            return (
                              <div key={di} className={`p-2.5 rounded-xl border flex flex-col justify-between items-center min-h-[55px] ${
                                hasSubmittedRequest || hasResponse || hasBooking
                                  ? "bg-teal-50/50 border-teal-200 text-teal-900 font-bold"
                                  : "bg-white border-slate-100 text-slate-700"
                              }`}>
                                <span className="font-mono block self-start">{dateNum}</span>
                                <div className="space-y-1 w-full mt-1">
                                  {hasSubmittedRequest && (
                                    <span className="block bg-rose-500 text-white text-[7.5px] px-1 py-0.2 rounded-sm truncate" title="Case Submitted">📥 Intake</span>
                                  )}
                                  {hasResponse && (
                                    <span className="block bg-emerald-500 text-white text-[7.5px] px-1 py-0.2 rounded-sm truncate" title="Diagnostic Answer">✓ Resp</span>
                                  )}
                                  {hasBooking && (
                                    <span className="block bg-blue-500 text-white text-[7.5px] px-1 py-0.2 rounded-sm truncate" title="On-site checkup">💼 Book</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* hh. Track and Monitor Consulting-Incoming requests */}
                      <div className="bg-teal-950/5 border border-teal-900/10 rounded-2xl p-5 space-y-3">
                        <div className="flex justify-between items-center border-b border-teal-900/10 pb-2">
                          <span className="text-[10px] font-black uppercase text-teal-950 tracking-wider flex items-center gap-1">🔔 Live Technical Inlet (Incoming Requests feeds)</span>
                          <span className="font-mono text-[9px] text-teal-800">Real-time unassigned queue</span>
                        </div>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto scrollbar-thin">
                          {consultancies.some(c => c.status === "Pending") ? (
                            consultancies
                              .filter(c => c.status === "Pending")
                              .map(c => (
                                <div key={c.id} className="bg-white border border-slate-150 p-3 rounded-xl flex items-center justify-between gap-4">
                                  <div>
                                    <span className="text-xs font-bold text-slate-800">{c.requestTitle}</span>
                                    <span className="text-[9.5px] text-slate-450 block font-mono mt-0.5">Submitted by: {c.fishFarmManager || c.fishFarmManagerName} • Category: {c.requestedServices}</span>
                                  </div>
                                  <span className="bg-rose-50 text-rose-700 border border-rose-100 text-[8.5px] font-black uppercase px-2 py-0.5 rounded-sm">Pending Board Review</span>
                                </div>
                              ))
                          ) : (
                            <div className="text-[11px] text-teal-900/70 py-2 italic font-semibold">All incoming advisory request pipeline cleared! No pending unassigned cases waiting in grid.</div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                  {/* Sub-Tab 4: Responses Gallery */}
                  {consSubTab === "responses" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      
                      {/* jj. Track and Monitor Consulting-Responses gallery */}
                      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-5">
                        <h4 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-1">🖼️ Consulting-Responses gallery</h4>
                        <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">
                          Browse tailored expert diagnostics, advice, recipes, and structured solutions provided in response to submitted inquiries.
                        </p>
                      </div>

                      {/* kk. Browse tailored advice, recommendations, and solutions (Responses Gallery Grid) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {consultancies.map((rec) => (
                          <div key={rec.id} className="bg-white border border-slate-205 p-6 rounded-3xl flex flex-col justify-between space-y-4 hover:border-slate-800 transition-all shadow-3xs">
                            
                            {/* Card Header section */}
                            <div className="space-y-2">
                              <div className="flex justify-between items-start gap-2">
                                <span className="bg-emerald-50 text-emerald-850 text-[9px] font-black uppercase px-2 py-0.5 rounded border border-emerald-150">
                                  {rec.requestedServices || "Advisory File"}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">{rec.dateSubmitted}</span>
                              </div>
                              <h5 className="text-xs font-black text-slate-900 leading-snug">{rec.requestTitle}</h5>
                              
                              {/* Request Title(from Consultancy Request) / Consultancy Request section */}
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 text-[11px]">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wide block">Consultancy Request / Case Details</span>
                                <p className="text-slate-650 leading-relaxed italic">"{rec.descriptionOfNeeds}"</p>
                                {rec.questions && (
                                  <div className="text-[10px] text-slate-500 mt-1">
                                    <strong className="text-slate-700">Questions:</strong> {rec.questions}
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Response content section */}
                            <div className="space-y-3 pt-1">
                              <div className="border-t border-slate-100 pt-3 space-y-2">
                                <span className="text-[10px] font-black text-teal-850 uppercase tracking-widest block">💡 Tailored Advice & Diagnostic prescribed:</span>
                                {rec.consultancyResponses ? (
                                  <div className="space-y-3.5">
                                    <p className="text-[11px] font-semibold text-slate-800 leading-relaxed bg-emerald-50/40 p-3 rounded-xl border border-emerald-100 whitespace-pre-line">
                                      {rec.consultancyResponses}
                                    </p>
                                    
                                    {/* Summary of Response AI */}
                                    <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 text-[10.5px]">
                                      <span className="font-extrabold text-purple-800 text-[9px] uppercase tracking-wide block mb-1">✨ Summary of Response AI (Instant Summary)</span>
                                      <p className="text-slate-700">
                                        • Primary mitigation action: Apply recommended diagnostics dosage immediately.<br />
                                        • Resource risk level: Controlled, water replacement and diagnostic containment protocols underway.
                                      </p>
                                    </div>

                                    {/* Response Sentiment AI */}
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-1">
                                        <span className="text-[9.5px] uppercase font-bold text-slate-450 block">Response Sentiment (AI)</span>
                                        <span className="bg-teal-100 text-teal-800 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-teal-200">Positive / Remedial</span>
                                      </div>
                                      <span className="font-mono text-[9px] font-bold text-emerald-805 uppercase bg-emerald-50 border border-emerald-150 px-2 py-0.5 rounded">Remedy Ready</span>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-[11px] text-slate-400 italic py-2">
                                    Awaiting advisory board feedback. Our certified director team is investigating current biological readings...
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Attachments Section */}
                            <div className="flex justify-between items-center text-[10.5px] border-t pt-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-500">Attachments:</span>
                                {rec.photosOfIssue ? (
                                  <a href={rec.photosOfIssue} target="_blank" rel="noreferrer" className="text-teal-600 hover:underline font-mono text-[9.5px] shrink-0 truncate max-w-[120px]">
                                    📂 issue_snap.png
                                  </a>
                                ) : (
                                  <span className="text-slate-400 italic text-[9.5px]">None</span>
                                )}
                              </div>
                              <div className="text-[11px] font-bold text-slate-700">
                                Consultanct: <strong className="font-mono text-emerald-750">{rec.assignedConsultantName || rec.assignedConsultant || "Awaiting Specialist"}</strong>
                              </div>
                            </div>

                            {/* Response Rating Evaluation */}
                            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Advisor Response Rating:</span>
                              {rec.averageResponseRating ? (
                                <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-150">
                                  <span className="text-amber-500 font-extrabold text-xs">{"★".repeat(rec.averageResponseRating)}</span>
                                  <span className="text-[10px] text-slate-600 font-black">({rec.averageResponseRating}/5 Rated)</span>
                                </div>
                              ) : rec.status === "Responded" ? (
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((stars) => (
                                    <button
                                      key={stars}
                                      type="button"
                                      onClick={async () => {
                                        await onUpdateRecord("consultancies", rec.id, {
                                          averageResponseRating: stars,
                                          status: "Closed"
                                        });
                                        alert("Your feedback has been logged securely to Airtable!");
                                      }}
                                      className="text-slate-300 hover:text-amber-400 transition hover:scale-125 text-sm cursor-pointer"
                                      title={`Vote ${stars} Stars`}
                                    >
                                      ★
                                    </button>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-slate-400 text-[10px] italic">Awaiting Response</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {consultancies.length === 0 && (
                          <div className="col-span-2 text-center p-12 text-slate-400 font-semibold italic">No technical diagnostics or expert responses to present yet.</div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 5: Consultants Directory */}
                  {consSubTab === "consultants" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-xs font-black uppercase text-slate-900 tracking-widest">👥 EXECUTIVE CONSULTANTS DIRECTORY</h4>
                          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                            Connect with verified recxpats advisors, check their years of experience, AI profile summaries, active workloads, and specific pricing models.
                          </p>
                        </div>
                        <span className="bg-emerald-100 text-emerald-950 px-2.5 py-1 text-[10px] font-black rounded-full border border-emerald-200 uppercase tracking-widest shrink-0">
                          3 Specialists Registered
                        </span>
                      </div>

                      {/* Professional consultants display */}
                      <div className="space-y-6">
                        {systemConsultants.map((con, ci) => (
                          <div key={ci} className="bg-white border border-slate-205 p-6 rounded-3xl hover:border-slate-800 transition-all flex flex-col lg:flex-row gap-6">
                            
                            {/* Left column: Photo, Name, and Quick contact info */}
                            <div className="lg:w-1/4 flex flex-col items-center text-center space-y-3 shrink-0">
                              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm relative shrink-0">
                                <img
                                  src={con.photo}
                                  referrerPolicy="no-referrer"
                                  alt={con.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h5 className="text-xs font-black text-slate-900 leading-tight">{con.name}</h5>
                                <span className="inline-block bg-emerald-50 text-emerald-805 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full mt-1 border border-emerald-150">
                                  ● {con.activeStatus}
                                </span>
                              </div>
                              <div className="space-y-1 text-[10.5px] font-mono text-slate-500 font-semibold w-full">
                                <div className="truncate">📧 {con.email}</div>
                                <div>📞 {con.phoneNumber}</div>
                              </div>
                              <div className="w-full pt-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setStaffAssigned(con.name);
                                    setConsSubTab("submit");
                                  }}
                                  className="w-full bg-slate-955 hover:bg-slate-800 text-white text-[9.5px] font-black uppercase py-2 rounded-xl transition cursor-pointer"
                                >
                                  Consult {con.name.split(" ")[1]}
                                </button>
                              </div>
                            </div>

                            {/* Middle column: Experience, Bio and Services Offered */}
                            <div className="flex-1 space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Expertise Areas</span>
                                  <p className="text-xs font-black text-slate-850 leading-relaxed">{con.expertiseAreas}</p>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-[9px] uppercase font-bold text-slate-400 block">Years of Experience</span>
                                  <p className="text-xs font-black text-slate-850 leading-relaxed">🎖️ {con.yearsOfExperience} Years Active</p>
                                </div>
                              </div>

                              <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-100 text-[11px]">
                                <span className="text-[9px] uppercase font-bold text-slate-400 block">Professional Bio</span>
                                <p className="text-slate-600 leading-relaxed font-semibold">{con.bio}</p>
                              </div>

                              {/* Bio Summary AI & Consultant Strength AI */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="bg-purple-50 border border-purple-100 p-3 rounded-xl text-[10.5px]">
                                  <span className="font-extrabold text-purple-855 text-[9px] uppercase tracking-wide block mb-0.5">✨ Bio Summary AI</span>
                                  <p className="text-slate-705 italic">"{con.bioSummaryAi}"</p>
                                </div>
                                <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-[10.5px]">
                                  <span className="font-extrabold text-amber-855 text-[9px] uppercase tracking-wide block mb-0.5">⚡ Consultant Strength AI</span>
                                  <p className="text-slate-705 italic">"{con.consultantStrengthAi}"</p>
                                </div>
                              </div>

                              {/* Services Offered Display */}
                              <div className="space-y-1.5">
                                <span className="text-[9px] uppercase font-bold text-slate-400 block">Services Offered</span>
                                <div className="flex flex-wrap gap-1">
                                  {con.servicesOffered.map((srv, si) => (
                                    <span key={si} className="bg-slate-100 text-slate-800 text-[9.5px] font-black uppercase px-2.5 py-1 rounded-xl border border-slate-200">
                                      {srv}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Right column: Counters, metrics, pricing, comment audit */}
                            <div className="lg:w-1/4 bg-slate-50 border border-slate-150 p-4.5 rounded-2xl flex flex-col justify-between space-y-4 shrink-0">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center text-[11px] font-bold">
                                  <span className="text-slate-400 uppercase">Consultancy Requests</span>
                                  <span className="font-mono text-slate-900">{con.consultancyRequests} Cases</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-bold">
                                  <span className="text-slate-400 uppercase">Total Responses</span>
                                  <span className="font-mono text-slate-900">{con.totalResponses} Logs</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-bold">
                                  <span className="text-slate-400 uppercase">Average Rating</span>
                                  <div className="flex items-center gap-0.5 text-amber-500">
                                    <span>{"★".repeat(Math.round(con.averageResponseRating))}</span>
                                    <span className="font-mono text-slate-900">({con.averageResponseRating})</span>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center text-[10.5px] font-bold">
                                  <span className="text-slate-400 uppercase">Last Response Log</span>
                                  <span className="font-mono text-[9px] text-slate-500 whitespace-nowrap">{con.lastResponseDateTime}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px] font-bold">
                                  <span className="text-slate-400 uppercase">Follow-up Needed</span>
                                  <span className={`text-[9px] font-black uppercase px-1.5 py-0.2 rounded-sm ${
                                    con.followUpNeeded.includes("Scheduled") ? "bg-amber-100 text-amber-850" : "bg-emerald-100 text-emerald-850"
                                  }`}>{con.followUpNeeded.includes("Scheduled") ? "⚠️ Yes" : "✓ No"}</span>
                                </div>
                              </div>

                              {/* Rates Grid */}
                              <div className="border-t border-slate-200 pt-3 space-y-2">
                                <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 block">Financial Rates Sheet</span>
                                <div className="grid grid-cols-3 gap-2 text-center">
                                  <div className="bg-white p-1.5 rounded-lg border border-slate-150">
                                    <span className="text-[8px] text-slate-400 block font-bold">HOURLY</span>
                                    <span className="text-[10px] font-black font-mono text-emerald-804">{con.hourlyRate}</span>
                                  </div>
                                  <div className="bg-white p-1.5 rounded-lg border border-slate-150">
                                    <span className="text-[8px] text-slate-400 block font-bold">PROJECT</span>
                                    <span className="text-[10px] font-black font-mono text-emerald-804">{con.projectBasedFees}</span>
                                  </div>
                                  <div className="bg-white p-1.5 rounded-lg border border-slate-150">
                                    <span className="text-[8px] text-slate-400 block font-bold">RETAINER</span>
                                    <span className="text-[10px] font-black font-mono text-emerald-804">{con.retainers}</span>
                                  </div>
                                </div>
                              </div>

                              {/* AI Recommended model & Delivery Comments */}
                              <div className="border-t border-slate-250 pt-3 space-y-2 text-[10px]">
                                <div className="space-y-0.5">
                                  <span className="font-extrabold text-blue-800 text-[8.5px] uppercase block">🤖 Recommended Pricing Model AI</span>
                                  <p className="text-slate-655 leading-tight italic font-semibold">"{con.recommendedPricingModelAi}"</p>
                                </div>
                                <div className="space-y-0.5">
                                  <span className="font-extrabold text-teal-800 text-[8.5px] uppercase block">📈 Comments on Value Delivered AI</span>
                                  <p className="text-slate-655 leading-tight italic font-semibold">"{con.commentsOnValueDeliveredAi}"</p>
                                </div>
                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Sub-Tab 6: Insights & Timeline */}
                  {consSubTab === "insights" && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                      
                      {/* mm. Track and monitor Consultancy Request Insights */}
                      <div className="bg-teal-50 border border-teal-150 p-5 rounded-3xl">
                        <h4 className="text-xs font-black uppercase tracking-widest text-teal-900 mb-1">📈 Consultancy Request Insights Overview</h4>
                        <p className="text-xs text-teal-850 font-semibold leading-relaxed">
                          Monitor request status and response progress, analyze historical interactions, and assess fish farm advisory satisfaction metrics in deep context.
                        </p>
                      </div>

                      {/* nn. Track and analyze consultancy requests submitted by fish farm managers */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
                          <span className="text-[9.5px] uppercase font-extrabold text-slate-400">Triage Engagement Rate</span>
                          <span className="text-xl font-black font-mono text-slate-900 mt-1">100% Active</span>
                          <span className="text-[9px] text-slate-500 font-semibold block mt-1">Fish farms mapped securely</span>
                        </div>
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
                          <span className="text-[9.5px] uppercase font-extrabold text-slate-400">Average Advisory Score</span>
                          <span className="text-xl font-black font-mono text-slate-900 mt-1">⭐ 4.90 / 5.00</span>
                          <span className="text-[9px] text-slate-500 font-semibold block mt-1">Based on rated cases</span>
                        </div>
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
                          <span className="text-[9.5px] uppercase font-extrabold text-slate-400">SLA Response Duration</span>
                          <span className="text-xl font-black font-mono text-slate-900 mt-1">2.4 Hours Avg</span>
                          <span className="text-[9px] text-slate-500 font-semibold block mt-1">Target limit: 12.0 Hours</span>
                        </div>
                        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between">
                          <span className="text-[9.5px] uppercase font-extrabold text-slate-400">Airtable Health Validation</span>
                          <span className="text-xl font-black font-mono text-teal-750 mt-1">✓ Sync Normal</span>
                          <span className="text-[9px] text-slate-500 font-semibold block mt-1">Zero schema mismatches</span>
                        </div>
                      </div>

                      {/* oo. Track and monitor Insights-History timeline */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-6">
                        <div className="border-b pb-3 mb-4">
                          <h5 className="text-xs font-black uppercase tracking-widest text-slate-800">📊 Insights-History timeline</h5>
                          <p className="text-[11px] text-slate-500 font-semibold mt-0.5">
                            Review consultancy history and recommendations by exploring a chronological view of all consultancy responses, advice, and actions provided to fish farm managers.
                          </p>
                        </div>

                        {/* pp. Review consultancy history (Timeline view) */}
                        <div className="space-y-6 relative border-l border-slate-150 pl-6 ml-2 font-medium">
                          {consultancies.map((rec, ri) => (
                            <div key={rec.id || ri} className="relative">
                              <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-teal-600 shadow-sm block" />
                              <div className="bg-slate-50 border border-slate-150 p-4 rounded-2xl space-y-2">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                  <h6 className="text-xs font-black text-slate-900">Case Intake: "{rec.requestTitle}"</h6>
                                  <span className="text-[10px] font-mono text-slate-450 font-bold">{rec.dateSubmitted}</span>
                                </div>
                                <p className="text-[11px] text-slate-550 leading-relaxed italic border-l-2 pl-3">
                                  "Fish farm manager reported: {rec.descriptionOfNeeds}"
                                </p>
                                {rec.consultancyResponses ? (
                                  <div className="pt-2">
                                    <span className="text-[9px] uppercase font-black text-teal-850 block mb-0.5">Recommended Actions Timeline</span>
                                    <p className="text-[11px] text-slate-800 font-semibold bg-white border p-2.5 rounded-lg leading-normal">
                                      👤 {rec.assignedConsultantName || "Advisory Specialist"} stated: "{rec.consultancyResponses}"
                                    </p>
                                  </div>
                                ) : (
                                  <div className="pt-2 text-[10px] text-rose-600 block italic font-bold">
                                    ● Advisory diagnostic case is actively in transit / awaiting final board answer protocols.
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          {consultancies.length === 0 && (
                            <div className="text-center text-slate-400 italic text-xs py-6">Timeline is currently blank. Login technical request diaries to pop statistics here!</div>
                          )}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              )}



              {/* Tab 3: Communication Center */}
              {contactTab === "communication" && (
                <div className="space-y-6 text-left animate-in fade-in duration-300">
                  {/* Top Header Card */}
                  <div className="bg-gradient-to-r from-emerald-500/10 via-sky-500/5 to-transparent border border-emerald-200/50 p-6 rounded-3xl relative overflow-hidden">
                    <span className="bg-emerald-100 text-emerald-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-200">
                      Unified Portal
                    </span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mt-2 pb-1">Communication Features</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      Collaborate transparently with specialists, access centralized biosecure knowledge bases, and transmit rapid support requests.
                    </p>
                  </div>

                  {/* Active Social Media Corridors (Direct Click-to-Chat / Pages) */}
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
                      <div>
                        <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-150 uppercase tracking-wider">
                          Instant Touchpoints
                        </span>
                        <h4 className="text-sm font-black text-slate-900 mt-2 uppercase tracking-wide">
                          📱 Direct Social Media Corridors & Active Help Channels
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono font-black text-teal-650 bg-teal-50 px-2.5 py-1 rounded border border-teal-150 flex items-center gap-1.5 uppercase shrink-0">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse inline-block" />
                        Representatives Online Now
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                      Tapping any of the communication avenues below will establish an instantaneous link with active digital assets or invoke cell support lines dynamically:
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                      
                      {/* WhatsApp Channel */}
                      <a 
                        href="https://wa.me/256771991331?text=Hello%20RecXpats%20Support!%20I%20have%20an%20urgent%20recxpats%20operation%20query."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-50 hover:bg-emerald-100/85 border border-emerald-150 p-4 rounded-2xl flex flex-col justify-between transition group hover:scale-[1.01] active:scale-[0.99] shadow-inner-white"
                        title="Open WhatsApp Chat Directly"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="bg-emerald-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">WhatsApp Chat</span>
                            <span className="text-base text-emerald-600">💬</span>
                          </div>
                          <h5 className="text-slate-900 font-black text-xs font-mono">+256 771 991 331</h5>
                          <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">
                            Transmit media logs, harvest images, and coordinate delivery routes immediately.
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs font-black text-emerald-700">
                          <span>Chat on WhatsApp</span>
                          <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </div>
                      </a>

                      {/* Facebook Page */}
                      <a 
                        href="https://facebook.com/bluehatch_ug"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-50/80 hover:bg-blue-100/90 border border-blue-150 p-4 rounded-2xl flex flex-col justify-between transition group hover:scale-[1.01] active:scale-[0.99]"
                        title="Visit Facebook Page"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded">Facebook Page</span>
                            <span className="text-base text-blue-600">👥</span>
                          </div>
                          <h5 className="text-slate-900 font-extrabold text-xs font-mono">@bluehatch_ug</h5>
                          <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">
                            Review public recxpats seminars, fingerling dispatch broadcasts, and community feedback.
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs font-black text-blue-700">
                          <span>Visit Facebook Page</span>
                          <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </div>
                      </a>

                      {/* Twitter / X */}
                      <a 
                        href="https://x.com/bluehatch_ug"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-slate-900 hover:bg-slate-950 text-white p-4 rounded-2xl flex flex-col justify-between transition group hover:scale-[1.01] active:scale-[0.99]"
                        title="Visit Twitter/X Profile"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="bg-white/10 text-white text-[9.5px] font-black uppercase px-2 py-0.5 rounded border border-white/10">Twitter / X</span>
                            <span className="text-xs">⚡</span>
                          </div>
                          <h5 className="text-white font-extrabold text-xs font-mono">@bluehatch_ug</h5>
                          <p className="text-[10.5px] text-slate-400 leading-normal font-medium">
                            Weekly pricing indexes, climate alerts, and biological advisory telemetry broadcasts in real-time.
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs font-black text-teal-300">
                          <span>Follow Feed</span>
                          <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </div>
                      </a>

                      {/* Direct Phone Dial */}
                      <a 
                        href="tel:+256200949411"
                        className="bg-amber-50 hover:bg-amber-100/90 border border-amber-150 p-4 rounded-2xl flex flex-col justify-between transition group hover:scale-[1.01] active:scale-[0.99]"
                        title="Call Cell Support Hotline directly"
                      >
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="bg-amber-500 text-slate-950 text-[9.5px] font-black uppercase px-2 py-0.5 rounded">Cell Support</span>
                            <span className="text-base text-amber-600">📞</span>
                          </div>
                          <h5 className="text-slate-900 font-black text-xs font-mono">+256 200 949 411</h5>
                          <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">
                            Establish voice-channel emergency routing with farm biosecurity coordinators instantly.
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs font-black text-amber-700">
                          <span>Dial Helpline Now</span>
                          <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </div>
                      </a>

                    </div>
                  </div>

                  {/* Left-Right Split Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    
                    {/* Left 3 cols: Messaging/Chat & Support Utilities */}
                    <div className="lg:col-span-3 space-y-6">
                      
                      {/* Messaging / Chat Section */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
                          <span className="text-xs font-black text-slate-900 uppercase">💬 Messaging / Chat</span>
                        </div>

                        {/* Direct Messaging & Group Chat visual mock simulation */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Direct Messaging */}
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Direct Messaging</span>
                                <span className="text-[9px] font-mono font-bold text-slate-400">● Live Agent Active</span>
                              </div>
                              <h4 className="text-xs font-black text-slate-900">Dr. Jalon (Biologist)</h4>
                              
                              <div className="space-y-2 max-h-[140px] overflow-y-auto bg-white p-2.5 rounded-xl border border-slate-150 text-[11px] leading-relaxed">
                                <div className="text-left">
                                  <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-lg inline-block font-semibold">
                                    Hello! Let me know if you need feed adjustments.
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="bg-emerald-500 text-white px-2 py-1 rounded-lg inline-block font-semibold">
                                    Thank you doctor, checking fry weight today.
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 flex gap-1.5">
                              <input 
                                type="text" 
                                placeholder="Type a direct message..." 
                                className="flex-1 text-[11px] font-semibold bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                              />
                              <button className="bg-slate-900 text-white hover:bg-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-extrabold cursor-pointer transition">
                                Send
                              </button>
                            </div>
                          </div>

                          {/* Group Chat */}
                          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col justify-between">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span className="text-[10px] font-extrabold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">Group Chat</span>
                                <span className="text-[9px] font-mono font-bold text-slate-400">3 Members Online</span>
                              </div>
                              <h4 className="text-xs font-black text-slate-900">Uganda recxpats Guild</h4>

                              <div className="space-y-2 max-h-[140px] overflow-y-auto bg-white p-2.5 rounded-xl border border-slate-150 text-[11px] leading-relaxed block text-left">
                                <div className="text-left mb-1">
                                  <span className="text-[8px] text-slate-400 font-extrabold block">Bobi (Masaka Farm)</span>
                                  <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-lg inline-block font-semibold">
                                    Pond 3 water temperature is high today!
                                  </span>
                                </div>
                                <div className="text-left">
                                  <span className="text-[8px] text-slate-400 font-extrabold block">Agnes (Fish Farm)</span>
                                  <span className="bg-slate-100 text-slate-800 px-2 py-1 rounded-lg inline-block font-semibold">
                                    Ensure emergency aerator is loaded!
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="mt-3 flex gap-1.5">
                              <input 
                                type="text" 
                                placeholder="Post to group chat..." 
                                className="flex-1 text-[11px] font-semibold bg-white border border-slate-200 px-2.5 py-1.5 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                              />
                              <button className="bg-sky-600 text-white hover:bg-sky-700 px-3 py-1.5 rounded-lg text-[10px] font-extrabold cursor-pointer transition">
                                Post
                              </button>
                            </div>
                          </div>

                        </div>

                        {/* File Sharing module */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                          <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                            <FileText size={13} className="text-slate-650" /> <span>File Sharing & Transfer Logs</span>
                          </h4>
                          <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">
                            Upload photos of pond conditions, water diagnostic readouts, or pellet purchase orders for rapid biological analysis.
                          </p>

                          <div className="border border-dashed border-slate-300 bg-white hover:bg-slate-50/50 hover:border-emerald-500 cursor-pointer p-4 rounded-xl text-center space-y-1 transition">
                            <span className="text-lg block">📥</span>
                            <span className="text-[11px] font-black text-slate-700 block">Click to select files or drag-and-drop here</span>
                            <span className="text-[9px] text-slate-400 block font-mono">Accepts JPG, PNG, PDF up to 10MB</span>
                          </div>
                        </div>

                      </div>

                      {/* Feedback & Support Section */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
                          <span className="text-xs font-black text-slate-900 uppercase">🛡️ Feedback & Support</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Help Center */}
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                            <div className="flex items-center gap-1.5">
                              <HelpCircle size={14} className="text-amber-600" />
                              <h4 className="text-xs font-black text-slate-900">Help Center FAQs</h4>
                            </div>
                            
                            <div className="space-y-2 text-[10.5px] leading-relaxed font-semibold text-slate-600 text-left block">
                              <div className="bg-white p-2.5 rounded-xl border border-slate-150">
                                <span className="font-extrabold text-slate-800 block">Q: Ideal Tilapia temperature range?</span>
                                <span className="text-[10px] text-slate-500 block mt-0.5">Optimal growth occurs strictly between 28°C and 32°C.</span>
                              </div>
                              <div className="bg-white p-2.5 rounded-xl border border-slate-150">
                                <span className="font-extrabold text-slate-800 block">Q: How to prepare container?</span>
                                <span className="text-[10px] text-slate-500 block mt-0.5">Disinfect nets with active chlorine rinse.</span>
                              </div>
                            </div>
                          </div>

                          {/* Live Chat Support */}
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                                <h4 className="text-xs font-black text-slate-900 ml-1">Live Chat Support</h4>
                              </div>
                              <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">
                                Speak directly with biological engineers on standby. Current queue response index: <b className="text-emerald-700">Under 2 minutes</b>.
                              </p>
                            </div>

                            <button className="w-full mt-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider rounded-xl cursor-pointer transition">
                              Launch Instant Live Chat
                            </button>
                          </div>
                        </div>

                      </div>

                    </div>

                    {/* Right 2 cols: Contact Forms */}
                    <div className="lg:col-span-2 space-y-4">
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs space-y-4">
                        <div className="flex items-center gap-1.5 border-b border-slate-100 pb-3">
                          <span className="text-xs font-black text-slate-900 uppercase">📬 Contact Forms</span>
                        </div>

                        <p className="text-[11px] text-slate-505 leading-normal font-semibold">
                          Submit a detailed request or feedback directly to our administrative team database.
                        </p>

                        {msgSuccess ? (
                          <div className="bg-emerald-50 border border-emerald-150 p-6 rounded-2xl text-center space-y-3 animate-in zoom-in-95">
                            <div className="bg-emerald-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto shadow-inner shadow-emerald-700/20">
                              <Check size={24} />
                            </div>
                            <h5 className="font-extrabold text-slate-800 text-sm">Form Transmitted!</h5>
                            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                              Your support submission was recorded successfully. An administrator will respond via phone or custom dashboard notification.
                            </p>
                            <button
                              type="button"
                              onClick={() => setMsgSuccess(false)}
                              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer"
                            >
                              Submit another query
                            </button>
                          </div>
                        ) : (
                          <form 
                            onSubmit={async (e) => {
                              e.preventDefault();
                              if (!msgSubject || !msgBody) {
                                alert("Kindly enter both a Subject and Message body.");
                                return;
                              }
                              setSendingMsg(true);
                              try {
                                await onAddRecord("messages", {
                                  sender: currentUserEmail,
                                  subject: msgSubject,
                                  message: msgBody,
                                  urgency: msgUrgency,
                                  timestamp: new Date().toISOString(),
                                  status: "Unread"
                                });
                                setMsgSubject("");
                                setMsgBody("");
                                setMsgUrgency("Low");
                                setMsgSuccess(true);
                              } catch (err) {
                                console.error(err);
                                alert("Error transmitting message to server. Ensure your backend connection is online.");
                              } finally {
                                setSendingMsg(false);
                              }
                            }}
                            className="space-y-4 text-left"
                          >
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-450 block">Your Email Address</label>
                              <input
                                type="text"
                                disabled
                                value={currentUserEmail}
                                className="w-full bg-slate-100 text-slate-500 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono font-bold"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Message Subject / Title</label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Requesting technical site calibration support"
                                value={msgSubject}
                                onChange={(e) => setMsgSubject(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Urgency Level Indicator</label>
                              <select
                                value={msgUrgency}
                                onChange={(e) => setMsgUrgency(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-black text-slate-750 cursor-pointer"
                              >
                                <option value="Low">Low (Standard Sourcing Query)</option>
                                <option value="Medium">Medium (Active order coordination)</option>
                                <option value="Critical">Critical (Immediate Emergency)</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Form Message / Feedback Body</label>
                              <textarea
                                rows={4}
                                required
                                placeholder="Enter your detailed query, feedback, or biological specifications here..."
                                value={msgBody}
                                onChange={(e) => setMsgBody(e.target.value)}
                                className="w-full bg-slate-55 border border-slate-200 px-3.5 py-3 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500 leading-relaxed scrollbar-thin"
                              />
                            </div>

                            <button
                              type="submit"
                              disabled={sendingMsg}
                              className="w-full bg-gradient-to-r from-emerald-600 to-teal-650 hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 text-white font-extrabold text-xs py-3 rounded-xl cursor-pointer shadow-md flex items-center justify-center gap-1.5"
                            >
                              <Send size={13} />
                              <span>{sendingMsg ? "Submitting Request..." : "Submit Support Ticket"}</span>
                            </button>
                          </form>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Tab 4: Customer & Contact Centre */}
              {contactTab === "contact_centre" && (
                <div className="space-y-6 text-left animate-in fade-in duration-300">
                  
                  {/* Hotline & Contact Information Header Widget */}
                  <div className="bg-slate-900 text-white rounded-3xl p-6 relative overflow-hidden shadow-xl border border-slate-850">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-1.5">
                        <span className="bg-teal-500/25 text-teal-300 text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full border border-teal-500/30">
                          Direct Contact Hotlines 24/7
                        </span>
                        <h3 className="text-lg font-black tracking-tight pt-1">Customer & Contact Centre Support</h3>
                        <p className="text-xs text-slate-450 leading-relaxed font-semibold max-w-xl">
                          Call our operations managers for instant supply dispatch, biosecure transit clearing, or spawning emergency consultations.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 shrink-0">
                        <div className="bg-slate-850 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                          <span className="text-[8px] text-slate-405 font-black uppercase tracking-wider block">Urgent Support Hotlines</span>
                          <div className="flex flex-col gap-1.5">
                            <a 
                              href="tel:+256771991331"
                              className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 border border-emerald-500/20 rounded-xl flex items-center justify-between gap-1.5 text-[10.5px] font-mono font-black text-emerald-400 tracking-tight transition"
                              title="Make instant call to support line 1"
                            >
                              <span className="flex items-center gap-1.5">
                                <Phone size={11} className="text-emerald-450 shrink-0 animate-bounce" />
                                <span>+256 771 991 331</span>
                              </span>
                              <span className="bg-emerald-500 text-slate-900 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase">Dial</span>
                            </a>
                            <a 
                              href="tel:+256200949411"
                              className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 border border-emerald-500/20 rounded-xl flex items-center justify-between gap-1.5 text-[10.5px] font-mono font-black text-emerald-400 tracking-tight transition"
                              title="Make instant call to support line 2"
                            >
                              <span className="flex items-center gap-1.5">
                                <Phone size={11} className="text-emerald-450 shrink-0" />
                                <span>+256 200 949 411</span>
                              </span>
                              <span className="bg-emerald-500 text-slate-900 text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase font-sans">Dial</span>
                            </a>
                          </div>
                        </div>
                        <div className="bg-slate-850 border border-slate-800 p-3.5 rounded-2xl space-y-2">
                          <span className="text-[8px] text-slate-405 font-black uppercase tracking-wider block">Operational Emails</span>
                          <div className="flex flex-col gap-1">
                            <a 
                              href="mailto:support@bluehatch.co.ug"
                              className="text-xs font-bold text-teal-300 hover:text-white transition flex items-center gap-1"
                            >
                              <span>✉️</span>
                              <span className="hover:underline">support@bluehatch.co.ug</span>
                            </a>
                            <a 
                              href="mailto:executive@bluehatch.co.ug"
                              className="text-xs font-bold text-teal-300 hover:text-white transition flex items-center gap-1"
                            >
                              <span>✉️</span>
                              <span className="hover:underline">executive@bluehatch.co.ug</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {ccSubmitSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-150 p-8 rounded-3xl text-center space-y-4 max-w-lg mx-auto py-10 animate-in zoom-in-95">
                      <div className="bg-emerald-500 text-white w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                        <Check size={28} />
                      </div>
                      <h4 className="font-black text-slate-900 text-base">Appointment Booked Successfully!</h4>
                      <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                        The Customer & Contact Centre form has been written to the live database. Your assigned staff and biosecurity experts will review your request.
                      </p>
                      <div className="bg-white border border-slate-150 p-4 rounded-2xl text-left text-[11px] space-y-1">
                        <div className="flex justify-between"><span className="text-slate-400">Customer:</span><b className="text-slate-800 font-extrabold">{ccCustomerName}</b></div>
                        <div className="flex justify-between"><span className="text-slate-400">Type:</span><b className="text-slate-800 font-extrabold">{ccAppointmentType}</b></div>
                        <div className="flex justify-between"><span className="text-slate-400">Schedule:</span><b className="text-slate-800 font-bold">{ccAppointmentDate} @ {ccAppointmentTime}</b></div>
                        <div className="flex justify-between"><span className="text-slate-400">Status:</span><b className="text-amber-600 font-mono font-black">{ccStatus}</b></div>
                      </div>
                      <div className="flex gap-3 justify-center pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setCcSubmitSuccess(false);
                            setCcCustomerName(currentUserEmail ? currentUserEmail.split("@")[0] : "");
                            setCcTransportMode("Car");
                            setCcVehiclePlate("");
                            setCcContactAddress("");
                            setCcEmail(currentUserEmail || "");
                            setCcContactNumber("");
                            setCcRelatedFishSales("");
                            setCcRelatedConsultancy("");
                            setCcAppointmentDate("");
                            setCcAppointmentTime("");
                            setCcStatus("Pending");
                            setCcStaffAssigned("");
                            setCcPurposeNotes("");
                            setCcFollowUpDetails("");
                            setCcCreatedBy("Customer self-service");
                            setCcGateFeePayment("Not Paid");
                            setCcBiosecurityStatus("Pending Verification");
                            setCcAiAnalysis("");
                          }}
                          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl cursor-pointer transition"
                        >
                          Book Another Appointment
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowContactUsModal(false);
                            setCcSubmitSuccess(false);
                          }}
                          className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 text-xs font-black rounded-xl cursor-pointer transition"
                        >
                          Close Contact Hub
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!ccCustomerName) {
                          alert("Kindly provide the Customer Name.");
                          return;
                        }
                        if (!ccAppointmentDate || !ccAppointmentTime) {
                          alert("Kindly fill both the Appointment Date and Time.");
                          return;
                        }
                        setCcSubmitting(true);
                        try {
                          await onAddRecord("appointments", {
                            customersName: ccCustomerName,
                            customerName: ccCustomerName,
                            transportMode: ccTransportMode,
                            contactInfo: `Address: ${ccContactAddress || "N/A"} | Email: ${ccEmail || "N/A"} | Phone: ${ccContactNumber || "N/A"}`,
                            appointmentType: ccAppointmentType,
                            relatedFishSales: ccRelatedFishSales || "None",
                            relatedConsultancy: ccRelatedConsultancy || "None",
                            dateTime: `${ccAppointmentDate} ${ccAppointmentTime}`,
                            status: ccStatus,
                            staffAssigned: ccStaffAssigned || "Manager",
                            notes: ccPurposeNotes,
                            followUpRequired: ccFollowUpDetails ? true : false,
                            followUpDetails: ccFollowUpDetails,
                            createdBy: ccCreatedBy || "Customer self-service",
                            vehiclePlate: ccVehiclePlate || "N/A",
                            gateFeePayment: ccGateFeePayment,
                            biosecurityStatus: ccBiosecurityStatus,
                            aiAnalysis: ccAiAnalysis || "No custom AI audit has been formulated."
                          });
                          setCcSubmitSuccess(true);
                        } catch (err) {
                          console.error("Error creating appointment:", err);
                          alert("Could not post appointment. Please check connection.");
                        } finally {
                          setCcSubmitting(false);
                        }
                      }}
                      className="space-y-6"
                    >
                      {/* SECTION 1: CUSTOMER'S FORM */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                          <div>
                            <span className="text-[10px] font-black text-emerald-650 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-150 uppercase tracking-wider">
                              Customer Self-Service Section
                            </span>
                            <h4 className="text-sm font-black text-slate-900 mt-2 uppercase tracking-wide">
                              CUSTOMER’S CONTACT APPOINTMENT FORM
                            </h4>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400 italic">
                            (TO BE FILLED BY THE CUSTOMER)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                          {/* Col 1 */}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">Customer's Name</label>
                            <input
                              type="text"
                              required
                              placeholder="Entity or individual name"
                              value={ccCustomerName}
                              onChange={(e) => setCcCustomerName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">Transport Mode</label>
                            <select
                              value={ccTransportMode}
                              onChange={(e) => setCcTransportMode(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                            >
                              <option value="Car">Car / SUV</option>
                              <option value="Motorcycle">Motorcycle (Boda Boda)</option>
                              <option value="Truck">Truck / Logistics Lorry</option>
                              <option value="Public Transport">Public Transport</option>
                              <option value="Foot">Foot / Walking</option>
                              <option value="others">Others</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">Vehicle Number Plate</label>
                            <input
                              type="text"
                              placeholder="e.g. UAY 123X"
                              value={ccVehiclePlate}
                              onChange={(e) => setCcVehiclePlate(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>
                        </div>

                        {/* Contact Information Group border wrapper */}
                        <div className="p-4 bg-slate-50/60 border border-slate-200/50 rounded-2xl space-y-4">
                          <h5 className="text-[10px] uppercase font-black text-slate-500 tracking-wider flex items-center gap-1.5 border-b border-slate-150 pb-2">
                            <UserCheck size={11} className="text-sky-655" /> Contact Information
                          </h5>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Contact Address</label>
                              <input
                                type="text"
                                placeholder="e.g. Mukono Town, District"
                                value={ccContactAddress}
                                onChange={(e) => setCcContactAddress(e.target.value)}
                                className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Email</label>
                              <input
                                type="email"
                                placeholder="e.g. contact@domain.com"
                                value={ccEmail}
                                onChange={(e) => setCcEmail(e.target.value)}
                                className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Contact Number</label>
                              <input
                                type="text"
                                placeholder="e.g. +256 701 222 333"
                                value={ccContactNumber}
                                onChange={(e) => setCcContactNumber(e.target.value)}
                                className="w-full bg-white border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">Appointment Type</label>
                            <select
                              value={ccAppointmentType}
                              onChange={(e) => setCcAppointmentType(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                            >
                              <option value="Fry/ Fingerling/ Table-size Fish order">Fry/ Fingerling/ Table-size Fish order</option>
                              <option value="Consultancy services">Consultancy services</option>
                              <option value="Farm visit">Farm visit</option>
                              <option value="Internship/mentorship">Internship/mentorship</option>
                              <option value="On-farm Stay">On-farm Stay</option>
                              <option value="Institutional Farm Field Trips">Institutional Farm Field Trips</option>
                              <option value="Agritourism">Agritourism</option>
                              <option value="R&D">R&D</option>
                              <option value="others">others</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Related Fish Sales</label>
                              <input
                                type="text"
                                placeholder="e.g. 5000 Tilapia Fry"
                                value={ccRelatedFishSales}
                                onChange={(e) => setCcRelatedFishSales(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Related Consultancy Services</label>
                              <input
                                type="text"
                                placeholder="e.g. Water Quality Check"
                                value={ccRelatedConsultancy}
                                onChange={(e) => setCcRelatedConsultancy(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">Appointment Date & Arrival Time</label>
                            <input
                              type="date"
                              required
                              value={ccAppointmentDate}
                              onChange={(e) => setCcAppointmentDate(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">Appointment Time</label>
                            <input
                              type="time"
                              required
                              value={ccAppointmentTime}
                              onChange={(e) => setCcAppointmentTime(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">Appointment Status</label>
                            <select
                              value={ccStatus}
                              onChange={(e) => setCcStatus(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-black text-amber-700 cursor-pointer"
                            >
                              <option value="Pending">Pending Approval</option>
                              <option value="Approved">Approved</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">Specify Staff to the visit</label>
                            <input
                              type="text"
                              placeholder="e.g. Dr. Agnes, Dr. Bobi"
                              value={ccStaffAssigned}
                              onChange={(e) => setCcStaffAssigned(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-500 block">Purpose / Notes (Kindly in details if need be)</label>
                          <textarea
                            rows={3}
                            placeholder="Provide operational details of the planned fish farm visit, biosecure constraints, or procurement size..."
                            value={ccPurposeNotes}
                            onChange={(e) => setCcPurposeNotes(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 px-3.5 py-3 rounded-xl text-xs font-semibold leading-relaxed focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      {/* SECTION 2: STAFF AND AI SECTION */}
                      {currentUserRole !== "customer" && (
                        <div className="bg-slate-50 border border-slate-250 rounded-3xl p-6 space-y-4">
                          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                            <div>
                              <span className="text-[10px] font-black text-sky-800 bg-sky-100 px-2.5 py-1 rounded border border-sky-200 uppercase tracking-wider">
                                Administrative & Artificial Intelligence Section
                              </span>
                              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide mt-2">
                                TO BE FILLED BY THE STAFF AND AI
                              </h4>
                            </div>
                            <Sparkles size={16} className="text-amber-500 animate-pulse" />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Created By</label>
                              <input
                                type="text"
                                placeholder="e.g. Customer self-service"
                                value={ccCreatedBy}
                                onChange={(e) => setCcCreatedBy(e.target.value)}
                                className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Farm Gate Entry Fee Payment</label>
                              <select
                                value={ccGateFeePayment}
                                onChange={(e) => setCcGateFeePayment(e.target.value)}
                                className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                              >
                                <option value="Not Paid">Not Paid</option>
                                <option value="Paid">Paid</option>
                                <option value="Invoiced">Invoiced</option>
                              </select>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-slate-500 block">Biosecurity Status</label>
                              <select
                                value={ccBiosecurityStatus}
                                onChange={(e) => setCcBiosecurityStatus(e.target.value)}
                                className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                              >
                                <option value="Pending Verification">Pending Verification</option>
                                <option value="Clean / Cleared">Clean / Cleared</option>
                                <option value="High Risk Detected">High Risk Detected</option>
                                <option value="Standard Protocol Followed">Standard Protocol Followed</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase font-bold text-slate-500 block">Follow-up Details</label>
                            <textarea
                              rows={2}
                              placeholder="To be added by reviewing biosecure officers..."
                              value={ccFollowUpDetails}
                              onChange={(e) => setCcFollowUpDetails(e.target.value)}
                              className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden"
                            />
                          </div>

                          {/* Artificial Intelligence Analysis Field */}
                          <div className="bg-white/95 border border-slate-200 p-5 rounded-2xl space-y-3 shadow-inner">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                              <div className="flex items-center gap-2">
                                <Sparkles size={14} className="text-amber-500" />
                                <span className="text-[10px] font-black uppercase text-slate-700 tracking-wider">
                                  Automated Biosecurity & Compliance AI Analysis
                                </span>
                              </div>

                              <button
                                type="button"
                                disabled={ccIsAiAnalyzing}
                                onClick={() => {
                                  setCcIsAiAnalyzing(true);
                                  setTimeout(() => {
                                    const riskLevel = ccBiosecurityStatus === "High Risk Detected" ? "🔴 HEAVY BIORISK" : "🟢 NEGLIGIBLE OR CONTROLLED";
                                    const dynamicResponse = `[BLUEHATCH AQUA-GUARD AI SYNTHESIS - SECURE ACCESS APPROVED]
  1. BIORISK CLASSIFICATION: ${riskLevel}
  2. LOGISTICAL AUDIT: Transport via ${ccTransportMode || "Undefined Vehicle"} [Plate ID: ${ccVehiclePlate || "NONE_DETECTED"}] requiring tire bath rinse.
  3. FINANCIAL CLEARANCE: Payment state is configured to [${ccGateFeePayment}]. Gate access fee must be cleared for entry.
  4. SANITARY GUIDANCE FOR ${ccStaffAssigned || "ASSIGNED SPECIALIST"}:
     - Enforce immediate sterile rubber clothing and shoe sterilization procedures prior to entering Nile Tilapia breeder and nursery structures.
     - Restrict external fish containment carrying tanks from entering breeding quarantine zones.
     - Record and update daily water metrics following physical contact.`;
                                    setCcAiAnalysis(dynamicResponse);
                                    setCcIsAiAnalyzing(false);
                                  }, 800);
                                }}
                                className="bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-60 border border-amber-600 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors"
                              >
                                {ccIsAiAnalyzing ? (
                                  <>
                                    <span className="animate-spin inline-block w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                                    <span>Evaluating Biorisk...</span>
                                  </>
                                ) : (
                                  <>
                                    <Sparkles size={11} />
                                    <span>Evaluate with AI</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <textarea
                              rows={4}
                              readOnly
                              placeholder="Click 'Evaluate with AI' to trigger automated recxpats safety analysis based on your transport, biosecurity status, and entry fee payment."
                              value={ccAiAnalysis}
                              onChange={(e) => setCcAiAnalysis(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-3 rounded-xl text-xs font-mono text-slate-705 leading-relaxed font-semibold focus:outline-hidden"
                            />
                          </div>
                        </div>
                      )}

                      {/* Main Big Form Action buttons */}
                      <button
                        type="submit"
                        disabled={ccSubmitting}
                        className="w-full bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-750 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 text-white text-xs font-black uppercase tracking-widest py-4 rounded-2xl cursor-pointer shadow-lg transition-all transform active:scale-99"
                      >
                        {ccSubmitting ? "Book-In & Writing Records..." : "Submit Customer Appointment Ticket ✔"}
                      </button>
                    </form>
                  )}

                </div>
              )}


              {/* Tab 4: Customer & Contact Centre */}
              {false && (
                <div className="space-y-6 text-left animate-in fade-in duration-300">
                  
                  {/* Emergency Support Header Card */}
                  <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-transparent border border-emerald-200/50 p-6 rounded-3xl relative overflow-hidden">
                    <span className="bg-emerald-100 text-emerald-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full border border-emerald-200">
                      Customer & Contact Support Hotlines
                    </span>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight mt-2 pb-1">Customer & Contact Centre</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* Hotlines */}
                      <div className="bg-white/85 backdrop-blur-2xs border border-emerald-150 p-4 rounded-2xl space-y-2">
                        <span className="text-[9px] font-black text-slate-450 block uppercase tracking-wider">Voice & Support Hotlines</span>
                        <div className="space-y-2">
                          <a 
                            href="tel:+256771991331" 
                            className="text-sm font-black text-slate-900 flex items-center gap-2 hover:text-emerald-700 font-mono tracking-tight hover:underline"
                          >
                            <Phone size={13} className="text-emerald-600" />
                            <span>+256771991331</span>
                          </a>
                          <a 
                            href="tel:+256200949411" 
                            className="text-sm font-black text-slate-900 flex items-center gap-2 hover:text-emerald-700 font-mono tracking-tight hover:underline"
                          >
                            <Phone size={13} className="text-emerald-600" />
                            <span>+256200949411</span>
                          </a>
                        </div>
                      </div>

                      {/* Emails */}
                      <div className="bg-white/85 backdrop-blur-2xs border border-emerald-150 p-4 rounded-2xl space-y-2">
                        <span className="text-[9px] font-black text-slate-450 block uppercase tracking-wider">Corporate & Sourcing Emails</span>
                        <div className="space-y-1">
                          <div className="text-[11px] font-extrabold text-slate-400">Emails:</div>
                          <a 
                            href="mailto:info@bluehatch.co.ug" 
                            className="text-xs font-bold text-slate-800 hover:text-indigo-700 block font-mono tracking-tight hover:underline"
                          >
                            info@bluehatch.co.ug
                          </a>
                          <a 
                            href="mailto:orders@bluehatch.co.ug" 
                            className="text-xs font-bold text-slate-800 hover:text-indigo-700 block font-mono tracking-tight hover:underline"
                          >
                            orders@bluehatch.co.ug
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {ccSubmitSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-3xl text-center space-y-4 max-w-xl mx-auto shadow-xs animate-in zoom-in-95">
                      <div className="bg-emerald-500 text-white w-14 h-14 rounded-full flex items-center justify-center mx-auto shadow-md">
                        <Check size={28} />
                      </div>
                      <h4 className="text-lg font-black text-slate-900">Appointment Registered Successfully!</h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-md mx-auto">
                        The appointment record for <b>{ccCustomerName}</b> was written to the primary appointments database. Our team will review the biosecurity report and verify your scheduled arrival.
                      </p>
                      
                      <div className="border border-slate-200 rounded-2xl p-4 bg-white space-y-1.5 text-left text-xs font-semibold text-slate-705">
                        <div><span className="text-slate-400">Appointment Type:</span> {ccAppointmentType}</div>
                        <div><span className="text-slate-400">Scheduled Date:</span> {ccAppointmentDate || "Today"} @ {ccAppointmentTime || "Flexible"}</div>
                        <div><span className="text-slate-400">Biosecurity Assessment:</span> {ccBiosecurityStatus}</div>
                        {ccAiAnalysis && (
                          <div className="border-t border-slate-100 pt-2 mt-2">
                            <span className="text-slate-400 font-black block text-[10px] uppercase mb-1">AI Safety Analysis Summary:</span>
                            <p className="text-[11px] text-emerald-850 font-mono bg-emerald-50/50 p-2.5 rounded-lg font-bold border border-emerald-100">{ccAiAnalysis}</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 flex justify-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setCcSubmitSuccess(false);
                            setCcCustomerName("");
                            setCcVehiclePlate("");
                            setCcContactAddress("");
                            setCcContactNumber("");
                            setCcRelatedFishSales("");
                            setCcRelatedConsultancy("");
                            setCcAppointmentDate("");
                            setCcAppointmentTime("");
                            setCcPurposeNotes("");
                            setCcFollowUpDetails("");
                            setCcAiAnalysis("");
                          }}
                          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl cursor-pointer transition shadow-xs"
                        >
                          Fill New Appointment Form
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form 
                      onSubmit={async (e) => {
                        e.preventDefault();
                        if (!ccCustomerName) {
                          alert("Please fill in the Customer's Name.");
                          return;
                        }
                        if (!ccContactNumber || !ccContactAddress) {
                          alert("Please fill in the Contact Information details.");
                          return;
                        }

                        setCcSubmitting(true);
                        try {
                          const payload = {
                            customersName: ccCustomerName,
                            customerName: ccCustomerName,
                            transportMode: ccTransportMode,
                            contactInfo: `Address: ${ccContactAddress} | Tel: ${ccContactNumber} | Email: ${ccEmail}`,
                            appointmentType: ccAppointmentType,
                            relatedFishSales: ccRelatedFishSales || "None specified",
                            relatedConsultancy: ccRelatedConsultancy || "None specified",
                            dateTime: `${ccAppointmentDate || new Date().toISOString().split('T')[0]} ${ccAppointmentTime || "12:00"}`,
                            status: ccStatus,
                            staffAssigned: ccStaffAssigned || "Fish Farm Supervisor",
                            notes: ccPurposeNotes,
                            followUpRequired: !!ccFollowUpDetails,
                            followUpDetails: ccFollowUpDetails,
                            createdBy: ccCreatedBy || currentUserEmail,
                            vehiclePlate: ccVehiclePlate || "No Vehicle (Foot/Public)",
                            gateFeePayment: ccGateFeePayment,
                            biosecurityStatus: ccBiosecurityStatus,
                            aiAnalysis: ccAiAnalysis || "No auto assessment was executed.",
                            healthLink: ""
                          };

                          await onAddRecord("appointments", payload);
                          setCcSubmitSuccess(true);
                        } catch (err) {
                          console.error(err);
                          alert("Error committing appointment request. Please verify connection.");
                        } finally {
                          setCcSubmitting(false);
                        }
                      }}
                      className="space-y-6"
                    >
                      {/* Section 1: Filled By Customer */}
                      <div className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
                        <div className="border-b border-slate-100 pb-3 text-left">
                          <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                            📝 CUTOMER’S CONTACT APPOINTMENT FORM
                          </h4>
                          <span className="text-[10px] text-slate-400 font-extrabold uppercase block tracking-wider mt-0.5">
                            (TO BE FILLED BY THE CUSTOMER)
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          {/* Customer's Name */}
                          <div className="space-y-1 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Customer’s Name</label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450 text-xs">👤</span>
                              <input 
                                type="text"
                                required
                                placeholder="e.g. Kenneth Lutaaya"
                                value={ccCustomerName}
                                onChange={(e) => setCcCustomerName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>
                          </div>

                          {/* Transport Mode */}
                          <div className="space-y-1 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Transport Mode</label>
                            <select
                              value={ccTransportMode}
                              onChange={(e) => setCcTransportMode(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-black text-slate-750 cursor-pointer"
                            >
                              <option value="Car">Personal Car / Private Pickup</option>
                              <option value="Lorry">Commercial Lorry / Feed Truck</option>
                              <option value="Motorcycle">Motorcycle / Boda Boda</option>
                              <option value="Public Transport">Public Commuter Taxi</option>
                              <option value="Foot">Walking / Neighborhood Footway</option>
                              <option value="Other">Other Mode</option>
                            </select>
                          </div>

                          {/* Vehicle Number Plate */}
                          <div className="space-y-1 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Vehicle Number Plate</label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-450 text-xs">🚙</span>
                              <input 
                                type="text"
                                placeholder="e.g. UBF 224Y"
                                value={ccVehiclePlate}
                                onChange={(e) => setCcVehiclePlate(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 pl-9 pr-3.5 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-emerald-500 uppercase"
                              />
                            </div>
                          </div>

                          {/* Contact address */}
                          <div className="space-y-1 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Contact address</label>
                            <input 
                              type="text"
                              required
                              placeholder="e.g. Jinja Highway Road, Mukono"
                              value={ccContactAddress}
                              onChange={(e) => setCcContactAddress(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          {/* Email */}
                          <div className="space-y-1 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Email</label>
                            <input 
                              type="email"
                              required
                              placeholder="e.g. customer@domain.com"
                              value={ccEmail}
                              onChange={(e) => setCcEmail(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          {/* Contact Number */}
                          <div className="space-y-1 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block font-semibold">Contact Number</label>
                            <input 
                              type="tel"
                              required
                              placeholder="e.g. +256 771 991 331"
                              value={ccContactNumber}
                              onChange={(e) => setCcContactNumber(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          {/* Appointment Type Dropdown */}
                          <div className="space-y-1 md:col-span-2 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Appointment Type</label>
                            <select
                              value={ccAppointmentType}
                              onChange={(e) => setCcAppointmentType(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-black text-slate-750 cursor-pointer"
                            >
                              <option value="Fry/ Fingerling/ Table-size Fish order">Fry/ Fingerling/ Table-size Fish order</option>
                              <option value="Consultancy services">Consultancy services</option>
                              <option value="Farm visit">Farm visit</option>
                              <option value="Internship/mentorship">Internship/mentorship</option>
                              <option value="On-farm Stay">On-farm Stay</option>
                              <option value="Institutional Farm Field Trips">Institutional Farm Field Trips</option>
                              <option value="Agritourism">Agritourism</option>
                              <option value="R&D">R&D</option>
                              <option value="others">others</option>
                            </select>
                          </div>

                          {/* Related fish sales */}
                          <div className="space-y-1 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Related fish sales</label>
                            <input 
                              type="text"
                              placeholder="e.g. Buy 10,000 Nile Tilapia fry"
                              value={ccRelatedFishSales}
                              onChange={(e) => setCcRelatedFishSales(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          {/* Related Consultancy Services */}
                          <div className="space-y-1 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Related Consultancy Services</label>
                            <input 
                              type="text"
                              placeholder="e.g. Spawn optimization advice"
                              value={ccRelatedConsultancy}
                              onChange={(e) => setCcRelatedConsultancy(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          {/* Appointment Date & Arrival Time */}
                          <div className="space-y-1 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Appointment Date & Arrival Time</label>
                            <input 
                              type="date"
                              required
                              value={ccAppointmentDate}
                              onChange={(e) => setCcAppointmentDate(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-bold font-mono focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                            />
                          </div>

                          {/* Appointment Time */}
                          <div className="space-y-1 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Appointment Time</label>
                            <input 
                              type="time"
                              required
                              value={ccAppointmentTime}
                              onChange={(e) => setCcAppointmentTime(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-bold font-mono focus:outline-hidden focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                            />
                          </div>

                          {/* Appointment status */}
                          <div className="space-y-1 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Appointment Status</label>
                            <select
                              value={ccStatus}
                              onChange={(e) => setCcStatus(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-black text-slate-705 cursor-pointer"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Scheduled">Scheduled</option>
                              <option value="Completed">Completed</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </div>

                          {/* Specify Staff to the visit */}
                          <div className="space-y-1 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Specify Staff to the visit</label>
                            <input 
                              type="text"
                              placeholder="e.g. Dr. Jalon"
                              value={ccStaffAssigned}
                              onChange={(e) => setCcStaffAssigned(e.target.value)}
                              className="w-full bg-slate-55 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
                            />
                          </div>

                          {/* Purpose/ Notes */}
                          <div className="space-y-1 md:col-span-2 block text-left">
                            <label className="text-[10px] uppercase font-black text-slate-500 block">Purpose/ Notes, (Kindly in details if need be)</label>
                            <textarea 
                              rows={3}
                              placeholder="Describe your appointment purpose..."
                              value={ccPurposeNotes}
                              onChange={(e) => setCcPurposeNotes(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden focus:ring-1 focus:ring-emerald-500 leading-relaxed"
                            />
                          </div>

                        </div>
                      </div>

                      {/* Section 2: Filled By Staff and AI */}
                      {currentUserRole !== "customer" && (
                        <div className="bg-slate-55 border border-slate-200 rounded-3xl p-5 md:p-6 shadow-xs space-y-4">
                          <div className="border-b border-slate-200 pb-3 block text-left">
                            <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase">
                              TO BE FILLED BY THE STAFF AND AI
                            </h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Follow up Details */}
                            <div className="space-y-1 md:col-span-2 block text-left">
                              <label className="text-[10px] uppercase font-black text-slate-500 block">Follow up Details</label>
                              <textarea 
                                rows={2}
                                placeholder="Disinfection protocols, diagnostic reports..."
                                value={ccFollowUpDetails}
                                onChange={(e) => setCcFollowUpDetails(e.target.value)}
                                className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold leading-relaxed focus:outline-hidden"
                              />
                            </div>

                            {/* Created by */}
                            <div className="space-y-1 block text-left">
                              <label className="text-[10px] uppercase font-black text-slate-500 block">Created by</label>
                              <input 
                                type="text"
                                value={ccCreatedBy}
                                onChange={(e) => setCcCreatedBy(e.target.value)}
                                className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold"
                              />
                            </div>

                            {/* Farm Gate Entry Fee Payment Dropdown */}
                            <div className="space-y-1 block text-left">
                              <label className="text-[10px] uppercase font-black text-slate-500 block">Farm Gate Entry Fee Payment</label>
                              <select
                                value={ccGateFeePayment}
                                onChange={(e) => setCcGateFeePayment(e.target.value)}
                                className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-black text-slate-705 cursor-pointer"
                              >
                                <option value="Not Paid">Not Paid</option>
                                <option value="Paid">Paid</option>
                                <option value="Invoiced">Invoiced</option>
                              </select>
                            </div>

                            {/* Biosecurity Status */}
                            <div className="space-y-1 md:col-span-2 block text-left">
                              <label className="text-[10px] uppercase font-black text-slate-500 block">Biosecurity Status</label>
                              <input 
                                type="text"
                                value={ccBiosecurityStatus}
                                onChange={(e) => setCcBiosecurityStatus(e.target.value)}
                                className="w-full bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-semibold focus:outline-hidden"
                                placeholder="e.g. Safe / Hand Sanitization required"
                              />
                            </div>

                          </div>

                          {/* AI Analysis */}
                          <div className="bg-emerald-500/5 border border-emerald-250 p-4.5 rounded-2xl space-y-3 block text-left">
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-[11px] font-black text-emerald-950 uppercase tracking-wider flex items-center gap-1">
                                <span>🧬</span> <span>AI Analysis</span>
                              </span>
                              <button
                                type="button"
                                disabled={ccIsAiAnalyzing}
                                onClick={() => {
                                  setCcIsAiAnalyzing(true);
                                  setTimeout(() => {
                                    const safetyIndex = Math.floor(Math.random() * 15) + 82;
                                    const advice = ccTransportMode === "Lorry"
                                      ? `Lorry transportation requires commercial biosecurity tire sanitization immediately upon gate entry. Approved to proceed.`
                                      : `Standard private logistics vector identified with low biological entry index (${safetyIndex}% safety). General hand washing and shoe bath disinfection recommended.`;
                                    setCcAiAnalysis(`[AI SITE ASSESSOR] Safety Index: ${safetyIndex}% | ${advice}`);
                                    setCcBiosecurityStatus(`Cleared (AI Index: ${safetyIndex}%)`);
                                    setCcIsAiAnalyzing(false);
                                  }, 1000);
                                }}
                                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-[10px] font-black uppercase px-2.5 py-1.5 rounded-lg cursor-pointer transition"
                              >
                                {ccIsAiAnalyzing ? "Evaluating AI..." : "✨ Run AI Analysis"}
                              </button>
                            </div>

                            {ccAiAnalysis ? (
                              <div className="bg-white/95 border border-emerald-150 p-3.5 rounded-xl text-[10.5px] leading-relaxed text-slate-750 font-mono">
                                {ccAiAnalysis}
                              </div>
                            ) : (
                              <p className="text-[10px] text-slate-500 font-semibold leading-normal">
                                Run the Biosecurity AI Assessor to execute safety evaluations of vectors, vehicle parameters, and recxpats goals.
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Main Submit Button */}
                      <button
                        type="submit"
                        disabled={ccSubmitting}
                        className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white font-black text-xs py-3.5 rounded-2xl cursor-pointer shadow-md tracking-wider uppercase transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 size={14} className="text-emerald-400" />
                        <span>{ccSubmitting ? "Submitting..." : "Submit Client Appointment Ticket"}</span>
                      </button>

                    </form>
                  )}

                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="bg-white p-6 border-t border-slate-200 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => {
                  setShowContactUsModal(false);
                  setMsgSubject("");
                  setMsgBody("");
                  setMsgUrgency("Low");
                  setMsgSuccess(false);
                }}
                className="px-5 py-2 hover:bg-slate-200 text-slate-650 text-xs font-black rounded-xl cursor-pointer"
              >
                Close Hub
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
