// @ts-nocheck
import Image2 from "@/public/additional/2.JPG";
import Image4 from "@/public/additional/4.png";
import Image5 from "@/public/additional/5.JPG";
import Image6 from "@/public/additional/6.jpeg";
import Image7 from "@/public/additional/swachh-bharat-swachh-vidyalaya.jpg";

// Single source of truth for the activity types shown on the homepage
// (sections/Initiatives.tsx) and in the navbar dropdown (components/Navbar.tsx).
export const activities = [
  {
    title: "Samagra Shiksha Activities",
    href: "/activities/samagra-shiksha",
    image: Image6,
  },
  {
    title: "PM Poshan Activities",
    href: "/activities/pm-poshan",
    image: Image2,
  },
  {
    title: "Digital India Activities",
    href: "/activities/digital-india",
    image: Image4,
  },
  {
    title: "FIT India Activities",
    href: "/activities/fit-india",
    image: Image5,
  },
  {
    title: "Ek Bharat Shreshtha Bharat",
    href: "/activities/ek-bharat-shreshtha-bharat",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoh7V6feZI-b9-BT_XpOgAr3Xc24Sv5YnoU191w8SfkQ&s",
  },
  {
    title: "Swachha Bharat Swachha Vidyalaya",
    href: "/activities/swachha-bharat-swachha-vidayalaya",
    image: Image7,
  },
];
