import { IznShareDetailWithNav } from './models';
import { OrderType } from '../../../ofi-orders/order.model';
import * as moment from 'moment-business-days';
import * as momentTz from 'moment-timezone';
import * as E from '../FundShareEnum';

export const DAY_NUMBER = {
    [E.WeeklyDealingDaysEnum.Monday]: 1,
    [E.WeeklyDealingDaysEnum.Tuesday]: 2,
    [E.WeeklyDealingDaysEnum.Wednesday]: 3,
    [E.WeeklyDealingDaysEnum.Thursday]: 4,
    [E.WeeklyDealingDaysEnum.Friday]: 5,
};

export class CalendarHelper {
    fundShare: IznShareDetailWithNav;
    orderType: OrderType = OrderType.Subscription;
    fundShareHoliday: string [];

    get tradeCyclePeriod() {
        return {
            [OrderType.Subscription]: this.fundShare.subscriptionTradeCyclePeriod ||
            E.TradeCyclePeriodEnum.Daily,
            [OrderType.Redemption]: this.fundShare.redemptionTradeCyclePeriod ||
            E.TradeCyclePeriodEnum.Daily,
        }[this.orderType];
    }

    get tradeTimeZoneOffset(): any {
        try {
            const timeZonString = {
                [OrderType.Subscription]: this.fundShare.subscriptionCutOffTimeZone ||
                E.TimezonesEnum.UTC,
                [OrderType.Redemption]: this.fundShare.redemptionCutOffTimeZone || 'UTC',
            }[this.orderType];

            // Handle old timezoneString, it was number;
            if (!isNaN(Number(timeZonString))) {
                return 0;
            }

            return momentTz.tz(timeZonString).hours() - momentTz.utc().hours();
        } catch (e) {
            return 0;
        }

    }

    get cutoffTime() {
        const cutoffTimeStr = {
            [OrderType.Subscription]: this.fundShare.subscriptionCutOffTime || '00:00',
            [OrderType.Redemption]: this.fundShare.redemptionCutOffTime || '00:00',
        }[this.orderType];

        return moment(cutoffTimeStr, 'HH:mm');
    }

    get tradeDays() {
        try {
            const tradeDaysJsonStr = {
                [OrderType.Subscription]: {
                    [E.TradeCyclePeriodEnum.Weekly]: this.fundShare.weeklySubscriptionDealingDays,
                    [E.TradeCyclePeriodEnum.Monthly]: this.fundShare.monthlySubscriptionDealingDays,
                    [E.TradeCyclePeriodEnum.Yearly]: this.fundShare.yearlySubscriptionDealingDays,
                },
                [OrderType.Redemption]: {
                    [E.TradeCyclePeriodEnum.Weekly]: this.fundShare.weeklyRedemptionDealingDays,
                    [E.TradeCyclePeriodEnum.Monthly]: this.fundShare.monthlyRedemptionDealingDays,
                    [E.TradeCyclePeriodEnum.Yearly]: this.fundShare.yearlyRedemptionDealingDays,
                },
            }[this.orderType][this.tradeCyclePeriod] as any;

            return JSON.parse(tradeDaysJsonStr);
        } catch (e) {
            return [];
        }
    }

    get settlementOffSet() {
        return {
            [OrderType.Subscription]: this.fundShare.subscriptionSettlementPeriod || 0,
            [OrderType.Redemption]: this.fundShare.redemptionSettlementPeriod || 0,
        }[this.orderType];

    }

    get valuationOffSet() {
        return {
            [OrderType.Subscription]: this.fundShare.navPeriodForSubscription || 0,
            [OrderType.Redemption]: this.fundShare.navPeriodForRedemption || 0,
        }[this.orderType];
    }

    constructor(fundShare: IznShareDetailWithNav) {
        this.fundShare = fundShare;

        let holidays;
        try {
            holidays = JSON.parse(fundShare.holidayMgmtConfig);

            if (!(holidays instanceof Array)) {
                holidays = [];
            }

        } catch (e) {
            holidays = [];
        }

        // set holidays
        // 20-08-2021 - Rule disabled by Charles Paris - Replaced by new calendar holiday rule TG-673
        /*
        moment.updateLocale('fr', {
            holidays,
            holidayFormat: 'YYYY-MM-DD',
        });
        */
    }

