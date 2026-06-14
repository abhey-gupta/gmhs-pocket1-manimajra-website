// @ts-nocheck
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Building2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Infrastructure = () => {
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
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">School Campus</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Infrastructure & Facilities
          </h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold bg-slate-100/50 py-1.5 px-3 rounded-full">
          <Building2 className="w-4 h-4 text-slate-500" />
          <span>Pocket-1 Campus Map</span>
        </div>
      </div>

      <div className="glass-panel border-slate-200/60 bg-white/95 rounded-3xl p-6 md:p-8 shadow-xl space-y-8">
        
        {/* Rooms Listing Table */}
        <div className="space-y-3 text-left">
          <h3 className="font-extrabold text-slate-800 text-lg leading-tight">Room Inventory</h3>
          <div className="overflow-hidden border border-slate-100 rounded-xl shadow-sm">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="font-extrabold text-slate-800 text-sm py-3 px-6">Rooms / Labs</TableHead>
                  <TableHead className="font-extrabold text-slate-800 text-sm py-3 px-6 text-center w-36">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { name: "Class Rooms", count: 27 },
                  { name: "Composite Science Lab", count: 1 },
                  { name: "Mathematics Lab", count: 1 },
                  { name: "Computer Science Lab", count: 1 },
                  { name: "Home Science Lab", count: 1 },
                  { name: "Other Special Labs", count: 1 },
                  { name: "Library", count: 1 },
                  { name: "Administrative Rooms", count: 4 },
                ].map((row, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50/40 transition-colors">
                    <TableCell className="text-slate-700 text-sm font-semibold py-3 px-6">{row.name}</TableCell>
                    <TableCell className="text-slate-600 text-sm font-extrabold py-3 px-6 text-center">
                      <span className="inline-block px-3 py-0.5 rounded-full bg-slate-100 text-slate-800 text-xs">
                        {row.count < 10 ? `0${row.count}` : row.count}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Additional Amenities Cards */}
        <div className="space-y-4 text-left">
          <h3 className="font-extrabold text-slate-800 text-lg leading-tight">Sanitation & Accessibility</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 font-medium">
                <h4 className="font-bold text-slate-800 text-sm">Dedicated Washrooms</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Separate washroom blocks for boys and girls on each floor of the building.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-2xl border border-slate-100 bg-slate-50/40">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 font-medium">
                <h4 className="font-bold text-slate-800 text-sm">CWSN washrooms</h4>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Specialized washrooms accessible for Children With Special Needs (CWSN) on each floor.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Infrastructure;
