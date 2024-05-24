import { Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const quicksand = Quicksand({ subsets: ["latin"] });

export const metadata = {
  title: "GMHS Pocket No. 1 Manimajra - U.T. CHANDIGARH",
  description: "GMHS Pocket No. 1 Manimajra - U.T. CHANDIGARH",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={quicksand.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
