import {FormItem, FormItemType} from '@setl/core-dynamic-forms/DynamicForm';

export class ShareRepresentationOptional {
    hasCountryRepresentative: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Country Representative',
        required: false
    }
    representativeName: FormItem = {
        type: FormItemType.text,
        label: 'Country Representative Name',
        required: false
    }
    hasCountryPayingAgent: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Country Paying Agent',
        required: false
    }
    payingAgentName: FormItem = {
        type: FormItemType.text,
        label: 'Country Paying Agent Name',
        required: false
    }
    homeCountryRestrictions: FormItem = {
        type: FormItemType.list,
        label: 'Home Country Restrictions',
        required: false,
        listItems: [
            { id: 'no', text: 'No' },
            { id: 'specialized-investment-fund', text: 'Specialized investment fund (LU)' },
            { id: 'restricted-authorised-cis', text: 'Restricted authorised CIS (SG)' },
            { id: 'fund-for-qualified-investors', text: 'Fund for qualified investors (CH)' }
        ]
    }
    countryName: FormItem = {
        type: FormItemType.text,
        label: 'Country Name',
        required: false
    }
    registrationDate: FormItem = {
        type: FormItemType.date,
        label: 'Country Registration Date',
        required: false
    }
    deregistrationDate: FormItem = {
        type: FormItemType.date,
        label: 'Country Deregistration Date',
        required: false
    }
    distributionStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Country Distribution Start Date',
        required: false
    }
    distributionEndDate: FormItem = {
        type: FormItemType.date,
        label: 'Country Distribution End Date',
        required: false
    }
    legalRegistration: FormItem = {
        type: FormItemType.boolean,
        label: 'Country Legal Registration',
        required: false
    }
    marketingDistribution: FormItem = {
        type: FormItemType.boolean,
        label: 'Country Marketing Distribution',
        required: false
    }
    specificRestrictions: FormItem = {
        type: FormItemType.text,
        label: 'Country Specific Restrictions',
        required: false
    }
}