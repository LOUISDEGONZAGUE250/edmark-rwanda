const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const { authenticate, requireAdmin } = require("../middleware/auth");

const fallbackProducts = [
    {
        id: 1,
        name: "Shake Off",
        description: "A fiber-rich cleansing drink that detoxifies your system and helps you feel full, naturally.",
        tagline: "Detoxify. Cleanse. Feel Amazing in Just 8 Hours.",
        benefits: ["Fast and effective — see results in just eight hours.", "Comes in two delicious flavors — Pandan and Lemon.", "Keeps the digestive tract clean, healthy and feeling of fullness.", "Absorbs fat and facilitates metabolism."],
        ingredients: ["Dietary fiber blend", "Natural botanical extracts", "Pandan and Lemon flavors"],
        size: "30 sachets",
        price: 42000,
        image_url: "images/shake-off.png",
        category: "Healthy Slimming Programme",
        stock_quantity: 20,
        featured: true,
    },
    {
        id: 2,
        name: "MRT Complex",
        description: "A delicious, low-calorie meal replacement loaded with complete vitamins, proteins, and energy-releasing amino acids.",
        tagline: "Burn Fat. Cut Calories. No Hunger Pangs.",
        benefits: ["Replaces your meal to help you cut calories safely and effectively.", "Loaded with complete vitamins, proteins, and energy-releasing amino acids.", "Delicious, highly soluble and low in calories.", "Comes in three delicious flavors — chocolate, vanilla, and strawberry."],
        ingredients: ["Vitamins and minerals", "Protein blend", "Energy-releasing amino acids"],
        size: "Box of 30 sachets",
        price: 55000,
        image_url: "images/mrt-complex.png",
        category: "Healthcare & Wellness",
        stock_quantity: 18,
        featured: true,
    },
    {
        id: 3,
        name: "Splina Liquid Chlorophyll",
        description: "A nutritional drink made of fresh and pure liquid chlorophyll from White Mulberry Leaves.",
        tagline: "Purify Your Body. Balance Your pH.",
        benefits: ["Balances acid and alkaline levels in the body.", "Cleanses the digestive system and helps purify the blood.", "Rich in Vitamins A, C and E, Zinc, Folic Acid, Calcium, Magnesium, and Iron.", "Boosts the immune system and increases oxygen supply in the blood."],
        ingredients: ["Chlorophyll from White Mulberry Leaves", "Vitamins A, C and E", "Zinc, Folic Acid, Calcium, Magnesium and Iron", "Purified water"],
        size: "500 ml",
        price: 57000,
        image_url: "images/splina.jpg",
        category: "Healthcare & Wellness",
        stock_quantity: 15,
        featured: true,
    },
    {
        id: 4,
        name: "Ginseng Coffee",
        description: "Finest Arabica coffee beans from Brazil and Colombia infused with Korean Ginseng extract.",
        tagline: "Smooth, Elegant and Refreshing.",
        benefits: ["A smooth, elegant and refreshing coffee drinking experience.", "Infused with Korean Ginseng extract, known for increasing longevity.", "Made from a natural blend of the finest Arabica coffee beans.", "A healthy coffee that will satisfy your discriminating taste."],
        ingredients: ["Arabica coffee beans", "Korean Ginseng extract"],
        size: "Single serve sachet",
        price: 20200,
        image_url: "images/ginseng-coffee.jpg",
        category: "Lifestyle Beverages",
        stock_quantity: 30,
        featured: false,
    },
    {
        id: 5,
        name: "Red Yeast Coffee",
        description: "Deep, full-bodied coffee blended with red yeast rice for optimal cholesterol health.",
        tagline: "Rejuvenate Your Heart, Body and Mind.",
        benefits: ["Deep and full-bodied with a bold, complex flavor.", "Supports optimal cholesterol health.", "Made from an organic blend of premium imported coffee beans and red yeast rice.", "A crisp finish that lingers in your taste buds."],
        ingredients: ["Premium imported coffee beans", "Red yeast rice"],
        size: "Single serve sachet",
        price: 20200,
        image_url: "images/red-coffee.png",
        category: "Lifestyle Beverages",
        stock_quantity: 25,
        featured: false,
    },
    {
        id: 6,
        name: "Cafe Troika",
        description: "3X Stronger. 3X Power. 3X Stamina. A premium 3-in-1 coffee crafted with Ginseng, Tongkat Ali and Ganoderma.",
        tagline: "3X Stronger · 3X Power · 3X Stamina.",
        benefits: ["Infused with Korean Ginseng to boost energy and support the immune system.", "Tongkat Ali to combat fatigue and boost stamina and vitality.", "Ganoderma, the 'miracle mushroom', for cardiovascular and immune support.", "Packed gourmet goodness in every sachet to get you ready for the day."],
        ingredients: ["Premium coffee", "Ginseng extract", "Tongkat Ali", "Ganoderma extract"],
        size: "Box of 20 sachets",
        price: 21000,
        image_url: "images/red-coffee.png",
        category: "Lifestyle Beverages",
        stock_quantity: 22,
        featured: false,
    },
    {
        id: 7,
        name: "Cafe 73",
        description: "A sugar-free yet deliciously crisp coffee made from the best quality coffee beans with Ganoderma lucidum (Ling Zhi) extract.",
        tagline: "Sugar-Free Coffee with Ganoderma Extract.",
        benefits: ["Sugar-free yet tastefully crisp and delicious.", "Boosts immune system and stamina.", "Ganoderma extract that offers health benefits.", "Oxygenates the body and balances body pH.", "Supports blood circulation and rejuvenates cells."],
        ingredients: ["Best quality coffee beans", "Ganoderma lucidum (Ling Zhi) extract", "Non-dairy creamer"],
        size: "Box of 20 sachets",
        price: 18000,
        image_url: "images/red-coffee.png",
        category: "Lifestyle Beverages",
        stock_quantity: 18,
        featured: false,
    },
    {
        id: 8,
        name: "Cocollagen",
        description: "A nourishing collagen drink made of enzymatically hydrolysed fish collagen from marine sources such as salmon.",
        tagline: "Tighten. Lift. Revive Your Skin's Natural Glow.",
        benefits: ["100% natural marine-source collagen for a rich supply of skin nourishment.", "Lifts the signs of aging by boosting collagen formation in the epidermis.", "Rich in amino acids such as Glycine, L-Proline and L-Hydroproline.", "Refreshing, easily digested, and irresistibly chocolatey."],
        ingredients: ["Hydrolysed fish collagen (marine source)", "Amino acids: Glycine, L-Proline, L-Hydroproline", "Malt", "Chocolate flavor"],
        size: "Easy to prepare drink",
        price: 35100,
        image_url: "images/cocollagen.png",
        category: "Beauty Pack",
        stock_quantity: 16,
        featured: false,
    },
    {
        id: 9,
        name: "Beauty Pack",
        description: "The complete 3-step beauty program — Reverse Aging, Tightening and Strengthening.",
        tagline: "The Complete 3-Step Beauty Program.",
        benefits: ["Step 1 — Reverse Aging with Bio-Elixir.", "Step 2 — Tightening with CoCollagen.", "Step 3 — Strengthening with Bubble C.", "Products designed to work together for total beauty from within."],
        ingredients: ["Bio-Elixir", "CoCollagen", "Bubble C"],
        size: "Complete beauty program",
        price: 300900,
        image_url: "images/beauty-package.png",
        category: "Beauty Pack",
        stock_quantity: 10,
        featured: true,
    }
];

