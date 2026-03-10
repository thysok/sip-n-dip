import { mutation } from "./_generated/server";

export const run = mutation({
  handler: async (ctx) => {
    const yelpReviews = [
      {
        customerName: "Edwinn E.",
        rating: 5,
        text: "This was my first visit to this location. I was driving through the area and decided to stop after hearing they had some really good donuts. As soon as I walked in, I was greeted by friendly staff. The service was quick, and there was a steady flow of customers coming in and out. Clearly a local favorite. The s'mores donut topped with marshmallows and the chocolate-covered bavarian cream donut caught my eye. Everything was fresh and delicious. This is a small, family-owned business in St. Cloud, and you can really feel the community support.",
        date: "2026-01-30",
        source: "Yelp",
        isVisible: true,
      },
      {
        customerName: "Dylan M.",
        rating: 5,
        text: "Thank you so much to Sip and Dip Donuts for going out of your way, creating custom donuts for our gender reveal — they came out absolutely beautiful and we're super excited for our baby girl on the way. Very filled and heavy donuts and absolutely delicious. If you guys ever want pink Boston cream donuts, you gotta get it with the strawberry icing on top. It was amazing.",
        date: "2025-10-17",
        source: "Yelp",
        isVisible: true,
      },
      {
        customerName: "Anthony M.",
        rating: 5,
        text: "While traveling I always scout out donut spots. I was not disappointed with Sip & Dip. Lots of donuts to choose from and the iced coffee options were great too. Staff were great and the shop is clean.",
        date: "2026-03-07",
        source: "Yelp",
        isVisible: true,
      },
      {
        customerName: "Lo L.",
        rating: 5,
        text: "Wow amazingly delicious. This place has very soft delicious donuts to choose from. I've always read about it but never had a chance to stop by. We had an event at work and decided to take some there and I'm glad I stopped by to get them. The young lady that helped me was so kind and she gave me some good advice. Now this is my go to donut shop.",
        date: "2026-02-21",
        source: "Yelp",
        isVisible: true,
      },
      {
        customerName: "Samantha W.",
        rating: 5,
        text: "Hands down the best donuts ever!! They have a huge assortment of all the yummy donuts plus their breakfast sandwiches are delish and the Thai tea with Boba is my favorite!",
        date: "2026-02-05",
        source: "Yelp",
        isVisible: true,
      },
      {
        customerName: "Amber-Lynn B.",
        rating: 4,
        text: "Donuts here are awesome. Dunkin' Donuts right across the street but Sip N' Dip will win every time.",
        date: "2025-08-02",
        source: "Yelp",
        isVisible: true,
      },
      {
        customerName: "Lanie S.",
        rating: 5,
        text: "Definitely recommend this place, the donuts were fluffy and soft. We only got six donuts on our way back home to Melbourne, I knew I should've gotten twelve. Next time we're in the area will definitely stop here again, will get twelve or even two dozen.",
        date: "2025-10-25",
        source: "Yelp",
        isVisible: true,
      },
    ];

    // Check for duplicates before inserting
    const existing = await ctx.db.query("reviews").collect();
    let added = 0;

    for (const review of yelpReviews) {
      const isDupe = existing.some(
        (r) => r.customerName === review.customerName && r.source === "Yelp"
      );
      if (!isDupe) {
        await ctx.db.insert("reviews", review);
        added++;
      }
    }

    // Store Yelp aggregate rating
    for (const [key, val] of [["yelpRating", "4.4"], ["yelpReviewCount", "433"]] as const) {
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

    return { added, total: yelpReviews.length };
  },
});
