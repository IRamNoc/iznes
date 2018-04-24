import {FormItem, FormItemType, FormItemStyle, DynamicFormsValidator} from '@setl/utils';
import * as PC from '../../productConfig';

export class ShareUmbrellaFund extends DynamicFormsValidator {
    umbrellaFundName: FormItem = {
        type: FormItemType.text,
        label: 'umbrellaFundName',
        required: false,
        disabled: true
    }
    registerOffice: FormItem = {
        type: FormItemType.text,
        label: 'registerOffice',
        required: false,
        disabled: true
    }
    registerOfficeAddress: FormItem = {
        type: FormItemType.text,
        label: 'registerOfficeAddress',
        required: false,
        disabled: true
    }
    legalEntityIdentifier: FormItem = {
        type: FormItemType.text,
        label: 'legalEntityIdentifier',
        required: false,
        disabled: true
    }
    domicile: FormItem = {
        type: FormItemType.list,
        label: 'domicile',
        required: false,
        disabled: true,
        listItems: PC.fundItems.domicileItems
    }
    umbrellaFundCreationDate: FormItem = {
        type: FormItemType.text,
        label: 'umbrellaFundCreationDate',
        required: false,
        disabled: true
    }
    managementCompanyID: FormItem = {
        type: FormItemType.list,
        label: 'managementCompanyID',
        required: false,
        disabled: true
    }
    fundAdministratorID: FormItem = {
        type: FormItemType.list,
        label: 'fundAdministratorID',
        required: false,
        disabled: true,
        listItems: PC.fundItems.fundAdministratorItems
    }
    custodianBankID: FormItem = {
        type: FormItemType.list,
        label: 'custodianBankID',
        required: false,
        disabled: true,
        listItems: PC.fundItems.custodianBankItems
    }
    investmentManagerID: FormItem = {
        type: FormItemType.list,
        label: 'investmentManagerID',
        required: false,
        disabled: true,
        listItems: PC.fundItems.investmentManagerItems
    }
    investmentAdvisorID: FormItem = {
        type: FormItemType.list,
        label: 'investmentAdvisorID',
        required: false,
        disabled: true,
        listItems: PC.fundItems.investmentAdvisorItems
    }
    payingAgentID: FormItem = {
        type: FormItemType.list,
        label: 'payingAgentID',
        required: false,
        disabled: true,
        listItems: PC.fundItems.payingAgentItems
    }
}