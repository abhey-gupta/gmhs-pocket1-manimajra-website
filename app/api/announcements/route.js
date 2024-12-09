import Announcement from "@/models/Announcement";
import connectDB from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function GET() {
  try {
    const aid = headers().get("aid");

    await connectDB();

    const announcement = await Announcement.findById(aid);

    return NextResponse.json({
      success: true,
      message: "Announcement fetched successfully",
      announcement,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while fetching the announcement : " + error,
    });
  }
}
export async function POST(req) {
  const { title, flagged, file, description } = await req.json();
  console.log(title, flagged, file, description);
  try {
    await connectDB();

    const newAnnouncement = await Announcement.create({
      title,
      flagged,
      description,
      file,
    });

    return NextResponse.json({
      success: true,
      message: "Announcement created successfully",
      announcement: newAnnouncement,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "An error occurred while creating the announcement : " + error,
    });
  }
}
