import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import SectionHeading from "../components/ui/SectionHeading";
import StarRating from "../components/ui/StarRating";
import DonutSpinner from "../components/ui/DonutSpinner";
import { formatDate } from "../lib/utils";

export const Route = createFileRoute("/reviews")({
  component: ReviewsPage,
  head: () => ({
    meta: [
      { title: "Reviews | Sip n' Dip Donuts — What Our Customers Say" },
      { name: "description", content: "Read customer reviews for Sip n' Dip Donuts in Saint Cloud, FL. Rated 4.6 stars on Google with over 1,700 reviews." },
    ],
  }),
});

function ReviewsPage() {
  const reviews = useQuery(api.reviews.listVisible);
  const settings = useQuery(api.shopSettings.getAll);

  const googleRating = settings?.googleRating ? parseFloat(settings.googleRating) : 4.6;
  const googleReviewCount = settings?.googleReviewCount ?? "1715";
  const yelpRating = settings?.yelpRating ? parseFloat(settings.yelpRating) : 4.4;
  const yelpReviewCount = settings?.yelpReviewCount ?? "433";
  const taRating = settings?.tripAdvisorRating ? parseFloat(settings.tripAdvisorRating) : 5.0;
  const taReviewCount = settings?.tripAdvisorReviewCount ?? "10";

  return (
    <main className="px-4 pb-16 pt-12">
      <div className="page-wrap">
        <SectionHeading
          kicker="What People Say"
          title="Customer Reviews"
          subtitle="Don't just take our word for it — hear from the community."
        />

        {reviews === undefined ? (
          <DonutSpinner className="mt-16" />
        ) : (
          <>
            {/* Platform Ratings */}
            <div className="mt-10 grid gap-4 sm:grid-cols-3 mx-auto max-w-3xl">
              {/* Google */}
              <motion.a
                href="https://share.google/X0F5V0pdIcfLLUWJN"
                target="_blank"
                rel="noopener noreferrer"
                className="card-shell rounded-2xl p-5 text-center no-underline hover:-translate-y-1 hover:shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="mb-2 flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-label="Google">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-sm font-semibold text-[var(--text-muted)]">Google</span>
                </div>
                <p className="text-4xl font-bold text-[var(--text-primary)]">{googleRating}</p>
                <div className="mt-1 flex justify-center"><StarRating rating={Math.round(googleRating)} size={18} /></div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{Number(googleReviewCount).toLocaleString()} reviews</p>
              </motion.a>

              {/* Yelp */}
              <motion.a
                href="https://www.yelp.com/biz/sip-and-dip-saint-cloud?utm_campaign=www_business_share_popup&utm_medium=copy_link&utm_source=(direct)"
                target="_blank"
                rel="noopener noreferrer"
                className="card-shell rounded-2xl p-5 text-center no-underline hover:-translate-y-1 hover:shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.15 }}
              >
                <div className="mb-2 flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-label="Yelp">
                    <path d="M12.14 1C6.05 1 1.12 5.93 1.12 12.02c0 6.09 4.93 11.02 11.02 11.02 6.09 0 11.02-4.93 11.02-11.02C23.16 5.93 18.23 1 12.14 1z" fill="#D32323"/>
                    <path d="M10.3 14.3l-3.2 1.6c-.3.2-.7 0-.7-.4l.3-3.5c0-.3.2-.5.5-.5l3.2-.3c.4 0 .6.4.4.7l-1.8 2.8c-.2.2-.5.3-.7.2zm1.3-3.4L9.4 8.2c-.2-.3 0-.7.3-.7l3.5.3c.3 0 .5.2.5.5l.3 3.2c0 .4-.4.6-.7.4l-2.8-1.8c-.2-.1-.3-.3-.2-.5zm2.5 2l2.8-1.8c.3-.2.7 0 .7.3l-.3 3.5c0 .3-.2.5-.5.5l-3.2.3c-.4 0-.6-.4-.4-.7l1.6-3.2c0-.1.2-.3.3-.3z" fill="white"/>
                  </svg>
                  <span className="text-sm font-semibold text-[var(--text-muted)]">Yelp</span>
                </div>
                <p className="text-4xl font-bold text-[var(--text-primary)]">{yelpRating}</p>
                <div className="mt-1 flex justify-center"><StarRating rating={Math.round(yelpRating)} size={18} /></div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{Number(yelpReviewCount).toLocaleString()} reviews</p>
              </motion.a>

              {/* TripAdvisor */}
              <motion.a
                href="https://www.tripadvisor.com/Restaurant_Review-g34601-d5101327-Reviews-Sip_and_Dip_Donuts-Saint_Cloud_Florida.html"
                target="_blank"
                rel="noopener noreferrer"
                className="card-shell rounded-2xl p-5 text-center no-underline hover:-translate-y-1 hover:shadow-lg"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="mb-2 flex items-center justify-center gap-2">
                  <svg viewBox="0 0 24 24" className="h-6 w-6" aria-label="TripAdvisor">
                    <circle cx="12" cy="12" r="12" fill="#34E0A1"/>
                    <circle cx="8.5" cy="12" r="3" fill="white"/>
                    <circle cx="8.5" cy="12" r="1.5" fill="#34E0A1"/>
                    <circle cx="15.5" cy="12" r="3" fill="white"/>
                    <circle cx="15.5" cy="12" r="1.5" fill="#34E0A1"/>
                    <path d="M8.5 9C10 7.5 14 7.5 15.5 9" stroke="white" strokeWidth="1.2" fill="none"/>
                    <path d="M12 7.5V6" stroke="white" strokeWidth="1.2"/>
                    <path d="M10.5 6h3" stroke="white" strokeWidth="1.2"/>
                  </svg>
                  <span className="text-sm font-semibold text-[var(--text-muted)]">TripAdvisor</span>
                </div>
                <p className="text-4xl font-bold text-[var(--text-primary)]">{taRating}</p>
                <div className="mt-1 flex justify-center"><StarRating rating={Math.round(taRating)} size={18} /></div>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{Number(taReviewCount).toLocaleString()} reviews</p>
              </motion.a>
            </div>

            {/* Reviews Grid */}
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review, i) => (
                <motion.article
                  key={review._id}
                  className="card-shell rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <StarRating rating={review.rating} size={16} />
                    <span className="text-xs text-[var(--text-muted)]">
                      {formatDate(review.date)}
                    </span>
                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-[var(--text-secondary)]">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  <div className="flex items-center gap-3 border-t border-[var(--line)] pt-4">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--donut-pink-soft)] text-sm font-bold text-[var(--donut-pink)]">
                      {review.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">
                        {review.customerName}
                      </p>
                      {"source" in review && review.source && (
                        <p className="text-xs text-[var(--text-muted)]">
                          via {review.source as string}
                        </p>
                      )}

                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://share.google/X0F5V0pdIcfLLUWJN"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary inline-flex items-center gap-2"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Google Reviews
              </a>
              <a
                href="https://www.yelp.com/biz/sip-and-dip-saint-cloud?utm_campaign=www_business_share_popup&utm_medium=copy_link&utm_source=(direct)"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
                style={{ borderColor: "#D32323", color: "#D32323" }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <path d="M12.14 1C6.05 1 1.12 5.93 1.12 12.02c0 6.09 4.93 11.02 11.02 11.02 6.09 0 11.02-4.93 11.02-11.02C23.16 5.93 18.23 1 12.14 1z" fill="#D32323"/>
                  <path d="M10.3 14.3l-3.2 1.6c-.3.2-.7 0-.7-.4l.3-3.5c0-.3.2-.5.5-.5l3.2-.3c.4 0 .6.4.4.7l-1.8 2.8c-.2.2-.5.3-.7.2zm1.3-3.4L9.4 8.2c-.2-.3 0-.7.3-.7l3.5.3c.3 0 .5.2.5.5l.3 3.2c0 .4-.4.6-.7.4l-2.8-1.8c-.2-.1-.3-.3-.2-.5zm2.5 2l2.8-1.8c.3-.2.7 0 .7.3l-.3 3.5c0 .3-.2.5-.5.5l-3.2.3c-.4 0-.6-.4-.4-.7l1.6-3.2c0-.1.2-.3.3-.3z" fill="white"/>
                </svg>
                Yelp Reviews
              </a>
              <a
                href="https://www.tripadvisor.com/Restaurant_Review-g34601-d5101327-Reviews-Sip_and_Dip_Donuts-Saint_Cloud_Florida.html"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center gap-2"
                style={{ borderColor: "#34E0A1", color: "#00aa6c" }}
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                  <circle cx="12" cy="12" r="12" fill="#34E0A1"/>
                  <circle cx="8.5" cy="12" r="3" fill="white"/>
                  <circle cx="8.5" cy="12" r="1.5" fill="#34E0A1"/>
                  <circle cx="15.5" cy="12" r="3" fill="white"/>
                  <circle cx="15.5" cy="12" r="1.5" fill="#34E0A1"/>
                </svg>
                TripAdvisor Reviews
              </a>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
