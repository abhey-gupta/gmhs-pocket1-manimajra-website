// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, ShieldCheck, Megaphone, Images, 
  Settings, LogOut, LayoutDashboard 
} from "lucide-react";
import AnnouncementsManager from "./AnnouncementsManager";
import ActivitiesManager from "./ActivitiesManager";
import NavigationCustomizer from "./NavigationCustomizer";
import axios from "axios";
import { toast } from "sonner";

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("announcements");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      const { data } = await axios.post("/api/admin/logout");
      if (data.success) {
        toast.success("Successfully logged out");
        router.push("/admin/login");
        router.refresh();
      } else {
        toast.error("Logout failed");
      }
    } catch {
      toast.error("Logout error");
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto min-h-[85vh]">
      {/* Breadcrumb Back */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-950 transition-colors uppercase tracking-wider cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to School Site</span>
        </Link>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="inline-flex items-center gap-1.5 text-xs text-red-650 font-bold hover:text-red-800 bg-red-50 hover:bg-red-100 py-1.5 px-3 rounded-full cursor-pointer transition-colors border-0"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{loggingOut ? "Logging out..." : "Log Out"}</span>
        </button>
      </div>

      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5 mb-8">
        <div className="space-y-1.5 text-left">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Management Control</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <LayoutDashboard className="w-8 h-8 text-indigo-900" />
            Administrator Portal
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold bg-slate-100/60 py-1.5 px-3.5 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Admin Access Verified</span>
        </div>
      </div>

      {/* Main Admin Dashboard */}
      <div className="glass-panel border-slate-200/60 bg-white/95 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        
        {/* Tab Buttons */}
        <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
          <button
            onClick={() => setActiveTab("announcements")}
            className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border-0 ${
              activeTab === "announcements"
                ? "bg-indigo-900 text-white shadow-md shadow-indigo-900/10"
                : "bg-slate-50 hover:bg-slate-100 text-slate-650"
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Bulletins & Announcements</span>
          </button>
          
          <button
            onClick={() => setActiveTab("activities")}
            className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border-0 ${
              activeTab === "activities"
                ? "bg-amber-600 text-slate-950 shadow-md shadow-amber-600/10"
                : "bg-slate-50 hover:bg-slate-100 text-slate-650"
            }`}
          >
            <Images className="w-4 h-4" />
            <span>Photo Gallery Packs</span>
          </button>

          <button
            onClick={() => setActiveTab("customizer")}
            className={`flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-extrabold transition-all cursor-pointer border-0 ${
              activeTab === "customizer"
                ? "bg-slate-900 text-white shadow-md shadow-slate-900/10"
                : "bg-slate-50 hover:bg-slate-100 text-slate-650"
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Customize Menus & Pages</span>
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="pt-2">
          {activeTab === "announcements" && <AnnouncementsManager />}
          {activeTab === "activities" && <ActivitiesManager />}
          {activeTab === "customizer" && <NavigationCustomizer />}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
