import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const files = data.getAll("file") as File[];
    const folder = data.get("folder") as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files provided" });
    }

    const uploadedFiles: Array<{ fileName: string; location: string }> = [];
    const locations: string[] = [];

    // Base target folder inside public/
    const relativeFolder = folder || "uploads";
    const targetDir = path.join(process.cwd(), "public", relativeFolder);

    // Ensure target folder exists
    await fs.mkdir(targetDir, { recursive: true });

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate a timestamp for the file name
      const currentDate = new Date();
      const timestamp = currentDate.toISOString().replace(/[:.]/g, "");
      const fileNameWithTimestamp = `${timestamp}_${file.name}`;

      // Write file to local disk
      const targetFilePath = path.join(targetDir, fileNameWithTimestamp);
      await fs.writeFile(targetFilePath, buffer);

      // Web path relative to public root
      const location = `/${relativeFolder}/${fileNameWithTimestamp}`;

      uploadedFiles.push({
        fileName: fileNameWithTimestamp,
        location,
      });
      locations.push(location);
    }

    return NextResponse.json({ success: true, uploadedFiles, locations });
  } catch (error: any) {
    console.error("Error uploading files:", error);
    return NextResponse.json({
      success: false,
      error: "Error uploading files: " + error.message,
    });
  }
}
