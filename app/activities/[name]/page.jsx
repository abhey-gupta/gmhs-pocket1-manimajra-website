import AWS from "aws-sdk";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

const s3 = new AWS.S3();

const Page = async ({ params }) => {
  const { name } = params;

  const response = await s3
    .listObjectsV2({
      Bucket: "misc-bucket0",
      Prefix: `gmhspkt1/activities/${name}`,
    })
    .promise();

  const files = response.Contents.map((obj) => obj.Key);

  const formattedFiles = files.reduce((acc, path) => {
    const parts = path.split("/");
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
      acc[year][title].push(path);
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
                      <Drawer>
                        <DrawerTrigger>
                          {" "}
                          <div className=" p-3 shadow rounded-lg flex flex-col transition border border-gray-200 h-72 w-60 relative cursor-pointer">
                            {formattedFiles[year][title].map(
                              (img, index) =>
                                index <= 2 && (
                                  <img
                                    src={
                                      `https://misc-bucket0.s3.ap-south-1.amazonaws.com/` +
                                      formattedFiles[year][title][index]
                                    }
                                    className={`bg-white object-contain h-52 w-52 absolute left-3 top-${5} right-3 rounded-lg border ${
                                      index == 1
                                        ? "rotate-[3deg]"
                                        : index == 2
                                        ? "rotate-[6deg]"
                                        : ""
                                    }`}
                                    style={{
                                      zIndex: 100 - index,
                                    }}
                                  />
                                )
                            )}
                            <h1 className="mt-auto text-lg font-semibold">
                              {title}
                            </h1>
                          </div>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>{title}</DrawerTitle>
                            <DrawerDescription>
                              <div className="h-[60vh] flex justify-evenly mt-8 gap-5 flex-wrap overflow-scroll">
                                {formattedFiles[year][title].map(
                                  (img, index) => (
                                    <img
                                      src={
                                        `https://misc-bucket0.s3.ap-south-1.amazonaws.com/` +
                                        formattedFiles[year][title][index]
                                      }
                                      className={`bg-white object-contain h-40 w-40 md:h-64 mx-auto md:w-64 rounded-lg border p-1`}
                                      style={{
                                        zIndex: 100 - index,
                                      }}
                                    />
                                  )
                                )}
                              </div>
                            </DrawerDescription>
                          </DrawerHeader>
                          <DrawerFooter>
                            <DrawerClose>
                              <Button variant="outline">Close</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>

                      //   <div className=" p-3 shadow rounded-lg flex flex-col transition border border-gray-200 h-72 w-60 relative cursor-pointer">
                      //     {formattedFiles[year][title].map(
                      //       (img, index) =>
                      //         index <= 2 && (
                      //           <img
                      //             src={
                      //               `https://misc-bucket0.s3.ap-south-1.amazonaws.com/` +
                      //               formattedFiles[year][title][index]
                      //             }
                      //             className={`bg-white object-contain h-52 w-52 absolute left-3 top-${5} right-3 rounded-lg border ${
                      //               index == 1
                      //                 ? "rotate-[3deg]"
                      //                 : index == 2
                      //                 ? "rotate-[6deg]"
                      //                 : ""
                      //             }`}
                      //             style={{
                      //               zIndex: 100 - index,
                      //             }}
                      //           />
                      //         )
                      //     )}
                      //     <h1 className="mt-auto text-lg font-semibold">
                      //       {title}
                      //     </h1>
                      //   </div>
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
