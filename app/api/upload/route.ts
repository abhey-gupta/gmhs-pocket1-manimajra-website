import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const { isAuthenticated } = await import("@/lib/auth");
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const data = await request.formData();
    const file = data.get("file") as File | null;
    const folderName = data.get("folderName") as string | null;

    if (!file || !folderName) {
      return NextResponse.json({
        success: false,
        error: "No file or folder name provided",
      });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate a timestamp for the file name
    const currentDate = new Date();
    const timestamp = currentDate.toISOString().replace(/[:.]/g, "");
    const fileNameWithTimestamp = `${timestamp}_${file.name}`;

    // Target directory: public/gmhspkt1/{folderName}
    const relativeDir = path.join("gmhspkt1", folderName);
    const targetDir = path.join(process.cwd(), "public", relativeDir);

    // Ensure target directory exists
    await fs.mkdir(targetDir, { recursive: true });

    // Write file to local disk
    const targetFilePath = path.join(targetDir, fileNameWithTimestamp);
    await fs.writeFile(targetFilePath, buffer);

    // Relative web URL to access the file statically
    const location = `/${relativeDir}/${fileNameWithTimestamp}`;

    console.log("File uploaded successfully locally:", location);

    return NextResponse.json({
      success: true,
      fileName: fileNameWithTimestamp,
      location,
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json({
      success: false,
      error: "Error uploading file: " + error.message,
    });
  }
}
