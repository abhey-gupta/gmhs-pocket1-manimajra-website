import Image from "next/image";
import SchoolImage from "@/public/school.png";
import Logo1 from "@/public/logo/logo1.jpg";
import Logo2 from "@/public/logo/logo2.jpg";
import SectionDivider from "@/components/SectionDivider";
import { AnnounceIcon } from "@/public/icons/announce/Announce";
import Footer from "@/components/Footer";
import PrincipalMessage from "@/sections/PrincipalMessage";
import Initiatives from "@/sections/Initiatives";

const announcements = [
  {
    _id: 1,
    title: "Admissions Open for 2024 students. Enroll Now and get benefits",
    time: "3h ago",
    flagged: true,
  },
  {
    _id: 2,
    title: "Results Announced",
    time: "6h ago",
    flagged: false,
  },
  {
    _id: 3,
    title: "Admissions Open",
    time: "9h ago",
    flagged: false,
  },
];

export default function Home() {
  return (
    <div>
      <section id="home" className="w-screen h-[55vh] md:h-[75vh]">
        <div className="absolute top-0 w-full h-[55vh] md:h-[75vh] bg-black z-10 bg-opacity-50 flex flex-col justify-center items-center md:items-start gap-5 px-2 md:px-8">
          <h1 className="font-extrabold text-2xl md:text-5xl text-yellow-400">
            Welcome To
          </h1>
          <h2 className="font-semibold text-3xl md:text-7xl text-white text-center md:text-left">
            Govt. Model High School
          </h2>
          <h3 className="font-semibold text-2xl md:text-5xl text-white text-center md:text-left">
            Pocket No. 1, Manimajra, U.T. Chandigarh
          </h3>
          <div className="flex mt-5 gap-8">
            <Image
              src={Logo1}
              alt="Logo"
              className="object-contain rounded-full h-20 md:h-24 w-fit"
            />
            {/* <Image
              src={Logo3}
              alt="Logo"
              className="aspect-[3/2] object-contain border border-red-500 w-fit"
            /> */}
            <Image
              src={Logo2}
              alt="Logo"
              className="h-20 md:h-24 object-contain rounded-full w-fit"
            />
          </div>
        </div>
        <Image src={SchoolImage} className="w-full h-full bg-cover" />
      </section>

      <SectionDivider />

      <section
        id="announcements"
        className="scale-95 md:scale-100 border w-full md:w-2/3 md:mx-auto border-gray-300 flex flex-col items-center mt-10 rounded-lg"
      >
        <h1 className="font-semibold text-2xl md:text-3xl my-3">
          Announcements
        </h1>
        {announcements.map((announcement) => (
          <div
            key={announcement._id}
            className={`w-full flex justify-between items-center p-3 ${
              announcement.flagged ? "bg-yellow-100" : "bg-white"
            }`}
          >
            <div className="flex gap-3 items-center w-[90%]">
              <AnnounceIcon />
              <p className="font-semibold text-sm">{announcement.title}</p>
            </div>
            <p className="text-xs text-gray-500">{announcement.time}</p>
          </div>
        ))}
      </section>

      <SectionDivider />

      <PrincipalMessage />

      <SectionDivider />

      <Initiatives />

      <Footer />
    </div>
  );
}
