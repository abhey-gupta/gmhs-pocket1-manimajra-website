// @ts-nocheck
import { promises as fs } from "fs";
import path from "path";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface PageProps {
  params: {
    name: string;
  };
}

// Helper function to recursively scan directory and return paths relative to baseDir
async function getFilesRecursively(dir: string, baseDir: string): Promise<string[]> {
  let results: string[] = [];
  let list;
  try {
    list = await fs.readdir(dir, { withFileTypes: true });
  } catch (e) {
    // If directory doesn't exist, return empty list
    return [];
  }
  for (const file of list) {
    const res = path.resolve(dir, file.name);
    if (file.isDirectory()) {
      results = results.concat(await getFilesRecursively(res, baseDir));
    } else {
      const relativePath = path.relative(baseDir, res);
      // Normalize slashes for web usage
      results.push(relativePath.replace(/\\/g, "/"));
    }
  }
  return results;
}

const Page = async ({ params }: PageProps) => {
  const { name } = params;

  // Local storage base directory
  const baseDir = path.join(process.cwd(), "public");
  const activitiesDir = path.join(baseDir, "gmhspkt1", "activities", name);

  // Read files from local disk instead of S3
  const files = await getFilesRecursively(activitiesDir, baseDir);

  const formattedFiles = files.reduce<Record<string, Record<string, string[]>>>((acc, filePath) => {
    const parts = filePath.split("/");
    const year = parts[3];
    const title = parts[4];
    const file = parts[5];

    if (year && title && file) {
      if (!acc[year]) {
        acc[year] = {};
      }
      if (!acc[year][title]) {
        acc[year][title] = [];
      }
      acc[year][title].push(filePath);
    }

    return acc;
  }, {});

  return (
    <section
      id="about"
      className="scale-95 md:scale-100 border w-full md:w-2/3 md:mx-auto border-gray-300 flex flex-col items-center mt-24 rounded-lg px-5"
    >
      <h1 className="font-semibold text-2xl md:text-3xl my-4">
        {name.split("-").join(" ")} activities
      </h1>
      <Accordion type="multiple" className="w-full">
        {formattedFiles &&
          Object.keys(formattedFiles).map((year) => (
            <AccordionItem key={year} value={year}>
              <AccordionTrigger className="text-xl">{year}</AccordionTrigger>

              <AccordionContent className="flex gap-5 flex-wrap p-2 items-center justify-center">
                {formattedFiles[year] &&
                  Object.keys(formattedFiles[year]).map((title) => {
                    return (
                      <Drawer key={title}>
                        <DrawerTrigger>
                          {" "}
                          <div className=" p-3 shadow rounded-lg flex flex-col transition border border-gray-200 h-72 w-60 relative cursor-pointer">
                            {formattedFiles[year][title].map(
                              (img, index) =>
                                index <= 2 && (
                                  <img
                                    key={img}
                                    src={`/${formattedFiles[year][title][index]}`}
                                    className={`bg-white object-contain h-52 w-52 absolute left-3 top-5 right-3 rounded-lg border ${
                                      index === 1
                                        ? "rotate-[3deg]"
                                        : index === 2
                                        ? "rotate-[6deg]"
                                        : ""
                                    }`}
                                    style={{
                                      zIndex: 100 - index,
                                    }}
                                    alt=""
                                  />
                                )
                            )}
                            <h1 className="mt-auto text-lg font-semibold text-left">
                              {title}
                            </h1>
                          </div>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>{title}</DrawerTitle>
                            <DrawerDescription asChild>
                              <div className="h-[60vh] flex justify-evenly mt-8 gap-5 flex-wrap overflow-scroll">
                                {formattedFiles[year][title].map(
                                  (img, index) => (
                                    <img
                                      key={img}
                                      src={`/${formattedFiles[year][title][index]}`}
                                      className="bg-white object-contain h-40 w-40 md:h-64 mx-auto md:w-64 rounded-lg border p-1"
                                      style={{
                                        zIndex: 100 - index,
                                      }}
                                      alt=""
                                    />
                                  )
                                )}
                              </div>
                            </DrawerDescription>
                          </DrawerHeader>
                          <DrawerFooter>
                            <DrawerClose asChild>
                              <Button variant="outline">Close</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    );
                  })}
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
    </section>
  );
};

export default Page;
