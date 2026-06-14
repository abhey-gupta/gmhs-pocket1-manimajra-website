import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

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
    }, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      }
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error:
        "An error occurred while fetching the announcements: " + error.message,
    });
  }
}
