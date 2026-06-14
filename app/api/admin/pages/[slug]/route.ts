import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const cleanSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "");
    const filePath = path.join(process.cwd(), "public", "gmhspkt1", "pages", `${cleanSlug}.json`);

    try {
      const content = await fs.readFile(filePath, "utf-8");
      return NextResponse.json({ success: true, page: JSON.parse(content) });
    } catch {
      return NextResponse.json({ success: false, error: `Page '${slug}' not found` }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 550 });
  }
}

export async function POST(req: Request, { params }: { params: { slug: string } }) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { slug } = params;
    const cleanSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "");
    const body = await req.json();

    const pagesDir = path.join(process.cwd(), "public", "gmhspkt1", "pages");
    const filePath = path.join(pagesDir, `${cleanSlug}.json`);

    // Ensure page folder exists
    await fs.mkdir(pagesDir, { recursive: true });
    // Write dynamic page configuration
    await fs.writeFile(filePath, JSON.stringify(body, null, 2));

    return NextResponse.json({ success: true, message: "Page saved successfully", page: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { slug: string } }) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { slug } = params;
    const cleanSlug = slug.replace(/[^a-zA-Z0-9-_]/g, "");
    const filePath = path.join(process.cwd(), "public", "gmhspkt1", "pages", `${cleanSlug}.json`);

    try {
      await fs.unlink(filePath);
      return NextResponse.json({ success: true, message: `Page '${slug}' deleted successfully` });
    } catch {
      return NextResponse.json({ success: false, error: "Page file does not exist" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
