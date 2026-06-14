import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminToken = process.env.ADMIN_TOKEN;

    if (!adminEmail || !adminPassword || !adminToken) {
      return NextResponse.json(
        { success: false, error: "Server authentication keys are missing on host env." },
        { status: 500 }
      );
    }
    
    if (email === adminEmail && password === adminPassword) {
      // Set HttpOnly cookie securely
      cookies().set("admin_token", adminToken, {
        httpOnly: true,
        path: "/",
        maxAge: 86400, // 24 hours
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
      
      return NextResponse.json({ success: true, message: "Logged in successfully" });
    }
    
    return NextResponse.json(
      { success: false, error: "Invalid email or access password" },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "An unexpected error occurred during login: " + error.message },
      { status: 500 }
    );
  }
}