    getNextCutoffDate(orderType: OrderType) {
        this.orderType = orderType;
        let dayToFind = this.getSpecificDateCutOff(moment(), this.cutoffTime, this.tradeTimeZoneOffset);

        for (let i = 1; i < 365; i += 1) {
            const isCutoff = this.isValidCutoffDateTime(dayToFind, orderType);
            if (isCutoff) {
                break;
            }

            dayToFind = dayToFind.add(1, 'days');
        }

        return dayToFind;
    }

    isValidCutoffDateTime(dateTimeToChecks: any, orderType: OrderType): boolean {
        this.orderType = orderType;

        const cutoffCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buyCentralizationCalendar : this.fundShare.sellCentralizationCalendar;

        const dateTimeToCheckCopy = this.getSpecificDateCutOff(
            this.momentToMomentBusiness(dateTimeToChecks), this.cutoffTime, this.tradeTimeZoneOffset);

        // check the date cutoff is still in the future.
        const isDateTimeToCheckInFuture = Boolean(
            dateTimeToCheckCopy.valueOf() > moment().valueOf());

        if (!isDateTimeToCheckInFuture) {
            return false;
        }

        // check the date is not in specific calendar
        if (cutoffCalendar.includes(dateTimeToCheckCopy.format('YYYY-MM-DD'))) {
            return false;
        }

        // depend on the trade period, we will have different logic to check if provided dateTime
        // is valid cutoff.
        switch (this.tradeCyclePeriod) {
        case E.TradeCyclePeriodEnum.Daily:
            return true;

        case E.TradeCyclePeriodEnum.Weekly:
            return this.verifyWeeklyTradeDays(dateTimeToCheckCopy);

        case E.TradeCyclePeriodEnum.Monthly:
            return this.verifyMonthlyTradeDays(dateTimeToCheckCopy);

        case E.TradeCyclePeriodEnum.Yearly:
            return this.verifyYearlyTradeDays(dateTimeToCheckCopy);
        }

        return false;
    }

    verifyWeeklyTradeDays(dateTimeToCheck: moment.Moment): boolean {
        const dayOfTheDate = dateTimeToCheck.days();

        for (const day of this.tradeDays) {

            const dateTimeToCheckCopy = dateTimeToCheck.clone();
            // check if the day is a trade day
            switch (day.id) {
            case E.WeeklyDealingDaysEnum.FirstBusinessDay:
                // if yesterday is not a working day.
                // that means the day we are checking is first business day.
                const dateBeforeTheDateToCheck = dateTimeToCheckCopy.subtract(1, 'days');
                break;

            case E.WeeklyDealingDaysEnum.LastBusinessDay:
                // if tomorrow is not a working day. that means the day we checking
                // is last business day.
                const dateAfterTheDateToCheck = dateTimeToCheckCopy.add(1, 'days');
                break;

            case E.WeeklyDealingDaysEnum.Monday:
            case E.WeeklyDealingDaysEnum.Tuesday:
            case E.WeeklyDealingDaysEnum.Wednesday:
            case E.WeeklyDealingDaysEnum.Thursday:
            case E.WeeklyDealingDaysEnum.Friday:
                const dayNumber = DAY_NUMBER[day.id];

                if (dayOfTheDate === dayNumber) {
                    return true;
                }
                break;
            }
        }

        return false;
    }

