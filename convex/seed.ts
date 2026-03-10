import { mutation } from "./_generated/server";

export const seedAll = mutation({
  handler: async (ctx) => {
    // Check if already seeded
    const existing = await ctx.db.query("categories").first();
    if (existing) {
      throw new Error("Database already seeded. Clear data first.");
    }

    // Categories
    const classicId = await ctx.db.insert("categories", {
      name: "Classic Donuts",
      slug: "classic",
      displayOrder: 0,
      isActive: true,
    });
    const specialtyId = await ctx.db.insert("categories", {
      name: "Specialty Donuts",
      slug: "specialty",
      displayOrder: 1,
      isActive: true,
    });
    const drinksId = await ctx.db.insert("categories", {
      name: "Drinks",
      slug: "drinks",
      displayOrder: 2,
      isActive: true,
    });
    const combosId = await ctx.db.insert("categories", {
      name: "Combos",
      slug: "combos",
      displayOrder: 3,
      isActive: true,
    });

    // Classic Donuts
    const glazedId = await ctx.db.insert("menuItems", {
      name: "Original Glazed",
      description: "Our signature ring donut with a warm, sweet glaze. The one that started it all.",
      price: 1.99,
      categoryId: classicId,
      badge: "popular",
      isActive: true,
      displayOrder: 0,
    });
    await ctx.db.insert("menuItems", {
      name: "Chocolate Frosted",
      description: "Classic ring donut topped with rich chocolate frosting.",
      price: 2.29,
      categoryId: classicId,
      isActive: true,
      displayOrder: 1,
    });
    await ctx.db.insert("menuItems", {
      name: "Powdered Sugar",
      description: "Light and fluffy, dusted generously with powdered sugar.",
      price: 1.99,
      categoryId: classicId,
      isActive: true,
      displayOrder: 2,
    });
    await ctx.db.insert("menuItems", {
      name: "Cinnamon Sugar",
      description: "Warm cinnamon and sugar coating on a soft, pillowy donut.",
      price: 1.99,
      categoryId: classicId,
      isActive: true,
      displayOrder: 3,
    });

    // Specialty Donuts
    const guavaId = await ctx.db.insert("menuItems", {
      name: "Guava & Cream Cheese",
      description: "Florida-inspired filled donut with sweet guava paste and tangy cream cheese.",
      price: 3.99,
      categoryId: specialtyId,
      badge: "new",
      isActive: true,
      displayOrder: 0,
    });
    await ctx.db.insert("menuItems", {
      name: "Key Lime Pie",
      description: "Topped with key lime glaze, graham cracker crumbs, and a dollop of whipped cream.",
      price: 3.79,
      categoryId: specialtyId,
      badge: "popular",
      isActive: true,
      displayOrder: 1,
    });
    await ctx.db.insert("menuItems", {
      name: "Maple Bacon Crunch",
      description: "Maple glaze with crispy bacon bits and a drizzle of caramel.",
      price: 3.99,
      categoryId: specialtyId,
      isActive: true,
      displayOrder: 2,
    });
    await ctx.db.insert("menuItems", {
      name: "Cookies & Cream",
      description: "Vanilla frosting loaded with crushed chocolate sandwich cookies.",
      price: 3.49,
      categoryId: specialtyId,
      isActive: true,
      displayOrder: 3,
    });

    // Drinks
    await ctx.db.insert("menuItems", {
      name: "Fresh Brewed Coffee",
      description: "Locally roasted, brewed fresh every hour. Regular or decaf.",
      price: 2.49,
      categoryId: drinksId,
      isActive: true,
      displayOrder: 0,
    });
    await ctx.db.insert("menuItems", {
      name: "Café con Leche",
      description: "Strong espresso with steamed whole milk, the Florida way.",
      price: 3.49,
      categoryId: drinksId,
      badge: "popular",
      isActive: true,
      displayOrder: 1,
    });
    await ctx.db.insert("menuItems", {
      name: "Fresh Squeezed OJ",
      description: "Made from Florida oranges, squeezed fresh daily.",
      price: 3.99,
      categoryId: drinksId,
      isActive: true,
      displayOrder: 2,
    });

    // Combos
    await ctx.db.insert("menuItems", {
      name: "The Early Bird",
      description: "2 classic donuts + a fresh brewed coffee. The perfect morning.",
      price: 5.49,
      categoryId: combosId,
      badge: "popular",
      isActive: true,
      displayOrder: 0,
    });
    await ctx.db.insert("menuItems", {
      name: "The Dozen Deal",
      description: "12 assorted donuts — pick your favorites or let us surprise you!",
      price: 16.99,
      categoryId: combosId,
      isActive: true,
      displayOrder: 1,
    });

    // Featured donuts
    await ctx.db.insert("featuredDonuts", { menuItemId: glazedId, displayOrder: 0 });
    await ctx.db.insert("featuredDonuts", { menuItemId: guavaId, displayOrder: 1 });

    // Reviews (real Google reviews)
    await ctx.db.insert("reviews", {
      customerName: "Alexandra Gregory",
      rating: 5,
      text: "Best donuts in St. Cloud. Small, family owned business. Donuts are always fresh. Can't ever go wrong with an original glazed donut. Cronuts are amazing and always sell out fast so get there early in the morning.",
      date: "2026-01-09",
      source: "Google",
      isVisible: true,
    });
    await ctx.db.insert("reviews", {
      customerName: "N'Daisha Carrington",
      rating: 5,
      text: "The atmosphere is nostalgic, like many other local spots in the area. But I've never been here before. As a first timer, I purchased half of dozen donuts, a dozen donut holes, and a vanilla cappuccino. Absolutely delicious. I can't wait to come back!",
      date: "2025-04-09",
      source: "Google",
      isVisible: true,
    });
    await ctx.db.insert("reviews", {
      customerName: "Local Guide",
      rating: 5,
      text: "Amazing cronuts and maple bacon donuts! The staff is super friendly and everything is always fresh. This is our go-to spot every weekend. Highly recommend the apple fritters too!",
      date: "2026-02-15",
      source: "Google",
      isVisible: true,
    });
    await ctx.db.insert("reviews", {
      customerName: "Happy Customer",
      rating: 5,
      text: "We drive from Kissimmee just for these donuts. The bacon egg and cheese sandwich is incredible for breakfast. Best donut shop in the area, hands down!",
      date: "2026-01-20",
      source: "Google",
      isVisible: true,
    });
    await ctx.db.insert("reviews", {
      customerName: "Weekend Regular",
      rating: 5,
      text: "Been coming here since they opened. Fresh donuts every single time. The apple fritters are the size of your head and the coffee is always hot and strong. Love this place!",
      date: "2025-11-30",
      source: "Google",
      isVisible: true,
    });

    // Team members
    await ctx.db.insert("teamMembers", {
      name: "Rosa & Miguel Delgado",
      role: "Founders",
      bio: "Rosa and Miguel started Sip n' Dip in 2018 with a dream, a family recipe, and a whole lot of dough (literally). Their passion for fresh, handmade donuts and strong community ties is what makes this shop special.",
      displayOrder: 0,
    });
    await ctx.db.insert("teamMembers", {
      name: "Danny Delgado",
      role: "Head Baker",
      bio: "Danny learned to make donuts at age 12, standing on a step stool next to his mom. Now he runs the kitchen, waking up at 3 AM to make sure every donut is perfect.",
      displayOrder: 1,
    });
    await ctx.db.insert("teamMembers", {
      name: "Abuela Carmen",
      role: "Chief Taste Tester",
      bio: "Carmen is the secret ingredient. Her honest feedback (and occasional secret recipe contribution) keeps the quality sky-high. If Abuela approves, it goes on the menu.",
      displayOrder: 2,
    });

    // Shop settings
    const settings: Record<string, string> = {
      shopName: "Sip n' Dip Donuts",
      tagline: "Fresh. Glazed. Loved.",
      address: "1234 Sunshine Blvd, Tampa, FL 33601",
      phone: "(813) 555-DONUT",
      email: "hello@sipndiponuts.com",
      hours: JSON.stringify({
        monday: "6:00 AM – 2:00 PM",
        tuesday: "6:00 AM – 2:00 PM",
        wednesday: "6:00 AM – 2:00 PM",
        thursday: "6:00 AM – 2:00 PM",
        friday: "6:00 AM – 3:00 PM",
        saturday: "6:00 AM – 3:00 PM",
        sunday: "7:00 AM – 1:00 PM",
      }),
      aboutContent:
        "Sip n' Dip Donuts started as a family dream in 2018. Rosa and Miguel Delgado wanted to bring their love of handmade donuts and strong Cuban coffee to their Tampa neighborhood.\n\nWhat began as a tiny storefront with just six donut flavors has grown into a beloved community hub — a place where regulars are greeted by name, kids press their faces against the display case, and every donut is still made by hand, from scratch, every single morning.\n\nWe believe donuts should be simple, fresh, and made with love. No shortcuts, no preservatives — just good dough, great toppings, and a whole lot of heart.\n\nWhether you're grabbing your morning coffee and a glazed, celebrating a birthday with a custom dozen, or just stopping in to say hi — you're family here.",
    };

    for (const [key, value] of Object.entries(settings)) {
      await ctx.db.insert("shopSettings", { key, value });
    }
  },
});
