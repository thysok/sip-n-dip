import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Eye, EyeOff, Upload, X, Link as LinkIcon } from "lucide-react";
import DonutSpinner from "../../components/ui/DonutSpinner";
import { cn } from "../../lib/utils";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGalleryPage,
});

function AdminGalleryPage() {
  const photos = useQuery(api.galleryPhotos.list);
  const createPhoto = useMutation(api.galleryPhotos.create);
  const updatePhoto = useMutation(api.galleryPhotos.update);
  const removePhoto = useMutation(api.galleryPhotos.remove);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [showAddModal, setShowAddModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [addCaption, setAddCaption] = useState("");
  const [addUrl, setAddUrl] = useState("");
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (photos === undefined) return <DonutSpinner className="mt-16" />;

  const visibleCount = photos.filter((p) => p.isVisible).length;

  const toggleVisibility = async (id: Id<"galleryPhotos">, current: boolean) => {
    await updatePhoto({ id, isVisible: !current });
  };

  const deletePhoto = async (id: Id<"galleryPhotos">) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    await removePhoto({ id });
  };

  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    setUploading(true);
    setUploadProgress({ current: 0, total: fileArray.length });

    let failed = 0;
    for (let i = 0; i < fileArray.length; i++) {
      setUploadProgress({ current: i + 1, total: fileArray.length });
      try {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": fileArray[i].type },
          body: fileArray[i],
        });
        if (!result.ok) {
          throw new Error(`Upload failed with status ${result.status}`);
        }
        const json = await result.json();

        const storageId = json.storageId;
        if (!storageId) {
          throw new Error("Upload returned no storageId");
        }

        await createPhoto({
          imageId: storageId,
          caption: fileArray.length === 1 ? (addCaption || undefined) : undefined,
          displayOrder: photos.length + i,
          isVisible: true,
        });
      } catch {
        failed++;
      }
    }

    if (failed > 0) {
      alert(`${failed} of ${fileArray.length} uploads failed.`);
    }

    setShowAddModal(false);
    setAddCaption("");
    setUploading(false);
    setUploadProgress({ current: 0, total: 0 });
  };

  const handleUrlAdd = async () => {
    if (!addUrl.trim()) return;
    setUploading(true);
    try {
      await createPhoto({
        imageUrl: addUrl.trim(),
        caption: addCaption || undefined,
        displayOrder: photos.length,
        isVisible: true,
      });
      setShowAddModal(false);
      setAddCaption("");
      setAddUrl("");
    } catch {
      alert("Failed to add photo. Please try again.");
    }
    setUploading(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="display-title text-2xl font-bold text-[var(--text-primary)]">
            Gallery Management
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {photos.length} photos · {visibleCount} visible
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => setShowAddModal(true)}
        >
          <Plus size={16} /> Add Photo
        </button>
      </div>

      {photos.length === 0 ? (
        <div className="card-shell flex flex-col items-center rounded-2xl py-16 text-center">
          <Upload size={48} className="mb-4 text-[var(--text-muted)]" />
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            No photos yet
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Upload photos to show them on the homepage slider and gallery page.
          </p>
          <button
            type="button"
            className="btn-primary mt-4"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} /> Add Your First Photo
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence>
            {photos.map((photo) => (
              <motion.div
                key={photo._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={cn(
                  "card-shell overflow-hidden rounded-xl",
                  !photo.isVisible && "opacity-50"
                )}
              >
                <div className="relative h-40">
                  {photo.url ? (
                    <img
                      src={photo.url}
                      alt={photo.caption ?? "Gallery photo"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50">
                      <span className="text-4xl">📸</span>
                    </div>
                  )}
                  {!photo.isVisible && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white">
                        Hidden
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate text-sm text-[var(--text-secondary)]">
                    {photo.caption || "No caption"}
                  </p>
                  <div className="mt-2 flex gap-1">
                    <button
                      type="button"
                      onClick={() => toggleVisibility(photo._id, photo.isVisible)}
                      className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-[var(--donut-pink-soft)]"
                      title={photo.isVisible ? "Hide" : "Show"}
                    >
                      {photo.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePhoto(photo._id)}
                      className="rounded-lg p-1.5 text-[var(--text-muted)] transition hover:bg-red-50 hover:text-red-500"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Photo Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              if (!uploading) {
                setShowAddModal(false);
                setAddCaption("");
                setAddUrl("");
              }
            }}
          >
            <motion.div
              className="card-shell w-full max-w-lg rounded-2xl p-6"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="display-title text-lg font-bold text-[var(--text-primary)]">
                  Add Photo
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    if (!uploading) {
                      setShowAddModal(false);
                      setAddCaption("");
                      setAddUrl("");
                    }
                  }}
                  className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--donut-pink-soft)]"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mode tabs */}
              <div className="mb-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setUploadMode("file")}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
                    uploadMode === "file"
                      ? "bg-[var(--donut-pink)] text-white"
                      : "bg-[var(--surface-strong)] text-[var(--text-muted)] border border-[var(--line)]"
                  )}
                >
                  <Upload size={14} /> Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode("url")}
                  className={cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition",
                    uploadMode === "url"
                      ? "bg-[var(--donut-pink)] text-white"
                      : "bg-[var(--surface-strong)] text-[var(--text-muted)] border border-[var(--line)]"
                  )}
                >
                  <LinkIcon size={14} /> Image URL
                </button>
              </div>

              <div className="space-y-4">
                {uploadMode === "file" ? (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      multiple
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0) handleFileUpload(files);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed border-[var(--line)] bg-[var(--surface-strong)] px-6 py-10 transition hover:border-[var(--donut-pink)] disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <div className="donut-spinner" />
                          {uploadProgress.total > 1 && (
                            <span className="text-sm font-medium text-[var(--text-muted)]">
                              Uploading {uploadProgress.current} of {uploadProgress.total}...
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          <Upload
                            size={32}
                            className="text-[var(--text-muted)]"
                          />
                          <span className="text-sm font-medium text-[var(--text-muted)]">
                            Click to choose images
                          </span>
                          <span className="text-xs text-[var(--text-muted)]">
                            JPG, PNG, WebP — select multiple files
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={addUrl}
                      onChange={(e) => setAddUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--donut-pink)]"
                    />
                    {addUrl && (
                      <div className="mt-3 overflow-hidden rounded-lg">
                        <img
                          src={addUrl}
                          alt="Preview"
                          className="h-32 w-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">
                    Caption (optional)
                  </label>
                  <input
                    type="text"
                    value={addCaption}
                    onChange={(e) => setAddCaption(e.target.value)}
                    placeholder="Fresh donuts coming out of the fryer..."
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--donut-pink)]"
                  />
                </div>

                {uploadMode === "url" && (
                  <button
                    type="button"
                    className="btn-primary w-full justify-center"
                    onClick={handleUrlAdd}
                    disabled={!addUrl.trim() || uploading}
                  >
                    {uploading ? "Adding..." : "Add Photo"}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
