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