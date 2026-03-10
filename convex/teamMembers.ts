import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    const members = await ctx.db.query("teamMembers").collect();
    const sorted = members.sort((a, b) => a.displayOrder - b.displayOrder);
    return Promise.all(
      sorted.map(async (m) => ({
        ...m,
        photoUrl: m.photoId ? await ctx.storage.getUrl(m.photoId) : null,
      }))
    );
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    bio: v.string(),
    photoId: v.optional(v.id("_storage")),
    displayOrder: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("teamMembers", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("teamMembers"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    bio: v.optional(v.string()),
    photoId: v.optional(v.id("_storage")),
    displayOrder: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("teamMembers") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
