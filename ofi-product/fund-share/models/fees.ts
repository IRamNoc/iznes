import {FormItem, FormItemType, FormItemStyle} from '@setl/core-dynamic-forms/DynamicForm';
import { FormStyle } from '@angular/common';

export class ShareFeesMandatory {
    maxManagementFee: FormItem = {
        type: FormItemType.number,
        label: 'Management Fee Maximum',
        required: true
    }
    maxSubscriptionFee: FormItem = {
        type: FormItemType.number,
        label: 'Subscription Fee Maximum',
        required: true
    }
    maxRedemptionFee: FormItem = {
        type: FormItemType.number,
        label: 'Redemption Fee Maximum',
        required: true,
        style: [FormItemStyle.BreakOnAfter]
    }
    miFIDIIOngoingCharges: FormItem = {
        type: FormItemType.number,
        label: 'MiFID II - Ongoing Charges',
        required: true
    }
    miFIDIIOneOffCharges: FormItem = {
        type: FormItemType.number,
        label: 'MiFID II - One-off Charges',
        required: true
    }
    miFIDIITransactionsCosts: FormItem = {
        type: FormItemType.number,
        label: 'MiFID II - Costs related to transactions initiated',
        required: true
    }
    miFIDIIAncillaryCharges: FormItem = {
        type: FormItemType.number,
        label: 'MiFID II - Charges related to ancillary services',
        required: true
    }
    miFIDIIIncidentalCosts: FormItem = {
        type: FormItemType.number,
        label: 'MiFID II - Incidental Costs',
        required: true
    }
}

