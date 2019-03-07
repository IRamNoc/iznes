import {
    calFee,
    calculateFigures,
    calNetAmount,
    pad,
    toNormalScale,
    convertToBlockChainNumber,
    getAmountTwoDecimal,
} from '../order-calculations';

describe('calFee', () => {
    it('Calculated the platform fee', () => {
        const amt = 100_00000;
        const fee = 0_06000;

        const result = calFee(amt, fee);

        expect(result).toBe(6_00000);
    });
});

describe('calNetAmount', () => {
    it('calculates the net amount for redemptions', () => {
        const result = calNetAmount(100_00000, 60000, 'r');

        expect(result).toBe(99_40000);
    });
    it('calculates the net amount for subscriptions', () => {
        const result = calNetAmount(100_00000, 60000, 's');

        expect(result).toBe(100_60000);
    });
});

describe('pad', () => {
    it('pads a number to a set width', () => {
        const result = pad(100, 8, '0');

        expect(result).toBe('00000100');
    });
});

describe('toNormalScale', () => {
    it('converts a chain number to normal', () => {
        const number = 123_45678;

        const result = toNormalScale(number, 5);

        expect(result).toBe(123.45678);
    });
    it('converts a chain number to normal - normal round at decimalisation', () => {
        const number = 123_45678;

        const result = toNormalScale(number, 2);

        expect(result).toBe(123.47);
    });
});

describe('convertToBlockchainNumber', () => {
    it('converts a normal number to blockchain scale', () => {
        const number = 123.45678;

        const result = convertToBlockChainNumber(number);

        expect(result).toBe(12345678);
    });
});

describe('getAmountTwoDecimal', () => {
    it('Converts a number to two decimal places', () => {
        const number = 123_45600;

        const result = getAmountTwoDecimal(number);

        expect(result).toBe(123_46000);
    });
});

describe('calculateFigures', () => {
    const defaultOrder = {
        feePercentage: 0_600, // .6%
        nav: 10_00000,
        orderBy: 2,   // amt
        orderType: 3, // sub
        value: 1600_00000,
    };
    const maxDecimalisation = 2;
    const getOrder = (values = {}) => ({ ...defaultOrder, ...values });
    describe('Unknown NAV', () => {
        describe('By amount', () => {
            it('Should calculate estimated quantity', () => {
                const figures = calculateFigures(getOrder({ orderBy: 2 }), maxDecimalisation, false);

                expect(figures.estimatedQuantity).toBe(160_00000);
            });
            it('Should calculate estimated quantity to maxDecimalisation', () => {
                const figures = calculateFigures(getOrder({ orderBy: 2, nav: 35_00000 }), maxDecimalisation, false);

                expect(figures.estimatedQuantity).toBe(45_71000);
            });
        });

        describe('By quantity', () => {
            it('Should calculate estimated amount', () => {
                const figures = calculateFigures(getOrder({ orderBy: 1, value: 100_00000 }), maxDecimalisation, false);

                expect(figures.estimatedAmount).toBe(1000_00000);
            });
            it('Should calculate estimated amount with cost', () => {
                const figures = calculateFigures(getOrder({ orderBy: 1, value: 100_00000 }), maxDecimalisation, false);

                expect(figures.estimatedAmountWithCost).toBe(1006_00000);
            });
        });

        describe('Known nav is returned in results', () => {
            const figures = calculateFigures(getOrder({ orderBy: 1, value: 100_00000 }), maxDecimalisation, false);

            expect(figures.knownNav).toBe(false);
        });
    });
    describe('Known NAV', () => {
        describe('By amount', () => {
            it('Should calculate exact amount', () => {
                const figures = calculateFigures(getOrder({ orderBy: 2, nav: 35_00000 }), maxDecimalisation, true);

                expect(figures.amount).toBe(1599_85000);
            });
        });

        describe('By quantity', () => {
            it('Should calculate estimated amount', () => {
                const figures = calculateFigures(getOrder({ value: 100_00000, orderBy: 1 }), maxDecimalisation, true);

                expect(figures.estimatedAmount).toBe(1000_00000);
            });
            it('Should calculate estimated amount with cost', () => {
                const figures = calculateFigures(getOrder({ value: 100_00000, orderBy: 1  }), maxDecimalisation, true);

                expect(figures.estimatedAmountWithCost).toBe(1006_00000);
            });
        });

        describe('Known nav is returned in results', () => {
            const figures = calculateFigures(getOrder({ orderBy: 1, value: 100_00000 }), maxDecimalisation, true);

            expect(figures.knownNav).toBe(true);
        });
    });
});
