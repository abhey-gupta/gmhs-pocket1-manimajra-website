import { fetchAnnouncement } from "@/utils/announcements";
import { Flag, ArrowLeft, Calendar, FileText, Download } from "lucide-react";
import Link from "next/link";

const AnnouncementDetail = async ({ params }) => {
  const announcement = await fetchAnnouncement(params.aid);

  if (!announcement) {
    return (
      <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto text-center">
        <div className="glass-panel border-slate-200/60 rounded-3xl p-12 bg-white">
          <p className="text-slate-500 font-bold">Announcement not found</p>
          <Link href="/" className="mt-4 inline-flex items-center gap-2 text-indigo-900 font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const creationDate = announcement.created_at ? new Date(announcement.created_at) : null;

  return (
    <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Back to Home Link */}
      <div className="mb-6">
        <Link
          href="/#announcements"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-950 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Announcements</span>
        </Link>
      </div>

      {/* Announcement Detail Container */}
      <div className="glass-panel border-slate-200/60 rounded-3xl p-6 md:p-10 bg-white shadow-xl relative overflow-hidden">
        
        {/* Flag decoration for urgent items */}
        {announcement.flagged && (
          <div className="absolute top-0 right-0 bg-amber-500 text-slate-900 text-[10px] font-extrabold uppercase px-4 py-1.5 rounded-bl-xl tracking-wider flex items-center gap-1 shadow-sm">
            <Flag className="w-3 h-3 fill-slate-900" />
            <span>Urgent</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Metadata & Title */}
          <div className="space-y-3">
            {creationDate && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold">
                <Calendar className="w-4 h-4" />
                <span>{creationDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
              </div>
            )}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              {announcement.title}
            </h1>
          </div>

          <div className="h-px bg-slate-100"></div>

          {/* Description */}
          <div className="text-slate-650 text-sm sm:text-base leading-relaxed whitespace-pre-wrap font-medium">
            {announcement.description || (
              <span className="text-slate-400 italic">No description details provided. Please check the attached document.</span>
            )}
          </div>

          {/* Attachment Box */}
          {announcement.file && (
            <div className="pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Attached Document</h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800 text-sm truncate max-w-[280px] md:max-w-md">
                      {announcement.file.split("/").pop()}
                    </p>
                    <p className="text-slate-400 text-xs font-semibold">Document / PDF Attachment</p>
                  </div>
                </div>

                <a
                  href={announcement.file}
                  download
                  className="inline-flex items-center justify-center gap-2 bg-indigo-900 hover:bg-indigo-850 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md transition-all duration-200"
                >
                  <Download className="w-4.5 h-4.5" />
                  <span>Download File</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default AnnouncementDetail;
