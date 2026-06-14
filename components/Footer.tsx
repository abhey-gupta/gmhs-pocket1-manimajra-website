// @ts-nocheck
"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink, Youtube, Award } from "lucide-react";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer id="contact" className="bg-slate-950 text-slate-400 border-t border-slate-900 mt-12">
      <div className="mx-auto w-full max-w-7xl p-6 py-10 lg:py-16">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 lg:gap-16 pb-10 border-b border-slate-900">
          
          {/* Col 1: Identity & Socials */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="space-y-2">
              <h2 className="text-white font-extrabold tracking-tight text-lg flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <span>GMHS Pocket 1</span>
              </h2>
              <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-sm">
                Government Model High School, Pocket No. 1, Manimajra, U.T. Chandigarh. Nurturing minds and shaping values in the living present.
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="#"
                className="p-2 rounded-xl bg-slate-900 hover:bg-indigo-900 hover:text-white transition-colors border border-slate-800"
                aria-label="Facebook page"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z" />
                </svg>
              </a>
              <a
                href="#"
                className="p-2 rounded-xl bg-slate-900 hover:bg-indigo-900 hover:text-white transition-colors border border-slate-800"
                aria-label="Twitter page"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Useful Links */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h3 className="text-white font-extrabold uppercase tracking-widest text-xs">
              Useful Portals
            </h3>
            <ul className="space-y-2.5 text-xs md:text-sm font-medium">
              {[
                { name: "Employee Sevaarth", url: "http://admser.chd.nic.in/sevaempb/app/Login/" },
                { name: "Samagra Shiksha Chd", url: "https://ssachd.nic.in/" },
                { name: "UDISE+ Student Portal", url: "https://sdms.udiseplus.gov.in/" },
                { name: "Phoenix Education", url: "http://phoenix.chdeducation.gov.in/Login.aspx" },
                { name: "CBSE Official Site", url: "https://www.cbse.gov.in/" },
                { name: "E - HRMS Link", url: "https://ehrms.nic.in/Home/Index/CH" },
                { name: "NCERT Books", url: "https://ncert.nic.in/textbooks.php" },
                { name: "National Scholarships", url: "http://scholarships.gov.in/" },
              ].map((link, idx) => (
                <li key={idx}>
                  <a
                    href={link.url}
                    target="_blank"
                    className="inline-flex items-center gap-1 hover:text-white transition-colors duration-150 group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-600 group-hover:text-slate-400 shrink-0" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Get In Touch */}
          <div className="md:col-span-2 space-y-4 text-left">
            <h3 className="text-white font-extrabold uppercase tracking-widest text-xs">
              Contact Us
            </h3>
            <ul className="space-y-3.5 text-xs md:text-sm font-medium">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Govt. Model High School, Pocket No. 1, Manimajra, Chandigarh</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="tel:01722737701" className="hover:text-white transition-colors">
                  0172-2737701
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <a href="mailto:gmhspocket1@gmail.com" className="hover:text-white transition-colors truncate">
                  gmhspocket1@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Video Highlight */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h3 className="text-white font-extrabold uppercase tracking-widest text-xs flex items-center gap-1.5">
              <Youtube className="w-4.5 h-4.5 text-red-500" />
              <span>Campus Feature</span>
            </h3>
            <div className="rounded-2xl overflow-hidden border border-slate-900 aspect-video shadow-lg w-full max-w-[280px]">
              <iframe
                className="w-full h-full border-0"
                src="https://www.youtube.com/embed/ieyKJmrUg9s"
                title="School Video"
              ></iframe>
            </div>
          </div>

        </div>

        {/* Government Initiative Banners */}
        <div className="py-8 border-b border-slate-900 text-left">
          <h3 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">Affiliated Initiatives</h3>
          <div className="flex flex-wrap gap-4 items-center justify-start opacity-75 hover:opacity-100 transition-opacity">
            {[
              { href: "https://ekbharat.gov.in/", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoh7V6feZI-b9-BT_XpOgAr3Xc24Sv5YnoU191w8SfkQ&s", alt: "Ek Bharat Shrestha Bharat" },
              { href: "https://dsel.education.gov.in/sbsv/", src: "https://csrbox.org/company/proj_img/1520588326swachh-bharat-swachh-vidyalaya%20(1).jpg", alt: "Swachh Bharat Swachh Vidyalaya" },
              { href: "https://csc.gov.in/digitalIndia", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdz-p_lRFfaWjECaxe0swZAH_zeTGnwAbrJFBFdtE8dw&s", alt: "Digital India" },
              { href: "https://fitindia.gov.in", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTF52BXkR30vAoN43KEjeExRMLIFSAtnYQWEBSIx8n8jw&s", alt: "Fit India" },
              { href: "https://www.india.gov.in/", src: "https://msme.gov.in/sites/default/files/india-gov.png", alt: "Govt of India" },
              { href: "https://samagra.education.gov.in", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT99jhj5PlU9iz_vNWZx31wRFt8g46n6qjZizCJGq7Mog&s", alt: "Samagra Shiksha" },
              { href: "https://pmposhan.education.gov.in", src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThy-A1WTjORAluqghdWscWwOLrJdupiz7Xhz5wfU3J0A&s", alt: "PM Poshan" },
            ].map((img, idx) => (
              <a
                key={idx}
                href={img.href}
                target="_blank"
                className="bg-white p-1 rounded-xl hover:scale-105 transition-transform shrink-0"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="h-10 md:h-12 object-contain rounded-lg"
                />
              </a>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-xs font-semibold text-slate-500 text-left">
          <div>
            © {new Date().getFullYear()} GMHS Pocket 1 Manimajra, U.T. Chandigarh. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-2 text-slate-500">
            <span>For technical enquiries:</span>
            <Link href="/admin" className="text-slate-400 hover:text-white">Ramesh Kumar</Link>
            <span>at</span>
            <a href="tel:9915007909" className="text-slate-400 hover:text-white underline">+91 9915007909</a>
            <span>or email</span>
            <a href="mailto:rameshgupta001@gmail.com" className="text-slate-400 hover:text-white underline">rameshgupta001@gmail.com</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
