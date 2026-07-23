const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { authenticate } = require('../middleware/auth');

const PAYPACK_API_URL = process.env.PAYPACK_API_URL || 'https://api.paypack.rw/api';
const PAYPACK_APP_ID = process.env.PAYPACK_APP_ID || '';
const PAYPACK_APP_SECRET = process.env.PAYPACK_APP_SECRET || '';

async function getPaypackToken() {
  try {
    const response = await fetch(`${PAYPACK_API_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_id: PAYPACK_APP_ID,
        app_secret: PAYPACK_APP_SECRET,
      }),
    });
    const data = await response.json();
    return data.access_token || data.token;
  } catch (error) {
    console.error('Paypack auth failed:', error.message);
    throw new Error('Payment authentication failed');
  }
}

router.post('/initiate', authenticate, async (req, res) => {
  const { order_id, amount, phone, provider } = req.body;

  if (!order_id || !amount || !phone) {
    return res.status(400).json({ error: 'order_id, amount, and phone are required' });
  }

  try {
    const token = await getPaypackToken();
    const paymentRef = `EDM-${order_id}-${Date.now()}`;

    const response = await fetch(`${PAYPACK_API_URL}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: Number(amount),
        phone: phone.replace(/\s/g, ''),
        provider: provider || 'mtn',
        reference: paymentRef,
        description: `Edmark Rwanda Order #${order_id}`,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.message || data.error || 'Payment initiation failed' });
    }

    try {
      await prisma.order.update({
        where: { id: Number(order_id) },
        data: {
          payment_ref: paymentRef,
          payment_method: provider || 'mtn',
          payment_status: 'processing',
        },
      });
    } catch (dbError) {
      console.error('Failed to update order:', dbError.message);
    }

    res.json({
      message: 'Payment initiated. Please complete on your phone.',
      payment_ref: paymentRef,
      checkout_url: data.checkout_url || null,
      paypack_response: data,
    });
  } catch (error) {
    console.error('Payment initiation error:', error.message);
    res.status(500).json({ error: error.message || 'Payment initiation failed' });
  }
});

router.get('/status/:paymentRef', authenticate, async (req, res) => {
  const { paymentRef } = req.params;

  try {
    const token = await getPaypackToken();

    const response = await fetch(`${PAYPACK_API_URL}/payments/${paymentRef}`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({ error: data.message || 'Status check failed' });
    }

    const paymentStatus = data.status === 'completed' || data.status === 'successful'
      ? 'completed'
      : data.status === 'failed' || data.status === 'cancelled'
        ? 'failed'
        : 'processing';

    try {
      const order = await prisma.order.findFirst({
        where: { payment_ref: paymentRef },
      });

      if (order) {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            payment_status: paymentStatus,
            order_status: paymentStatus === 'completed' ? 'confirmed' : order.order_status,
          },
        });
      }
    } catch (dbError) {
      console.error('Failed to update order status:', dbError.message);
    }

    res.json({
      status: data.status,
      payment_ref: paymentRef,
      details: data,
    });
  } catch (error) {
    console.error('Status check error:', error.message);
    res.status(500).json({ error: error.message || 'Status check failed' });
  }
});

router.post('/webhook', async (req, res) => {
  const { payment_ref, status } = req.body;

  console.log('Paypack webhook received:', req.body);

  try {
    const paymentStatus = status === 'completed' || status === 'successful'
      ? 'completed'
      : status === 'failed' || status === 'cancelled'
        ? 'failed'
        : 'processing';

    const order = await prisma.order.findFirst({
      where: { payment_ref: payment_ref },
    });

    if (order) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          payment_status: paymentStatus,
          order_status: paymentStatus === 'completed' ? 'confirmed' : order.order_status,
        },
      });
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error.message);
    res.status(200).json({ received: true, error: error.message });
  }
});

router.get('/order/:orderId', authenticate, async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      select: {
        id: true,
        total_price: true,
        payment_method: true,
        payment_status: true,
        payment_ref: true,
        order_status: true,
        created_at: true,
      },
    });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      order_id: order.id,
      amount: Number(order.total_price),
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      payment_ref: order.payment_ref,
      order_status: order.order_status,
      created_at: order.created_at,
    });
  } catch (error) {
    console.error('Payment history error:', error.message);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
});

module.exports = router;
