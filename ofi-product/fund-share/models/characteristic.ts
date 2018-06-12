import * as _ from 'lodash';
import {FormItem, FormItemType, FormItemStyle, DynamicFormsValidator} from '@setl/utils';
import * as E from '../FundShareEnum';
import { Validators } from '@angular/forms';

export class ShareCharacteristicMandatory extends DynamicFormsValidator {
    maximumNumDecimal: FormItem = {
        type: FormItemType.number,
        label: 'Maximal Number Of Possible Decimals Shares',
        required: true,
        validator: Validators.compose([
            Validators.required,
            Validators.min(0),
            Validators.max(5),
        ]),
        required: true,
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_maxdecshares'
    }
    subscriptionCategory: FormItem = {
        type: FormItemType.list,
        label: 'Subscription Category',
        required: true,
        listItems: [
            { id: E.SubscriptionCategoryEnum.Shares, text: 'Shares' },
            { id: E.SubscriptionCategoryEnum.Amount, text: 'Amount' },
            { id: E.SubscriptionCategoryEnum.Both, text: 'Shares and Amount' }
        ],
        style: [FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_subcat'
    }
    subscriptionCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Currency of Subscription',
        required: true,
        listItems: [
            { id: E.CurrencyEnum.EUR, text: 'EUR' },
            { id: E.CurrencyEnum.USD, text: 'USD' },
            { id: E.CurrencyEnum.GBP, text: 'GBP' }
        ],
        style: [FormItemStyle.BreakOnAfter],
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        mltag: 'txt_fundshare_subcurrency'
    }
    minInitialSubscriptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Subscription In Shares',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Shares, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        mltag: 'txt_fundshare_minsubinshare',
        isBlockchainValue: true
    }
    minInitialSubscriptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Subscription In Amount',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        mltag: 'txt_fundshare_minsubinamount',
        isBlockchainValue: true
    }
    minSubsequentSubscriptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Subscription In Shares',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Shares, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        mltag: 'txt_fundshare_minsubsubinshare',
        isBlockchainValue: true
    }
    minSubsequentSubscriptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Subscription In Amount',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        mltag: 'txt_fundshare_minsubsubinamount',
        isBlockchainValue: true
    }
    redemptionCategory: FormItem = {
        type: FormItemType.list,
        label: 'Redemption Category',
        required: true,
        listItems: [
            { id: E.SubscriptionCategoryEnum.Shares, text: 'Shares' },
            { id: E.SubscriptionCategoryEnum.Amount, text: 'Amount' },
            { id: E.SubscriptionCategoryEnum.Both, text: 'Shares and Amount' }
        ],
        style: [FormItemStyle.BreakOnBefore, FormItemStyle.BreakOnAfter],
        mltag: 'txt_fundshare_redcat'
    }
    redemptionCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Currency of Redemption',
        required: true,
        listItems: [
            { id: E.CurrencyEnum.EUR, text: 'EUR' },
            { id: E.CurrencyEnum.GBP, text: 'GBP' },
            { id: E.CurrencyEnum.USD, text: 'USD' }
        ],
        style: [FormItemStyle.BreakOnBefore, FormItemStyle.BreakOnAfter],
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        mltag: 'txt_fundshare_redcurrency'
    }
    minSubsequentRedemptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Redemption In Shares',
        required: true,
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Shares, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        mltag: 'txt_fundshare_minsubredinshare',
        isBlockchainValue: true
    }
    minSubsequentRedemptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Redemption In Amount',
        required: true,
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        mltag: 'txt_fundshare_minsubredinamount',
        isBlockchainValue: true
    }
}
