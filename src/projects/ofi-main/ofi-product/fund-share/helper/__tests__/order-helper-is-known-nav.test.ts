import {OrderHelper} from "../order-helper";
import {IznShareDetailWithNav, OrderDates, OrderRequest} from "../models";
import {NavStatus} from "../../../../ofi-req-services/ofi-product/nav/model";
import moment = require("moment");


describe('Is order using known NAV logic, order placed by NAV date', () => {
    it('Got NAV price for the valuation date with estimated status.', () => {
        const oh = new OrderHelper(({} as IznShareDetailWithNav), ({} as OrderRequest) )

        oh.nav = {
            value: 100000,
            date: "2019-01-01 00:00",
            status: NavStatus.ESTIMATE,
        };

        mockGetOrderDateMethod(oh, {
            cutoff: moment("2019-01-02 00:00"),
            valuation: moment('2019-01-01 00:00'),
            settlement: moment('2019-01-03 00:00'),
        });

        const isKnown = oh.isKnownNav();

        expect(isKnown).toBe(false);
    });
    it('Got NAV price for the valuation date with validated status.', () => {

        const oh = new OrderHelper(({} as IznShareDetailWithNav), ({} as OrderRequest) )

        oh.nav = {
            value: 100000,
            date: "2019-01-01 00:00",
            status: NavStatus.FINAL,
        };

        mockGetOrderDateMethod(oh, {
            cutoff: moment("2019-01-02 00:00"),
            valuation: moment('2019-01-01 00:00'),
            settlement: moment('2019-01-03 00:00'),
        });

        const isKnown = oh.isKnownNav();

        expect(isKnown).toBe(true);
    });

    it('Got NAV price before valuation date, with estimate status.', () => {

        const oh = new OrderHelper(({} as IznShareDetailWithNav), ({} as OrderRequest) )

        oh.nav = {
            value: 100000,
            date: "2019-01-01 00:00",
            status: NavStatus.ESTIMATE,
        };

        mockGetOrderDateMethod(oh, {
            cutoff: moment("2019-01-03 00:00"),
            valuation: moment('2019-01-02 00:00'),
            settlement: moment('2019-01-04 00:00'),
        });

        const isKnown = oh.isKnownNav();

        expect(isKnown).toBe(false);
    });

    it('Got NAV price before valuation date, with estimate status.', () => {

        const oh = new OrderHelper(({} as IznShareDetailWithNav), ({} as OrderRequest) )

        oh.nav = {
            value: 100000,
            date: "2019-01-01 00:00",
            status: NavStatus.FINAL,
        };

        mockGetOrderDateMethod(oh, {
            cutoff: moment("2019-01-03 00:00"),
            valuation: moment('2019-01-02 00:00'),
            settlement: moment('2019-01-04 00:00'),
        });

        const isKnown = oh.isKnownNav();

        expect(isKnown).toBe(false);
    });

    it('NAV price with date after order\'s valuation date, with estimate status.', () => {

        const oh = new OrderHelper(({} as IznShareDetailWithNav), ({} as OrderRequest) )

        oh.nav = {
            value: 100000,
            date: "2019-01-03 00:00",
            status: NavStatus.FINAL,
        };

        mockGetOrderDateMethod(oh, {
            cutoff: moment("2019-01-03 00:00"),
            valuation: moment('2019-01-02 00:00'),
            settlement: moment('2019-01-04 00:00'),
        });

        expect(()=> {
            oh.isKnownNav();
        }).toThrowError('NAV date is greater than order\'s valuation date.');
    });
});

/**
 * Mock OrderHelper's method getOrderDates
 * @param oh
 * @param ods
 */
function mockGetOrderDateMethod(oh: OrderHelper, ods: OrderDates): OrderHelper {
    const getOrderDatesMock = jest.spyOn(oh, "getOrderDates");
    // override the implementation
    getOrderDatesMock.mockImplementation(():OrderDates => {
        return ods
    });
    return oh;
}
