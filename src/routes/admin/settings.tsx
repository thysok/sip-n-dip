import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState, useEffect, useRef } from "react";
import { Save, ImagePlus } from "lucide-react";
import DonutSpinner from "../../components/ui/DonutSpinner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const settings = useQuery(api.shopSettings.getAll);
  const setSetting = useMutation(api.shopSettings.set);
  const contactPhotoUrl = useQuery(api.shopSettings.getImageUrl, { key: "contactPhotoId" });
  const aboutPhotoUrl = useQuery(api.shopSettings.getImageUrl, { key: "aboutPhotoId" });
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [form, setForm] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState<string | false>(false);
  const contactPhotoInputRef = useRef<HTMLInputElement>(null);
  const aboutPhotoInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = async (file: File, settingKey: string) => {
    setUploadingPhoto(settingKey);
    try {
      const url = await generateUploadUrl();
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      await setSetting({ key: settingKey, value: storageId });
    } catch (err) {
      console.error("Photo upload error:", err);
    }
    setUploadingPhoto(false);
  };

  useEffect(() => {
    if (settings && Object.keys(form).length === 0) {
      const hours = settings.hours ? JSON.parse(settings.hours) : {};
      setForm({
        shopName: settings.shopName ?? "",
        tagline: settings.tagline ?? "",
        address: settings.address ?? "",
        phone: settings.phone ?? "",
        email: settings.email ?? "",
        orderLink: settings.orderLink ?? "",
        monday: hours.monday ?? "",
        tuesday: hours.tuesday ?? "",
        wednesday: hours.wednesday ?? "",
        thursday: hours.thursday ?? "",
        friday: hours.friday ?? "",
        saturday: hours.saturday ?? "",
        sunday: hours.sunday ?? "",
      });
    }
  }, [settings]);

  if (settings === undefined) return <DonutSpinner className="mt-16" />;

  const update = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
    setSaved(false);
  };

  const saveAll = async () => {
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    const hours: Record<string, string> = {};
    for (const day of days) {
      hours[day] = form[day] ?? "";
    }

    await setSetting({ key: "shopName", value: form.shopName ?? "" });
    await setSetting({ key: "tagline", value: form.tagline ?? "" });
    await setSetting({ key: "address", value: form.address ?? "" });
    await setSetting({ key: "phone", value: form.phone ?? "" });
    await setSetting({ key: "email", value: form.email ?? "" });
    await setSetting({ key: "orderLink", value: form.orderLink ?? "" });
    await setSetting({ key: "hours", value: JSON.stringify(hours) });
    setSaved(true);
  };

  const Field = ({
    label,
    field,
    type = "text",
  }: {
    label: string;
    field: string;
    type?: string;
  }) => (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]">
        {label}
      </label>
      <input
        type={type}
        value={form[field] ?? ""}
        onChange={(e) => update(field, e.target.value)}
        className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--donut-pink)]"
      />
    </div>
  );

  return (
    <div>
      <h1 className="display-title mb-2 text-2xl font-bold text-[var(--text-primary)]">
        Shop Settings
      </h1>
      <p className="mb-8 text-sm text-[var(--text-muted)]">
        Update your shop info, hours, and hero content.
      </p>

      <div className="space-y-8">
        <div className="card-shell rounded-2xl p-6">
          <h2 className="mb-4 font-bold text-[var(--text-primary)]">
            General Info
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Shop Name" field="shopName" />
            <Field label="Tagline" field="tagline" />
            <Field label="Address" field="address" />
            <Field label="Phone" field="phone" type="tel" />
            <Field label="Email" field="email" type="email" />
            <Field label="Order Link (URL)" field="orderLink" type="url" />
          </div>
        </div>

        <div className="card-shell rounded-2xl p-6">
          <h2 className="mb-4 font-bold text-[var(--text-primary)]">
            Shop Hours
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map(
              (day) => (
                <Field
                  key={day}
                  label={day.charAt(0).toUpperCase() + day.slice(1)}
                  field={day}
                />
              )
            )}
          </div>
        </div>

        <div className="card-shell rounded-2xl p-6">
          <h2 className="mb-4 font-bold text-[var(--text-primary)]">
            Contact Page Photo
          </h2>
          <p className="mb-4 text-sm text-[var(--text-muted)]">
            Upload a photo of the building to display on the Contact Us page.
          </p>
          <div className="flex items-center gap-4">
            {contactPhotoUrl ? (
              <img
                src={contactPhotoUrl}
                alt="Storefront"
                className="h-24 w-36 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-24 w-36 items-center justify-center rounded-xl bg-[var(--surface-strong)] text-3xl">
                🏪
              </div>
            )}
            <div>
              <input
                ref={contactPhotoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoUpload(file, "contactPhotoId");
                }}
              />
              <button
                type="button"
                onClick={() => contactPhotoInputRef.current?.click()}
                disabled={uploadingPhoto === "contactPhotoId"}
                className="btn-secondary text-sm"
              >
                <ImagePlus size={14} />
                {uploadingPhoto === "contactPhotoId" ? "Uploading..." : contactPhotoUrl ? "Change Photo" : "Upload Photo"}
              </button>
            </div>
          </div>
        </div>

        <div className="card-shell rounded-2xl p-6">
          <h2 className="mb-4 font-bold text-[var(--text-primary)]">
            About Page Photo
          </h2>
          <p className="mb-4 text-sm text-[var(--text-muted)]">
            Upload a photo to display alongside the shop story on the About page.
          </p>
          <div className="flex items-center gap-4">
            {aboutPhotoUrl ? (
              <img
                src={aboutPhotoUrl}
                alt="About"
                className="h-24 w-36 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-24 w-36 items-center justify-center rounded-xl bg-[var(--surface-strong)] text-3xl">
                📸
              </div>
            )}
            <div>
              <input
                ref={aboutPhotoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePhotoUpload(file, "aboutPhotoId");
                }}
              />
              <button
                type="button"
                onClick={() => aboutPhotoInputRef.current?.click()}
                disabled={uploadingPhoto === "aboutPhotoId"}
                className="btn-secondary text-sm"
              >
                <ImagePlus size={14} />
                {uploadingPhoto === "aboutPhotoId" ? "Uploading..." : aboutPhotoUrl ? "Change Photo" : "Upload Photo"}
              </button>
            </div>
          </div>
        </div>

        <button type="button" className="btn-primary" onClick={saveAll}>
          <Save size={16} /> {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
