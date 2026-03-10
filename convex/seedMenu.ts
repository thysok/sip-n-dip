import { mutation } from "./_generated/server";

export const run = mutation({
  handler: async (ctx) => {
    // Clear existing menu data
    const existingItems = await ctx.db.query("menuItems").collect();
    for (const item of existingItems) {
      await ctx.db.delete(item._id);
    }
    const existingCats = await ctx.db.query("categories").collect();
    for (const cat of existingCats) {
      await ctx.db.delete(cat._id);
    }
    const existingFeatured = await ctx.db.query("featuredDonuts").collect();
    for (const f of existingFeatured) {
      await ctx.db.delete(f._id);
    }

    // ─── Categories ───
    const combosId = await ctx.db.insert("categories", {
      name: "Bundles",
      slug: "bundles",
      displayOrder: 0,
      isActive: true,
    });
    const donutsId = await ctx.db.insert("categories", {
      name: "Donuts",
      slug: "donuts",
      displayOrder: 1,
      isActive: true,
    });
    const pastriesId = await ctx.db.insert("categories", {
      name: "Pastries",
      slug: "pastries",
      displayOrder: 2,
      isActive: true,
    });
    const smoothiesId = await ctx.db.insert("categories", {
      name: "Smoothies & Lattes",
      slug: "smoothies",
      displayOrder: 3,
      isActive: true,
    });
    const milkTeaId = await ctx.db.insert("categories", {
      name: "Milk Tea & Boba",
      slug: "milk-tea",
      displayOrder: 4,
      isActive: true,
    });
    const breakfastId = await ctx.db.insert("categories", {
      name: "Breakfast",
      slug: "breakfast",
      displayOrder: 5,
      isActive: true,
    });

    // ─── Donuts ───
    let order = 0;
    await ctx.db.insert("menuItems", {
      name: "Glaze Donut",
      description: "Soft, ring-shaped pastry with a smooth, sweet glaze.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    const strawberrySprinkleId = await ctx.db.insert("menuItems", {
      name: "Strawberry Icing with Sprinkles",
      description: "A soft donut topped with strawberry icing and colorful sprinkles.",
      price: 1.69,
      categoryId: donutsId,
      badge: "popular",
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Sugar",
      description: "Soft, fluffy rings of dough coated in a light dusting of sugar.",
      price: 1.69,
      categoryId: donutsId,
      badge: "popular",
      isActive: true,
      displayOrder: order++,
    });
    const bostonCreamId = await ctx.db.insert("menuItems", {
      name: "Boston Cream",
      description: "A round donut filled with creamy custard, topped with a layer of rich chocolate glaze.",
      price: 1.69,
      categoryId: donutsId,
      badge: "popular",
      isActive: true,
      displayOrder: order++,
    });
    const mapleBaconId = await ctx.db.insert("menuItems", {
      name: "Maple Bacon",
      description: "Topped with crispy bacon pieces and a rich maple glaze.",
      price: 2.29,
      categoryId: donutsId,
      badge: "popular",
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Fruity Pebbles",
      description: "Covered in a vibrant layer of Fruity Pebbles cereal, this donut features a sweet glaze base.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Vanilla Oreo",
      description: "Topped with crushed Oreo cookies and a vanilla glaze.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Chocolate Oreo",
      description: "Topped with crushed Oreo cookies and a rich chocolate glaze.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    const chocolateSmoresId = await ctx.db.insert("menuItems", {
      name: "Chocolate S'mores",
      description: "Topped with chocolate glaze, mini marshmallows, and crumbled graham crackers.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Vanilla S'mores",
      description: "Topped with vanilla icing, marshmallows, and crushed graham crackers.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Maple",
      description: "A classic donut topped with a smooth maple glaze.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Vanilla Sprinkle",
      description: "A soft donut with a vanilla glaze, topped with colorful sprinkles.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Chocolate Icing with Sprinkles",
      description: "Topped with chocolate icing and colorful sprinkles for a delightful combination of sweetness and crunch.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Chocolate Icing",
      description: "Soft, fluffy donut topped with a rich, glossy chocolate icing.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Strawberry Icing",
      description: "Topped with a glossy strawberry icing, this classic donut features a sweet, fruity flavor.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Raspberry Sugar",
      description: "Soft, fluffy donut coated in granulated sugar with a sweet raspberry filling.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Raspberry Glaze",
      description: "Soft, fluffy donut with a sweet raspberry glaze.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Chocolate Peanut",
      description: "A donut topped with rich chocolate glaze and generously coated with crunchy chopped peanuts.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Vanilla Peanut",
      description: "Topped with a rich vanilla glaze and generously sprinkled with crunchy peanuts.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Vanilla Coconut",
      description: "Topped with a layer of shredded coconut over a smooth vanilla glaze.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Chocolate Coconut",
      description: "A donut topped with rich chocolate glaze and generously coated with shredded coconut.",
      price: 1.69,
      categoryId: donutsId,
      isActive: true,
      displayOrder: order++,
    });

    // ─── Pastries ───
    order = 0;
    await ctx.db.insert("menuItems", {
      name: "Apple Fritter",
      description: "Chunks of apple and cinnamon embedded in a sweet, crispy dough, coated with a light glaze.",
      price: 2.99,
      categoryId: pastriesId,
      badge: "popular",
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Cinnamon Roll",
      description: "Sweet cinnamon swirls topped with a light glaze.",
      price: 2.99,
      categoryId: pastriesId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Long John",
      description: "A rectangular donut, typically filled with custard or cream, topped with chocolate or maple icing.",
      price: 2.29,
      categoryId: pastriesId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Kolache (Each)",
      description: "Savory filled pastry — a perfect grab-and-go breakfast.",
      price: 3.99,
      categoryId: pastriesId,
      isActive: true,
      displayOrder: order++,
    });

    // ─── Smoothies & Lattes ───
    order = 0;
    await ctx.db.insert("menuItems", {
      name: "Mocha Iced Latte",
      description: "Mocha iced latte with choices of boba or jelly, including strawberry, mango, passion, coconut, and honey boba.",
      price: 6.59,
      categoryId: smoothiesId,
      badge: "popular",
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Caramel Latte",
      description: "Rich caramel iced latte with optional boba or jelly add-ins.",
      price: 6.59,
      categoryId: smoothiesId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Vanilla Latte",
      description: "Creamy vanilla latte smoothie with optional add-ins like popping boba, jelly, or tapioca pearls.",
      price: 6.59,
      categoryId: smoothiesId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Taro Smoothie",
      description: "Creamy taro flavor with choice of boba, jelly, or none. Multiple flavor options available.",
      price: 6.59,
      categoryId: smoothiesId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Mango Smoothie",
      description: "Mango smoothie with choice of bursting boba, jellies, or honey tapioca pearls.",
      price: 6.59,
      categoryId: smoothiesId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Strawberry Smoothie",
      description: "Strawberry smoothie with choice of boba, jellies, or no boba.",
      price: 6.59,
      categoryId: smoothiesId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Watermelon Smoothie",
      description: "Refreshing watermelon blend with popping boba, jellies, or honey boba.",
      price: 6.59,
      categoryId: smoothiesId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Cookies N Cream Smoothie",
      description: "Creamy blend of cookies and cream. Choice of popping boba, fruit jellies, or honey boba.",
      price: 6.59,
      categoryId: smoothiesId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Pina Colada Smoothie",
      description: "Pineapple, coconut blend. Choice of boba or jellies: strawberry, mango, passion, coconut, or traditional tapioca.",
      price: 6.59,
      categoryId: smoothiesId,
      badge: "popular",
      isActive: true,
      displayOrder: order++,
    });

    // ─── Milk Tea & Boba ───
    order = 0;
    await ctx.db.insert("menuItems", {
      name: "Brown Sugar Milk Tea",
      description: "Brown sugar milk tea with options like popping boba, assorted jellies, or traditional tapioca.",
      price: 5.99,
      categoryId: milkTeaId,
      badge: "popular",
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Thai Tea",
      description: "Thai tea with options for strawberry and mango popping boba, various jellies, or tapioca.",
      price: 4.49,
      categoryId: milkTeaId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Taro Milk Tea",
      description: "Sweet, creamy taro milk tea. Choice of strawberry, mango, or passion fruit popping boba.",
      price: 4.49,
      categoryId: milkTeaId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Strawberry Milk Tea",
      description: "Strawberry milk tea with choice of boba or jelly options including popping boba or honey boba.",
      price: 4.49,
      categoryId: milkTeaId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Green Milk Tea",
      description: "Green milk tea with optional boba or jelly.",
      price: 4.49,
      categoryId: milkTeaId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Coconut Milk Tea",
      description: "Coconut milk tea with choice of boba: strawberry, mango, passion popping boba, or honey tapioca.",
      price: 4.49,
      categoryId: milkTeaId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Spice Chai Tea",
      description: "Spice chai tea with options of popping boba, jelly, or tapioca.",
      price: 4.49,
      categoryId: milkTeaId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Honeydew Tea",
      description: "Honeydew tea with various boba options including popping bobas, jelly, or classic tapioca.",
      price: 4.49,
      categoryId: milkTeaId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Regular Milk Tea",
      description: "Sweet tea with milk. Choose from various boba options: popping boba, jelly, tapioca, or no boba.",
      price: 4.49,
      categoryId: milkTeaId,
      isActive: true,
      displayOrder: order++,
    });

    // ─── Breakfast ───
    order = 0;
    await ctx.db.insert("menuItems", {
      name: "Breakfast Burrito",
      description: "Bacon, sausage, eggs and potatoes wrapped in a warm tortilla.",
      price: 4.99,
      categoryId: breakfastId,
      isActive: true,
      displayOrder: order++,
    });

    // ─── Bundles ───
    order = 0;
    await ctx.db.insert("menuItems", {
      name: "1 Dozen Assorted",
      description: "A variety of 12 delicious donuts including glazed, chocolate, filled, and specialty flavors, selected by our staff.",
      price: 16.99,
      categoryId: combosId,
      badge: "popular",
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "1/2 Dozen Assorted",
      description: "A variety of delicious donuts picked by our staff. Special requests are subject to availability.",
      price: 9.99,
      categoryId: combosId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Donut Holes (Half Dozen)",
      description: "Half dozen donut holes: a mix of glazed, chocolate, and cinnamon sugar-coated.",
      price: 2.99,
      categoryId: combosId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Donut Holes (Dozen)",
      description: "A dozen donut holes including a mix of glazed, chocolate, and cinnamon varieties.",
      price: 2.99,
      categoryId: combosId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Kolache (Half Dozen)",
      description: "Six savory kolaches — perfect for sharing or meal prep.",
      price: 21.99,
      categoryId: combosId,
      isActive: true,
      displayOrder: order++,
    });
    await ctx.db.insert("menuItems", {
      name: "Kolache (Dozen)",
      description: "A full dozen kolaches for the whole crew.",
      price: 41.79,
      categoryId: combosId,
      isActive: true,
      displayOrder: order++,
    });

    // ─── Featured Donuts ───
    await ctx.db.insert("featuredDonuts", { menuItemId: strawberrySprinkleId, displayOrder: 0 });
    await ctx.db.insert("featuredDonuts", { menuItemId: bostonCreamId, displayOrder: 1 });
    await ctx.db.insert("featuredDonuts", { menuItemId: mapleBaconId, displayOrder: 2 });
    await ctx.db.insert("featuredDonuts", { menuItemId: chocolateSmoresId, displayOrder: 3 });

    return {
      categories: 6,
      menuItems:
        21 + // donuts
        4 +  // pastries
        9 +  // smoothies
        9 +  // milk tea
        1 +  // breakfast
        6,   // bundles
      featured: 4,
    };
  },
});
