import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { isAuthenticated } from "@/lib/auth";

export const dynamic = "force-dynamic";


const defaultNavigation = [
  {
    id: "cbse",
    label: "CBSE",
    items: [
      { id: "as", label: "Affiliation Status", type: "pdf", value: "https://gmhspocket1manimajra.com/wp-content/uploads/2023/06/school-affiliation.pdf" },
      { id: "mpd", label: "Mandatory Public Disclosure", type: "pdf", value: "https://gmhspocket1manimajra.com/wp-content/uploads/2023/06/Mandatory-Public-Disclosure.pdf" }
    ]
  },
  {
    id: "school-info",
    label: "School Info",
    items: [
      { id: "se", label: "Students Enrolment", type: "url", value: "/#home" },
      { id: "su", label: "School Uniform", type: "page", value: "school-uniform" },
      { id: "infra", label: "Infrastructure", type: "page", value: "infrastructure" },
      { id: "staff", label: "Staff", type: "url", value: "/#contact" }
    ]
  },
  {
    id: "committees",
    label: "Committees",
    items: [
      { id: "smc", label: "School Management (SMC)", type: "url", value: "/#home" },
      { id: "shc", label: "Sexual Harassment Committee", type: "url", value: "/#about" },
      { id: "cfc", label: "Child Friendly Committee", type: "url", value: "/#contact" }
    ]
  },
  {
    id: "results",
    label: "Results",
    items: [
      { id: "c1", label: "Class 1", type: "url", value: "/#home" },
      { id: "c2", label: "Class 2", type: "url", value: "/#home" },
      { id: "c3", label: "Class 3", type: "url", value: "/#home" },
      { id: "c4", label: "Class 4", type: "url", value: "/#home" },
      { id: "c5", label: "Class 5", type: "url", value: "/#home" },
      { id: "c6", label: "Class 6", type: "url", value: "/#home" },
      { id: "c7", label: "Class 7", type: "url", value: "/#home" },
      { id: "c8", label: "Class 8", type: "url", value: "/#home" },
      { id: "c9", label: "Class 9", type: "url", value: "/#home" },
      { id: "c10", label: "Class 10", type: "url", value: "/#home" }
    ]
  },
  {
    id: "achievements",
    label: "Achievements",
    items: [
      { id: "acad", label: "Academic", type: "url", value: "/#home" },
      { id: "non-acad", label: "Non Academic", type: "url", value: "/#about" }
    ]
  }
];

export async function GET() {
  try {
    const configDir = path.join(process.cwd(), "public", "gmhspkt1", "config");
    const filePath = path.join(configDir, "navigation.json");

    try {
      const data = await fs.readFile(filePath, "utf-8");
      return NextResponse.json({ success: true, navigation: JSON.parse(data) });
    } catch {
      // Create directories if they do not exist
      await fs.mkdir(configDir, { recursive: true });
      // Write default configuration
      await fs.writeFile(filePath, JSON.stringify(defaultNavigation, null, 2));
      return NextResponse.json({ success: true, navigation: defaultNavigation });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 550 });
  }
}

export async function POST(req: Request) {
  try {
    if (!isAuthenticated()) {
      return NextResponse.json({ success: false, error: "Unauthorized access" }, { status: 401 });
    }

    const { navigation } = await req.json();
    if (!navigation || !Array.isArray(navigation)) {
      return NextResponse.json({ success: false, error: "Invalid navigation data structure" }, { status: 400 });
    }

    const configDir = path.join(process.cwd(), "public", "gmhspkt1", "config");
    const filePath = path.join(configDir, "navigation.json");

    await fs.mkdir(configDir, { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(navigation, null, 2));

    return NextResponse.json({ success: true, message: "Navigation updated successfully", navigation });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
