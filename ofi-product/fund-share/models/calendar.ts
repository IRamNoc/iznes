import { FormItem, FormItemType, FormItemStyle, DynamicFormsValidator, mDateHelper } from '@setl/utils';
import * as E from '../FundShareEnum';

export class ShareCalendarMandatory extends DynamicFormsValidator {
    subscriptionCutOffTime: FormItem = {
        type: FormItemType.time,
        label: 'Cut-off Time For Subscription',
        required: true,
        mltag: 'txt_fundshare_cutofftimesub',
    };
    subscriptionCutOffTimeZone: FormItem = {
        type: FormItemType.list,
        label: 'Time Zone For Cut-off For Subscription And Redemption',
        required: true,
        listItems: mDateHelper.getMomentTimeZoneNameList(),
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_cuttofftimesubred',
    };
    navPeriodForSubscription: FormItem = {
        type: FormItemType.list,
        label: 'NAV Period For Subscription (D)',
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
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_navperiodsub',
    };
    redemptionCutOffTime: FormItem = {
        type: FormItemType.time,
        label: 'Cut-off Time For Redemption',
        required: true,
        mltag: 'txt_fundshare_cutofftimered',
    };
    redemptionCutOffTimeZone: FormItem = {
        type: FormItemType.list,
        label: 'Time Zone For Cut-off For Subscription And Redemption',
        required: true,
        listItems: mDateHelper.getMomentTimeZoneNameList(),
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_cutofftimesubred',
    };
    navPeriodForRedemption: FormItem = {
        type: FormItemType.list,
        label: 'NAV Period For Redemption (D)',
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
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_navperiodred',
    };
    subscriptionSettlementPeriod: FormItem = {
        type: FormItemType.list,
        label: 'Settlement Period For Subscription (D)',
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
    redemptionSettlementPeriod: FormItem = {
        type: FormItemType.list,
        label: 'Settlement Period For Redemption (D)',
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
