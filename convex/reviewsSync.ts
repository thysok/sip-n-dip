import { action, mutation } from "./_generated/server";
import { v } from "convex/values";

const GOOGLE_PLACE_ID = "ChIJ_y56dluO3YgRT4A_Xe9JBjQ";

const reviewSchema = v.object({
  customerName: v.string(),
  rating: v.number(),
  text: v.string(),
  date: v.string(),
  imageUrl: v.optional(v.string()),
  source: v.string(),
});

/* ───── Shared upsert mutation ───── */
export const upsertReviews = mutation({
  args: {
    reviews: v.array(reviewSchema),
    settingsPrefix: v.string(),
    totalRating: v.number(),
    totalCount: v.number(),
  },
  handler: async (ctx, { reviews, settingsPrefix, totalRating, totalCount }) => {
    const ratingKey = `${settingsPrefix}Rating`;
    const countKey = `${settingsPrefix}ReviewCount`;

    for (const [key, val] of [[ratingKey, String(totalRating)], [countKey, String(totalCount)]] as const) {
      const existing = await ctx.db
        .query("shopSettings")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();
      if (existing) {
        await ctx.db.patch(existing._id, { value: val });
      } else {
        await ctx.db.insert("shopSettings", { key, value: val });
      }
    }

    for (const review of reviews) {
      if (!review.text) continue;
      const all = await ctx.db.query("reviews").collect();
      const match = all.find(
        (r) => r.customerName === review.customerName && r.source === review.source
      );
      if (match) {
        await ctx.db.patch(match._id, {
          rating: review.rating,
          text: review.text,
          date: review.date,
          imageUrl: review.imageUrl,
        });
      } else {
        await ctx.db.insert("reviews", { ...review, isVisible: true });
      }
    }
  },
});

/* ───── Google sync ───── */
export const syncGoogle = action({
  handler: async (ctx) => {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_PLACES_API_KEY not set in Convex env vars.");

    const url = `https://places.googleapis.com/v1/places/${GOOGLE_PLACE_ID}?fields=reviews,rating,userRatingCount&languageCode=en`;
    const response = await fetch(url, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews,rating,userRatingCount",
      },
    });

    let reviews: any[] = [];
    let totalRating = 4.6;
    let totalCount = 0;

    if (response.ok) {
      const data = await response.json();
      totalRating = data.rating ?? 4.6;
      totalCount = data.userRatingCount ?? 0;
      reviews = (data.reviews ?? []).map((r: any) => ({
        customerName: r.authorAttribution?.displayName ?? "Google User",
        rating: r.rating,
        text: r.text?.text ?? r.originalText?.text ?? "",
        date: r.publishTime ? r.publishTime.split("T")[0] : new Date().toISOString().split("T")[0],
        imageUrl: r.authorAttribution?.photoUri ?? undefined,
        source: "Google",
      }));
    } else {
      const legacyUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${apiKey}`;
      const legacyRes = await fetch(legacyUrl);
      const legacyData = await legacyRes.json();
      if (legacyData.status !== "OK") throw new Error(`Google API: ${legacyData.status}`);
      const result = legacyData.result;
      totalRating = result.rating ?? 4.6;
      totalCount = result.user_ratings_total ?? 0;
      reviews = (result.reviews ?? []).map((r: any) => ({
        customerName: r.author_name,
        rating: r.rating,
        text: r.text,
        date: new Date(r.time * 1000).toISOString().split("T")[0],
        imageUrl: r.profile_photo_url ?? undefined,
        source: "Google",
      }));
    }

    await ctx.runMutation("reviewsSync:upsertReviews" as any, {
      reviews,
      settingsPrefix: "google",
      totalRating,
      totalCount,
    });

    return { synced: reviews.length, totalRating, totalCount };
  },
});

/* ───── Yelp sync ───── */
export const syncYelp = action({
  handler: async (ctx) => {
    const apiKey = process.env.YELP_API_KEY;
    if (!apiKey) throw new Error("YELP_API_KEY not set in Convex env vars. Get one at https://www.yelp.com/developers");

    // Search for business
    const searchUrl = `https://api.yelp.com/v3/businesses/search?term=Sip+N+Dip+Donuts&location=Saint+Cloud+FL&limit=1`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!searchRes.ok) throw new Error(`Yelp search failed: ${searchRes.status}`);

    const searchData = await searchRes.json();
    if (!searchData.businesses?.length) throw new Error("Business not found on Yelp");

    const biz = searchData.businesses[0];
    const totalRating = biz.rating ?? 0;
    const totalCount = biz.review_count ?? 0;

    // Get reviews
    const reviewsUrl = `https://api.yelp.com/v3/businesses/${biz.id}/reviews?limit=20&sort_by=yelp_sort`;
    const reviewsRes = await fetch(reviewsUrl, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!reviewsRes.ok) throw new Error(`Yelp reviews failed: ${reviewsRes.status}`);

    const reviewsData = await reviewsRes.json();
    const reviews = (reviewsData.reviews ?? []).map((r: any) => ({
      customerName: r.user?.name ?? "Yelp User",
      rating: r.rating,
      text: r.text,
      date: r.time_created ? r.time_created.split(" ")[0] : new Date().toISOString().split("T")[0],
      imageUrl: r.user?.image_url ?? undefined,
      source: "Yelp",
    }));

    await ctx.runMutation("reviewsSync:upsertReviews" as any, {
      reviews,
      settingsPrefix: "yelp",
      totalRating,
      totalCount,
    });

    return { synced: reviews.length, totalRating, totalCount };
  },
});
