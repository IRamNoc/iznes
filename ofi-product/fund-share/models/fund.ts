import {FormItem, FormItemType, FormItemStyle, DynamicFormsValidator} from '@setl/utils';
import * as PC from '../../productConfig';

export class ShareFund extends DynamicFormsValidator {
    name: FormItem = {
        type: FormItemType.text,
        label: 'Fund name',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_fund_name'
    }
    aumFund: FormItem = {
        type: FormItemType.text,
        label: 'AuM Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_aumfund'
    }
    aumFundDate: FormItem = {
        type: FormItemType.text,
        label: 'AuM Fund Date',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_aumdate'
    }
    LEI: FormItem = {
        type: FormItemType.text,
        label: 'Legal Entity Identifier (LEI)',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_fund_lei'
    }
    fundRegisteredOfficeName: FormItem = {
        type: FormItemType.text,
        label: 'Name of the Registered Office of the Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_regofficename'
    }
    fundRegisteredOfficeAddress: FormItem = {
        type: FormItemType.text,
        label: 'Address of the register Office of the Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_regofficeaddr'
    }
    domicile: FormItem = {
        type: FormItemType.list,
        label: 'Fund Domicile (country)',
        required: false,
        disabled: true,
        listItems: PC.fundItems.domicileItems,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_fund_domicile'
    }
    isEUDirectiveRelevant: FormItem = {
        type: FormItemType.boolean,
        label: 'Is EU Directive Relevant?',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_fund_iseudirrelevant'
    }
    legalForm: FormItem = {
        type: FormItemType.list,
        label: 'Legal Form of the Fund',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundLegalFormItems,
        mltag: 'txt_fundshare_fund_legalform'
    }
    nationalNomenclature: FormItem = {
        type: FormItemType.list,
        label: 'National Nomenclature of Legal Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_nationalnomenclature'
    }
    creationDate: FormItem = {
        type: FormItemType.text,
        label: 'Fund Creation Date',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_creationdate'
    }
    launchDate: FormItem = {
        type: FormItemType.text,
        label: 'Fund Launch Date',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_launchdate'
    }
    currency: FormItem = {
        type: FormItemType.list,
        label: 'Fund Currency',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundCurrencyItems,
        mltag: 'txt_fundshare_fund_currency'
    }
    openOrCloseEnded: FormItem = {
        type: FormItemType.boolean,
        label: 'Open-ended or Close-ended Fund Structure',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_openorcloseended'
    }
    fiscalYearEnd: FormItem = {
        type: FormItemType.text,
        label: 'Fiscal Year End',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_fiscalyearend'
    }
    isFundOfFunds: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Fund of Funds',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_isfundoffunds'
    }
    managementCompany: FormItem = {
        type: FormItemType.list,
        label: 'Management Company',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_manageco'
    }
    fundAdministrator: FormItem = {
        type: FormItemType.list,
        label: 'Fund Administrator',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundAdministratorItems,
        mltag: 'txt_fundshare_fund_fundadmin'
    }
    custodianBank: FormItem = {
        type: FormItemType.list,
        label: 'Custodian Bank',
        required: false,
        disabled: true,
        listItems: PC.fundItems.custodianBankItems,
        mltag: 'txt_fundshare_fund_custodianbank'
    }
    investmentManager: FormItem = {
        type: FormItemType.list,
        label: 'Investment Manager',
        required: false,
        disabled: true,
        listItems: PC.fundItems.investmentManagerItems,
        mltag: 'txt_fundshare_fund_investmentman'
    }
    principalPromoter: FormItem = {
        type: FormItemType.list,
        label: 'Principal Promoter',
        required: false,
        disabled: true,
        listAllowMultiple: true,
        listItems: PC.fundItems.principalPromoterItems,
        mltag: 'txt_fundshare_fund_principlepromoter'
    }
    payingAgent: FormItem = {
        type: FormItemType.list,
        label: 'Paying Agent',
        required: false,
        disabled: true,
        listAllowMultiple: true,
        listItems: PC.fundItems.payingAgentItems,
        mltag: 'txt_fundshare_fund_payingagent'
    }
    fundManagers: FormItem = {
        type: FormItemType.text,
        label: 'Fund Managers',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_managers'
    }
    isDedicatedFund: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Dedicated Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_fund_isdedicated'
    }
    portfolioCurrencyHedge: FormItem = {
        type: FormItemType.list,
        label: 'Portfolio Currency Hedge',
        required: false,
        disabled: true,
        listItems: PC.fundItems.portfolioCurrencyHedgeItems,
        mltag: 'txt_fundshare_fund_portfoliocurrencyhedge'
    }
}