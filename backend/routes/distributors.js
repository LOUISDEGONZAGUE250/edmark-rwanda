const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
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
    const application = await prisma.distributor.create({
      data: {
        full_name,
        phone,
        email,
        district,
        message: message || null,
        status: 'pending',
      },
    });
    res.status(201).json(serializeApplication(application));
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
    const applications = await prisma.distributor.findMany({
      orderBy: { created_at: 'desc' },
    });
    return res.json(applications.map(serializeApplication));
  } catch (err) {
    console.error(err.message);
    return res.json(memoryApplications.slice().reverse().map(serializeApplication));
  }
});

router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, application_status } = req.body;
  const normalizedStatus = status || application_status || 'pending';
  try {
    const application = await prisma.distributor.update({
      where: { id: parseInt(id) },
      data: { status: normalizedStatus },
    });
    return res.json(serializeApplication(application));
  } catch (err) {
    console.error(err.message);
    const application = memoryApplications.find((entry) => String(entry.id) === String(id));
    if (!application) return res.status(404).json({ error: 'Application not found' });
    application.status = normalizedStatus;
    application.application_status = normalizedStatus;
    return res.json(serializeApplication(application));
  }
});

module.exports = router;
