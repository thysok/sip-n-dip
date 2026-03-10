import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    slug: v.string(),
    displayOrder: v.number(),
    isActive: v.boolean(),
  }).index("by_slug", ["slug"]),

  menuItems: defineTable({
    name: v.string(),
    description: v.string(),
    price: v.number(),
    imageId: v.optional(v.id("_storage")),
    categoryId: v.id("categories"),
    badge: v.optional(v.string()),
    isActive: v.boolean(),
    displayOrder: v.number(),
  }).index("by_category", ["categoryId"]),

  galleryPhotos: defineTable({
    imageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    caption: v.optional(v.string()),
    displayOrder: v.number(),
    isVisible: v.boolean(),
  }),

  reviews: defineTable({
    customerName: v.string(),
    rating: v.number(),
    text: v.string(),
    date: v.string(),
    photoId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    source: v.optional(v.string()),
    isVisible: v.boolean(),
  }),

  teamMembers: defineTable({
    name: v.string(),
    role: v.string(),
    bio: v.string(),
    photoId: v.optional(v.id("_storage")),
    displayOrder: v.number(),
  }),

  shopSettings: defineTable({
    key: v.string(),
    value: v.string(),
  }).index("by_key", ["key"]),

  contactMessages: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    message: v.string(),
    isRead: v.boolean(),
    createdAt: v.number(),
  }),

  featuredDonuts: defineTable({
    menuItemId: v.id("menuItems"),
    displayOrder: v.number(),
  }),
});
