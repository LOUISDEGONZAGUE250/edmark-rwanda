const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');
require('dotenv').config();

const fallbackUsers = [
  {
    id: 1,
    full_name: 'Administrator',
    name: 'Administrator',
    email: 'admin@edmarkrwanda.com',
    phone: '250000000000',
    password_hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'Admin@12345', 10),
    role: 'admin'
  }
];

function normalizeUser(user) {
  return {
    id: user.id,
    full_name: user.full_name || user.name,
    name: user.name || user.full_name,
    email: user.email,
    phone: user.phone,
    role: user.role || 'customer'
  };
}

async function registerFallbackUser({ full_name, name, email, phone, password, role }) {
  const existing = fallbackUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('User already exists');
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now(),
    full_name: full_name || name,
    name: name || full_name,
    email,
    phone,
    password_hash: hashed,
    role
  };
  fallbackUsers.push(user);
  return normalizeUser(user);
}

router.post('/register', async (req, res) => {
  const { full_name, name, email, phone, password, role } = req.body;
  const userName = full_name || name;
  const normalizedRole = ['admin', 'customer', 'distributor'].includes(role) ? role : 'customer';

  if (!userName || !email || !password) {
    return res.status(400).json({ error: 'name, email and password required' });
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (full_name, name, email, phone, password_hash, role) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, full_name, name, email, role',
      [userName, userName, email, phone || null, hashed, normalizedRole]
    );

    const user = result.rows[0];
    user.full_name = user.full_name || user.name || userName;
    return res.status(201).json(user);
  } catch (err) {
    try {
      const user = await registerFallbackUser({ full_name: userName, name: userName, email, phone, password, role: normalizedRole });
      return res.status(201).json(user);
    } catch (fallbackError) {
      console.error(fallbackError.message);
      return res.status(500).json({ error: 'Registration failed' });
    }
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  try {
    const result = await pool.query('SELECT id, full_name, name, email, password_hash, role FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      const fallbackUser = fallbackUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
      if (!fallbackUser) return res.status(401).json({ error: 'Invalid credentials' });
      const match = await bcrypt.compare(password, fallbackUser.password_hash);
      if (!match) return res.status(401).json({ error: 'Invalid credentials' });
      const token = jwt.sign({ id: fallbackUser.id, email: fallbackUser.email, role: fallbackUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
      return res.json({ token, user: { id: fallbackUser.id, full_name: fallbackUser.full_name || fallbackUser.name, email: fallbackUser.email, role: fallbackUser.role } });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.json({ token, user: { id: user.id, full_name: user.full_name || user.name, email: user.email, role: user.role } });
  } catch (err) {
    const fallbackUser = fallbackUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (!fallbackUser) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, fallbackUser.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: fallbackUser.id, email: fallbackUser.email, role: fallbackUser.role }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    return res.json({ token, user: { id: fallbackUser.id, full_name: fallbackUser.full_name || fallbackUser.name, email: fallbackUser.email, role: fallbackUser.role } });
  }
});

router.get('/me', authenticate, async (req, res) => {
  res.json({ user: req.user });
});

router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, full_name, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(result.rows.map(normalizeUser));
  } catch (err) {
    console.error(err.message);
    res.json(fallbackUsers.map(normalizeUser));
  }
});

router.delete('/users/:id', authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;
  if (Number(id) === Number(req.user.id)) {
    return res.status(400).json({ error: 'You cannot delete your own account' });
  }
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
