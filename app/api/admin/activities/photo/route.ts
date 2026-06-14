import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

export async function DELETE(req: Request) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const photoPath = searchParams.get("photoPath"); // relative web url, e.g. /gmhspkt1/activities/cat/yr/title/name.jpg
    if (!photoPath) {
      return NextResponse.json({ success: false, error: "Missing photo path" }, { status: 400 });
    }

    // Clean leading slash if any
    const relativePath = photoPath.startsWith("/") ? photoPath.substring(1) : photoPath;

    // Security check: ensure path starts with gmhspkt1/activities
    const normalized = path.normalize(relativePath).replace(/^(\.\.(\/|\\))+/, "");
    if (!normalized.startsWith("gmhspkt1/activities")) {
      return NextResponse.json({ success: false, error: "Invalid path segment" }, { status: 400 });
    }

    const fullPath = path.join(process.cwd(), "public", normalized);

    // Delete photo file
    await fs.unlink(fullPath);

    return NextResponse.json({ success: true, message: "Photo deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
