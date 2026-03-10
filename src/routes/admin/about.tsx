import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Save, Plus, Trash2, Pencil, X, ImagePlus } from "lucide-react";
import DonutSpinner from "../../components/ui/DonutSpinner";

export const Route = createFileRoute("/admin/about")({
  component: AdminAboutPage,
});

type EditingMember = {
  _id?: Id<"teamMembers">;
  name: string;
  role: string;
  bio: string;
  displayOrder: number;
  photoId?: Id<"_storage">;
  photoUrl?: string | null;
};

function AdminAboutPage() {
  const settings = useQuery(api.shopSettings.getAll);
  const teamMembers = useQuery(api.teamMembers.list);
  const setSetting = useMutation(api.shopSettings.set);
  const createMember = useMutation(api.teamMembers.create);
  const updateMember = useMutation(api.teamMembers.update);
  const removeMember = useMutation(api.teamMembers.remove);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [aboutContent, setAboutContent] = useState("");
  const [editingMember, setEditingMember] = useState<EditingMember | null>(null);
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings?.aboutContent && !aboutContent) {
      setAboutContent(settings.aboutContent);
    }
  }, [settings?.aboutContent]);

  if (settings === undefined || teamMembers === undefined) {
    return <DonutSpinner className="mt-16" />;
  }

  const saveAboutContent = async () => {
    await setSetting({ key: "aboutContent", value: aboutContent });
    setSaved(true);
  };

  const handlePhotoUpload = async (file: File) => {
    setUploadingPhoto(true);
    try {
      const url = await generateUploadUrl();
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      setEditingMember((prev) =>
        prev ? { ...prev, photoId: storageId, photoUrl: URL.createObjectURL(file) } : null
      );
    } catch (err) {
      console.error("Photo upload error:", err);
    }
    setUploadingPhoto(false);
  };

  const saveMember = async (member: EditingMember) => {
    if (member._id) {
      await updateMember({
        id: member._id,
        name: member.name,
        role: member.role,
        bio: member.bio,
        displayOrder: member.displayOrder,
        ...(member.photoId ? { photoId: member.photoId } : {}),
      });
    } else {
      await createMember({
        name: member.name,
        role: member.role,
        bio: member.bio,
        displayOrder: member.displayOrder,
        ...(member.photoId ? { photoId: member.photoId } : {}),
      });
    }
    setEditingMember(null);
  };

  return (
    <div>
      <h1 className="display-title mb-2 text-2xl font-bold text-[var(--text-primary)]">
        About Page Management
      </h1>
      <p className="mb-8 text-sm text-[var(--text-muted)]">
        Edit the shop story and team member profiles.
      </p>

      {/* About Content */}
      <div className="card-shell mb-8 rounded-2xl p-6">
        <h2 className="mb-4 font-bold text-[var(--text-primary)]">
          Shop Story
        </h2>
        <textarea
          rows={10}
          value={aboutContent}
          onChange={(e) => {
            setAboutContent(e.target.value);
            setSaved(false);
          }}
          className="w-full resize-y rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--donut-pink)]"
        />
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={saveAboutContent}
        >
          <Save size={16} /> {saved ? "Saved!" : "Save Content"}
        </button>
      </div>

      {/* Team Members */}
      <div className="card-shell rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-[var(--text-primary)]">
            Team Members
          </h2>
          <button
            type="button"
            className="btn-secondary text-sm"
            onClick={() =>
              setEditingMember({
                name: "",
                role: "",
                bio: "",
                displayOrder: teamMembers.length,
              })
            }
          >
            <Plus size={14} /> Add Member
          </button>
        </div>

        <div className="space-y-3">
          {teamMembers.map((member) => (
            <div
              key={member._id}
              className="flex items-center gap-4 rounded-xl border border-[var(--line)] p-4"
            >
              {member.photoUrl ? (
                <img
                  src={member.photoUrl}
                  alt={member.name}
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="text-3xl">👤</span>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[var(--text-primary)]">
                  {member.name}
                </p>
                <p className="text-xs text-[var(--donut-pink)]">
                  {member.role}
                </p>
                <p className="mt-1 truncate text-xs text-[var(--text-muted)]">
                  {member.bio}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  type="button"
                  onClick={() =>
                    setEditingMember({
                      _id: member._id,
                      name: member.name,
                      role: member.role,
                      bio: member.bio,
                      displayOrder: member.displayOrder,
                      photoId: member.photoId,
                      photoUrl: member.photoUrl,
                    })
                  }
                  className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-[var(--donut-pink-soft)]"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => removeMember({ id: member._id })}
                  className="rounded-lg p-2 text-[var(--text-muted)] hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Member Modal */}
      {editingMember && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setEditingMember(null)}
        >
          <motion.div
            className="card-shell w-full max-w-lg rounded-2xl p-6"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="display-title text-lg font-bold">
                {editingMember._id ? "Edit Member" : "Add Member"}
              </h2>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="rounded-lg p-1 text-[var(--text-muted)]"
              >
                <X size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                saveMember(editingMember);
              }}
              className="space-y-4"
            >
              {/* Photo Upload */}
              <div className="flex items-center gap-4">
                {editingMember.photoUrl ? (
                  <img
                    src={editingMember.photoUrl}
                    alt="Preview"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface-strong)] text-3xl">
                    👤
                  </div>
                )}
                <div>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="btn-secondary text-sm"
                  >
                    <ImagePlus size={14} />
                    {uploadingPhoto ? "Uploading..." : editingMember.photoUrl ? "Change Photo" : "Upload Photo"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.name}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm outline-none focus:border-[var(--donut-pink)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">
                    Role
                  </label>
                  <input
                    type="text"
                    required
                    value={editingMember.role}
                    onChange={(e) =>
                      setEditingMember({ ...editingMember, role: e.target.value })
                    }
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm outline-none focus:border-[var(--donut-pink)]"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">
                  Bio
                </label>
                <textarea
                  required
                  rows={3}
                  value={editingMember.bio}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, bio: e.target.value })
                  }
                  className="w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm outline-none focus:border-[var(--donut-pink)]"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 justify-center">
                  Save
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingMember(null)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
