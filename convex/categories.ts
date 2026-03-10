import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .collect()
      .then((cats) => cats.sort((a, b) => a.displayOrder - b.displayOrder));
  },
});

export const listActive = query({
  handler: async (ctx) => {
    const all = await ctx.db.query("categories").collect();
    return all
      .filter((c) => c.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    displayOrder: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("categories", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("categories"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const reorder = mutation({
  args: { order: v.array(v.string()) },
  handler: async (ctx, { order }) => {
    const all = await ctx.db.query("categories").collect();
    for (const cat of all) {
      const idx = order.indexOf(cat.slug);
      if (idx !== -1 && cat.displayOrder !== idx) {
        await ctx.db.patch(cat._id, { displayOrder: idx });
      }
    }
  },
});
