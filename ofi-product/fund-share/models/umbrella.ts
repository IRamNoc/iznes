import {FormItem, FormItemType, FormItemStyle, DynamicFormsValidator} from '@setl/utils';
import * as PC from '../../productConfig';

export class ShareUmbrellaFund extends DynamicFormsValidator {
    umbrellaFundName: FormItem = {
        type: FormItemType.text,
        label: 'Umbrella Fund Name',
        required: false,
        disabled: true
    }
    registerOffice: FormItem = {
        type: FormItemType.text,
        label: 'Name of the Registred Office of the Umbrella Fund',
        required: false,
        disabled: true
    }
    registerOfficeAddress: FormItem = {
        type: FormItemType.text,
        label: 'Address of the Registred Office of the Umbrella Fund',
        required: false,
        disabled: true
    }
    legalEntityIdentifier: FormItem = {
        type: FormItemType.text,
        label: 'Legal Entity Identifier (LEI)',
        required: false,
        disabled: true
    }
    domicile: FormItem = {
        type: FormItemType.list,
        label: 'Umbrella Fund Domicile (Country)',
        required: false,
        disabled: true,
        listItems: PC.fundItems.domicileItems
    }
    umbrellaFundCreationDate: FormItem = {
        type: FormItemType.text,
        label: 'Umbrella Fund Creation Date',
        required: false,
        disabled: true
    }
    managementCompanyID: FormItem = {
        type: FormItemType.list,
        label: 'Management Company',
        required: false,
        disabled: true
    }
    fundAdministratorID: FormItem = {
        type: FormItemType.list,
        label: 'Fund Administrator',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundAdministratorItems
    }
    custodianBankID: FormItem = {
        type: FormItemType.list,
        label: 'Custodian Bank',
        required: false,
        disabled: true,
        listItems: PC.fundItems.custodianBankItems
    }
    investmentManagerID: FormItem = {
        type: FormItemType.list,
        label: 'Investment Manager',
        required: false,
        disabled: true,
        listItems: PC.fundItems.investmentManagerItems
    }
    investmentAdvisorID: FormItem = {
        type: FormItemType.list,
        label: 'Investment Advisor',
        required: false,
        disabled: true,
        listItems: PC.fundItems.investmentAdvisorItems
    }
    payingAgentID: FormItem = {
        type: FormItemType.list,
        label: 'Paying Agent',
        required: false,
        disabled: true,
        listItems: PC.fundItems.payingAgentItems
    }
}