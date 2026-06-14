// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Download, ShieldCheck, Layers, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";

// Default configuration mappings for self-healing/first-time loads
const DEFAULT_PAGES = {
  "school-uniform": {
    title: "School Uniform Specifications",
    subtitle: "Student Guidelines",
    sections: [
      {
        type: "table",
        title: "Primary Classes (1st to 5th Grade)",
        headers: ["Boys Uniform", "Girls Uniform"],
        rows: [
          [
            "Shorts and Shirt (colour as per specification of the Education Department, Chandigarh Administration)",
            "Shirt and Tunic (colour as per specification of the Education Department, Chandigarh Administration)"
          ]
        ]
      },
      {
        type: "table",
        title: "Middle & High Classes (6th to 10th Grade)",
        headers: ["Boys Uniform", "Girls Uniform"],
        rows: [
          [
            "Trousers and Shirt (colour as per specification of the Education Department, Chandigarh Administration)",
            "Salwar / Skirt and Suit/Shirt (colour as per specification of the Education Department, Chandigarh Administration)"
          ]
        ]
      },
      {
        type: "text",
        title: "Note to Parents",
        content: "Uniform color palettes and patterns are strictly governed by guidelines from the Education Department of Chandigarh Administration. Please verify current specifications with class teachers before buying."
      }
    ]
  },
  "infrastructure": {
    title: "Infrastructure & Facilities",
    subtitle: "Pocket-1 Campus Map",
    sections: [
      {
        type: "table",
        title: "Room Inventory",
        headers: ["Rooms / Labs", "Quantity"],
        rows: [
          ["Class Rooms", "27"],
          ["Composite Science Lab", "1"],
          ["Mathematics Lab", "1"],
          ["Computer Science Lab", "1"],
          ["Home Science Lab", "1"],
          ["Other Special Labs", "1"],
          ["Library", "1"],
          ["Administrative Rooms", "4"]
        ]
      },
      {
        type: "text",
        title: "Sanitation & Accessibility",
        content: "### Dedicated Washrooms\nSeparate washroom blocks for boys and girls on each floor of the building.\n\n### CWSN washrooms\nSpecialized washrooms accessible for Children With Special Needs (CWSN) on each floor."
      }
    ]
  },
  "affiliation-status": {
    title: "School Affiliation Status",
    subtitle: "CBSE Compliance",
    sections: [
      {
        type: "pdf",
        title: "School Affiliation Certificate",
        content: "Official document provided by CBSE Board.",
        value: "https://gmhspocket1manimajra.com/wp-content/uploads/2023/06/school-affiliation.pdf"
      }
    ]
  },
  "mandatory-public-disclosure": {
    title: "Mandatory Public Disclosure",
    subtitle: "CBSE Compliance",
    sections: [
      {
        type: "pdf",
        title: "Public Disclosure PDF",
        content: "Official documentation required for compliance.",
        value: "https://gmhspocket1manimajra.com/wp-content/uploads/2023/06/Mandatory-Public-Disclosure.pdf"
      }
    ]
  }
};

