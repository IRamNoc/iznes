import {FormItem, FormItemType} from '@setl/utils';
import * as E from '../FundShareEnum';

export class ShareRepresentationOptional {
    hasCountryRepresentative: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Country Representative',
        required: false,
        mltag: 'txt_fundshare_hascountryrep'
    }
    representativeName: FormItem = {
        type: FormItemType.text,
        label: 'Country Representative Name',
        required: false,
        mltag: 'txt_fundshare_repname'
    }
    hasCountryPayingAgent: FormItem = {
        type: FormItemType.boolean,
        label: 'Has Country Paying Agent',
        required: false,
        mltag: 'txt_fundshare_hascountrypayingagent'
    }
    payingAgentName: FormItem = {
        type: FormItemType.text,
        label: 'Country Paying Agent Name',
        required: false,
        mltag: 'txt_fundshare_payingagentname'
    }
    homeCountryRestrictions: FormItem = {
        type: FormItemType.list,
        label: 'Home Country Restrictions',
        required: false,
        listItems: [
            { id: E.HomeCountryRestrictionEnum.No, text: 'No' },
            { id: E.HomeCountryRestrictionEnum.Specialized, text: 'Specialized investment fund (LU)' },
            { id: E.HomeCountryRestrictionEnum.Restricted, text: 'Restricted authorised CIS (SG)' },
            { id: E.HomeCountryRestrictionEnum.Fund, text: 'Fund for qualified investors (CH)' }
        ],
        mltag: 'txt_fundshare_homecountryrestrict'
    }
    countryName: FormItem = {
        type: FormItemType.text,
        label: 'Country Name',
        required: false,
        mltag: 'txt_fundshare_countryname'
    }
    registrationDate: FormItem = {
        type: FormItemType.date,
        label: 'Country Registration Date',
        required: false,
        mltag: 'txt_fundshare_regdate'
    }
    deregistrationDate: FormItem = {
        type: FormItemType.date,
        label: 'Country Deregistration Date',
        required: false,
        mltag: 'txt_fundshare_deregdate'
    }
    distributionStartDate: FormItem = {
        type: FormItemType.date,
        label: 'Country Distribution Start Date',
        required: false,
        mltag: 'txt_fundshare_diststartdate'
    }
    distributionEndDate: FormItem = {
        type: FormItemType.date,
        label: 'Country Distribution End Date',
        required: false,
        mltag: 'txt_fundshare_distenddate'
    }
    legalRegistration: FormItem = {
        type: FormItemType.boolean,
        label: 'Country Legal Registration',
        required: false,
        mltag: 'txt_fundshare_legalreg'
    }
    marketingDistribution: FormItem = {
        type: FormItemType.boolean,
        label: 'Country Marketing Distribution',
        required: false,
        mltag: 'txt_fundshare_marketingdist'
    }
    specificRestrictions: FormItem = {
        type: FormItemType.text,
        label: 'Country Specific Restrictions',
        required: false,
        mltag: 'txt_fundshare_specificrestrict'
    }
}