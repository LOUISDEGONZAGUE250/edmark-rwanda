const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { created_at: 'desc' },
    });
    return res.json(contacts);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Failed to fetch contact messages' });
  }
});

router.post('/', async (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: 'name, email and message required' });
  try {
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    });
    return res.status(201).json(contact);
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ error: 'Failed to submit message' });
  }
});

module.exports = router;
