import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    const photos = await ctx.db.query("galleryPhotos").collect();
    const sorted = photos.sort((a, b) => a.displayOrder - b.displayOrder);

    return Promise.all(
      sorted.map(async (photo) => {
        let url = photo.imageUrl ?? null;
        if (!url && photo.imageId) {
          url = await ctx.storage.getUrl(photo.imageId);
        }
        return { ...photo, url };
      })
    );
  },
});

export const listVisible = query({
  handler: async (ctx) => {
    const photos = await ctx.db.query("galleryPhotos").collect();
    const sorted = photos
      .filter((p) => p.isVisible)
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return Promise.all(
      sorted.map(async (photo) => {
        let url = photo.imageUrl ?? null;
        if (!url && photo.imageId) {
          url = await ctx.storage.getUrl(photo.imageId);
        }
        return { ...photo, url };
      })
    );
  },
});

export const create = mutation({
  args: {
    imageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    caption: v.optional(v.string()),
    displayOrder: v.number(),
    isVisible: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("galleryPhotos", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("galleryPhotos"),
    imageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    caption: v.optional(v.string()),
    displayOrder: v.optional(v.number()),
    isVisible: v.optional(v.boolean()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("galleryPhotos") },
  handler: async (ctx, { id }) => {
    const photo = await ctx.db.get(id);
    if (photo?.imageId) {
      await ctx.storage.delete(photo.imageId);
    }
    await ctx.db.delete(id);
  },
});
