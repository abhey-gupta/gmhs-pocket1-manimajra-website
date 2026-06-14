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
import { ChevronDown, Menu } from "lucide-react";

const SchoolCommittees = ({ isMobile = false }) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="focus:outline-none w-full text-left">
      <span className={`flex items-center justify-between md:justify-start gap-1 font-semibold py-1.5 px-3 rounded-lg text-slate-700 hover:text-amber-600 transition duration-200 text-sm cursor-pointer ${isMobile ? "w-full hover:bg-slate-50" : "hover:scale-105"}`}>
        Committees
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="glass-panel p-1.5 border-slate-200/60 min-w-[220px] rounded-xl shadow-xl animate-in fade-in-50 zoom-in-95 duration-200">
      <DropdownMenuItem className="rounded-lg focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
        <Link href="#home" className="w-full block py-1.5 px-2 text-xs font-medium text-slate-700">School Management (SMC)</Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="rounded-lg focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
        <Link href="#about" className="w-full block py-1.5 px-2 text-xs font-medium text-slate-700">Sexual Harassment Committee</Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="rounded-lg focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
        <Link href="#contact" className="w-full block py-1.5 px-2 text-xs font-medium text-slate-700">Child Friendly Committee</Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const Results = ({ isMobile = false }) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="focus:outline-none w-full text-left">
      <span className={`flex items-center justify-between md:justify-start gap-1 font-semibold py-1.5 px-3 rounded-lg text-slate-700 hover:text-amber-600 transition duration-200 text-sm cursor-pointer ${isMobile ? "w-full hover:bg-slate-50" : "hover:scale-105"}`}>
        Results
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="glass-panel p-2 border-slate-200/60 grid grid-cols-2 gap-1 min-w-[200px] rounded-xl shadow-xl animate-in fade-in-50 zoom-in-95 duration-200">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
        <DropdownMenuItem key={val} className="rounded-lg focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer p-0">
          <Link href="#home" className="w-full text-center py-1.5 text-xs font-medium text-slate-700">Class {val}</Link>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const Achievements = ({ isMobile = false }) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="focus:outline-none w-full text-left">
      <span className={`flex items-center justify-between md:justify-start gap-1 font-semibold py-1.5 px-3 rounded-lg text-slate-700 hover:text-amber-600 transition duration-200 text-sm cursor-pointer ${isMobile ? "w-full hover:bg-slate-50" : "hover:scale-105"}`}>
        Achievements
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="glass-panel p-1.5 border-slate-200/60 min-w-[160px] rounded-xl shadow-xl animate-in fade-in-50 zoom-in-95 duration-200">
      <DropdownMenuItem className="rounded-lg focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
        <Link href="#home" className="w-full block py-1.5 px-2 text-xs font-medium text-slate-700">Academic</Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="rounded-lg focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
        <Link href="#about" className="w-full block py-1.5 px-2 text-xs font-medium text-slate-700">Non Academic</Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const CBSE = ({ isMobile = false }) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="focus:outline-none w-full text-left">
      <span className={`flex items-center justify-between md:justify-start gap-1 font-semibold py-1.5 px-3 rounded-lg text-slate-700 hover:text-amber-600 transition duration-200 text-sm cursor-pointer ${isMobile ? "w-full hover:bg-slate-50" : "hover:scale-105"}`}>
        CBSE
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="glass-panel p-1.5 border-slate-200/60 min-w-[220px] rounded-xl shadow-xl animate-in fade-in-50 zoom-in-95 duration-200">
      <DropdownMenuItem className="rounded-lg focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
        <Link href="/cbse/affiliation-status" className="w-full block py-1.5 px-2 text-xs font-medium text-slate-700">Affiliation Status</Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="rounded-lg focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
        <Link href="/cbse/mandatory-public-disclosure" className="w-full block py-1.5 px-2 text-xs font-medium text-slate-700">Mandatory Public Disclosure</Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const SchoolInfo = ({ isMobile = false }) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="focus:outline-none w-full text-left">
      <span className={`flex items-center justify-between md:justify-start gap-1 font-semibold py-1.5 px-3 rounded-lg text-slate-700 hover:text-amber-600 transition duration-200 text-sm cursor-pointer ${isMobile ? "w-full hover:bg-slate-50" : "hover:scale-105"}`}>
        School Info
        <ChevronDown className="w-3.5 h-3.5 opacity-60" />
      </span>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="glass-panel p-1.5 border-slate-200/60 min-w-[180px] rounded-xl shadow-xl animate-in fade-in-50 zoom-in-95 duration-200">
      <DropdownMenuItem className="rounded-lg focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
        <Link href="#home" className="w-full block py-1.5 px-2 text-xs font-medium text-slate-700">Students Enrolment</Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="rounded-lg focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
        <Link href="/info/school-uniform" className="w-full block py-1.5 px-2 text-xs font-medium text-slate-700">School Uniform</Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="rounded-lg focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
        <Link href="/info/infrastructure" className="w-full block py-1.5 px-2 text-xs font-medium text-slate-700">Infrastructure</Link>
      </DropdownMenuItem>
      <DropdownMenuItem className="rounded-lg focus:bg-indigo-50 focus:text-indigo-900 cursor-pointer">
        <Link href="#contact" className="w-full block py-1.5 px-2 text-xs font-medium text-slate-700">Staff</Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const Navbar = () => {
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
        <ul className="hidden md:flex gap-2 items-center text-slate-600">
          <li>
            <Link href="/#home" className="font-semibold py-1.5 px-3 rounded-lg text-slate-700 hover:text-amber-600 hover:scale-105 transition duration-200 text-sm">
              Home
            </Link>
          </li>
          <li>
            <CBSE />
          </li>
          <li>
            <SchoolInfo />
          </li>
          <li>
            <SchoolCommittees />
          </li>
          <li>
            <Results />
          </li>
          <li>
            <Achievements />
          </li>
        </ul>

        {/* Mobile Navigation Trigger */}
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <button className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none" aria-label="Toggle Menu">
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
              <nav className="flex flex-col gap-2 flex-grow overflow-y-auto pr-1">
                <Link href="/#home" className="font-semibold py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-50 transition duration-150 text-sm block">
                  Home
                </Link>
                <div className="border-t border-slate-50 my-1"></div>
                <CBSE isMobile={true} />
                <SchoolInfo isMobile={true} />
                <SchoolCommittees isMobile={true} />
                <Results isMobile={true} />
                <Achievements isMobile={true} />
              </nav>
              <div className="mt-auto border-t border-slate-100 pt-4 flex flex-col gap-2">
                <Link href="/admin/login" className="w-full text-center bg-slate-900 hover:bg-slate-800 text-white font-medium py-2 rounded-xl text-xs transition duration-200">
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
