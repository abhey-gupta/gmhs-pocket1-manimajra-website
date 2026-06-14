import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const baseDir = path.join(process.cwd(), "public");
    const activitiesDir = path.join(baseDir, "gmhspkt1", "activities");

    // Check if the base directory exists
    try {
      await fs.access(activitiesDir);
    } catch {
      // If it doesn't exist, return empty list
      return NextResponse.json({ success: true, activities: [] });
    }

    const activitiesList: Array<{
      id: string;
      category: string;
      year: string;
      title: string;
      photos: string[];
      path: string;
    }> = [];

    // 1. Read categories (e.g. samagra-shiksha, pm-poshan)
    const categories = await fs.readdir(activitiesDir, { withFileTypes: true });
    for (const catDir of categories) {
      if (!catDir.isDirectory()) continue;
      const category = catDir.name;
      const catPath = path.join(activitiesDir, category);

      // 2. Read session years (e.g. 2024-25, 2025-26)
      let years;
      try {
        years = await fs.readdir(catPath, { withFileTypes: true });
      } catch {
        continue;
      }

      for (const yrDir of years) {
        if (!yrDir.isDirectory()) continue;
        const year = yrDir.name;
        const yrPath = path.join(catPath, year);

        // 3. Read activity titles
        let titles;
        try {
          titles = await fs.readdir(yrPath, { withFileTypes: true });
        } catch {
          continue;
        }

        for (const titleDir of titles) {
          if (!titleDir.isDirectory()) continue;
          const title = titleDir.name;
          const titlePath = path.join(yrPath, title);

          // 4. Read photos inside this activity
          let files;
          try {
            files = await fs.readdir(titlePath, { withFileTypes: true });
          } catch {
            continue;
          }

          const photos = files
            .filter((f) => f.isFile() && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(f.name))
            .map((f) => `/gmhspkt1/activities/${category}/${year}/${title}/${f.name}`);

          activitiesList.push({
            id: `${category}|${year}|${title}`,
            category,
            year,
            title,
            photos,
            path: `gmhspkt1/activities/${category}/${year}/${title}`,
          });
        }
      }
    }

    return NextResponse.json({ success: true, activities: activitiesList });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 550 });
  }
}

export async function DELETE(req: Request) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const folderPath = searchParams.get("path"); // relative path from public root, e.g. gmhspkt1/activities/category/year/title
    if (!folderPath) {
      return NextResponse.json({ success: false, error: "Missing folder path" }, { status: 400 });
    }

    // Security check: ensure path is inside gmhspkt1/activities
    const normalized = path.normalize(folderPath).replace(/^(\.\.(\/|\\))+/, "");
    if (!normalized.startsWith("gmhspkt1/activities")) {
      return NextResponse.json({ success: false, error: "Invalid path segment" }, { status: 400 });
    }

    const fullPath = path.join(process.cwd(), "public", normalized);

    // Delete folder recursively
    await fs.rm(fullPath, { recursive: true, force: true });

    return NextResponse.json({ success: true, message: "Activity deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
