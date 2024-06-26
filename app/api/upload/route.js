import { NextResponse } from "next/server";
import AWS from "aws-sdk";

export async function POST(request) {
  const data = await request.formData();
  const file = data.get("file");
  const folderName = data.get("folderName");

  if (!file) {
    return NextResponse.json({ success: false, error: "No file provided" });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const bucketName = "misc-bucket0";

  try {
    const s3 = new AWS.S3();

    // Generate a timestamp for the file name
    const currentDate = new Date();
    const timestamp = currentDate.toISOString().replace(/[:.]/g, "");

    const fileNameWithTimestamp = `${timestamp}_${file.name}`;
    const Key = `gmhspkt1/${folderName}/${fileNameWithTimestamp}`;

    const params = {
      Bucket: bucketName,
      Key,
      Body: buffer,
    };

    // Using promises instead of callbacks for the S3 upload
    const data = await s3.upload(params).promise();

    console.log("File uploaded successfully", data.Location);

    return NextResponse.json({
      success: true,
      fileName: fileNameWithTimestamp,
      location: data.Location,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return NextResponse.json({ success: false, error: "Error uploading file" });
  }
}
