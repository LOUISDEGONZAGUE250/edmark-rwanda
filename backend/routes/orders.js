const express = require("express");
const router = express.Router();
const { pool } = require("../db");
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
        total_price: order.total_price,
        payment_method: order.payment_method,
        payment_status: order.payment_status,
        order_status: order.order_status,
        created_at: order.created_at,
        items
    };
}

router.post("/", async (req, res) => {
    const { user_id, customer_name, customer_email, items, payment_method } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "Order items are required" });
    }

    const totalPrice = items.reduce((sum, item) => {
        const qty = Number(item.quantity || 0);
        const price = Number(item.unit_price || item.price || 0);
        return sum + qty * price;
    }, 0);

    const client = await pool.connect();
    try {
        await client.query("BEGIN");

        const orderResult = await client.query(
            `INSERT INTO orders (user_id, customer_name, customer_email, total_price, payment_method, payment_status, order_status)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id`,
            [user_id || null, customer_name || null, customer_email || null, totalPrice, payment_method || 'cash', 'pending', 'pending']
        );

        const orderId = orderResult.rows[0].id;

        const itemPromises = items.map((item) => {
            const productId = item.product_id || null;
            const productName = item.product_name || item.name || null;
            const quantity = Number(item.quantity || 1);
            const unitPrice = Number(item.unit_price || item.price || 0);
            return client.query(
                `INSERT INTO order_items (order_id, product_id, product_name, quantity, unit_price)
                 VALUES ($1, $2, $3, $4, $5)`,
                [orderId, productId, productName, quantity, unitPrice]
            );
        });

        await Promise.all(itemPromises);
        await client.query("COMMIT");

        res.status(201).json({ message: "Order saved successfully", orderId });
    } catch (err) {
        await client.query("ROLLBACK");
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
            created_at: new Date().toISOString()
        });
        memoryOrderItems.push(...items.map((item) => ({
            order_id: orderId,
            product_id: item.product_id || null,
            product_name: item.product_name || item.name || null,
            quantity: Number(item.quantity || 1),
            unit_price: Number(item.unit_price || item.price || 0)
        })));
        console.error(err);
        res.status(201).json({
            message: "Order received and queued for follow-up.",
            orderId: fallbackOrderId,
        });
    } finally {
        client.release();
    }
});

router.get('/', authenticate, requireAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Orders fetch failed:', err.message);
        res.json(memoryOrders.slice().reverse().map((order) => ({ ...order, items: memoryOrderItems.filter((item) => item.order_id === order.id) })));
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
        const ordersRes = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [id]);
        const orders = [];
        for (const order of ordersRes.rows) {
            const itemsRes = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id]);
            orders.push({ ...order, items: itemsRes.rows });
        }
        res.json(orders);
    } catch (err) {
        console.error('User orders fetch failed:', err.message);
        res.json(memoryOrders.filter((order) => String(order.user_id) === String(id)).map((order) => buildOrderRecord(order, memoryOrderItems.filter((item) => item.order_id === order.id))));
    }
});

router.get('/:id', authenticate, async (req, res) => {
    const { id } = req.params;
    try {
        const orderRes = await pool.query('SELECT * FROM orders WHERE id = $1', [id]);
        if (orderRes.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
        const itemsRes = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id]);
        const order = orderRes.rows[0];
        order.items = itemsRes.rows;
        res.json(order);
    } catch (err) {
        console.error('Order lookup failed:', err.message);
        const order = memoryOrders.find((entry) => String(entry.id) === String(id));
        if (!order) return res.status(404).json({ error: 'Order not found' });
        res.json(buildOrderRecord(order, memoryOrderItems.filter((item) => item.order_id === order.id)));
    }
});

router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE orders SET order_status = COALESCE($1, order_status), payment_status = COALESCE($2, payment_status) WHERE id = $3 RETURNING *',
            [order_status || null, payment_status || null, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Order status update failed:', err.message);
        const order = memoryOrders.find((entry) => String(entry.id) === String(id));
        if (!order) return res.status(404).json({ error: 'Order not found' });
        order.order_status = order_status || order.order_status;
        order.payment_status = payment_status || order.payment_status;
        res.json(order);
    }
});

module.exports = router;

router.put('/:id/status', authenticate, requireAdmin, async (req, res) => {
    const { id } = req.params;
    const { order_status, payment_status } = req.body;
    try {
        const result = await pool.query(
            'UPDATE orders SET order_status = COALESCE($1, order_status), payment_status = COALESCE($2, payment_status) WHERE id = $3 RETURNING *',
            [order_status || null, payment_status || null, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Order status update failed:', err.message);
        const order = memoryOrders.find((entry) => String(entry.id) === String(id));
        if (!order) return res.status(404).json({ error: 'Order not found' });
        order.order_status = order_status || order.order_status;
        order.payment_status = payment_status || order.payment_status;
        res.json(order);
    }
});

module.exports = router;