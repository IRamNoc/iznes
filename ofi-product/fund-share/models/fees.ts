import {FormItem, FormItemType, FormItemStyle, DynamicFormsValidator} from '@setl/utils';

export class ShareFeesMandatory extends DynamicFormsValidator {
    maxManagementFee: FormItem = {
        type: FormItemType.number,
        label: 'Management Fee Maximum',
        required: true,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_manfeemax'
    }
    maxSubscriptionFee: FormItem = {
        type: FormItemType.number,
        label: 'Subscription Fee Maximum',
        required: true,
        mltag: 'txt_fundshare_subfeemax'
    }
    maxRedemptionFee: FormItem = {
        type: FormItemType.number,
        label: 'Redemption Fee Maximum',
        required: true,
        mltag: 'txt_fundshare_maxredfee'
    }
    miFIDIIOngoingCharges: FormItem = {
        type: FormItemType.number,
        label: 'MiFID II - Ongoing Charges',
        required: true,
        mltag: 'txt_fundshare_mifidoncharges'
    }
    miFIDIIOneOffCharges: FormItem = {
        type: FormItemType.number,
        label: 'MiFID II - One-off Charges',
        required: true,
        mltag: 'txt_fundshare_mifidoneoffcharges'
    }
    miFIDIITransactionsCosts: FormItem = {
        type: FormItemType.number,
        label: 'MiFID II - Costs related to transactions initiated',
        required: true,
        mltag: 'txt_fundshare_mifidtranscosts'
    }
    miFIDIIAncillaryCharges: FormItem = {
        type: FormItemType.number,
        label: 'MiFID II - Charges related to ancillary services',
        required: true,
        mltag: 'txt_fundshare_mifidanccharges'
    }
    miFIDIIIncidentalCosts: FormItem = {
        type: FormItemType.number,
        label: 'MiFID II - Incidental Costs',
        required: true,
        mltag: 'txt_fundshare_mifidincidentcosts'
    }
}

