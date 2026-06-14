import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const aid = headers().get("aid");
    if (!aid) {
      return NextResponse.json({
        success: false,
        error: "Missing aid header",
      });
    }

    const { data: announcement, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("id", aid)
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Announcement fetched successfully",
      announcement,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the announcement: " + error.message,
    });
  }
}

export async function POST(req: Request) {
  try {
    const { title, flagged, file, description } = await req.json();

    const { data: newAnnouncement, error } = await supabase
      .from("announcements")
      .insert([{ title, flagged: !!flagged, file, description }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Announcement created successfully",
      announcement: newAnnouncement,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while creating the announcement: " + error.message,
    });
  }
}
