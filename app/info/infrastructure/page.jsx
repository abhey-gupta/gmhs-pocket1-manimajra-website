import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Infrastructure = () => {
  return (
    <section
      id="about"
      className="scale-95 md:scale-100 border w-full md:w-2/3 md:mx-auto border-gray-300 flex flex-col items-center mt-20 rounded-lg"
    >
      <h1 className="font-semibold text-2xl md:text-3xl my-2">
        Infrastructure
      </h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rooms</TableHead>
            <TableHead>Number</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Class Room</TableCell>
            <TableCell>27</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Composite Science Lab</TableCell>
            <TableCell>01</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Math Lab</TableCell>
            <TableCell>01</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Computer Science Lab</TableCell>
            <TableCell>01</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Home Science Lab</TableCell>
            <TableCell>01</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Other Labs</TableCell>
            <TableCell>01</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Library</TableCell>
            <TableCell>01</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Other Rooms</TableCell>
            <TableCell>04</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Label className="w-full p-3">
        ⭐️ Separate washrooms for boys and girls on each floor
      </Label>
      <Label className="w-full p-3">
        ⭐️ 1 washroom for CWSN on each floor
      </Label>
    </section>
  );
};

export default Infrastructure;
