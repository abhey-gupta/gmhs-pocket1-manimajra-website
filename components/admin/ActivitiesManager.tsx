// @ts-nocheck
"use client";

import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Trash2, Edit, Image as ImageIcon,
  Loader2, FolderOpen, Layers, ImagePlus, AlertTriangle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import AddActivity from "./AddActivity";
import { getSessionYears } from "@/lib/sessions";
import { ACTIVITY_CATEGORIES, activityCategoryLabel } from "@/lib/activity-categories";

const SESSION_YEARS = getSessionYears();

const ActivitiesManager = () => {
  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isPhotoViewOpen, setIsPhotoViewOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [renaming, setRenaming] = useState(false);
  const [deletingPhotoPath, setDeletingPhotoPath] = useState(null);
  const [uploadingToPath, setUploadingToPath] = useState(null);

  // One hidden file input, retargeted at whichever pack the admin clicked
  const fileInputRef = useRef(null);
  const uploadTargetRef = useRef(null);

  const [renameForm, setRenameForm] = useState({
    oldPath: "",
    newCategory: "",
    newYear: "",
    newTitle: ""
  });

  // Fetch Activities
  const { data: activities, isLoading, isError, error } = useQuery({
    queryKey: ["admin_activities"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/activities");
      if (!data.success) throw new Error(data.error);
      return data.activities;
    }
  });

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["admin_activities"] });

  const handleDeleteActivity = async (id, folderPath) => {
    if (!confirm("Are you sure you want to delete this entire activity pack? This will permanently delete all photos inside it!")) return;
    setDeletingId(id);
    try {
      const { data } = await axios.delete(`/api/admin/activities?path=${encodeURIComponent(folderPath)}`);
      if (data.success) {
        toast.success("Activity deleted successfully");
        refresh();
      } else {
        toast.error(data.error || "Failed to delete activity");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "An error occurred while deleting the activity");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeletePhoto = async (photoPath) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    setDeletingPhotoPath(photoPath);
    try {
      const { data } = await axios.delete(`/api/admin/activities/photo?photoPath=${encodeURIComponent(photoPath)}`);
      if (data.success) {
        toast.success("Photo deleted successfully");

        // Update local state for photos dialog
        setSelectedActivity((prev) => prev && ({
          ...prev,
          photos: prev.photos.filter((p) => p.path !== photoPath)
        }));

        refresh();
      } else {
        toast.error(data.error || "Failed to delete photo");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "An error occurred while deleting the photo");
    } finally {
      setDeletingPhotoPath(null);
    }
  };

  const handlePickPhotos = (activity) => {
    uploadTargetRef.current = activity;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  };

  const handleAddPhotos = async (fileList) => {
    const activity = uploadTargetRef.current;
    if (!activity || !fileList || fileList.length === 0) return;

    setUploadingToPath(activity.path);
    try {
      const uploadData = new FormData();
      for (const file of fileList) uploadData.append("file", file);
      uploadData.append("folder", activity.path);

      const { data } = await axios.post("/api/upload/multiple", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      if (data.success) {
        toast.success(`${fileList.length} photo(s) added to "${activity.title}"`);
        const { data: fresh } = await axios.get("/api/admin/activities");
        if (fresh.success) {
          queryClient.setQueryData(["admin_activities"], fresh.activities);
          // Keep the open gallery dialog in sync
          setSelectedActivity((prev) =>
            prev ? fresh.activities.find((a) => a.path === prev.path) ?? prev : prev
          );
        } else {
          refresh();
        }
      } else {
        toast.error(data.error || "Failed to upload photos");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "An error occurred while uploading photos");
    } finally {
      setUploadingToPath(null);
      uploadTargetRef.current = null;
    }
  };

  const handleOpenRename = (activity) => {
    setRenameForm({
      oldPath: activity.path,
      newCategory: activity.category,
      newYear: activity.year,
      newTitle: activity.title
    });
    setIsRenameOpen(true);
  };

  const handleRenameSubmit = async () => {
    if (!renameForm.newTitle.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!renameForm.newCategory || !renameForm.newYear) {
      toast.error("Please choose a category and session");
      return;
    }
    setRenaming(true);
    try {
      const { data } = await axios.post("/api/admin/activities/rename", renameForm);
      if (data.success) {
        toast.success("Activity renamed and moved successfully");
        setIsRenameOpen(false);
        refresh();
      } else {
        toast.error(data.error || "Failed to rename/move activity");
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "An error occurred");
    } finally {
      setRenaming(false);
    }
  };

  const handleOpenPhotos = (activity) => {
    setSelectedActivity(activity);
    setIsPhotoViewOpen(true);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Shared hidden input used by every "Add photos" button */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => handleAddPhotos(e.target.files)}
      />

      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Manage Activities Gallery</h3>
          <p className="text-slate-400 text-xs font-medium">Add or delete photos, rename sessions/categories, and delete whole activity packs</p>
        </div>
        <AddActivity />
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : isError ? (
        <div className="text-center py-12 border border-dashed border-red-200 rounded-2xl bg-red-50/40">
          <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <p className="text-red-700 font-bold text-sm">Could not load activities.</p>
          <p className="text-red-500/80 text-xs mt-1">{error?.message || "Please try again."}</p>
          <button
            onClick={refresh}
            className="mt-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-[11px] px-3 py-1.5 rounded-lg cursor-pointer shadow-sm"
          >
            Retry
          </button>
        </div>
      ) : !activities || activities.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <ImageIcon className="w-8 h-8 text-slate-350 mx-auto mb-2 opacity-30" />
          <p className="text-slate-500 font-bold text-sm">No activity packs uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => {
            const label = activityCategoryLabel(activity.category);
            const coverImage = activity.photos[0]?.url || "";
            const isUploading = uploadingToPath === activity.path;

            return (
              <div
                key={activity.id}
                className="group bg-white border border-slate-200/60 hover:border-slate-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-[420px]"
              >
                {/* Cover Photo */}
                <div className="relative h-44 bg-slate-100 shrink-0">
                  {coverImage ? (
                    <img
                      src={coverImage}
                      alt={activity.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-1 bg-slate-50">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <span className="text-[10px] font-bold">No Photos</span>
                    </div>
                  )}
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {label}
                  </span>
                  {/* Session Badge */}
                  <span className="absolute top-3 right-3 bg-amber-500/90 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                    Session {activity.year}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 flex-grow flex flex-col justify-between text-left">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-amber-700 transition-colors line-clamp-2">
                      {activity.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {activity.photos.length} Photos
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-1.5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenPhotos(activity)}
                      className="flex items-center justify-center gap-1 bg-slate-55/60 hover:bg-indigo-50 hover:text-indigo-900 text-slate-650 font-bold py-2 px-1 rounded-xl text-[10px] transition-colors border border-slate-100 cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Photos</span>
                    </button>
                    <button
                      onClick={() => handlePickPhotos(activity)}
                      disabled={isUploading}
                      className="flex items-center justify-center gap-1 bg-slate-55/60 hover:bg-emerald-50 hover:text-emerald-900 text-slate-650 font-bold py-2 px-1 rounded-xl text-[10px] transition-colors border border-slate-100 cursor-pointer disabled:opacity-60"
                    >
                      {isUploading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ImagePlus className="w-3.5 h-3.5" />
                      )}
                      <span>{isUploading ? "Uploading" : "Add Photos"}</span>
                    </button>
                    <button
                      onClick={() => handleOpenRename(activity)}
                      className="flex items-center justify-center gap-1 bg-slate-55/60 hover:bg-amber-50 hover:text-amber-900 text-slate-650 font-bold py-2 px-1 rounded-xl text-[10px] transition-colors border border-slate-100 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Rename</span>
                    </button>
                    <button
                      onClick={() => handleDeleteActivity(activity.id, activity.path)}
                      disabled={deletingId === activity.id}
                      className="flex items-center justify-center gap-1 bg-red-50 hover:bg-red-100 text-red-650 font-bold py-2 px-1 rounded-xl text-[10px] transition-colors cursor-pointer border-0"
                    >
                      {deletingId === activity.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Gallery Dialog */}
      {selectedActivity && (
        <Dialog open={isPhotoViewOpen} onOpenChange={setIsPhotoViewOpen}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white text-left">
            <DialogHeader className="border-b border-slate-100 pb-4 mb-6 flex flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Gallery photos</span>
                <DialogTitle className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  {selectedActivity.title}
                </DialogTitle>
              </div>
              <button
                onClick={() => handlePickPhotos(selectedActivity)}
                disabled={uploadingToPath === selectedActivity.path}
                className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold py-2 px-3 rounded-xl text-[11px] shadow-sm cursor-pointer border-0 shrink-0 mr-8 disabled:opacity-60"
              >
                {uploadingToPath === selectedActivity.path ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ImagePlus className="w-3.5 h-3.5" />
                )}
                <span>Add Photos</span>
              </button>
            </DialogHeader>

            {selectedActivity.photos.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-25" />
                <p className="text-sm font-semibold">No photos inside folder.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pb-4">
                {selectedActivity.photos.map((photo) => (
                  <div
                    key={photo.path}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200/50 bg-slate-50 shadow-sm group"
                  >
                    <img
                      src={photo.url}
                      className="object-cover w-full h-full"
                      alt=""
                    />
                    {/* Delete button overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDeletePhoto(photo.path)}
                        disabled={deletingPhotoPath === photo.path}
                        className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg transition-transform hover:scale-110 cursor-pointer"
                        title="Delete photo"
                      >
                        {deletingPhotoPath === photo.path ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}

      {/* Rename Dialog */}
      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-3xl p-6 sm:p-8 bg-white text-left">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
              <Layers className="w-5 h-5 text-amber-600" />
              <span>Rename & Move Activity</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Category selection */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</Label>
              <Select
                value={renameForm.newCategory}
                onValueChange={(val) => setRenameForm({ ...renameForm, newCategory: val })}
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Choose Category" />
                </SelectTrigger>
                <SelectContent className="glass-panel">
                  {ACTIVITY_CATEGORIES.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>{category.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Session Selection */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Session Year</Label>
              <Select
                value={renameForm.newYear}
                onValueChange={(val) => setRenameForm({ ...renameForm, newYear: val })}
              >
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Choose Session" />
                </SelectTrigger>
                <SelectContent className="glass-panel">
                  {SESSION_YEARS.map((year) => (
                    <SelectItem key={year} value={year}>{year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Title Input */}
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activity Title</Label>
              <Input
                value={renameForm.newTitle}
                onChange={(e) => setRenameForm({ ...renameForm, newTitle: e.target.value })}
                placeholder="Enter new activity folder title"
                className="rounded-xl"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              {renaming ? (
                <Button disabled className="w-full bg-slate-900 text-white rounded-xl py-2.5">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Moving Folders...
                </Button>
              ) : (
                <Button onClick={handleRenameSubmit} className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold rounded-xl py-2.5 shadow-md">
                  Apply Rename & Move
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivitiesManager;
