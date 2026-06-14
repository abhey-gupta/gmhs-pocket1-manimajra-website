import { supabase } from "@/lib/supabase";

export interface Announcement {
  id: string;
  title: string;
  description?: string;
  file?: string;
  flagged: boolean;
  created_at: string;
  updated_at: string;
}

export const fetchAnnouncement = async (
  aid: string
): Promise<Announcement | null> => {
  try {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("id", aid)
      .single();

    if (error) {
      console.error("Error fetching announcement from Supabase:", error);
      return null;
    }

    return data as Announcement;
  } catch (err) {
    console.error("Unexpected error fetching announcement:", err);
    return null;
  }
};
