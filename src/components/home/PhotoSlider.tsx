import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";

export default function PhotoSlider() {
  const photos = useQuery(api.galleryPhotos.listVisible);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const pausedUntil = useRef(0);

  const updateScrollButtons = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    updateScrollButtons();
    return () => el.removeEventListener("scroll", updateScrollButtons);
  }, [photos, updateScrollButtons]);

  // Auto-scroll, pauses on hover and after manual interaction
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !photos?.length) return;

    let hovering = false;
    const onEnter = () => { hovering = true; };
    const onLeave = () => { hovering = false; };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);

    const interval = setInterval(() => {
      if (hovering || Date.now() < pausedUntil.current) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 0) return;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [photos]);

  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const goLightboxNext = useCallback(() => {
    if (lightboxIndex !== null && photos) {
      setLightboxIndex((lightboxIndex + 1) % photos.length);
    }
  }, [lightboxIndex, photos]);
  const goLightboxPrev = useCallback(() => {
    if (lightboxIndex !== null && photos) {
      setLightboxIndex((lightboxIndex - 1 + photos.length) % photos.length);
    }
  }, [lightboxIndex, photos]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goLightboxNext();
      else if (e.key === "ArrowLeft") goLightboxPrev();
      else if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, goLightboxNext, goLightboxPrev, closeLightbox]);

  const pauseAutoScroll = () => {
    pausedUntil.current = Date.now() + 8000;
  };

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    pauseAutoScroll();
    const amount = direction === "left" ? -400 : 400;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!photos || photos.length === 0) return null;

  return (
    <section className="py-16">
      <div className="page-wrap px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="kicker mb-2">Behind the Counter</p>
            <h2 className="section-title text-3xl font-bold sm:text-4xl">
              Life at the Shop
            </h2>
          </div>
          <Link
            to="/gallery"
            className="btn-secondary hidden text-sm sm:inline-flex"
          >
            View Gallery <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Slider */}
      <div className="relative">
        {/* Scroll buttons */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll("left")}
            className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-[var(--surface)] p-2.5 shadow-lg transition hover:bg-[var(--surface-strong)] sm:block"
            aria-label="Scroll left"
          >
            <ChevronLeft size={20} className="text-[var(--text-primary)]" />
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll("right")}
            className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-[var(--surface)] p-2.5 shadow-lg transition hover:bg-[var(--surface-strong)] sm:block"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} className="text-[var(--text-primary)]" />
          </button>
        )}

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-12 bg-gradient-to-r from-[var(--bg-base)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[5] w-12 bg-gradient-to-l from-[var(--bg-base)] to-transparent" />

        <div
          ref={scrollRef}
          onTouchStart={pauseAutoScroll}
          onMouseDown={pauseAutoScroll}
          className="scrollbar-hide flex gap-4 overflow-x-auto px-[max(1rem,calc((100vw-1120px)/2+1rem))] pb-2"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {photos.map((photo, i) => (
            <motion.div
              key={photo._id}
              className="shrink-0"
              style={{ scrollSnapAlign: "start" }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.3) }}
            >
              <button
                type="button"
                onClick={() => { pauseAutoScroll(); setLightboxIndex(i); }}
                className="group relative h-56 w-72 cursor-pointer overflow-hidden rounded-2xl border border-[var(--line)] p-0 text-left sm:h-64 sm:w-80"
              >
                {photo.url ? (
                  <img
                    src={photo.url}
                    alt={photo.caption ?? "Gallery photo"}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50">
                    <span className="text-5xl">📸</span>
                  </div>
                )}

                {/* Caption overlay */}
                {photo.caption && (
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-4 pb-4 pt-10">
                    <p className="text-sm font-medium text-white">
                      {photo.caption}
                    </p>
                  </div>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="page-wrap mt-6 px-4 text-center sm:hidden">
        <Link to="/gallery" className="btn-secondary text-sm">
          View Gallery <ArrowRight size={14} />
        </Link>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && photos[lightboxIndex] && (
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

              <button
                type="button"
                onClick={closeLightbox}
                className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                aria-label="Close"
              >
                <X size={20} />
              </button>

              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goLightboxPrev(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition hover:bg-black/70"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); goLightboxNext(); }}
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
    </section>
  );
}
