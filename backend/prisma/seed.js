require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

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

async function main() {
  const adminEmail = 'admin@edmarkrwanda.com';
  const adminPwd = process.env.ADMIN_PASSWORD || 'Admin@12345';

  const existingAdmin = await prisma.user.findUnique({ where: { id: 1 } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPwd, 10);
    await prisma.user.create({
      data: {
        full_name: 'Administrator',
        name: 'Administrator',
        email: adminEmail,
        phone: '250000000000',
        password_hash: hashedPassword,
        role: 'admin'
      }
    });
    console.log('Admin user created:', adminEmail);
  } else {
    console.log('Admin user already exists:', adminEmail);
  }

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    for (const product of products) {
      await prisma.product.create({ data: product });
    }
    console.log(`Seeded ${products.length} products.`);
  } else {
    console.log(`Products table already has ${productCount} records, skipping seed.`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed failed:', e.message);
    await prisma.$disconnect();
    process.exit(1);
  });
