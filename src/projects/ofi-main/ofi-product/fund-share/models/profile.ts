import { FormItem, FormItemType, DynamicFormsValidator } from '@setl/utils';
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
    };
}

export class ShareProfileOptional {
    recommendedHoldingPeriod: FormItem = {
        type: FormItemType.number,
        label: 'Recommended Holding Period in month(s)',
        required: false,
    };
    benchmark: FormItem = {
        type: FormItemType.text,
        label: 'Benchmark',
        required: false,
    };
    outperformanceCommission: FormItem = {
        type: FormItemType.text,
        label: 'Outperformance Commission',
        required: false,
    };
    peaEligibility: FormItem = {
        type: FormItemType.boolean,
        label: 'Eligibility for PEA',
        required: false,
    };
    isClientTypeRetail: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Client Type Retail',
        required: false,
    };
    isClientTypeProfessional: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Client Type Professional',
        required: false,
    };
    isClientTypeEligibleCounterparty: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Client Type Eligible Counterparty',
        required: false,
    };
    withBasicKnowledge: FormItem = {
        type: FormItemType.boolean,
        label: 'Investor With Basic Knowledge',
        required: false,
    };
    informed: FormItem = {
        type: FormItemType.boolean,
        label: 'Informed Investor',
        required: false,
    };
    advanced: FormItem = {
        type: FormItemType.boolean,
        label: 'Advanced Investor',
        required: false,
    };
    noCapitalLoss: FormItem = {
        type: FormItemType.boolean,
        label: 'No Ability For Any Capital Loss',
        required: false,
    };
    limitedCapitalLosses: FormItem = {
        type: FormItemType.boolean,
        label: 'Ability For Limited Capital Losses',
        required: false,
    };
    totalCapitalLoss: FormItem = {
        type: FormItemType.boolean,
        label: 'Ability For Total Capital Loss',
        required: false,
    };
    lossesBeyondCapital: FormItem = {
        type: FormItemType.boolean,
        label: 'Ability For Losses Beyond Capital',
        required: false,
    };
    preservation: FormItem = {
        type: FormItemType.boolean,
        label: 'Return Profile Preservation',
        required: false,
    };
    growth: FormItem = {
        type: FormItemType.boolean,
        label: 'Return Profile Growth',
        required: false,
    };
    income: FormItem = {
        type: FormItemType.boolean,
        label: 'Return Profile Income',
        required: false,
    };
    hedging: FormItem = {
        type: FormItemType.boolean,
        label: 'Return Profile Hedging',
        required: false,
    };
    optionsOrLeverage: FormItem = {
        type: FormItemType.boolean,
        label: 'Return Profile Options Or Leverage',
        required: false,
    };
    other: FormItem = {
        type: FormItemType.boolean,
        label: 'Return Profile Other',
        required: false,
    };
    executionOnlyDistribution: FormItem = {
        type: FormItemType.list,
        label: 'Eligible For Execution Only Distribution',
        required: false,
        listItems: [
            { id: E.ProfileEligibilityEnum.Retail, text: 'Retail' },
            { id: E.ProfileEligibilityEnum.Professional, text: 'Professional' },
            { id: E.ProfileEligibilityEnum.Both, text: 'Both' },
            { id: E.ProfileEligibilityEnum.Neither, text: 'Neither' },
        ],
    };
    executionOnlyWithAppropriatenessTest: FormItem = {
        type: FormItemType.list,
        label: 'Eligible For Execution Only With Appropriateness Test',
        required: false,
        listItems: [
            { id: E.ProfileEligibilityEnum.Retail, text: 'Retail' },
            { id: E.ProfileEligibilityEnum.Professional, text: 'Professional' },
            { id: E.ProfileEligibilityEnum.Both, text: 'Both' },
            { id: E.ProfileEligibilityEnum.Neither, text: 'Neither' },
        ],
    };
    advisedRetailDistribution: FormItem = {
        type: FormItemType.list,
        label: 'Eligible For Advised Retail Distribution',
        required: false,
        listItems: [
            { id: E.ProfileEligibilityEnum.Retail, text: 'Retail' },
            { id: E.ProfileEligibilityEnum.Professional, text: 'Professional' },
            { id: E.ProfileEligibilityEnum.Both, text: 'Both' },
            { id: E.ProfileEligibilityEnum.Neither, text: 'Neither' },
        ],
    };
    portfolioManagement: FormItem = {
        type: FormItemType.list,
        label: 'Eligible For Portfolio Management',
        required: false,
        listItems: [
            { id: E.ProfileEligibilityEnum.Retail, text: 'Retail' },
            { id: E.ProfileEligibilityEnum.Professional, text: 'Professional' },
            { id: E.ProfileEligibilityEnum.Both, text: 'Both' },
            { id: E.ProfileEligibilityEnum.Neither, text: 'Neither' },
        ],
    };
}
