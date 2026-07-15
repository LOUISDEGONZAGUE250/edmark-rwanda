require('dotenv').config();
const { pool } = require('./db');
const bcrypt = require('bcrypt');

const products = [
  {
    name: 'Splina Liquid Chlorophyll',
    description: 'Support your daily wellness routine with our premium chlorophyll supplement.',
    tagline: 'Purify Your Body. Support Your Daily Wellness.',
    benefits: ['Supports a healthy daily wellness routine.', 'Complements a balanced diet.', 'Helps maintain a feeling of freshness.', 'Easy to use every day.'],
    ingredients: ['Chlorophyll', 'Natural botanical extracts', 'Purified water'],
    size: '500 ml',
    price: 57000,
    image_url: 'images/splina.jpg',
    category: 'wellness',
    featured: true,
  },
  {
    name: 'Shake Off',
    description: 'Suitable for a weight management program with great taste and easy preparation.',
    tagline: 'Your Weight Management Partner.',
    benefits: ['Suitable for a weight management program.', 'Easy to prepare.', 'Complements a balanced diet.', 'Great taste.'],
    ingredients: ['Natural protein blend', 'Fiber blend', 'Flavoring agents'],
    size: '12 sachets',
    price: 57000,
    image_url: 'images/shake-off.png',
    category: 'weight',
    featured: true,
  },
  {
    name: 'MrD Nutrition Drink',
    description: 'Available in three delicious flavors for your active lifestyle.',
    tagline: 'Convenient Nutrition for Busy Days.',
    benefits: ['Easy to prepare.', 'Available in three delicious flavors.', 'Suitable for active lifestyles.', 'Fits into a balanced routine.'],
    ingredients: ['Vitamins', 'Minerals', 'Protein blend'],
    size: 'Chocolate / Vanilla / Strawberry',
    price: 123500,
    image_url: 'images/mrt-complex.png',
    category: 'nutrition',
    featured: true,
  },
  {
    name: 'Red Coffee',
    description: 'Enjoy coffee with a wellness touch.',
    tagline: 'Enjoy Coffee with a Wellness Touch.',
    benefits: ['Rich coffee taste.', 'Easy to prepare.', 'Suitable for daily use.', 'Great way to start your day.'],
    ingredients: ['Premium coffee beans', 'Natural flavoring', 'Wellness blend'],
    size: 'Single serve sachet',
    price: 20200,
    image_url: 'images/red-coffee.png',
    category: 'nutrition',
    featured: false,
  },
  {
    name: 'Ginseng Coffee',
    description: 'Coffee enhanced with ginseng for energy support.',
    tagline: 'Coffee Enhanced with Ginseng.',
    benefits: ['Smooth taste.', 'Convenient.', 'Suitable for active people.'],
    ingredients: ['Coffee beans', 'Ginseng extract', 'Natural flavor'],
    size: 'Single serve sachet',
    price: 20200,
    image_url: 'images/ginseng-coffee.jpg',
    category: 'nutrition',
    featured: false,
  },
  {
    name: 'Bio-Elixir',
    description: 'Reveal your beauty from within.',
    tagline: 'Reveal Your Beauty from Within.',
    benefits: ['Supports your beauty routine.', 'Easy daily use.', 'Practical sachets.'],
    ingredients: ['Botanical extracts', 'Beauty support blend', 'Natural flavor'],
    size: 'Practical sachets',
    price: 121000,
    image_url: 'images/bio-elixir.png',
    category: 'beauty',
    featured: true,
  },
  {
    name: 'Bubble C',
    description: 'A simple daily wellness habit in a great-tasting formula.',
    tagline: 'A Simple Daily Wellness Habit.',
    benefits: ['Easy to consume.', 'Great taste.', 'Daily wellness support.'],
    ingredients: ['Vitamin C blend', 'Natural flavoring', 'Sweetener'],
    size: 'Daily wellness sachet',
    price: 23800,
    image_url: 'images/bubble-c.jpg',
    category: 'wellness',
    featured: false,
  },
  {
    name: 'Cocollagen',
    description: 'Nourish your skin from within.',
    tagline: 'Nourish Your Skin from Within.',
    benefits: ['Supports skin care routine.', 'Easy to prepare.', 'Delicious drink.'],
    ingredients: ['Collagen support blend', 'Fruit flavor', 'Natural sweetness'],
    size: 'Easy to prepare drink',
    price: 35100,
    image_url: 'images/cocollagen.png',
    category: 'beauty',
    featured: false,
  },
  {
    name: 'Beauty Package',
    description: 'The complete beauty program for wellness and skin support.',
    tagline: 'The Complete Beauty Program.',
    benefits: ['Complete beauty solution.', 'Excellent value.', 'Products designed to work together.'],
    ingredients: ['Beauty bundle', 'Wellness support', 'Beauty nutrition'],
    size: 'Complete beauty program',
    price: 300900,
    image_url: 'images/beauty-package.png',
    category: 'beauty',
    featured: true,
  }
];

async function seed() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE products RESTART IDENTITY CASCADE');

    // Ensure admin user exists
    const adminEmail = 'admin@edmarkrwanda.com';
    const adminPwd = process.env.ADMIN_PASSWORD || 'Admin@123';
    const adminCheck = await client.query('SELECT id FROM users WHERE email = $1', [adminEmail]);
    if (adminCheck.rows.length === 0) {
      const hashed = await bcrypt.hash(adminPwd, 10);
      await client.query('INSERT INTO users (name, email, phone, password_hash, role) VALUES ($1,$2,$3,$4,$5)', ['Administrator', adminEmail, null, hashed, 'admin']);
      console.log('Admin user created:', adminEmail);
    } else {
      console.log('Admin user already exists:', adminEmail);
    }

    for (const product of products) {
      await client.query(
        `INSERT INTO products (name, description, tagline, benefits, ingredients, size, price, image_url, category, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [product.name, product.description, product.tagline, product.benefits, product.ingredients, product.size, product.price, product.image_url, product.category, product.featured]
      );
    }

    await client.query('COMMIT');
    console.log(`Seeded ${products.length} products.`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  } finally {
    client.release();
    pool.end();
  }
}

seed();
