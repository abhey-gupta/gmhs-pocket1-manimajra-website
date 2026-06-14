"use client";

import Link from "next/link";
import OvalLoader from "./loaders/OvalLoader";
import { useQuery } from "@tanstack/react-query";
import { Megaphone, Flag, Calendar, ChevronRight } from "lucide-react";

const Announcements = () => {
  const { data: announcements, isLoading, isError, error } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await fetch("/api/announcements/fetch-all", {
        method: "GET",
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (!data.success || !Array.isArray(data.announcements)) {
        throw new Error(data.error || "Failed to retrieve announcements");
      }
      return data.announcements.slice().reverse();
    },
  });

  return (
    <section
      id="announcements"
      className="max-w-4xl mx-auto px-4 sm:px-6 py-6"
    >
      <div className="glass-panel border-slate-200/60 bg-white/95 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
        {/* Header Block */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <h2 className="font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight">
              Announcements Board
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Live Feed
          </span>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="py-12 flex justify-center items-center">
            <div className="flex flex-col items-center gap-3">
              <OvalLoader />
              <p className="text-slate-400 text-xs font-semibold">Retrieving updates...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="py-10 text-center">
            <div className="inline-flex p-3 rounded-full bg-red-50 text-red-600 mb-2">
              <Megaphone className="w-6 h-6" />
            </div>
            <p className="text-red-500 font-bold text-sm">Failed to load feed</p>
            <p className="text-slate-400 text-xs mt-1">{error.message || "Please check your network."}</p>
          </div>
        )}

        {/* Announcements List */}
        {!isLoading && !isError && announcements && (
          <div className="flex flex-col gap-4">
            {announcements.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Megaphone className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-sm font-medium">No announcements posted yet.</p>
              </div>
            ) : (
              announcements.map((announcement) => {
                const givenDate = new Date(announcement.created_at);
                const now = new Date();
                const dayBefore = new Date(now.getTime() - 24 * 60 * 60 * 1000);
                const isLatest = givenDate >= dayBefore && givenDate <= now;

                return (
                  <Link
                    key={announcement.id}
                    href={`/announcement/${announcement.id}`}
                    className={`group w-full flex items-start justify-between gap-4 p-4 rounded-2xl border transition-all duration-300 ${
                      announcement.flagged
                        ? "bg-amber-50/40 hover:bg-amber-50/70 border-amber-200/70"
                        : "bg-slate-50/30 hover:bg-slate-50/70 border-slate-100 hover:border-slate-200/80"
                    }`}
                  >
                    <div className="flex gap-4 items-start flex-grow">
                      {/* Icon */}
                      <div className={`p-2.5 rounded-xl mt-0.5 shrink-0 ${
                        announcement.flagged 
                          ? "bg-amber-100 text-amber-700" 
                          : "bg-indigo-50 text-indigo-700"
                      }`}>
                        <Megaphone className="w-4 h-4" />
                      </div>

                      {/* Content */}
                      <div className="space-y-1.5 text-left">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-800 text-sm md:text-base group-hover:text-indigo-900 transition-colors">
                            {announcement.title}
                          </h3>
                          {announcement.flagged && (
                            <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              <Flag className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                              Urgent
                            </span>
                          )}
                          {isLatest && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
                              New
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-bold">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{givenDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Arrow */}
                    <div className="p-1.5 rounded-lg border border-transparent group-hover:border-slate-200/50 bg-transparent group-hover:bg-white transition-all duration-300 self-center shrink-0">
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-700 transition-colors" />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Announcements;
