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

    get settlementPivotDate() {
        return  {
            [OrderType.Subscription]: this.fundShare.subscriptionSettlementPivotDate || 0,
            [OrderType.Redemption]: this.fundShare.redemptionSettlementPivotDate || 0,
        }[this.orderType];
    }

    get valuationDateReference() {
        return  {
            [OrderType.Subscription]: this.fundShare.subscriptionValuationReference || 0,
            [OrderType.Redemption]: this.fundShare.redemptionValuationReference || 0,
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

    checkTradeDays(dateTimeToCheck) {
        if (this.tradeCyclePeriod === E.TradeCyclePeriodEnum.Weekly && !this.verifyWeeklyTradeDays(dateTimeToCheck)) {
            return false;
        }

        if (this.tradeCyclePeriod === E.TradeCyclePeriodEnum.Monthly && !this.verifyMonthlyTradeDays(dateTimeToCheck)) {
            return false;
        }

        if (this.tradeCyclePeriod === E.TradeCyclePeriodEnum.Yearly && this.verifyYearlyTradeDays(dateTimeToCheck)) {
            return false;
        }

        return true;
    }

    getNextCutoffDate(orderType: OrderType) {
        this.orderType = orderType;
        let dayToFind = this.getSpecificDateCutOff(moment(), this.cutoffTime, this.tradeTimeZoneOffset);
        let cutoffDateFound = false;

        // get cutoff calendar
        const cutoffCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buyCentralizationCalendar : this.fundShare.sellCentralizationCalendar;

        // initialize at D-1
        dayToFind = dayToFind.subtract(1, 'days');

        // loop until next cutoff date is found
        for (let i = 0; i < 366; i++) {
            dayToFind = dayToFind.add(1, 'days');

            const dateTimeToCheck = this.getSpecificDateCutOff(
                this.momentToMomentBusiness(dayToFind), this.cutoffTime, this.tradeTimeZoneOffset);

            // check if date is in the future
            if (dateTimeToCheck.valueOf() < moment().valueOf()) {
                continue;
            }

            // check if date is present in cutoff calendar holiday
            if (cutoffCalendar.includes(dateTimeToCheck.format('YYYY-MM-DD'))) {
                continue;
            }

            // check if date is valid on trade days (daily, weekly, monthly, yearly)
            if (!this.checkTradeDays(dateTimeToCheck)) {
                continue;
            }

            cutoffDateFound = true;
            break;
        }

        return dayToFind;
    }

    checkHolidayCalendar(calendarType: string, dateToCheck: any, orderType: number) {
        this.orderType = orderType;

        let calendar;
        const valuationDateReference = this.orderType === OrderType.Subscription ? this.fundShare.subscriptionValuationReference : this.fundShare.redemptionValuationReference;

        switch (calendarType) {
            case 'nav':
                calendar = this.orderType === OrderType.Subscription ? this.fundShare.buyNAVCalendar : this.fundShare.sellNAVCalendar;
                break;
            case 'settlement':
                calendar = this.orderType === OrderType.Subscription ? this.fundShare.buySettlementCalendar : this.fundShare.sellSettlementCalendar;
                break;
            case 'cutoff':
                calendar = this.orderType === OrderType.Subscription ? this.fundShare.buyCentralizationCalendar : this.fundShare.sellCentralizationCalendar;
                break;
        }

        if (calendarType === 'cutoff' || calendarType === 'settlement') {
            const dateTimeToCheckCopy = this.getSpecificDateCutOff(
                this.momentToMomentBusiness(dateToCheck), this.cutoffTime, this.tradeTimeZoneOffset);
            
            const isDateTimeToCheckInFuture = Boolean(
                dateTimeToCheckCopy.valueOf() > moment().valueOf());

            if (!isDateTimeToCheckInFuture) {
                return false;
            }
        }

        if (calendarType === 'nav' && valuationDateReference === E.ValuationReferenceDate.NextWorkingDay) {
            const nextValuationDate = dateToCheck.clone().add(1, 'days');
            return !calendar.includes(nextValuationDate.format('YYYY-MM-DD'));
        }

        return !calendar.includes(dateToCheck.format('YYYY-MM-DD'));
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
        const valuationDateReference = this.orderType === OrderType.Subscription ? this.fundShare.subscriptionValuationReference : this.fundShare.redemptionValuationReference;

        cutoffDate = this.momentToMomentBusiness(cutoffDate);
        this.orderType = orderType;

        let valuationDateStr;
        let newDate: moment.Moment;

        // allow outside working day
        if (this.valuationOffSet === E.BusinessDaysEnum.MinusOne) {
            // force the NAV Date to the previous day, whether or not this day is a working day
            newDate = cutoffDate.clone().subtract(1, 'day');
            
            if (valuationDateReference === E.ValuationReferenceDate.CalculationDay) {
                for (let i = 0; i < 366; i++) {
                    if (!valuationCalendar.includes(newDate.format('YYYY-MM-DD'))) break;
                    newDate = newDate.clone().subtract(1, 'day');
                }
            }
            
            valuationDateStr = newDate.format('YYYY-MM-DD');
        }
        if (this.valuationOffSet >= E.BusinessDaysEnum.Zero && this.valuationOffSet <= E.BusinessDaysEnum.Five) {
            newDate = cutoffDate.clone().add(this.valuationOffSet, 'day');
            
            if (valuationDateReference === E.ValuationReferenceDate.CalculationDay) {
                for (let i = 0; i < 366; i++) {
                    if (!valuationCalendar.includes(newDate.format('YYYY-MM-DD'))) break;
                    newDate = newDate.clone().add(1, 'day');   
                }
            }
            valuationDateStr = newDate.format('YYYY-MM-DD');
        }

        // NAV management dated the day before the next business day
        if (valuationDateReference === E.ValuationReferenceDate.NextWorkingDay) {
            let nextValuationDate = newDate.clone().add(1, 'day');

            for (let i = 0; i < 366; i++) {
                if(!valuationCalendar.includes(nextValuationDate.format('YYYY-MM-DD')) && !valuationCalendar.includes(newDate.format('YYYY-MM-DD'))) break;
                newDate = newDate.clone().add(1, 'day');
                nextValuationDate = nextValuationDate.clone().add(1, 'day');
            }

            valuationDateStr = newDate.format('YYYY-MM-DD');
        }

        return moment.utc(valuationDateStr).set({
            hour: 0,
            minute: 0,
            second: 1,
        });
    }

    getSettlementDateFromCutoff(cutoffDate: moment.Moment, valuationDate: moment.Moment, orderType: OrderType) {
        // get settlement holiday calendar
        const settlementCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buySettlementCalendar : this.fundShare.sellSettlementCalendar;
        const settlementPivot = this.orderType === OrderType.Subscription ? this.fundShare.subscriptionSettlementPivotDate : this.fundShare.redemptionSettlementPivotDate;
        let settlementPivotDate = settlementPivot === E.SettlementPivotDate.CutoffDate ? cutoffDate : valuationDate;
        let currentOffset = 0;

        this.orderType = orderType;

        if (currentOffset === this.settlementOffSet) {
            for (let i = 0; i < 366; i++) {
                if (!settlementCalendar.includes(settlementPivotDate.format('YYYY-MM-DD'))) break;
                settlementPivotDate = settlementPivotDate.clone().add(1, 'days');
            }
        } else {
            for (let i = 0; i < 366; i++) {
                if (currentOffset === this.settlementOffSet) break;
                settlementPivotDate = settlementPivotDate.clone().add(1, 'days');
                if (!settlementCalendar.includes(settlementPivotDate.format('YYYY-MM-DD'))) {
                    currentOffset = currentOffset + 1;
                }
            }
        }

        const settlementDateStr = settlementPivotDate.clone().format('YYYY-MM-DD');
        const settlementDate = moment.utc(settlementDateStr).set({
            hour: 0,
            minute: 0,
            second: 1,
        });

        if (settlementDate.isSame(moment(), 'day')) {
            return settlementDate.clone().add(2, 'minutes');
        }

        return settlementDate;
    }

    getCutoffDateFromValuation(valuationDate: moment.Moment, orderType: OrderType) {
        valuationDate = this.momentToMomentBusiness(valuationDate);
        this.orderType = orderType;

        const cutoffCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buyCentralizationCalendar : this.fundShare.sellCentralizationCalendar;
        const navCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buyNAVCalendar : this.fundShare.sellNAVCalendar;
        const valuationDateReference = this.orderType === OrderType.Subscription ? this.fundShare.subscriptionValuationReference : this.fundShare.redemptionValuationReference;

        let currentOpenDay = 0;
        let newDate = valuationDate.clone();

        if (this.valuationOffSet === E.BusinessDaysEnum.MinusOne) {
            for (let i = 0; i < 366; i++) {
                if (currentOpenDay === this.valuationOffSet) break;
                newDate = newDate.add(1, 'day');
                if (!navCalendar.includes(newDate.format('YYYY-MM-DD'))) {
                    currentOpenDay = currentOpenDay - 1;
                }
            }
        } else {
            for (let i = 0; i < 366; i++) {
                if (currentOpenDay === this.valuationOffSet) break;
                newDate = newDate.subtract(1, 'day');
                if (!navCalendar.includes(newDate.format('YYYY-MM-DD'))) {
                    currentOpenDay = currentOpenDay + 1;
                }
            }
        }

        if (valuationDateReference === E.ValuationReferenceDate.NextWorkingDay) {
            for (let i = 0; i < 366; i++) {
                if (!cutoffCalendar.includes(newDate.format('YYYY-MM-DD'))) break;
                newDate = newDate.clone().subtract(1, 'day');
            }

            return newDate;
        }

        if (cutoffCalendar.includes(newDate.format('YYYY-MM-DD'))) {
            return false;
        }

        return newDate;
    }

    getValuationDateFromSettlement(settlementDate: moment.Moment, orderType: OrderType) {
        this.orderType = orderType;
        const settlementPivot = this.orderType === OrderType.Subscription ? this.fundShare.subscriptionSettlementPivotDate : this.fundShare.redemptionSettlementPivotDate;
        const settlementCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buySettlementCalendar : this.fundShare.sellSettlementCalendar;
        const valuationCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buyNAVCalendar : this.fundShare.sellNAVCalendar;
        const valuationDateReference = this.orderType === OrderType.Subscription ? this.fundShare.subscriptionValuationReference : this.fundShare.redemptionValuationReference;

        let currentOpenDay = 0;
        let newDate = settlementDate.clone();

        for (let i = 0; i < 366; i++) {
            if (this.settlementOffSet === currentOpenDay) break;
            newDate = newDate.clone().subtract(1, 'day');

            if (settlementPivot === E.SettlementPivotDate.NavDate && valuationDateReference === E.ValuationReferenceDate.NextWorkingDay) {
                currentOpenDay = currentOpenDay + 1;
            } else {
                if (!settlementCalendar.includes(newDate.format('YYYY-MM-DD'))) {
                    currentOpenDay = currentOpenDay + 1;
                }
            }
        }

        if (settlementPivot === E.SettlementPivotDate.CutoffDate) {
            let navDate = this.getValuationDateFromCutoff(newDate, orderType);
            return navDate;
        }

        if (settlementPivot === E.SettlementPivotDate.NavDate) {
            if (valuationDateReference === E.ValuationReferenceDate.NextWorkingDay) {
                return newDate;
            } 

            if (valuationCalendar.includes(newDate.format('YYYY-MM-DD'))) {
                return false;
            }

            return newDate;
        }
    }

    getCutoffDateFromSettlement(settlementDate: moment.Moment, orderType: OrderType) {
        this.orderType = orderType;
        const settlementPivot = this.orderType === OrderType.Subscription ? this.fundShare.subscriptionSettlementPivotDate : this.fundShare.redemptionSettlementPivotDate;
        const cutoffCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buyCentralizationCalendar : this.fundShare.sellCentralizationCalendar;
        const settlementCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buySettlementCalendar : this.fundShare.sellSettlementCalendar;
        const valuationCalendar = this.orderType === OrderType.Subscription ? this.fundShare.buyNAVCalendar : this.fundShare.sellNAVCalendar;
        const valuationDateReference = this.orderType === OrderType.Subscription ? this.fundShare.subscriptionValuationReference : this.fundShare.redemptionValuationReference;

        let currentOpenDay = 0;
        let newDate = settlementDate.clone();

        for (let i = 0; i < 366; i++) {
            if (this.settlementOffSet === currentOpenDay) break;

            newDate = newDate.subtract(1, 'day');
            if (settlementPivot === E.SettlementPivotDate.NavDate && valuationDateReference === E.ValuationReferenceDate.NextWorkingDay) {
                currentOpenDay = currentOpenDay + 1;
            } else {
                if (!settlementCalendar.includes(newDate.format('YYYY-MM-DD'))) {
                    currentOpenDay = currentOpenDay + 1;
                }
            }
        }

        if (settlementPivot === E.SettlementPivotDate.CutoffDate) {
            // check the date is not in specific calendar
            if (cutoffCalendar.includes(newDate.format('YYYY-MM-DD'))) {
                return false;
            }

            return newDate;
        }

        if (settlementPivot === E.SettlementPivotDate.NavDate) {
            // check the date is not in specific calendar
            
            if (valuationDateReference === E.ValuationReferenceDate.NextWorkingDay) {
                let cutoffDate = this.getCutoffDateFromValuation(newDate, orderType);
                return cutoffDate;
            } else {
                if (valuationCalendar.includes(newDate.format('YYYY-MM-DD'))) {
                    return false;
                }

                let cutoffDate = this.getCutoffDateFromValuation(newDate, orderType);
                if (!this.isValidCutoffDateTime(cutoffDate, orderType)) {
                    return false;
                }

                return cutoffDate;
            }
        }
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
