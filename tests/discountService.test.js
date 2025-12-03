const { calculateDiscountPercentage, calculateTotal } = require('../services/discountService');

describe('Discount Service', () => {
    describe('calculateDiscountPercentage', () => {
        test('should return 20% discount for sandwich + fries + soft drink', () => {
            const discount = calculateDiscountPercentage(true, true, true);
            expect(discount).toBe(0.20);
        });

        test('should return 15% discount for sandwich + soft drink', () => {
            const discount = calculateDiscountPercentage(true, false, true);
            expect(discount).toBe(0.15);
        });

        test('should return 10% discount for sandwich + fries', () => {
            const discount = calculateDiscountPercentage(true, true, false);
            expect(discount).toBe(0.10);
        });

        test('should return 0% discount for sandwich only', () => {
            const discount = calculateDiscountPercentage(true, false, false);
            expect(discount).toBe(0);
        });
    });

    describe('calculateTotal', () => {
        test('should calculate correct total with 20% discount', () => {
            const result = calculateTotal(10, 0.20);
            expect(result.discountAmount).toBe(2.00);
            expect(result.total).toBe(8.00);
        });

        test('should calculate correct total with no discount', () => {
            const result = calculateTotal(10, 0);
            expect(result.discountAmount).toBe(0);
            expect(result.total).toBe(10.00);
        });
    });
});

