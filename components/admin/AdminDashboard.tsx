// @ts-nocheck
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, ShieldCheck, Megaphone, Images, 
  Compass, File, LogOut, LayoutDashboard, Menu, X
} from "lucide-react";
import AnnouncementsManager from "./AnnouncementsManager";
import ActivitiesManager from "./ActivitiesManager";
import PagesManager from "./PagesManager";
import Logo1 from "@/public/logo/logo1.jpg";
import axios from "axios";
import { toast } from "sonner";

const AdminDashboard = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("announcements");
  const [loggingOut, setLoggingOut] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const navItems = [
    { id: "announcements", label: "Announcements", icon: Megaphone, color: "text-indigo-500" },
    { id: "gallery", label: "Event Gallery", icon: Images, color: "text-amber-500" },
    { id: "pages", label: "Custom Pages", icon: File, color: "text-sky-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row relative">
      
      {/* 1. Left Sidebar - Desktop (Fixed) & Mobile (Dropdown panel) */}
      <aside className="w-full md:w-64 bg-slate-950 text-white shrink-0 md:fixed md:inset-y-0 md:left-0 z-30 flex flex-col justify-between border-r border-slate-800 shadow-xl">
        
        {/* Sidebar Header & Brand */}
        <div className="flex flex-col">
          <div className="p-5 flex items-center justify-between border-b border-slate-900">
            <Link href="/" className="flex items-center gap-2 group focus:outline-none">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-800 shrink-0 bg-white p-0.5">
                <Image
                  src={Logo1}
                  alt="School Logo"
                  className="object-contain rounded-full h-full w-full"
                />
              </div>
              <span className="font-black text-white tracking-tight text-sm text-left">
                GMHS <span className="text-amber-500">Pocket 1</span>
                <span className="block text-[9px] text-slate-500 font-bold tracking-wider uppercase mt-0.5">Admin Control Hub</span>
              </span>
            </Link>

            {/* Mobile Menu Trigger */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 md:hidden hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white cursor-pointer transition-colors border-0"
              aria-label="Toggle Navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className={`p-4 flex flex-col gap-1.5 ${mobileMenuOpen ? "flex" : "hidden md:flex"}`}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-left transition-all duration-200 border-0 cursor-pointer ${
                    isActive 
                      ? "bg-slate-900 text-white shadow-inner border border-slate-850/50" 
                      : "bg-transparent text-slate-400 hover:bg-slate-900/60 hover:text-white"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? item.color : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer (Profile / Logout) */}
        <div className={`p-4 border-t border-slate-900 bg-slate-950/40 ${mobileMenuOpen ? "block" : "hidden md:block"}`}>
          <div className="flex items-center justify-between gap-3 px-2 py-1.5 mb-2.5">
            <div className="min-w-0 text-left">
              <span className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest leading-none">Ramesh Gupta</span>
              <span className="text-[9px] text-slate-600 font-mono block truncate mt-0.5">rameshgupta001@gmail.com</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 shadow shadow-emerald-500/50" title="System Online"></div>
          </div>
          
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 font-bold py-2.5 rounded-xl text-xs transition duration-200 cursor-pointer border border-red-900/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? "Exiting Hub..." : "Log Out"}</span>
          </button>
        </div>

      </aside>

      {/* 2. Main Content View Area */}
      <main className="flex-grow md:pl-64 flex flex-col min-w-0">
        
        {/* Top bar control room */}
        <header className="h-16 border-b border-slate-200/60 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm shrink-0">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-550 hover:text-indigo-950 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to School Site</span>
          </Link>

          <div className="flex items-center gap-2 text-xs text-slate-500 font-bold bg-slate-100/60 py-1.5 px-3.5 rounded-full shadow-sm border border-slate-200/20">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Secure Admin Console</span>
          </div>
        </header>

        {/* Dynamic screen area */}
        <div className="p-6 md:p-8 flex-grow flex flex-col justify-start">
          <div className="glass-panel border-slate-200/50 bg-white rounded-3xl p-6 md:p-8 shadow-md flex-grow">
            
            {activeTab === "announcements" && <AnnouncementsManager />}
            {activeTab === "gallery" && <ActivitiesManager />}
            {activeTab === "pages" && <PagesManager />}

          </div>
        </div>

      </main>

    </div>
  );
};

export default AdminDashboard;
