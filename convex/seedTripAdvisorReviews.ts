import { mutation } from "./_generated/server";

export const run = mutation({
  handler: async (ctx) => {
    const reviews = [
      {
        customerName: "Susan K.",
        rating: 5,
        text: "We drove by here in January on the way to an appointment. We stopped for donuts and really enjoyed them. Although this shop is over 30 minutes from our house we have made a special trip twice since then. We try different donuts each time. We particularly like the filled donuts and the red velvet ones. Prices are reasonable.",
        date: "2022-01-15",
        source: "TripAdvisor",
        isVisible: true,
      },
      {
        customerName: "mad55dj",
        rating: 5,
        text: "Great spot for donuts with a varied assortment in both size and style. Also great egg sandwiches and breakfast-related items. Very clean.",
        date: "2021-09-13",
        source: "TripAdvisor",
        isVisible: true,
      },
      {
        customerName: "Deborah",
        rating: 5,
        text: "The donuts and breakfast sandwiches were amazing, many choices. Chai tea was very good too. There were many choices in the donuts as well as the coffee rolls and fritters too. Definitely will return.",
        date: "2021-07-02",
        source: "TripAdvisor",
        isVisible: true,
      },
      {
        customerName: "Rob A.",
        rating: 5,
        text: "Great place to grab some good sized donuts! Nice variety compared to other places. Reasonably priced. Breakfast is available here but only have had the donuts! Great location on 192 in St. Cloud. Very friendly staff!",
        date: "2020-12-28",
        source: "TripAdvisor",
        isVisible: true,
      },
      {
        customerName: "Veronica",
        rating: 5,
        text: "Best donut place around. Always fresh donuts. Always a good variety. Yum yum. A quaint little donut shop here in St Cloud.",
        date: "2020-10-21",
        source: "TripAdvisor",
        isVisible: true,
      },
      {
        customerName: "Doug M.",
        rating: 5,
        text: "Stopped in on a recommendation from a local. Lots of variety and very fresh. Friendly staff, and the donuts are excellent. We were told by the local that this place had the best donuts in the county — we give these two thumbs up!",
        date: "2020-08-11",
        source: "TripAdvisor",
        isVisible: true,
      },
      {
        customerName: "Adrianna F.",
        rating: 5,
        text: "Best donuts in town! They have tons of flavors to choose from. They have smoothies with boba too and anime themed stuff for purchase. My favorite place to stop after work, don't miss it!",
        date: "2020-03-29",
        source: "TripAdvisor",
        isVisible: true,
      },
      {
        customerName: "Brittany M.",
        rating: 5,
        text: "Wow, the doughnuts are great, the bagel was great. There was a line the entire time. They had such an array of doughnuts, everything from your standard glazed to ones with fruity pebbles on them! Good prices too!",
        date: "2020-02-29",
        source: "TripAdvisor",
        isVisible: true,
      },
      {
        customerName: "CanaDad",
        rating: 5,
        text: "We were out for a walk in beautiful St. Cloud, had breakfast at the Koffee Kup and was told I had to try the donuts here. We agreed to split one, but once inside, the choices were too many and we decided to get one each. That was the correct decision, another coffee and donut please. Just means we walked the long way home, and would do it again in a heartbeat!",
        date: "2020-02-10",
        source: "TripAdvisor",
        isVisible: true,
      },
      {
        customerName: "Skeeter5639",
        rating: 5,
        text: "We recently moved to the Saint Cloud, FL area and I was looking for a good donut place. My favorite donut is a chocolate covered one. O my gosh, these are the BEST I have ever had anywhere. This is a must for breakfast, lunch or dinner!",
        date: "2020-02-08",
        source: "TripAdvisor",
        isVisible: true,
      },
    ];

    const existing = await ctx.db.query("reviews").collect();
    let added = 0;

    for (const review of reviews) {
      const isDupe = existing.some(
        (r) => r.customerName === review.customerName && r.source === "TripAdvisor"
      );
      if (!isDupe) {
        await ctx.db.insert("reviews", review);
        added++;
      }
    }

    // Store TripAdvisor aggregate rating
    for (const [key, val] of [["tripAdvisorRating", "5.0"], ["tripAdvisorReviewCount", "10"]] as const) {
      const ex = await ctx.db
        .query("shopSettings")
        .withIndex("by_key", (q) => q.eq("key", key))
        .first();
      if (ex) {
        await ctx.db.patch(ex._id, { value: val });
      } else {
        await ctx.db.insert("shopSettings", { key, value: val });
      }
    }

    return { added, total: reviews.length };
  },
});
