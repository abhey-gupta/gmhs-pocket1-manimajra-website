// @ts-nocheck
"use client";

import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Compass, File, Plus, Trash2, Edit2, ArrowUp, ArrowDown, 
  Settings, Loader2, Save, FileText, Globe, RefreshCw, X, 
  Bold, Italic, Heading3, List, Link as LinkIcon, AlertCircle 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { toast } from "sonner";

const NavigationCustomizer = () => {
  const queryClient = useQueryClient();
  const [navData, setNavData] = useState([]);
  const [savingNav, setSavingNav] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isPageEditorOpen, setIsPageEditorOpen] = useState(false);
  const [isCreatePageOpen, setIsCreatePageOpen] = useState(false);
  const [newPageForm, setNewPageForm] = useState({ title: "", subtitle: "", slug: "" });
  const [creatingPage, setCreatingPage] = useState(false);
  const [selectedFile, setSelectedFile] = useState({}); // Stores file being uploaded for pdf section
  const [uploadingPdfIndex, setUploadingPdfIndex] = useState(null);

  // Fetch Navigation Configuration
  const { data: navigationRes, isLoading: isNavLoading } = useQuery({
    queryKey: ["admin_navigation"],
    queryFn: async () => {
      const { data } = await axios.get("/api/admin/navigation");
      if (!data.success) throw new Error(data.error);
      setNavData(JSON.parse(JSON.stringify(data.navigation))); // Deep copy for editing
      return data.navigation;
    }
  });

  // Fetch Created Custom Pages
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
        toast.success("Navigation bar saved successfully!");
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

  // Nav Management helpers
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
    const label = prompt("Enter new navigation category label (e.g. Facilities):");
    if (!label) return;
    const id = label.toLowerCase().replace(/[^a-z0-9]/g, "-");
    if (navData.some(g => g.id === id)) {
      toast.error("Category ID already exists");
      return;
    }
    setNavData([...navData, { id, label, items: [] }]);
  };

  const deleteNavGroup = (index) => {
    if (!confirm("Are you sure you want to delete this category and all its links?")) return;
    const updated = [...navData];
    updated.splice(index, 1);
    setNavData(updated);
  };

  const addNavItem = (groupIndex) => {
    const label = prompt("Enter menu option label (e.g. Physics Lab):");
    if (!label) return;
    const updated = [...navData];
    const id = label.toLowerCase().replace(/[^a-z0-9]/g, "-") + "-" + Date.now().toString().slice(-4);
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

  // Page Editor Logic
  const handleOpenPageEditor = async (slug) => {
    try {
      const { data } = await axios.get(`/api/admin/pages/${slug}`);
      if (data.success) {
        setSelectedPage({ ...data.page, slug });
        setIsPageEditorOpen(true);
      }
    } catch {
      toast.error("Failed to load page config");
    }
  };

  const handleSavePage = async () => {
    if (!selectedPage.title.trim()) {
      toast.error("Page title is required");
      return;
    }
    try {
      const { data } = await axios.post(`/api/admin/pages/${selectedPage.slug}`, selectedPage);
      if (data.success) {
        toast.success(`Page '${selectedPage.title}' saved successfully!`);
        queryClient.invalidateQueries({ queryKey: ["admin_pages_list"] });
        setIsPageEditorOpen(false);
      }
    } catch {
      toast.error("Failed to save page contents");
    }
  };

  const handleCreatePage = async () => {
    if (!newPageForm.title.trim() || !newPageForm.slug.trim()) {
      toast.error("Title and Slug are required");
      return;
    }
    const cleanSlug = newPageForm.slug.toLowerCase().replace(/[^a-z0-9-_]/g, "");
    setCreatingPage(true);
    try {
      const { data } = await axios.post(`/api/admin/pages/${cleanSlug}`, {
        title: newPageForm.title,
        subtitle: newPageForm.subtitle,
        sections: []
      });
      if (data.success) {
        toast.success("Dynamic page created successfully!");
        queryClient.invalidateQueries({ queryKey: ["admin_pages_list"] });
        setIsCreatePageOpen(false);
        setNewPageForm({ title: "", subtitle: "", slug: "" });
        // Open the editor immediately
        handleOpenPageEditor(cleanSlug);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to create page");
    } finally {
      setCreatingPage(false);
    }
  };

  const handleDeletePage = async (slug, title) => {
    if (!confirm(`Are you sure you want to delete the page '${title}'? This will permanently delete the page JSON file.`)) return;
    try {
      const { data } = await axios.delete(`/api/admin/pages/${slug}`);
      if (data.success) {
        toast.success("Page deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["admin_pages_list"] });
      }
    } catch {
      toast.error("Failed to delete page");
    }
  };

  // Section Builders inside Page Editor
  const addPageSection = (type) => {
    const newSection = { type, title: "" };
    if (type === "text") {
      newSection.content = "Enter markdown or html text block here.";
    } else if (type === "table") {
      newSection.headers = ["Header 1", "Header 2"];
      newSection.rows = [["Row 1 Cell 1", "Row 1 Cell 2"]];
    } else if (type === "pdf") {
      newSection.content = "PDF Description detail";
      newSection.value = "";
    }
    setSelectedPage({
      ...selectedPage,
      sections: [...(selectedPage.sections || []), newSection]
    });
  };

  const deletePageSection = (index) => {
    const updated = [...selectedPage.sections];
    updated.splice(index, 1);
    setSelectedPage({ ...selectedPage, sections: updated });
  };

  const movePageSection = (index, direction) => {
    const updated = [...selectedPage.sections];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setSelectedPage({ ...selectedPage, sections: updated });
  };

  // PDF Upload handler inside section editor
  const handlePdfUpload = async (secIndex) => {
    const file = selectedFile[secIndex];
    if (!file) {
      toast.error("Please choose a PDF file first");
      return;
    }
    setUploadingPdfIndex(secIndex);
    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folderName", "announcements");

      const { data } = await axios.post("/api/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      if (data.success) {
        toast.success("PDF uploaded successfully!");
        const updatedSections = [...selectedPage.sections];
        updatedSections[secIndex].value = data.location;
        setSelectedPage({ ...selectedPage, sections: updatedSections });
      } else {
        toast.error("Failed to upload PDF");
      }
    } catch {
      toast.error("Failed to upload PDF");
    } finally {
      setUploadingPdfIndex(null);
    }
  };

  // Section Table Editors
  const addColumn = (secIndex) => {
    const updatedSections = [...selectedPage.sections];
    const section = updatedSections[secIndex];
    const colName = prompt("Enter new column name:");
    if (!colName) return;
    section.headers.push(colName);
    section.rows = section.rows.map(row => [...row, ""]);
    setSelectedPage({ ...selectedPage, sections: updatedSections });
  };

  const deleteColumn = (secIndex, colIndex) => {
    if (!confirm("Are you sure you want to delete this column and all its values?")) return;
    const updatedSections = [...selectedPage.sections];
    const section = updatedSections[secIndex];
    section.headers.splice(colIndex, 1);
    section.rows = section.rows.map(row => {
      const newRow = [...row];
      newRow.splice(colIndex, 1);
      return newRow;
    });
    setSelectedPage({ ...selectedPage, sections: updatedSections });
  };

  const addTableRow = (secIndex) => {
    const updatedSections = [...selectedPage.sections];
    const section = updatedSections[secIndex];
    const emptyRow = section.headers.map(() => "");
    section.rows.push(emptyRow);
    setSelectedPage({ ...selectedPage, sections: updatedSections });
  };

  const deleteTableRow = (secIndex, rowIndex) => {
    const updatedSections = [...selectedPage.sections];
    updatedSections[secIndex].rows.splice(rowIndex, 1);
    setSelectedPage({ ...selectedPage, sections: updatedSections });
  };

  const handleCellChange = (secIndex, rowIndex, colIndex, value) => {
    const updatedSections = [...selectedPage.sections];
    updatedSections[secIndex].rows[rowIndex][colIndex] = value;
    setSelectedPage({ ...selectedPage, sections: updatedSections });
  };

  // Formatting helper for dynamic page builder text sections
  const insertTextFormat = (secIdx, tagType) => {
    const textarea = document.getElementById(`desc-textarea-${secIdx}`);
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

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    const updatedSections = [...selectedPage.sections];
    updatedSections[secIdx].content = newContent;
    
    setSelectedPage({
      ...selectedPage,
      sections: updatedSections
    });

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 55);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      
      {/* Left Column: Navigation Customizer (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>Customize Site Menus</span>
            </h3>
            <p className="text-slate-400 text-xs font-medium">Reorder options, bind pages, or set external URLs</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={addNavGroup}
              size="sm"
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 gap-1 rounded-xl text-xs font-bold"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Group</span>
            </Button>
            <Button
              onClick={handleSaveNavigation}
              disabled={savingNav}
              size="sm"
              className="bg-indigo-900 hover:bg-indigo-850 text-white gap-1 rounded-xl text-xs font-bold"
            >
              {savingNav ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Save Navigation</span>
            </Button>
          </div>
        </div>

        {isNavLoading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : (
          <div className="space-y-4">
            {navData.map((group, gIdx) => (
              <div 
                key={group.id} 
                className="border border-slate-200/70 rounded-2xl bg-white shadow-sm overflow-hidden p-5 space-y-4"
              >
                {/* Group header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-widest bg-amber-50 px-2 py-0.5 rounded">
                      Dropdown Menu
                    </span>
                    <input 
                      type="text" 
                      value={group.label}
                      onChange={(e) => {
                        const updated = [...navData];
                        updated[gIdx].label = e.target.value;
                        setNavData(updated);
                      }}
                      className="font-extrabold text-slate-800 text-sm border-b border-transparent hover:border-slate-200 focus:border-indigo-500 focus:outline-none px-1 py-0.5 max-w-[180px] bg-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => moveGroup(gIdx, "up")} 
                      disabled={gIdx === 0}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => moveGroup(gIdx, "down")} 
                      disabled={gIdx === navData.length - 1}
                      className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => deleteNavGroup(gIdx)}
                      className="p-1 hover:bg-red-50 rounded text-red-500 cursor-pointer"
                      title="Delete Group"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Group items (links) */}
                <div className="space-y-3">
                  {group.items?.length === 0 ? (
                    <p className="text-slate-450 italic text-[11px] py-1">No options inside this menu yet.</p>
                  ) : (
                    group.items?.map((item, iIdx) => (
                      <div 
                        key={item.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl border border-slate-100 bg-slate-50/50"
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
                            className="font-bold text-slate-700 text-xs border-b border-transparent hover:border-slate-300 focus:border-indigo-500 focus:outline-none px-1 bg-transparent max-w-[130px] sm:max-w-none shrink-0"
                          />
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button 
                              onClick={() => moveNavItem(gIdx, iIdx, "up")}
                              disabled={iIdx === 0}
                              className="p-0.5 hover:bg-slate-200 rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button 
                              onClick={() => moveNavItem(gIdx, iIdx, "down")}
                              disabled={iIdx === group.items.length - 1}
                              className="p-0.5 hover:bg-slate-200 rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Option binding values */}
                        <div className="flex items-center gap-2 shrink-0">
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
                            <SelectTrigger className="w-[110px] h-8 text-[11px] rounded-lg">
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
                              <SelectTrigger className="w-[130px] h-8 text-[11px] rounded-lg">
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
                              className="w-[130px] h-8 text-xs rounded-lg border-slate-200"
                            />
                          )}

                          {/* Delete Item */}
                          <button 
                            onClick={() => deleteNavItem(gIdx, iIdx)}
                            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg shrink-0 cursor-pointer"
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
                    className="w-full border border-dashed border-slate-200 hover:border-slate-350 hover:bg-slate-50 text-[11px] text-slate-500 font-bold py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Option
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right Column: Pages List CMS (5 cols) */}
      <div className="lg:col-span-5 space-y-6 border-l lg:pl-8 border-slate-100">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-1.5">
              <File className="w-5 h-5 text-amber-600" />
              <span>Custom Page Library</span>
            </h3>
            <p className="text-slate-400 text-xs font-medium">Build rich dynamic pages with tables and text</p>
          </div>
          <Button
            onClick={() => setIsCreatePageOpen(true)}
            size="sm"
            className="bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold gap-1 rounded-xl text-xs shadow-sm shadow-amber-500/15"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Page</span>
          </Button>
        </div>

        {isPagesLoading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : pagesRes?.pages?.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
            <File className="w-8 h-8 text-slate-350 mx-auto mb-2 opacity-30" />
            <p className="text-slate-500 font-bold text-xs">No custom pages made yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pagesRes?.pages?.map((page) => (
              <div 
                key={page.slug}
                className="p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-200 shadow-sm flex items-center justify-between gap-3"
              >
                <div className="space-y-1 text-left min-w-0">
                  <h4 className="font-extrabold text-slate-800 text-xs truncate">{page.title}</h4>
                  <p className="text-slate-450 text-[10px] font-semibold tracking-wider uppercase truncate">
                    Slug: {page.slug}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <Button
                    onClick={() => handleOpenPageEditor(page.slug)}
                    size="sm"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 h-8 rounded-lg text-[10px] font-bold"
                  >
                    <span>Edit Content</span>
                  </Button>
                  
                  {/* Prevent deleting default system pages unless strictly intended */}
                  {["school-uniform", "infrastructure", "affiliation-status", "mandatory-public-disclosure"].includes(page.slug) ? null : (
                    <button 
                      onClick={() => handleDeletePage(page.slug, page.title)}
                      className="p-2 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                      title="Delete Page"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialog: Create Dynamic Page */}
      <Dialog open={isCreatePageOpen} onOpenChange={setIsCreatePageOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl p-6 bg-white text-left">
          <DialogHeader className="border-b border-slate-100 pb-3">
            <DialogTitle className="text-lg font-extrabold text-slate-900">Create Dynamic Page</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Title</Label>
              <Input 
                value={newPageForm.title}
                onChange={(e) => setNewPageForm({ ...newPageForm, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-") })}
                placeholder="e.g. Chemistry Laboratory"
                className="rounded-xl border-slate-200"
              />
            </div>
            
            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Subtitle (Tagline)</Label>
              <Input 
                value={newPageForm.subtitle}
                onChange={(e) => setNewPageForm({ ...newPageForm, subtitle: e.target.value })}
                placeholder="e.g. Infrastructure Specifications"
                className="rounded-xl border-slate-200"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">URL Slug (Auto Generated)</Label>
              <Input 
                value={newPageForm.slug}
                onChange={(e) => setNewPageForm({ ...newPageForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "") })}
                placeholder="chemistry-laboratory"
                className="rounded-xl border-slate-200 font-mono text-xs"
              />
              <span className="text-[10px] text-slate-450 block">This defines the dynamic route: /p/{newPageForm.slug || "slug"}</span>
            </div>

            <div className="pt-2">
              {creatingPage ? (
                <Button disabled className="w-full bg-slate-950 text-white py-2.5 rounded-xl">
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating Page...
                </Button>
              ) : (
                <Button onClick={handleCreatePage} className="w-full bg-amber-600 hover:bg-amber-500 text-slate-950 font-extrabold py-2.5 rounded-xl shadow">
                  Create Page File
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: Edit Content Full Dynamic Page Builder */}
      {selectedPage && (
        <Dialog open={isPageEditorOpen} onOpenChange={setIsPageEditorOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 sm:p-8 bg-white text-left">
            <DialogHeader className="border-b border-slate-100 pb-4 mb-6 flex flex-row items-center justify-between">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest">Page builder</span>
                <DialogTitle className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-0.5">
                  Edit Page: {selectedPage.title}
                </DialogTitle>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleSavePage}
                  size="sm"
                  className="bg-indigo-900 hover:bg-indigo-850 text-white gap-1 rounded-xl text-xs font-bold"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Page</span>
                </Button>
                <Button
                  onClick={() => setIsPageEditorOpen(false)}
                  variant="outline"
                  size="sm"
                  className="rounded-xl text-xs font-bold h-9 cursor-pointer"
                >
                  Cancel
                </Button>
              </div>
            </DialogHeader>

            <div className="space-y-6">
              
              {/* Header Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Header Title</Label>
                  <Input 
                    value={selectedPage.title}
                    onChange={(e) => setSelectedPage({ ...selectedPage, title: e.target.value })}
                    className="rounded-xl border-slate-200"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Page Tagline/Subtitle</Label>
                  <Input 
                    value={selectedPage.subtitle || ""}
                    onChange={(e) => setSelectedPage({ ...selectedPage, subtitle: e.target.value })}
                    className="rounded-xl border-slate-200"
                  />
                </div>
              </div>

              {/* Sections Listing */}
              <div className="space-y-6 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">Page Sections & Content Blocks</h4>
                  <div className="flex items-center gap-1.5">
                    <Button 
                      onClick={() => addPageSection("text")}
                      size="sm"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                    >
                      + Text Block
                    </Button>
                    <Button 
                      onClick={() => addPageSection("table")}
                      size="sm"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                    >
                      + Table Grid
                    </Button>
                    <Button 
                      onClick={() => addPageSection("pdf")}
                      size="sm"
                      className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-bold"
                    >
                      + PDF Viewer
                    </Button>
                  </div>
                </div>

                {selectedPage.sections?.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <AlertCircle className="w-8 h-8 text-slate-350 mx-auto mb-2 opacity-30" />
                    <p className="text-slate-450 text-xs font-semibold">No content sections. Click buttons above to add.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {selectedPage.sections?.map((section, sIdx) => (
                      <div 
                        key={sIdx}
                        className="border border-slate-200 rounded-2xl p-5 bg-slate-50/20 relative space-y-4 text-left"
                      >
                        {/* Section Header */}
                        <div className="flex items-center justify-between border-b border-slate-150/70 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-extrabold uppercase bg-slate-900 text-white px-2 py-0.5 rounded">
                              {section.type === "pdf" ? "PDF Section" : section.type === "table" ? "Table Section" : "Text Block"}
                            </span>
                            <input 
                              type="text" 
                              value={section.title || ""}
                              placeholder="Section Heading (e.g. Room Inventory)"
                              onChange={(e) => {
                                const updated = [...selectedPage.sections];
                                updated[sIdx].title = e.target.value;
                                setSelectedPage({ ...selectedPage, sections: updated });
                              }}
                              className="text-xs font-bold text-slate-800 border-b border-transparent hover:border-slate-350 focus:border-indigo-500 focus:outline-none px-1 bg-transparent w-[240px] md:w-[350px]"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => movePageSection(sIdx, "up")}
                              disabled={sIdx === 0}
                              className="p-1 hover:bg-slate-250 rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => movePageSection(sIdx, "down")}
                              disabled={sIdx === selectedPage.sections.length - 1}
                              className="p-1 hover:bg-slate-250 rounded text-slate-400 disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deletePageSection(sIdx)}
                              className="p-1 hover:bg-red-50 rounded text-red-500 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Section Contents based on type */}

                        {/* TEXT BLOCK TYPE */}
                        {section.type === "text" && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Markdown text content</Label>
                              {/* Formatting toolbar */}
                              <div className="flex gap-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                                <button 
                                  type="button" 
                                  onClick={() => insertTextFormat(sIdx, "bold")}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-650 cursor-pointer"
                                  title="Bold"
                                >
                                  <Bold className="w-3 h-3" />
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => insertTextFormat(sIdx, "italic")}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-650 cursor-pointer"
                                  title="Italic"
                                >
                                  <Italic className="w-3 h-3" />
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => insertTextFormat(sIdx, "heading")}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-650 cursor-pointer"
                                  title="Heading"
                                >
                                  <Heading3 className="w-3 h-3" />
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => insertTextFormat(sIdx, "list")}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-650 cursor-pointer"
                                  title="List"
                                >
                                  <List className="w-3 h-3" />
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => insertTextFormat(sIdx, "link")}
                                  className="p-1 hover:bg-slate-200 rounded text-slate-650 cursor-pointer"
                                  title="Link"
                                >
                                  <LinkIcon className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                            <Textarea 
                              id={`desc-textarea-${sIdx}`}
                              value={section.content}
                              onChange={(e) => {
                                const updated = [...selectedPage.sections];
                                updated[sIdx].content = e.target.value;
                                setSelectedPage({ ...selectedPage, sections: updated });
                              }}
                              placeholder="Write information details here. Formatting supported."
                              className="bg-white rounded-xl min-h-[100px] border-slate-200 text-xs focus:ring-amber-500"
                            />
                          </div>
                        )}

                        {/* PDF EMBED TYPE */}
                        {section.type === "pdf" && (
                          <div className="space-y-4">
                            <div className="space-y-1">
                              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Description Content</Label>
                              <Input 
                                value={section.content || ""}
                                onChange={(e) => {
                                  const updated = [...selectedPage.sections];
                                  updated[sIdx].content = e.target.value;
                                  setSelectedPage({ ...selectedPage, sections: updated });
                                }}
                                placeholder="Details about this certificate"
                                className="bg-white text-xs h-9"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">PDF File Source</Label>
                              {section.value && (
                                <div className="text-xs bg-indigo-50/50 text-indigo-900 border border-indigo-100 p-2.5 rounded-xl flex items-center justify-between mb-2">
                                  <span className="truncate max-w-[280px] font-medium">{section.value.split("/").pop()}</span>
                                  <a href={section.value} target="_blank" className="text-indigo-650 hover:underline font-bold">View PDF</a>
                                </div>
                              )}
                              
                              <div className="flex gap-2 items-center">
                                <div className="relative border border-dashed border-slate-200 rounded-xl p-2 bg-white flex items-center justify-between gap-3 flex-grow h-9">
                                  <span className="text-xs text-slate-400 truncate max-w-[200px]">
                                    {selectedFile[sIdx] ? selectedFile[sIdx].name : "Upload new PDF file..."}
                                  </span>
                                  <label className="cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-200 font-bold px-2 py-1 rounded text-[10px] text-slate-650 shadow-sm shrink-0">
                                    Choose PDF
                                    <input 
                                      type="file" 
                                      accept="application/pdf"
                                      className="hidden" 
                                      onChange={(e) => setSelectedFile({ ...selectedFile, [sIdx]: e.target.files[0] })} 
                                    />
                                  </label>
                                </div>
                                <Button
                                  onClick={() => handlePdfUpload(sIdx)}
                                  disabled={uploadingPdfIndex === sIdx}
                                  size="sm"
                                  className="bg-slate-900 text-white rounded-xl h-9 text-xs font-semibold shrink-0"
                                >
                                  {uploadingPdfIndex === sIdx ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : (
                                    <span>Upload & Link</span>
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* TABLE GRID TYPE */}
                        {section.type === "table" && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dynamic Table Grid</Label>
                              <div className="flex items-center gap-1.5">
                                <Button 
                                  onClick={() => addColumn(sIdx)}
                                  size="sm"
                                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-semibold h-7"
                                >
                                  + Column
                                </Button>
                                <Button 
                                  onClick={() => addTableRow(sIdx)}
                                  size="sm"
                                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-semibold h-7"
                                >
                                  + Row
                                </Button>
                              </div>
                            </div>

                            {/* Table structure editor */}
                            <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white">
                              <table className="w-full text-xs text-left">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                  <tr>
                                    {section.headers?.map((header, hIdx) => (
                                      <th key={hIdx} className="p-3 text-slate-700 font-extrabold relative group/th">
                                        <div className="flex items-center gap-1">
                                          <input 
                                            type="text" 
                                            value={header}
                                            onChange={(e) => {
                                              const updated = [...selectedPage.sections];
                                              updated[sIdx].headers[hIdx] = e.target.value;
                                              setSelectedPage({ ...selectedPage, sections: updated });
                                            }}
                                            className="font-bold border-b border-transparent hover:border-slate-350 focus:border-indigo-500 focus:outline-none bg-transparent w-[90px]"
                                          />
                                          <button 
                                            onClick={() => deleteColumn(sIdx, hIdx)}
                                            className="text-red-500 hover:text-red-700 opacity-0 group-hover/th:opacity-100 transition-opacity ml-1 cursor-pointer"
                                            title="Delete Column"
                                          >
                                            <X className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </th>
                                    ))}
                                    <th className="p-3 w-12 text-center text-slate-400">Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {section.rows?.map((row, rIdx) => (
                                    <tr key={rIdx} className="border-b border-slate-100 last:border-0">
                                      {row.map((cell, cIdx) => (
                                        <td key={cIdx} className="p-2">
                                          <Input 
                                            value={cell}
                                            onChange={(e) => handleCellChange(sIdx, rIdx, cIdx, e.target.value)}
                                            className="h-8 text-xs border-slate-100 hover:border-slate-200 focus:border-indigo-500 bg-white"
                                          />
                                        </td>
                                      ))}
                                      <td className="p-2 text-center">
                                        <button 
                                          onClick={() => deleteTableRow(sIdx, rIdx)}
                                          className="p-1 hover:bg-red-50 text-red-500 rounded-lg cursor-pointer"
                                          title="Delete Row"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
};

export default NavigationCustomizer;
