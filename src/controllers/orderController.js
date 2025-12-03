const db = require('../config/database');
const { calculateDiscountPercentage, calculateTotal } = require('../services/discountService');

const createOrder = async (req, res, next) => {
    try {
        const { sandwichId, extras } = req.body;

        if (!sandwichId) {
            return res.status(400).json({
                success: false,
                error: 'A sandwich must be selected to create an order.'
            });
        }

        const [sandwiches] = await db.query(
            'SELECT * FROM menu_items WHERE id = ? AND type = "sandwich"',
            [sandwichId]
        );

        if (sandwiches.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Selected sandwich not found.'
            });
        }

        const hasFries = extras && extras.includes('fries');
        const hasSoftDrink = extras && extras.includes('soft_drink');

        if (extras && extras.length !== new Set(extras).size) {
            return res.status(400).json({
                success: false,
                error: 'Duplicate extras are not allowed. Each extra can be added only once.'
            });
        }

        let subtotal = sandwiches[0].price;

        if (hasFries) {
            const [friestItem] = await db.query(
                "SELECT price FROM menu_items WHERE name = 'Fries'"
            );
            subtotal += friestItem[0].price;
        }

        if (hasSoftDrink) {
            const [softDrinkItem] = await db.query(
                "SELECT price FROM menu_items WHERE name = 'Soft drink'"
            );
            subtotal += softDrinkItem[0].price;
        }

        const discountPercentage = calculateDiscountPercentage(true, hasFries, hasSoftDrink);
        const { discountAmount, total } = calculateTotal(subtotal, discountPercentage);

        const [result] = await db.query(
            `INSERT INTO orders
            (sandwich_id, has_fries, has_soft_drink, subtotal, discount_percentage, discount_amount, total)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [sandwichId, hasFries, hasSoftDrink, subtotal, discountPercentage * 100, discountAmount, total]
        );

        const [newOrder] = await db.query(
            'SELECT * FROM orders WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json({
            success: true,
            data: {
                order: newOrder[0],
                breakdown: {
                    subtotal: parseFloat(subtotal.toFixed(2)),
                    discountPercentage: discountPercentage * 100,
                    discountAmount: discountAmount,
                    total: total
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

const getAllOrders = async (req, res, next) => {
    try {
        const [rows] = await db.query(
            `SELECT o.*, m.name as sandwich_name 
            FROM orders o
            LEFT JOIN menu_items m ON o.sandwich_id = m.id
            ORDER BY o.created_at DESC
            `);
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        next(err);
    }
};

const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { sandwichId, extras } = req.body;

        const [existingOrders] = await db.query(
            'SELECT * FROM orders WHERE id = ?',
            [id]
        );

        if (existingOrders.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found.'
            });
        }

        if (!sandwichId) {
            return res.status(400).json({
                success: false,
                error: 'A sandwich must be selected.'
            });
        }

        const [sandwiches] = await db.query(
            'SELECT * FROM menu_items WHERE id = ? AND type = "sandwich"',
            [sandwichId]
        );

        if (sandwiches.length === 0) {
            return res.status(404).json({
                success: false,
                error: 'Selected sandwich not found.'
            });
        }

        const hasFries = extras && extras.includes('fries');
        const hasSoftDrink = extras && extras.includes('soft_drink');

        if (extras && extras.length !== new Set(extras).size) {
            return res.status(400).json({
                success: false,
                error: 'Duplicate extras are not allowed. Each extra can be added only once.'
            });
        }

        let subtotal = sandwiches[0].price;

        if (hasFries) {
            const [friestItem] = await db.query(
                "SELECT price FROM menu_items WHERE name = 'Fries'"
            );
            subtotal += friestItem[0].price;
        }

        if (hasSoftDrink) {
            const [softDrinkItem] = await db.query(
                "SELECT price FROM menu_items WHERE name = 'Soft drink'"
            );
            subtotal += softDrinkItem[0].price;
        }

        const discountPercentage = calculateDiscountPercentage(true, hasFries, hasSoftDrink);
        const { discountAmount, total } = calculateTotal(subtotal, discountPercentage);

        await db.query(
            `UPDATE orders 
            SET sandwich_id = ?, has_fries = ?, has_soft_drink = ?, subtotal = ?, discount_percentage = ?, discount_amount = ?, total = ?
            WHERE id = ?`,
            [sandwichId, hasFries, hasSoftDrink, subtotal, discountPercentage * 100, discountAmount, total, id]
        );

        const [updatedOrder] = await db.query(
            'SELECT * FROM orders WHERE id = ?',
            [id]
        );

        res.json({
            success: true,
            data: updatedOrder[0]
        });
    } catch (err) {
        next(err);
    }
};

const deleteOrder = async (req, res, next) => {
    try {
        const { id } = req.params;

        const [result] = await db.query(
            'DELETE FROM orders WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                error: 'Order not found.'
            });
        }
        res.json({
            success: true,
            message: 'Order deleted successfully.'
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    updateOrder,
    deleteOrder
};
