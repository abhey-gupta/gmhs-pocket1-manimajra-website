"use client";

import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Logo1 from "@/public/logo/logo1.jpg";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Label } from "./ui/label";

const SchoolCommittees = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <DropdownMenuLabel className="text-left transition rounded-lg text-xs md:text-sm">
        <Label>School Committees</Label>
      </DropdownMenuLabel>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>
        <Link href="#home">School Management Committee (SMC)</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="#about">Sexual Harrasment Committe</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="#contact">Child Friendly Committee</Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const Results = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <DropdownMenuLabel className="text-left   rounded-lg">
        Results
      </DropdownMenuLabel>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((val) => (
        <DropdownMenuItem key={val}>
          <Link href="#home">Class-{val}</Link>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

const Achievements = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <DropdownMenuLabel className="text-left   rounded-lg">
        Achievements
      </DropdownMenuLabel>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>
        <Link href="#home">Academic</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="#about">Non Academic</Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const CBSE = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <DropdownMenuLabel className="hover:scale-110 py-1 px-2 transition hover:text-black cursor-pointer">
        CBSE
      </DropdownMenuLabel>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>
        <Link href="/cbse/affiliation-status">Affiliation Status</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="/cbse/mandatory-public-disclosure">
          Mandatory Public Disclosure
        </Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const SchoolInfo = () => (
  <DropdownMenu>
    <DropdownMenuTrigger>
      <DropdownMenuLabel className="text-left md:  rounded-lg text-xs md:text-sm">
        <Label>School Info</Label>
      </DropdownMenuLabel>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>
        <Link href="#home">Students Enrolment</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="/info/school-uniform">School Uniform</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="/info/infrastructure">Infrastructure</Link>
      </DropdownMenuItem>
      <DropdownMenuItem>
        <Link href="#contact">Staff</Link>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
);

const Navbar = () => {
  return (
    <div className="fixed z-20 mt-4 w-full top-0">
      <ul className="flex bg-gray-50 w-fit mx-auto bg-opacity-80 gap-3 items-center py-2 px-4 rounded-full text-gray-600 shadow-md text-xs md:text-md">
        <li className="font-semibold py-1 px-2">
          <Image
            src={Logo1}
            alt="Logo"
            className="object-contain rounded-full h-5 md:h-6 w-fit"
          />
        </li>
        <li className="hover:scale-110 font-semibold py-1 px-2 transition hover:text-black cursor-pointer">
          <Link href="/#home">
            <Label>Home</Label>
          </Link>
        </li>
        <li className="hover:scale-110 font-semibold py-1 px-2 transition hover:text-black cursor-pointer">
          <CBSE />
        </li>
        <li className="hover:scale-110 font-semibold py-1 px-2 transition hover:text-black cursor-pointer">
          <SchoolInfo />
        </li>
        <li className="hover:scale-110 font-semibold py-1 px-2 transition hover:text-black cursor-pointer hidden md:block">
          <SchoolCommittees />
        </li>
        <li className="hover:scale-110 font-semibold py-1 px-2 transition hover:text-black cursor-pointer hidden md:block">
          <Results />
        </li>
        <li className="hover:scale-110 font-semibold py-1 px-2 transition hover:text-black cursor-pointer hidden md:block">
          <Achievements />
        </li>
        <li className="hover:scale-110 font-semibold py-1 px-2 transition hover:text-black cursor-pointer md:hidden">
          <Sheet>
            <SheetTrigger>
              <Label>More</Label>
            </SheetTrigger>
            <SheetContent className="bg-white bg-opacity-90 w-fit">
              <SheetHeader className="my-2">
                <SheetTitle>Browse Other Info</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col mt-3 gap-2">
                <SchoolCommittees />
                <Results />
                <Achievements />
              </div>
            </SheetContent>
          </Sheet>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
