import Link from "next/link";

const Navbar = () => {
  return (
    <div className="fixed z-20 mt-4 w-full top-0">
      <ul className="flex bg-gray-50 w-fit mx-auto bg-opacity-80 gap-3 py-2 px-4 rounded-full text-gray-600 shadow-md text-xs md:text-md">
        <li className="hover:scale-110 font-semibold py-1 px-2 transition hover:text-black cursor-pointer">
          <Link href="#home">Home</Link>
        </li>
        <li className="hover:scale-110 font-semibold py-1 px-2 transition hover:text-black cursor-pointer">
          <Link href="#about">About Us</Link>
        </li>
        <li className="hover:scale-110 font-semibold py-1 px-2 transition hover:text-black cursor-pointer">
          <Link href="#announcements">Announcements</Link>
        </li>
        <li className="hover:scale-110 font-semibold py-1 px-2 transition hover:text-black cursor-pointer">
          <Link href="#contact">Contact</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
