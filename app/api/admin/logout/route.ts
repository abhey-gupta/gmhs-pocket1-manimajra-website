import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  cookies().set("admin_token", "", {
    path: "/",
    maxAge: 0,
  });
  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
