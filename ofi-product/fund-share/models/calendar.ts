import { FormItem, FormItemType, FormItemStyle, DynamicFormsValidator, mDateHelper } from '@setl/utils';
import * as E from '../FundShareEnum';

export class ShareCalendarSubscriptionMandatory extends DynamicFormsValidator {
    subscriptionCutOffTime: FormItem = {
        type: FormItemType.time,
        label: 'Cut-off Time',
        required: true,
        mltag: 'txt_fundshare_cutofftimesub',
    };
    subscriptionCutOffTimeZone: FormItem = {
        type: FormItemType.list,
        label: 'Time Zone For Cut-off',
        required: true,
        listItems: mDateHelper.getMomentTimeZoneNameList(),
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_cuttofftimesubred',
    };
    navPeriodForSubscription: FormItem = {
        type: FormItemType.list,
        title: 'NAV Date Settings',
        label: 'NAV Date',
        listItems: [
            { id: E.BusinessDaysEnum.MinusOne, text: 'D-1' },
            { id: E.BusinessDaysEnum.Zero, text: 'D' },
            { id: E.BusinessDaysEnum.One, text: 'D+1' },
            { id: E.BusinessDaysEnum.Two, text: 'D+2' },
            { id: E.BusinessDaysEnum.Three, text: 'D+3' },
            { id: E.BusinessDaysEnum.Four, text: 'D+4' },
            { id: E.BusinessDaysEnum.Five, text: 'D+5' },
        ],
        required: true,
        mltag: 'txt_fundshare_navperiodsub',
    };
    subscriptionEnableNonWorkingDay: FormItem = {
        type: FormItemType.checkbox,
        title: '',
        label: '',
        checkboxLabel: 'Enable NAV dates outside working days',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        checkboxHint: () => {
            return getNonWorkingDayHintMsg(this.navPeriodForSubscription.value(), this.subscriptionEnableNonWorkingDay.value());
        },
        hidden: () => {
            return this.navPeriodForSubscription.value() === null;
        },
        mltag: 'txt_enable_nav_dates_outside_working_days',
    };
    subscriptionSettlementPeriod: FormItem = {
        type: FormItemType.list,
        title: 'Settlement Date Settings',
        label: 'Settlement Date',
        required: true,
        listItems: [
            { id: E.BusinessDaysEnum.Zero, text: 'D' },
            { id: E.BusinessDaysEnum.One, text: 'D+1' },
            { id: E.BusinessDaysEnum.Two, text: 'D+2' },
            { id: E.BusinessDaysEnum.Three, text: 'D+3' },
            { id: E.BusinessDaysEnum.Four, text: 'D+4' },
            { id: E.BusinessDaysEnum.Five, text: 'D+5' },
        ],
        mltag: 'txt_fundshare_subsettleperiod',
    };
    // removed by PZ 28/06/2018
    // subscriptionRedemptionCalendar: FormItem = {
    //     type: FormItemType.text,
    //     label: 'Calendar of subscription/redemption',
    //     required: true,
    //     mltag: 'txt_fundshare_subredcalendar',
    // };
}

export class ShareCalendarRedemptionMandatory extends DynamicFormsValidator {
    redemptionCutOffTime: FormItem = {
        type: FormItemType.time,
        label: 'Cut-off Time',
        required: true,
        mltag: 'txt_fundshare_cutofftimered',
    };
    redemptionCutOffTimeZone: FormItem = {
        type: FormItemType.list,
        label: 'Time Zone For Cut-off',
        required: true,
        listItems: mDateHelper.getMomentTimeZoneNameList(),
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_cutofftimesubred',
    };
    navPeriodForRedemption: FormItem = {
        type: FormItemType.list,
        title: 'NAV Date Settings',
        label: 'NAV Date',
        listItems: [
            { id: E.BusinessDaysEnum.MinusOne, text: 'D-1' },
            { id: E.BusinessDaysEnum.Zero, text: 'D' },
            { id: E.BusinessDaysEnum.One, text: 'D+1' },
            { id: E.BusinessDaysEnum.Two, text: 'D+2' },
            { id: E.BusinessDaysEnum.Three, text: 'D+3' },
            { id: E.BusinessDaysEnum.Four, text: 'D+4' },
            { id: E.BusinessDaysEnum.Five, text: 'D+5' },
        ],
        required: true,
        mltag: 'txt_fundshare_navperiodred',
    };
    redemptionEnableNonWorkingDay: FormItem = {
        type: FormItemType.checkbox,
        title: '',
        label: '',
        checkboxLabel: 'Enable NAV dates outside working days',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        checkboxHint: () => {
            return getNonWorkingDayHintMsg(this.navPeriodForRedemption.value(), this.redemptionEnableNonWorkingDay.value());
        },
        hidden: () => {
            return this.navPeriodForRedemption.value() === null;
        },
        mltag: 'txt_enable_nav_dates_outside_working_days',
    };
    redemptionSettlementPeriod: FormItem = {
        type: FormItemType.list,
        title: 'Settlement Date Settings',
        label: 'Settlement Date',
        required: true,
        listItems: [
            { id: E.BusinessDaysEnum.Zero, text: 'D' },
            { id: E.BusinessDaysEnum.One, text: 'D+1' },
            { id: E.BusinessDaysEnum.Two, text: 'D+2' },
            { id: E.BusinessDaysEnum.Three, text: 'D+3' },
            { id: E.BusinessDaysEnum.Four, text: 'D+4' },
            { id: E.BusinessDaysEnum.Five, text: 'D+5' },
        ],
        mltag: 'txt_fundshare_redsettleperiod',
    };
    // removed by PZ 28/06/2018
    // subscriptionRedemptionCalendar: FormItem = {
    //     type: FormItemType.text,
    //     label: 'Calendar of subscription/redemption',
    //     required: true,
    //     mltag: 'txt_fundshare_subredcalendar',
    // };
}


function getNonWorkingDayHintMsg(periodValue: {id: number}[], enableNonWorkingDay: boolean): string {
    if (!enableNonWorkingDay ||
        !periodValue
    ) {
        return undefined;
    }

    return {
        [E.BusinessDaysEnum.MinusOne]: 'The NAV date will correspond to the calendar day before the cutoff day',
        [E.BusinessDaysEnum.Zero]: 'The NAV date will correspond to the calendar day before the next business day',
        [E.BusinessDaysEnum.One]: 'The NAV date will correspond to the calendar day before the next 2 business day',
        [E.BusinessDaysEnum.Two]: 'The NAV date will correspond to the calendar day before the next 3 business day',
        [E.BusinessDaysEnum.Three]: 'The NAV date will correspond to the calendar day before the next 4 business day',
        [E.BusinessDaysEnum.Four]: 'The NAV date will correspond to the calendar day before the next 5 business day',
        [E.BusinessDaysEnum.Five]: 'The NAV date will correspond to the calendar day before the next 6 business day',
    }[periodValue[0].id]

}
