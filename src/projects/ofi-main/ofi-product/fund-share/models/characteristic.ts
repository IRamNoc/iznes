import * as _ from 'lodash';
import { FormItem, FormItemType, FormItemStyle, DynamicFormsValidator } from '@setl/utils';
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
        style: [FormItemStyle.BreakOnAfter],
    };
    subscriptionCategory: FormItem = {
        type: FormItemType.list,
        label: 'Subscription Category',
        required: true,
        listItems: [
            { id: E.SubscriptionCategoryEnum.Shares, text: 'Shares' },
            { id: E.SubscriptionCategoryEnum.Amount, text: 'Amount' },
            { id: E.SubscriptionCategoryEnum.Both, text: 'Shares and Amount' },
        ],
        style: [FormItemStyle.BreakOnAfter],
    };
    subscriptionCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Currency of Subscription',
        required: true,
        listItems: [],
        style: [FormItemStyle.BreakOnAfter],
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || (val.length == 0) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
    };
    minInitialSubscriptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Subscription In Shares',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || (val.length == 0) || [E.SubscriptionCategoryEnum.Shares, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        isBlockchainValue: true,
    };
    minInitialSubscriptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Initial Subscription In Amount',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || (val.length == 0) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        isBlockchainValue: true,
    };
    minSubsequentSubscriptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Subscription In Shares',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || (val.length == 0) || [E.SubscriptionCategoryEnum.Shares, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        isBlockchainValue: true,
    };
    minSubsequentSubscriptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Subscription In Amount',
        required: true,
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || (val.length == 0) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        isBlockchainValue: true,
    };
    redemptionCategory: FormItem = {
        type: FormItemType.list,
        label: 'Redemption Category',
        required: true,
        listItems: [
            { id: E.SubscriptionCategoryEnum.Shares, text: 'Shares' },
            { id: E.SubscriptionCategoryEnum.Amount, text: 'Amount' },
            { id: E.SubscriptionCategoryEnum.Both, text: 'Shares and Amount' },
        ],
        style: [FormItemStyle.BreakOnBefore, FormItemStyle.BreakOnAfter],
    };
    redemptionCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Currency of Redemption',
        required: true,
        listItems: [],
        style: [FormItemStyle.BreakOnBefore, FormItemStyle.BreakOnAfter],
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || (val.length == 0) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
    };
    minSubsequentRedemptionInShare: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Redemption In Shares',
        required: true,
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || (val.length == 0) || [E.SubscriptionCategoryEnum.Shares, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        isBlockchainValue: true,
    };
    minSubsequentRedemptionInAmount: FormItem = {
        type: FormItemType.number,
        label: 'Minimal Subsequent Redemption In Amount',
        required: true,
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || (val.length == 0) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        isBlockchainValue: true,
    };
}
