"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import axios from "axios";
import { IoAddCircleOutline } from "react-icons/io5";
import { toast } from "sonner";

const AddActivity = () => {
  const [files, setFiles] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    year: "",
    category: "",
  });

  const handleUpload = async () => {
    setUploading(true);
    console.log(formData);

    const path = `gmhspkt1/activities/${formData.category}/${formData.year}/${formData.title}`;
    console.log(path);
    try {
      const formData = new FormData();
      for (const file of files) {
        formData.append("file", file);
      }
      formData.append("folder", path);

      // Send file to backend for processing and uploading to S3
      const { data } = await axios.post("/api/upload/multiple", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.success) {
        toast.success("Activity added successfully");
      } else {
        alert(
          "An error occurred while uploading the file. Please check your internet connection and try again"
        );
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert(
        "An error occurred while uploading the file. Please check your internet connection and try again"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="h-44 bg-gray-100 w-full px-2 py-4 rounded-lg flex items-center justify-center flex-col gap-2 cursor-pointer border shadow">
            <Label>Add Activity</Label>
            <IoAddCircleOutline size={24} />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex gap-2 flex-col">
              <div className="flex gap-2">
                <div>
                  <Label>
                    Choose Activity Category
                    <span className="text-red-500"> *</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        category: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="samagra-shiksha">
                        Samagra Shiksha
                      </SelectItem>
                      <SelectItem value="pm-poshan">PM Poshan</SelectItem>
                      <SelectItem value="digital-india">
                        Digital India
                      </SelectItem>
                      <SelectItem value="fit-india">Fit India</SelectItem>
                      <SelectItem value="ek-bharat-shrestha-bharat">
                        Ek Bharat Shrestha Bharat
                      </SelectItem>
                      <SelectItem value="swachh-bharat-swachh-vidayalaya">
                        Swachh Bharat Swachh Vidayalaya
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>
                    Choose Year<span className="text-red-500"> *</span>
                  </Label>
                  <Select
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        year: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Choose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2023-24">2023-24</SelectItem>
                      <SelectItem value="2024-25">2024-25</SelectItem>
                      <SelectItem value="2025-26">2025-26</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>
                  Enter Activity Title <span className="text-red-500"> *</span>
                </Label>
                <Input
                  required
                  placeholder="Enter activity title"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="mb-2">
                <Label>Upload attachment</Label>

                <input
                  type="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}
                />
              </div>

              {uploading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading
                </Button>
              ) : (
                <Button onClick={handleUpload} disabled={!files}>
                  Upload
                </Button>
              )}
            </div>
          </div>
          <DialogFooter></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddActivity;
