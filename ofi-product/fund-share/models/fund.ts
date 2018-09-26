import { FormItem, FormItemType, FormItemStyle, DynamicFormsValidator } from '@setl/utils';
import * as PC from '../../productConfig';

export class ShareFund extends DynamicFormsValidator {
    name: FormItem = {
        type: FormItemType.text,
        label: 'Fund name',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_fund_name',
    };
    aumFund: FormItem = {
        type: FormItemType.text,
        label: 'AuM Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_aumfund',
    };
    aumFundDate: FormItem = {
        type: FormItemType.text,
        label: 'AuM Fund Date',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_aumdate',
    };
    LEI: FormItem = {
        type: FormItemType.text,
        label: 'Legal Entity Identifier (LEI)',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_fund_lei',
    };
    fundRegisteredOfficeName: FormItem = {
        type: FormItemType.text,
        label: 'Name of the Registered Office of the Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_regofficename',
    };
    fundRegisteredOfficeAddress: FormItem = {
        type: FormItemType.text,
        label: 'Address of the register Office of the Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_regofficeaddr',
    };
    domicile: FormItem = {
        type: FormItemType.list,
        label: 'Fund Domicile (country)',
        required: false,
        disabled: true,
        listItems: PC.fundItems.domicileItems,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_fund_domicile',
    };
    isEUDirectiveRelevant: FormItem = {
        type: FormItemType.boolean,
        label: 'Is EU Directive Relevant?',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_fund_iseudirrelevant',
    };
    legalForm: FormItem = {
        type: FormItemType.list,
        label: 'Legal Form of the Fund',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundLegalFormItems,
        mltag: 'txt_fundshare_fund_legalform',
    };
    nationalNomenclature: FormItem = {
        type: FormItemType.list,
        label: 'National Nomenclature of Legal Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_nationalnomenclature',
    };
    creationDate: FormItem = {
        type: FormItemType.text,
        label: 'Fund Creation Date',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_creationdate',
    };
    launchDate: FormItem = {
        type: FormItemType.text,
        label: 'Fund Launch Date',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_launchdate',
    };
    currency: FormItem = {
        type: FormItemType.list,
        label: 'Fund Currency',
        required: false,
        disabled: true,
        listItems: [],
        mltag: 'txt_fundshare_fund_currency',
    };
    openOrCloseEnded: FormItem = {
        type: FormItemType.boolean,
        label: 'Open-ended or Close-ended Fund Structure',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_openorcloseended',
    };
    fiscalYearEnd: FormItem = {
        type: FormItemType.text,
        label: 'Fiscal Year End',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_fiscalyearend',
    };
    isFundOfFunds: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Fund of Funds',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_isfundoffunds',
    };
    managementCompany: FormItem = {
        type: FormItemType.list,
        label: 'Management Company',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_manageco',
    };
    fundAdministrator: FormItem = {
        type: FormItemType.list,
        label: 'Fund Administrator',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundAdministratorItems,
        mltag: 'txt_fundshare_fund_fundadmin',
    };
    custodianBank: FormItem = {
        type: FormItemType.list,
        label: 'Custodian Bank',
        required: false,
        disabled: true,
        listItems: PC.fundItems.custodianBankItems,
        mltag: 'txt_fundshare_fund_custodianbank',
    };
    investmentManager: FormItem = {
        type: FormItemType.list,
        label: 'Investment Manager',
        required: false,
        disabled: true,
        listItems: PC.fundItems.investmentManagerItems,
        mltag: 'txt_fundshare_fund_investmentman',
    };
    principalPromoter: FormItem = {
        type: FormItemType.list,
        label: 'Principal Promoter',
        required: false,
        disabled: true,
        listAllowMultiple: true,
        listItems: PC.fundItems.principalPromoterItems,
        mltag: 'txt_fundshare_fund_principlepromoter',
    };
    payingAgent: FormItem = {
        type: FormItemType.list,
        label: 'Paying Agent',
        required: false,
        disabled: true,
        listAllowMultiple: true,
        listItems: PC.fundItems.payingAgentItems,
        mltag: 'txt_fundshare_fund_payingagent',
    };
    fundManagers: FormItem = {
        type: FormItemType.text,
        label: 'Fund Managers',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_managers',
    };
    isDedicatedFund: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Dedicated Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_isdedicated',
    };
    portfolioCurrencyHedge: FormItem = {
        type: FormItemType.list,
        label: 'Portfolio Currency Hedge',
        required: false,
        disabled: true,
        listItems: PC.fundItems.portfolioCurrencyHedgeItems,
        mltag: 'txt_fundshare_fund_portfoliocurrencyhedge',
    };
    investmentObjective: FormItem = {
        type: FormItemType.text,
        label: 'investmentObjective',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_investmentObjective',
    };
}

