import { Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata = {
  title: "GMHS Pocket No. 1 Manimajra - U.T. CHANDIGARH",
  description: "GMHS Pocket No. 1 Manimajra - U.T. CHANDIGARH",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={quicksand.className}>
        <NextTopLoader showSpinner={false} color="red" />
        <Navbar />
        {children}
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
