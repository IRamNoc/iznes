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
    subscriptionText = {
        title: 'Subscriptions',
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
        style: [FormItemStyle.BreakOnBefore],
    };
    subscriptionQuantityRoundingRule: FormItem = {
        type: FormItemType.list,
        label: 'Subscription Quantity Rounding Rule',
        required: true,
        listItems: [
            { id: E.SubscriptionRoundingRuleEnum.Commercial, text: 'Commercial' },
            { id: E.SubscriptionRoundingRuleEnum.Lower, text: 'Lower' },
        ],
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || (val.length == 0) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
        style: [FormItemStyle.BreakOnAfter],
    };
    subscriptionCurrency: FormItem = {
        type: FormItemType.list,
        label: 'Currency of Subscription',
        required: true,
        listItems: [],
        style: [FormItemStyle.BreakOnBefore],
        hidden: () => {
            const val = (this.subscriptionCategory.value() as any);
            return (val == undefined) || (val.length == 0) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
    };
    subscriptionReimbursement: FormItem = {
        type: FormItemType.radio,
        label: 'Reimbursement of the odd lots',
        required: true,
        radioOptions: [
            {key: 'Yes',  value: 'Yes'},
            {key: 'No',  value: 'No'}
          ],
        style: [FormItemStyle.BreakOnAfter],
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
    redemptionText = {
        title: 'Redemptions',
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
        style: [FormItemStyle.BreakOnBefore],
    };
    redemptionQuantityRoundingRule: FormItem = {
        type: FormItemType.list,
        label: 'Redemption Quantity Rounding Rule',
        required: true,
        listItems: [
            { id: E.SubscriptionRoundingRuleEnum.Commercial, text: 'Commercial' },
            { id: E.SubscriptionRoundingRuleEnum.Lower, text: 'Lower' },
        ],
        style: [FormItemStyle.BreakOnAfter],
        hidden: () => {
            const val = (this.redemptionCategory.value() as any);
            return (val == undefined) || (val.length == 0) || [E.SubscriptionCategoryEnum.Amount, E.SubscriptionCategoryEnum.Both].indexOf(val[0].id) == -1;
        },
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
