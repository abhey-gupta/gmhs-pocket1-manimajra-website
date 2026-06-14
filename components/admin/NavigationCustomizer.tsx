// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Compass, Plus, Trash2, ArrowUp, ArrowDown, 
  Save, Loader2, Link as LinkIcon, RefreshCw, Upload
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { toast } from "sonner";

const CATEGORY_LABELS = {
  "cbse": "CBSE",
  "school-info": "School Info",
  "committees": "Committees",
  "results": "Results",
  "achievements": "Achievements"
};

const NavigationCustomizer = () => {
  const queryClient = useQueryClient();
  const [navData, setNavData] = useState([]);
  const [savingNav, setSavingNav] = useState(false);
  const [selectedFile, setSelectedFile] = useState({});
  const [uploadingGroupIndex, setUploadingGroupIndex] = useState(null);

  // Fetch Navigation Configuration
  const { data: navigationRes, isLoading: isNavLoading } = useQuery({
    queryKey: ["admin_navigation"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/navigation");
      if (!data.success) throw new Error(data.error);
      // Ensure all groups have a type (defaulting to dropdown)
      const sanitized = data.navigation.map(group => ({
        ...group,
        type: group.type || (group.items ? "dropdown" : "url"),
        value: group.value || ""
      }));
      setNavData(JSON.parse(JSON.stringify(sanitized))); // Deep copy
      return sanitized;
    }
  });

  // Fetch Custom Pages for binding selectors
  const { data: pagesRes, isLoading: isPagesLoading } = useQuery({
    queryKey: ["admin_pages_list"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/pages");
      if (!data.success) throw new Error(data.error);
      return data.pages;
    }
  });

  const handleSaveNavigation = async () => {
    setSavingNav(true);
    try {
      const { data } = await axios.post("/api/admin/navigation", { navigation: navData });
      if (data.success) {
        toast.success("Navigation bar configuration saved successfully!");
        queryClient.invalidateQueries({ queryKey: ["navigation"] });
        queryClient.invalidateQueries({ queryKey: ["admin_navigation"] });
      } else {
        toast.error(data.error || "Failed to save navigation");
      }
    } catch (err) {
      toast.error("An error occurred while saving navigation bar");
    } finally {
      setSavingNav(false);
    }
  };

  const moveGroup = (index, direction) => {
    const updated = [...navData];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setNavData(updated);
  };

  const addNavGroup = () => {
    const label = prompt("Enter new menu item name (e.g. Facilities or About Us):");
    if (!label) return;
    const id = label.toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (navData.some(g => g.id === id)) {
      toast.error("Menu item ID already exists");
      return;
    }
    setNavData([...navData, { id, label, type: "dropdown", items: [], value: "" }]);
  };

  const deleteNavGroup = (index) => {
    if (!confirm("Are you sure you want to delete this menu item and all its sub-links?")) return;
    const updated = [...navData];
    updated.splice(index, 1);
    setNavData(updated);
  };

  const addNavItem = (groupIndex) => {
    const label = prompt("Enter dropdown option label (e.g. Physics Lab):");
    if (!label) return;
    const updated = [...navData];
    const id = label.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4);
    if (!updated[groupIndex].items) updated[groupIndex].items = [];
    updated[groupIndex].items.push({
      id,
      label,
      type: "url",
      value: "/#home"
    });
    setNavData(updated);
  };

  const deleteNavItem = (groupIndex, itemIndex) => {
    const updated = [...navData];
    updated[groupIndex].items.splice(itemIndex, 1);
    setNavData(updated);
  };

  const moveNavItem = (groupIndex, itemIndex, direction) => {
    const updated = [...navData];
    const items = updated[groupIndex].items;
    const targetIndex = direction === "up" ? itemIndex - 1 : itemIndex + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const temp = items[itemIndex];
    items[itemIndex] = items[targetIndex];
    items[targetIndex] = temp;
    setNavData(updated);
  };

  // Group PDF Upload helper (for direct PDF menu links)
  const handleGroupPdfUpload = async (gIdx) => {
    const file = selectedFile[gIdx];
    if (!file) {
      toast.error("Please choose a PDF file first");
      return;
    }
    setUploadingGroupIndex(gIdx);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folderName", "announcements");

      const { data } = await axios.post("/api/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (data.success) {
        toast.success("PDF uploaded successfully!");
        const updated = [...navData];
        updated[gIdx].value = data.location;
        setNavData(updated);
      } else {
        toast.error("Failed to upload PDF");
      }
    } catch {
      toast.error("Failed to upload PDF");
    } finally {
      setUploadingGroupIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <Compass className="w-5.5 h-5.5 text-indigo-700" />
            <span>Navigation Bar Customizer</span>
          </h3>
          <p className="text-slate-500 text-xs md:text-sm font-medium">
            Configure dynamic dropdown panels or direct navigation links across the main website header.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          <Button
            onClick={addNavGroup}
            size="sm"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 gap-1 rounded-xl text-xs font-bold h-9 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Menu Group</span>
          </Button>
          <Button
            onClick={handleSaveNavigation}
            disabled={savingNav}
            size="sm"
            className="bg-indigo-900 hover:bg-indigo-850 text-white gap-1 rounded-xl text-xs font-extrabold h-9 cursor-pointer shadow-md shadow-indigo-950/15"
          >
            {savingNav ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Configuration</span>
          </Button>
        </div>
      </div>

      {isNavLoading ? (
        <div className="py-20 flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 max-w-4xl">
          {navData.map((group, gIdx) => (
            <div 
              key={group.id} 
              className="border border-slate-200 rounded-3xl bg-white shadow-sm overflow-hidden p-6 space-y-4"
            >
              {/* Menu group title and config bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-md shrink-0">
                    Menu Group
                  </span>
                  <input 
                    type="text" 
                    value={group.label}
                    onChange={(e) => {
                      const updated = [...navData];
                      updated[gIdx].label = e.target.value;
                      setNavData(updated);
                    }}
                    className="font-extrabold text-slate-800 text-base border-b border-transparent hover:border-slate-350 focus:border-indigo-650 focus:outline-none px-1.5 py-0.5 bg-transparent"
                  />
                </div>

                <div className="flex items-center gap-2">
                  {/* Group Type Selector */}
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Type:</span>
                    <Select
                      value={group.type || "dropdown"}
                      onValueChange={(val) => {
                        const updated = [...navData];
                        updated[gIdx].type = val;
                        if (val !== "dropdown") {
                          updated[gIdx].value = "";
                        } else if (!updated[gIdx].items) {
                          updated[gIdx].items = [];
                        }
                        setNavData(updated);
                      }}
                    >
                      <SelectTrigger className="w-[140px] h-8 text-[11px] rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="glass-panel">
                        <SelectItem value="dropdown">Dropdown Menu</SelectItem>
                        <SelectItem value="page">Direct Page Link</SelectItem>
                        <SelectItem value="url">Direct URL Link</SelectItem>
                        <SelectItem value="pdf">Direct PDF Link</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1 border-l border-slate-150 pl-2">
                    <button 
                      onClick={() => moveGroup(gIdx, "up")} 
                      disabled={gIdx === 0}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 disabled:opacity-30 cursor-pointer"
                      title="Move Group Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => moveGroup(gIdx, "down")} 
                      disabled={gIdx === navData.length - 1}
                      className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 disabled:opacity-30 cursor-pointer"
                      title="Move Group Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteNavGroup(gIdx)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-red-550 cursor-pointer border-0"
                      title="Delete Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Display based on Group Type */}
              {group.type !== "dropdown" ? (
                // Direct Link configurations
                <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 text-left space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Direct Link Target
                  </span>
                  
                  <div className="flex items-center gap-3 max-w-xl">
                    {group.type === "page" ? (
                      <Select
                        value={group.value}
                        onValueChange={(val) => {
                          const updated = [...navData];
                          updated[gIdx].value = val;
                          setNavData(updated);
                        }}
                      >
                        <SelectTrigger className="w-full h-10 text-xs rounded-xl bg-white border-slate-200">
                          <SelectValue placeholder="Select Custom Page" />
                        </SelectTrigger>
                        <SelectContent className="glass-panel">
                          {pagesRes?.pages?.map((p) => (
                            <SelectItem key={p.slug} value={p.slug}>{p.title}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : group.type === "pdf" ? (
                      <div className="flex flex-col gap-2 w-full">
                        {group.value && (
                          <div className="text-xs bg-indigo-50/60 text-indigo-950 px-3.5 py-2 rounded-xl border border-indigo-100 flex items-center justify-between mb-1">
                            <span className="truncate max-w-[280px] font-medium">{group.value.split("/").pop()}</span>
                            <a href={group.value} target="_blank" className="text-indigo-650 hover:underline font-bold">View PDF</a>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <div className="relative border border-dashed border-slate-250 bg-white rounded-xl p-2 flex items-center justify-between gap-3 flex-grow h-10">
                            <span className="text-xs text-slate-400 truncate max-w-[200px]">
                              {selectedFile[gIdx] ? selectedFile[gIdx].name : "Upload direct PDF..."}
                            </span>
                            <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 font-bold px-2 py-1 rounded-lg text-[10px] text-slate-700 shadow-sm shrink-0">
                              Choose PDF
                              <input 
                                type="file" 
                                accept="application/pdf"
                                className="hidden" 
                                onChange={(e) => setSelectedFile({ ...selectedFile, [gIdx]: e.target.files[0] })} 
                              />
                            </label>
                          </div>
                          <Button
                            onClick={() => handleGroupPdfUpload(gIdx)}
                            disabled={uploadingGroupIndex === gIdx}
                            size="sm"
                            className="bg-slate-900 text-white rounded-xl h-10 text-xs font-semibold shrink-0 cursor-pointer"
                          >
                            {uploadingGroupIndex === gIdx ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <span>Upload & Link</span>
                            )}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Input 
                        value={group.value}
                        onChange={(e) => {
                          const updated = [...navData];
                          updated[gIdx].value = e.target.value;
                          setNavData(updated);
                        }}
                        placeholder="e.g. /#contact or https://external-link.com"
                        className="w-full h-10 text-xs rounded-xl border-slate-200 bg-white"
                      />
                    )}
                  </div>
                </div>
              ) : (
                // Dropdown items list
                <div className="space-y-3">
                  {group.items?.length === 0 ? (
                    <p className="text-slate-400 italic text-[11px] py-1 text-center bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                      No dropdown sub-links configured. Click the button below to add.
                    </p>
                  ) : (
                    group.items?.map((item, iIdx) => (
                      <div 
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Option label & reorder */}
                        <div className="flex items-center gap-2 flex-grow">
                          <input 
                            type="text" 
                            value={item.label}
                            onChange={(e) => {
                              const updated = [...navData];
                              updated[gIdx].items[iIdx].label = e.target.value;
                              setNavData(updated);
                            }}
                            className="font-bold text-slate-700 text-xs border-b border-transparent hover:border-slate-350 focus:border-indigo-650 focus:outline-none px-1.5 py-0.5 bg-transparent max-w-[130px] sm:max-w-none shrink-0"
                          />
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button 
                              onClick={() => moveNavItem(gIdx, iIdx, "up")}
                              disabled={iIdx === 0}
                              className="p-0.5 hover:bg-slate-250 rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => moveNavItem(gIdx, iIdx, "down")}
                              disabled={iIdx === group.items.length - 1}
                              className="p-0.5 hover:bg-slate-250 rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Option binding values */}
                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                          {/* Type Select */}
                          <Select
                            value={item.type}
                            onValueChange={(val) => {
                              const updated = [...navData];
                              updated[gIdx].items[iIdx].type = val;
                              updated[gIdx].items[iIdx].value = val === "page" ? "" : "/#home";
                              setNavData(updated);
                            }}
                          >
                            <SelectTrigger className="w-[105px] h-8 text-[11px] rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="glass-panel">
                              <SelectItem value="url">Web URL</SelectItem>
                              <SelectItem value="page">Custom Page</SelectItem>
                              <SelectItem value="pdf">PDF Link</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Link Value */}
                          {item.type === "page" ? (
                            <Select
                              value={item.value}
                              onValueChange={(val) => {
                                const updated = [...navData];
                                updated[gIdx].items[iIdx].value = val;
                                setNavData(updated);
                              }}
                            >
                              <SelectTrigger className="w-[125px] h-8 text-[11px] rounded-lg bg-white border-slate-200">
                                <SelectValue placeholder="Select Page" />
                              </SelectTrigger>
                              <SelectContent className="glass-panel">
                                {pagesRes?.pages?.map((p) => (
                                  <SelectItem key={p.slug} value={p.slug}>{p.title}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input 
                              value={item.value}
                              onChange={(e) => {
                                const updated = [...navData];
                                updated[gIdx].items[iIdx].value = e.target.value;
                                setNavData(updated);
                              }}
                              placeholder={item.type === "pdf" ? "PDF URL" : "e.g. /#contact"}
                              className="w-[125px] h-8 text-xs rounded-lg border-slate-200 bg-white"
                            />
                          )}

                          {/* Delete Item */}
                          <button 
                            onClick={() => deleteNavItem(gIdx, iIdx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0 cursor-pointer border-0"
                            title="Delete Option"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}

                  <button 
                    onClick={() => addNavItem(gIdx)}
                    className="w-full border border-dashed border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-[11px] text-slate-500 font-bold py-2.5 rounded-2xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Dropdown Sub-Link
                  </button>
                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NavigationCustomizer;
