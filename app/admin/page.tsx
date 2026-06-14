// @ts-nocheck
import AddAnnouncement from "@/components/admin/AddAnnouncement";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AddActivity from "@/components/admin/AddActivity";
import Link from "next/link";
import { ArrowLeft, LayoutDashboard, ShieldCheck } from "lucide-react";

const Admin = () => {
  const token = cookies().get("admin_token");
  if (!token || token.value !== process.env.NEXT_PUBLIC_ADMIN_TOKEN) {
    redirect("/admin/login");
  }

  return (
    <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto min-h-[75vh]">
      {/* Breadcrumb Back */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-950 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to School Site</span>
        </Link>
      </div>

      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5 mb-8">
        <div className="space-y-1.5 text-left">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Management Control</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Administrator Portal
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-100/50 py-1.5 px-3 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Admin Access Verified</span>
        </div>
      </div>

      {/* Admin Panel Layout */}
      <div className="glass-panel border-slate-200/60 bg-white/95 rounded-3xl p-6 md:p-10 shadow-xl space-y-6">
        <div className="text-left space-y-1">
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-indigo-600" />
            School Dashboard Hub
          </h2>
          <p className="text-slate-500 text-xs md:text-sm font-medium">
            Select one of the tools below to publish new bulletins or upload school event activity gallery photos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <AddAnnouncement />
          <AddActivity />
        </div>
      </div>
    </section>
  );
};

export default Admin;
