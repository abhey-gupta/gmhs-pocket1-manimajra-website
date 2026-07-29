import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { ActivityStorageError, deleteActivityPhoto } from "@/lib/activities-storage";

export async function DELETE(req: Request) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    // Bucket-relative storage key, e.g. activities/fit-india/2025-26/YOGA/x.jpg
    const photoPath = searchParams.get("photoPath");
    if (!photoPath) {
      return NextResponse.json({ success: false, error: "Missing photo path" }, { status: 400 });
    }

    await deleteActivityPhoto(photoPath);
    return NextResponse.json({ success: true, message: "Photo deleted successfully" });
  } catch (error: any) {
    const status = error instanceof ActivityStorageError ? 400 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
