import Image from "next/image";
import SchoolImage from "@/public/school.png";
import PrincipalImage from "@/public/principal.jpg";
import Logo1 from "@/public/logo/logo1.jpg";
import Logo2 from "@/public/logo/logo2.jpg";
import SectionDivider from "@/components/SectionDivider";
import { AnnounceIcon } from "@/public/icons/announce/Announce";
import Footer from "@/components/Footer";
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
      <section id="home" className="w-screen h-[60vh] md:h-[75vh]">
        <div className="absolute top-0 w-full h-[60vh] md:h-[75vh] bg-black z-10 bg-opacity-50 flex flex-col justify-center items-center md:items-start gap-5 px-2 md:px-8">
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

      <section
        id="about"
        className="scale-95 md:scale-100 border w-full md:w-2/3 md:mx-auto border-gray-300 flex flex-col items-center mt-10 rounded-lg"
      >
        <div className="w-32 h-32 rounded-full absolute -translate-y-12 p-2 border-2 bg-white shadow-md">
          <Image
            src={PrincipalImage}
            className="rounded-full aspect-square object-contain"
          />
        </div>
        <h1 className="font-semibold text-2xl md:text-3xl mt-24">
          Principal's Message
        </h1>
        <p className="text-xs md:text-sm m-4">
          Our school is a sought after school not only because of its sprawling
          campus and but also because it offers courses in all language i.e
          English, Hindi, Punjabi. It is a building with four walls but has a
          tomorrow inside. Our focus is ‘the child’ i.e we aim at imparting
          child centred education. We keep organising both academic and
          non-academic activities to teach all aspects of the education and
          develop the child physically, mentally, emotionally and socially. We
          aim at inculcating values of honesty, kindness etc as they are going
          to be the future citizens. Our motto is that every child should reach
          the level of excellence, he/she is capable of and the teachers act as
          their guide in this pursuit. In partnership with family and community,
          we engage students, to become informed, compassionate global citizens.
          Our aim is to make them learn to do their best, work for others and be
          safe and kind. We have an SMC (school management committee), Sexual
          Harassment Committee and Student Grievance Redressal Forum for better
          functioning of the school. We believe in “Think of no future however
          bright Let the dead past bury its dead. Act Act Act in the living
          present. Heart within and God overhead.“
        </p>
        <span className="text-md px-4 mb-4">Regards ✨ </span>
      </section>

      <SectionDivider />

      <Initiatives />
    </div>
  );
}
