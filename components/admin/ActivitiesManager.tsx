// @ts-nocheck
"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Folder, Trash2, Edit, Calendar, Image as ImageIcon, 
  Loader2, FolderOpen, Layers, X, ArrowRight 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";
import AddActivity from "./AddActivity";

const CATEGORY_LABELS = {
  "samagra-shiksha": "Samagra Shiksha",
  "pm-poshan": "PM Poshan",
  "digital-india": "Digital India",
  "fit-india": "Fit India",
  "ek-bharat-shrestha-bharat": "Ek Bharat Shrestha Bharat",
  "swachh-bharat-swachh-vidayalaya": "Swachh Bharat Swachh Vidayalaya"
};

const ActivitiesManager = () => {
  const queryClient = useQueryClient();
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isPhotoViewOpen, setIsPhotoViewOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [renaming, setRenaming] = useState(false);
  const [deletingPhotoPath, setDeletingPhotoPath] = useState(null);

  const [renameForm, setRenameForm] = useState({
    oldPath: "",
    newCategory: "",
    newYear: "",
    newTitle: ""
  });

  // Fetch Activities
  const { data: activities, isLoading } = useQuery({
    queryKey: ["admin_activities"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/activities");
      if (!data.success) throw new Error(data.error);
      return data.activities;
    }
  });

  const handleDeleteActivity = async (id, folderPath) => {
    if (!confirm("Are you sure you want to delete this entire activity pack? This will permanently delete all photos inside it!")) return;
    setDeletingId(id);
    try {
      const { data } = await axios.delete(`/api/admin/activities?path=${encodeURIComponent(folderPath)}`);
      if (data.success) {
        toast.success("Activity deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["admin_activities"] });
      } else {
        toast.error(data.error || "Failed to delete activity");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the activity");
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeletePhoto = async (photoPath, activity) => {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    setDeletingPhotoPath(photoPath);
    try {
      const { data } = await axios.delete(`/api/admin/activities/photo?photoPath=${encodeURIComponent(photoPath)}`);
      if (data.success) {
        toast.success("Photo deleted successfully");
        
        // Update local state for photos dialog
        setSelectedActivity(prev => ({
          ...prev,
          photos: prev.photos.filter(p => p !== photoPath)
        }));

        queryClient.invalidateQueries({ queryKey: ["admin_activities"] });
      } else {
        toast.error(data.error || "Failed to delete photo");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the photo");
    } finally {
      setDeletingPhotoPath(null);
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
    setRenaming(true);
    try {
      const { data } = await axios.post("/api/admin/activities/rename", renameForm);
      if (data.success) {
        toast.success("Activity renamed and moved successfully");
        setIsRenameOpen(false);
        queryClient.invalidateQueries({ queryKey: ["admin_activities"] });
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
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Manage Activities Gallery</h3>
          <p className="text-slate-400 text-xs font-medium">Delete activity folders, rename sessions/categories, and manage individual photos</p>
        </div>
        <AddActivity />
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : activities && activities.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <ImageIcon className="w-8 h-8 text-slate-350 mx-auto mb-2 opacity-30" />
          <p className="text-slate-500 font-bold text-sm">No activity packs uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => {
            const label = CATEGORY_LABELS[activity.category] || activity.category;
            const coverImage = activity.photos[0] || "";

            return (
              <div 
                key={activity.id}
                className="group bg-white border border-slate-200/60 hover:border-slate-300 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-[380px]"
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

                  {/* Actions Row */}
                  <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleOpenPhotos(activity)}
                      className="flex items-center justify-center gap-1 bg-slate-55/60 hover:bg-indigo-50 hover:text-indigo-900 text-slate-650 font-bold py-2 px-1 rounded-xl text-[10px] transition-colors border border-slate-100 cursor-pointer"
                    >
                      <FolderOpen className="w-3.5 h-3.5" />
                      <span>Photos</span>
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
            <DialogHeader className="border-b border-slate-100 pb-4 mb-6 flex flex-row items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Gallery photos</span>
                <DialogTitle className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  {selectedActivity.title}
                </DialogTitle>
              </div>
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
                    key={photo}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-slate-200/50 bg-slate-50 shadow-sm group"
                  >
                    <img 
                      src={photo} 
                      className="object-cover w-full h-full"
                      alt=""
                    />
                    {/* Delete button overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleDeletePhoto(photo, selectedActivity)}
                        disabled={deletingPhotoPath === photo}
                        className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-xl shadow-lg transition-transform hover:scale-110 cursor-pointer"
                        title="Delete photo"
                      >
                        {deletingPhotoPath === photo ? (
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
                  {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>{label}</SelectItem>
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
                  <SelectItem value="2023-24">2023-24</SelectItem>
                  <SelectItem value="2024-25">2024-25</SelectItem>
                  <SelectItem value="2025-26">2025-26</SelectItem>
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
