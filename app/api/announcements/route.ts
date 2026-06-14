import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { supabase, supabaseAdmin } from "@/lib/supabase";

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
    const { isAuthenticated } = await import("@/lib/auth");
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { title, flagged, file, description } = await req.json();

    const { data: newAnnouncement, error } = await supabaseAdmin
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

export async function PUT(req: Request) {
  try {
    const { isAuthenticated } = await import("@/lib/auth");
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { id, title, flagged, file, description } = await req.json();
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing announcement ID" }, { status: 400 });
    }

    const { data: updatedAnnouncement, error } = await supabaseAdmin
      .from("announcements")
      .update({
        title,
        flagged: !!flagged,
        file,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: "Announcement updated successfully",
      announcement: updatedAnnouncement,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while updating the announcement: " + error.message,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { isAuthenticated } = await import("@/lib/auth");
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing announcement ID" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("announcements")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Announcement not found or permission denied. Please verify that SUPABASE_SERVICE_ROLE_KEY is configured in your environment.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while deleting the announcement: " + error.message,
    });
  }
}

