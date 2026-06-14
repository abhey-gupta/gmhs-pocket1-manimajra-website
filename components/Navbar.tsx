// @ts-nocheck
"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo1 from "@/public/logo/logo1.jpg";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { ChevronDown, Menu, ShieldAlert } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fallbackNavigation = [
  {
    id: "cbse",
    label: "CBSE",
    items: [
      { id: "as", label: "Affiliation Status", type: "pdf", value: "https://gmhspocket1manimajra.com/wp-content/uploads/2023/06/school-affiliation.pdf" },
      { id: "mpd", label: "Mandatory Public Disclosure", type: "pdf", value: "https://gmhspocket1manimajra.com/wp-content/uploads/2023/06/Mandatory-Public-Disclosure.pdf" }
    ]
  },
  {
    id: "school-info",
    label: "School Info",
    items: [
      { id: "se", label: "Students Enrolment", type: "url", value: "/#home" },
      { id: "su", label: "School Uniform", type: "page", value: "school-uniform" },
      { id: "infra", label: "Infrastructure", type: "page", value: "infrastructure" },
      { id: "staff", label: "Staff", type: "url", value: "/#contact" }
    ]
  },
  {
    id: "committees",
    label: "Committees",
    items: [
      { id: "smc", label: "School Management (SMC)", type: "url", value: "/#home" },
      { id: "shc", label: "Sexual Harassment Committee", type: "url", value: "/#about" },
      { id: "cfc", label: "Child Friendly Committee", type: "url", value: "/#contact" }
    ]
  },
  {
    id: "results",
    label: "Results",
    items: [
      { id: "c1", label: "Class 1", type: "url", value: "/#home" },
      { id: "c2", label: "Class 2", type: "url", value: "/#home" },
      { id: "c3", label: "Class 3", type: "url", value: "/#home" },
      { id: "c4", label: "Class 4", type: "url", value: "/#home" },
      { id: "c5", label: "Class 5", type: "url", value: "/#home" },
      { id: "c6", label: "Class 6", type: "url", value: "/#home" },
      { id: "c7", label: "Class 7", type: "url", value: "/#home" },
      { id: "c8", label: "Class 8", type: "url", value: "/#home" },
      { id: "c9", label: "Class 9", type: "url", value: "/#home" },
      { id: "c10", label: "Class 10", type: "url", value: "/#home" }
    ]
  },
  {
    id: "achievements",
    label: "Achievements",
    items: [
      { id: "acad", label: "Academic", type: "url", value: "/#home" },
      { id: "non-acad", label: "Non Academic", type: "url", value: "/#about" }
    ]
  }
];

const NavDropdown = ({ group, isMobile = false }) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="focus:outline-none w-full text-left">
      <span className={`flex items-center justify-between md:justify-start gap-1 font-semibold py-1.5 px-3 rounded-lg text-slate-700 hover:text-amber-600 transition duration-200 text-sm cursor-pointer ${isMobile ? "w-full hover:bg-slate-50" : "hover:scale-105"}`}>
        {group.label}
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuContent className={`glass-panel border-slate-200/60 rounded-xl shadow-xl animate-in fade-in-50 zoom-in-95 duration-200 z-[999] ${
      group.items.length > 6 
        ? "grid grid-cols-2 gap-1 min-w-[220px] p-2" 
        : "min-w-[190px] p-1.5 flex flex-col gap-0.5"
    }`}>
      {group.items?.map((item) => {
        let href = "";
        if (item.type === "page") {
          href = `/p/${item.value}`;
        } else {
          href = item.value;
        }

        // Handle cbse/info redirects for backwards compatibility
        if (item.type === "page" && (item.value === "affiliation-status" || item.value === "mandatory-public-disclosure")) {
          href = `/cbse/${item.value}`;
        } else if (item.type === "page" && (item.value === "school-uniform" || item.value === "infrastructure")) {
          href = `/info/${item.value}`;
        }

        return (
          <DropdownMenuItem key={item.id} className="rounded-lg focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer p-0">
            <Link href={href} className="w-full block py-1.5 px-3.5 text-xs font-semibold text-slate-700">
              {item.label}
            </Link>
          </DropdownMenuItem>
        );
      })}
    </DropdownMenuContent>
  </DropdownMenu>
);

const Navbar = () => {
  // Fetch customized navigation
  const { data: navigation } = useQuery({
    queryKey: ["navigation"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/navigation");
      if (!data.success) throw new Error(data.error);
      return data.navigation;
    },
    staleTime: 60000, // 1 minute stale time
  });

  const menuItems = navigation || fallbackNavigation;

  return (
    <div className="fixed z-50 mt-4 w-full top-0 px-4 flex justify-center">
      <div className="flex items-center justify-between w-full max-w-5xl glass-panel bg-white/80 border border-slate-200/50 shadow-md py-2.5 px-5 rounded-full md:px-8">
        <Link href="/#home" className="flex items-center gap-2 group focus:outline-none">
          <Image
            src={Logo1}
            alt="School Logo"
            className="object-contain rounded-full h-8 w-8 border border-slate-100 group-hover:rotate-[15deg] transition-transform duration-300"
          />
          <span className="font-extrabold text-slate-900 tracking-tight text-sm md:text-base hidden sm:inline-block">
            GMHS <span className="text-amber-600 font-bold">Pocket 1</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-2 items-center text-slate-650">
          <li>
            <Link href="/#home" className="font-semibold py-1.5 px-3 rounded-lg text-slate-700 hover:text-amber-600 hover:scale-105 transition duration-200 text-sm">
              Home
            </Link>
          </li>
          {menuItems.map((group) => (
            <li key={group.id}>
              <NavDropdown group={group} />
            </li>
          ))}
        </ul>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none cursor-pointer" aria-label="Toggle Menu">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent className="bg-white/95 backdrop-blur-md w-[280px] border-l border-slate-100 p-6 flex flex-col gap-6">
              <SheetHeader className="text-left border-b border-slate-100 pb-4">
                <SheetTitle className="flex items-center gap-2">
                  <Image
                    src={Logo1}
                    alt="School Logo"
                    className="object-contain rounded-full h-8 w-8"
                  />
                  <span className="font-extrabold text-slate-900 text-base">
                    GMHS Pocket 1
                  </span>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-2 flex-grow overflow-y-auto pr-1 text-left">
                <Link href="/#home" className="font-semibold py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50 transition duration-150 text-sm block">
                  Home
                </Link>
                <div className="border-t border-slate-50 my-1"></div>
                {menuItems.map((group) => (
                  <NavDropdown key={group.id} group={group} isMobile={true} />
                ))}
              </nav>
              <div className="mt-auto border-t border-slate-100 pt-4 flex flex-col gap-2">
                <Link href="/admin" className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-xl text-xs transition duration-200">
                  Admin Portal
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
