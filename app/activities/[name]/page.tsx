// @ts-nocheck
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Image as ImageIcon, Calendar, Layers, Eye } from "lucide-react";

interface PageProps {
  params: {
    name: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { name } = params;

  let files: string[] = [];
  const bucketName = "gmhspkt1";

  try {
    const { data: years, error: yearsError } = await supabaseAdmin.storage
      .from(bucketName)
      .list(`activities/${name}`);

    if (!yearsError && years) {
      for (const year of years) {
        if (!year.id) { // Directory
          const { data: titles, error: titlesError } = await supabaseAdmin.storage
            .from(bucketName)
            .list(`activities/${name}/${year.name}`);

          if (titlesError || !titles) continue;

          for (const title of titles) {
            if (!title.id) { // Directory
              const { data: fileItems, error: filesError } = await supabaseAdmin.storage
                .from(bucketName)
                .list(`activities/${name}/${year.name}/${title.name}`);

              if (filesError || !fileItems) continue;

              for (const fileItem of fileItems) {
                if (fileItem.id) { // File
                  const storagePath = `activities/${name}/${year.name}/${title.name}/${fileItem.name}`;
                  const { data: { publicUrl } } = supabaseAdmin.storage
                    .from(bucketName)
                    .getPublicUrl(storagePath);
                  files.push(publicUrl);
                }
              }
            }
          }
        }
      }
    }
  } catch (e) {
    console.error("Error scanning Supabase Storage for activities:", e);
  }

  const formattedFiles = files.reduce<Record<string, Record<string, string[]>>>((acc, filePath) => {
    const parts = filePath.split("/");
    const actIdx = parts.indexOf("activities");
    
    if (actIdx !== -1 && parts.length > actIdx + 4) {
      const year = parts[actIdx + 2];
      const title = parts[actIdx + 3];
      const file = parts[actIdx + 4];

      if (year && title && file) {
        if (!acc[year]) {
          acc[year] = {};
        }
        if (!acc[year][title]) {
          acc[year][title] = [];
        }
        acc[year][title].push(filePath);
      }
    }

    return acc;
  }, {});

  const displayTitle = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <section className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Breadcrumb Back Button */}
      <div className="mb-6">
        <Link
          href="/#activities"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-indigo-950 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Activities</span>
        </Link>
      </div>

      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5 mb-8">
        <div className="space-y-1.5 text-left">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">School Gallery</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {displayTitle}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-100/50 py-1.5 px-3 rounded-full">
          <Layers className="w-4 h-4 text-slate-500" />
          <span>{Object.keys(formattedFiles).length} Academic Years Found</span>
        </div>
      </div>

      {/* Year-by-Year Accordion */}
      {Object.keys(formattedFiles).length === 0 ? (
        <div className="glass-panel border-slate-200/50 bg-white rounded-3xl p-16 text-center">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-bold">No activity folders found</p>
          <p className="text-slate-400 text-xs mt-1">Check back later or verify files are uploaded in storage.</p>
        </div>
      ) : (
        <Accordion type="multiple" className="w-full space-y-4">
          {Object.keys(formattedFiles).map((year) => (
            <AccordionItem
              key={year}
              value={year}
              className="border border-slate-200/60 rounded-2xl bg-white shadow-sm overflow-hidden"
            >
              <AccordionTrigger className="text-lg font-bold text-slate-800 px-6 py-4 hover:bg-slate-50/50 hover:no-underline transition-colors">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>Session {year}</span>
                </div>
              </AccordionTrigger>

              <AccordionContent className="p-6 bg-slate-50/30 border-t border-slate-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                  {Object.keys(formattedFiles[year]).map((title) => {
                    const imgList = formattedFiles[year][title];
                    return (
                      <Dialog key={title}>
                        <DialogTrigger asChild>
                          <div className="group flex flex-col bg-white border border-slate-200/50 hover:border-slate-300 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer h-80 w-64 relative">
                            {/* Stacked Image Deck Visual */}
                            <div className="relative w-full h-52 mb-4 flex items-center justify-center">
                              {imgList.slice(0, 3).map((img, index) => {
                                const rot = index === 1 ? "rotate-[4deg]" : index === 2 ? "rotate-[-4deg]" : "rotate-0";
                                const scale = index === 0 ? "scale-100" : "scale-[0.96]";
                                  return (
                                    <img
                                      key={img}
                                      src={img.startsWith("http") ? img : `/${img}`}
                                      className={`absolute object-cover h-44 w-44 rounded-xl border border-slate-200/60 bg-white shadow-sm transition-transform duration-500 ${rot} ${scale}`}
                                      style={{
                                        zIndex: 10 - index,
                                        transformOrigin: "bottom center",
                                      }}
                                      alt=""
                                    />
                                  );
                              })}
                              {/* Hover Indicator */}
                              <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center z-30">
                                <span className="bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-bold py-1.5 px-3 rounded-full flex items-center gap-1 shadow">
                                  <Eye className="w-3.5 h-3.5" /> View Gallery
                                </span>
                              </div>
                            </div>

                            <div className="mt-auto text-left space-y-1 z-10">
                              <h3 className="text-base font-extrabold text-slate-800 line-clamp-1 group-hover:text-indigo-900 transition-colors">
                                {title}
                              </h3>
                              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                                {imgList.length} Photos
                              </p>
                            </div>
                          </div>
                        </DialogTrigger>

                        {/* Lightbox / Grid Dialog */}
                        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-md">
                          <DialogHeader className="border-b border-slate-100 pb-4 mb-6 text-left">
                            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Activity Photo Pack</span>
                            <DialogTitle className="text-xl sm:text-2xl font-extrabold text-slate-900">
                              {title}
                            </DialogTitle>
                          </DialogHeader>

                          {/* Image Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4">
                            {imgList.map((img) => (
                              <div
                                key={img}
                                className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200/50 bg-slate-50 shadow-sm group"
                              >
                                <img
                                  src={img.startsWith("http") ? img : `/${img}`}
                                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                  alt={title}
                                />
                                <a
                                  href={img.startsWith("http") ? img : `/${img}`}
                                  target="_blank"
                                  className="absolute bottom-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                  title="View full-size image"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </a>
                              </div>
                            ))}
                          </div>
                        </DialogContent>
                      </Dialog>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </section>
  );
};

export default Page;
