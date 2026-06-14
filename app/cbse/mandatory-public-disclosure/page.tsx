import Link from "next/link";
import { ArrowLeft, FileText, Download, ShieldCheck } from "lucide-react";

export default function PublicDisclosure() {
  const fileUrl = "https://gmhspocket1manimajra.com/wp-content/uploads/2023/06/Mandatory-Public-Disclosure.pdf";

  return (
    <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {/* Breadcrumb Back */}
      <div className="mb-6">
        <Link
          href="/#home"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-950 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5 mb-8">
        <div className="space-y-1.5 text-left">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">CBSE Compliance</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Mandatory Public Disclosure
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-100/50 py-1.5 px-3 rounded-full">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Compliance Verified</span>
        </div>
      </div>

      {/* Info Card / File Download Panel */}
      <div className="glass-panel border-slate-200/60 bg-white/95 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
        
        {/* Info Box */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-700 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="text-left font-medium">
              <h4 className="font-bold text-slate-800 text-sm">Public Disclosure PDF</h4>
              <p className="text-slate-400 text-xs">Official documentation required for compliance.</p>
            </div>
          </div>

          <a
            href={fileUrl}
            download
            target="_blank"
            className="inline-flex items-center justify-center gap-2 bg-indigo-900 hover:bg-indigo-850 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all duration-200"
          >
            <Download className="w-4.5 h-4.5" />
            <span>Download PDF</span>
          </a>
        </div>

        {/* PDF Document Frame */}
        <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50 aspect-[4/3] md:h-[650px] w-full">
          <iframe
            width="100%"
            height="100%"
            className="w-full h-full border-0"
            src={fileUrl}
            title="School Mandatory Public Disclosure Document"
          >
            <p className="text-slate-500 text-sm p-6 text-center">
              Your browser does not support embedded PDF files. Please click the button above to download.
            </p>
          </iframe>
        </div>

      </div>
    </section>
  );
}
