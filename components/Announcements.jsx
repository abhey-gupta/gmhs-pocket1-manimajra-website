"use client";

import { AnnounceIcon } from "@/public/icons/announce/Announce";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import OvalLoader from "./loaders/OvalLoader";

// const announcements = [
//   {
//     _id: 1,
//     title: "Admissions Open for 2024 students. Enroll Now and get benefits",
//     time: "3h ago",
//     flagged: true,
//   },
//   {
//     _id: 2,
//     title: "Results Announced",
//     time: "6h ago",
//     flagged: false,
//   },
//   {
//     _id: 3,
//     title: "Admissions Open",
//     time: "9h ago",
//     flagged: false,
//   },
// ];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    const { data } = await axios.get("/api/announcements/fetch-all");
    if (data.success) {
      setAnnouncements(data.announcements);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <section
      id="announcements"
      className="scale-95 md:scale-100 border w-full md:w-2/3 md:mx-auto border-gray-300 flex flex-col items-center mt-10 rounded-lg"
    >
      <h1 className="font-semibold text-2xl md:text-3xl my-3">Announcements</h1>
      {isLoading && (
        <div className="pb-4">
          <OvalLoader />
        </div>
      )}
      {!isLoading &&
        announcements.map((announcement) => {
          const givenDate = new Date(announcement.createdAt);
          const now = new Date();
          const sixHoursBefore = new Date(now.getTime() - 6 * 60 * 60 * 1000);
          const isLatest = givenDate >= sixHoursBefore && givenDate <= now;
          return (
            <Link
              key={announcement._id}
              href={`/announcements/${announcement._id}`}
              className={`w-full flex flex-col gap-2 p-3 ${
                announcement.flagged ? "bg-yellow-100" : "bg-white"
              }`}
            >
              <div className="flex gap-3 items-center">
                <AnnounceIcon />
                <p className="font-semibold text-sm flex items-center gap-1">
                  {announcement.title}{" "}
                  {isLatest && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                      Latest
                    </span>
                  )}
                </p>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(announcement.createdAt).toDateString()}
              </p>
            </Link>
          );
        })}
    </section>
  );
};

export default Announcements;
