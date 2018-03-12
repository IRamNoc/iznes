import {FormItem, FormItemType} from '@setl/core-dynamic-forms/DynamicForm';

export class ShareTaxationOptional {
    tisTidReporting: FormItem = {
        type: FormItemType.list,
        label: 'TIS And TID Reporting',
        required: false,
        listItems: [
            { id: 'yes-both', text: 'Yes, for both TIS and TID' },
            { id: 'tis', text: 'Only for TIS' },
            { id: 'tid', text: 'Only for TID' },
            { id: 'no-both', text: 'No, for both TIS and TID' }
        ]
    }
    hasDailyDeliveryOfInterimProfit: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Daily Delivery Of Interim Profit To WM Daten',
        required: false
    }
    hasReducedLuxembourgTax: FormItem = {
        type: FormItemType.boolean,
        label: "Has Reduced Luxembourg Taxe d'Abonnement",
        required: false
    }
    luxembourgTax: FormItem = {
        type: FormItemType.number,
        label: "Luxembourg Taxe d'abonnement",
        required: false
    }
    hasSwissTaxReporting: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Swiss Tax Reporting',
        required: false
    }
    swissTaxStatusRuling: FormItem = {
        type: FormItemType.boolean,
        label: 'Tax Status Switzerland - Tax Ruling',
        required: false
    }
    isEligibleForTaxDeferredFundSwitchInSpain: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Eligible For Tax Deferred Fund Switch In Spain',
        required: false
    }
    hasUKReportingStatus: FormItem = {
        type: FormItemType.boolean,
        label: 'Has UK Reporting Status',
        required: false
    }
    ukReportingStatusValidFrom: FormItem = {
        type: FormItemType.date,
        label: 'UK Reporting Status Valid From',
        required: false
    }
    ukReportingStatusValidUntil: FormItem = {
        type: FormItemType.date,
        label: 'UK Reporting Status Valid Until',
        required: false
    }
    hasUKConfirmationOfExcessAmount: FormItem = {
        type: FormItemType.boolean,
        label: 'Has UK Confirmation Of Excess Amount',
        required: false
    }
    isUSTaxFormsW8W9Needed: FormItem = {
        type: FormItemType.boolean,
        label: 'Is US Tax Forms W8 W9 Needed',
        required: false
    }
    isFlowThroughEntityByUSTaxLaw: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Flow-Through Entity By US Tax Law',
        required: false
    }
    fatcaStatusV2: FormItem = {
        type: FormItemType.list,
        label: 'FATCA Status V2',
        required: false,
        listItems: [
            { id: 'sponsored-ffi', text: 'Sponsored FFI' },
            { id: 'certified-deemed-compliant-nonregistering-local-bank', text: 'Certified deemed-compliant nonregistering local bank' },
            { id: 'certified-deemed-compliant-ffi-with-only-low-value-accounts', text: 'Certified deemed-compliant FFI with only low-value accounts' },
            { id: 'certified-deemed-compliant-sponsored-closely-held-investment-vehicle', text: 'Certified deemed-compliant sponsored, closely held investment vehicle' },
            { id: 'certified-deemed-compliant-limited-life-debt-investment-entity', text: 'Certified deemed-compliant limited life debt investment entity' },
            { id: 'certain-investment-entities-that-do-not-maintain-financial-accounts', text: 'Certain investment entities that do not maintain financial accounts' },
            { id: 'owner-documented-ffi', text: 'Owner-documented FFI' },
            { id: 'restricted-distributor', text: 'Restricted distributor' },
            { id: 'nonreporting-iga-ffi', text: 'Nonreporting IGA FFI' },
            { id: 'foreign-government-government-of-a-us-possession-or-foreign-central-bank-of-issue', text: 'Foreign government, government of a U.S. possession, or foreign central bank of issue' },
            { id: 'international-organization', text: 'International organization' },
            { id: 'exempt-retirement-plans', text: 'Exempt retirement plans' },
            { id: 'entity-wholly-owned-by-exempt-beneficial-owners', text: 'Entity wholly owned by exempt beneficial owners' },
            { id: 'territory-financial-institution', text: 'Territory financial institution' },
            { id: 'excepted-nonfinancial-group-entity', text: 'Excepted nonfinancial group entity' },
            { id: 'excepted-nonfinancial-start-up company', text: 'Excepted nonfinancial start-up company' },
            { id: 'excepted-nonfinancial-entity-in-liquidation-or-bankruptcy', text: 'Excepted nonfinancial entity in liquidation or bankruptcy' },
            { id: '501c-organization', text: '501(c) organization' },
            { id: 'nonprofit-organization', text: 'Nonprofit organization' },
            { id: 'publicly-traded-nffe', text: 'Publicly traded NFFE or NFFE affiliate of a publicly traded corporation' },
            { id: 'excepted-territory-nffe', text: 'Excepted territory NFFE' },
            { id: 'active-nffe', text: 'Active NFFE' },
            { id: 'passive-nffe', text: 'Passive NFFE' },
            { id: 'excepted-inter-affiliate-ffi', text: 'Excepted inter-affiliate FFI' },
            { id: 'direct-reporting-nffe', text: 'Direct reporting NFFE' },
            { id: 'sponsored-direct-reporting-nffe', text: 'Sponsored direct reporting NFFE' },
            { id: 'account-that-is-not-a-financial-account', text: 'Account that is not a financial account' }
        ]
    }
    isSubjectToFATCAWithholdingTaxation: FormItem = {
        type: FormItemType.boolean,
        label: 'Subject To FATCA Withholding Taxation',
        required: false
    }
}