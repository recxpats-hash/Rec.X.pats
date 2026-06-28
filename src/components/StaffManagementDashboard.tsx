import React, { useState, useEffect } from "react";
import { 
  Users, UserPlus, ShieldAlert, CheckCircle, Clock, Calendar, AlertTriangle, 
  Search, Eye, Plus, Trash2, Filter, Mail, Phone, MapPin, Cloudy, Sun, 
  Wind, Thermometer, Droplet, Send, Bell, Star, TrendingUp, BarChart2,
  ListTodo, Info, Compass, Smartphone, CheckSquare, Activity, AlertCircle, Sparkles, Check, Play, RefreshCw, EyeOff
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie, Legend
} from "recharts";
import { StaffActivityRecord } from "../types";

// Standard Staff Member Interface for Directory
interface StaffMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  efficiency: number; // Percentage 80-100
  activeTasks: number;
  avatar: string;
}

// Initial directory list
const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: "staff-1",
    name: "Denis Sserwadda",
    role: "recxpats Manager & Broodstock Expert",
    email: "denis.okello@bluehatch.io",
    phone: "+256 702 334 110",
    efficiency: 97,
    activeTasks: 3,
    avatar: "👨‍🌾"
  },
  {
    id: "staff-2",
    name: "Florence Namubiru",
    role: "Hatchery Specialist & Pathology Inspector",
    email: "florence.namubiru@bluehatch.io",
    phone: "+256 755 889 203",
    efficiency: 94,
    activeTasks: 2,
    avatar: "👩‍💼"
  },
  {
    id: "staff-3",
    name: "Albert Mukasa",
    role: "Feed Logistics and System Technician",
    email: "albert.mukasa@bluehatch.io",
    phone: "+256 788 122 994",
    efficiency: 89,
    activeTasks: 4,
    avatar: "👨‍💻"
  },
  {
    id: "staff-4",
    name: "Dr. Emily Jalon",
    role: "Veterinary Officer (Consultant)",
    email: "dr.jalon@aquaconsult.ug",
    phone: "+256 711 556 770",
    efficiency: 96,
    activeTasks: 1,
    avatar: "👩‍⚕️"
  }
];

// Initial Tasks Scheduled for Planner
interface ScheduledTask {
  id: string;
  taskType: string;
  staffName: string;
  areaType: "Hatchery" | "Grow Out Pond" | "Management" | "Office";
  location: string;
  scheduledDate: string;
  urgency: "High" | "Medium" | "Low";
  status: "Assigned" | "Completed" | "Pending Reminder" | "Overdue";
  notes?: string;
}

const INITIAL_SCHEDULED_TASKS: ScheduledTask[] = [
  {
    id: "sc-1",
    taskType: "Water Quality Analysis",
    staffName: "Florence Namubiru",
    areaType: "Hatchery",
    location: "Larval Rearing Sector D",
    scheduledDate: "2026-06-22",
    urgency: "High",
    status: "Assigned",
    notes: "Conduct photometer checks on nitrite / ammonia build-up."
  },
  {
    id: "sc-2",
    taskType: "Feeding fish",
    staffName: "Albert Mukasa",
    areaType: "Grow Out Pond",
    location: "Earthen Pond F-5",
    scheduledDate: "2026-06-22",
    urgency: "Medium",
    status: "Pending Reminder",
    notes: "Administer 2.5mm protein rich starter meal pellets."
  },
  {
    id: "sc-3",
    taskType: "Mowing Ponds environment",
    staffName: "Albert Mukasa",
    areaType: "Grow Out Pond",
    location: "Dike Buffer Area C",
    scheduledDate: "2026-06-21",
    urgency: "Low",
    status: "Completed",
    notes: "Cleared weeds to reduce insect pests habitat."
  },
  {
    id: "sc-4",
    taskType: "Health Check",
    staffName: "Dr. Emily Jalon",
    areaType: "Management",
    location: "Quarantine Tank Alpha",
    scheduledDate: "2026-06-20",
    urgency: "High",
    status: "Overdue",
    notes: "Examine broodstock for bacterial columnaris lesions."
  }
];

// Mock sensor and logs
interface EnvironmentalSensorData {
  pondName: string;
  temperature: number;
  ph: number;
  doValue: number; // dissolved oxygen
  status: "Optimal" | "Critical" | "Warning";
  alertText?: string;
}

const MOCK_SENSORS: EnvironmentalSensorData[] = [
  { pondName: "Hatchery Incubator-1", temperature: 27.4, ph: 7.2, doValue: 6.8, status: "Optimal" },
  { pondName: "Hatchery Larval-4", temperature: 28.1, ph: 6.9, doValue: 4.2, status: "Warning", alertText: "Dissolved Oxygen dipping below safety standard of 5.0 mg/L" },
  { pondName: "Pond F-5 Grow-out", temperature: 26.5, ph: 7.8, doValue: 5.9, status: "Optimal" },
  { pondName: "Pond F-3 Grow-out", temperature: 29.2, ph: 8.4, doValue: 3.5, status: "Critical", alertText: "Algae bloom elevated ph (8.4) and low overnight oxygen levels triggers security caution." },
];

interface StaffManagementDashboardProps {
  staffActivities: StaffActivityRecord[];
  staffMembers?: any[];
  scheduledTasks?: any[];
  dbLoaded?: boolean;
  onAddRecord: (model: string, data: any) => Promise<void>;
  onDeleteRecord: (model: string, id: string) => Promise<void>;
  onUpdateRecord?: (model: string, id: string, data: any) => Promise<void>;
  readOnly: boolean;
  waterQuality?: any[];
  ponds?: any[];
}

