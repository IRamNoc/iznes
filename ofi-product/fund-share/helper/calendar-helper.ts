import {IznesShareDetail} from '../../../ofi-store/ofi-product/fund-share-list/model';
import {OrderType} from '../../../ofi-orders/order.model';
import * as moment from 'moment-business-days';
import * as E from '../FundShareEnum';
import * as ShareValue from '../fundShareValue';


export const FranceHolidays2018 = [
    //     Monday 1 January 2018 (New Year’s Day)
    '2018-01-01',

    // Friday 30 March 2018 (Good Friday)
    '2018-03-30',

    // Monday 2 April 2018 (Easter Monday)
    '2018-04-02',

    // Tuesday 1 May 2018 (Labour Day)
    '2018-05-01',

    // Tuesday 25 December 2018 (Christmas Day)
    '2018-12-25',

    // Wednesday 26 December 2018 (Boxing Day)
    '2018-12-26',
];

// set holidays
moment.locale('fr', {
    holidays: FranceHolidays2018,
    holidayFormat: 'YYYY-MM-DD'
});

export const DayNumber = {
    [E.WeeklyDealingDaysEnum.Monday]: 1,
    [E.WeeklyDealingDaysEnum.Tuesday]: 2,
    [E.WeeklyDealingDaysEnum.Wednesday]: 3,
    [E.WeeklyDealingDaysEnum.Thursday]: 4,
    [E.WeeklyDealingDaysEnum.Friday]: 5
};

export class CalendarHelper {
    fundShare: IznesShareDetail;
    orderType: OrderType = OrderType.Subscription;

    get tradeCyclePeriod() {
        return {
            [OrderType.Subscription]: this.fundShare.subscriptionTradeCyclePeriod || E.TradeCyclePeriodEnum.Daily,
            [OrderType.Redemption]: this.fundShare.redemptionTradeCyclePeriod || E.TradeCyclePeriodEnum.Daily,
        }[this.orderType];
    }

    get tradeTimeZone(): any {
        return {
            [OrderType.Subscription]: this.fundShare.subscriptionCutOffTimeZone || E.TimezonesEnum.UTC,
            [OrderType.Redemption]: this.fundShare.redemptionCutOffTimeZone || E.TimezonesEnum.UTC,
        }[this.orderType];
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
                    [E.TradeCyclePeriodEnum.Yearly]: this.fundShare.yearlySubscriptionDealingDays
                },
                [OrderType.Redemption]: {
                    [E.TradeCyclePeriodEnum.Weekly]: this.fundShare.weeklyRedemptionDealingDays,
                    [E.TradeCyclePeriodEnum.Monthly]: this.fundShare.monthlyRedemptionDealingDays,
                    [E.TradeCyclePeriodEnum.Yearly]: this.fundShare.yearlyRedemptionDealingDays
                }
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

    constructor(fundShare: IznesShareDetail) {
        this.fundShare = fundShare;
    }

