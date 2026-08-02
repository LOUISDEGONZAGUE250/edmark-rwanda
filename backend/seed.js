require('dotenv').config();
const { pool } = require('./db');
const bcrypt = require('bcrypt');

const products = [
  {
    name: 'Splina Liquid Chlorophyll',
    description: 'A nutritional drink made of fresh and pure liquid chlorophyll from White Mulberry Leaves.',
    tagline: 'Purify Your Body. Balance Your pH.',
    benefits: ['Balances acid and alkaline levels in the body.', 'Cleanses the digestive system and helps purify the blood.', 'Rich in Vitamins A, C and E, Zinc, Folic Acid, Calcium, Magnesium, and Iron.', 'Boosts the immune system and increases oxygen supply in the blood.'],
    ingredients: ['Chlorophyll from White Mulberry Leaves', 'Vitamins A, C and E', 'Zinc, Folic Acid, Calcium, Magnesium and Iron', 'Purified water'],
    size: '500 ml',
    price: 57000,
    image_url: 'images/splina.jpg',
    category: 'wellness',
    featured: true,
  },
  {
    name: 'Shake Off',
    description: 'A fiber-rich cleansing drink that detoxifies your system and helps you feel full, naturally.',
    tagline: 'Detoxify. Cleanse. Feel Amazing in Just 8 Hours.',
    benefits: ['Fast and effective — see results in just eight hours.', 'Comes in two delicious flavors — Pandan and Lemon.', 'Keeps the digestive tract clean, healthy and feeling of fullness.', 'Absorbs fat and facilitates metabolism.'],
    ingredients: ['Dietary fiber blend', 'Natural botanical extracts', 'Pandan and Lemon flavors'],
    size: '12 sachets',
    price: 57000,
    image_url: 'images/shake-off.png',
    category: 'weight',
    featured: true,
  },
  {
    name: 'MRT Complex',
    description: 'A delicious, low-calorie meal replacement loaded with complete vitamins, proteins, and energy-releasing amino acids.',
    tagline: 'Burn Fat. Cut Calories. No Hunger Pangs.',
    benefits: ['Replaces your meal to help you cut calories safely and effectively.', 'Loaded with complete vitamins, proteins, and energy-releasing amino acids.', 'Delicious, highly soluble and low in calories.', 'Comes in three delicious flavors — chocolate, vanilla, and strawberry.'],
    ingredients: ['Vitamins and minerals', 'Protein blend', 'Energy-releasing amino acids'],
    size: 'Chocolate / Vanilla / Strawberry',
    price: 123500,
    image_url: 'images/mrt-complex.png',
    category: 'nutrition',
    featured: true,
  },
  {
    name: 'Red Yeast Coffee',
    description: 'Deep, full-bodied coffee blended with red yeast rice for optimal cholesterol health.',
    tagline: 'Rejuvenate Your Heart, Body and Mind.',
    benefits: ['Deep and full-bodied with a bold, complex flavor.', 'Supports optimal cholesterol health.', 'Made from an organic blend of premium imported coffee beans and red yeast rice.', 'A crisp finish that lingers in your taste buds.'],
    ingredients: ['Premium imported coffee beans', 'Red yeast rice'],
    size: 'Single serve sachet',
    price: 20200,
    image_url: 'images/red-coffee.png',
    category: 'nutrition',
    featured: false,
  },
  {
    name: 'Ginseng Coffee',
    description: 'Finest Arabica coffee beans from Brazil and Colombia infused with Korean Ginseng extract.',
    tagline: 'Smooth, Elegant and Refreshing.',
    benefits: ['A smooth, elegant and refreshing coffee drinking experience.', 'Infused with Korean Ginseng extract, known for increasing longevity.', 'Made from a natural blend of the finest Arabica coffee beans.', 'A healthy coffee that will satisfy your discriminating taste.'],
    ingredients: ['Arabica coffee beans', 'Korean Ginseng extract'],
    size: 'Single serve sachet',
    price: 20200,
    image_url: 'images/ginseng-coffee.jpg',
    category: 'nutrition',
    featured: false,
  },
  {
    name: 'Bio-Elixir',
    description: 'An all-natural HGH releaser made from excellent quality soy protein and amino acids that helps you look young, feel young, and be young.',
    tagline: 'Reverse Aging Naturally. 100% Natural · Zero Side Effects.',
    benefits: ['Helps you look young, feel young, and be young.', '100% natural — not a steroid or drug; tested and proven safe to consume.', 'Targets problem areas through gastric absorption into the bloodstream.', 'Rich in amino acids, glutamine, and Vitamin B5.'],
    ingredients: ['Soy protein', 'Amino acids', 'Glutamine', 'Vitamin B5'],
    size: 'Practical sachets',
    price: 121000,
    image_url: 'images/bio-elixir.png',
    category: 'beauty',
    featured: true,
  },
  {
    name: 'Bubble C',
    description: 'A refreshing instant orange beverage loaded with natural Vitamin C and Calcium — every glass is equivalent to three fresh oranges!',
    tagline: 'Refresh. Energize. Burst into Bubbly Fun.',
    benefits: ['Every glass is loaded with Vitamin C equivalent to that of three fresh oranges.', 'Fortified with Calcium to energize the body and build bones, teeth and muscles.', 'Made from natural spray-dried orange juice concentrate.', 'Sweetened by natural fructose which does not raise blood sugar levels.'],
    ingredients: ['Natural spray-dried orange juice concentrate', 'Vitamin C', 'Calcium', 'Natural fructose', 'Carotene'],
    size: 'Daily wellness sachet',
    price: 23800,
    image_url: 'images/bubble-c.jpg',
    category: 'wellness',
    featured: false,
  },
  {
    name: 'Cocollagen',
    description: 'A nourishing collagen drink made of enzymatically hydrolysed fish collagen from marine sources such as salmon.',
    tagline: 'Tighten. Lift. Revive Your Skin\'s Natural Glow.',
    benefits: ['100% natural marine-source collagen for a rich supply of skin nourishment.', 'Lifts the signs of aging by boosting collagen formation in the epidermis.', 'Rich in amino acids such as Glycine, L-Proline and L-Hydroproline.', 'Refreshing, easily digested, and irresistibly chocolatey.'],
    ingredients: ['Hydrolysed fish collagen (marine source)', 'Amino acids: Glycine, L-Proline, L-Hydroproline', 'Malt', 'Chocolate flavor'],
    size: 'Easy to prepare drink',
    price: 35100,
    image_url: 'images/cocollagen.png',
    category: 'beauty',
    featured: false,
  },
  {
    name: 'Beauty Pack',
    description: 'The complete 3-step beauty program — Reverse Aging, Tightening and Strengthening.',
    tagline: 'The Complete 3-Step Beauty Program.',
    benefits: ['Step 1 — Reverse Aging with Bio-Elixir.', 'Step 2 — Tightening with CoCollagen.', 'Step 3 — Strengthening with Bubble C.', 'Products designed to work together for total beauty from within.'],
    ingredients: ['Bio-Elixir', 'CoCollagen', 'Bubble C'],
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
