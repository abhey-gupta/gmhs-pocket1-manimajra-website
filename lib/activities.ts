// @ts-nocheck
import Image2 from "@/public/additional/2.JPG";
import Image4 from "@/public/additional/4.png";
import Image5 from "@/public/additional/5.JPG";
import Image6 from "@/public/additional/6.jpeg";
import Image7 from "@/public/additional/swachh-bharat-swachh-vidyalaya.jpg";
import { ACTIVITY_CATEGORIES } from "./activity-categories";

// Cover art per category. Slugs and titles come from activity-categories.ts so
// the navbar, homepage, storage prefixes and admin dropdowns cannot drift apart.
const CATEGORY_IMAGES = {
  "samagra-shiksha": Image6,
  "pm-poshan": Image2,
  "digital-india": Image4,
  "fit-india": Image5,
  "ek-bharat-shreshtha-bharat":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoh7V6feZI-b9-BT_XpOgAr3Xc24Sv5YnoU191w8SfkQ&s",
  "swachha-bharat-swachha-vidayalaya": Image7,
};

// Single source of truth for the activity types shown on the homepage
// (sections/Initiatives.tsx) and in the navbar dropdown (components/Navbar.tsx).
export const activities = ACTIVITY_CATEGORIES.map((category) => ({
  title: category.navTitle,
  href: `/activities/${category.slug}`,
  image: CATEGORY_IMAGES[category.slug],
}));
