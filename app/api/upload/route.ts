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

    const bucketName = "gmhspkt1";
    const storagePath = `${folderName}/${fileNameWithTimestamp}`;

    // Ensure bucket exists or create it
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
    if (!listError && !buckets.some((b: any) => b.id === bucketName)) {
      await supabaseAdmin.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 52428800, // 50MB
      });
    }

    // Upload file to bucket
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(bucketName)
      .upload(storagePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: true,
      });

    if (uploadError) {
      throw new Error("Supabase Storage upload failed: " + uploadError.message);
    }

    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    console.log("File uploaded successfully to Supabase Storage:", publicUrl);

    return NextResponse.json({
      success: true,
      fileName: fileNameWithTimestamp,
      location: publicUrl,
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json({
      success: false,
      error: "Error uploading file: " + error.message,
    });
  }
}
