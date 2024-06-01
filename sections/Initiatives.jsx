import Image from "next/image";
import Image1 from "@/public/additional/1.JPG";
import Image2 from "@/public/additional/2.JPG";
// import Image3 from "@/public/additional/3.JPG";
import Image4 from "@/public/additional/4.png";
import Image5 from "@/public/additional/5.JPG";
import Image6 from "@/public/additional/6.jpeg";
import Image7 from "@/public/additional/swachh-bharat-swachh-vidyalaya.jpg";
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
          className="object-contain aspect-square w-[200px] h-[200px]"
          width={200}
          height={200}
        />
        <label className="font-semibold py-2 text-center w-full">{title}</label>
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
          href={"/activities/samagra-shiksha"}
        />
        <Card
          image={Image2}
          title={"PM Poshan Activities"}
          href={"/activities/pm-poshan"}
        />
        <Card
          image={Image4}
          title={"Digital India Activities"}
          href={"/activities/digital-india"}
        />
        <Card
          image={Image5}
          title={"FIT India Activities"}
          href={"/activities/fit-india"}
        />
        <Card
          image={
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoh7V6feZI-b9-BT_XpOgAr3Xc24Sv5YnoU191w8SfkQ&s"
          }
          title={"Ek Bharat Shreshtha Bharat Activities"}
          href={"/activities/ek-bharat-shreshtha-bharat"}
        />
        <Card
          image={Image7}
          title={"Swachha Bharat Swachha Vidayalaya Activities"}
          href={"/activities/swachha-bharat-swachha-vidayalaya"}
        />
      </div>
    </section>
  );
};

export default Initiatives;
