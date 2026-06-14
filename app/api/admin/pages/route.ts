import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const pagesDir = path.join(process.cwd(), "public", "gmhspkt1", "pages");
    
    try {
      await fs.access(pagesDir);
    } catch {
      return NextResponse.json({ success: true, pages: [] });
    }

    const files = await fs.readdir(pagesDir);
    const pagesList = [];

    for (const file of files) {
      if (!file.endsWith(".json")) continue;
      
      const filePath = path.join(pagesDir, file);
      try {
        const content = await fs.readFile(filePath, "utf-8");
        const parsed = JSON.parse(content);
        pagesList.push({
          slug: file.replace(".json", ""),
          title: parsed.title || "",
          subtitle: parsed.subtitle || "",
        });
      } catch (err) {
        // Skip corrupted files
      }
    }

    return NextResponse.json({ success: true, pages: pagesList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
