import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { motion } from "framer-motion";
import { Heart, Coffee, Users, Sparkles } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import AnimatedSection from "../components/ui/AnimatedSection";
import DonutSpinner from "../components/ui/DonutSpinner";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About Us | Sip n' Dip Donuts — Our Family Story" },
      { name: "description", content: "Meet the Sok family behind Sip n' Dip Donuts. What started as a tiny storefront in Saint Cloud, FL has grown into a beloved community hub." },
    ],
  }),
});

const HIGHLIGHTS = [
  {
    icon: Heart,
    title: "Made with Love",
    description: "Every donut is handmade from scratch, every single morning. No shortcuts.",
  },
  {
    icon: Coffee,
    title: "Real Cuban Coffee",
    description: "Our cafe con leche is brewed strong and sweet, just like Abuela taught us.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We know our regulars by name. You're not a customer here — you're family.",
  },
  {
    icon: Sparkles,
    title: "Florida Inspired",
    description: "From guava to key lime, our specialty flavors celebrate the Sunshine State.",
  },
];

function AboutPage() {
  const settings = useQuery(api.shopSettings.getAll);
  const teamMembers = useQuery(api.teamMembers.list);
  const aboutPhotoUrl = useQuery(api.shopSettings.getImageUrl, { key: "aboutPhotoId" });

  const aboutContent = settings?.aboutContent ?? "";

  return (
    <main className="px-4 pb-16 pt-12">
      <div className="page-wrap">
        <SectionHeading
          kicker="Our Story"
          title="About Sip n' Dip Donuts"
          subtitle="A family dream, one donut at a time."
        />

        {/* Story */}
        <AnimatedSection className="mt-12">
          <div className={`card-shell overflow-hidden rounded-3xl ${aboutPhotoUrl ? "grid gap-0 lg:grid-cols-2" : "mx-auto max-w-3xl p-8 sm:p-12"}`}>
            {aboutPhotoUrl && (
              <div className="relative h-72 lg:h-auto">
                <img
                  src={aboutPhotoUrl}
                  alt="Sip n' Dip Donuts"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            )}
            <div className={aboutPhotoUrl ? "flex flex-col justify-center p-8 sm:p-10" : ""}>
              {aboutContent ? (
                <div className="prose max-w-none text-[var(--text-secondary)]">
                  {aboutContent.split("\n\n").map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <DonutSpinner />
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* Why Sip n' Dip */}
        <AnimatedSection className="mt-16">
          <SectionHeading
            kicker="What Makes Us Special"
            title="Why Sip n' Dip?"
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HIGHLIGHTS.map((item, i) => (
              <motion.div
                key={item.title}
                className="card-shell rounded-2xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--donut-pink-soft)]">
                  <item.icon size={24} className="text-[var(--donut-pink)]" />
                </div>
                <h3 className="mb-2 font-bold text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>

        {/* Team */}
        <AnimatedSection className="mt-16">
          <SectionHeading
            kicker="Meet the Family"
            title="The People Behind the Donuts"
          />
          {teamMembers === undefined ? (
            <DonutSpinner className="mt-10" />
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {teamMembers.map((member, i) => (
                <motion.div
                  key={member._id}
                  className="card-shell overflow-hidden rounded-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  {member.photoUrl ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="flex h-48 items-center justify-center bg-gradient-to-br from-pink-50 to-orange-50">
                      <span className="text-7xl">👤</span>
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-[var(--text-primary)]">
                      {member.name}
                    </h3>
                    <p className="mb-3 text-sm font-semibold text-[var(--donut-pink)]">
                      {member.role}
                    </p>
                    <p className="text-sm text-[var(--text-muted)]">
                      {member.bio}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatedSection>
      </div>
    </main>
  );
}
