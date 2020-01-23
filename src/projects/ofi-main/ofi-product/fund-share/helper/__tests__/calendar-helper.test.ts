import { CalendarHelper } from "../calendar-helper";
import {IznShareDetailWithNav} from "../models";
import * as moment from 'moment-business-days';

const now = new Date('2019');
Date.now = jest.fn().mockReturnValue(now)

describe('Valuation day: outside working day is not allowed, cutoff period daily', () => {
    it('valuation offset: D-1', () => {
        const ch = new CalendarHelper(({
            holidayMgmtConfig: JSON.stringify(['2019-05-01']),
            subscriptionEnableNonWorkingDay: 0,
        } as IznShareDetailWithNav))

        mockValuationOffSetMethod(ch, -1);

        // getValuationDateFromCutoff (involve bank holiday)
        let cod = moment('2019-05-02');
        let gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-04-30');

        // getValuationDateFromCutoff (not involve bank holiday)
        cod = moment('2019-05-03');
        gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-05-02');

        // getCutoffDateFromValuation (involve bank holiday)
        let vd = moment('2019-04-30');
        let gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-05-02');

        // getCutoffDateFromValuation (not involve bank holiday)
        vd = moment('2019-05-02');
        gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-05-03');

        // isValidValuationDateTime (involve bank holiday)
        vd = moment('2019-04-30');
        let iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(true);

        // isValidValuationDateTime (involve bank holiday)
        vd = moment('2019-05-01');
        iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(false);
    });

    it('valuation offset: D', () => {
        const ch = new CalendarHelper(({
            holidayMgmtConfig: JSON.stringify(['2019-05-01']),
        } as IznShareDetailWithNav))

        mockValuationOffSetMethod(ch, 0);

        // getValuationDateFromCutoff
        let cod = moment('2019-05-02');
        let gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-05-02');

        // getCutoffDateFromValuation (involve bank holiday)
        let vd = moment('2019-05-02');
        let gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-05-02');

        // isValidValuationDateTime (involve bank holiday)
        vd = moment('2019-04-30');
        let iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(true);

    });

    it('valuation offset: D+1', () => {
        const ch = new CalendarHelper(({
            holidayMgmtConfig: JSON.stringify(['2019-05-01']),
        } as IznShareDetailWithNav))

        mockValuationOffSetMethod(ch, 1);

        // getValuationDateFromCutoff (involve bank holiday)
        let cod = moment('2019-04-30');
        let gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-05-02');

        // getValuationDateFromCutoff (not involve bank holiday)
        cod = moment('2019-05-03');
        gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-05-06');

        // getCutoffDateFromValuation (involve bank holiday)
        let vd = moment('2019-05-02');
        let gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-04-30');

        // getCutoffDateFromValuation (not involve bank holiday)
        vd = moment('2019-05-03');
        gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-05-02');

        // isValidValuationDateTime (involve bank holiday)
        vd = moment('2019-04-30');
        let iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(true);

        // isValidValuationDateTime (involve bank holiday)
        vd = moment('2019-05-01');
        iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(false);
    });
});

