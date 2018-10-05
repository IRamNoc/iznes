import { FormItem, FormItemType, FormItemStyle, DynamicFormsValidator } from '@setl/utils';
import * as PC from '../../productConfig';

export class ShareUmbrellaFund extends DynamicFormsValidator {
    umbrellaFundName: FormItem = {
        type: FormItemType.text,
        label: 'Umbrella Fund Name',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_umb_name',
    };
    legalEntityIdentifier: FormItem = {
        type: FormItemType.text,
        label: 'Legal Entity Identifier (LEI)',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_umb_lei',
    };
    registerOffice: FormItem = {
        type: FormItemType.text,
        label: 'Name of the Registered Office of the Umbrella Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_umb_regoffice',
    };
    registerOfficeAddress: FormItem = {
        type: FormItemType.text,
        label: 'Address of the Registered Office of the Umbrella Fund',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnBefore],
        mltag: 'txt_fundshare_umb_regofficeaddr',
    };
    registerOfficeAddressLine2: FormItem = {
        type: FormItemType.text,
        label: 'Address line 2',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_umb_regofficeaddr2',
    };
    registerOfficeAddressZipCode: FormItem = {
        type: FormItemType.text,
        label: 'ZIP Code',
        required: false,
        disabled: true,
        style: [FormItemStyle.WidthThird],
        mltag: 'txt_fundshare_umb_regofficezipcode',
    };
    registerOfficeAddressCity: FormItem = {
        type: FormItemType.text,
        label: 'City',
        required: false,
        disabled: true,
        style: [FormItemStyle.WidthThird],
        mltag: 'txt_fundshare_umb_regofficecity',
    };
    registerOfficeAddressCountry: FormItem = {
        type: FormItemType.list,
        label: 'Country',
        required: false,
        disabled: true,
        listItems: PC.fundItems.domicileItems,
        style: [FormItemStyle.WidthThird],
        mltag: 'txt_fundshare_umb_regofficecountry',
    };
    domicile: FormItem = {
        type: FormItemType.list,
        label: 'Umbrella Fund Domicile (Country)',
        required: false,
        disabled: true,
        listItems: PC.fundItems.domicileItems,
        mltag: 'txt_fundshare_umb_domicile',
    };
    umbrellaFundCreationDate: FormItem = {
        type: FormItemType.text,
        label: 'Umbrella Fund Creation Date',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_umb_fundcreatedate',
    };
    managementCompanyID: FormItem = {
        type: FormItemType.list,
        label: 'Management Company',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_umb_managecoid',
    };
    fundAdministratorID: FormItem = {
        type: FormItemType.list,
        label: 'Fund Administrator',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundAdministratorItems,
        mltag: 'txt_fundshare_fundadminid',
    };
    custodianBankID: FormItem = {
        type: FormItemType.list,
        label: 'Custodian Bank',
        required: false,
        disabled: true,
        listItems: PC.fundItems.custodianBankItems,
        mltag: 'txt_fundshare_custodianbankid',
    };
    investmentAdvisorID: FormItem = {
        type: FormItemType.list,
        label: 'Investment Advisor',
        required: false,
        disabled: true,
        listAllowMultiple: true,
        listItems: PC.fundItems.investmentAdvisorItems,
        mltag: 'txt_fundshare_investadvisorid',
    };
    payingAgentID: FormItem = {
        type: FormItemType.list,
        label: 'Paying Agent',
        required: false,
        disabled: true,
        listAllowMultiple: true,
        listItems: PC.fundItems.payingAgentItems,
        mltag: 'txt_fundshare_payingagentid',
    };
}

export class ShareUmbrellaFundOptionnal extends DynamicFormsValidator {
    giin: FormItem = {
        type: FormItemType.text,
        label: 'Global Intermediary Identification Number (GIIN)',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_optionnal_giin',
    };
    delegatedManagementCompanyID: FormItem = {
        type: FormItemType.list,
        label: 'Delegated Management Company',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_optionnal_delegatedManagementCompanyID',
    };
    auditorID: FormItem = {
        type: FormItemType.list,
        label: 'Auditor',
        required: false,
        disabled: true,
        listItems: PC.fundItems.auditorItems,
        mltag: 'txt_fundshare_optionnal_auditorID',
    };
    taxAuditorID: FormItem = {
        type: FormItemType.list,
        label: 'Tax Auditor',
        required: false,
        disabled: true,
        listItems: PC.fundItems.taxAuditorItems,
        mltag: 'txt_fundshare_optionnal_taxAuditorID',
    };
    principlePromoterID: FormItem = {
        type: FormItemType.list,
        label: 'Principal Promoter',
        required: false,
        disabled: true,
        listAllowMultiple: true,
        listItems: PC.fundItems.principalPromoterItems,
        mltag: 'txt_fundshare_optionnal_principlePromoterID',
    };
    legalAdvisorID: FormItem = {
        type: FormItemType.list,
        label: 'Legal Advisor',
        required: false,
        disabled: true,
        listItems: PC.fundItems.legalAdvisorItems,
        mltag: 'txt_fundshare_optionnal_legalAdvisorID',
    };
    directors: FormItem = {
        type: FormItemType.text,
        label: 'Directors',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_optionnal_directors',
    };
    internalReference: FormItem = {
        type: FormItemType.text,
        label: 'Internal Reference',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_optionnal_internalReference',
    };
    additionnalNotes: FormItem = {
        type: FormItemType.text,
        label: 'Additional Notes',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_optionnal_additionnalNotes',
    };
}
