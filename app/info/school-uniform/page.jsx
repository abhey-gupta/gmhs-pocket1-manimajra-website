import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SchoolUniform = () => {
  return (
    <section
      id="about"
      className="scale-95 md:scale-100 border w-full md:w-2/3 md:mx-auto border-gray-300 flex flex-col items-center mt-20 rounded-lg"
    >
      <h1 className="font-semibold text-2xl md:text-3xl my-2">
        School Uniform
      </h1>
      <Label className="w-full px-3 text-gray-700">For Primary Classes</Label>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Boys</TableHead>
            <TableHead>Girls</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              Shorts and Shirt (colour as per specification Education Department
              , Chandigarh Administration )
            </TableCell>
            <TableCell>
              Shirt and tunic (colour as per specification Education Department
              , Chandigarh Administration )
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Label className="w-full px-3 text-gray-700 mt-10">
        For Classes from 6th to 10th
      </Label>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Boys</TableHead>
            <TableHead>Girls</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              Trousers and Shirt (colour as per specification Education
              Department , Chandigarh Administration )
            </TableCell>
            <TableCell>
              Salwar / Skirt and Suit/Shirt (colour as per specification
              Education Department , Chandigarh Administration )
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </section>
  );
};

export default SchoolUniform;
