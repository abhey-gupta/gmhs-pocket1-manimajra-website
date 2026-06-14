// @ts-nocheck
"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Megaphone, Plus, Upload, CheckSquare, Square } from "lucide-react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import axios from "axios";
import { toast } from "sonner";

const AddAnnouncement = () => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    flagged: false,
    file: "",
  });

  const handleUpload = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter an announcement title");
      return;
    }
    setUploading(true);
    try {
      let filePath = "";
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        uploadData.append("folderName", "announcements");

        // Send file to backend
        const { data } = await axios.post("/api/upload", uploadData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (data.success) {
          filePath = data.location;
        } else {
          toast.error(data.error || "An error occurred while uploading the file.");
          setUploading(false);
          return;
        }
      }

      await handleCreateRequest(filePath);
    } catch (error: any) {
      console.error("Error uploading file:", error);
      const errMsg = error.response?.data?.error || error.message || "An error occurred while uploading the file.";
      toast.error(errMsg);
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

      if (data.success) {
        toast.success("Announcement created successfully");
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
        setFormData({
          title: "",
          description: "",
          flagged: false,
          file: "",
        });
        setSelectedFile(null);
      } else {
        toast.error("Oops, something went wrong while creating the announcement");
      }
    } catch (err) {
      console.log("An error occurred", err);
      toast.error("An error occurred while creating the announcement");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="group h-44 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 hover:border-indigo-300 w-full p-6 rounded-2xl flex items-center justify-center flex-col gap-2.5 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300">
            <div className="p-3 rounded-full bg-indigo-50 text-indigo-700 group-hover:scale-110 transition-transform duration-300">
              <Megaphone className="w-6 h-6" />
            </div>
            <div className="space-y-0.5 text-center">
              <h3 className="font-extrabold text-slate-800 text-sm">Add Announcement</h3>
              <p className="text-[11px] text-slate-400 font-medium">Publish a new bulletin to live feed</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-md">
          <DialogHeader className="border-b border-slate-100 pb-3 text-left">
            <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
              <Megaphone className="w-5 h-5 text-indigo-600" />
              <span>Add Announcement</span>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 pt-4 text-left">
            {/* Enter Title */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                placeholder="Enter the title of announcement"
                className="rounded-xl border-slate-200/80 focus:border-indigo-500 py-2"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                value={formData.title}
              />
            </div>

            {/* Enter Description */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</Label>
              <Textarea
                placeholder="Enter description text"
                className="rounded-xl border-slate-200/80 focus:border-indigo-500 min-h-[90px]"
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    description: e.target.value,
                  });
                }}
                value={formData.description}
              />
            </div>

            {/* File Upload */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">File Attachment</Label>
              <div className="relative border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-650 truncate max-w-[180px]">
                    {selectedFile ? selectedFile.name : "No file selected"}
                  </span>
                </div>
                <label className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 font-bold px-3 py-1.5 rounded-lg text-[10px] text-slate-700 shadow-sm transition-all shrink-0">
                  Choose File
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                  />
                </label>
              </div>
            </div>

            {/* Flagged Checkbox */}
            <div className="flex items-center gap-2 py-1">
              <Checkbox
                id="flagged"
                checked={formData.flagged}
                onCheckedChange={(checked) => {
                  setFormData({
                    ...formData,
                    flagged: checked,
                  });
                }}
              />
              <label
                htmlFor="flagged"
                className="text-xs font-bold text-slate-600 cursor-pointer select-none"
              >
                Mark as Urgent (Flags in Feed)
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              {uploading ? (
                <Button disabled className="w-full bg-slate-900 text-white rounded-xl py-2.5">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Publishing
                </Button>
              ) : (
                <Button onClick={handleUpload} className="w-full bg-indigo-900 hover:bg-indigo-850 text-white font-semibold rounded-xl py-2.5 shadow-md shadow-indigo-900/10">
                  Publish Bulletin
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddAnnouncement;
