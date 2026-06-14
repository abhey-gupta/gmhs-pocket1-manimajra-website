import { Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryClientProvider } from "@/components/react-query-client-provider";
const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata = {
  title: "GMHS Pocket No. 1 Manimajra - U.T. CHANDIGARH",
  description: "GMHS Pocket No. 1 Manimajra - U.T. CHANDIGARH",
};

export default function RootLayout({ children }) {
  return (
    <ReactQueryClientProvider>
      <html lang="en" className="!scroll-smooth">
        <body className={`${quicksand.className} flex flex-col min-h-screen`}>
          <NextTopLoader showSpinner={false} color="#d97706" />
          <Navbar />
          <main className="flex-grow bg-gradient-to-b from-slate-50 via-slate-100/50 to-slate-50/30">
            {children}
          </main>
          <Footer />
          <Toaster />
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
