import Image from "next/image";
import Image1 from "@/public/additional/1.JPG";
import Image2 from "@/public/additional/2.JPG";
// import Image3 from "@/public/additional/3.JPG";
import Image4 from "@/public/additional/4.png";
import Image5 from "@/public/additional/5.JPG";
import Image6 from "@/public/additional/6.jpeg";
import Link from "next/link";

const Initiatives = () => {
  const Card = ({ image, title, href }) => {
    return (
      <Link
        className="flex items-center justify-center flex-col border rounded-lg transition p-2"
        href={href}
        target="_blank"
      >
        <Image
          src={image}
          alt="img"
          className="object-contain aspect-square"
          width={200}
          height={200}
        />
        <label className="font-semibold py-2">{title}</label>
      </Link>
    );
  };
  return (
    <section
      id="about"
      className="scale-95 md:scale-100 border w-full md:w-2/3 md:mx-auto border-gray-300 flex flex-col items-center rounded-lg p-4"
    >
      <h1 className="font-semibold text-2xl md:text-3xl my-3">
        Latest Activities
      </h1>

      <div className="grid grid-cols-2 gap-5 ">
        <Card
          image={Image6}
          title={"Samagra Shiksha Activities"}
          href={"https://samagra.education.gov.in"}
        />
        {/* <Card
          image={Image1}
          title={"India Gov"}
          href={"https://www.education.gov.in/"}
        /> */}
        <Card
          image={Image2}
          title={"PM Poshan Activities"}
          href={"https://pmposhan.education.gov.in/"}
        />
        <Card
          image={Image4}
          title={"Digital India Activities"}
          href={
            "https://www.meity.gov.in/sites/upload_files/dit/files/Digital%2520India.pdf"
          }
        />
        <Card
          image={Image5}
          title={"FIT India Activities"}
          href={"https://fitindiahe.education.gov.in/home"}
        />
      </div>
    </section>
  );
};

export default Initiatives;
