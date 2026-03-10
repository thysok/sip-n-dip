import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Eye, EyeOff, Pencil, X, RefreshCw } from "lucide-react";
import StarRating from "../../components/ui/StarRating";
import DonutSpinner from "../../components/ui/DonutSpinner";
import { cn, formatDate } from "../../lib/utils";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviewsPage,
});

type EditingReview = {
  _id?: Id<"reviews">;
  customerName: string;
  rating: number;
  text: string;
  date: string;
  source: string;
  isVisible: boolean;
};

function AdminReviewsPage() {
  const reviews = useQuery(api.reviews.listAll);
  const createReview = useMutation(api.reviews.create);
  const updateReview = useMutation(api.reviews.update);
  const removeReview = useMutation(api.reviews.remove);

  const syncGoogleAction = useAction(api.reviewsSync.syncGoogle);
  const syncYelpAction = useAction(api.reviewsSync.syncYelp);

  const [editingReview, setEditingReview] = useState<EditingReview | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [syncingGoogle, setSyncingGoogle] = useState(false);
  const [syncingYelp, setSyncingYelp] = useState(false);
  const [syncMessage, setSyncMessage] = useState("");

  if (reviews === undefined) return <DonutSpinner className="mt-16" />;

  const handleSync = async (platform: "google" | "yelp") => {
    const setLoading = platform === "google" ? setSyncingGoogle : setSyncingYelp;
    const action = platform === "google" ? syncGoogleAction : syncYelpAction;
    const label = platform === "google" ? "Google" : "Yelp";

    setLoading(true);
    setSyncMessage("");
    try {
      const result = await action();
      if ("error" in result) {
        setSyncMessage(`${label} sync failed: ${result.error}`);
      } else {
        setSyncMessage(`${label}: Synced ${result.synced} reviews (${result.totalRating} stars, ${result.totalCount} total)`);
      }
    } catch (err: any) {
      setSyncMessage(`${label} sync failed: ${err.message}`);
    }
    setLoading(false);
  };

  const toggleVisibility = async (id: Id<"reviews">, current: boolean) => {
    await updateReview({ id, isVisible: !current });
  };

  const deleteReview = async (id: Id<"reviews">) => {
    if (!window.confirm("Are you sure you want to delete this?")) return;
    await removeReview({ id });
  };

  const saveReview = async (review: EditingReview) => {
    if (review._id) {
      await updateReview({
        id: review._id,
        customerName: review.customerName,
        rating: review.rating,
        text: review.text,
        date: review.date,
        source: review.source || undefined,
        isVisible: review.isVisible,
      });
    } else {
      await createReview({
        customerName: review.customerName,
        rating: review.rating,
        text: review.text,
        date: review.date,
        source: review.source || undefined,
        isVisible: review.isVisible,
      });
    }
    setEditingReview(null);
    setIsAdding(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="display-title text-2xl font-bold text-[var(--text-primary)]">
            Reviews Management
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {reviews.length} reviews · {reviews.filter((r) => r.isVisible).length} visible
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() => handleSync("google")}
            disabled={syncingGoogle}
          >
            <RefreshCw size={14} className={syncingGoogle ? "animate-spin" : ""} />
            {syncingGoogle ? "Syncing..." : "Sync Google"}
          </button>
          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() => handleSync("yelp")}
            disabled={syncingYelp}
          >
            <RefreshCw size={14} className={syncingYelp ? "animate-spin" : ""} />
            {syncingYelp ? "Syncing..." : "Sync Yelp"}
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              setIsAdding(true);
              setEditingReview({
                customerName: "",
                rating: 5,
                text: "",
                date: new Date().toISOString().split("T")[0],
                source: "",
                isVisible: true,
              });
            }}
          >
            <Plus size={16} /> Add Review
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className={cn(
          "mb-4 rounded-xl px-4 py-3 text-sm font-medium",
          syncMessage.startsWith("Sync failed")
            ? "bg-red-50 text-red-700"
            : "bg-green-50 text-green-700"
        )}>
          {syncMessage}
        </div>
      )}

      <div className="space-y-3">
        <AnimatePresence>
          {reviews.map((review) => (
            <motion.div
              key={review._id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={cn(
                "card-shell rounded-xl p-4",
                !review.isVisible && "opacity-50"
              )}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--donut-pink-soft)] font-bold text-[var(--donut-pink)]">
                  {review.customerName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-[var(--text-primary)]">
                      {review.customerName}
                    </p>
                    <StarRating rating={review.rating} size={14} />
                    {"source" in review && review.source && (
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        review.source === "Google" && "bg-blue-50 text-blue-600",
                        review.source === "Yelp" && "bg-red-50 text-red-600",
                        review.source === "TripAdvisor" && "bg-green-50 text-green-700",
                        review.source === "Facebook" && "bg-indigo-50 text-indigo-600",
                      )}>
                        {review.source as string}
                      </span>
                    )}
                    <span className="text-xs text-[var(--text-muted)]">
                      {formatDate(review.date)}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--text-muted)]">
                    {review.text}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    type="button"
                    onClick={() => toggleVisibility(review._id, review.isVisible)}
                    className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--donut-pink-soft)]"
                  >
                    {review.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingReview({
                        _id: review._id,
                        customerName: review.customerName,
                        rating: review.rating,
                        text: review.text,
                        date: review.date,
                        source: (review as any).source ?? "",
                        isVisible: review.isVisible,
                      })
                    }
                    className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-[var(--donut-pink-soft)]"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteReview(review._id)}
                    className="rounded-lg p-2 text-[var(--text-muted)] transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Edit/Add Modal */}
      <AnimatePresence>
        {editingReview && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { setEditingReview(null); setIsAdding(false); }}
          >
            <motion.div
              className="card-shell w-full max-w-lg rounded-2xl p-6"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="display-title text-lg font-bold text-[var(--text-primary)]">
                  {isAdding ? "Add Review" : "Edit Review"}
                </h2>
                <button
                  type="button"
                  onClick={() => { setEditingReview(null); setIsAdding(false); }}
                  className="rounded-lg p-1 text-[var(--text-muted)]"
                >
                  <X size={20} />
                </button>
              </div>
              <form
                onSubmit={(e) => { e.preventDefault(); saveReview(editingReview); }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">Name</label>
                    <input
                      type="text"
                      required
                      value={editingReview.customerName}
                      onChange={(e) => setEditingReview({ ...editingReview, customerName: e.target.value })}
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm outline-none focus:border-[var(--donut-pink)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">Rating</label>
                    <select
                      value={editingReview.rating}
                      onChange={(e) => setEditingReview({ ...editingReview, rating: parseInt(e.target.value) })}
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm outline-none focus:border-[var(--donut-pink)]"
                    >
                      {[5, 4, 3, 2, 1].map((n) => (
                        <option key={n} value={n}>{n} Star{n !== 1 ? "s" : ""}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">Review Text</label>
                  <textarea
                    required
                    rows={3}
                    value={editingReview.text}
                    onChange={(e) => setEditingReview({ ...editingReview, text: e.target.value })}
                    className="w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm outline-none focus:border-[var(--donut-pink)]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">Date</label>
                    <input
                      type="date"
                      value={editingReview.date}
                      onChange={(e) => setEditingReview({ ...editingReview, date: e.target.value })}
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm outline-none focus:border-[var(--donut-pink)]"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-semibold text-[var(--text-secondary)]">Source</label>
                    <select
                      value={editingReview.source}
                      onChange={(e) => setEditingReview({ ...editingReview, source: e.target.value })}
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2.5 text-sm outline-none focus:border-[var(--donut-pink)]"
                    >
                      <option value="">None</option>
                      <option value="Google">Google</option>
                      <option value="Yelp">Yelp</option>
                      <option value="TripAdvisor">TripAdvisor</option>
                      <option value="Facebook">Facebook</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary flex-1 justify-center">
                    {isAdding ? "Add Review" : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => { setEditingReview(null); setIsAdding(false); }}
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
