"use client";

import { AnnounceIcon } from "@/public/icons/announce/Announce";
import Link from "next/link";
import OvalLoader from "./loaders/OvalLoader";
import { useQuery } from "@tanstack/react-query";
import { IoFlag } from "react-icons/io5";

const Announcements = () => {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const response = await fetch("/api/announcements/fetch-all", {
        method: "GET",
        cache: "no-store",
      });
      const data = await response.json();
      return data.announcements.reverse();
    },
  });

  return (
    <section
      id="announcements"
      className="scale-95 md:scale-100 border border-gray-100 shadow w-full md:w-2/3 md:mx-auto flex flex-col items-center mt-10 rounded-lg bg-white"
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
          const dayBefore = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          const isLatest = givenDate >= dayBefore && givenDate <= now;
          return (
            <Link
              key={announcement._id}
              href={`/announcement/${announcement._id}`}
              className={`w-full flex flex-col gap-2 ${
                announcement.flagged
                  ? "hover:bg-yellow-200"
                  : "hover:bg-gray-50"
              } border-t border-gray-100 transition p-3 ${
                announcement.flagged ? "bg-yellow-100" : ""
              }`}
            >
              <div className="flex gap-3 items-center">
                <AnnounceIcon />
                <p className="font-semibold text-sm flex items-center gap-1">
                  {announcement.title}{" "}
                  {announcement.flagged && (
                    <IoFlag color="#DB4B2E" className="inline" />
                  )}
                  {isLatest && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded animate-blink">
                      New
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
