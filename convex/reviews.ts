import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const listVisible = query({
  handler: async (ctx) => {
    const reviews = await ctx.db.query("reviews").collect();
    return reviews.filter((r) => r.isVisible);
  },
});

export const listAll = query({
  handler: async (ctx) => {
    return await ctx.db.query("reviews").collect();
  },
});

export const getTopReviews = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit }) => {
    const reviews = await ctx.db.query("reviews").collect();
    return reviews
      .filter((r) => r.isVisible)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit ?? 4);
  },
});

export const create = mutation({
  args: {
    customerName: v.string(),
    rating: v.number(),
    text: v.string(),
    date: v.string(),
    photoId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    source: v.optional(v.string()),
    isVisible: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("reviews", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("reviews"),
    customerName: v.optional(v.string()),
    rating: v.optional(v.number()),
    text: v.optional(v.string()),
    date: v.optional(v.string()),
    photoId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    source: v.optional(v.string()),
    isVisible: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
