import { FormItem, FormItemType } from '@setl/utils';
import * as E from '../FundShareEnum';

export class ShareTaxationOptional {
    tisTidReporting: FormItem = {
        type: FormItemType.list,
        label: 'TIS And TID Reporting',
        required: false,
        listItems: [
            { id: E.TISTIDReportingEnum.YesBoth, text: 'Yes, for both TIS and TID' },
            { id: E.TISTIDReportingEnum.TIS, text: 'Only for TIS' },
            { id: E.TISTIDReportingEnum.TID, text: 'Only for TID' },
            { id: E.TISTIDReportingEnum.NoBoth, text: 'No, for both TIS and TID' },
        ],
    };
    hasDailyDeliveryOfInterimProfit: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Daily Delivery Of Interim Profit To WM Daten',
        required: false,
    };
    hasReducedLuxembourgTax: FormItem = {
        type: FormItemType.boolean,
        label: "Has Reduced Luxembourg Taxe d'Abonnement",
        required: false,
    };
    luxembourgTax: FormItem = {
        type: FormItemType.number,
        label: 'Luxembourg Subscription Fee',
        required: false,
    };
    hasSwissTaxReporting: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Swiss Tax Reporting',
        required: false,
    };
    swissTaxStatusRuling: FormItem = {
        type: FormItemType.boolean,
        label: 'Tax Status Switzerland - Tax Ruling',
        required: false,
    };
    isEligibleForTaxDeferredFundSwitchInSpain: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Eligible For Tax Deferred Fund Switch In Spain',
        required: false,
    };
    hasUKReportingStatus: FormItem = {
        type: FormItemType.boolean,
        label: 'Has UK Reporting Status',
        required: false,
    };
    ukReportingStatusValidFrom: FormItem = {
        type: FormItemType.date,
        label: 'UK Reporting Status Valid From',
        required: false,
    };
    ukReportingStatusValidUntil: FormItem = {
        type: FormItemType.date,
        label: 'UK Reporting Status Valid Until',
        required: false,
    };
    hasUKConfirmationOfExcessAmount: FormItem = {
        type: FormItemType.boolean,
        label: 'Has UK Confirmation Of Excess Amount',
        required: false,
    };
    isUSTaxFormsW8W9Needed: FormItem = {
        type: FormItemType.boolean,
        label: 'Is US Tax Forms W8 W9 Needed',
        required: false,
    };
    isFlowThroughEntityByUSTaxLaw: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Flow-Through Entity By US Tax Law',
        required: false,
    };
    fatcaStatusV2: FormItem = {
        type: FormItemType.list,
        label: 'FATCA Status V2',
        required: false,
        listItems: [
            { id: E.FatcaStatusV2Enum.SponsoredFFI, text: 'Sponsored FFI' },
            {
                id: E.FatcaStatusV2Enum.CertifiedDeemedCompliantNonRegisteringLocalBank,
                text: 'Certified deemed-compliant nonregistering local bank',
            },
            {
                id: E.FatcaStatusV2Enum.CertifiedDeemedCompliantFFILowValueAccounts,
                text: 'Certified deemed-compliant FFI with only low-value accounts',
            },
            {
                id: E.FatcaStatusV2Enum.CertifiedDeemedCompliantSponsoredCloselyHeldInvestment,
                text: 'Certified deemed-compliant sponsored, closely held investment vehicle',
            },
            {
                id: E.FatcaStatusV2Enum.CertifiedDeemedCompliantLimitedLifeDebtInvestmentEntity,
                text: 'Certified deemed-compliant limited life debt investment entity',
            },
            {
                id: E.FatcaStatusV2Enum.CertainInvestmentEntitiesThatDoNotMaintainFinancialAccounts,
                text: 'Certain investment entities that do not maintain financial accounts',
            },
            { id: E.FatcaStatusV2Enum.OwnerDocumentedFFI, text: 'Owner-documented FFI' },
            { id: E.FatcaStatusV2Enum.RestrictedDistributor, text: 'Restricted distributor' },
            { id: E.FatcaStatusV2Enum.NonreportingIGAFFI, text: 'Nonreporting IGA FFI' },
            {
                id: E.FatcaStatusV2Enum.ForeignGovernment,
                text: 'Foreign government, government of a U.S. possession, or foreign central bank of issue',
            },
            { id: E.FatcaStatusV2Enum.InternationalOrganization, text: 'International organization' },
            { id: E.FatcaStatusV2Enum.ExemptRetirementPlans, text: 'Exempt retirement plans' },
            { id: E.FatcaStatusV2Enum.EntityWhollyOwned, text: 'Entity wholly owned by exempt beneficial owners' },
            { id: E.FatcaStatusV2Enum.TerritoryFinancialInstitution, text: 'Territory financial institution' },
            { id: E.FatcaStatusV2Enum.ExceptedNonfinancialGroupEntity, text: 'Excepted nonfinancial group entity' },
            {
                id: E.FatcaStatusV2Enum.ExceptedNonfinancialStartupCompany,
                text: 'Excepted nonfinancial start-up company',
            },
            {
                id: E.FatcaStatusV2Enum.ExceptedNonfinancialEntityInLiquidationOrBankruptcy,
                text: 'Excepted nonfinancial entity in liquidation or bankruptcy',
            },
            { id: E.FatcaStatusV2Enum.FiveHundredOneCOrganisation, text: '501(c) organization' },
            { id: E.FatcaStatusV2Enum.NonprofitOrganization, text: 'Nonprofit organization' },
            {
                id: E.FatcaStatusV2Enum.PubliclyTradedNFFEOrNFFEAffiliateOfAPubliclyTradedCorporation,
                text: 'Publicly traded NFFE or NFFE affiliate of a publicly traded corporation',
            },
            { id: E.FatcaStatusV2Enum.ExceptedTerritoryNFFE, text: 'Excepted territory NFFE' },
            { id: E.FatcaStatusV2Enum.ActiveNFFE, text: 'Active NFFE' },
            { id: E.FatcaStatusV2Enum.PassiveNFFE, text: 'Passive NFFE' },
            { id: E.FatcaStatusV2Enum.ExceptedInterAffiliateFFI, text: 'Excepted inter-affiliate FFI' },
            { id: E.FatcaStatusV2Enum.DirectReportingNFFE, text: 'Direct reporting NFFE' },
            { id: E.FatcaStatusV2Enum.SponsoredDirectReportingNFFE, text: 'Sponsored direct reporting NFFE' },
            { id: E.FatcaStatusV2Enum.NotAFinancialAccount, text: 'Account that is not a financial account' },
        ],
    };
    isSubjectToFATCAWithholdingTaxation: FormItem = {
        type: FormItemType.boolean,
        label: 'Subject To FATCA Withholding Taxation',
        required: false,
    };
}
