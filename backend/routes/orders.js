const express = require("express");
const router = express.Router();
const prisma = require("../lib/prisma");
const { authenticate, requireAdmin } = require('../middleware/auth');

const pendingOrders = [];
const memoryOrders = [];
const memoryOrderItems = [];

function buildOrderRecord(order, items) {
    return {
        id: order.id,
        user_id: order.user_id,
        customer_name: order.customer_name,
        customer_email: order.customer_email,
        total_price: Number(order.total_price || 0),
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        order_status: order.order_status,
        payment_ref: order.payment_ref || null,
        created_at: order.created_at,
        items: items.map(item => ({
            ...item,
            unit_price: Number(item.unit_price || 0),
        }))
    };
}

function serializeOrder(order) {
    return {
        ...order,
        total_price: Number(order.total_price || 0),
        items: order.items
            ? order.items.map(item => ({
                ...item,
                unit_price: Number(item.unit_price || 0),
            }))
            : [],
    };
}

router.post("/", async (req, res) => {
    const { user_id, customer_name, customer_email, items, payment_method, payment_ref } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Order items are required" });
    }

    const totalPrice = items.reduce((sum, item) => {
        const qty = Number(item.quantity || 0);
        const price = Number(item.unit_price || item.price || 0);
        return sum + qty * price;
    }, 0);

    try {
        const order = await prisma.order.create({
            data: {
                user_id: user_id || null,
                customer_name: customer_name || null,
                customer_email: customer_email || null,
                total_price: totalPrice,
                payment_method: payment_method || 'cash',
                payment_status: 'pending',
                order_status: 'pending',
                payment_ref: payment_ref || null,
                items: {
                    create: items.map((item) => ({
                        product_id: item.product_id || null,
                        product_name: item.product_name || item.name || null,
                        quantity: Number(item.quantity || 1),
                        unit_price: Number(item.unit_price || item.price || 0),
                    })),
                },
            },
            include: { items: true },
        });

        res.status(201).json({ message: "Order saved successfully", orderId: order.id });
    } catch (err) {
        console.error(err);
        const fallbackOrderId = Date.now();
        pendingOrders.push({
            orderId: fallbackOrderId,
            customer_name,
            customer_email,
            totalPrice,
            items,
        });
        const orderId = fallbackOrderId;
        memoryOrders.push({
            id: orderId,
            user_id: user_id || null,
            customer_name: customer_name || null,
            customer_email: customer_email || null,
            total_price: totalPrice,
            payment_method: payment_method || 'cash',
            payment_status: 'pending',
            order_status: 'pending',
            payment_ref: payment_ref || null,
            created_at: new Date().toISOString()
        });
        memoryOrderItems.push(...items.map((item) => ({
            order_id: orderId,
            product_id: item.product_id || null,
            product_name: item.product_name || item.name || null,
            quantity: Number(item.quantity || 1),
            unit_price: Number(item.unit_price || item.price || 0)
        })));
        res.status(201).json({
            message: "Order received and queued for follow-up.",
            orderId: fallbackOrderId,
        });
    }
});

router.get('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { items: true },
            orderBy: { created_at: 'desc' },
        });
        return res.json(orders.map(serializeOrder));
    } catch (err) {
        console.error('Orders fetch failed:', err.message);
        return res.json(memoryOrders.slice().reverse().map((order) => ({ ...order, items: memoryOrderItems.filter((item) => item.order_id === order.id) })));
    }
});

router.get('/user/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    const requesterId = req.user && req.user.id;
    if (!requesterId) return res.status(401).json({ error: 'Unauthorized' });
    if (Number(requesterId) !== Number(id) && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const orders = await prisma.order.findMany({
            where: { user_id: parseInt(id) },
            include: { items: true },
            orderBy: { created_at: 'desc' },
        });
        return res.json(orders.map(serializeOrder));
    } catch (err) {
        console.error('User orders fetch failed:', err.message);
        return res.json(memoryOrders.filter((order) => String(order.user_id) === String(id)).map((order) => buildOrderRecord(order, memoryOrderItems.filter((item) => item.order_id === order.id))));
    }
});

router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: { items: true },
        });
        if (!order) return res.status(404).json({ error: 'Order not found' });
        return res.json(serializeOrder(order));
    } catch (err) {
        console.error('Order lookup failed:', err.message);
        const order = memoryOrders.find((entry) => String(entry.id) === String(id));
        if (!order) return res.status(404).json({ error: 'Order not found' });
        return res.json(buildOrderRecord(order, memoryOrderItems.filter((item) => item.order_id === order.id)));
    }
});

router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;
    try {
        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: {
                ...(order_status ? { order_status } : {}),
                ...(payment_status ? { payment_status } : {}),
            },
            include: { items: true },
        });
        return res.json(serializeOrder(order));
    } catch (err) {
        console.error('Order status update failed:', err.message);
        const order = memoryOrders.find((entry) => String(entry.id) === String(id));
        if (!order) return res.status(404).json({ error: 'Order not found' });
        order.order_status = order_status || order.order_status;
        order.payment_status = payment_status || order.payment_status;
        return res.json(order);
    }
});

module.exports = router;