describe('Valuation day: outside working day is allowed, cutoff period daily', () => {
    it('valuation offset: D-1', () => {
        const ch = new CalendarHelper(({
            holidayMgmtConfig: JSON.stringify(['2019-05-01']),
            subscriptionEnableNonWorkingDay: 1,
        } as IznShareDetailWithNav))

        mockValuationOffSetMethod(ch, -1);

        // getValuationDateFromCutoff (involve bank holiday)
        let cod = moment('2019-05-02');
        let gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-05-01');

        // getValuationDateFromCutoff (involve weekend)
        cod = moment('2019-04-29');
        gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-04-28');

        // getValuationDateFromCutoff (only week days)
        cod = moment('2019-05-03');
        gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-05-02');

        // getCutoffDateFromValuation (involve bank holiday)
        let vd = moment('2019-05-01');
        let gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-05-02');

        // getCutoffDateFromValuation (involve weekend)
        vd = moment('2019-05-05');
        gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-05-06');

        // getCutoffDateFromValuation (only weekdays)
        vd = moment('2019-05-02');
        gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-05-03');

        // isValidValuationDateTime (involve bank holiday)
        vd = moment('2019-05-01');
        let iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(true);

        // isValidValuationDateTime (only week days)
        vd = moment('2019-05-02');
        iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(true);

        // isValidValuationDateTime (saturday)
        vd = moment('2019-04-06');
        iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(false);

    });

    it('valuation offset: D', () => {
        const ch = new CalendarHelper(({
            holidayMgmtConfig: JSON.stringify(['2019-05-01']),
            subscriptionEnableNonWorkingDay: 1,
        } as IznShareDetailWithNav))

        mockValuationOffSetMethod(ch, 0);

        // getValuationDateFromCutoff (involve bank holiday)
        let cod = moment('2019-04-30');
        let gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-05-01');

        // getValuationDateFromCutoff (involve weekend)
        cod = moment('2019-04-05');
        gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-04-07');

        // getValuationDateFromCutoff (only week days)
        cod = moment('2019-05-02');
        gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-05-02');

        // getCutoffDateFromValuation (involve bank holiday)
        let vd = moment('2019-05-01');
        let gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-04-30');

        // getCutoffDateFromValuation (involve weekend)
        vd = moment('2019-04-07');
        gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-04-05');

        // getCutoffDateFromValuation (only weekdays)
        vd = moment('2019-05-02');
        gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-05-02');

        // isValidValuationDateTime (involve bank holiday)
        vd = moment('2019-05-01');
        let iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(true);

        // isValidValuationDateTime (only week days)
        vd = moment('2019-05-02');
        iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(true);

        // isValidValuationDateTime (saturday)
        vd = moment('2019-04-06');
        iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(false);

    });

    it('valuation offset: D+1', () => {
        const ch = new CalendarHelper(({
            holidayMgmtConfig: JSON.stringify(['2019-05-01']),
            subscriptionEnableNonWorkingDay: 1,
        } as IznShareDetailWithNav))

        mockValuationOffSetMethod(ch, 1);

        // getValuationDateFromCutoff (involve bank holiday)
        let cod = moment('2019-04-29');
        let gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-05-01');

        // getValuationDateFromCutoff (involve weekend)
        cod = moment('2019-04-04');
        gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-04-07');

        // getValuationDateFromCutoff (only week days)
        cod = moment('2019-05-07');
        gvdfcv = ch.getValuationDateFromCutoff(cod, 3).format('YYYY-MM-DD');
        expect(gvdfcv).toBe('2019-05-08');

        // getCutoffDateFromValuation (involve bank holiday)
        let vd = moment('2019-05-01');
        let gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-04-29');

        // getCutoffDateFromValuation (involve weekend)
        vd = moment('2019-04-07');
        gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-04-04');

        // getCutoffDateFromValuation (only weekdays)
        vd = moment('2019-05-08');
        gcdfvv = ch.getCutoffDateFromValuation(vd, 3).format('YYYY-MM-DD');
        expect(gcdfvv).toBe('2019-05-07');

        // isValidValuationDateTime (involve bank holiday)
        vd = moment('2019-05-01');
        let iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(true);

        // isValidValuationDateTime (only week days)
        vd = moment('2019-05-02');
        iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(true);

        // isValidValuationDateTime (saturday)
        vd = moment('2019-04-06');
        iv = ch.isValidValuationDateTime(vd, 3);
        expect(iv).toBe(false);

    });

});

/**
 * Mock CalendarHelper's method valuationOffSet
 * @param ch
 * @param os
 */
function mockValuationOffSetMethod(ch: CalendarHelper, os: number): CalendarHelper {
    Object.defineProperty(ch, 'valuationOffSet', {
        get: jest.fn(() => os),
        set: jest.fn()
    });

    return ch;
}
