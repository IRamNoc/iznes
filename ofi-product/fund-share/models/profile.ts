import {FormItem, FormItemType, DynamicFormsValidator} from '@setl/utils';
import * as E from '../FundShareEnum';

export class ShareProfileMandatory extends DynamicFormsValidator {
    investorProfile: FormItem = {
        type: FormItemType.list,
        label: 'Investor Profile',
        required: true,
        listItems: [
            { id: E.InvestorProfileEnum.AllInvestors, text: 'All investors' },
            { id: E.InvestorProfileEnum.ProfessionalInvestors, text: 'Professional investors' },
            { id: E.InvestorProfileEnum.EligibleCounterparties, text: 'Eligible Counterparties' }
        ],
        mltag: 'txt_fundshare_investorprofile'
    }
}

export class ShareProfileOptional {
    recommendedHoldingPeriod: FormItem = {
        type: FormItemType.number,
        label: 'Recommended Holding Period',
        required: false,
        mltag: 'txt_fundshare_recholdingperiod'
    }
    benchmark: FormItem = {
        type: FormItemType.text,
        label: 'Benchmark',
        required: false,
        mltag: 'txt_fundshare_benchmark'
    }
    outperformanceCommission: FormItem = {
        type: FormItemType.text,
        label: 'Outperformance Commission',
        required: false,
        mltag: 'txt_fundshare_outperfcommission'
    }
    peaEligibility: FormItem = {
        type: FormItemType.boolean,
        label: 'Eligibility for PEA',
        required: false,
        mltag: 'txt_fundshare_peaeligibility'
    }
    isClientTypeRetail: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Client Type Retail',
        required: false,
        mltag: 'txt_fundshare_isclientretail'
    }
    isClientTypeProfessional: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Client Type Professional',
        required: false,
        mltag: 'txt_fundshare_isclientpro'
    }
    isClientTypeEligibleCounterparty: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Client Type Eligible Counterparty',
        required: false,
        mltag: 'txt_fundshare_isclienteligiblecp'
    }
    withBasicKnowledge: FormItem = {
        type: FormItemType.boolean,
        label: 'Investor With Basic Knowledge',
        required: false,
        mltag: 'txt_fundshare_withbasicknowledge'
    }
    informed: FormItem = {
        type: FormItemType.boolean,
        label: 'Informed Investor',
        required: false,
        mltag: 'txt_fundshare_informedinvestor'
    }
    advanced: FormItem = {
        type: FormItemType.boolean,
        label: 'Advanced Investor',
        required: false,
        mltag: 'txt_fundshare_advancedinvestor'
    }
    noCapitalLoss: FormItem = {
        type: FormItemType.boolean,
        label: 'No Ability For Any Capital Loss',
        required: false,
        mltag: 'txt_fundshare_nocaploss'
    }
    limitedCapitalLosses: FormItem = {
        type: FormItemType.boolean,
        label: 'Ability For Limited Capital Losses',
        required: false,
        mltag: 'txt_fundshare_limitedcaplosses'
    }
    totalCapitalLoss: FormItem = {
        type: FormItemType.boolean,
        label: 'Ability For Total Capital Loss',
        required: false,
        mltag: 'txt_fundshare_totalcaploss'
    }
    lossesBeyondCapital: FormItem = {
        type: FormItemType.boolean,
        label: 'Ability For Losses Beyond Capital',
        required: false,
        mltag: 'txt_fundshare_lossesbeyondcap'
    }
    preservation: FormItem = {
        type: FormItemType.boolean,
        label: 'Return Profile Preservation',
        required: false,
        mltag: 'txt_fundshare_profilepreservation'
    }
    growth: FormItem = {
        type: FormItemType.boolean,
        label: 'Return Profile Growth',
        required: false,
        mltag: 'txt_fundshare_profilegrowth'
    }
    income: FormItem = {
        type: FormItemType.boolean,
        label: 'Return Profile Income',
        required: false,
        mltag: 'txt_fundshare_profileincome'
    }
    hedging: FormItem = {
        type: FormItemType.boolean,
        label: 'Return Profile Hedging',
        required: false,
        mltag: 'txt_fundshare_profilehedging'
    }
    optionsOrLeverage: FormItem = {
        type: FormItemType.boolean,
        label: 'Return Profile Options Or Leverage',
        required: false,
        mltag: 'txt_fundshare_optionsleverage'
    }
    other: FormItem = {
        type: FormItemType.boolean,
        label: 'Return Profile Other',
        required: false,
        mltag: 'txt_fundshare_profileother'
    }
    executionOnlyDistribution: FormItem = {
        type: FormItemType.list,
        label: 'Eligible For Execution Only Distribution',
        required: false,
        listItems: [
            { id: E.ProfileEligibilityEnum.Retail, text: 'Retail' },
            { id: E.ProfileEligibilityEnum.Professional, text: 'Professional' },
            { id: E.ProfileEligibilityEnum.Both, text: 'Both' },
            { id: E.ProfileEligibilityEnum.Neither, text: 'Neither' }
        ],
        mltag: 'txt_fundshare_execonlydist'
    }
    executionOnlyWithAppropriatenessTest: FormItem = {
        type: FormItemType.list,
        label: 'Eligible For Execution Only With Appropriateness Test',
        required: false,
        listItems: [
            { id: E.ProfileEligibilityEnum.Retail, text: 'Retail' },
            { id: E.ProfileEligibilityEnum.Professional, text: 'Professional' },
            { id: E.ProfileEligibilityEnum.Both, text: 'Both' },
            { id: E.ProfileEligibilityEnum.Neither, text: 'Neither' }
        ],
        mltag: 'txt_fundshare_execonlyapproptest'
    }
    advisedRetailDistribution: FormItem = {
        type: FormItemType.list,
        label: 'Eligible For Advised Retail Distribution',
        required: false,
        listItems: [
            { id: E.ProfileEligibilityEnum.Retail, text: 'Retail' },
            { id: E.ProfileEligibilityEnum.Professional, text: 'Professional' },
            { id: E.ProfileEligibilityEnum.Both, text: 'Both' },
            { id: E.ProfileEligibilityEnum.Neither, text: 'Neither' }
        ],
        mltag: 'txt_fundshare_advisedretaildist'
    }
    portfolioManagement: FormItem = {
        type: FormItemType.list,
        label: 'Eligible For Portfolio Management',
        required: false,
        listItems: [
            { id: E.ProfileEligibilityEnum.Retail, text: 'Retail' },
            { id: E.ProfileEligibilityEnum.Professional, text: 'Professional' },
            { id: E.ProfileEligibilityEnum.Both, text: 'Both' },
            { id: E.ProfileEligibilityEnum.Neither, text: 'Neither' }
        ],
        mltag: 'txt_fundshare_portfolioman'
    }
}