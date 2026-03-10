import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const setting = await ctx.db
      .query("shopSettings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    return setting?.value ?? null;
  },
});

export const getAll = query({
  handler: async (ctx) => {
    const settings = await ctx.db.query("shopSettings").collect();
    return Object.fromEntries(settings.map((s) => [s.key, s.value]));
  },
});

export const getImageUrl = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const setting = await ctx.db
      .query("shopSettings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    if (!setting?.value) return null;
    try {
      return await ctx.storage.getUrl(setting.value as any);
    } catch {
      return null;
    }
  },
});

export const set = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, { key, value }) => {
    const existing = await ctx.db
      .query("shopSettings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { value });
    } else {
      await ctx.db.insert("shopSettings", { key, value });
    }
  },
});
