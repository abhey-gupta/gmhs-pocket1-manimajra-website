import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { ActivityStorageError, moveActivityPack } from "@/lib/activities-storage";
import { activityPackPath, normalizeActivityPath } from "@/lib/activity-paths";

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

    const from = normalizeActivityPath(oldPath);
    const to = activityPackPath(newCategory, newYear, newTitle);

    if (from === to) {
      return NextResponse.json({ success: true, message: "Paths are identical, no change made.", newPath: to });
    }

    const moved = await moveActivityPack(from, to);

    return NextResponse.json({
      success: true,
      message: `Activity moved and renamed successfully (${moved} photos)`,
      newPath: to,
    });
  } catch (error: any) {
    const status = error instanceof ActivityStorageError ? 400 : 500;
    return NextResponse.json({ success: false, error: error.message }, { status });
  }
}
