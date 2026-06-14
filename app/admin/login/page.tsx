// @ts-nocheck
"use client";

import Cookies from "js-cookie";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Logo1 from "@/public/logo/logo1.jpg";
import { Mail, Lock, LogIn, ArrowLeft } from "lucide-react";

import { toast } from "sonner";

const AdminLogin = () => {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success("Welcome back! Redirecting to dashboard...");
        router.push("/admin");
        router.refresh();
      } else {
        toast.error(data.error || "Authentication failed. Please check credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An error occurred during authentication.");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950">
      
      {/* Decorative background glow elements */}
      <div className="absolute w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl -top-12 -left-12"></div>
      <div className="absolute w-80 h-80 rounded-full bg-amber-500/5 blur-3xl -bottom-12 -right-12"></div>

      {/* Floating Home Link */}
      <div className="absolute top-8 left-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to School Site</span>
        </Link>
      </div>

      <div className="w-full max-w-md">
        <div className="glass-panel-dark bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-lg">
          <div className="flex flex-col items-center gap-4 text-center mb-8">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-700/60 p-0.5 bg-slate-800">
              <Image
                src={Logo1}
                alt="School Logo"
                className="object-contain rounded-full h-full w-full"
              />
            </div>
            <div className="space-y-1">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Administrative Hub
              </h1>
              <p className="text-slate-400 text-xs font-medium">
                Sign in to manage school bulletins & activities
              </p>
            </div>
          </div>

          <form className="space-y-5" onSubmit={onSubmit}>
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-400 uppercase tracking-wider"
              >
                School Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-slate-950/80 border border-slate-800/80 text-white placeholder-slate-600 sm:text-sm rounded-xl focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 pr-3 py-2.5 transition-colors focus:outline-none focus:ring-1"
                  placeholder="admin@school.com"
                  required
                  onChange={(e) => {
                    setCredentials({ ...credentials, email: e.target.value });
                  }}
                  value={credentials.email}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="password"
                className="block text-xs font-bold text-slate-400 uppercase tracking-wider"
              >
                Access Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-slate-950/80 border border-slate-800/80 text-white placeholder-slate-600 sm:text-sm rounded-xl focus:ring-amber-500 focus:border-amber-500 block w-full pl-10 pr-3 py-2.5 transition-colors focus:outline-none focus:ring-1"
                  required
                  onChange={(e) => {
                    setCredentials({
                      ...credentials,
                      password: e.target.value,
                    });
                  }}
                  value={credentials.password}
                />
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold rounded-xl text-sm py-3 transition duration-200 shadow-lg shadow-amber-600/10 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Enter Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AdminLogin;
