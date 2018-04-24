import {FormItem, FormItemType, FormItemStyle, DynamicFormsValidator} from '@setl/utils';
import * as PC from '../../productConfig';

export class ShareFund extends DynamicFormsValidator {
    name: FormItem = {
        type: FormItemType.text,
        label: 'Fund name',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter]
    }
    aumFund: FormItem = {
        type: FormItemType.text,
        label: 'AuM Fund',
        required: false,
        disabled: true
    }
    aumFundDate: FormItem = {
        type: FormItemType.text,
        label: 'AuM Fund Date',
        required: false,
        disabled: true
    }
    LEI: FormItem = {
        type: FormItemType.text,
        label: 'Legal Entity Identifier (LEI)',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter]
    }
    fundRegisteredOfficeName: FormItem = {
        type: FormItemType.text,
        label: 'Name of the Registered Office of the Fund',
        required: false,
        disabled: true
    }
    fundRegisteredOfficeAddress: FormItem = {
        type: FormItemType.text,
        label: 'Address of the register Office of the Fund',
        required: false,
        disabled: true
    }
    domicile: FormItem = {
        type: FormItemType.list,
        label: 'Fund Domicile (country)',
        required: false,
        disabled: true,
        listItems: PC.fundItems.domicileItems,
        style: [FormItemStyle.BreakOnAfter]
    }
    isEUDirectiveRelevant: FormItem = {
        type: FormItemType.boolean,
        label: 'Is EU Directive Relevant?',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnAfter]
    }
    legalForm: FormItem = {
        type: FormItemType.list,
        label: 'Legal Form of the Fund',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundLegalFormItems
    }
    nationalNomenclature: FormItem = {
        type: FormItemType.list,
        label: 'National Nomenclature of Legal Fund',
        required: false,
        disabled: true
    }
    creationDate: FormItem = {
        type: FormItemType.text,
        label: 'Fund Creation Date',
        required: false,
        disabled: true
    }
    launchDate: FormItem = {
        type: FormItemType.text,
        label: 'Fund Launch Date',
        required: false,
        disabled: true
    }
    currency: FormItem = {
        type: FormItemType.list,
        label: 'Fund Currency',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundCurrencyItems
    }
    openOrCloseEnded: FormItem = {
        type: FormItemType.boolean,
        label: 'Open-ended or Close-ended Fund Structure',
        required: false,
        disabled: true
    }
    fiscalYearEnd: FormItem = {
        type: FormItemType.text,
        label: 'Fiscal Year End',
        required: false,
        disabled: true
    }
    isFundOfFunds: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Fund of Funds',
        required: false,
        disabled: true
    }
    managementCompany: FormItem = {
        type: FormItemType.list,
        label: 'Management Company',
        required: false,
        disabled: true
    }
    fundAdministrator: FormItem = {
        type: FormItemType.list,
        label: 'Fund Administrator',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundAdministratorItems
    }
    custodianBank: FormItem = {
        type: FormItemType.list,
        label: 'Custodian Bank',
        required: false,
        disabled: true,
        listItems: PC.fundItems.custodianBankItems
    }
    investmentManager: FormItem = {
        type: FormItemType.list,
        label: 'Investment Manager',
        required: false,
        disabled: true,
        listItems: PC.fundItems.investmentManagerItems
    }
    principalPromoter: FormItem = {
        type: FormItemType.list,
        label: 'Principal Promoter',
        required: false,
        disabled: true,
        listItems: PC.fundItems.principalPromoterItems
    }
    payingAgent: FormItem = {
        type: FormItemType.list,
        label: 'Paying Agent',
        required: false,
        disabled: true,
        listItems: PC.fundItems.payingAgentItems
    }
    fundManagers: FormItem = {
        type: FormItemType.list,
        label: 'Fund Managers',
        required: false,
        disabled: true,
        listItems: PC.fundItems.investmentManagerItems
    }
    isDedicatedFund: FormItem = {
        type: FormItemType.boolean,
        label: 'Is Dedicated Fund',
        required: false,
        disabled: true
    }
    portfolioCurrencyHedge: FormItem = {
        type: FormItemType.list,
        label: 'Portfolio Currency Hedge',
        required: false,
        disabled: true,
        listItems: PC.fundItems.portfolioCurrencyHedgeItems
    }
}