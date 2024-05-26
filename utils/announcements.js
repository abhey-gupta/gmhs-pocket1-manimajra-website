import axios from "axios";

export const fetchAnnouncement = async (aid) => {
  const { data } = await axios.get(
    "https://gmhs-pocket1-manimajra.vercel.app/api/announcements",
    {
      headers: {
        aid,
      },
    }
  );
  if (data.success) {
    return data.announcement;
  }
};
