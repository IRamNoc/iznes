import {FormItem, FormItemType, FormItemStyle, DynamicFormsValidator} from '@setl/utils';
import * as PC from '../../productConfig';

export class ShareUmbrellaFund extends DynamicFormsValidator {
    umbrellaFundName: FormItem = {
        type: FormItemType.text,
        label: 'Umbrella Fund Name',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_umb_name'
    }
    registerOffice: FormItem = {
        type: FormItemType.text,
        label: 'Name of the Registred Office of the Umbrella Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_umb_regoffice'
    }
    registerOfficeAddress: FormItem = {
        type: FormItemType.text,
        label: 'Address of the Registred Office of the Umbrella Fund',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_umb_regofficeaddr'
    }
    legalEntityIdentifier: FormItem = {
        type: FormItemType.text,
        label: 'Legal Entity Identifier (LEI)',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_umb_lei'
    }
    domicile: FormItem = {
        type: FormItemType.list,
        label: 'Umbrella Fund Domicile (Country)',
        required: false,
        disabled: true,
        listItems: PC.fundItems.domicileItems,
        mltag: 'txt_fundshare_umb_domicile'
    }
    umbrellaFundCreationDate: FormItem = {
        type: FormItemType.text,
        label: 'Umbrella Fund Creation Date',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_umb_fundcreatedate'
    }
    managementCompanyID: FormItem = {
        type: FormItemType.list,
        label: 'Management Company',
        required: false,
        disabled: true,
        mltag: 'txt_fundshare_umb_managecoid'
    }
    fundAdministratorID: FormItem = {
        type: FormItemType.list,
        label: 'Fund Administrator',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundAdministratorItems,
        mltag: 'txt_fundshare_fundadminid'
    }
    custodianBankID: FormItem = {
        type: FormItemType.list,
        label: 'Custodian Bank',
        required: false,
        disabled: true,
        listItems: PC.fundItems.custodianBankItems,
        mltag: 'txt_fundshare_custodianbankid'
    }
    investmentAdvisorID: FormItem = {
        type: FormItemType.list,
        label: 'Investment Advisor',
        required: false,
        disabled: true,
        listItems: PC.fundItems.investmentAdvisorItems,
        mltag: 'txt_fundshare_investadvisorid'
    }
    payingAgentID: FormItem = {
        type: FormItemType.list,
        label: 'Paying Agent',
        required: false,
        disabled: true,
        listItems: PC.fundItems.payingAgentItems,
        mltag: 'txt_fundshare_payingagentid'
    }
}