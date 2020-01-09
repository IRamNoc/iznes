import {
    getOrderTypeString,
} from '../order-view-helper';

describe('getOrderTypeString', () => {
    it('Get order type subscription string', () => {
        const orderData = {
            orderType: 3,
            sellBuyLinkOrderID: null,
        };
        const result: string = getOrderTypeString(orderData);

        expect(result).toBe('Subscription');
    });

    it('Get order type(string) subscription string', () => {
        const orderData = {
            orderType: '3',
            sellBuyLinkOrderID: null,
        };
        const result: string = getOrderTypeString(orderData);

        expect(result).toBe('Subscription');
    });

    it('Get order type redemption string', () => {
        const orderData = {
            orderType: 4,
            sellBuyLinkOrderID: null,
        };
        const result: string = getOrderTypeString(orderData);

        expect(result).toBe('Redemption');
    });

    it('Get order type(string) redemption string', () => {
        const orderData = {
            orderType: '4',
            sellBuyLinkOrderID: null,
        };
        const result: string = getOrderTypeString(orderData);

        expect(result).toBe('Redemption');
    });

    it('Get order type sell/buy - subscription string', () => {
        const orderData = {
            orderType: 3,
            sellBuyLinkOrderID: 4,
        };
        const result: string = getOrderTypeString(orderData);

        expect(result).toBe('Sell/Buy - Subscription');
    });

    it('Get order type(string) sell/buy - subscription string', () => {
        const orderData = {
            orderType: '3',
            sellBuyLinkOrderID: '4',
        };
        const result: string = getOrderTypeString(orderData);

        expect(result).toBe('Sell/Buy - Subscription');
    });

    it('Get order type sell/buy - redemption string', () => {
        const orderData = {
            orderType: 4,
            sellBuyLinkOrderID: 4,
        };
        const result: string = getOrderTypeString(orderData);

        expect(result).toBe('Sell/Buy - Redemption');
    });

    it('Get order type(string) sell/buy - redemption string', () => {
        const orderData = {
            orderType: '4',
            sellBuyLinkOrderID: '4',
        };
        const result: string = getOrderTypeString(orderData);

        expect(result).toBe('Sell/Buy - Redemption');
    });
});
