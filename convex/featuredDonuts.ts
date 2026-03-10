import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => {
    const featured = await ctx.db.query("featuredDonuts").collect();
    const sorted = featured.sort((a, b) => a.displayOrder - b.displayOrder);

    const items = await Promise.all(
      sorted.map(async (f) => {
        const item = await ctx.db.get(f.menuItemId);
        if (!item) return null;
        const imageUrl = item.imageId ? await ctx.storage.getUrl(item.imageId) : null;
        return { ...item, imageUrl, featuredId: f._id, featuredOrder: f.displayOrder };
      })
    );

    return items.filter((item): item is NonNullable<typeof item> => item !== null);
  },
});

export const set = mutation({
  args: {
    items: v.array(
      v.object({
        menuItemId: v.id("menuItems"),
        displayOrder: v.number(),
      })
    ),
  },
  handler: async (ctx, { items }) => {
    const existing = await ctx.db.query("featuredDonuts").collect();
    for (const f of existing) {
      await ctx.db.delete(f._id);
    }
    for (const item of items) {
      await ctx.db.insert("featuredDonuts", item);
    }
  },
});
