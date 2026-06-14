import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { oldPath, newCategory, newYear, newTitle } = await req.json();

    if (!oldPath || !newCategory || !newYear || !newTitle) {
      return NextResponse.json(
        { success: false, error: "Missing required parameters: oldPath, newCategory, newYear, newTitle" },
        { status: 400 }
      );
    }

    // Security check: old path
    const oldNormalized = path.normalize(oldPath).replace(/^(\.\.(\/|\\))+/, "");
    if (!oldNormalized.startsWith("gmhspkt1/activities")) {
      return NextResponse.json({ success: false, error: "Invalid source path" }, { status: 400 });
    }

    // Security check: new components
    if (newCategory.includes("..") || newYear.includes("..") || newTitle.includes("..")) {
      return NextResponse.json({ success: false, error: "Invalid characters in new names" }, { status: 400 });
    }

    const baseDir = path.join(process.cwd(), "public");
    const oldFullPath = path.join(baseDir, oldNormalized);

    // Verify old folder exists
    try {
      const stat = await fs.stat(oldFullPath);
      if (!stat.isDirectory()) {
        return NextResponse.json({ success: false, error: "Source is not a directory" }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ success: false, error: "Source folder does not exist" }, { status: 400 });
    }

    // Clean up inputs to prevent illegal filename characters
    const cleanTitle = newTitle.replace(/[\\/:*?"<>|]/g, "_").trim();

    const newRelativePath = `gmhspkt1/activities/${newCategory}/${newYear}/${cleanTitle}`;
    const newFullPath = path.join(baseDir, newRelativePath);

    if (oldFullPath === newFullPath) {
      return NextResponse.json({ success: true, message: "Paths are identical, no change made." });
    }

    // Ensure parent folders for new location exist
    const newParentDir = path.dirname(newFullPath);
    await fs.mkdir(newParentDir, { recursive: true });

    // Check if destination directory already exists
    try {
      await fs.access(newFullPath);
      return NextResponse.json(
        { success: false, error: "An activity with that name already exists in the selected session." },
        { status: 400 }
      );
    } catch {
      // Doesn't exist, which is what we want
    }

    // Rename (move) folder
    await fs.rename(oldFullPath, newFullPath);

    return NextResponse.json({
      success: true,
      message: "Activity moved and renamed successfully",
      newPath: newRelativePath,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
