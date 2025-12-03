const db = require('../config/database');
const { calculateDiscountPercentage, calculateTotal } = require('../services/discountService');

/**
 * Creates a new order with automatic discount calculation.
 *
 * @param {Object} req.body - Request body
 * @param {number} req.body.sandwich_id - ID of the selected sandwich (required)
 * @param {string[]} req.body.extras - Array of extra items: 'fries', 'soft_drink' (optional)
 *
 * @returns {Object} 201 - Order created successfully with breakdown
 * @returns {Object} 400 - Validation error (missing sandwich or duplicate extras)
 * @returns {Object} 404 - Sandwich or extra items not found in menu
 * @returns {Object} 500 - Internal server error
 *
 * Discount rules:
 * - Sandwich + Fries + Soft Drink: 20% discount
 * - Sandwich + Soft Drink: 15% discount
 * - Sandwich + Fries: 10% discount
 * - Sandwich only: 0% discount
 */
const createOrder = async (req, res, next) => {
    try {
        const { sandwich_id, extras } = req.body;

        if (!sandwich_id) {
            return res.status(400).json({
                success: false,
                error: 'A sandwich must be selected to create an order.'
            });
        }

        const [sandwiches] = await db.query(
            'SELECT * FROM menu_items WHERE id = ? AND type = "sandwich"',
            [sandwich_id]
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

        let subtotal = parseFloat(sandwiches[0].price);

        if (hasFries) {
            const [friestItem] = await db.query(
                "SELECT price FROM menu_items WHERE name = 'Fries'"
            );
            if (friestItem.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Fries not found in menu items.'
                });
            }
            subtotal += parseFloat(friestItem[0].price);
        }

        if (hasSoftDrink) {
            const [softDrinkItem] = await db.query(
                "SELECT price FROM menu_items WHERE name = 'Soft drink'"
            );
            if (softDrinkItem.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Soft drink not found in menu items.'
                });
            }
            subtotal += parseFloat(softDrinkItem[0].price);
        }

        const discountPercentage = calculateDiscountPercentage(true, hasFries, hasSoftDrink);
        const { discountAmount, total } = calculateTotal(subtotal, discountPercentage);

        const [result] = await db.query(
            `INSERT INTO orders
            (sandwich_id, has_fries, has_soft_drink, subtotal, discount_percentage, discount_amount, total)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [sandwich_id, hasFries, hasSoftDrink, subtotal, discountPercentage * 100, discountAmount, total]
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

/**
 * Retrieves all orders from the database.
 *
 * Orders are returned in descending order by creation date (most recent first).
 * Includes sandwich name through JOIN with menu_items table.
 *
 * @returns {Object} 200 - Array of all orders with sandwich details
 * @returns {Object} 500 - Internal server error
 */
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

/**
 * Updates an existing order with new sandwich and/or extras.
 *
 * Recalculates subtotal, discount, and total based on new items.
 * Follows the same discount rules as order creation.
 *
 * @param {number} req.params.id - Order ID to update
 * @param {Object} req.body - Request body
 * @param {number} req.body.sandwich_id - ID of the selected sandwich (required)
 * @param {string[]} req.body.extras - Array of extra items: 'fries', 'soft_drink' (optional)
 *
 * @returns {Object} 200 - Order updated successfully
 * @returns {Object} 400 - Validation error (missing sandwich or duplicate extras)
 * @returns {Object} 404 - Order, sandwich, or extra items not found
 * @returns {Object} 500 - Internal server error
 */
const updateOrder = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { sandwich_id, extras } = req.body;

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

        if (!sandwich_id) {
            return res.status(400).json({
                success: false,
                error: 'A sandwich must be selected.'
            });
        }

        const [sandwiches] = await db.query(
            'SELECT * FROM menu_items WHERE id = ? AND type = "sandwich"',
            [sandwich_id]
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

        let subtotal = parseFloat(sandwiches[0].price);

        if (hasFries) {
            const [friestItem] = await db.query(
                "SELECT price FROM menu_items WHERE name = 'Fries'"
            );
            if (friestItem.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Fries not found in menu items.'
                });
            }
            subtotal += parseFloat(friestItem[0].price);
        }

        if (hasSoftDrink) {
            const [softDrinkItem] = await db.query(
                "SELECT price FROM menu_items WHERE name = 'Soft drink'"
            );
            if (softDrinkItem.length === 0) {
                return res.status(404).json({
                    success: false,
                    error: 'Soft drink not found in menu items.'
                });
            }
            subtotal += parseFloat(softDrinkItem[0].price);
        }

        const discountPercentage = calculateDiscountPercentage(true, hasFries, hasSoftDrink);
        const { discountAmount, total } = calculateTotal(subtotal, discountPercentage);

        await db.query(
            `UPDATE orders 
            SET sandwich_id = ?, has_fries = ?, has_soft_drink = ?, subtotal = ?, discount_percentage = ?, discount_amount = ?, total = ?
            WHERE id = ?`,
            [sandwich_id, hasFries, hasSoftDrink, subtotal, discountPercentage * 100, discountAmount, total, id]
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

/**
 * Deletes an order from the database.
 *
 * @param {number} req.params.id - Order ID to delete
 *
 * @returns {Object} 200 - Order deleted successfully
 * @returns {Object} 404 - Order not found
 * @returns {Object} 500 - Internal server error
 */
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