export default function StaffManagementDashboard({
  staffActivities = [],
  staffMembers = [],
  scheduledTasks = [],
  dbLoaded = false,
  onAddRecord,
  onDeleteRecord,
  onUpdateRecord,
  readOnly,
  waterQuality = [],
  ponds = []
}: StaffManagementDashboardProps) {
  
  // Dashboard primary tab navigation
  const [subTab, setSubTab] = useState<"overview" | "activities" | "staff" | "planner">("overview");

  // Notifications State (Auto-assigned when items change)
  interface AlertNotification {
    id: string;
    text: string;
    time: string;
    type: "new_task" | "alert" | "info" | "success";
    staffName?: string;
  }

  const [notifications, setNotifications] = useState<AlertNotification[]>([
    { id: "notif-1", text: "New Task Registered: Water analysis needed at Hatchery Larval Sector D", time: "Just now", type: "new_task", staffName: "Florence Namubiru" },
    { id: "notif-2", text: "Water Level alert: Pond F-3 sensor reporting low overnight biological oxygen index.", time: "15 min ago", type: "alert" },
    { id: "notif-3", text: "Activity logged by Albert Mukasa: Harvesting table size fish in Grow-out Pond-2", time: "2 hours ago", type: "success", staffName: "Albert Mukasa" },
    { id: "notif-4", text: "Workload Balance AI Suggestion: Task schedules adjusted automatically to limit staff overtime risk during breeding cycle.", time: "5 hours ago", type: "info" }
  ]);

  // Derived dynamically from database synchronization
  const staffList = (dbLoaded || (staffMembers && staffMembers.length > 0)) ? staffMembers : INITIAL_STAFF_MEMBERS;
  const schedules = (dbLoaded || (scheduledTasks && scheduledTasks.length > 0)) ? scheduledTasks : INITIAL_SCHEDULED_TASKS;

  // Form states for Logging Daily tasks
  const [logTaskType, setLogTaskType] = useState("Water Quality Analysis");
  const [logStaffName, setLogStaffName] = useState(INITIAL_STAFF_MEMBERS[0].name);
  const [logLocation, setLogLocation] = useState("Hatchery Incubator Row D");
  const [logAreaType, setLogAreaType] = useState<"Hatchery" | "Grow Out Pond" | "Management" | "Office">("Hatchery");
  const [logTimeSpent, setLogTimeSpent] = useState("2.5");
  const [logStatus, setLogStatus] = useState<"Pending" | "Completed" | "Overdue" | "In Progress">("Completed");
  const [logNotes, setLogNotes] = useState("");
  const [logWeather, setLogWeather] = useState("Sunny - Clear Sky");
  const [logPhotoEmoji, setLogPhotoEmoji] = useState("⚙️");
  const [logSensorValue, setLogSensorValue] = useState("Temp 27.5C • ph 7.1 • DO 6.2mg/L");

  // Filter conditions for local table search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStaff, setFilterStaff] = useState("All");
  const [filterAreaType, setFilterAreaType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Form states for Directory Add
  const [newStaffName, setNewStaffName] = useState("");
  const [newStaffRole, setNewStaffRole] = useState("");
  const [newStaffEmail, setNewStaffEmail] = useState("");
  const [newStaffPhone, setNewStaffPhone] = useState("");
  const [newStaffAvatar, setNewStaffAvatar] = useState("👨‍🌾");
  const [isAddingStaffModalOpen, setIsAddingStaffModalOpen] = useState(false);

  // Form states for Task Planner Calendar Add
  const [planTaskType, setPlanTaskType] = useState("Feeding fish");
  const [planStaff, setPlanStaff] = useState(INITIAL_STAFF_MEMBERS[0].name);
  const [planAreaType, setPlanAreaType] = useState<"Hatchery" | "Grow Out Pond" | "Management" | "Office">("Hatchery");
  const [planLocation, setPlanLocation] = useState("Hatchery Broodstock Tank-1");
  const [planDate, setPlanDate] = useState("2026-06-22");
  const [planUrgency, setPlanUrgency] = useState<"High" | "Medium" | "Low">("Medium");
  const [planNotes, setPlanNotes] = useState("");
  const [isPlanningModalOpen, setIsPlanningModalOpen] = useState(false);

  // Auto notification triggers
  const triggerNotification = (text: string, type: "new_task" | "alert" | "info" | "success", staffName?: string) => {
    const newNotif: AlertNotification = {
      id: `notif-${Date.now()}`,
      text,
      time: "Just now",
      type,
      staffName
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 7)]); // restrict to last 8 elements
  };

  // Log Daily Activity Action submit
  const handleLogActivitySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logStaffName || !logTaskType) return;

    // Map staff name to role
    const matchedStaff = staffList.find(s => s.name === logStaffName);
    const assignedRole = matchedStaff ? matchedStaff.role : "recxpats Technician";

    // Combine standard and custom fields into taskDetails
    const fullNotesString = JSON.stringify({
      location: logLocation,
      areaType: logAreaType,
      weatherConditions: logWeather,
      photoAttachment: logPhotoEmoji,
      environmentalSensors: logSensorValue,
      completionStatus: logStatus,
      rawNotes: logNotes
    });

    const payload = {
      taskType: logTaskType,
      staffName: logStaffName,
      role: assignedRole,
      activityDetails: `${logTaskType} completed at ${logLocation} (${logAreaType})`,
      durationMinutes: parseFloat(logTimeSpent) * 60 || 120,
      date: new Date().toISOString().split("T")[0],
      additionalNotes: fullNotesString
    };

    try {
      await onAddRecord("staffActivities", payload);
      triggerNotification(
        `Activity logged successfully: ${logTaskType} performed by ${logStaffName}`,
        "success",
        logStaffName
      );
      // Reset form variables to default
      setLogNotes("");
      setLogTimeSpent("2");
    } catch (err) {
      console.error(err);
    }
  };

  // Helper parser for custom attributes inside stringified notes
  const parseExtendedNotes = (additionalNotesStr?: string) => {
    if (!additionalNotesStr) return {
      location: "Main Hatchery",
      areaType: "Hatchery",
      weatherConditions: "Sunny - Clear",
      photoAttachment: "⚙️",
      environmentalSensors: "Normal telemetry readings",
      completionStatus: "Completed",
      rawNotes: ""
    };

    try {
      if (additionalNotesStr.startsWith("{")) {
        return JSON.parse(additionalNotesStr);
      }
    } catch {
      // fallback
    }

    // fallback when not JSON
    return {
      location: "Main Hatchery Area",
      areaType: "Hatchery" as const,
      weatherConditions: "Optimal Parameters",
      photoAttachment: "📋",
      environmentalSensors: "N/A",
      completionStatus: "Completed" as const,
      rawNotes: additionalNotesStr
    };
  };

  // Add new staff directory profile action
  const handleAddStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffName || !newStaffRole) return;

    const newStaff = {
      id: `staff-${Date.now()}`,
      name: newStaffName,
      role: newStaffRole,
      email: newStaffEmail || `${newStaffName.toLowerCase().replace(/\s+/g, ".")}@bluehatch.io`,
      phone: newStaffPhone || "+256 700 000 000",
      efficiency: 90 + Math.floor(Math.random() * 10),
      activeTasks: 0,
      avatar: newStaffAvatar
    };

    try {
      await onAddRecord("staffMembers", newStaff);
      triggerNotification(`Staff Created: Profile registered for ${newStaffName} (${newStaffRole})`, "info", newStaffName);
    } catch (err) {
      console.error(err);
    }

    // reset
    setNewStaffName("");
    setNewStaffRole("");
    setNewStaffEmail("");
    setNewStaffPhone("");
    setIsAddingStaffModalOpen(false);
  };

  // Delete staff profile from directory
  const handleDeleteStaff = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the staff directory?`)) {
      try {
        await onDeleteRecord("staffMembers", id);
        triggerNotification(`Staff Removed: Profile archived for ${name}`, "info");
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Add Planned Task of upcoming responsibilities
  const handlePlanTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!planStaff || !planTaskType) return;

    const newTask: ScheduledTask = {
      id: `sc-${Date.now()}`,
      taskType: planTaskType,
      staffName: planStaff,
      areaType: planAreaType,
      location: planLocation,
      scheduledDate: planDate,
      urgency: planUrgency,
      status: "Assigned",
      notes: planNotes
    };

    try {
      await onAddRecord("scheduledTasks", newTask);

      // Update staff directory active count in DB
      const staffMember = staffList.find(s => s.name === planStaff);
      if (staffMember && onUpdateRecord) {
        await onUpdateRecord("staffMembers", staffMember.id, {
          ...staffMember,
          activeTasks: (staffMember.activeTasks || 0) + 1
        });
      }

      triggerNotification(
        `New Task Automatically Dispatched & Notified to ${planStaff}: ${planTaskType} scheduled on ${planDate}`,
        "new_task",
        planStaff
      );
    } catch (err) {
      console.error(err);
    }

    // Reset and close
    setPlanNotes("");
    setIsPlanningModalOpen(false);
  };

  // Complete a scheduled task
  const handleCompleteScheduledTask = async (task: ScheduledTask) => {
    // Save to daily log as well!
    const fullNotesString = JSON.stringify({
      location: task.location,
      areaType: task.areaType,
      weatherConditions: "Integrated System Normal",
      photoAttachment: "✅",
      environmentalSensors: "Normal Range",
      completionStatus: "Completed",
      rawNotes: task.notes || "Completed from automatic planner registry."
    });

    const parsedMinutes = 120; // 2 hours default
    const matchedStaff = staffList.find(s => s.name === task.staffName);
    const assignedRole = matchedStaff ? matchedStaff.role : "recxpats Technician";

    const payload = {
      taskType: task.taskType,
      staffName: task.staffName,
      role: assignedRole,
      activityDetails: `[Completed Planner Task] ${task.taskType} successfully completed at ${task.location}`,
      durationMinutes: parsedMinutes,
      date: new Date().toISOString().split("T")[0],
      additionalNotes: fullNotesString
    };

    try {
      await onAddRecord("staffActivities", payload);
      
      // Update schedule status to completed in DB
      if (onUpdateRecord) {
        await onUpdateRecord("scheduledTasks", task.id, {
          ...task,
          status: "Completed"
        });

        // Decrement active tasks count in directory in DB
        if (matchedStaff) {
          await onUpdateRecord("staffMembers", matchedStaff.id, {
            ...matchedStaff,
            activeTasks: Math.max(0, (matchedStaff.activeTasks || 0) - 1)
          });
        }
      }

      triggerNotification(
        `Task Completed & Log Archived: ${task.staffName} finished upcoming duty: ${task.taskType}`,
        "success",
        task.staffName
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a scheduled task
  const handleDeleteScheduledTask = async (id: string, staffName: string) => {
    try {
      await onDeleteRecord("scheduledTasks", id);

      // Decrement active tasks count in directory in DB
      const matchedStaff = staffList.find(s => s.name === staffName);
      if (matchedStaff && onUpdateRecord) {
        await onUpdateRecord("staffMembers", matchedStaff.id, {
          ...matchedStaff,
          activeTasks: Math.max(0, (matchedStaff.activeTasks || 0) - 1)
        });
      }

      triggerNotification("Upcoming scheduled task deleted successfully", "info");
    } catch (err) {
      console.error(err);
    }
  };

  // 1. Calculations: Total hours logged
  const totalMinutesLogged = staffActivities.reduce((acc, current) => acc + (current.durationMinutes || 0), 0);
  const totalHoursLogged = (totalMinutesLogged / 60).toFixed(1);

  // 2. Calculations: Counts
  const completedTaskCount = staffActivities.length;
  const activeTechnicianCount = staffList.length;

  // 3. Workload analytics calculation: Active tasks vs completed ones
  const activeSchedulesCount = schedules.filter(s => s.status !== "Completed").length;

  // Let's filter the logged activities list
  const filteredActivities = staffActivities.filter(record => {
    const ext = parseExtendedNotes(record.additionalNotes);
    const matchesSearch = 
      record.staffName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.taskType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ext.rawNotes || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ext.location || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStaff = filterStaff === "All" || record.staffName === filterStaff;
    const matchesArea = filterAreaType === "All" || ext.areaType === filterAreaType;
    const matchesStatus = filterStatus === "All" || ext.completionStatus === filterStatus;

    return matchesSearch && matchesStaff && matchesArea && matchesStatus;
  });

  // Recharts Chart Data: Workload distribution (Tasks assigned per staff member)
  const workloadChartData = staffList.map(s => {
    // Count completed tasks logged in staffActivities
    const completedCount = staffActivities.filter(act => act.staffName === s.name).length;
    // Count planned tasks
    const activePlan = schedules.filter(sc => sc.staffName === s.name && sc.status !== "Completed").length;
    return {
      name: s.name.split(" ")[0], // get first name
      "Active Assigned Workload": activePlan,
      "Completed Activities Logged": completedCount,
      "Efficiency Index %": s.efficiency
    };
  });

  // Recharts Chart Data: Daily productivity trend (Hours logged per day over last few weeks)
  // Let's gather hours mapped per unique date
  const dateMap: { [key: string]: number } = {};
  // Start with default dates to render beautifully even if database is empty
  const defaultProductivityDates = ["2026-06-15", "2026-06-16", "2026-06-17", "2026-06-18", "2026-06-19", "2026-06-20", "2026-06-21"];
  defaultProductivityDates.forEach(d => { dateMap[d] = 0; });

  // Add actual entries
  staffActivities.forEach(act => {
    if (act.date) {
      dateMap[act.date] = (dateMap[act.date] || 0) + ((act.durationMinutes || 0) / 60);
    }
  });

  const trendChartData = Object.keys(dateMap).sort().map(key => ({
    date: key,
    "Labor Hours Logged": parseFloat(dateMap[key].toFixed(2))
  }));

  // Activity type summary for donut chart
  const activityMap: { [key: string]: number } = {};
  staffActivities.forEach(act => {
    activityMap[act.taskType] = (activityMap[act.taskType] || 0) + 1;
  });
  if (Object.keys(activityMap).length === 0) {
    activityMap["Water quality analysis"] = 3;
    activityMap["Feeding fish"] = 2;
    activityMap["Health Check"] = 1;
  }
  const activityDonutData = Object.keys(activityMap).map((key, idx) => ({
    name: key,
    value: activityMap[key],
    color: ["#0284c7", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#64748b"][idx % 6]
  }));

  return (
    <div className="space-y-6 antialiased font-sans text-sky-950">
      
      {/* Dynamic Notifications Banner Alert */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 text-white p-4 py-3 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900 animate-ping"></span>
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-900"></span>
            <Bell size={18} className="text-pink-400 rotate-12" />
          </div>
          <div className="text-left">
            <span className="text-[10px] font-black tracking-widest text-pink-400 uppercase block">🚀 LIVE AUTO-DISPATCH ALERT COMMUNICATOR</span>
            <p className="text-[11px] text-slate-300 font-semibold leading-normal">
              {notifications[0]?.text || "All workers initialized inside automated biosecurity channels."}
            </p>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          <span className="text-[9.5px] font-mono font-bold bg-slate-800 border border-slate-700 px-2 py-1 rounded-lg text-slate-300 flex items-center gap-1">
            📡 Connected Sensors: {MOCK_SENSORS.length} Active
          </span>
        </div>
      </div>

      {/* Main Tab Controller */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 w-max">
          <button
            type="button"
            onClick={() => setSubTab("overview")}
            className={`px-3.5 py-2 text-xs font-black uppercase rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
              subTab === "overview" 
                ? "bg-slate-900 text-white shadow-sm" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Activity size={14} />
            AI Operations &amp; Sensors
          </button>
          
          <button
            type="button"
            onClick={() => setSubTab("activities")}
            className={`px-3.5 py-2 text-xs font-black uppercase rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
              subTab === "activities" 
                ? "bg-slate-900 text-white shadow-sm" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckSquare size={14} />
            Daily Activities Log ({completedTaskCount})
          </button>

          <button
            type="button"
            onClick={() => setSubTab("staff")}
            className={`px-3.5 py-2 text-xs font-black uppercase rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
              subTab === "staff" 
                ? "bg-slate-900 text-white shadow-sm" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users size={14} />
            Staff Directory ({activeTechnicianCount})
          </button>

          <button
            type="button"
            onClick={() => setSubTab("planner")}
            className={`px-3.5 py-2 text-xs font-black uppercase rounded-xl cursor-pointer transition-all flex items-center gap-1.5 ${
              subTab === "planner" 
                ? "bg-slate-900 text-white shadow-sm" 
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Calendar size={14} />
            Duty Scheduler &amp; Alerting
          </button>
        </div>

        <div className="flex items-center gap-2">
          {subTab === "staff" && (
            <button
              onClick={() => setIsAddingStaffModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase px-3.5 py-2 rounded-xl flex items-center gap-1 transition"
            >
              <UserPlus size={13} />
              Add Staff Profile
            </button>
          )}

          {subTab === "planner" && (
            <button
              onClick={() => setIsPlanningModalOpen(true)}
              className="bg-sky-650 hover:bg-sky-700 text-white text-[11px] font-black uppercase px-3.5 py-2 rounded-xl flex items-center gap-1 transition"
            >
              <Plus size={13} />
              Schedule upcoming Work
            </button>
          )}
        </div>
      </div>

      {/* VIEW 1: OVERVIEW & LIVE AI SENSORS DESK */}
      {subTab === "overview" && (
        <div className="space-y-6">

          {/* Quick Stats banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase block tracking-wider">Labor hours logged</span>
              <span className="text-2xl font-black font-mono text-cyan-700 block mt-1">{totalHoursLogged} Hrs</span>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Accumulated from logged daily tasks</p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase block tracking-wider">Activities recorded</span>
              <span className="text-2xl font-black font-mono text-emerald-700 block mt-1">{completedTaskCount} Tasks</span>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Ready for compliance audit trail</p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase block tracking-wider">Pending Duties</span>
              <span className={`text-2xl font-black font-mono block mt-1 ${activeSchedulesCount > 0 ? "text-amber-600" : "text-sky-600"}`}>
                {activeSchedulesCount} Items
              </span>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Assigned upcoming labor blocks</p>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-500 font-extrabold uppercase block tracking-wider">Hatchery efficiency</span>
              <span className="text-2xl font-black font-mono text-indigo-700 block mt-1">94.2%</span>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">Computed workload output score</p>
            </div>
          </div>

          {/* Core Analytics charts division */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Box: Real-Time workload & performance chart */}
            <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
                <div>
                  <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider flex items-center gap-1">
                    <TrendingUp size={14} className="text-cyan-600" />
                    Staff Workload Distribution &amp; Efficiency ratings
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Comparing active planned items versus completed operations logs</p>
                </div>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={workloadChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10 }} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                    <Bar dataKey="Active Assigned Workload" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Completed Activities Logged" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Box: Donut Activity split and AI recommendations */}
            <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider border-b border-slate-105 pb-3">
                  📊 Activity Breakdown
                </h3>
                <div className="h-44 flex items-center justify-center relative my-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityDonutData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {activityDonutData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-xl font-bold font-mono">{staffActivities.length}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-black">Logged</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[9.5px]">
                  {activityDonutData.slice(0, 4).map((entry, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }}></span>
                      <span className="text-slate-600 truncate font-semibold" title={entry.name}>
                        {entry.name.length > 15 ? entry.name.slice(0, 15) + "..." : entry.name} ({entry.value})
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Workload trend feedback message */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-250 mt-4">
                <span className="text-[10px] font-black uppercase text-indigo-700 tracking-wider block mb-1">
                  💡 Predictive Smart workload feedback
                </span>
                <p className="text-[10px] text-slate-500 leading-normal font-semibold">
                  {staffActivities.length > 5 
                    ? "Labor distribution shows a healthy balance. Transfer tasks and egg collections constitute 40% of the active workload. Albert Sserwadda is close to capacity limit this cycle."
                    : "Productivity indexes showing normal patterns. Schedule more weekly tasks to establish optimal machine-learning predictive benchmarks."}
                </p>
              </div>
            </div>
          </div>

          {/* Real-time telemetry sensors integration & Alerts division */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sensor station monitoring block */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-3xl border border-slate-800 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <div>
                  <span className="text-[9px] text-cyan-400 font-mono uppercase tracking-widest block font-black">Environmental Telemetry integration</span>
                  <h4 className="text-xs font-bold text-white mt-0.5">📟 CONNECTED DIRECT WATER MONITORING SENSORS API</h4>
                </div>
                <span className="bg-cyan-500/10 text-cyan-400 rounded-lg px-2 py-0.5 border border-cyan-500/20 text-[9.5px] font-mono">
                  Online Standard
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                {MOCK_SENSORS.map((sensor, idx) => (
                  <div key={idx} className={`p-3.5 rounded-2xl border flex flex-col justify-between ${
                    sensor.status === "Optimal" 
                      ? "bg-slate-850/50 border-slate-800" 
                      : sensor.status === "Warning" 
                        ? "bg-amber-500/10 border-amber-500/20 text-amber-100" 
                        : "bg-rose-500/10 border-rose-500/20 text-rose-100"
                  }`}>
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-[11px] block">{sensor.pondName}</span>
                      <span className={`text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded ${
                        sensor.status === "Optimal" 
                          ? "bg-emerald-500/20 text-emerald-400" 
                          : sensor.status === "Warning" 
                            ? "bg-amber-500/20 text-amber-400 animate-pulse" 
                            : "bg-rose-500/20 text-rose-400 animate-pulse"
                      }}`}>
                        {sensor.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-3 font-mono text-[10.5px]">
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase block font-semibold font-sans">Temp</span>
                        <span className="font-extrabold">{sensor.temperature}°C</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase block font-semibold font-sans">pH</span>
                        <span className="font-extrabold">{sensor.ph}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 uppercase block font-semibold font-sans">DO Oxy</span>
                        <span className={`font-extrabold ${sensor.doValue < 4.5 ? "text-rose-400" : ""}`}>{sensor.doValue} mg/L</span>
                      </div>
                    </div>

                    {sensor.alertText && (
                      <div className="mt-2.5 pt-2 border-t border-white/5 text-[9px] flex items-center gap-1.5 leading-relaxed text-slate-300">
                        <AlertCircle size={10} className="text-amber-400 shrink-0" />
                        <span>{sensor.alertText}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Weather Integration widget & alerts */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="border-b border-slate-100 pb-2 text-left">
                  <span className="text-[9px] text-indigo-600 font-black uppercase tracking-wider block">Live Weather Integration</span>
                  <h4 className="text-xs font-black text-slate-700">☀️ METEOROLOGICAL OPERATIONS DESK</h4>
                </div>

                <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-150">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase block font-extrabold">Jinja Hatchery Hub</span>
                    <span className="text-xl font-black text-slate-805 block">29.1°C</span>
                    <span className="text-[9.5px] italic text-slate-500 font-semibold">Sunny - High Evaporative rate</span>
                  </div>
                  <Sun size={38} className="text-amber-500 animate-spin-slow rotate-45 shrink-0" />
                </div>

                <div className="space-y-2 text-[10.5px] font-semibold text-slate-600">
                  <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-150">
                    <span className="flex items-center gap-1.5"><Wind size={12} className="text-slate-450" /> Wind speed</span>
                    <span className="font-mono text-slate-900">11.4 km/h (E)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-dashed border-slate-150">
                    <span className="flex items-center gap-1.5"><Droplet size={12} className="text-cyan-500" /> Relative Humidity</span>
                    <span className="font-mono text-slate-900">62%</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="flex items-center gap-1.5"><Cloudy size={12} className="text-sky-400" /> Precipitation Risk</span>
                    <span className="font-mono text-slate-900">8% chance of rain</span>
                  </div>
                </div>
              </div>

              <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 mt-4 text-[9.5px] leading-relaxed text-sky-850">
                <strong>💡 Automatic action:</strong> Clear weather minimizes feed waste on pond surface water dikes. Standard feeding cycles fully configured to 100% feed volume.
              </div>
            </div>

          </div>

          {/* Live system logs updates */}
          <div className="bg-slate-50 p-5 rounded-3xl border border-slate-200">
            <h4 className="text-[10.5px] font-black uppercase tracking-wider text-slate-605 mb-4 flex items-center gap-1.5 border-b border-slate-200 pb-2">
              <Bell size={13} className="text-indigo-600 animate-bounce" />
              SYSTEM NOTIFICATION DISPATCH FEED (Auto-updates on action creation)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-48 overflow-y-auto">
              {notifications.map((notif) => (
                <div key={notif.id} className="bg-white p-3 rounded-xl border border-slate-200 text-[11px] flex gap-2.5 items-start">
                  <span className={`text-base p-1 rounded-lg shrink-0 ${
                    notif.type === "new_task" 
                      ? "bg-amber-100" 
                      : notif.type === "alert" 
                        ? "bg-rose-100" 
                        : notif.type === "success" 
                          ? "bg-emerald-100" 
                          : "bg-sky-100"
                  }`}>
                    {notif.type === "new_task" ? "📅" : notif.type === "alert" ? "⚠️" : notif.type === "success" ? "✅" : "ℹ️"}
                  </span>
                  <div className="space-y-0.5 text-left">
                    <p className="text-slate-805 font-bold leading-normal">{notif.text}</p>
                    <div className="flex items-center gap-2 text-[9.5px] text-slate-400 font-semibold font-mono">
                      <span>{notif.time}</span>
                      {notif.staffName && (
                        <>
                          <span>•</span>
                          <span className="text-indigo-600 font-bold">👤 {notif.staffName}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 2: DAILY ACTIVITIES LOG (TABLE & LOGGER) */}
      {subTab === "activities" && (
        <div className="space-y-6">

          {/* Dual division: input logger on left, central registry grid/table on right */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Logger interface form (Column span 4) */}
            <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
              <div className="border-b border-slate-100 pb-2 text-left">
                <span className="text-[9px] uppercase font-black tracking-widest text-emerald-600 block">Task log recorder</span>
                <h4 className="text-xs font-black text-slate-700">✏️ REGISTER DAILY HATCHERY TASK LOG</h4>
              </div>

              <form onSubmit={handleLogActivitySubmit} className="space-y-4 text-xs font-semibold">
                
                <div className="space-y-1 block text-left">
                  <label className="text-[10px] text-slate-500 uppercase font-black block">Specific Activity Type</label>
                  <select 
                    value={logTaskType} 
                    onChange={(e) => setLogTaskType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-bold cursor-pointer"
                  >
                    <option value="Health Check">1. Health Check</option>
                    <option value="Egg Collection">2. Egg Collection</option>
                    <option value="Cleaning Tank/Pond">3. Cleaning Tank/Pond</option>
                    <option value="Sperm Collection">4. Sperm Collection</option>
                    <option value="Record Keeping">5. Record Keeping</option>
                    <option value="Water Quality Analysis">6. Water Quality Analysis</option>
                    <option value="Batch Processing">7. Batch Processing</option>
                    <option value="Transfer of fry to Nursery Fry Tanks">8. Transfer of fry to Nursery Fry Tanks</option>
                    <option value="Transfer of fingerlings to Grow-out Ponds/Tanks">9. Transfer of fingerlings to Grow-out Ponds/Tanks</option>
                    <option value="Transfer of fingerlings to Customers">10. Transfer of fingerlings to Customers</option>
                    <option value="Transfer of fry to customers">11. Transfer of fry to customers</option>
                    <option value="Counting and Packaging of fry/fingerlings">12. Counting and Packaging of fry/fingerlings</option>
                    <option value="Counting, Weighing Table size fish">13. Counting, Weighing Table size fish</option>
                    <option value="Disinfecting Eggs">14. Disinfecting Eggs</option>
                    <option value="Mowing Ponds environment">15. Mowing Ponds environment</option>
                    <option value="Constructing Earthen Ponds">16. Constructing Earthen Ponds</option>
                    <option value="Constructing Cages/Ponds/Tanks">17. Constructing Cages/Ponds/Tanks</option>
                    <option value="Ferlizing Ponds">18. Fertilizing Ponds</option>
                    <option value="Breeding Live fish feeds">19. Breeding Live fish feeds</option>
                    <option value="Harvesting table size fish">20. Harvesting table size fish</option>
                    <option value="Sampling fish">21. Sampling fish</option>
                    <option value="Meeting Customers">22. Meeting Customers</option>
                    <option value="Feeding fish">23. Feeding fish</option>
                    <option value="Washing Fish Farm">24. Washing Fish Farm</option>
                    <option value="Offloading and Packing feeds">25. Offloading and Packing feeds</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 block text-left">
                    <label className="text-[10px] text-slate-500 uppercase font-black block">Assigned Staff</label>
                    <select 
                      value={logStaffName} 
                      onChange={(e) => setLogStaffName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold cursor-pointer"
                    >
                      {staffList.map((st) => (
                        <option key={st.id} value={st.name}>{st.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 block text-left">
                    <label className="text-[10px] text-slate-500 uppercase font-black block">Hours Spent</label>
                    <input 
                      type="number" 
                      step="0.5" 
                      min="0.5" 
                      max="14" 
                      value={logTimeSpent} 
                      onChange={(e) => setLogTimeSpent(e.target.value)}
                      required 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-mono" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 block text-left">
                    <label className="text-[10px] text-slate-500 uppercase font-black block">Area Division</label>
                    <select 
                      value={logAreaType} 
                      onChange={(e) => setLogAreaType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold cursor-pointer"
                    >
                      <option value="Hatchery">Hatchery Hub</option>
                      <option value="Grow Out Pond">Grow Out Pond</option>
                      <option value="Management">Management Desk</option>
                      <option value="Office">Office Operations</option>
                    </select>
                  </div>

                  <div className="space-y-1 block text-left">
                    <label className="text-[10px] text-slate-500 uppercase font-black block">Pond/Tank Location</label>
                    <input 
                      type="text" 
                      value={logLocation} 
                      onChange={(e) => setLogLocation(e.target.value)}
                      required 
                      placeholder="e.g. Nursery Tank Row C" 
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 block text-left">
                    <label className="text-[10px] text-slate-500 uppercase font-black block">Task Status</label>
                    <select 
                      value={logStatus} 
                      onChange={(e) => setLogStatus(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold cursor-pointer"
                    >
                      <option value="Completed">Completed</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>

                  <div className="space-y-1 block text-left">
                    <label className="text-[10px] text-slate-500 uppercase font-black block">Environmental weather</label>
                    <select 
                      value={logWeather} 
                      onChange={(e) => setLogWeather(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold cursor-pointer"
                    >
                      <option value="Sunny - Clear Sky">Sunny - Clear Sky</option>
                      <option value="Rainy / Humid">Rainy / Humid</option>
                      <option value="Overcast / Cool">Overcast / Cool</option>
                      <option value="Windy / Choppy Water">Windy / Choppy Water</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 block text-left">
                  <label className="text-[10px] text-slate-500 uppercase font-black block">Environmental Sensor value (Real-Time Reading)</label>
                  <input 
                    type="text" 
                    value={logSensorValue} 
                    onChange={(e) => setLogSensorValue(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-mono text-[11px]" 
                  />
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1 block text-left">
                    <label className="text-[10px] text-slate-500 uppercase font-black block">Attach visual photo (Indicator Link)</label>
                    <select
                      value={logPhotoEmoji}
                      onChange={(e) => setLogPhotoEmoji(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-semibold cursor-pointer text-sm"
                    >
                      <option value="📷">📷 Capture verification photo</option>
                      <option value="🧪">🧪 Pathology / Water vial test sample</option>
                      <option value="🧾">🧾 Invoice / Delivery note signed</option>
                      <option value="⚙️">⚙️ Equipment repaired or cleaned</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1 block text-left">
                  <label className="text-[10px] text-slate-500 uppercase font-black block">Activity Notes &amp; Observations</label>
                  <textarea 
                    rows={3} 
                    value={logNotes} 
                    onChange={(e) => setLogNotes(e.target.value)}
                    placeholder="Provide detailed logs of activities performed, including feed types used, mortalities, or chemical treatments applied..." 
                    className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-xl font-normal text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={readOnly}
                  className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-black uppercase py-3 rounded-2xl cursor-pointer shadow-md transition text-xs tracking-wider"
                >
                  🔒 Secure &amp; Submit Log Entry
                </button>
              </form>
            </div>

            {/* Central directory logs table (Column span 8) */}
            <div className="lg:col-span-8 bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <div className="text-left">
                  <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">
                    📋 SECURED FISH FARM STAFF DAILY OPERATIONS REGISTRY
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold">Central table log documenting hatchery workload, weather constraints, and telemetry links</p>
                </div>
              </div>

              {/* Advanced multi-filters panel */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-150 grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="relative col-span-1 sm:col-span-2">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search task logs, staff name..."
                    className="w-full pl-9 bg-white border border-slate-200 rounded-xl py-1.5 p-2 text-xs font-semibold focus:outline-hidden"
                  />
                </div>

                <div>
                  <select 
                    value={filterStaff}
                    onChange={(e) => setFilterStaff(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 p-2 text-xs font-semibold cursor-pointer"
                  >
                    <option value="All">Filter By Staff</option>
                    {staffList.map((st) => (
                      <option key={st.id} value={st.name}>{st.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <select 
                    value={filterAreaType}
                    onChange={(e) => setFilterAreaType(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl py-1.5 p-2 text-xs font-semibold cursor-pointer"
                  >
                    <option value="All">Filter Area Type</option>
                    <option value="Hatchery">Hatchery Hub</option>
                    <option value="Grow Out Pond">Grow Out Pond</option>
                    <option value="Management">Management Desk</option>
                    <option value="Office">Office Operations</option>
                  </select>
                </div>
              </div>

              {/* Table rendering block */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase text-[9px] border-b border-slate-200 select-none">
                      <th className="p-3">Activity &amp; Staff details</th>
                      <th className="p-3">Location &amp; Area division</th>
                      <th className="p-3 text-center">Time Spent</th>
                      <th className="p-3">Environment sensor / Weather</th>
                      <th className="p-3 text-center">Attachment</th>
                      {!readOnly && <th className="p-3 text-center">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-150 font-semibold text-slate-800">
                    {filteredActivities.map((record) => {
                      const ext = parseExtendedNotes(record.additionalNotes);
                      return (
                        <tr key={record.id} className="hover:bg-slate-50/50 transition">
                          <td className="p-3 min-w-[180px]">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-150/50 rounded px-2 py-0.5 inline-block">
                                {record.taskType}
                              </span>
                              <div className="flex items-center gap-1">
                                <span className="font-extrabold text-slate-900 block">{record.staffName}</span>
                                <span className="text-[10.5px] text-slate-400">•</span>
                                <span className="text-[10px] text-slate-500 font-mono italic">{record.date}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 font-normal leading-relaxed italic pr-2">{ext.rawNotes || record.activityDetails}</p>
                            </div>
                          </td>

                          <td className="p-3">
                            <div className="space-y-0.5">
                              <span className="font-bold text-slate-900 block">{ext.location}</span>
                              <span className="text-[9.5px] text-slate-450 uppercase tracking-wider block font-black">
                                🗺️ {ext.areaType}
                              </span>
                            </div>
                          </td>

                          <td className="p-3 text-center">
                            <div className="inline-block bg-sky-50 text-sky-900 font-bold font-mono px-2 py-1 rounded-lg border border-sky-100 text-[10.5px]">
                              {((record.durationMinutes || 120)/60).toFixed(1)} hrs
                            </div>
                          </td>

                          <td className="p-3 max-w-[200px]">
                            <div className="space-y-1 text-[10px]">
                              <span className="text-emerald-700 font-mono block bg-emerald-50/70 border border-emerald-150 p-1 rounded font-bold leading-normal">
                                📟 {ext.environmentalSensors || "Temp 28.1C • standard ph"}
                              </span>
                              <span className="text-slate-500 block">
                                🌤️ {ext.weatherConditions || "Sunny"}
                              </span>
                            </div>
                          </td>

                          <td className="p-3 text-center text-lg select-none">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-205 flex items-center justify-center mx-auto" title="Click to view full screen attachment">
                              {ext.photoAttachment || "📷"}
                            </div>
                          </td>

                          {!readOnly && (
                            <td className="p-3 text-center">
                              <button
                                onClick={() => onDeleteRecord("staffActivities", record.id || "")}
                                className="text-red-650 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 cursor-pointer block mx-auto transition"
                                title="Delete Daily Task Log"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })}

                    {filteredActivities.length === 0 && (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-slate-400 italic">
                          No matching Daily Staff Task logs reported in the selected period.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* VIEW 3: STAFF DIRECTORY */}
      {subTab === "staff" && (
        <div className="space-y-6">
          
          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
            <div className="text-left border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">
                👥 HATCHERY STAFF ROLES &amp; CONTACT DIRECTORY
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold">Central secure storage roster mapping personnel emails, phones, security access clearness, and active workload efficiency indexes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {staffList.map((st) => (
                <div key={st.id} className="bg-slate-50 border border-slate-150 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 hover:shadow-xs transition">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl select-none">{st.avatar || "👨‍🌾"}</span>
                      <div className="text-right">
                        <span className="text-[9px] uppercase tracking-wider block font-black text-slate-400">EFFICIENCY</span>
                        <span className="text-xs font-black font-mono text-emerald-600">{st.efficiency}%</span>
                      </div>
                    </div>

                    <div className="space-y-1 text-left">
                      <h4 className="font-extrabold text-[13px] text-slate-900 leading-tight">{st.name}</h4>
                      <p className="text-[10px] font-black text-indigo-700 uppercase tracking-wide leading-snug">{st.role}</p>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-200 text-[10.5px] text-slate-600 font-semibold font-mono text-left">
                      <span className="flex items-center gap-1.5 pl-0.5" title="Copy email address">
                        <Mail size={12} className="text-slate-400 shrink-0" />
                        <span className="truncate">{st.email}</span>
                      </span>
                      <span className="flex items-center gap-1.5 pl-0.5" title="Call primary phone">
                        <Phone size={12} className="text-slate-400 shrink-0" />
                        <span>{st.phone}</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px]">
                      <span className={`w-2 h-2 rounded-full ${st.activeTasks > 2 ? "bg-amber-500" : "bg-emerald-500"}`}></span>
                      <span className="font-extrabold">{st.activeTasks} active tasks</span>
                    </div>

                    {!readOnly && (
                      <button
                        onClick={() => handleDeleteStaff(st.id, st.name)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-md transition cursor-pointer"
                        title="Remove staff member from bluehatch repository"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* VIEW 4: SCHEDULE DUTIES PLANNER & AUTO-NOTIFY */}
      {subTab === "planner" && (
        <div className="space-y-6">

          <div className="bg-white p-5 rounded-3xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="text-left">
                <h3 className="font-extrabold text-xs uppercase text-slate-700 tracking-wider">
                  📅 SCHEDULED RESPONSIBILITIES &amp; NOTIFICATION TRIGGER
                </h3>
                <p className="text-[10px] text-slate-400 font-semibold">Plan upcoming hatchery duties to guarantee mandatory cleaning, biosecurity schedules, and feed cycles are never missed.</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100/80 text-slate-600 font-bold uppercase text-[9px] border-b border-slate-200 select-none">
                    <th className="p-3">Mandatory Duty Type</th>
                    <th className="p-3">Assigned personnel</th>
                    <th className="p-3">Area &amp; Location</th>
                    <th className="p-3">Scheduled Date</th>
                    <th className="p-3 text-center">Urgency</th>
                    <th className="p-3 text-center">Dispatch Status</th>
                    <th className="p-3 text-center">Audit Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-150 font-semibold text-slate-800">
                  {schedules.map((task) => (
                    <tr key={task.id} className="hover:bg-slate-50/50 transition">
                      <td className="p-3">
                        <div className="space-y-1">
                          <span className="font-extrabold text-slate-900 block">{task.taskType}</span>
                          {task.notes && (
                            <p className="text-[10px] text-slate-500 font-normal leading-relaxed italic">{task.notes}</p>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-1.5 text-slate-950 font-bold">
                          <span>👤</span>
                          <span>{task.staffName}</span>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="space-y-0.5">
                          <span className="block text-slate-900">{task.location}</span>
                          <span className="text-[9px] text-slate-450 uppercase block font-black">⚙️ {task.areaType}</span>
                        </div>
                      </td>

                      <td className="p-3 font-mono font-bold text-slate-700">
                        {task.scheduledDate}
                      </td>

                      <td className="p-3 text-center">
                        <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                          task.urgency === "High" 
                            ? "bg-rose-100 text-rose-800 border border-rose-300" 
                            : task.urgency === "Medium" 
                              ? "bg-amber-100 text-amber-800 border border-amber-300" 
                              : "bg-sky-100 text-sky-800 border border-sky-300"
                        }`}>
                          {task.urgency}
                        </span>
                      </td>

                      <td className="p-3 text-center">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded inline-block select-none ${
                          task.status === "Completed" 
                            ? "bg-emerald-100 text-emerald-800" 
                            : task.status === "Overdue" 
                              ? "bg-rose-100 text-rose-800 animate-pulse" 
                              : task.status === "Assigned" 
                                ? "bg-indigo-100 text-indigo-800" 
                                : "bg-slate-150 text-slate-600"
                        }`}>
                          {task.status === "Completed" ? "✓ Done & Logged" : task.status}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center justify-center gap-2">
                          {task.status !== "Completed" && (
                            <button
                              onClick={() => handleCompleteScheduledTask(task)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded transition flex items-center gap-1 cursor-pointer shadow-xs"
                              title="Resolve task and write record to Daily Log automatically"
                            >
                              <Check size={11} />
                              Complete
                            </button>
                          )}
                          {!readOnly && (
                            <button
                              onClick={() => handleDeleteScheduledTask(task.id, task.staffName)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-md transition cursor-pointer"
                              title="Delete Scheduled planner item"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {schedules.length === 0 && (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                        No upcoming duties scheduled yet. Click the top button to assign upcoming tasks.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Smart Reminder / Alerting Information footer */}
            <div className="bg-slate-50 rounded-2xl border border-slate-150 p-4 space-y-1.5 text-left text-xs leading-normal font-semibold text-slate-700">
              <span className="text-[10px] uppercase font-black text-slate-450 block">📢 METEOROLOGICAL &amp; BIOSAFETY EMERGENCY WARNING SIGNALS</span>
              <p className="text-[10.5px] leading-relaxed">
                The auto-scheduler is synchronized with the live weather. If humidity rises above 85% or local Jinja stations indicate stormy wind gusts exceeding 25km/h, an alert is automatically dispatched to the <strong className="text-pink-600">Active recxpats Manager (Denis Sserwadda)</strong> to secure cages, lock oxygen micro-aerators, and secure power backups instantly.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* MODAL SECTION 1: ADD STAFF PROFILE */}
      {isAddingStaffModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-205 shadow-2xl relative block text-left">
            <h3 className="font-extrabold text-sm uppercase text-slate-750 tracking-wider mb-4 border-b pb-2 flex items-center gap-2">
              <UserPlus size={16} className="text-emerald-600" />
              ADD NEW HATCHERY STAFF PROFILE
            </h3>

            <form onSubmit={handleAddStaffSubmit} className="space-y-4 text-xs font-semibold">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-black block">Full staff Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sserwadda Herbert"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-black block">Professional Role / Duty*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pathogen diagnostic inspector"
                  value={newStaffRole}
                  onChange={(e) => setNewStaffRole(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl text-sky-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-black block">Contact Email</label>
                  <input
                    type="email"
                    placeholder="e.g. herbert@bluehatch.io"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-black block">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +256 701 445 221"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-black block">Visual avatar / Emoji badge</label>
                <select
                  value={newStaffAvatar}
                  onChange={(e) => setNewStaffAvatar(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl text-sm"
                >
                  <option value="👨‍🌾">👨‍🌾 recxpats field keeper</option>
                  <option value="👩‍⚕️">👩‍⚕️ Pathologist / Pathological expert</option>
                  <option value="👨‍💻">👨‍💻 Technologist / Admin officer</option>
                  <option value="👩‍💼">👩‍💼 Advisor / Manager</option>
                </select>
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddingStaffModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl font-black uppercase text-[10.5px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-black uppercase text-[10.5px] cursor-pointer shadow-md"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SECTION 2: SCHEDULE DUTIES PLANNER ADD */}
      {isPlanningModalOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-205 shadow-2xl relative block text-left">
            <h3 className="font-extrabold text-sm uppercase text-slate-750 tracking-wider mb-4 border-b pb-2 flex items-center gap-2">
              <Calendar size={16} className="text-sky-600" />
              SCHEDULE UPCOMING RESPONSIBILITY
            </h3>

            <form onSubmit={handlePlanTaskSubmit} className="space-y-4 text-xs font-semibold">
              
              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-black block">Mandatory hatchery Duty Type*</label>
                <select 
                  value={planTaskType}
                  onChange={(e) => setPlanTaskType(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl font-bold cursor-pointer"
                >
                  <option value="Health Check">1. Health Check</option>
                  <option value="Feeding fish">2. Feeding fish</option>
                  <option value="Cleaning Tank/Pond">3. Cleaning Tank/Pond</option>
                  <option value="Water Quality Analysis">4. Water Quality Analysis</option>
                  <option value="Egg Collection">5. Egg Collection</option>
                  <option value="Batch Processing">6. Batch / Shipment packing</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-black block">Assign Staff Member*</label>
                  <select 
                    value={planStaff}
                    onChange={(e) => setPlanStaff(e.target.value)}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl font-bold cursor-pointer"
                  >
                    {staffList.map((st) => (
                      <option key={st.id} value={st.name}>{st.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-black block">Duty urgency limit*</label>
                  <select 
                    value={planUrgency}
                    onChange={(e) => setPlanUrgency(e.target.value as any)}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl font-bold cursor-pointer"
                  >
                    <option value="High">🚨 High Urgency</option>
                    <option value="Medium">⚡ Medium standard</option>
                    <option value="Low">🌱 Low priority</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-black block">Scheduled Date*</label>
                  <input
                    type="date"
                    required
                    value={planDate}
                    onChange={(e) => setPlanDate(e.target.value)}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 uppercase font-black block">Area Division*</label>
                  <select 
                    value={planAreaType}
                    onChange={(e) => setPlanAreaType(e.target.value as any)}
                    className="w-full bg-slate-50 border p-2.5 rounded-xl font-semibold cursor-pointer"
                  >
                    <option value="Hatchery">Hatchery Hub</option>
                    <option value="Grow Out Pond">Grow Out Pond</option>
                    <option value="Management">Management Desk</option>
                    <option value="Office">Office Operations</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-black block">Tank/Pond/Area Location*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Incubation Tank Area D-3"
                  value={planLocation}
                  onChange={(e) => setPlanLocation(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-500 uppercase font-black block">Important notes &amp; instructions</label>
                <textarea
                  rows={2}
                  placeholder="Notes about specific instructions of the planned duty..."
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  className="w-full bg-slate-50 border p-2.5 rounded-xl font-normal text-xs"
                />
              </div>

              <div className="flex gap-3 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setIsPlanningModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4 rounded-xl font-black uppercase text-[10.5px] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-sky-650 hover:bg-sky-700 text-white py-2.5 px-4 rounded-xl font-black uppercase text-[10.5px] cursor-pointer shadow-md"
                >
                  Schedule and Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
