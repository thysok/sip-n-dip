import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useState, useRef } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  GripVertical,
  Eye,
  EyeOff,
  ImagePlus,
} from "lucide-react";
import Badge from "../../components/ui/Badge";
import DonutSpinner from "../../components/ui/DonutSpinner";
import { formatPrice, cn } from "../../lib/utils";

export const Route = createFileRoute("/admin/menu")({
  component: AdminMenuPage,
});

type EditingItem = {
  _id?: Id<"menuItems">;
  name: string;
  description: string;
  price: number;
  categoryId: Id<"categories"> | "";
  badge?: string;
  isActive: boolean;
  displayOrder: number;
  imageId?: Id<"_storage">;
  imageUrl?: string | null;
};

function CategoryReorderGroup({
  items,
  categoryMap,
  onReorder,
  onToggleActive,
  onEdit,
  onDelete,
}: {
  items: any[];
  categoryMap: Map<string, string>;
  onReorder: (args: { ids: Id<"menuItems">[] }) => void;
  onToggleActive: (id: Id<"menuItems">, current: boolean) => void;
  onEdit: (item: any) => void;
  onDelete: (id: Id<"menuItems">) => void;
}) {
  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={(newOrder) => {
        onReorder({ ids: newOrder.map((item: any) => item._id) });
      }}
      className="space-y-3"
    >
      {items.map((item: any) => (
        <Reorder.Item
          key={item._id}
          value={item}
          className={cn(
            "card-shell flex items-center gap-4 rounded-xl p-4",
            !item.isActive && "opacity-50"
          )}
        >
          <GripVertical
            size={16}
            className="shrink-0 cursor-grab text-[var(--text-muted)] active:cursor-grabbing"
          />

          {item.imageUrl ? (
            <img
              src={item.imageUrl}
              alt={item.name}
              className="h-10 w-10 shrink-0 rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--donut-pink-soft)] text-lg">
              {categoryMap.get(item.categoryId)?.includes("Smoothie") || categoryMap.get(item.categoryId)?.includes("Milk Tea")
                ? "☕"
                : categoryMap.get(item.categoryId)?.includes("Bundle")
                  ? "🎁"
                  : "🍩"}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate font-semibold text-[var(--text-primary)]">
                {item.name}
              </p>
              {item.badge && <Badge type={item.badge} />}
            </div>
            <p className="truncate text-xs text-[var(--text-muted)]">
              {categoryMap.get(item.categoryId) ?? "Unknown"} ·{" "}
              {item.description}
            </p>
          </div>

          <p className="shrink-0 font-bold text-[var(--donut-pink)]">
            {formatPrice(item.price)}
          </p>

          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              onClick={() => onToggleActive(item._id, item.isActive)}
              className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--donut-pink-soft)]"
              title={item.isActive ? "Hide item" : "Show item"}
            >
              {item.isActive ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            <button
              type="button"
              onClick={() => onEdit(item)}
              className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--donut-pink-soft)]"
              title="Edit"
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(item._id)}
              className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-red-50 hover:text-red-500"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
}

function AdminMenuPage() {
  const items = useQuery(api.menuItems.list);
  const categories = useQuery(api.categories.list);
  const createItem = useMutation(api.menuItems.create);
  const updateItem = useMutation(api.menuItems.update);
  const removeItem = useMutation(api.menuItems.remove);
  const reorderItems = useMutation(api.menuItems.reorder);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (items === undefined || categories === undefined) {
    return <DonutSpinner className="mt-16" />;
  }

  const filteredItems =
    filterCategory === "all"
      ? items
      : items.filter((i) => i.categoryId === filterCategory);

  const categoryMap = new Map(categories.map((c) => [c._id, c.name]));

  const toggleActive = async (id: Id<"menuItems">, current: boolean) => {
    await updateItem({ id, isActive: !current });
  };

  const deleteItem = async (id: Id<"menuItems">) => {
    await removeItem({ id });
  };

  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await generateUploadUrl();
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { storageId } = await res.json();
      setEditingItem((prev) =>
        prev ? { ...prev, imageId: storageId, imageUrl: URL.createObjectURL(file) } : prev
      );
    } catch (err) {
      console.error("Upload error:", err);
    }
    setUploading(false);
  };

  const saveItem = async (item: EditingItem) => {
    if (!item.categoryId) return;
    if (item._id) {
      await updateItem({
        id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId as Id<"categories">,
        badge: item.badge || undefined,
        isActive: item.isActive,
        displayOrder: item.displayOrder,
        ...(item.imageId ? { imageId: item.imageId } : {}),
      });
    } else {
      await createItem({
        name: item.name,
        description: item.description,
        price: item.price,
        categoryId: item.categoryId as Id<"categories">,
        badge: item.badge || undefined,
        isActive: item.isActive,
        displayOrder: item.displayOrder,
        ...(item.imageId ? { imageId: item.imageId } : {}),
      });
    }
    setEditingItem(null);
    setIsAdding(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="display-title text-2xl font-bold text-[var(--text-primary)]">
            Menu Management
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {items.length} items across {categories.length} categories
          </p>
        </div>
        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            setIsAdding(true);
            setEditingItem({
              name: "",
              description: "",
              price: 0,
              categoryId: categories[0]?._id ?? "",
              isActive: true,
              displayOrder: items.length,
            });
          }}
        >
          <Plus size={16} /> Add Item
        </button>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setFilterCategory("all")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition",
            filterCategory === "all"
              ? "bg-[var(--donut-pink)] text-white"
              : "bg-[var(--surface-strong)] text-[var(--text-muted)] border border-[var(--line)]"
          )}
        >
          All ({items.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            type="button"
            onClick={() => setFilterCategory(cat._id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-semibold transition",
              filterCategory === cat._id
                ? "bg-[var(--donut-pink)] text-white"
                : "bg-[var(--surface-strong)] text-[var(--text-muted)] border border-[var(--line)]"
            )}
          >
            {cat.name} ({items.filter((i) => i.categoryId === cat._id).length})
          </button>
        ))}
      </div>

      {/* Items list */}
      {filterCategory !== "all" ? (
        <CategoryReorderGroup
          items={filteredItems}
          categoryMap={categoryMap}
          onReorder={reorderItems}
          onToggleActive={toggleActive}
          onEdit={(item) => setEditingItem({
            _id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            categoryId: item.categoryId,
            badge: item.badge,
            isActive: item.isActive,
            displayOrder: item.displayOrder,
            imageId: item.imageId,
            imageUrl: item.imageUrl,
          })}
          onDelete={deleteItem}
        />
      ) : (
        <div className="space-y-8">
          {categories.map((cat) => {
            const catItems = items.filter((i) => i.categoryId === cat._id);
            if (catItems.length === 0) return null;
            return (
              <div key={cat._id}>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  {cat.name}
                  <span className="text-xs font-normal text-[var(--text-muted)]">
                    ({catItems.length})
                  </span>
                </h3>
                <CategoryReorderGroup
                  items={catItems}
                  categoryMap={categoryMap}
                  onReorder={reorderItems}
                  onToggleActive={toggleActive}
                  onEdit={(item) => setEditingItem({
                    _id: item._id,
                    name: item.name,
                    description: item.description,
                    price: item.price,
                    categoryId: item.categoryId,
                    badge: item.badge,
                    isActive: item.isActive,
                    displayOrder: item.displayOrder,
                    imageId: item.imageId,
                    imageUrl: item.imageUrl,
                  })}
                  onDelete={deleteItem}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {editingItem && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              setEditingItem(null);
              setIsAdding(false);
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
                  {isAdding ? "Add Menu Item" : "Edit Menu Item"}
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setEditingItem(null);
                    setIsAdding(false);
                  }}
                  className="rounded-lg p-1 text-[var(--text-muted)] hover:bg-[var(--donut-pink-soft)]"
                >
                  <X size={20} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveItem(editingItem);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingItem.name}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, name: e.target.value })
                    }
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--donut-pink)]"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">
                    Description
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={editingItem.description}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        description: e.target.value,
                      })
                    }
                    className="w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--donut-pink)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={editingItem.price}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--donut-pink)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">
                      Category
                    </label>
                    <select
                      value={editingItem.categoryId}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          categoryId: e.target.value as Id<"categories">,
                        })
                      }
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--donut-pink)]"
                    >
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">
                    Badge
                  </label>
                  <select
                    value={editingItem.badge ?? ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        badge: e.target.value || undefined,
                      })
                    }
                    className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--donut-pink)]"
                  >
                    <option value="">None</option>
                    <option value="new">New</option>
                    <option value="popular">Popular</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">
                    Photo
                  </label>
                  <div className="flex items-center gap-3">
                    {editingItem.imageUrl ? (
                      <img
                        src={editingItem.imageUrl}
                        alt="Preview"
                        className="h-16 w-16 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[var(--surface-strong)] text-2xl">
                        🍩
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
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
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="btn-secondary text-xs"
                    >
                      <ImagePlus size={14} />
                      {uploading ? "Uploading..." : editingItem.imageUrl ? "Change Photo" : "Upload Photo"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="btn-primary flex-1 justify-center"
                  >
                    {isAdding ? "Add Item" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                      setEditingItem(null);
                      setIsAdding(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
