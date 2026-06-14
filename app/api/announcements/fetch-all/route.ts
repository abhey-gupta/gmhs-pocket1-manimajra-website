import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: announcements, error } = await supabase
      .from("announcements")
      .select("*");

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Announcements fetched successfully",
      announcements,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error:
        "An error occurred while fetching the announcements: " + error.message,
    });
  }
}
