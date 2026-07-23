const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

router.post('/', async (req, res) => {
  const { customer_name, rating, message, image_url } = req.body;
  if (!customer_name || !message) return res.status(400).json({ error: 'customer_name and message required' });
  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        customer_name,
        rating: rating || 5,
        message,
        image_url: image_url || null,
      },
    });
    return res.status(201).json(testimonial);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

router.get('/', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { created_at: 'desc' },
    });
    return res.json(testimonials);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

module.exports = router;