    getNextCutoffDate(orderType: OrderType) {
        let dayToFind = getSpecificDateCutOff(moment(), this.cutoffTime, this.tradeTimeZone);

        for (let i = 1; i < 365; i++) {
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

        const dateTimeToCheckCopy = getSpecificDateCutOff(momentToMomentBusiness(dateTimeToChecks), this.cutoffTime, this.tradeTimeZone);

        // check the date cutoff is still in the future.
        const isDateTimeToCheckInFuture = Boolean(dateTimeToCheckCopy.valueOf() > moment().valueOf());

        if (!isDateTimeToCheckInFuture) {
            return false;
        }

        // check the date is not holiday
        if (isNonWorkingDate(dateTimeToCheckCopy)) {
            return false;
        }


        // depend on the trade period, we will have different logic to check if provided dateTime is valid cutoff.
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

    verifyWeeklyTradeDays(dateTimeToCheck: moment): boolean {
        const dayOfTheDate = dateTimeToCheck.days();

        for (const day of this.tradeDays) {

            const dateTimeToCheckCopy = dateTimeToCheck.clone();
            // check if the day is a trade day
            switch (day.id) {
                case E.WeeklyDealingDaysEnum.FirstBusinessDay:
                    // if yesterday is not a working day. that means the day we are checking is first business day.
                    const dateBeforeTheDateToCheck = dateTimeToCheckCopy.subtract(1, 'days');
                    if (isNonWorkingDate(dateBeforeTheDateToCheck)) {
                        return true;
                    }
                    break;

                case E.WeeklyDealingDaysEnum.LastBusinessDay:
                    // if tomorrow is not a working day. that means the day we checking is last business day.
                    const dateAfterTheDateToCheck = dateTimeToCheckCopy.add(1, 'days');
                    if (isNonWorkingDate(dateAfterTheDateToCheck)) {
                        return true;
                    }
                    break;

                case E.WeeklyDealingDaysEnum.Monday:
                case E.WeeklyDealingDaysEnum.Tuesday:
                case E.WeeklyDealingDaysEnum.Wednesday:
                case E.WeeklyDealingDaysEnum.Thursday:
                case E.WeeklyDealingDaysEnum.Friday:
                    const dayNumber = DayNumber[day.id];

                    if (dayOfTheDate === dayNumber) {
                        return true;
                    }
                    break;
            }
        }

        return false;
    }

    verifyMonthlyTradeDays(dateTimeToCheck: moment): boolean {
        const dayOfTheDate = Number(dateTimeToCheck.days());
        const dateOfTheMonth = Number(dateTimeToCheck.get('date'));
        const businessDayOfTheMonth = Number(getMonthBusinessDayIndex(dateTimeToCheck));

        for (const tradeDay of this.tradeDays) {
            const dateTimeToCheckCopy = dateTimeToCheck.clone();

            // check if the day is a trade day
            switch (tradeDay.termB) {
                case E.WeeklyDealingDaysAltEnum.CalendarDay:
                    if (Number(tradeDay.termA) === dateOfTheMonth) {
                        return true;
                    }

                    // check if last calendar day
                    if (tradeDay.termA === E.MonthlyDealingDaysEnum.Last && isLastCalenderDayOfTheMonth(dateTimeToCheckCopy)) {
                        return true;
                    }
                    break;

                case E.WeeklyDealingDaysAltEnum.BusinessDay:
                    if (Number(tradeDay.termA) === businessDayOfTheMonth) {
                        return true;
                    }

                    // check if last business day
                    if (tradeDay.termA === E.MonthlyDealingDaysEnum.Last && isLastBusinessDayOfTheMonth(dateTimeToCheckCopy)) {
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
                    const currentNumberOfWeek = getWeekIndexOfTheMonth(dateTimeToCheckCopy);
                    const numOfWeekMatch = Boolean(numberOfWeek === currentNumberOfWeek) ||
                        Boolean(tradeDay.termA === E.MonthlyDealingDaysEnum.Last && isLastWeekOfTheMonth(dateTimeToCheckCopy));


                    // check if the day match
                    const dayNumber = DayNumber[tradeDay.termB];
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
        const businessDayOfTheMonth = Number(getMonthBusinessDayIndex(dateTimeToCheck));
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
                    if (tradeDay.termA === E.MonthlyDealingDaysEnum.Last && isLastCalenderDayOfTheMonth(dateTimeToCheckCopy)) {
                        return true;
                    }
                    break;

                case E.WeeklyDealingDaysAltEnum.BusinessDay:
                    if (Number(tradeDay.termA) === businessDayOfTheMonth) {
                        return true;
                    }

                    // check if last business day
                    if (tradeDay.termA === E.MonthlyDealingDaysEnum.Last && isLastBusinessDayOfTheMonth(dateTimeToCheckCopy)) {
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
                    const currentNumberOfWeek = getWeekIndexOfTheMonth(dateTimeToCheckCopy);
                    const numOfWeekMatch = Boolean(numberOfWeek === currentNumberOfWeek) ||
                        Boolean(tradeDay.termA === E.MonthlyDealingDaysEnum.Last && isLastWeekOfTheMonth(dateTimeToCheckCopy));


                    // check if the day match
                    const dayNumber = DayNumber[tradeDay.termB];
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
        if (!isWorkingDate(momentToMomentBusiness(dateTimeToChecks))) {
            return false;
        }

        // get cutoff date from settlement date.
        const cutoffDate = dateTimeToChecks.businessSubtract(this.settlementOffSet);
        return this.isValidCutoffDateTime(cutoffDate, orderType);
    }

    isValidValuationDateTime(dateTimeToChecks: any, orderType: OrderType): boolean {
        // check if the date is working date
        if (!isWorkingDate(momentToMomentBusiness(dateTimeToChecks))) {
            return false;
        }

        // get cutoff date from valuation date.
        const cutoffDate = dateTimeToChecks.clone().businessSubtract(this.valuationOffSet);
        return this.isValidCutoffDateTime(cutoffDate, orderType);
    }

    getCutoffTimeForSpecificDate(dateToCheck: moment, orderType: OrderType) {
        this.orderType = orderType;
        return getSpecificDateCutOff(dateToCheck, this.cutoffTime, this.tradeTimeZone);
    }

    getValuationDateFromCutoff(cutoffDate: moment, orderType: OrderType) {
        cutoffDate = momentToMomentBusiness(cutoffDate);
        this.orderType = orderType;

        const timeZoneDiff = getTimeZoneDiff(this.tradeTimeZone);

        return cutoffDate.clone().businessAdd(this.valuationOffSet).set(
            {hour: 7 - timeZoneDiff, minute: 0, second: 0}
        );
    }

    getSettlementDateFromCutoff(cutoffDate: moment, orderType: OrderType) {
        cutoffDate = momentToMomentBusiness(cutoffDate);
        this.orderType = orderType;

        const timeZoneDiff = getTimeZoneDiff(this.tradeTimeZone);

        const settlementDate = cutoffDate.clone().businessAdd(this.settlementOffSet).set(
            {
                hour: 7 - timeZoneDiff,
                minute: 0,
                second: 1
            }
        );

        if (settlementDate.isSame(moment(), 'day')) {
            return moment().add(2, 'minute');
        }

        return settlementDate;
    }


    getCutoffDateFromValuation(valuationDate: moment, orderType: OrderType) {
        valuationDate = momentToMomentBusiness(valuationDate);
        this.orderType = orderType;

        return valuationDate.clone().businessSubtract(this.valuationOffSet);
    }

    getCutoffDateFromSettlement(settlementDate: moment, orderType: OrderType) {
        settlementDate = momentToMomentBusiness(settlementDate);
        this.orderType = orderType;

        return settlementDate.clone().businessSubtract(this.settlementOffSet);
    }

}


/**
 * Make sure we have a moment business day here
 * @param dateToConvert
 * @return {}
 */
export function momentToMomentBusiness(dateToConvert): moment {
    return moment(dateToConvert.valueOf());
}

/**
 * Convert moment object to specific timezone
 * @param momentObject
 * @param {TimezonesEnum} offSet
 * @return {any}
 */
export function convertToTimeZone(momentObject, offSet: E.TimezonesEnum): any {
    const offSetString = ShareValue.TimeZoneOffsetValue[offSet];
    return moment(momentObject.valueOf()).add(1, 'hours');
}


export function getSpecificDateCutOff(dateToCheck: moment, cutoffTime: moment, tradeTimeZone: E.TimezonesEnum): moment {
    const currentTimeZoneOffsetFromUtc = Number((new Date().getTimezoneOffset() / 60));
    const cutoffTimeZoneOffset = ShareValue.TimeZoneOffsetValue[tradeTimeZone];
    const timeZoneDiff = currentTimeZoneOffsetFromUtc - cutoffTimeZoneOffset;

    // work out the current date's cutoff
    return dateToCheck.clone().set(
        {
            hour: (cutoffTime.get('hour') - timeZoneDiff),
            minute: cutoffTime.get('minute'),
            second: cutoffTime.get('second')
        }
    );
}

export function getTimeZoneDiff(tradeTimeZone: E.TimezonesEnum) {
    const currentTimeZoneOffsetFromUtc = Number((new Date().getTimezoneOffset() / 60));
    const cutoffTimeZoneOffset = ShareValue.TimeZoneOffsetValue[tradeTimeZone];
    return currentTimeZoneOffsetFromUtc - cutoffTimeZoneOffset;
}


export function isNonWorkingDate(dateToCheck) {
    // // check if date is weekend.
    // if (dateToCheck.isWeekendDay()) {
    //     return true;
    // }
    //
    // // check if date is bank holiday.
    // const dateString = dateToCheck.format('YYYY-MM-DD');
    // return Boolean(FranceHolidays2018.indexOf(dateString) !== -1);

    return !dateToCheck.isBusinessDay();
}

export function isWorkingDate(dateToCheck) {
    return Boolean(!isNonWorkingDate(dateToCheck));
}

export function getMonthBusinessDayIndex(dateToCheck) {

    const lastDateOfLastMonth = dateToCheck.clone().date(0);
    return dateToCheck.businessDiff(lastDateOfLastMonth);
}

export function getBankHolidaysForTheMonth(dateToCheck, onlyIncludePast) {
    const monthIndexToCheck = dateToCheck.get('month');
    const holidaysOfTheMonth: Array<any> = [];

    for (const holiday of FranceHolidays2018) {
        const mHoliday = moment(holiday, 'YYYY-MM-DD');
        const holidayMonthIndex = mHoliday.get('month');

        if (monthIndexToCheck === holidayMonthIndex) {
            const isDayPast = Boolean(mHoliday.valueOf() < moment().valueOf());
            if (!onlyIncludePast || !isDayPast) {
                holidaysOfTheMonth.push(mHoliday);
            }
        }
    }

    return holidaysOfTheMonth;
}

export function getNumPastHolidaysForTheMonth(dateToCheck) {
    return getBankHolidaysForTheMonth(dateToCheck, true).length;
}

export function getNumPastNonWeekDaysForTheMonth(dateToCheck) {
    const dateToCheckCopy = dateToCheck.clone();
    const firstDayOfTheMonth = dateToCheckCopy.set({
        date: 1
    });

    return moment.weekendDays(firstDayOfTheMonth, dateToCheckCopy);
}

export function getWeekIndexOfTheMonth(dateToCheck) {
    const weekArr = dateToCheck.monthBusinessWeeks();

    let weekIndex = 1;
    for (const week of weekArr) {

        for (const day of week) {
            if (day.date() === dateToCheck.date()) {
                return weekIndex;
            }
        }
        weekIndex++;
    }

    return 0;
}

export function isLastCalenderDayOfTheMonth(dateToCheck) {
    const dateToCheckCopy = dateToCheck.clone();
    const lastDayOfTheMonth = dateToCheckCopy.add('months', 1).date(0);
    return Boolean(lastDayOfTheMonth.get('date') === dateToCheckCopy.get('date'));
}

export function isLastBusinessDayOfTheMonth(dateToCheck) {
    const dateToCheckCopy = dateToCheck.clone();
    const firstDayOfNextMonth = dateToCheckCopy.add('months', 1).date(1);
    const lastBusinessDayOfTheMonth = firstDayOfNextMonth.prevBusinessDay();
    return Boolean(lastBusinessDayOfTheMonth.get('date') === dateToCheckCopy.get('date'));
}

export function isLastWeekOfTheMonth(dateToCheck) {
    const currentWeekIndex = getWeekIndexOfTheMonth(dateToCheck);
    return Number(currentWeekIndex) === 4;
}

