// @ts-nocheck
import Link from "next/link";
import { ArrowLeft, ShieldAlert, Sparkles } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SchoolUniform = () => {
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
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Student Guidelines</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            School Uniform Specifications
          </h1>
        </div>
      </div>

      <div className="glass-panel border-slate-200/60 bg-white/95 rounded-3xl p-6 md:p-8 shadow-xl space-y-8">
        
        {/* Table 1: Primary */}
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Primary Classes (1st to 5th Grade)</span>
          </div>

          <div className="overflow-hidden border border-slate-100 rounded-xl shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-extrabold text-slate-800 text-sm py-3 px-4">Boys Uniform</TableHead>
                  <TableHead className="font-extrabold text-slate-800 text-sm py-3 px-4">Girls Uniform</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-slate-50/40 transition-colors">
                  <TableCell className="text-slate-650 text-sm font-medium py-4 px-4 leading-relaxed">
                    Shorts and Shirt (colour as per specification of the Education Department, Chandigarh Administration)
                  </TableCell>
                  <TableCell className="text-slate-650 text-sm font-medium py-4 px-4 leading-relaxed">
                    Shirt and Tunic (colour as per specification of the Education Department, Chandigarh Administration)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Table 2: Middle & High */}
        <div className="space-y-3 text-left">
          <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-900 text-xs font-bold px-3 py-1 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Middle & High Classes (6th to 10th Grade)</span>
          </div>

          <div className="overflow-hidden border border-slate-100 rounded-xl shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-extrabold text-slate-800 text-sm py-3 px-4">Boys Uniform</TableHead>
                  <TableHead className="font-extrabold text-slate-800 text-sm py-3 px-4">Girls Uniform</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-slate-50/40 transition-colors">
                  <TableCell className="text-slate-650 text-sm font-medium py-4 px-4 leading-relaxed">
                    Trousers and Shirt (colour as per specification of the Education Department, Chandigarh Administration)
                  </TableCell>
                  <TableCell className="text-slate-650 text-sm font-medium py-4 px-4 leading-relaxed">
                    Salwar / Skirt and Suit/Shirt (colour as per specification of the Education Department, Chandigarh Administration)
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Administration Footer Note */}
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50/50 border border-amber-100 text-left">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Note to Parents</h4>
            <p className="text-slate-600 text-xs leading-relaxed font-medium">
              Uniform color palettes and patterns are strictly governed by guidelines from the Education Department of Chandigarh Administration. Please verify current specifications with class teachers before buying.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default SchoolUniform;
