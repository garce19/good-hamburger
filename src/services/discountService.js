/**
 * Calculates the discount percentage based on order items.
 *
 * Business rules:
 * - Sandwich + Fries + Soft Drink: 20% discount (0.20)
 * - Sandwich + Soft Drink: 15% discount (0.15)
 * - Sandwich + Fries: 10% discount (0.10)
 * - Sandwich only: 0% discount (0.00)
 *
 * @param {boolean} hasSandwich - Whether the order includes a sandwich
 * @param {boolean} hasFries - Whether the order includes fries
 * @param {boolean} hasSoftDrink - Whether the order includes a soft drink
 * @returns {number} Discount percentage as decimal (0.00 to 0.20)
 */
const calculateDiscountPercentage = (hasSandwich, hasFries, hasSoftDrink) => {
    if (hasSandwich && hasFries && hasSoftDrink) {
        return 0.20;
    }

    if (hasSandwich && hasSoftDrink) {
        return 0.15;
    }

    if (hasSandwich && hasFries) {
        return 0.10;
    }

    return 0;
};

/**
 * Calculates the discount amount and final total for an order.
 *
 * @param {number} subtotal - Order subtotal before discount
 * @param {number} discountPercentage - Discount percentage as decimal (e.g., 0.20 for 20%)
 * @returns {Object} Object containing discountAmount and total, both rounded to 2 decimals
 * @returns {number} return.discountAmount - Amount discounted from subtotal
 * @returns {number} return.total - Final total after discount
 */
const calculateTotal = (subtotal, discountPercentage) => {
    const discountAmount = subtotal * discountPercentage;
    const total = subtotal - discountAmount;
    return {
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    };
};

module.exports = {
    calculateDiscountPercentage,
    calculateTotal
}