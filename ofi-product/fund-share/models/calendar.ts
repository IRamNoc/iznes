import {FormItem, FormItemType, FormItemStyle, DynamicFormsValidator} from '@setl/utils';
import * as E from '../FundShareEnum';

export class ShareCalendarMandatory extends DynamicFormsValidator {
    subscriptionCutOffTime: FormItem = {
        type: FormItemType.time,
        label: 'Cut-off Time For Subscription',
        required: true,
        mltag: 'txt_fundshare_cutofftimesub'
    }
    subscriptionCutOffTimeZone: FormItem = {
        type: FormItemType.list,
        label: 'Time Zone For Cut-off For Subscription And Redemption',
        required: true,
        listItems: [
            { id: E.TimezonesEnum.UTCP11, text: 'UTC +11' },
            { id: E.TimezonesEnum.UTCP10, text: 'UTC +10' },
            { id: E.TimezonesEnum.UTCP9, text: 'UTC +9' },
            { id: E.TimezonesEnum.UTCP8, text: 'UTC +8' },
            { id: E.TimezonesEnum.UTCP7, text: 'UTC +7' },
            { id: E.TimezonesEnum.UTCP6, text: 'UTC +6' },
            { id: E.TimezonesEnum.UTCP5, text: 'UTC +5' },
            { id: E.TimezonesEnum.UTCP4, text: 'UTC +4' },
            { id: E.TimezonesEnum.UTCP3, text: 'UTC +3' },
            { id: E.TimezonesEnum.UTCP2, text: 'UTC +2' },
            { id: E.TimezonesEnum.UTCP1, text: 'UTC +1' },
            { id: E.TimezonesEnum.UTC,text: 'UTC' },
            { id: E.TimezonesEnum.UTCM1, text: 'UTC -1' },
            { id: E.TimezonesEnum.UTCM2, text: 'UTC -2' },
            { id: E.TimezonesEnum.UTCM3, text: 'UTC -3' },
            { id: E.TimezonesEnum.UTCM4, text: 'UTC -4' },
            { id: E.TimezonesEnum.UTCM5, text: 'UTC -5' },
            { id: E.TimezonesEnum.UTCM6, text: 'UTC -6' },
            { id: E.TimezonesEnum.UTCM7, text: 'UTC -7' },
            { id: E.TimezonesEnum.UTCM8, text: 'UTC -8' },
            { id: E.TimezonesEnum.UTCM9, text: 'UTC -9' },
            { id: E.TimezonesEnum.UTCM10, text: 'UTC -10' },
            { id: E.TimezonesEnum.UTCM11, text: 'UTC -11' }           
        ],
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_cuttofftimesubred'
    }
    navPeriodForSubscription: FormItem = {
        type: FormItemType.list,
        label: 'NAV Period For Subscription',
        listItems: [
            { id: E.BusinessDaysEnum.MinusOne, text: '-1' },
            { id: E.BusinessDaysEnum.Zero, text: '0' },
            { id: E.BusinessDaysEnum.One, text: '1' },
            { id: E.BusinessDaysEnum.Two, text: '2' },
            { id: E.BusinessDaysEnum.Three, text: '3' },
            { id: E.BusinessDaysEnum.Four, text: '4' },
            { id: E.BusinessDaysEnum.Five, text: '5' }
        ],
        required: true,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_navperiodsub'
    }
    redemptionCutOffTime: FormItem = {
        type: FormItemType.time,
        label: 'Cut-off Time For Redemption',
        required: true,
        mltag: 'txt_fundshare_cutofftimered'
    }
    redemptionCutOffTimeZone: FormItem = {
        type: FormItemType.list,
        label: 'Time Zone For Cut-off For Subscription And Redemption',
        required: true,
        listItems: [
            { id: E.TimezonesEnum.UTCP11, text: 'UTC +11' },
            { id: E.TimezonesEnum.UTCP10, text: 'UTC +10' },
            { id: E.TimezonesEnum.UTCP9, text: 'UTC +9' },
            { id: E.TimezonesEnum.UTCP8, text: 'UTC +8' },
            { id: E.TimezonesEnum.UTCP7, text: 'UTC +7' },
            { id: E.TimezonesEnum.UTCP6, text: 'UTC +6' },
            { id: E.TimezonesEnum.UTCP5, text: 'UTC +5' },
            { id: E.TimezonesEnum.UTCP4, text: 'UTC +4' },
            { id: E.TimezonesEnum.UTCP3, text: 'UTC +3' },
            { id: E.TimezonesEnum.UTCP2, text: 'UTC +2' },
            { id: E.TimezonesEnum.UTCP1, text: 'UTC +1' },
            { id: E.TimezonesEnum.UTC,text: 'UTC' },
            { id: E.TimezonesEnum.UTCM1, text: 'UTC -1' },
            { id: E.TimezonesEnum.UTCM2, text: 'UTC -2' },
            { id: E.TimezonesEnum.UTCM3, text: 'UTC -3' },
            { id: E.TimezonesEnum.UTCM4, text: 'UTC -4' },
            { id: E.TimezonesEnum.UTCM5, text: 'UTC -5' },
            { id: E.TimezonesEnum.UTCM6, text: 'UTC -6' },
            { id: E.TimezonesEnum.UTCM7, text: 'UTC -7' },
            { id: E.TimezonesEnum.UTCM8, text: 'UTC -8' },
            { id: E.TimezonesEnum.UTCM9, text: 'UTC -9' },
            { id: E.TimezonesEnum.UTCM10, text: 'UTC -10' },
            { id: E.TimezonesEnum.UTCM11, text: 'UTC -11' }            
        ],
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_cutofftimesubred'
    }
    navPeriodForRedemption: FormItem = {
        type: FormItemType.list,
        label: 'NAV Period For Redemption',
        listItems: [
            { id: E.BusinessDaysEnum.MinusOne, text: '-1' },
            { id: E.BusinessDaysEnum.Zero, text: '0' },
            { id: E.BusinessDaysEnum.One, text: '1' },
            { id: E.BusinessDaysEnum.Two, text: '2' },
            { id: E.BusinessDaysEnum.Three, text: '3' },
            { id: E.BusinessDaysEnum.Four, text: '4' },
            { id: E.BusinessDaysEnum.Five, text: '5' }
        ],
        required: true,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_navperiodred'
    }
    subscriptionSettlementPeriod: FormItem = {
        type: FormItemType.list,
        label: 'Settlement Period For Subscription',
        required: true,
        listItems: [
            { id: E.BusinessDaysEnum.Zero, text: '0' },
            { id: E.BusinessDaysEnum.One, text: '1' },
            { id: E.BusinessDaysEnum.Two, text: '2' },
            { id: E.BusinessDaysEnum.Three, text: '3' },
            { id: E.BusinessDaysEnum.Four, text: '4' },
            { id: E.BusinessDaysEnum.Five, text: '5' }
        ],
        mltag: 'txt_fundshare_subsettleperiod'
    }
    redemptionSettlementPeriod: FormItem = {
        type: FormItemType.list,
        label: 'Settlement Period For Redemption',
        required: true,
        listItems: [
            { id: E.BusinessDaysEnum.Zero, text: '0' },
            { id: E.BusinessDaysEnum.One, text: '1' },
            { id: E.BusinessDaysEnum.Two, text: '2' },
            { id: E.BusinessDaysEnum.Three, text: '3' },
            { id: E.BusinessDaysEnum.Four, text: '4' },
            { id: E.BusinessDaysEnum.Five, text: '5' }
        ],
        mltag: 'txt_fundshare_redsettleperiod'
    }
    subscriptionRedemptionCalendar: FormItem = {
        type: FormItemType.text,
        label: 'Calendar of subscription/redemption',
        required: true,
        mltag: 'txt_fundshare_subredcalendar'
    }
}