const express = require('express');
const router = express.Router();
const { pool } = require('../db');

router.post('/', async (req, res) => {
  const { customer_name, rating, message, image_url } = req.body;
  if (!customer_name || !message) return res.status(400).json({ error: 'customer_name and message required' });
  try {
    const result = await pool.query(
      'INSERT INTO testimonials (customer_name, rating, message, image_url) VALUES ($1,$2,$3,$4) RETURNING *',
      [customer_name, rating || 5, message, image_url || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM testimonials ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

module.exports = router;
