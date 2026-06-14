import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const { isAuthenticated } = await import("@/lib/auth");
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: false,
        error: "SUPABASE_SERVICE_ROLE_KEY is missing in server environment variables. Please add it to your environment to enable uploads."
      }, { status: 500 });
    }

    const data = await request.formData();
    const files = data.getAll("file") as File[];
    const folder = data.get("folder") as string | null;

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: "No files provided" });
    }

    const uploadedFiles: Array<{ fileName: string; location: string }> = [];
    const locations: string[] = [];

    const relativeFolder = folder || "uploads";
    const bucketName = "gmhspkt1";

    // Ensure bucket exists or create it
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (!listError && !buckets.some((b: any) => b.id === bucketName)) {
      await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
      });
    }

    // Clean folder prefix (remove gmhspkt1/ if it's there to map to bucket root)
    const cleanedFolder = relativeFolder.startsWith("gmhspkt1/") 
      ? relativeFolder.substring("gmhspkt1/".length) 
      : relativeFolder;

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const currentDate = new Date();
      const timestamp = currentDate.toISOString().replace(/[:.]/g, "");
      const fileNameWithTimestamp = `${timestamp}_${file.name}`;

      const storagePath = `${cleanedFolder}/${fileNameWithTimestamp}`;

      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from(bucketName)
        .upload(storagePath, buffer, {
          contentType: file.type || "application/octet-stream",
          upsert: true,
        });

      if (uploadError) {
        throw new Error("Supabase Storage upload failed for file " + file.name + ": " + uploadError.message);
      }

      const { data: { publicUrl } } = supabaseAdmin.storage
        .from(bucketName)
        .getPublicUrl(storagePath);

      uploadedFiles.push({
        fileName: fileNameWithTimestamp,
        location: publicUrl,
      });
      locations.push(publicUrl);
    }
    console.log(`Multiple files (${files.length}) uploaded successfully to Supabase Storage.`);

    return NextResponse.json({ success: true, uploadedFiles, locations });
  } catch (error: any) {
    console.error("Error uploading files:", error);
    return NextResponse.json({
      success: false,
      error: "Error uploading files: " + error.message,
    });
  }
}