    verifyMonthlyTradeDays(dateTimeToCheck: moment.Moment): boolean {
        const dayOfTheDate = Number(dateTimeToCheck.days());
        const dateOfTheMonth = Number(dateTimeToCheck.get('date'));
        const businessDayOfTheMonth = Number(this.getMonthBusinessDayIndex(dateTimeToCheck));

        for (const tradeDay of this.tradeDays) {
            const dateTimeToCheckCopy = dateTimeToCheck.clone();

            // check if the day is a trade day
            switch (tradeDay.termB) {
            case E.WeeklyDealingDaysAltEnum.CalendarDay:
                if (Number(tradeDay.termA) === dateOfTheMonth) {
                    return true;
                }

                // check if last calendar day
                if (tradeDay.termA === E.MonthlyDealingDaysEnum.Last &&
                    this.isLastCalenderDayOfTheMonth(dateTimeToCheckCopy)) {
                    return true;
                }
                break;

            case E.WeeklyDealingDaysAltEnum.BusinessDay:
                if (Number(tradeDay.termA) === businessDayOfTheMonth) {
                    return true;
                }

                // check if last business day
                if (tradeDay.termA === E.MonthlyDealingDaysEnum.Last &&
                    this.isLastBusinessDayOfTheMonth(dateTimeToCheckCopy)) {
                    return true;
                }
                break;

            case E.WeeklyDealingDaysAltEnum.Monday:
            case E.WeeklyDealingDaysAltEnum.Tuesday:
            case E.WeeklyDealingDaysAltEnum.Wednesday:
            case E.WeeklyDealingDaysAltEnum.Thursday:
            case E.WeeklyDealingDaysAltEnum.Friday:
                // check if the numberOf week match
                const numberOfWeek = Number(tradeDay.termA);
                const currentNumberOfWeek = this.getWeekIndexOfTheMonth(dateTimeToCheckCopy);
                const numOfWeekMatch = Boolean(numberOfWeek === currentNumberOfWeek) ||
                    Boolean(tradeDay.termA === E.MonthlyDealingDaysEnum.Last &&
                        this.isLastWeekOfTheMonth(dateTimeToCheckCopy));

                // check if the day match
                const dayNumber = DAY_NUMBER[tradeDay.termB];
                const dayMatch = Boolean(dayNumber === dayOfTheDate);

                if (numOfWeekMatch && dayMatch) {
                    return true;
                }
                break;
            }
        }

        return false;

    }

    verifyYearlyTradeDays(dateTimeToCheck) {
        const dayOfTheDate = Number(dateTimeToCheck.days());
        const dateOfTheMonth = Number(dateTimeToCheck.get('date'));
        const businessDayOfTheMonth = Number(this.getMonthBusinessDayIndex(dateTimeToCheck));
        const monthOfTheYear = Number(dateTimeToCheck.get('month'));

        for (const tradeDay of this.tradeDays) {
            const dateTimeToCheckCopy = dateTimeToCheck.clone();

            // check if the month is right
            if (monthOfTheYear !== Number(tradeDay.termC)) {
                continue;
            }

            // check if the day is a trade day
            switch (tradeDay.termB) {
            case E.WeeklyDealingDaysAltEnum.CalendarDay:
                if (Number(tradeDay.termA) === dateOfTheMonth) {
                    return true;
                }

                // check if last calendar day
                if (tradeDay.termA === E.MonthlyDealingDaysEnum.Last &&
                    this.isLastCalenderDayOfTheMonth(dateTimeToCheckCopy)) {
                    return true;
                }
                break;

            case E.WeeklyDealingDaysAltEnum.BusinessDay:
                if (Number(tradeDay.termA) === businessDayOfTheMonth) {
                    return true;
                }

                // check if last business day
                if (tradeDay.termA === E.MonthlyDealingDaysEnum.Last &&
                    this.isLastBusinessDayOfTheMonth(dateTimeToCheckCopy)) {
                    return true;
                }
                break;

            case E.WeeklyDealingDaysAltEnum.Monday:
            case E.WeeklyDealingDaysAltEnum.Tuesday:
            case E.WeeklyDealingDaysAltEnum.Wednesday:
            case E.WeeklyDealingDaysAltEnum.Thursday:
            case E.WeeklyDealingDaysAltEnum.Friday:
                // check if the numberOf week match
                const numberOfWeek = Number(tradeDay.termA);
                const currentNumberOfWeek = this.getWeekIndexOfTheMonth(dateTimeToCheckCopy);
                const numOfWeekMatch = Boolean(numberOfWeek === currentNumberOfWeek) ||
                    Boolean(tradeDay.termA === E.MonthlyDealingDaysEnum.Last &&
                        this.isLastWeekOfTheMonth(dateTimeToCheckCopy));

                // check if the day match
                const dayNumber = DAY_NUMBER[tradeDay.termB];
                const dayMatch = Boolean(dayNumber === dayOfTheDate);

                if (numOfWeekMatch && dayMatch) {

                    return true;
                }
                break;
            }
        }

        return false;

    }

