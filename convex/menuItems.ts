import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    const items = await ctx.db.query("menuItems").collect();
    const withUrls = await Promise.all(
      items.map(async (item) => ({
        ...item,
        imageUrl: item.imageId ? await ctx.storage.getUrl(item.imageId) : null,
      }))
    );
    return withUrls.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

export const listActive = query({
  handler: async (ctx) => {
    const items = await ctx.db.query("menuItems").collect();
    const active = items.filter((i) => i.isActive);
    const withUrls = await Promise.all(
      active.map(async (item) => ({
        ...item,
        imageUrl: item.imageId ? await ctx.storage.getUrl(item.imageId) : null,
      }))
    );
    return withUrls.sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

export const listByCategory = query({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, { categoryId }) => {
    const items = await ctx.db
      .query("menuItems")
      .withIndex("by_category", (q) => q.eq("categoryId", categoryId))
      .collect();
    return items
      .filter((i) => i.isActive)
      .sort((a, b) => a.displayOrder - b.displayOrder);
  },
});

export const getById = query({
  args: { id: v.id("menuItems") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    price: v.number(),
    imageId: v.optional(v.id("_storage")),
    categoryId: v.id("categories"),
    badge: v.optional(v.string()),
    isActive: v.boolean(),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("menuItems", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("menuItems"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    price: v.optional(v.number()),
    imageId: v.optional(v.id("_storage")),
    categoryId: v.optional(v.id("categories")),
    badge: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("menuItems") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
