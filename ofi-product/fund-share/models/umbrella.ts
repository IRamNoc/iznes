import { FormItem, FormItemType, FormItemStyle, DynamicFormsValidator } from '@setl/utils';
import * as PC from '../../productConfig';

export class ShareUmbrellaFund extends DynamicFormsValidator {
    umbrellaFundName: FormItem = {
        type: FormItemType.text,
        label: 'Umbrella Fund Name',
        required: false,
        disabled: true,
    };
    legalEntityIdentifier: FormItem = {
        type: FormItemType.text,
        label: 'Legal Entity Identifier (LEI)',
        required: false,
        disabled: true,
    };
    registerOffice: FormItem = {
        type: FormItemType.text,
        label: 'Name of the Registered Office of the Umbrella Fund',
        required: false,
        disabled: true,
    };
    registerOfficeAddress: FormItem = {
        type: FormItemType.text,
        label: 'Address of the Registered Office of the Umbrella Fund',
        required: false,
        disabled: true,
        style: [FormItemStyle.BreakOnBefore],
    };
    registerOfficeAddressLine2: FormItem = {
        type: FormItemType.text,
        label: 'Address Line 2',
        required: false,
        disabled: true,
    };
    registerOfficeAddressZipCode: FormItem = {
        type: FormItemType.text,
        label: 'ZIP Code',
        required: false,
        disabled: true,
        style: [FormItemStyle.WidthThird],
    };
    registerOfficeAddressCity: FormItem = {
        type: FormItemType.text,
        label: 'City',
        required: false,
        disabled: true,
        style: [FormItemStyle.WidthThird],
    };
    registerOfficeAddressCountry: FormItem = {
        type: FormItemType.list,
        label: 'Country',
        required: false,
        disabled: true,
        listItems: PC.fundItems.domicileItems,
        style: [FormItemStyle.WidthThird],
    };
    domicile: FormItem = {
        type: FormItemType.list,
        label: 'Umbrella Fund Domicile (Country)',
        required: false,
        disabled: true,
        listItems: PC.fundItems.domicileItems,
    };
    umbrellaFundCreationDate: FormItem = {
        type: FormItemType.text,
        label: 'Umbrella Fund Creation Date',
        required: false,
        disabled: true,
    };
    managementCompanyID: FormItem = {
        type: FormItemType.list,
        label: 'Management Company',
        required: false,
        disabled: true,
    };
    fundAdministratorID: FormItem = {
        type: FormItemType.list,
        label: 'Fund Administrator',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundAdministratorItems,
    };
    custodianBankID: FormItem = {
        type: FormItemType.list,
        label: 'Custodian Bank',
        required: false,
        disabled: true,
        listItems: PC.fundItems.custodianBankItems,
    };
    investmentAdvisorID: FormItem = {
        type: FormItemType.list,
        label: 'Investment Advisor',
        required: false,
        disabled: true,
        listAllowMultiple: true,
        listItems: PC.fundItems.investmentAdvisorItems,
    };
    payingAgentID: FormItem = {
        type: FormItemType.list,
        label: 'Paying Agent',
        required: false,
        disabled: true,
        listAllowMultiple: true,
        listItems: PC.fundItems.payingAgentItems,
    };
}

export class ShareUmbrellaFundOptionnal extends DynamicFormsValidator {
    giin: FormItem = {
        type: FormItemType.text,
        label: 'Global Intermediary Identification Number (GIIN)',
        required: false,
        disabled: true,
    };
    delegatedManagementCompanyID: FormItem = {
        type: FormItemType.list,
        label: 'Delegated Management Company',
        required: false,
        disabled: true,
    };
    auditorID: FormItem = {
        type: FormItemType.list,
        label: 'Auditor',
        required: false,
        disabled: true,
        listItems: PC.fundItems.auditorItems,
    };
    taxAuditorID: FormItem = {
        type: FormItemType.list,
        label: 'Tax Auditor',
        required: false,
        disabled: true,
        listItems: PC.fundItems.taxAuditorItems,
    };
    principlePromoterID: FormItem = {
        type: FormItemType.list,
        label: 'Principal Promoter',
        required: false,
        disabled: true,
        listAllowMultiple: true,
        listItems: PC.fundItems.principalPromoterItems,
    };
    legalAdvisorID: FormItem = {
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
    internalReference: FormItem = {
        type: FormItemType.text,
        label: 'Internal Reference',
        required: false,
        disabled: true,
    };
    additionnalNotes: FormItem = {
        type: FormItemType.text,
        label: 'Additional Notes',
        required: false,
        disabled: true,
    };
}
