// @ts-nocheck
import Image from "next/image";
import SchoolImage from "@/public/school.jpg";
import PrincipalImage from "@/public/principal.jpg";
import Logo1 from "@/public/logo/logo1.jpg";
import Logo2 from "@/public/logo/logo2.jpg";
import SectionDivider from "@/components/SectionDivider";
import Initiatives from "@/sections/Initiatives";
import Announcements from "@/components/Announcements";
import Link from "next/link";
import { ArrowRight, Award, Quote } from "lucide-react";

export default async function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* Premium Hero Section */}
      <section id="home" className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content */}
          <div className="flex flex-col gap-6 lg:col-span-7 text-center lg:text-left z-10">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 w-fit mx-auto lg:mx-0 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/50 text-amber-800 text-xs font-semibold shadow-sm animate-pulse-subtle">
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>CBSE Affiliated High School</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                Government Model <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-900 via-indigo-700 to-amber-600">
                  High School
                </span>
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Pocket No. 1, Manimajra, U.T. Chandigarh
              </h2>
            </div>

            <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Igniting a passion for lifelong learning, empowering students to think critically, and preparing them for a successful, inclusive future in the living present.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="#announcements"
                className="inline-flex items-center gap-2 bg-indigo-900 hover:bg-indigo-950 text-white font-semibold px-6 py-3 rounded-full text-sm shadow-lg shadow-indigo-900/10 hover:shadow-indigo-900/20 transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <span>Latest Announcements</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#about"
                className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold px-6 py-3 rounded-full text-sm shadow-sm transition-all duration-200 hover:-translate-y-0.5"
              >
                About Our School
              </Link>
            </div>

            {/* Sub-Badges / Affiliation logos */}
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-6 border-t border-slate-200/60 max-w-md mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5">
                <Image
                  src={Logo1}
                  alt="Dept of Education Logo"
                  className="object-contain rounded-full h-10 w-10 border border-slate-100 p-0.5"
                />
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Under Admin of</p>
                  <p className="text-xs font-bold text-slate-700">Education Dept.</p>
                </div>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div className="flex items-center gap-2.5">
                <Image
                  src={Logo2}
                  alt="Chandigarh Administration Logo"
                  className="h-10 w-10 object-contain rounded-full border border-slate-100 p-0.5"
                />
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none">Government of</p>
                  <p className="text-xs font-bold text-slate-700">U.T. Chandigarh</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="lg:col-span-5 relative w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[420px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl group border-4 border-white animate-float">
              {/* Gold Accent Backdrop */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent z-10"></div>
              <Image
                src={SchoolImage}
                alt="GMHS Pocket 1 School Building"
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              <div className="absolute bottom-6 left-6 right-6 z-25 text-left text-white">
                <span className="bg-amber-500 text-slate-900 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full tracking-wider">Campus View</span>
                <p className="font-bold text-lg mt-1 text-white shadow-sm">State-of-the-art Infrastructure</p>
              </div>
            </div>
            {/* Background design glow */}
            <div className="absolute -z-10 w-72 h-72 rounded-full bg-indigo-200/40 blur-3xl -top-10 -right-10"></div>
            <div className="absolute -z-10 w-64 h-64 rounded-full bg-amber-200/30 blur-3xl -bottom-10 -left-10"></div>
          </div>
          
        </div>
      </section>

      <SectionDivider />

      {/* Announcements Section wrapper with relative position and anchor */}
      <div id="announcements" className="scroll-mt-28">
        <Announcements />
      </div>

      <SectionDivider />

      {/* Principal's Editorial Section */}
      <section
        id="about"
        className="scroll-mt-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="glass-panel border border-slate-200/60 rounded-3xl p-6 md:p-12 shadow-xl bg-white/90 relative overflow-hidden">
          {/* Subtle background graphic */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-full -z-10"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Principal's Framed Image */}
            <div className="lg:col-span-4 flex flex-col items-center gap-4 text-center">
              <div className="relative group">
                {/* Visual frame offset */}
                <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-amber-500 translate-x-3 translate-y-3 -z-10 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform duration-300"></div>
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border-4 border-white shadow-md bg-slate-50">
                  <Image
                    src={PrincipalImage}
                    alt="School Principal"
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-1 mt-2">
                <h3 className="font-extrabold text-slate-900 text-lg leading-tight">Headmistress / Principal</h3>
                <p className="text-slate-400 text-xs">GMHS Pocket 1, Manimajra</p>
              </div>
            </div>

            {/* Message Content */}
            <div className="lg:col-span-8 flex flex-col gap-5 text-left">
              <div className="flex gap-2 items-center">
                <Quote className="w-8 h-8 text-amber-500/30 shrink-0" />
                <h2 className="font-extrabold text-2xl md:text-3xl text-slate-900 tracking-tight">
                  Principal's Message
                </h2>
              </div>
              
              <div className="text-slate-650 text-xs md:text-sm leading-relaxed font-medium">
                <p>
                  Our school is a sought after school not only because of its sprawling campus and but also because it offers courses in all language i.e English, Hindi, Punjabi. It is a building with four walls but has a tomorrow inside. Our focus is ‘the child’ i.e we aim at imparting child centred education. We keep organising both academic and non-academic activities to teach all aspects of the education and develop the child physically, mentally, emotionally and socially. We aim at inculcating values of honesty, kindness etc as they are going to be the future citizens. Our motto is that every child should reach the level of excellence, he/she is capable of and the teachers act as their guide in this pursuit. In partnership with family and community, we engage students, to become informed, compassionate global citizens. Our aim is to make them learn to do their best, work for others and be safe and kind. We have an SMC (school management committee), Sexual Harassment Committee and Student Grievance Redressal Forum for better functioning of the school. We believe in “Think of no future however bright Let the dead past bury its dead. Act Act Act in the living present. Heart within and God overhead.“
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                <span className="text-xs text-slate-400 font-semibold">GMHS Pocket 1 Academic Portal</span>
                <span className="font-bold text-slate-800 text-sm">
                  Regards ✨
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Our Mission Section */}
      <section
        id="about"
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-28"
      >
        <div className="glass-panel border-slate-200/60 bg-white/95 rounded-3xl p-8 md:p-12 shadow-md relative overflow-hidden text-center">
          <div className="absolute top-0 left-0 w-24 h-24 bg-amber-500/5 rounded-br-full -z-10"></div>
          
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-indigo-800 text-xs font-bold uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full">
              Our Mission
            </span>
            <blockquote className="text-slate-700 text-lg sm:text-xl md:text-2xl font-extrabold italic leading-relaxed">
              &ldquo;Our mission is to ignite a passion for lifelong learning, empower students to think critically, and prepare them for a successful future.&rdquo;
            </blockquote>
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* Initiatives / Latest Activities Section */}
      <div className="pb-12">
        <Initiatives />
      </div>
    </div>
  );
}
