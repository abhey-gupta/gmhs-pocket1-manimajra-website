import Announcement from "@/models/Announcement";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const announcements = await Announcement.find();

    return NextResponse.json({
      success: true,
      message: "Announcement fetched successfully",
      announcements,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the announcements : " + error,
    });
  }
}