function renderMarkdown(text: string) {
  if (!text) return "";
  let escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  escaped = escaped.replace(/^###\s+(.*?)$/gm, '<h4 class="text-sm font-bold text-slate-800 uppercase tracking-wider mt-4 mb-1.5">$1</h4>');
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  escaped = escaped.replace(/\*(.*?)\*/g, "<em>$1</em>");
  escaped = escaped.replace(/^\s*[-*]\s+(.*?)$/gm, '<li class="ml-4 list-disc text-slate-600 text-xs my-0.5">$1</li>');
  escaped = escaped.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-indigo-650 hover:underline" target="_blank">$1</a>');
  escaped = escaped.replace(/\n/g, "<br />");
  return escaped;
}

const DynamicPageView = ({ slug }: { slug: string }) => {
  const [page, setPage] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/admin/pages/${slug}`);
        if (data.success && data.page) {
          setPage(data.page);
        }
      } catch (err: any) {
        if (err.response?.status === 404 && DEFAULT_PAGES[slug]) {
          // Self-heal: Save default page config
          const defaultConfig = DEFAULT_PAGES[slug];
          setPage(defaultConfig);
          try {
            // Write it back to backend (note: this might be unauthenticated if we don't have a token, 
            // but we can skip writing or just handle locally in state if write fails. 
            // Actually, we'll write it through a public-friendly endpoint or let the admin save it. 
            // We will just write to disk if admin, else render from state)
            await axios.post(`/api/admin/pages/${slug}`, defaultConfig);
          } catch {
            // Ignore write errors (unauth) and just render local default state
          }
        } else {
          setError(err.response?.data?.error || "Failed to load page content.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-40 pb-24 flex justify-center items-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
          <p className="text-slate-400 text-xs font-semibold">Loading page contents...</p>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto text-center">
        <div className="glass-panel border-slate-200/60 rounded-3xl p-12 bg-white flex flex-col items-center gap-3">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="text-slate-500 font-bold">{error || "Page Not Found"}</p>
          <Link href="/" className="mt-4 inline-flex items-center gap-2 text-indigo-900 font-semibold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
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
          {page.subtitle && (
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">{page.subtitle}</span>
          )}
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {page.title}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-100/50 py-1.5 px-3 rounded-full shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Official Content</span>
        </div>
      </div>

      {/* Render Sections */}
      <div className="glass-panel border-slate-200/60 bg-white/95 rounded-3xl p-6 md:p-8 shadow-xl space-y-8">
        {page.sections && page.sections.length === 0 ? (
          <div className="text-center py-10 text-slate-400 italic text-sm">
            This page has no content sections yet. Customize it from the admin portal!
          </div>
        ) : (
          page.sections?.map((section: any, idx: number) => {
            const heading = section.title || "";

            return (
              <div key={idx} className="space-y-3 text-left">
                {heading && (
                  <div className="inline-flex items-center gap-1.5 bg-indigo-50/60 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{heading}</span>
                  </div>
                )}

                {section.type === "text" && (
                  <div 
                    className="text-slate-650 text-sm leading-relaxed font-medium space-y-2 p-1"
                    dangerouslySetInnerHTML={{ __html: renderMarkdown(section.content) }}
                  />
                )}

                {section.type === "table" && (
                  <div className="overflow-hidden border border-slate-100 rounded-xl shadow-sm bg-white">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          {section.headers?.map((header: string, hIdx: number) => (
                            <TableHead key={hIdx} className="font-extrabold text-slate-800 text-xs py-3 px-4">
                              {header}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {section.rows?.map((row: string[], rIdx: number) => (
                          <TableRow key={rIdx} className="hover:bg-slate-50/40 transition-colors">
                            {row.map((cell: string, cIdx: number) => (
                              <TableCell key={cIdx} className="text-slate-650 text-xs font-medium py-3.5 px-4 leading-relaxed">
                                {cell}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {section.type === "pdf" && (
                  <div className="space-y-4">
                    {section.content && (
                      <p className="text-slate-500 text-xs font-medium pl-1">{section.content}</p>
                    )}
                    
                    {/* PDF Action Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 rounded-2xl border border-slate-150 bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 shrink-0">
                          <FileText className="w-5.5 h-5.5" />
                        </div>
                        <div className="text-left font-medium">
                          <h4 className="font-bold text-slate-800 text-xs">Attached Document</h4>
                          <p className="text-slate-400 text-[10px]">Click to download or view details.</p>
                        </div>
                      </div>
                      <a
                        href={section.value}
                        download
                        target="_blank"
                        className="inline-flex items-center justify-center gap-1.5 bg-indigo-900 hover:bg-indigo-850 text-white font-semibold px-4 py-2 rounded-xl text-xs shadow-md transition-all duration-200 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </a>
                    </div>

                    {/* PDF frame */}
                    {section.value && (
                      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm bg-slate-50 aspect-[4/3] md:h-[600px] w-full">
                        <iframe
                          width="100%"
                          height="100%"
                          className="w-full h-full border-0"
                          src={section.value}
                          title={heading}
                        >
                          <p className="text-slate-500 text-xs p-6 text-center">
                            Your browser does not support embedded PDF files. Please click the button above to download.
                          </p>
                        </iframe>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default DynamicPageView;
