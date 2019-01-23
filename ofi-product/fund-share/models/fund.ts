import { FormItem, FormItemType, FormItemStyle, DynamicFormsValidator } from '@setl/utils';
import * as PC from '../../productConfig';

export class ShareFund extends DynamicFormsValidator {
    name: FormItem = {
        type: FormItemType.text,
        label: 'Fund name',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter],
    };
    aumFund: FormItem = {
        type: FormItemType.text,
        label: 'AuM Fund',
        required: false,
        disabled: true,
    };
    aumFundDate: FormItem = {
        type: FormItemType.text,
        label: 'AuM Fund Date',
        required: false,
        disabled: true,
    };
    LEI: FormItem = {
        type: FormItemType.text,
        label: 'Legal Entity Identifier (LEI)',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter],
    };
    fundRegisteredOfficeName: FormItem = {
        type: FormItemType.text,
        label: 'Name of the Registered Office of the Fund',
        required: false,
        disabled: true,
    };
    fundRegisteredOfficeAddress: FormItem = {
        type: FormItemType.text,
        label: 'Address of the register Office of the Fund',
        required: false,
        disabled: true,
    };
    domicile: FormItem = {
        type: FormItemType.list,
        label: 'Fund Domicile (Country)',
        required: false,
        disabled: true,
        listItems: PC.fundItems.domicileItems,
        style: [FormItemStyle.BreakOnAfter],
    };
    isEUDirectiveRelevant: FormItem = {
        type: FormItemType.boolean,
        label: 'Is EU Directive Relevant?',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter],
    };
    legalForm: FormItem = {
        type: FormItemType.list,
        label: 'Legal Form of the Fund',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundLegalFormItems,
    };
    nationalNomenclature: FormItem = {
        type: FormItemType.list,
        label: 'National Nomenclature of Legal Fund',
        required: false,
        disabled: true,
    };
    creationDate: FormItem = {
        type: FormItemType.text,
        label: 'Fund Creation Date',
        required: false,
        disabled: true,
    };
    launchDate: FormItem = {
        type: FormItemType.text,
        label: 'Fund Launch Date',
        required: false,
        disabled: true,
    };
    currency: FormItem = {
        type: FormItemType.list,
        label: 'Fund Currency',
        required: false,
        disabled: true,
        listItems: [],
    };
    openOrCloseEnded: FormItem = {
        type: FormItemType.boolean,
        label: 'Open-ended or Close-ended Fund Structure',
        required: false,
        disabled: true,
    };
    fiscalYearEnd: FormItem = {
        type: FormItemType.text,
        label: 'Fiscal Year End',
        required: false,
        disabled: true,
    };
    isFundOfFunds: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Fund of Funds',
        required: false,
        disabled: true,
    };
    managementCompany: FormItem = {
        type: FormItemType.list,
        label: 'Management Company',
        required: false,
        disabled: true,
    };
    fundAdministrator: FormItem = {
        type: FormItemType.list,
        label: 'Fund Administrator',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundAdministratorItems,
    };
    custodianBank: FormItem = {
        type: FormItemType.list,
        label: 'Custodian Bank',
        required: false,
        disabled: true,
        listItems: PC.fundItems.custodianBankItems,
    };
    investmentManager: FormItem = {
        type: FormItemType.list,
        label: 'Investment Manager',
        required: false,
        disabled: true,
        listItems: PC.fundItems.investmentManagerItems,
    };
    principalPromoter: FormItem = {
        type: FormItemType.list,
        label: 'Principal Promoter',
        required: false,
        disabled: true,
        listAllowMultiple: true,
        listItems: PC.fundItems.principalPromoterItems,
    };
    payingAgent: FormItem = {
        type: FormItemType.list,
        label: 'Paying Agent',
        required: false,
        disabled: true,
        listAllowMultiple: true,
        listItems: PC.fundItems.payingAgentItems,
    };
    fundManagers: FormItem = {
        type: FormItemType.text,
        label: 'Fund Managers',
        required: false,
        disabled: true,
    };
    isDedicatedFund: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Dedicated Fund',
        required: false,
        disabled: true,
    };
    portfolioCurrencyHedge: FormItem = {
        type: FormItemType.list,
        label: 'Portfolio Currency Hedge',
        required: false,
        disabled: true,
        listItems: PC.fundItems.portfolioCurrencyHedgeItems,
    };
    investmentObjective: FormItem = {
        type: FormItemType.text,
        label: 'Investment Objective',
        required: false,
        disabled: true,
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
    };
}

export class ShareFundOptionnal extends DynamicFormsValidator {
    globalItermediaryIdentification: FormItem = {
        type: FormItemType.text,
        label: 'Global Intermediary Identification Number (GIIN)',
        required: false,
        disabled: true,
    };
    delegatedManagementCompany: FormItem = {
        type: FormItemType.list,
        label: 'Delegated Management Company',
        required: false,
        disabled: true,
    };
    investmentAdvisor: FormItem = {
        type: FormItemType.list,
        label: 'Investment Advisor',
        required: false,
        disabled: true,
        listItems: PC.fundItems.investmentAdvisorItems,
    };
    auditor: FormItem = {
        type: FormItemType.list,
        label: 'Auditor',
        required: false,
        disabled: true,
    };
    taxAuditor: FormItem = {
        type: FormItemType.list,
        label: 'Tax Auditor',
        required: false,
        disabled: true,
    };
    legalAdvisor: FormItem = {
        type: FormItemType.list,
        label: 'Legal Advisor',
        required: false,
        disabled: true,
        listItems: PC.fundItems.legalAdvisorItems,
    };
    directors: FormItem = {
        type: FormItemType.text,
        label: 'Directors',
        required: false,
        disabled: true,
    };
    hasEmbeddedDirective: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Embedded Derivatives',
        required: false,
        disabled: true,
    };
    hasCapitalPreservation: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Capital Preservation',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter],
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
    };
    hasCppi: FormItem = {
        type: FormItemType.boolean,
        label: 'Has CPPI',
        required: false,
        disabled: true,
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
    };
    hasHedgeFundStrategy: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Hedge Fund Strategy',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnBefore],
    };
    isLeveraged: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Leveraged',
        required: false,
        disabled: true,
    };
    has130Or30Strategy: FormItem = {
        type: FormItemType.boolean,
        label: 'Has 130/30 Strategy',
        required: false,
        disabled: true,
    };
    isFundTargetingEos: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Fund Targeting Environmental or Social Objectives (EOS)',
        required: false,
        disabled: true,
    };
    isFundTargetingSri: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Fund Targeting Socially Responsible Investment (SRI)',
        required: false,
        disabled: true,
    };
    isPassiveFund: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Passive Fund',
        required: false,
        disabled: true,
    };
    hasSecurityiesLending: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Security Lending',
        required: false,
        disabled: true,
    };
    hasSwap: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Swap',
        required: false,
        disabled: true,
    };
    hasDurationHedge: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Duration Hedge',
        required: false,
        disabled: true,
    };
    internalReference: FormItem = {
        type: FormItemType.text,
        label: 'Internal Reference',
        required: false,
        disabled: true,
    };
    additionnalNotes: FormItem = {
        type: FormItemType.textarea,
        label: 'Additional Notes',
        required: false,
        disabled: true,
    };
}