export class ShareFeesOptional {
    exPostOneOffEntryCostsPercentage: FormItem = {
        type: FormItemType.number,
        label: 'Ex-post One-off Entry Costs As Percentage',
        required: false
    }
    exPostOneOffEntryCostsPeriodStart: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post One-off Entry Costs Period Start',
        required: false
    }
    exPostOneOffEntryCostsPeriodEnd: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post One-off Entry Costs Period End',
        required: false
    }
    exPostOneOffExitCostsPercentage: FormItem = {
        type: FormItemType.number,
        label: 'Ex-post One-off Exit Costs As Percentage',
        required: false
    }
    exPostOneOffExitCostsPeriodStart: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post One-off Exit Costs Period Start',
        required: false
    }
    exPostOneOffExitCostsPeriodEnd: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post One-off Exit Costs Period End',
        required: false
    }
    exPostTransactionCostsPercentage: FormItem = {
        type: FormItemType.number,
        label: 'Ex-post Transaction Costs As Percentage',
        required: false
    }
    exPostTransactionCostsPeriodStart: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Transaction Costs Period Start',
        required: false
    }
    exPostTransactionCostsPeriodEnd: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Transaction Costs Period End',
        required: false,
        style: [FormItemStyle.BreakOnAfter]
    }
    exPostManagementFeeAppliedPercentage: FormItem = {
        type: FormItemType.number,
        label: 'Ex-post Management Fee Applied As Percentage',
        required: false
    }
    exPostManagementFeeAppliedPeriodStart: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Management Fee Applied Period Start',
        required: false
    }
    exPostManagementFeeAppliedPeriodEnd: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Management Fee Applied Period End',
        required: false,
        style: [FormItemStyle.BreakOnAfter]
    }
    exPostOtherOngoingCostsAsPercentage: FormItem = {
        type: FormItemType.number,
        label: 'Ex-post Other Ongoing Costs As Percentage',
        required: false
    }
    exPostOtherOngoingCostsPeriodStart: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Other Ongoing Costs Period Start',
        required: false
    }
    exPostOtherOngoingCostsPeriodEnd: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Other Ongoing Costs Period End',
        required: false,
        style: [FormItemStyle.BreakOnAfter]
    }
    exPostIncidentalCostsPercentage: FormItem = {
        type: FormItemType.number,
        label: 'Ex-post Incidental Costs As Percentage',
        required: false
    }
    exPostIncidentalCostsPeriodStart: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Incidental Costs Period Start',
        required: false
    }
    exPostIncidentalCostsPeriodEnd: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Incidental Costs Period End',
        required: false,
        style: [FormItemStyle.BreakOnAfter]
    }
    exitCostDescription: FormItem = {
        type: FormItemType.text,
        label: 'Exit Cost Description',
        required: false
    }
    hasPerformanceFee: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Performance Fee',
        required: false
    }
    performanceFeeDescription: FormItem = {
        type: FormItemType.text,
        label: 'Performance Fee Description',
        required: false
    }
    performanceFeeApplied: FormItem = {
        type: FormItemType.number,
        label: 'Performance Fee Applied',
        required: false
    }
    performanceFeeMaximum: FormItem = {
        type: FormItemType.number,
        label: 'Performance Fee Maximum',
        required: false,
        style: [FormItemStyle.BreakOnAfter]
    }
    hurdleRate: FormItem = {
        type: FormItemType.number,
        label: 'Hurdle Rate',
        required: false
    }
    highWaterMark: FormItem = {
        type: FormItemType.number,
        label: 'High Water Mark',
        required: false
    }
    subscriptionFeeMinimum: FormItem = {
        type: FormItemType.number,
        label: 'Subscription Fee Minimum',
        required: false
    }
    subscriptionFeeMaximum: FormItem = {
        type: FormItemType.number,
        label: 'Subscription Fee Maximum',
        required: false
    }
    subscriptionFeeInFavourOfFund: FormItem = {
        type: FormItemType.number,
        label: 'Subscription Fee In Favour Of Fund',
        required: false,
        style: [FormItemStyle.BreakOnAfter]
    }
    hasContingentDeferredSalesChargeFee: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Contingent Deferred Sales Charge Fee',
        required: false,
        style: [FormItemStyle.BreakOnAfter]
    }
    redemptionFeeMinimum: FormItem = {
        type: FormItemType.number,
        label: 'Redemption Fee Minimum',
        required: false
    }
    redemptionFeeInFavourOfFund: FormItem = {
        type: FormItemType.number,
        label: 'Redemption Fee In Favour Of Fund',
        required: false
    }
    managementFeeApplied: FormItem = {
        type: FormItemType.number,
        label: 'Management Fee Applied',
        required: false
    }
    managementFeeAppliedDate: FormItem = {
        type: FormItemType.date,
        label: 'Management Fee Applied Reference Date',
        required: false
    }
    allInFeeMaximum: FormItem = {
        type: FormItemType.number,
        label: 'All-in Fee Maximum',
        required: false
    }
    allInFeeApplied: FormItem = {
        type: FormItemType.number,
        label: 'All-in Fee Applied',
        required: false
    }
    allInFeeIncludesTransactionCosts: FormItem = {
        type: FormItemType.boolean,
        label: 'All-in Fee Includes Transaction Costs',
        required: false
    }
    allInFeeDate: FormItem = {
        type: FormItemType.date,
        label: 'All-in Fee Date',
        required: false
    }
    terExcludingPerformanceFee: FormItem = {
        type: FormItemType.number,
        label: 'TER Excluding Performance Fee',
        required: false
    }
    terExcludingPerformanceFeeDate: FormItem = {
        type: FormItemType.date,
        label: 'TER Excluding Performance Fee Date',
        required: false
    }
    terIncludingPerformanceFee: FormItem = {
        type: FormItemType.number,
        label: 'TER Including Performance Fee',
        required: false
    }
    terIncludingPerformanceFeeDate: FormItem = {
        type: FormItemType.date,
        label: 'TER Including Performance Fee Date',
        required: false
    }
    transactionCosts: FormItem = {
        type: FormItemType.number,
        label: 'Transaction Costs',
        required: false,
        style: [FormItemStyle.BreakOnAfter]
    }
    carriedInterest: FormItem = {
        type: FormItemType.number,
        label: 'Carried Interest',
        required: false
    }
    carriedInterestDescription: FormItem = {
        type: FormItemType.text,
        label: 'Carried Interest Description',
        required: false
    }    
    ongoingChargesDate: FormItem = {
        type: FormItemType.date,
        label: 'Ongoing Charges Date',
        required: false,
        style: [FormItemStyle.BreakOnAfter]
    }
    isTrailerFeeClean: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Trailer Fee Clean',
        required: false,
        style: [FormItemStyle.BreakOnAfter]
    }
    hasSeparateDistributionFee: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Separate Distribution Fee',
        required: false
    }
    distributionFee: FormItem = {
        type: FormItemType.number,
        label: 'Distribution Fee',
        required: false
    }
    distributionFeeDate: FormItem = {
        type: FormItemType.date,
        label: 'Distribution Fee Reference Date',
        required: false,
        style: [FormItemStyle.BreakOnAfter]
    }
    hasDilutionLevyApplied: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Dilution Levy Applied By Fund',
        required: false
    }
    hasCarriedInterest: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Carried Interest',
        required: false
    }
    oneyriy: FormItem = {
        type: FormItemType.text,
        label: '1Y RIY',
        required: false
    }
    halfRhpRiy: FormItem = {
        type: FormItemType.text,
        label: 'Half RHP RIY',
        required: false
    }
    rhpRiy: FormItem = {
        type: FormItemType.text,
        label: 'RHP RIY',
        required: false
    }
}