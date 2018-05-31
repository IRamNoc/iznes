import { FormItem, FormItemType, FormItemStyle, DynamicFormsValidator } from '@setl/utils';
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
        listItems: [
            { id: E.TimezonesEnum.UTCP11, text: 'UTC +11: Solomon Island' },
            { id: E.TimezonesEnum.UTCP10, text: 'UTC +10: Sydney' },
            { id: E.TimezonesEnum.UTCP9, text: 'UTC +9: Tokyo' },
            { id: E.TimezonesEnum.UTCP8, text: 'UTC +8: Beijing' },
            { id: E.TimezonesEnum.UTCP7, text: 'UTC +7: Bangkok' },
            { id: E.TimezonesEnum.UTCP6, text: 'UTC +6: Almaty' },
            { id: E.TimezonesEnum.UTCP5, text: 'UTC +5: Karachi' },
            { id: E.TimezonesEnum.UTCP4, text: 'UTC +4: Abu Dhabi' },
            { id: E.TimezonesEnum.UTCP3, text: 'UTC +3: Moscow' },
            { id: E.TimezonesEnum.UTCP2, text: 'UTC +2: Cairo' },
            { id: E.TimezonesEnum.UTCP1, text: 'UTC +1: Paris' },
            { id: E.TimezonesEnum.UTC, text: 'UTC: London' },
            { id: E.TimezonesEnum.UTCM1, text: 'UTC -1: Cape Verde Island' },
            { id: E.TimezonesEnum.UTCM2, text: 'UTC -2: Mid-Atlantic' },
            { id: E.TimezonesEnum.UTCM3, text: 'UTC -3: Greenland' },
            { id: E.TimezonesEnum.UTCM4, text: 'UTC -4: Santiago' },
            { id: E.TimezonesEnum.UTCM5, text: 'UTC -5: Indiana (East)' },
            { id: E.TimezonesEnum.UTCM6, text: 'UTC -6: Mexico City' },
            { id: E.TimezonesEnum.UTCM7, text: 'UTC -7: Arizona' },
            { id: E.TimezonesEnum.UTCM8, text: 'UTC -8: California' },
            { id: E.TimezonesEnum.UTCM9, text: 'UTC -9: Alaska' },
            { id: E.TimezonesEnum.UTCM10, text: 'UTC -10: Hawaii' },
            { id: E.TimezonesEnum.UTCM11, text: 'UTC -11: Midway Island' },
        ],
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
        listItems: [
            { id: E.TimezonesEnum.UTCP11, text: 'UTC +11: Solomon Island' },
            { id: E.TimezonesEnum.UTCP10, text: 'UTC +10: Sydney' },
            { id: E.TimezonesEnum.UTCP9, text: 'UTC +9: Tokyo' },
            { id: E.TimezonesEnum.UTCP8, text: 'UTC +8: Beijing' },
            { id: E.TimezonesEnum.UTCP7, text: 'UTC +7: Bangkok' },
            { id: E.TimezonesEnum.UTCP6, text: 'UTC +6: Almaty' },
            { id: E.TimezonesEnum.UTCP5, text: 'UTC +5: Karachi' },
            { id: E.TimezonesEnum.UTCP4, text: 'UTC +4: Abu Dhabi' },
            { id: E.TimezonesEnum.UTCP3, text: 'UTC +3: Moscow' },
            { id: E.TimezonesEnum.UTCP2, text: 'UTC +2: Cairo' },
            { id: E.TimezonesEnum.UTCP1, text: 'UTC +1: Paris' },
            { id: E.TimezonesEnum.UTC, text: 'UTC: London' },
            { id: E.TimezonesEnum.UTCM1, text: 'UTC -1: Cape Verde Island' },
            { id: E.TimezonesEnum.UTCM2, text: 'UTC -2: Mid-Atlantic' },
            { id: E.TimezonesEnum.UTCM3, text: 'UTC -3: Greenland' },
            { id: E.TimezonesEnum.UTCM4, text: 'UTC -4: Santiago' },
            { id: E.TimezonesEnum.UTCM5, text: 'UTC -5: Indiana (East)' },
            { id: E.TimezonesEnum.UTCM6, text: 'UTC -6: Mexico City' },
            { id: E.TimezonesEnum.UTCM7, text: 'UTC -7: Arizona' },
            { id: E.TimezonesEnum.UTCM8, text: 'UTC -8: California' },
            { id: E.TimezonesEnum.UTCM9, text: 'UTC -9: Alaska' },
            { id: E.TimezonesEnum.UTCM10, text: 'UTC -10: Hawaii' },
            { id: E.TimezonesEnum.UTCM11, text: 'UTC -11: Midway Island' },
        ],
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
    subscriptionRedemptionCalendar: FormItem = {
        type: FormItemType.text,
        label: 'Calendar of subscription/redemption',
        required: true,
        mltag: 'txt_fundshare_subredcalendar',
    };
}
