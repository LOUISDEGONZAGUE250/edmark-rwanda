const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const { authenticate, requireAdmin } = require("../middleware/auth");

const fallbackProducts = [
    {
        id: 1,
        name: "Shakeoff Phyto Fiber",
        description: "A convenient daily support product for healthy slimming routines.",
        tagline: "Support Your Healthy Slimming Journey.",
        benefits: ["Supports healthy slimming habits.", "Easy daily routine.", "Great taste."],
        ingredients: ["Fiber blend", "Natural extracts", "Botanical support"],
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
        description: "Nutritional support designed for everyday wellness and vitality.",
        tagline: "Daily wellness support for modern living.",
        benefits: ["Daily wellness support.", "Nutrition for busy lifestyles.", "Easy to use."],
        ingredients: ["Vitamins", "Minerals", "Natural extracts"],
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
        description: "Premium liquid chlorophyll for everyday wellness support.",
        tagline: "Refresh your daily routine.",
        benefits: ["Supports daily wellness.", "Easy daily routine.", "Fresh taste."],
        ingredients: ["Chlorophyll", "Botanical extracts", "Purified water"],
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
        description: "A rich coffee with a wellness twist designed for daily rituals.",
        tagline: "Coffee with a wellness twist.",
        benefits: ["Rich taste.", "Convenient daily preparation.", "Supports active living."],
        ingredients: ["Coffee beans", "Ginseng extract", "Natural flavor"],
        size: "Single serve sachet",
        price: 20200,
        image_url: "images/ginseng-coffee.jpg",
        category: "Lifestyle Beverages",
        stock_quantity: 30,
        featured: false,
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
