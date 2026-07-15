const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { authenticate, requireAdmin } = require('../middleware/auth');

const memoryApplications = [];

function serializeApplication(application) {
  return {
    ...application,
    status: application.status || application.application_status || 'pending',
    application_status: application.application_status || application.status || 'pending',
  };
}

router.post('/', async (req, res) => {
  const { full_name, phone, email, district, message } = req.body;
  if (!full_name || !phone || !email || !district) return res.status(400).json({ error: 'full_name, phone, email and district required' });
  try {
    const result = await pool.query(
      'INSERT INTO distributors (full_name, phone, email, district, message, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [full_name, phone, email, district, message || null, 'pending']
    );
    res.status(201).json(serializeApplication(result.rows[0]));
  } catch (err) {
    const application = {
      id: Math.floor(Date.now() / 1000),
      full_name,
      phone,
      email,
      district,
      message: message || null,
      status: 'pending',
      created_at: new Date().toISOString()
    };
    memoryApplications.push(application);
    res.status(201).json(serializeApplication(application));
  }
});

router.get('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM distributors ORDER BY created_at DESC');
    res.json(result.rows.map(serializeApplication));
  } catch (err) {
    console.error(err.message);
    res.json(memoryApplications.slice().reverse().map(serializeApplication));
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, application_status } = req.body;
  const normalizedStatus = status || application_status || 'pending';
  try {
    const result = await pool.query(
      'UPDATE distributors SET status = $1 WHERE id = $2 RETURNING *',
      [normalizedStatus, id]
    );
    const updatedApplication = result.rows[0] || {
      id,
      status: normalizedStatus,
      application_status: normalizedStatus,
    };
    res.json(serializeApplication(updatedApplication));
  } catch (err) {
    console.error(err.message);
    const application = memoryApplications.find((entry) => String(entry.id) === String(id));
    if (!application) return res.status(404).json({ error: 'Application not found' });
    application.status = normalizedStatus;
    application.application_status = normalizedStatus;
    res.json(serializeApplication(application));
  }
});

module.exports = router;
