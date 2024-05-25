import PrincipalImage from "@/public/principal.jpeg";
import Image from "next/image";

const PrincipalMessage = () => {
  return (
    <section
      id="about"
      className="scale-95 md:scale-100 border w-full md:w-2/3 md:mx-auto border-gray-300 flex flex-col items-center mt-10 rounded-lg"
    >
      <div className="w-32 h-32 rounded-full absolute -translate-y-12 p-2 border-2 bg-white shadow-md">
        <Image src={PrincipalImage} className="rounded-full aspect-square" />
      </div>
      <h1 className="font-semibold text-2xl md:text-3xl mt-24">
        Principal's Message
      </h1>
      <p className="text-xs md:text-sm m-4">
        Our school is a sought after school not only because of its sprawling
        campus and but also because it offers courses in all language i.e
        English, Hindi, Punjabi. It is a building with four walls but has a
        tomorrow inside. Our focus is ‘the child’ i.e we aim at imparting child
        centred education. We keep organising both academic and non-academic
        activities to teach all aspects of the education and develop the child
        physically, mentally, emotionally and socially. We aim at inculcating
        values of honesty, kindness etc as they are going to be the future
        citizens. Our motto is that every child should reach the level of
        excellence, he/she is capable of and the teachers act as their guide in
        this pursuit. In partnership with family and community, we engage
        students, to become informed, compassionate global citizens. Our aim is
        to make them learn to do their best, work for others and be safe and
        kind. We have an SMC (school management committee), Sexual Harassment
        Committee and Student Grievance Redressal Forum for better functioning
        of the school. We believe in “Think of no future however bright Let the
        dead past bury its dead. Act Act Act in the living present. Heart within
        and God overhead.“
      </p>
      <span className="text-md px-4 mb-4">Regards ✨ </span>
    </section>
  );
};

export default PrincipalMessage;
