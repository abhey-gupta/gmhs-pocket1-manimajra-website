import { fetchAnnouncement } from "@/utils/announcements";
import { IoFlag } from "react-icons/io5";

const AffiliationStatus = async ({ params }) => {
  const announcement = await fetchAnnouncement(params.aid);

  console.log(announcement);

  return (
    <section
      id="about"
      className="scale-95 md:scale-100 border w-full md:w-2/3 md:mx-auto border-gray-300 flex flex-col items-center mt-24 rounded-lg px-5"
    >
      <h1 className="font-semibold text-2xl md:text-3xl my-4">
        <IoFlag className="inline mr-2" color="#DB4B2E" />
        Announcement : {announcement?.title}{" "}
      </h1>
      <p className="w-full mb-10">{announcement?.description}</p>
      <a
        download
        href={announcement?.file}
        className="mb-5 w-full text-blue-500 underline"
      >
        Download the attached file here
      </a>
      {/* <object
        id="fgh"
        data={announcement?.file}
        width="100%"
        height="800"
      ></object> */}
      {/* <iframe width="100%" height="800" src={announcement?.file}>
        hello
      </iframe> */}
    </section>
  );
};

export default AffiliationStatus;
