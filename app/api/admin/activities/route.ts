import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import {
  ActivityStorageError,
  deleteActivityPack,
  listActivityPacks,
} from "@/lib/activities-storage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const activities = await listActivityPacks();
    return NextResponse.json({ success: true, activities });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const folderPath = searchParams.get("path");
    if (!folderPath) {
      return NextResponse.json({ success: false, error: "Missing folder path" }, { status: 400 });
    }

    const removed = await deleteActivityPack(folderPath);
    return NextResponse.json({
      success: true,
      message: `Activity deleted successfully (${removed} photos removed)`,
    });
  } catch (error: any) {
    const status = error instanceof ActivityStorageError ? 400 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
