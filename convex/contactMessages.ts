import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    const messages = await ctx.db.query("contactMessages").collect();
    return messages.sort((a, b) => b.createdAt - a.createdAt);
  },
});

export const unreadCount = query({
  handler: async (ctx) => {
    const messages = await ctx.db.query("contactMessages").collect();
    return messages.filter((m) => !m.isRead).length;
  },
});

export const submit = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactMessages", {
      ...args,
      isRead: false,
      createdAt: Date.now(),
    });
  },
});

export const markRead = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { isRead: true });
  },
});

export const markUnread = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { isRead: false });
  },
});

export const remove = mutation({
  args: { id: v.id("contactMessages") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
