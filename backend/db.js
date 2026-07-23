// @deprecated - Use Prisma ORM via lib/prisma.js instead.
// This file is kept for reference and legacy seed data only.
// All routes now use prisma (lib/prisma.js) as the primary database client.

const { Pool } = require("pg");
const bcrypt = require("bcrypt");

// Construct connection string using a URL-encoded fallback password if no env var provided
const defaultPassword = process.env.PG_PASSWORD || 'Test@123';
const connectionString = process.env.DATABASE_URL || `postgres://postgres:${encodeURIComponent(defaultPassword)}@localhost:5432/edmark-rwanda-system`;

const pool = new Pool({
    connectionString,
    ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

async function initializeDatabase() {
    const client = await pool.connect();

    try {
        await client.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255),
                name VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(50),
                password_hash VARCHAR(255),
                role VARCHAR(50) DEFAULT 'customer',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255)`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(255)`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255)`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(50)`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255)`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'customer'`);
        await client.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);

        await client.query(`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                tagline VARCHAR(255),
                benefits TEXT[],
                ingredients TEXT[],
                size VARCHAR(100),
                price NUMERIC(10,2) NOT NULL DEFAULT 0,
                image_url VARCHAR(255),
                category VARCHAR(100),
                featured BOOLEAN DEFAULT FALSE
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS testimonials (
                id SERIAL PRIMARY KEY,
                customer_name VARCHAR(255),
                rating INTEGER DEFAULT 5,
                message TEXT,
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS contacts (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                email VARCHAR(255),
                phone VARCHAR(50),
                subject VARCHAR(255),
                message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS distributors (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(255),
                phone VARCHAR(50),
                email VARCHAR(255),
                district VARCHAR(255),
                message TEXT,
                status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS tagline VARCHAR(255)`);
        await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS benefits TEXT[]`);
        await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS ingredients TEXT[]`);
        await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS size VARCHAR(100)`);
        await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url VARCHAR(255)`);
        await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS category VARCHAR(100)`);
        await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE`);
        await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0`);
        await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'active'`);

        await client.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                user_id INTEGER,
                customer_name VARCHAR(255),
                customer_email VARCHAR(255),
                total_price NUMERIC(10,2) DEFAULT 0,
                payment_method VARCHAR(50) DEFAULT 'cash',
                payment_status VARCHAR(50) DEFAULT 'pending',
                order_status VARCHAR(50) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await client.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                product_id INTEGER,
                product_name VARCHAR(255),
                quantity INTEGER DEFAULT 1,
                unit_price NUMERIC(10,2) DEFAULT 0
            )
        `);

        // Ensure orders table has expected columns (add missing columns if table existed before)
        await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_id INTEGER`);
        await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255)`);
        await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255)`);
        await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS total_price NUMERIC(10,2) DEFAULT 0`);
        await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cash'`);
        await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending'`);
        await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_status VARCHAR(50) DEFAULT 'pending'`);
        await client.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`);

        // Ensure order_items table has expected columns
        await client.query(`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS order_id INTEGER`);
        await client.query(`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_id INTEGER`);
        await client.query(`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name VARCHAR(255)`);
        await client.query(`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 1`);
        await client.query(`ALTER TABLE order_items ADD COLUMN IF NOT EXISTS unit_price NUMERIC(10,2) DEFAULT 0`);

        const adminCount = await client.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'admin'");
        if (adminCount.rows[0].count === 0) {
            const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@12345', 10);
            await client.query(
                "INSERT INTO users (full_name, name, email, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5, $6)",
                ['Administrator', 'Administrator', 'admin@edmarkrwanda.com', '250000000000', hashedPassword, 'admin']
            );
        }

        const { rows } = await client.query("SELECT COUNT(*)::int AS count FROM products");
        if (rows[0].count === 0) {
            const products = [
                {
                    name: "Shakeoff Phyto Fiber",
                    description: "A convenient daily support product for healthy slimming routines.",
                    tagline: "Support Your Healthy Slimming Journey.",
                    benefits: ["Supports healthy slimming habits.", "Easy daily routine.", "Great taste."],
                    ingredients: ["Fiber blend", "Natural extracts", "Botanical support"],
                    size: "30 sachets",
                    price: 42000,
                    image_url: "images/shake-off.png",
                    category: "Healthy Slimming Programme",
                    featured: true,
                    stock_quantity: 20,
                    status: "active"
                },
                {
                    name: "MRT Complex",
                    description: "Nutritional support designed for everyday wellness and vitality.",
                    tagline: "Daily wellness support for modern living.",
                    benefits: ["Daily wellness support.", "Nutrition for busy lifestyles.", "Easy to use."],
                    ingredients: ["Vitamins", "Minerals", "Natural extracts"],
                    size: "Box of 30 sachets",
                    price: 55000,
                    image_url: "images/mrt-complex.png",
                    category: "Healthcare & Wellness",
                    featured: true,
                    stock_quantity: 18,
                    status: "active"
                },
                {
                    name: "Splina Liquid Chlorophyll",
                    description: "Premium liquid chlorophyll for everyday wellness support.",
                    tagline: "Refresh your daily routine.",
                    benefits: ["Supports daily wellness.", "Easy daily routine.", "Fresh taste."],
                    ingredients: ["Chlorophyll", "Botanical extracts", "Purified water"],
                    size: "500 ml",
                    price: 57000,
                    image_url: "images/splina.jpg",
                    category: "Healthcare & Wellness",
                    featured: true,
                    stock_quantity: 15,
                    status: "active"
                },
                {
                    name: "Ginseng Coffee",
                    description: "Coffee enhanced with ginseng for energy support.",
                    tagline: "Coffee with a wellness twist.",
                    benefits: ["Rich taste.", "Convenient daily preparation.", "Supports active living."],
                    ingredients: ["Coffee beans", "Ginseng extract", "Natural flavor"],
                    size: "Single serve sachet",
                    price: 20200,
                    image_url: "images/ginseng-coffee.jpg",
                    category: "Lifestyle Beverages",
                    featured: false,
                    stock_quantity: 30,
                    status: "active"
                },
                {
                    name: "Red Coffee",
                    description: "Enjoy coffee with a wellness touch.",
                    tagline: "Enjoy Coffee with a Wellness Touch.",
                    benefits: ["Rich coffee taste.", "Easy to prepare.", "Suitable for daily use.", "Great way to start your day."],
                    ingredients: ["Premium coffee beans", "Natural flavoring", "Wellness blend"],
                    size: "Single serve sachet",
                    price: 20200,
                    image_url: "images/red-coffee.png",
                    category: "Lifestyle Beverages",
                    featured: false,
                    stock_quantity: 25,
                    status: "active"
                },
                {
                    name: "Cafe Troika",
                    description: "A premium beverage experience for everyday enjoyment.",
                    tagline: "Enjoy premium flavor every day.",
                    benefits: ["Premium taste.", "Easy preparation.", "Great for daily moments."],
                    ingredients: ["Coffee blend", "Natural flavor", "Wellness support"],
                    size: "Box of 20 sachets",
                    price: 21000,
                    image_url: "images/red-coffee.png",
                    category: "Lifestyle Beverages",
                    featured: false,
                    stock_quantity: 22,
                    status: "active"
                },
                {
                    name: "Cafe 73",
                    description: "A flavorful and energizing beverage for everyday routines.",
                    tagline: "A flavorful boost for your day.",
                    benefits: ["Easy to prepare.", "Great taste.", "Supports daily energy."],
                    ingredients: ["Coffee blend", "Natural flavoring", "Energy support"],
                    size: "Box of 20 sachets",
                    price: 18000,
                    image_url: "images/red-coffee.png",
                    category: "Lifestyle Beverages",
                    featured: false,
                    stock_quantity: 18,
                    status: "active"
                },
                {
                    name: "CoCollagen",
                    description: "Nourish your skin from within with a convenient beauty formula.",
                    tagline: "Nourish Your Skin from Within.",
                    benefits: ["Supports skin care routine.", "Easy to prepare.", "Delicious drink."],
                    ingredients: ["Collagen support blend", "Fruit flavor", "Natural sweetness"],
                    size: "Easy to prepare drink",
                    price: 35100,
                    image_url: "images/cocollagen.png",
                    category: "Beauty Pack",
                    featured: false,
                    stock_quantity: 16,
                    status: "active"
                },
                {
                    name: "Beauty Pack",
                    description: "A complete beauty focused package for everyday wellness support.",
                    tagline: "The Complete Beauty Program.",
                    benefits: ["Complete beauty solution.", "Excellent value.", "Designed to work together."],
                    ingredients: ["Beauty bundle", "Wellness support", "Beauty nutrition"],
                    size: "Complete beauty program",
                    price: 300900,
                    image_url: "images/beauty-package.png",
                    category: "Beauty Pack",
                    featured: true,
                    stock_quantity: 10,
                    status: "active"
                }
            ];

            for (const product of products) {
                await client.query(
                    `INSERT INTO products (name, description, tagline, benefits, ingredients, size, price, image_url, category, featured, stock_quantity, status)
                     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                    [
                        product.name,
                        product.description,
                        product.tagline,
                        product.benefits,
                        product.ingredients,
                        product.size,
                        product.price,
                        product.image_url,
                        product.category,
                        product.featured,
                        product.stock_quantity || 0,
                        product.status || 'active',
                    ]
                );
            }
        }
    } catch (error) {
        console.error("Database initialization error:", error.message);
    } finally {
        client.release();
    }
}

module.exports = { pool, initializeDatabase };