    isValidSettlementDateTime(dateTimeToChecks: any, orderType: OrderType): boolean {
        // check if the date is working date
        dateTimeToChecks = this.momentToMomentBusiness(dateTimeToChecks);

        const settlementCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buySettlementCalendar : this.fundShare.sellSettlementCalendar;

        // check the date is not in specific calendar
        if (settlementCalendar.includes(dateTimeToChecks.format('YYYY-MM-DD'))) {
            return false;
        }

        // get cutoff date from settlement date.
        //const cutoffDate = dateTimeToChecks.subtract(this.settlementOffSet);
        //return this.isValidCutoffDateTime(cutoffDate, orderType);
        return true;
    }

    isValidValuationDateTime(dateTimeToChecks: any, orderType: OrderType): boolean {
        const valuationCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buyNAVCalendar : this.fundShare.sellNAVCalendar;
        // check if the date is working date
        dateTimeToChecks = this.momentToMomentBusiness(dateTimeToChecks);

        // check the date is not in specific calendar
        if (valuationCalendar.includes(dateTimeToChecks.format('YYYY-MM-DD'))) {
            return false;
        }

        // get cutoff date from valuation date.
        const cutoffDate = this.getCutoffDateFromValuation(dateTimeToChecks, orderType);
        return this.isValidCutoffDateTime(cutoffDate, orderType);
    }

    getCutoffTimeForSpecificDate(dateToCheck: moment.Moment, orderType: OrderType) {
        this.orderType = orderType;
        return this.getSpecificDateCutOff(dateToCheck, this.cutoffTime, this.tradeTimeZoneOffset);
    }

    getValuationDateFromCutoff(cutoffDate: moment.Moment, orderType: OrderType) {
        const valuationCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buyNAVCalendar : this.fundShare.sellNAVCalendar;

        cutoffDate = this.momentToMomentBusiness(cutoffDate);
        this.orderType = orderType;

        let valuationDateStr;

        // allow outside working day
        if (this.valuationOffSet === E.BusinessDaysEnum.MinusOne) {
            // force the NAV Date to the previous day, whether or not this day is a working day
            let newDate = cutoffDate.clone().subtract(1, 'day');
            while (valuationCalendar.includes(newDate.format('YYYY-MM-DD'))) {
                newDate = newDate.clone().subtract(1, 'day');
            }
            
            valuationDateStr = newDate.format('YYYY-MM-DD');
        }
        if (this.valuationOffSet >= E.BusinessDaysEnum.Zero && this.valuationOffSet <= E.BusinessDaysEnum.Five) {
            let newDate = cutoffDate.clone().add(this.valuationOffSet, 'day');
            
            while (valuationCalendar.includes(newDate.format('YYYY-MM-DD'))) {
                newDate = newDate.clone().add(1, 'day');
            }
            valuationDateStr = newDate.format('YYYY-MM-DD');
        }
        return moment.utc(valuationDateStr).set({
            hour: 0,
            minute: 0,
            second: 1,
        });
    }

    getSettlementDateFromCutoff(cutoffDate: moment.Moment, orderType: OrderType) {
        // get settlement holiday calendar
        const settlementCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buySettlementCalendar : this.fundShare.sellSettlementCalendar;

        this.orderType = orderType;

        const settlementDateStr = cutoffDate.clone().add(this.settlementOffSet, 'days').format('YYYY-MM-DD');
        const settlementDate = moment.utc(settlementDateStr).set({
            hour: 0,
            minute: 0,
            second: 1,
        });

        // check the date is not in specific calendar
        if (settlementCalendar.includes(settlementDate.format('YYYY-MM-DD'))) {
            let newSetDate = settlementDate.clone().add(1, 'days');

            while(settlementCalendar.includes(newSetDate.format('YYYY-MM-DD'))) {
                newSetDate = newSetDate.clone().add(1, 'days');
            }

            return newSetDate;
        }

        if (settlementDate.isSame(moment(), 'day')) {
            return cutoffDate.clone().add(2, 'minutes');
        }

        return settlementDate;
    }

