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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import axios from "axios";
import { IoAddCircleOutline } from "react-icons/io5";
import { toast } from "sonner";

const AddAnnouncement = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    flagged: false,
    file: "",
  });

  const handleUpload = async () => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folderName", "announcements");

      // Send file to backend for processing and uploading to S3
      const { data } = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.success) {
        setFormData({
          ...formData,
          file: data.location,
        });
        await handleCreateRequest(data.location);
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

  const handleCreateRequest = async (filePath) => {
    try {
      const { data } = await axios.post("/api/announcements", {
        title: formData.title,
        flagged: formData.flagged,
        file: filePath,
        description: formData.description,
      });

      console.log(data);
      if (data.success) {
        toast.success("Announcement created successfully");
      } else {
        toast.error(
          "Oops, something went wrong while creating the announcement"
        );
      }
    } catch (err) {
      console.log("An error occurred", err);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="h-44 bg-gray-100 w-fit px-2 py-4 rounded-lg flex items-center justify-center flex-col gap-2 cursor-pointer border shadow">
            <Label>Add Announcement</Label>
            <IoAddCircleOutline size={24} />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Announcement</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex gap-2 flex-col">
              <div>
                <Label>Enter Title</Label>
                <Input
                  placeholder="Enter the title of announcement"
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                />
              </div>
              <div>
                <Label>Enter Description</Label>
                <Textarea
                  placeholder="Enter the description for announcement"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    });
                  }}
                />
              </div>

              <div className="mb-2">
                <Label>Upload attachment</Label>

                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </div>

              <div className="flex items-center gap-3">
                <Label>Flagged ?</Label>
                <Checkbox
                  checked={formData.flagged}
                  onCheckedChange={(checked) => {
                    setFormData({
                      ...formData,
                      flagged: checked,
                    });
                  }}
                />
              </div>

              {uploading ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading
                </Button>
              ) : (
                <Button onClick={handleUpload} disabled={!selectedFile}>
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

export default AddAnnouncement;
