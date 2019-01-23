import { FormItem, FormItemType } from '@setl/utils';
import * as E from '../FundShareEnum';

export class ShareRepresentationOptional {
    hasCountryRepresentative: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Country Representative',
        required: false,
    };
    representativeName: FormItem = {
        type: FormItemType.text,
        label: 'Country Representative Name',
        required: false,
    };
    hasCountryPayingAgent: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Country Paying Agent',
        required: false,
    };
    payingAgentName: FormItem = {
        type: FormItemType.text,
        label: 'Country Paying Agent Name',
        required: false,
    };
    homeCountryRestrictions: FormItem = {
        type: FormItemType.list,
        label: 'Home Country Restrictions',
        required: false,
        listItems: [
            { id: E.HomeCountryRestrictionEnum.No, text: 'No' },
            { id: E.HomeCountryRestrictionEnum.Specialized, text: 'Specialized investment fund (LU)' },
            { id: E.HomeCountryRestrictionEnum.Restricted, text: 'Restricted authorised CIS (SG)' },
            { id: E.HomeCountryRestrictionEnum.Fund, text: 'Fund for qualified investors (CH)' },
        ],
    };
    countryName: FormItem = {
        type: FormItemType.text,
        label: 'Country Name',
        required: false,
    };
    registrationDate: FormItem = {
        type: FormItemType.date,
        label: 'Country Registration Date',
        required: false,
    };
    deregistrationDate: FormItem = {
        type: FormItemType.date,
        label: 'Country Deregistration Date',
        required: false,
    };
    distributionStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Country Distribution Start Date',
        required: false,
    };
    distributionEndDate: FormItem = {
        type: FormItemType.date,
        label: 'Country Distribution End Date',
        required: false,
    };
    legalRegistration: FormItem = {
        type: FormItemType.boolean,
        label: 'Country Legal Registration',
        required: false,
    };
    marketingDistribution: FormItem = {
        type: FormItemType.boolean,
        label: 'Country Marketing Distribution',
        required: false,
    };
    specificRestrictions: FormItem = {
        type: FormItemType.text,
        label: 'Country Specific Restrictions',
        required: false,
    };
}
