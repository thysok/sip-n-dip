import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import DonutSpinner from "../components/ui/DonutSpinner";

export const Route = createFileRoute("/gallery")({
  component: GalleryPage,
  head: () => ({
    meta: [
      { title: "Gallery | Sip n' Dip Donuts — Photos & Moments" },
      { name: "description", content: "A peek behind the counter at Sip n' Dip Donuts. See our handmade donuts, happy customers, and the love that goes into every batch." },
    ],
  }),
});

function GalleryPage() {
  const photos = useQuery(api.galleryPhotos.listVisible);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  const goNext = useCallback(() => {
    if (lightboxIndex !== null && photos) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  }, [lightboxIndex, photos]);

  const goPrev = useCallback(() => {
    if (lightboxIndex !== null && photos) {
      setLightboxIndex(
        (lightboxIndex - 1 + photos.length) % photos.length
      );
    }
  }, [lightboxIndex, photos]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, goNext, goPrev, closeLightbox]);

  return (
    <main className="px-4 pb-16 pt-12">
      <div className="page-wrap">
        <SectionHeading
          kicker="Behind the Counter"
          title="Gallery"
          subtitle="A peek at the donuts, the people, and the love that goes into every batch."
        />

        {photos === undefined ? (
          <DonutSpinner className="mt-16" />
        ) : photos.length === 0 ? (
          <div className="mt-16 text-center">
            <p className="text-4xl">📸</p>
            <p className="mt-4 text-lg font-semibold text-[var(--text-primary)]">
              Photos coming soon!
            </p>
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              Check back later for a peek behind the counter.
            </p>
          </div>
        ) : (
          <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
            {photos.map((photo, i) => (
              <motion.button
                key={photo._id}
                type="button"
                className="mb-5 w-full cursor-pointer overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-0 text-left break-inside-avoid"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                onClick={() => setLightboxIndex(i)}
              >
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.caption ?? "Gallery photo"}
                    className="w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50">
                    <span className="text-5xl">📸</span>
                  </div>
                )}
                {photo.caption && (
                  <div className="border-t border-[var(--line)] px-4 py-3">
                    <p className="text-sm text-[var(--text-secondary)]">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && photos && photos[lightboxIndex] && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className="relative max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-3xl bg-[var(--surface-strong)] shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {photos[lightboxIndex].url ? (
                <img
                  src={photos[lightboxIndex].url!}
                  alt={photos[lightboxIndex].caption ?? "Gallery photo"}
                  className="max-h-[70vh] w-full object-contain bg-black"
                />
              ) : (
                <div className="flex h-[400px] items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50">
                  <span className="text-9xl">📸</span>
                </div>
              )}

              <div className="px-6 py-4">
                <p className="text-base text-[var(--text-secondary)]">
                  {photos[lightboxIndex].caption || ""}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  {lightboxIndex + 1} / {photos.length}
                </p>
              </div>

              {/* Controls */}
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                aria-label="Close lightbox"
              >
                <X size={20} />
              </button>

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goPrev();
                    }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={24} />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      goNext();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
