// @ts-nocheck
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Loader2, Image as ImageIcon, Upload, FolderPlus } from "lucide-react";
import { Label } from "../ui/label";
import axios from "axios";
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
    if (!formData.category) {
      toast.error("Please choose an activity category");
      return;
    }
    if (!formData.year) {
      toast.error("Please choose a session year");
      return;
    }
    if (!formData.title.trim()) {
      toast.error("Please enter an activity title");
      return;
    }
    if (!files || files.length === 0) {
      toast.error("Please choose at least one image to upload");
      return;
    }

    setUploading(true);

    const path = `gmhspkt1/activities/${formData.category}/${formData.year}/${formData.title}`;
    try {
      const uploadData = new FormData();
      for (const file of files) {
        uploadData.append("file", file);
      }
      uploadData.append("folder", path);

      // Send files to backend
      const { data } = await axios.post("/api/upload/multiple", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (data.success) {
        toast.success("Activity added successfully");
        setFormData({
          title: "",
          year: "",
          category: "",
        });
        setFiles(null);
      } else {
        toast.error(data.error || "An error occurred while uploading. Please try again.");
      }
    } catch (error: any) {
      console.error("Error uploading file:", error);
      const errMsg = error.response?.data?.error || error.message || "An error occurred while uploading. Please try again.";
      toast.error(errMsg);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="group h-44 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 hover:border-amber-300 w-full p-6 rounded-2xl flex items-center justify-center flex-col gap-2.5 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300">
            <div className="p-3 rounded-full bg-amber-50 text-amber-700 group-hover:scale-110 transition-transform duration-300">
              <ImageIcon className="w-6 h-6" />
            </div>
            <div className="space-y-0.5 text-center">
              <h3 className="font-extrabold text-slate-800 text-sm">Add Activity</h3>
              <p className="text-[11px] text-slate-400 font-medium">Publish a new activity gallery folder</p>
            </div>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px] rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-md">
          <DialogHeader className="border-b border-slate-100 pb-3 text-left">
            <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
              <FolderPlus className="w-5 h-5 text-amber-600" />
              <span>Add Activity Pack</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4 text-left">
            
            {/* Category & Session Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      category: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-amber-500">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent className="glass-panel">
                    <SelectItem value="samagra-shiksha">Samagra Shiksha</SelectItem>
                    <SelectItem value="pm-poshan">PM Poshan</SelectItem>
                    <SelectItem value="digital-india">Digital India</SelectItem>
                    <SelectItem value="fit-india">Fit India</SelectItem>
                    <SelectItem value="ek-bharat-shrestha-bharat">Ek Bharat Shrestha</SelectItem>
                    <SelectItem value="swachh-bharat-swachh-vidayalaya">Swachh Bharat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Session <span className="text-red-500">*</span>
                </Label>
                <Select
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      year: value,
                    })
                  }
                >
                  <SelectTrigger className="w-full rounded-xl border-slate-200 focus:ring-amber-500">
                    <SelectValue placeholder="Choose" />
                  </SelectTrigger>
                  <SelectContent className="glass-panel">
                    <SelectItem value="2023-24">2023-24</SelectItem>
                    <SelectItem value="2024-25">2024-25</SelectItem>
                    <SelectItem value="2025-26">2025-26</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Activity Title <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                placeholder="Enter activity title"
                className="rounded-xl border-slate-200/80 focus:border-amber-500 py-2"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    title: e.target.value,
                  })
                }
                value={formData.title}
              />
            </div>

            {/* Multiple File Upload */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Images (Upload Multiple)</Label>
              <div className="relative border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-650 truncate max-w-[200px]">
                    {files ? `${files.length} images selected` : "No images selected"}
                  </span>
                </div>
                <label className="cursor-pointer bg-white hover:bg-slate-50 border border-slate-200 font-bold px-3 py-1.5 rounded-lg text-[10px] text-slate-700 shadow-sm transition-all shrink-0">
                  Select Files
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFiles(e.target.files)}
                  />
                </label>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2">
              {uploading ? (
                <Button disabled className="w-full bg-slate-900 text-white rounded-xl py-2.5">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Uploading Images
                </Button>
              ) : (
                <Button onClick={handleUpload} className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold rounded-xl py-2.5 shadow-md shadow-amber-500/10">
                  Add Activity Folder
                </Button>
              )}
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddActivity;
