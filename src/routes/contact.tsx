import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import SectionHeading from "../components/ui/SectionHeading";
import AnimatedSection from "../components/ui/AnimatedSection";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact Us | Sip n' Dip Donuts — Saint Cloud, FL" },
      { name: "description", content: "Visit Sip n' Dip Donuts at 1001 13th St, Saint Cloud, FL 34769. Call (407) 892-1252 or send us a message. Open daily." },
    ],
  }),
});

function ContactPage() {
  const settings = useQuery(api.shopSettings.getAll);
  const contactPhotoUrl = useQuery(api.shopSettings.getImageUrl, { key: "contactPhotoId" });
  const submitMessage = useMutation(api.contactMessages.submit);

  const phone = settings?.phone ?? "(407) 892-1252";
  const email = settings?.email ?? "hello@sipndipdonuts.com";
  const address = settings?.address ?? "1001 13th St, Saint Cloud, FL 34769";
  const hours = settings?.hours ? JSON.parse(settings.hours) : null;

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitMessage({
        name: formState.name,
        email: formState.email,
        phone: formState.phone || undefined,
        message: formState.message,
      });
      setSubmitted(true);
      setFormState({ name: "", email: "", phone: "", message: "" });
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setSending(false);
  };

  return (
    <main className="px-4 pb-16 pt-12">
      <div className="page-wrap">
        <SectionHeading
          kicker="Get in Touch"
          title="Contact Us"
          subtitle="We'd love to hear from you. Stop by, give us a call, or drop us a message."
        />

        {/* Building Photo — full width */}
        {contactPhotoUrl && (
          <AnimatedSection className="mt-10">
            <div className="card-shell overflow-hidden rounded-3xl">
              <img
                src={contactPhotoUrl}
                alt="Sip n' Dip Donuts storefront"
                className="h-64 w-full object-cover sm:h-80"
              />
            </div>
          </AnimatedSection>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          {/* Contact Form */}
          <AnimatedSection className="lg:col-span-3">
            <div className="card-shell rounded-3xl p-8">
              <h3 className="display-title mb-6 text-xl font-bold text-[var(--text-primary)]">
                Send Us a Message
              </h3>

              {submitted ? (
                <motion.div
                  className="flex flex-col items-center py-10 text-center"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <CheckCircle size={48} className="mb-4 text-green-500" />
                  <h4 className="mb-2 text-lg font-bold text-[var(--text-primary)]">
                    Message Sent!
                  </h4>
                  <p className="text-sm text-[var(--text-muted)]">
                    Thanks for reaching out. We'll get back to you soon!
                  </p>
                  <button
                    type="button"
                    className="btn-secondary mt-6"
                    onClick={() => setSubmitted(false)}
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]"
                    >
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formState.name}
                      onChange={(e) =>
                        setFormState({ ...formState, name: e.target.value })
                      }
                      className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--donut-pink)] focus:ring-2 focus:ring-[var(--donut-pink-soft)]"
                      placeholder="Mary Sok"
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formState.email}
                        onChange={(e) =>
                          setFormState({ ...formState, email: e.target.value })
                        }
                        className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--donut-pink)] focus:ring-2 focus:ring-[var(--donut-pink-soft)]"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]"
                      >
                        Phone Number <span className="font-normal text-[var(--text-muted)]">(optional)</span>
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formState.phone}
                        onChange={(e) =>
                          setFormState({ ...formState, phone: e.target.value })
                        }
                        className="w-full rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--donut-pink)] focus:ring-2 focus:ring-[var(--donut-pink-soft)]"
                        placeholder="(407) 555-1234"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formState.message}
                      onChange={(e) =>
                        setFormState({ ...formState, message: e.target.value })
                      }
                      className="w-full resize-none rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--donut-pink)] focus:ring-2 focus:ring-[var(--donut-pink-soft)]"
                      placeholder="I'd love to order 3 dozen for my daughter's birthday party..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-primary w-full justify-center disabled:opacity-60"
                  >
                    {sending ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message <Send size={16} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>

          {/* Sidebar Info */}
          <AnimatedSection className="space-y-6 lg:col-span-2" delay={0.15}>
            <div className="card-shell rounded-2xl p-6">
              <h4 className="mb-4 flex items-center gap-2 font-bold text-[var(--text-primary)]">
                <MapPin size={18} className="text-[var(--donut-pink)]" />
                Location
              </h4>
              <p className="text-sm text-[var(--text-secondary)]">
                {address.split(",").map((part, i) => (
                  <span key={i}>
                    {part.trim()}
                    {i < address.split(",").length - 1 && <br />}
                  </span>
                ))}
              </p>
              <div className="mt-4 overflow-hidden rounded-xl">
                <iframe
                  title="Sip n' Dip Donuts location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3514.1!2d-81.2812!3d28.2486!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e7179f1f8db087%3A0x5c45e0e0f5e8f2a0!2s1001%2013th%20St%2C%20Saint%20Cloud%2C%20FL%2034769!5e0!3m2!1sen!2sus!4v1"
                  width="100%"
                  height="160"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="card-shell rounded-2xl p-6">
              <h4 className="mb-4 flex items-center gap-2 font-bold text-[var(--text-primary)]">
                <Phone size={18} className="text-[var(--donut-pink)]" />
                Call or Email
              </h4>
              <div className="space-y-3 text-sm">
                <a
                  href={`tel:${phone.replace(/\D/g, "")}`}
                  className="flex items-center gap-2 font-medium text-[var(--text-secondary)] no-underline transition hover:text-[var(--donut-pink)]"
                >
                  <Phone size={14} className="text-[var(--donut-pink)]" />
                  {phone}
                </a>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 font-medium text-[var(--text-secondary)] no-underline transition hover:text-[var(--donut-pink)]"
                >
                  <Mail size={14} className="text-[var(--donut-pink)]" />
                  {email}
                </a>
              </div>
            </div>

            <div className="card-shell rounded-2xl p-6">
              <h4 className="mb-4 flex items-center gap-2 font-bold text-[var(--text-primary)]">
                <Clock size={18} className="text-[var(--donut-pink)]" />
                Shop Hours
              </h4>
              <div className="space-y-2 text-sm">
                {hours
                  ? Object.entries(hours).map(([day, h]) => (
                      <div
                        key={day}
                        className="flex justify-between border-b border-[var(--line)] pb-2 last:border-0"
                      >
                        <span className="capitalize text-[var(--text-secondary)]">
                          {day}
                        </span>
                        <span className="font-semibold text-[var(--text-primary)]">
                          {h as string}
                        </span>
                      </div>
                    ))
                  : [
                      ["Mon–Thu", "6 AM – 2 PM"],
                      ["Fri–Sat", "6 AM – 3 PM"],
                      ["Sun", "7 AM – 1 PM"],
                    ].map(([day, h]) => (
                      <div
                        key={day}
                        className="flex justify-between border-b border-[var(--line)] pb-2 last:border-0"
                      >
                        <span className="text-[var(--text-secondary)]">
                          {day}
                        </span>
                        <span className="font-semibold text-[var(--text-primary)]">
                          {h}
                        </span>
                      </div>
                    ))}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
