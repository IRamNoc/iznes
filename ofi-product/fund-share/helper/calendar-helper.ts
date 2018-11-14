import { IznShareDetailWithNav } from './models';
import { OrderType } from '../../../ofi-orders/order.model';
import * as moment from 'moment-business-days';
import * as momentTz from 'moment-timezone';
import * as E from '../FundShareEnum';
import * as ShareValue from '../fundShareValue';

export const FRANCE_HOLIDAYS_2018 = [
    //     Monday 1 January 2018 (New Year’s Day)
    '2018-01-01',

    // Friday 30 March 2018 (Good Friday)
    '2018-03-30',

    // Monday 2 April 2018 (Easter Monday)
    '2018-04-02',

    // Tuesday 1 May 2018 (Labour Day)
    '2018-05-01',

    '2018-06-04',

    // Tuesday 25 December 2018 (Christmas Day)
    '2018-12-25',

    // Wednesday 26 December 2018 (Boxing Day)
    '2018-12-26',
];

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
                holidays = FRANCE_HOLIDAYS_2018;
            }

        } catch (e) {
            holidays = FRANCE_HOLIDAYS_2018;
        }

        // set holidays
        moment.locale('fr', {
            holidays,
            holidayFormat: 'YYYY-MM-DD',
        });
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

        const dateTimeToCheckCopy = this.getSpecificDateCutOff(
            this.momentToMomentBusiness(dateTimeToChecks), this.cutoffTime, this.tradeTimeZoneOffset);

        // check the date cutoff is still in the future.
        const isDateTimeToCheckInFuture = Boolean(
            dateTimeToCheckCopy.valueOf() > moment().valueOf());

        if (!isDateTimeToCheckInFuture) {
            return false;
        }

        // check the date is not holiday
        if (this.isNonWorkingDate(dateTimeToCheckCopy)) {
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
                if (this.isNonWorkingDate(dateBeforeTheDateToCheck)) {
                    return true;
                }
                break;

            case E.WeeklyDealingDaysEnum.LastBusinessDay:
                // if tomorrow is not a working day. that means the day we checking
                // is last business day.
                const dateAfterTheDateToCheck = dateTimeToCheckCopy.add(1, 'days');
                if (this.isNonWorkingDate(dateAfterTheDateToCheck)) {
                    return true;
                }
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
        if (!this.isWorkingDate(dateTimeToChecks)) {
            return false;
        }

        // get cutoff date from settlement date.
        const cutoffDate = dateTimeToChecks.businessSubtract(this.settlementOffSet);
        return this.isValidCutoffDateTime(cutoffDate, orderType);
    }

    isValidValuationDateTime(dateTimeToChecks: any, orderType: OrderType): boolean {
        // check if the date is working date
        dateTimeToChecks = this.momentToMomentBusiness(dateTimeToChecks);
        if (!this.isWorkingDate(dateTimeToChecks)) {
            return false;
        }

        // get cutoff date from valuation date.
        const cutoffDate = dateTimeToChecks.clone().businessSubtract(this.valuationOffSet);
        return this.isValidCutoffDateTime(cutoffDate, orderType);
    }

    getCutoffTimeForSpecificDate(dateToCheck: moment.Moment, orderType: OrderType) {
        this.orderType = orderType;
        return this.getSpecificDateCutOff(dateToCheck, this.cutoffTime, this.tradeTimeZoneOffset);
    }

    getValuationDateFromCutoff(cutoffDate: moment.Moment, orderType: OrderType) {
        cutoffDate = this.momentToMomentBusiness(cutoffDate);
        this.orderType = orderType;

        const valuationDateStr = cutoffDate.clone().businessAdd(
            this.valuationOffSet).format('YYYY-MM-DD');
        return moment.utc(valuationDateStr).set({
            hour: 0,
            minute: 0,
            second: 1,
        });
    }

    getSettlementDateFromCutoff(cutoffDate: moment.Moment, orderType: OrderType) {
        cutoffDate = this.momentToMomentBusiness(cutoffDate);
        this.orderType = orderType;

        const settlementDateStr = cutoffDate.clone().businessAdd(
            this.settlementOffSet as number).format('YYYY-MM-DD');
        const settlementDate = moment.utc(settlementDateStr).set({
            hour: 0,
            minute: 0,
            second: 1,
        });

        if (settlementDate.isSame(moment(), 'day')) {
            return cutoffDate.clone().add(2, 'minutes');
        }

        return settlementDate;
    }

    getCutoffDateFromValuation(valuationDate: moment.Moment, orderType: OrderType) {
        valuationDate = this.momentToMomentBusiness(valuationDate);
        this.orderType = orderType;

        return valuationDate.clone().businessSubtract(this.valuationOffSet);
    }

    getCutoffDateFromSettlement(settlementDate: moment.Moment, orderType: OrderType) {
        settlementDate = this.momentToMomentBusiness(settlementDate);
        this.orderType = orderType;

        return settlementDate.clone().businessSubtract(this.settlementOffSet as number);
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

    isNonWorkingDate(dateToCheck) {
        return !dateToCheck.isBusinessDay();
    }

    isWorkingDate(dateToCheck) {
        return Boolean(!this.isNonWorkingDate(dateToCheck));
    }

    getMonthBusinessDayIndex(dateToCheck) {

        const lastDateOfLastMonth = dateToCheck.clone().date(0);
        return dateToCheck.businessDiff(lastDateOfLastMonth);
    }

    getWeekIndexOfTheMonth(dateToCheck) {
        const weekArr = dateToCheck.monthBusinessWeeks();

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
        const lastDayOfTheMonth = dateToCheckCopy.add('months', 1).date(0);
        return Boolean(lastDayOfTheMonth.get('date') === dateToCheckCopy.get('date'));
    }

    isLastBusinessDayOfTheMonth(dateToCheck) {
        const dateToCheckCopy = dateToCheck.clone();
        const firstDayOfNextMonth = dateToCheckCopy.add('months', 1).date(1);
        const lastBusinessDayOfTheMonth = firstDayOfNextMonth.prevBusinessDay();
        return Boolean(lastBusinessDayOfTheMonth.get('date') === dateToCheckCopy.get('date'));
    }

    isLastWeekOfTheMonth(dateToCheck) {
        const currentWeekIndex = this.getWeekIndexOfTheMonth(dateToCheck);
        return Number(currentWeekIndex) === 4;
    }

}
