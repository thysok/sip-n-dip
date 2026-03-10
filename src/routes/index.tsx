import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { ArrowRight, MapPin, Clock } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import AnimatedSection from "../components/ui/AnimatedSection";
import StarRating from "../components/ui/StarRating";
import DonutSpinner from "../components/ui/DonutSpinner";
import PhotoSlider from "../components/home/PhotoSlider";
import FloatingSprinkles from "../components/home/FloatingSprinkles";
import OpenNowBadge from "../components/home/OpenNowBadge";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const featured = useQuery(api.featuredDonuts.list);
  const reviews = useQuery(api.reviews.getTopReviews, { limit: 3 });
  const settings = useQuery(api.shopSettings.getAll);

  const shopName = settings?.shopName ?? "Sip n' Dip Donuts";
  const tagline = settings?.tagline ?? "Fresh. Glazed. Loved.";
  const phone = settings?.phone ?? "(407) 892-1252";
  const hours = settings?.hours ? JSON.parse(settings.hours) : null;
  const googleRating = settings?.googleRating ? parseFloat(settings.googleRating) : 4.6;
  const googleReviewCount = settings?.googleReviewCount ?? "1,715";
  const yelpRating = settings?.yelpRating ? parseFloat(settings.yelpRating) : 4.4;
  const yelpReviewCount = settings?.yelpReviewCount ?? "433";
  const taRating = settings?.tripAdvisorRating ? parseFloat(settings.tripAdvisorRating) : 5.0;
  const taReviewCount = settings?.tripAdvisorReviewCount ?? "10";

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pb-16 pt-12 sm:pb-24 sm:pt-16">
        <FloatingSprinkles count={28} />

        <div className="page-wrap relative z-10 text-center">
          <motion.img
            src="/logo.png"
            alt="Sip n' Dip Donuts mascot"
            className="mx-auto mb-6 w-48 drop-shadow-xl sm:w-64 md:w-72"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: [0, -8, 0],
            }}
            transition={{
              opacity: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.7,
              },
            }}
          />

          <motion.div
            className="mb-5 flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <OpenNowBadge />
          </motion.div>

          <motion.p
            className="kicker mb-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Saint Cloud's Favorite Donut Shop
          </motion.p>

          <motion.h1
            className="display-title mx-auto mb-6 max-w-4xl text-5xl font-extrabold leading-[1.05] tracking-tight text-[var(--text-primary)] sm:text-7xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {tagline.split(".").map((part, i) => {
              const trimmed = part.trim();
              if (!trimmed) return null;
              if (i === tagline.split(".").filter((s) => s.trim()).length - 1) {
                return (
                  <span key={i} className="text-[var(--donut-pink)]">
                    {trimmed}.
                  </span>
                );
              }
              return `${trimmed}. `;
            })}
          </motion.h1>

          <motion.p
            className="mx-auto mb-8 max-w-2xl text-lg text-[var(--text-muted)]"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Handmade donuts, strong coffee, and a whole lot of heart — made
            fresh every morning by the Sok family since 2018.
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <Link to="/menu" className="btn-primary text-base">
              See Our Menu <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="btn-secondary text-base">
              <MapPin size={18} /> Visit Us
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Donuts */}
      <AnimatedSection className="px-4 py-16">
        <div className="page-wrap">
          <SectionHeading
            kicker="Fan Favorites"
            title="Our Most-Loved Donuts"
            subtitle="These crowd-pleasers keep our regulars coming back for more."
          />

          {featured === undefined ? (
            <DonutSpinner className="mt-10" />
          ) : featured.length === 0 ? (
            <p className="mt-10 text-center text-[var(--text-muted)]">
              Featured donuts coming soon!
            </p>
          ) : (
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((donut, i) => (
                <motion.article
                  key={donut._id}
                  className="card-shell group cursor-default overflow-hidden rounded-2xl"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                >
                  {donut.imageUrl ? (
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={donut.imageUrl}
                        alt={donut.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      {donut.badge && (
                        <span
                          className={`absolute right-2 top-2 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            donut.badge === "new"
                              ? "bg-[var(--badge-new-bg)] text-[var(--badge-new-text)]"
                              : "bg-[var(--badge-popular-bg)] text-[var(--badge-popular-text)]"
                          }`}
                        >
                          {donut.badge === "new" ? "New" : "Popular"}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-start justify-between p-5 pb-0">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--donut-pink-soft)] text-2xl">
                        🍩
                      </div>
                      {donut.badge && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            donut.badge === "new"
                              ? "bg-[var(--badge-new-bg)] text-[var(--badge-new-text)]"
                              : "bg-[var(--badge-popular-bg)] text-[var(--badge-popular-text)]"
                          }`}
                        >
                          {donut.badge === "new" ? "New" : "Popular"}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="mb-1 text-base font-bold text-[var(--text-primary)]">
                      {donut.name}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)]">
                      {donut.description}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/menu" className="btn-secondary">
              View Full Menu <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Our Story Teaser */}
      <AnimatedSection className="px-4 py-16">
        <div className="page-wrap">
          <div className="card-shell mx-auto max-w-3xl rounded-3xl p-8 text-center sm:p-12">
            <p className="kicker mb-3">Our Story</p>
            <h2 className="display-title mb-4 text-3xl font-bold text-[var(--text-primary)]">
              A Family Dream, One Donut at a Time
            </h2>
            <p className="mb-6 text-[var(--text-muted)]">
              What started as a tiny storefront with six donut flavors has grown
              into a beloved community hub. Chin and Mary Sok brought
              their love of handmade donuts and strong coffee to Saint Cloud
              — and the neighborhood hasn't been the same since.
            </p>
            <Link to="/about" className="btn-primary">
              Read Our Story <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Photo Slider */}
      <PhotoSlider />

      {/* Reviews */}
      <AnimatedSection className="px-4 py-16">
        <div className="page-wrap">
          <SectionHeading
            kicker="What People Are Saying"
            title="Loved by the Community"
          />

          {/* Platform rating badges */}
          <div className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
            {[
              {
                name: "Google",
                rating: googleRating,
                count: googleReviewCount,
                href: "https://share.google/X0F5V0pdIcfLLUWJN",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-label="Google">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                ),
              },
              {
                name: "Yelp",
                rating: yelpRating,
                count: yelpReviewCount,
                href: "https://www.yelp.com/biz/sip-and-dip-saint-cloud?utm_campaign=www_business_share_popup&utm_medium=copy_link&utm_source=(direct)",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-label="Yelp">
                    <path d="M12.14 1C6.05 1 1.12 5.93 1.12 12.02c0 6.09 4.93 11.02 11.02 11.02 6.09 0 11.02-4.93 11.02-11.02C23.16 5.93 18.23 1 12.14 1z" fill="#D32323"/>
                    <path d="M10.3 14.3l-3.2 1.6c-.3.2-.7 0-.7-.4l.3-3.5c0-.3.2-.5.5-.5l3.2-.3c.4 0 .6.4.4.7l-1.8 2.8c-.2.2-.5.3-.7.2zm1.3-3.4L9.4 8.2c-.2-.3 0-.7.3-.7l3.5.3c.3 0 .5.2.5.5l.3 3.2c0 .4-.4.6-.7.4l-2.8-1.8c-.2-.1-.3-.3-.2-.5zm2.5 2l2.8-1.8c.3-.2.7 0 .7.3l-.3 3.5c0 .3-.2.5-.5.5l-3.2.3c-.4 0-.6-.4-.4-.7l1.6-3.2c0-.1.2-.3.3-.3z" fill="white"/>
                  </svg>
                ),
              },
              {
                name: "TripAdvisor",
                rating: taRating,
                count: taReviewCount,
                href: "https://www.tripadvisor.com/Restaurant_Review-g34601-d5101327-Reviews-Sip_and_Dip_Donuts-Saint_Cloud_Florida.html",
                icon: (
                  <svg viewBox="0 0 24 24" className="h-5 w-5" aria-label="TripAdvisor">
                    <circle cx="12" cy="12" r="12" fill="#34E0A1"/>
                    <circle cx="8.5" cy="12" r="3" fill="white"/>
                    <circle cx="8.5" cy="12" r="1.5" fill="#34E0A1"/>
                    <circle cx="15.5" cy="12" r="3" fill="white"/>
                    <circle cx="15.5" cy="12" r="1.5" fill="#34E0A1"/>
                    <path d="M8.5 9C10 7.5 14 7.5 15.5 9" stroke="white" strokeWidth="1.2" fill="none"/>
                    <path d="M12 7.5V6" stroke="white" strokeWidth="1.2"/>
                    <path d="M10.5 6h3" stroke="white" strokeWidth="1.2"/>
                  </svg>
                ),
              },
            ].map((platform, i) => (
              <motion.a
                key={platform.name}
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
                className="card-shell flex items-center gap-3 rounded-xl px-4 py-3 no-underline transition hover:-translate-y-0.5 hover:shadow-md"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                {platform.icon}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-lg font-bold text-[var(--text-primary)]">{platform.rating}</span>
                    <StarRating rating={Math.round(platform.rating)} size={13} />
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    {Number(platform.count).toLocaleString()} reviews
                  </p>
                </div>
                <ArrowRight size={14} className="shrink-0 text-[var(--text-muted)]" />
              </motion.a>
            ))}
          </div>

          {reviews === undefined ? (
            <DonutSpinner className="mt-10" />
          ) : (
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
              {reviews.map((review, i) => (
                <motion.div
                  key={review._id}
                  className="card-shell rounded-2xl p-6"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--donut-pink-soft)] text-sm font-bold text-[var(--donut-pink)]">
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
                  <StarRating rating={review.rating} size={14} />
                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    &ldquo;{review.text}&rdquo;
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/reviews" className="btn-primary">
              See All Reviews <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Location & Hours */}
      <AnimatedSection className="px-4 py-16">
        <div className="page-wrap">
          <SectionHeading kicker="Come Say Hi" title="Find Us in Saint Cloud" />

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="card-shell flex overflow-hidden rounded-2xl">
              <iframe
                title="Sip n' Dip Donuts location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3514.1!2d-81.2812!3d28.2486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e7179f1f8db087%3A0x5c45e0e0f5e8f2a0!2s1001%2013th%20St%2C%20Saint%20Cloud%2C%20FL%2034769!5e0!3m2!1sen!2sus!4v1"
                className="h-full min-h-[300px] w-full flex-1"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="card-shell rounded-2xl p-8">
              <h3 className="display-title mb-6 text-xl font-bold text-[var(--text-primary)]">
                Shop Hours
              </h3>
              <div className="space-y-3 text-sm">
                {hours
                  ? Object.entries(hours).map(([day, h]) => (
                      <div
                        key={day}
                        className="flex items-center justify-between border-b border-[var(--line)] pb-3 last:border-0"
                      >
                        <span className="flex items-center gap-2 font-medium capitalize text-[var(--text-secondary)]">
                          <Clock
                            size={14}
                            className="text-[var(--donut-pink)]"
                          />
                          {day}
                        </span>
                        <span className="font-semibold text-[var(--text-primary)]">
                          {h as string}
                        </span>
                      </div>
                    ))
                  : [
                      ["Monday – Thursday", "6:00 AM – 2:00 PM"],
                      ["Friday – Saturday", "6:00 AM – 3:00 PM"],
                      ["Sunday", "7:00 AM – 1:00 PM"],
                    ].map(([day, h]) => (
                      <div
                        key={day}
                        className="flex items-center justify-between border-b border-[var(--line)] pb-3 last:border-0"
                      >
                        <span className="flex items-center gap-2 font-medium text-[var(--text-secondary)]">
                          <Clock
                            size={14}
                            className="text-[var(--donut-pink)]"
                          />
                          {day}
                        </span>
                        <span className="font-semibold text-[var(--text-primary)]">
                          {h}
                        </span>
                      </div>
                    ))}
              </div>

              <div className="mt-6 rounded-xl bg-[var(--donut-pink-soft)] p-4 text-center">
                <p className="text-sm font-semibold text-[var(--donut-pink)]">
                  📞 {phone}
                </p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">
                  Call ahead for large orders!
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Banner */}
      <AnimatedSection className="px-4 py-16">
        <div className="page-wrap">
          <div className="relative overflow-hidden rounded-3xl bg-[var(--donut-pink)] px-8 py-12 text-center text-white sm:px-16 sm:py-16">
            <div className="pointer-events-none absolute -left-10 -top-10 text-8xl opacity-20">
              🍩
            </div>
            <div className="pointer-events-none absolute -bottom-8 -right-8 text-7xl opacity-20">
              🍩
            </div>
            <h2 className="display-title relative mb-4 text-3xl font-bold sm:text-4xl">
              Life's too short for bad donuts.
            </h2>
            <p className="relative mb-8 text-lg opacity-90">
              Stop by {shopName} and taste the difference that fresh, handmade,
              and family-owned makes.
            </p>
            <div className="relative flex flex-wrap justify-center gap-3">
              <Link
                to="/menu"
                className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-[var(--donut-pink)] no-underline transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                Browse the Menu <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 bg-white/15 px-6 py-3 font-bold no-underline transition hover:-translate-y-0.5 hover:bg-white/25"
                style={{ color: "white" }}
              >
                <MapPin size={16} /> Get Directions
              </Link>
            </div>

          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
