import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { Id } from "../../../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MailOpen, Trash2, Inbox } from "lucide-react";
import DonutSpinner from "../../components/ui/DonutSpinner";
import { cn } from "../../lib/utils";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessagesPage,
});

function AdminMessagesPage() {
  const messages = useQuery(api.contactMessages.list);
  const markRead = useMutation(api.contactMessages.markRead);
  const markUnread = useMutation(api.contactMessages.markUnread);
  const removeMessage = useMutation(api.contactMessages.remove);

  if (messages === undefined) return <DonutSpinner className="mt-16" />;

  const unreadCount = messages.filter((m) => !m.isRead).length;

  const toggleRead = async (id: Id<"contactMessages">, isRead: boolean) => {
    if (isRead) {
      await markUnread({ id });
    } else {
      await markRead({ id });
    }
  };

  const formatDate = (ts: number) =>
    new Date(ts).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="display-title text-2xl font-bold text-[var(--text-primary)]">
            Messages
          </h1>
          <p className="text-sm text-[var(--text-muted)]">
            {messages.length} messages · {unreadCount} unread
          </p>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="card-shell flex flex-col items-center rounded-2xl py-16 text-center">
          <Inbox size={48} className="mb-4 text-[var(--text-muted)]" />
          <p className="text-lg font-semibold text-[var(--text-primary)]">
            No messages
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            Contact form submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg._id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={cn(
                  "card-shell rounded-xl p-5",
                  !msg.isRead && "border-l-4 border-l-[var(--donut-pink)]"
                )}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      msg.isRead
                        ? "bg-[var(--surface-strong)] text-[var(--text-muted)]"
                        : "bg-[var(--donut-pink-soft)] text-[var(--donut-pink)]"
                    )}
                  >
                    {msg.isRead ? <MailOpen size={18} /> : <Mail size={18} />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          "text-sm",
                          msg.isRead
                            ? "text-[var(--text-secondary)]"
                            : "font-bold text-[var(--text-primary)]"
                        )}
                      >
                        {msg.name}
                      </p>
                      <span className="text-xs text-[var(--text-muted)]">
                        {msg.email}
                        {(msg as any).phone && ` · ${(msg as any).phone}`}
                      </span>
                      <span className="ml-auto text-xs text-[var(--text-muted)]">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-[var(--text-muted)]">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="mt-3 flex justify-end gap-2 border-t border-[var(--line)] pt-3">
                  <button
                    type="button"
                    onClick={() => toggleRead(msg._id, msg.isRead)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:bg-[var(--donut-pink-soft)] hover:text-[var(--donut-pink)]"
                  >
                    {msg.isRead ? (
                      <>
                        <Mail size={14} /> Mark Unread
                      </>
                    ) : (
                      <>
                        <MailOpen size={14} /> Mark Read
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => removeMessage({ id: msg._id })}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--text-muted)] transition hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