function formatProduct(row) {
    return {
        ...row,
        price: Number(row.price || 0),
        stock_quantity: Number(row.stock_quantity || 0),
    };
}

function formatProducts(rows) {
    return rows.map(formatProduct);
}

router.get("/", async (req, res) => {
    try {
        const rows = await prisma.product.findMany({ orderBy: { id: 'asc' } });
        if (rows.length > 0) {
            return res.json(formatProducts(rows));
        }
    } catch (err) {
        console.error("Products query failed:", err.message);
    }

    res.json(fallbackProducts);
});

router.get("/categories", async (req, res) => {
    try {
        const result = await prisma.product.findMany({
            distinct: ['category'],
            where: { category: { not: null } },
            select: { category: true },
            orderBy: { category: 'asc' }
        });
        return res.json(result.map((row) => row.category));
    } catch (err) {
        console.error("Categories query failed:", err.message);
        return res.status(500).json({ error: "Failed to load categories" });
    }
});

router.get("/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await prisma.product.findUnique({ where: { id: parseInt(id) } });
        if (product) {
            return res.json(formatProduct(product));
        }
    } catch (err) {
        console.error("Product lookup failed:", err.message);
    }

    const fallbackProduct = fallbackProducts.find((product) => String(product.id) === String(id));
    if (fallbackProduct) {
        return res.json(fallbackProduct);
    }

    res.status(404).json({ error: "Product not found" });
});

router.post("/", authenticate, requireAdmin, async (req, res) => {
    const { name, description, price, image_url, category, stock_quantity, status, tagline, benefits, ingredients, size, featured } = req.body;
    try {
        const product = await prisma.product.create({
            data: {
                name,
                description: description || null,
                price: price || 0,
                image_url: image_url || null,
                category: category || null,
                stock_quantity: stock_quantity || 0,
                status: status || "active",
                tagline: tagline || null,
                benefits: benefits || [],
                ingredients: ingredients || [],
                size: size || null,
                featured: featured || false,
            }
        });
        res.status(201).json(formatProduct(product));
    } catch (err) {
        console.error("Create product failed:", err.message);
        res.status(500).json({ error: "Failed to create product" });
    }
});

router.put("/:id", authenticate, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const fields = req.body;
    if (Object.keys(fields).length === 0) return res.status(400).json({ error: "No fields to update" });
    try {
        const product = await prisma.product.update({
            where: { id: parseInt(id) },
            data: fields,
        });
        res.json(formatProduct(product));
    } catch (err) {
        console.error("Update product failed:", err.message);
        res.status(500).json({ error: "Failed to update product" });
    }
});

router.delete("/:id", authenticate, requireAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({ where: { id: parseInt(id) } });
        res.json({ message: "Product deleted" });
    } catch (err) {
        console.error("Delete product failed:", err.message);
        res.status(500).json({ error: "Failed to delete product" });
    }
});

module.exports = router;