export class ShareFeesOptional {
    exPostOneOffEntryCostsPercentage: FormItem = {
        type: FormItemType.number,
        label: 'Ex-post One-off Entry Costs As Percentage',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_expostentrycostpercent'
    }
    exPostOneOffEntryCostsPeriodStart: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post One-off Entry Costs Period Start',
        required: false,
        mltag: 'txt_fundshare_expostentrycoststart'
    }
    exPostOneOffEntryCostsPeriodEnd: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post One-off Entry Costs Period End',
        required: false,
        mltag: 'txt_fundshare_expostentrycostend'
    }
    exPostOneOffExitCostsPercentage: FormItem = {
        type: FormItemType.number,
        label: 'Ex-post One-off Exit Costs As Percentage',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_expostexitpercent'
    }
    exPostOneOffExitCostsPeriodStart: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post One-off Exit Costs Period Start',
        required: false,
        mltag: 'txt_fundshare_expostexitstart'
    }
    exPostOneOffExitCostsPeriodEnd: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post One-off Exit Costs Period End',
        required: false,
        mltag: 'txt_fundshare_expostexitend'
    }
    exPostTransactionCostsPercentage: FormItem = {
        type: FormItemType.number,
        label: 'Ex-post Transaction Costs As Percentage',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_exposttranspercent'
    }
    exPostTransactionCostsPeriodStart: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Transaction Costs Period Start',
        required: false,
        mltag: 'txt_fundshare_exposttransstart'
    }
    exPostTransactionCostsPeriodEnd: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Transaction Costs Period End',
        required: false,
        mltag: 'txt_fundshare_exposttransend'
    }
    exPostManagementFeeAppliedPercentage: FormItem = {
        type: FormItemType.number,
        label: 'Ex-post Management Fee Applied As Percentage',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_expostmanfeepercent'
    }
    exPostManagementFeeAppliedPeriodStart: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Management Fee Applied Period Start',
        required: false,
        mltag: 'txt_fundshare_expostmanfeestart'
    }
    exPostManagementFeeAppliedPeriodEnd: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Management Fee Applied Period End',
        required: false,
        mltag: 'txt_fundshare_expostmanfeeend'
    }
    exPostOtherOngoingCostsAsPercentage: FormItem = {
        type: FormItemType.number,
        label: 'Ex-post Other Ongoing Costs As Percentage',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_expostotherpercent'
    }
    exPostOtherOngoingCostsPeriodStart: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Other Ongoing Costs Period Start',
        required: false,
        mltag: 'txt_fundshare_expostotherstart'
    }
    exPostOtherOngoingCostsPeriodEnd: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Other Ongoing Costs Period End',
        required: false,
        mltag: 'txt_fundshare_expostotherend'
    }
    exPostIncidentalCostsPercentage: FormItem = {
        type: FormItemType.number,
        label: 'Ex-post Incidental Costs As Percentage',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_expostincidentpercent'
    }
    exPostIncidentalCostsPeriodStart: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Incidental Costs Period Start',
        required: false,
        mltag: 'txt_fundshare_expostincidentstart'
    }
    exPostIncidentalCostsPeriodEnd: FormItem = {
        type: FormItemType.date,
        label: 'Ex-post Incidental Costs Period End',
        required: false,
        mltag: 'txt_fundshare_expostincidentend'
    }
    exitCostDescription: FormItem = {
        type: FormItemType.text,
        label: 'Exit Cost Description',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_exitcostdesc'
    }
    hasPerformanceFee: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Performance Fee',
        required: false,
        mltag: 'txt_fundshare_hasperffee'
    }
    performanceFeeDescription: FormItem = {
        type: FormItemType.text,
        label: 'Performance Fee Description',
        required: false,
        mltag: 'txt_fundshare_perffeedesc'
    }
    performanceFeeApplied: FormItem = {
        type: FormItemType.number,
        label: 'Performance Fee Applied',
        required: false,
        mltag: 'txt_fundshare_perffeeapplied'
    }
    performanceFeeMaximum: FormItem = {
        type: FormItemType.number,
        label: 'Performance Fee Maximum',
        required: false,
        mltag: 'txt_fundshare_perffeemax'
    }
    hurdleRate: FormItem = {
        type: FormItemType.number,
        label: 'Hurdle Rate',
        required: false,
        style: [FormItemStyle.BreakOnBefore],
        mltag: 'txt_fundshare_hurdlerate'
    }
    highWaterMark: FormItem = {
        type: FormItemType.number,
        label: 'High Water Mark',
        required: false,
        mltag: 'txt_fundshare_highwatermark'
    }
    subscriptionFeeMinimum: FormItem = {
        type: FormItemType.number,
        label: 'Subscription Fee Minimum',
        required: false,
        mltag: 'txt_fundshare_subfeemin'
    }
    subscriptionFeeInFavourOfFund: FormItem = {
        type: FormItemType.number,
        label: 'Subscription Fee In Favour Of Fund',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_subfeeinfavfund'
    }
    hasContingentDeferredSalesChargeFee: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Contingent Deferred Sales Charge Fee',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_hassaleschargefee'
    }
    redemptionFeeMinimum: FormItem = {
        type: FormItemType.number,
        label: 'Redemption Fee Minimum',
        required: false,
        mltag: 'txt_fundshare_redfeemax'
    }
    redemptionFeeInFavourOfFund: FormItem = {
        type: FormItemType.number,
        label: 'Redemption Fee In Favour Of Fund',
        required: false,
        mltag: 'txt_fundshare_redfeeinfavfund'
    }
    managementFeeApplied: FormItem = {
        type: FormItemType.number,
        label: 'Management Fee Applied',
        required: false,
        mltag: 'txt_fundshare_manfeeapplied'
    }
    managementFeeAppliedDate: FormItem = {
        type: FormItemType.date,
        label: 'Management Fee Applied Reference Date',
        required: false,
        mltag: 'txt_fundshare_manfeeapplieddate'
    }
    allInFeeMaximum: FormItem = {
        type: FormItemType.number,
        label: 'All-in Fee Maximum',
        required: false,
        mltag: 'txt_fundshare_allinfeemax'
    }
    allInFeeApplied: FormItem = {
        type: FormItemType.number,
        label: 'All-in Fee Applied',
        required: false,
        mltag: 'txt_fundshare_allinfeeapplied'
    }
    allInFeeIncludesTransactionCosts: FormItem = {
        type: FormItemType.boolean,
        label: 'All-in Fee Includes Transaction Costs',
        required: false,
        mltag: 'txt_fundshare_allinfeeinctranscosts'
    }
    allInFeeDate: FormItem = {
        type: FormItemType.date,
        label: 'All-in Fee Date',
        required: false,
        mltag: 'txt_fundshare_allinfeedate'
    }
    terExcludingPerformanceFee: FormItem = {
        type: FormItemType.number,
        label: 'TER Excluding Performance Fee',
        required: false,
        mltag: 'txt_fundshare_terexperffee'
    }
    terExcludingPerformanceFeeDate: FormItem = {
        type: FormItemType.date,
        label: 'TER Excluding Performance Fee Date',
        required: false,
        mltag: 'txt_fundshare_terexperffeedate'
    }
    terIncludingPerformanceFee: FormItem = {
        type: FormItemType.number,
        label: 'TER Including Performance Fee',
        required: false,
        mltag: 'txt_fundshare_terincperffee'
    }
    terIncludingPerformanceFeeDate: FormItem = {
        type: FormItemType.date,
        label: 'TER Including Performance Fee Date',
        required: false,
        mltag: 'txt_fundshare_terincperffeedate'
    }
    transactionCosts: FormItem = {
        type: FormItemType.number,
        label: 'Transaction Costs',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_transcosts'
    }
    carriedInterest: FormItem = {
        type: FormItemType.number,
        label: 'Carried Interest',
        required: false,
        mltag: 'txt_fundshare_carriedinterest'
    }
    carriedInterestDescription: FormItem = {
        type: FormItemType.text,
        label: 'Carried Interest Description',
        required: false,
        mltag: 'txt_fundshare_carriedinterestdesc'
    }    
    ongoingChargesDate: FormItem = {
        type: FormItemType.date,
        label: 'Ongoing Charges Date',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_ongochargesdate'
    }
    isTrailerFeeClean: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Trailer Fee Clean',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_istrailerfeeclean'
    }
    hasSeparateDistributionFee: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Separate Distribution Fee',
        required: false,
        mltag: 'txt_fundshare_hassepdistfee'
    }
    distributionFee: FormItem = {
        type: FormItemType.number,
        label: 'Distribution Fee',
        required: false,
        mltag: 'txt_fundshare_distfee'
    }
    distributionFeeDate: FormItem = {
        type: FormItemType.date,
        label: 'Distribution Fee Reference Date',
        required: false,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_distfeedate'
    }
    hasDilutionLevyApplied: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Dilution Levy Applied By Fund',
        required: false,
        mltag: 'txt_fundshare_hasdilutlevyapplied'
    }
    hasCarriedInterest: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Carried Interest',
        required: false,
        mltag: 'txt_fundshare_hascarriedinterest'
    }
    oneyriy: FormItem = {
        type: FormItemType.text,
        label: '1Y RIY',
        required: false,
        mltag: 'txt_fundshare_oneyriy'
    }
    halfRhpRiy: FormItem = {
        type: FormItemType.text,
        label: 'Half RHP RIY',
        required: false,
        mltag: 'txt_fundshare_halfrhpriy'
    }
    rhpRiy: FormItem = {
        type: FormItemType.text,
        label: 'RHP RIY',
        required: false,
        mltag: 'txt_fundshare_rhpriy'
    }
}