export class ShareFundHolidayManagement extends DynamicFormsValidator {
    useDefaultHolidayMgmt: FormItem = {
        type: FormItemType.boolean,
        label: 'Use Default Holiday Management Configuration? (Can be found in My Products > Configuration)',
        required: false,
        disabled: true,
        value: () => {
            return this.useDefaultHolidayMgmt.control.value;
        },
        cssClass: 'col-sm-12',
        mltag: 'txt_fundshare_fund_optionnal_useDefaultHolidayMgmt',
    };
    holidayMgmtConfig: FormItem = {
        type: FormItemType.extendedDate,
        label: '',
        required: false,
        disabled: true,
        hidden: (): boolean => {
            return this.useDefaultHolidayMgmt.value();
        },
        style: [FormItemStyle.BreakOnBefore],
        cssClass: 'col-sm-12',
        mltag: 'txt_fundshare_fund_optionnal_holidayMgmtConfig',
    };
}

export class ShareFundOptionnal extends DynamicFormsValidator {
    globalItermediaryIdentification: FormItem = {
        type: FormItemType.text,
        label: 'Global Intermediary Identification Number (GIIN)',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_globalItermediaryIdentification',
    };
    delegatedManagementCompany: FormItem = {
        type: FormItemType.list,
        label: 'Delegated Management Company',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_delegatedManagementCompany',
    };
    investmentAdvisor: FormItem = {
        type: FormItemType.list,
        label: 'Investment Advisor',
        required: false,
        disabled: true,
        listItems: PC.fundItems.investmentAdvisorItems,
        mltag: 'txt_fundshare_fund_optionnal_investmentAdvisor',
    };
    auditor: FormItem = {
        type: FormItemType.list,
        label: 'Auditor',
        required: false,
        disabled: true,
        listItems: PC.fundItems.auditorItems,
        mltag: 'txt_fundshare_fund_optionnal_auditor',
    };
    taxAuditor: FormItem = {
        type: FormItemType.list,
        label: 'Tax Auditor',
        required: false,
        disabled: true,
        listItems: PC.fundItems.taxAuditorItems,
        mltag: 'txt_fundshare_fund_optionnal_taxAuditor',
    };
    legalAdvisor: FormItem = {
        type: FormItemType.list,
        label: 'Legal Advisor',
        required: false,
        disabled: true,
        listItems: PC.fundItems.legalAdvisorItems,
        mltag: 'txt_fundshare_fund_optionnal_legalAdvisor',
    };
    directors: FormItem = {
        type: FormItemType.text,
        label: 'Directors',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_directors',
    };
    hasEmbeddedDirective: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Embedded Derivatives',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_hasEmbeddedDirective',
    };
    hasCapitalPreservation: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Capital Preservation',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_fund_optionnal_hasCapitalPreservation',
    };
    capitalPreservationLevel: FormItem = {
        type: FormItemType.number,
        label: 'Capital Preservation Level',
        required: false,
        disabled: true,
        hidden: (): boolean => {
            const v = this.hasCapitalPreservation.value();
            return !v;
        },
        listItems: PC.fundItems.capitalPreservationPeriodItems,
        mltag: 'txt_fundshare_fund_optionnal_capitalPreservationLevel',
    };
    capitalPreservationPeriod: FormItem = {
        type: FormItemType.text,
        label: 'Capital Preservation Period',
        required: false,
        disabled: true,
        hidden: (): boolean => {
            const v = this.hasCapitalPreservation.value();
            return !v;
        },
        mltag: 'txt_fundshare_fund_optionnal_capitalPreservationPeriod',
    };
    hasCppi: FormItem = {
        type: FormItemType.boolean,
        label: 'Has CPPI',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_hasCppi',
    };
    cppiMultiplier: FormItem = {
        type: FormItemType.number,
        label: 'CPPI Multiplier',
        required: false,
        disabled: true,
        hidden: (): boolean => {
            const v = this.hasCppi.value();
            return !v;
        },
        mltag: 'txt_fundshare_fund_optionnal_cppiMultiplier',
    };
    hasHedgeFundStrategy: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Hedge Fund Strategy',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnBefore],
        mltag: 'txt_fundshare_fund_optionnal_hasHedgeFundStrategy',
    };
    isLeveraged: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Leveraged',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_isLeveraged',
    };
    has130Or30Strategy: FormItem = {
        type: FormItemType.boolean,
        label: 'Has 130/30 Strategy',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_has130Or30Strategy',
    };
    isFundTargetingEos: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Fund Targeting Environmental or Social Objectives (EOS)',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_isFundTargetingEos',
    };
    isFundTargetingSri: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Fund Targeting Socially Responsible Investment (SRI)',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_isFundTargetingSri',
    };
    isPassiveFund: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Passive Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_isPassiveFund',
    };
    hasSecurityiesLending: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Security Lending',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_hasSecurityiesLending',
    };
    hasSwap: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Swap',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_hasSwap',
    };
    hasDurationHedge: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Duration Hedge',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_hasDurationHedge',
    };
    internalReference: FormItem = {
        type: FormItemType.text,
        label: 'Internal Reference',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_internalReference',
    };
    additionnalNotes: FormItem = {
        type: FormItemType.textarea,
        label: 'Additional Notes',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_optionnal_additionnalNotes',
    };
}
