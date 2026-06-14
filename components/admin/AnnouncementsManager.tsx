// @ts-nocheck
"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Megaphone, Trash2, Edit, Flag, Calendar, 
  Upload, Loader2, Bold, Italic, Heading3, List, Link as LinkIcon 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import { toast } from "sonner";
import AddAnnouncement from "./AddAnnouncement";

const AnnouncementsManager = () => {
  const queryClient = useQueryClient();
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Fetch Announcements
  const { data: announcements, isLoading } = useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data } = await axios.get("/api/announcements/fetch-all");
      if (!data.success) throw new Error(data.error);
      return data.announcements.slice().reverse(); // Newest first
    }
  });

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    setDeletingId(id);
    try {
      const { data } = await axios.delete(`/api/announcements?id=${id}`);
      if (data.success) {
        toast.success("Announcement deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
      } else {
        toast.error(data.error || "Failed to delete announcement");
      }
    } catch (err) {
      toast.error("An error occurred while deleting");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (announcement) => {
    setEditingAnnouncement({
      id: announcement.id,
      title: announcement.title,
      description: announcement.description || "",
      flagged: announcement.flagged,
      file: announcement.file || "",
    });
    setSelectedFile(null);
    setIsEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!editingAnnouncement.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setUpdating(true);
    try {
      let filePath = editingAnnouncement.file;

      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        uploadData.append("folderName", "announcements");

        const { data } = await axios.post("/api/upload", uploadData, {
          headers: { "Content-Type": "multipart/form-data" }
        });

        if (data.success) {
          filePath = data.location;
        } else {
          toast.error(data.error || "Failed to upload new attachment");
          setUpdating(false);
          return;
        }
      }

      const { data } = await axios.put("/api/announcements", {
        id: editingAnnouncement.id,
        title: editingAnnouncement.title,
        flagged: editingAnnouncement.flagged,
        description: editingAnnouncement.description,
        file: filePath,
      });

      if (data.success) {
        toast.success("Announcement updated successfully");
        setIsEditOpen(false);
        queryClient.invalidateQueries({ queryKey: ["announcements"] });
      } else {
        toast.error(data.error || "Failed to update announcement");
      }
    } catch (err: any) {
      console.error("Error updating announcement:", err);
      const errMsg = err.response?.data?.error || err.message || "An error occurred during update";
      toast.error(errMsg);
    } finally {
      setUpdating(false);
    }
  };

  // Formatting helper for textareas
  const insertFormat = (tagType) => {
    const textarea = document.getElementById("edit-desc-textarea");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    let replacement = "";
    switch (tagType) {
      case "bold":
        replacement = `**${selectedText || "bold text"}**`;
        break;
      case "italic":
        replacement = `*${selectedText || "italic text"}*`;
        break;
      case "heading":
        replacement = `\n### ${selectedText || "Heading"}\n`;
        break;
      case "list":
        replacement = `\n- ${selectedText || "List item"}\n`;
        break;
      case "link":
        replacement = `[${selectedText || "Link Title"}](https://example.com)`;
        break;
      default:
        return;
    }

    const newDescription = text.substring(0, start) + replacement + text.substring(end);
    setEditingAnnouncement({
      ...editingAnnouncement,
      description: newDescription
    });

    // Refocus and place selection
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 50);
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Manage Bulletins & Announcements</h3>
          <p className="text-slate-400 text-xs font-medium">Edit, delete, and format existing publications</p>
        </div>
        <AddAnnouncement />
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center items-center">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
        </div>
      ) : announcements && announcements.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
          <Megaphone className="w-8 h-8 text-slate-350 mx-auto mb-2 opacity-30" />
          <p className="text-slate-500 font-bold text-sm">No announcements found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {announcements.map((ann) => (
            <div 
              key={ann.id}
              className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                ann.flagged 
                  ? "bg-amber-50/20 border-amber-200/50 hover:bg-amber-50/40" 
                  : "bg-white border-slate-100 hover:border-slate-200 shadow-sm"
              }`}
            >
              <div className="space-y-1.5 flex-grow text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-base">{ann.title}</h4>
                  {ann.flagged && (
                    <span className="inline-flex items-center gap-0.5 bg-amber-100 text-amber-850 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      <Flag className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                      Urgent
                    </span>
                  )}
                  {ann.file && (
                    <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Has Attachment
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-slate-400 text-[11px] font-semibold">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(ann.created_at).toLocaleDateString()}
                  </span>
                  {ann.description && (
                    <span className="truncate max-w-[280px] md:max-w-md font-medium text-slate-500">
                      {ann.description.replace(/[#*`_-]/g, "")}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                <Button 
                  onClick={() => handleEditClick(ann)}
                  size="sm"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 gap-1.5 rounded-xl text-xs font-bold"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </Button>
                <Button 
                  onClick={() => handleDelete(ann.id)}
                  disabled={deletingId === ann.id}
                  size="sm"
                  className="bg-red-50 hover:bg-red-100 text-red-650 gap-1.5 rounded-xl text-xs font-bold border-0"
                >
                  {deletingId === ann.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span>Delete</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      {editingAnnouncement && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[480px] rounded-3xl p-6 sm:p-8 bg-white">
            <DialogHeader className="border-b border-slate-100 pb-3 text-left">
              <DialogTitle className="text-xl font-extrabold text-slate-900 flex items-center gap-1.5">
                <Megaphone className="w-5 h-5 text-indigo-600" />
                <span>Edit Announcement</span>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-4 text-left">
              {/* Title */}
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Title <span className="text-red-500">*</span>
                </Label>
                <Input 
                  value={editingAnnouncement.title}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                  className="rounded-xl border-slate-200/80 focus:border-indigo-500"
                />
              </div>

              {/* Description & Formatting toolbar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Description</Label>
                  {/* Formatting buttons */}
                  <div className="flex gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                    <button 
                      type="button" 
                      onClick={() => insertFormat("bold")}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                      title="Bold"
                    >
                      <Bold className="w-3 h-3" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat("italic")}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                      title="Italic"
                    >
                      <Italic className="w-3 h-3" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat("heading")}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                      title="Heading"
                    >
                      <Heading3 className="w-3 h-3" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat("list")}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                      title="List"
                    >
                      <List className="w-3 h-3" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => insertFormat("link")}
                      className="p-1 hover:bg-slate-200 rounded text-slate-600 cursor-pointer"
                      title="Insert Link"
                    >
                      <LinkIcon className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <Textarea 
                  id="edit-desc-textarea"
                  value={editingAnnouncement.description}
                  onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, description: e.target.value })}
                  placeholder="Enter details. Use toolbar buttons above to format."
                  className="rounded-xl border-slate-200/80 focus:border-indigo-500 min-h-[120px]"
                />
              </div>

              {/* File Upload */}
              <div className="space-y-1">
                <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">File Attachment</Label>
                {editingAnnouncement.file && !selectedFile && (
                  <div className="text-xs bg-indigo-50/55 text-indigo-950 px-3 py-1.5 rounded-lg border border-indigo-100 flex items-center justify-between mb-2">
                    <span className="truncate max-w-[280px] font-medium">{editingAnnouncement.file.split("/").pop()}</span>
                    <button 
                      type="button" 
                      onClick={() => setEditingAnnouncement({ ...editingAnnouncement, file: "" })}
                      className="text-red-500 hover:text-red-700 font-bold ml-2 text-[10px] cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}

                <div className="relative border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-650 truncate max-w-[180px]">
                      {selectedFile ? selectedFile.name : "Upload new file..."}
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

              {/* Flagged */}
              <div className="flex items-center gap-2 py-1">
                <Checkbox 
                  id="edit-flagged"
                  checked={editingAnnouncement.flagged}
                  onCheckedChange={(checked) => setEditingAnnouncement({ ...editingAnnouncement, flagged: checked })}
                />
                <label 
                  htmlFor="edit-flagged"
                  className="text-xs font-bold text-slate-650 cursor-pointer select-none"
                >
                  Mark as Urgent (Flags in Feed)
                </label>
              </div>

              {/* Submit */}
              <div className="pt-2">
                {updating ? (
                  <Button disabled className="w-full bg-slate-900 text-white rounded-xl py-2.5">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                    Saving Changes...
                  </Button>
                ) : (
                  <Button onClick={handleUpdate} className="w-full bg-indigo-900 hover:bg-indigo-850 text-white font-semibold rounded-xl py-2.5 shadow-md shadow-indigo-900/10">
                    Save Changes
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AnnouncementsManager;
