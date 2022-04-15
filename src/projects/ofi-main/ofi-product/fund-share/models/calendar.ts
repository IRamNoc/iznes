import { FormItem, FormItemType, FormItemStyle, DynamicFormsValidator, mDateHelper } from '@setl/utils';
import * as E from '../FundShareEnum';

export class ShareCalendarSubscriptionMandatory extends DynamicFormsValidator {
    subscriptionCutOffTime: FormItem = {
        type: FormItemType.time,
        label: 'Cut-off Time',
        required: true,
    };
    subscriptionCutOffTimeZone: FormItem = {
        type: FormItemType.list,
        label: 'Time Zone For Cut-off',
        required: true,
        listItems: mDateHelper.getMomentTimeZoneNameList(),
        style: [FormItemStyle.BreakOnAfter],
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
    };
    subscriptionValuationReference: FormItem = {
        type: FormItemType.list,
        label: 'NAV Reference Date',
        listItems: [
            { id: E.ValuationReferenceDate.CalculationDay, text: 'Calculation Day' },
            { id: E.ValuationReferenceDate.NextWorkingDay, text: 'Day before the next working day' },
        ],
        style: [FormItemStyle.TitleMargin],
        required: true,
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
    };
    subscriptionSettlementPivotDate: FormItem = {
        type: FormItemType.list,
        label: 'Settlement Pivot Date',
        required: true,
        listItems: [
            { id: E.SettlementPivotDate.NavDate, text: 'NAV Date' },
            { id: E.SettlementPivotDate.CutoffDate, text: 'Cut-off Date' },
        ],
        style: [FormItemStyle.BreakOnAfter, FormItemStyle.TitleMargin],
    };
    subscriptionPaymentInstructionTrigger: FormItem = {
        type: FormItemType.list,
        label: 'Payment instruction trigger',
        required: true,
        hasHelpbox: true,
        helpboxContent: 'Only for subscriptions in amount. The moment when the instruction of payment are sent to Banks.',
        listItems: [
            { id: E.PaymentInstructionTrigger.NavDate, text: 'NAV Date' },
            { id: E.PaymentInstructionTrigger.CutoffDate, text: 'Cut-off Date' },
        ],
        style: [FormItemStyle.BreakOnAfter],
    };
}

export class ShareCalendarRedemptionMandatory extends DynamicFormsValidator {
    redemptionCutOffTime: FormItem = {
        type: FormItemType.time,
        label: 'Cut-off Time',
        required: true,
    };
    redemptionCutOffTimeZone: FormItem = {
        type: FormItemType.list,
        label: 'Time Zone For Cut-off',
        required: true,
        listItems: mDateHelper.getMomentTimeZoneNameList(),
        style: [FormItemStyle.BreakOnAfter],
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
    };
    redemptionValuationReference: FormItem = {
        type: FormItemType.list,
        label: 'NAV Reference Date',
        listItems: [
            { id: E.ValuationReferenceDate.CalculationDay, text: 'Calculation Day' },
            { id: E.ValuationReferenceDate.NextWorkingDay, text: 'Day before the next working day' },
        ],
        style: [FormItemStyle.TitleMargin],
        required: true,
    };
    redemptionSettlementPeriod: FormItem = {
        type: FormItemType.list,
        label: 'Settlement Date',
        title: 'Settlement Date Settings',
        required: true,
        listItems: [
            { id: E.BusinessDaysEnum.Zero, text: 'D' },
            { id: E.BusinessDaysEnum.One, text: 'D+1' },
            { id: E.BusinessDaysEnum.Two, text: 'D+2' },
            { id: E.BusinessDaysEnum.Three, text: 'D+3' },
            { id: E.BusinessDaysEnum.Four, text: 'D+4' },
            { id: E.BusinessDaysEnum.Five, text: 'D+5' },
        ],
    };
    redemptionSettlementPivotDate: FormItem = {
        type: FormItemType.list,
        label: 'Settlement Pivot Date',
        required: true,
        listItems: [
            { id: E.SettlementPivotDate.NavDate, text: 'NAV Date' },
            { id: E.SettlementPivotDate.CutoffDate, text: 'Cut-off Date' },
        ],
        style: [FormItemStyle.BreakOnAfter, FormItemStyle.TitleMargin],
    };
}