    getCutoffDateFromValuation(valuationDate: moment.Moment, orderType: OrderType) {
        valuationDate = this.momentToMomentBusiness(valuationDate);
        this.orderType = orderType;

        const cutoffCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buyCentralizationCalendar : this.fundShare.sellCentralizationCalendar;

        if (this.valuationOffSet === E.BusinessDaysEnum.MinusOne) {
            // force the NAV Date to the previous day, whether or not this day is a working day
            // opposite with getValuationDateFromCutoff
            let newDate = valuationDate.clone().add(1, 'day');
            while (cutoffCalendar.includes(newDate.format('YYYY-MM-DD'))) {
                newDate = newDate.clone().add(1, 'day');
            }
            return newDate;
        }
        if (this.valuationOffSet >= E.BusinessDaysEnum.Zero && this.valuationOffSet <= E.BusinessDaysEnum.Five) {
            // working day work offset
            const wos = this.valuationOffSet + 1;

            // force the NAV Date to the day before the next offset + 1 business day, whether or not that day is a business day
            // opposite with getValuationDateFromCutoff
            // plus 1 calendar day
            const p1c = valuationDate.clone().add(1, 'day');
            // after plus 1 calendar day, this day need to be a working day.
            // e.g if valuation day is saturday, plus 1 day, would be sunday, this case it should be false.
            let newDate = p1c.clone().subtract(wos, 'day');
            while (cutoffCalendar.includes(newDate.format('YYYY-MM-DD'))) {
                newDate = newDate.clone().subtract(1, 'day');
            }
            return newDate;
        }
    }

    getCutoffDateFromSettlement(settlementDate: moment.Moment, orderType: OrderType) {
        this.orderType = orderType;

        const cutoffCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buyCentralizationCalendar : this.fundShare.sellCentralizationCalendar;

        let newDate = settlementDate.clone().subtract(this.settlementOffSet as number, 'days');
        // check the date is not in specific calendar
        while (cutoffCalendar.includes(newDate.format('YYYY-MM-DD'))) {
            newDate = newDate.clone().subtract(1, 'days');
        }

        return newDate;
    }

    /**
     * Make sure we have a moment business day here
     * @param dateToConvert
     * @return {}
     */
    momentToMomentBusiness(dateToConvert): moment.Moment {
        return moment(dateToConvert.valueOf());
    }

    getSpecificDateCutOff(dateToCheck: moment.Moment, cutoffTime: moment.Moment,
                          tradeTimeZoneOffSet: number): moment.Moment {
        const currentTimeZoneOffsetFromUtc = moment().hours() - momentTz.utc().hours();
        const timeZoneDiff = tradeTimeZoneOffSet - currentTimeZoneOffsetFromUtc;

        // work out the current date's cutoff
        return dateToCheck.clone().set(
            {
                hour: (cutoffTime.get('hour') - timeZoneDiff),
                minute: cutoffTime.get('minute'),
                second: cutoffTime.get('second'),
            },
        );
    }

    getTimeZoneDiff(tradeTimeZoneOffSet: number): number {
        const currentTimeZoneOffsetFromUtc = moment().hours() - momentTz.utc().hours();
        return tradeTimeZoneOffSet - currentTimeZoneOffsetFromUtc;
    }

    getMonthBusinessDayIndex(dateToCheck) {

        const lastDateOfLastMonth = dateToCheck.clone().date(0);
        return dateToCheck.diff(lastDateOfLastMonth);
    }

    getWeekIndexOfTheMonth(dateToCheck) {
        const weekArr = dateToCheck.monthNaturalWeeks();

        let weekIndex = 1;
        for (const week of weekArr) {

            for (const day of week) {
                if (day.date() === dateToCheck.date()) {
                    return weekIndex;
                }
            }
            weekIndex += 1;
        }

        return 0;
    }

    isLastCalenderDayOfTheMonth(dateToCheck) {
        const dateToCheckCopy = dateToCheck.clone();
        const lastDayOfTheMonth = dateToCheckCopy.clone().add('months', 1).date(0);
        return Boolean(lastDayOfTheMonth.get('date') === dateToCheckCopy.get('date'));
    }

    isLastBusinessDayOfTheMonth(dateToCheck) {
        const dateToCheckCopy = dateToCheck.clone();
        const firstDayOfNextMonth = dateToCheckCopy.clone().add('months', 1).date(1);
        const lastBusinessDayOfTheMonth = firstDayOfNextMonth.subtract(1, 'days');
        return Boolean(lastBusinessDayOfTheMonth.get('date') === dateToCheckCopy.get('date'));
    }

    isLastWeekOfTheMonth(dateToCheck) {
        const currentWeekIndex = this.getWeekIndexOfTheMonth(dateToCheck.clone());
        return Number(currentWeekIndex) === 4;
    }

}
