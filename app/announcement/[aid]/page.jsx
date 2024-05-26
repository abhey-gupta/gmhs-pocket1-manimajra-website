import { fetchAnnouncement } from "@/utils/announcements";

const AffiliationStatus = async ({ params }) => {
  const announcement = await fetchAnnouncement(params.aid);

  return (
    <section
      id="about"
      className="scale-95 md:scale-100 border w-full md:w-2/3 md:mx-auto border-gray-300 flex flex-col items-center mt-20 rounded-lg px-5"
    >
      <h1 className="font-semibold text-2xl md:text-3xl my-4">
        Announcement : {announcement?.title}
      </h1>
      <p className="w-full mb-10">{announcement?.description}</p>
      <a
        download
        href={announcement?.file}
        className="mb-5 w-full text-blue-500 underline"
      >
        Download the attached file here
      </a>
      <object
        id="fgh"
        data={announcement?.file}
        width="100%"
        height="800"
      ></object>
    </section>
  );
};

export default AffiliationStatus;
