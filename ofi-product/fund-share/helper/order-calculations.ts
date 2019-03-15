import { OrderType, OrderByType } from '../../../ofi-orders/order.model';
import { fixToDecimal } from '@setl/utils/helper/common/math-helper'; //notcompile
// import { fixToDecimal } from '../../../../utils/helper/common/math-helper'; //compile
import { BlockchainNumberDecimal, NormalNumberDecimal, NumberMultiplier, ExpirySecond } from './config';
import { OrderFigures } from './models';

const orderTypeToString = {
    3: 's',
    4: 'r',
};

export const calculateFigures = (
    order: {
        orderBy: OrderByType,
        orderType: OrderType,
        value: number,
        nav: number,
        feePercentage: number,
    },
    maxDecimalisation: number,
    knownNav: boolean,
): OrderFigures => {
    let amount;
    let quantity;
    let estimatedQuantity;
    let estimatedAmount;
    let fee;
    let estimatedAmountWithCost;
    let amountWithCost;
    const validatedPrice = knownNav ? order.nav : 0;

    switch (order.orderBy) {
    case OrderByType.Quantity:
        quantity = order.value;
        estimatedQuantity = quantity;

        /**
         * amount = unit * nav
         */
        amount = 0;
        estimatedAmount = fixToDecimal(quantity * order.nav / NumberMultiplier, BlockchainNumberDecimal, 'floor');

        // change to 2 decimal place
        estimatedAmount = getAmountTwoDecimal(estimatedAmount);

        // calculate fee
        fee = calFee(estimatedAmount, order.feePercentage);

        // net amount change to 2 decimal place
        fee = getAmountTwoDecimal(fee);

        // net amount
        estimatedAmountWithCost = calNetAmount(estimatedAmount, fee, orderTypeToString[order.orderType]);

        amountWithCost = 0;

        break;

    case OrderByType.Amount:
        /**
         * quantity = amount / nav
         */

        // if redemption amount will always be estimated.
        estimatedQuantity = fixToDecimal(
            ((order.value / order.nav) * NumberMultiplier),
            BlockchainNumberDecimal,
            'floor',
        );

        // make sure the quantity meet the share maximumNumberDecimal
        // 1. convert back to normal number scale. cap at fund maxNumDecimal
        // 2. convert back to blockchain number
        estimatedQuantity = toNormalScale(estimatedQuantity, maxDecimalisation);
        estimatedQuantity = convertToBlockChainNumber(estimatedQuantity);

        quantity = 0;

        // if we are using known nav, we use the quantity to work out the new amount
        // if we are using unknow nav, we put the specified amount back.
        estimatedAmount = order.value;
        amount = order.value;
        if (knownNav) {
            estimatedAmount = fixToDecimal(
                (estimatedQuantity * order.nav / NumberMultiplier),
                BlockchainNumberDecimal,
                'floor',
            );

            // change to 2 decimal place
            estimatedAmount = getAmountTwoDecimal(estimatedAmount);
            
            amount = estimatedAmount;
        }

        // calculate fee
        fee = calFee(estimatedAmount, order.feePercentage);

        // change to 2 decimal place
        fee = getAmountTwoDecimal(fee);

        // net amount
        estimatedAmountWithCost = calNetAmount(estimatedAmount, fee, orderTypeToString[order.orderType]);

        amountWithCost = calNetAmount(estimatedAmount, fee, orderTypeToString[order.orderType]);

        break;

    default:
        throw new Error('Invalid orderBy type');
    }

    return {
        quantity,
        estimatedQuantity,
        amount,
        estimatedAmount,
        amountWithCost,
        estimatedAmountWithCost,
        knownNav,
        validatedPrice,
    };
};

/**
 * Calculate order fee.
 *
 * @param amount
 * @param feePercent
 * @return {number}
 */
export function calFee(amount: number | string, feePercent: number | string): number {
    amount = Number(amount);
    feePercent = Number(feePercent) / NumberMultiplier;
    return fixToDecimal((amount * (feePercent)), BlockchainNumberDecimal, 'floor');
}



/**
 * Calculate order net amount.
 *
 * @param {number | string} amount
 * @param {number | string} fee
 * @param {string} orderType
 * @return {number}
 */
export function calNetAmount(amount: number | string, fee: number | string, orderType: string): number {
    amount = Number(amount);
    fee = Number(fee);
    return {
        s: fixToDecimal((amount + fee), BlockchainNumberDecimal, 'floor'),
        r: fixToDecimal((amount - fee), BlockchainNumberDecimal, 'floor'),
    }[orderType];
}

/**
 *  padding number from left.
 *
 * @param num
 * @param width
 * @param fill
 * @return {string}
 */
export function pad(num: number, width: number, fill: string): string {
    const numberStr = num.toString();
    const len = numberStr.length;
    return len >= width ? numberStr : new Array(width - len + 1).join(fill) + numberStr;
}

export function toNormalScale(num: number, numDecimal: number): number {
    return fixToDecimal((num / NumberMultiplier), numDecimal, 'normal');
}
export function convertToBlockChainNumber(num) {
    return fixToDecimal((num * NumberMultiplier), BlockchainNumberDecimal, 'floor');
}

/**
 * Get 8 byptes random string
 * @return {string}
 */
export function getRandom8Hex(): string {
    try {
        const crypto = require('crypto');
        return crypto['randomBytes'](8).toString('hex') + getUnixTsInSec();
    }catch (e) {
        // otherwise we are working with browser
        const arr = new Uint32Array(2);
        return window.crypto.getRandomValues(arr)[0].toString(16) + window.crypto.getRandomValues(arr)[0].toString(16) + getUnixTsInSec();
    }

}

export function getUnixTsInSec(): number {
    return Math.floor(((new Date()).valueOf() / 1000));
}

/**
 * Get Amount to Two Decimal Places and converts to blockchain number
 *
 * @param amount
 * @returns {number}
 */
export function getAmountTwoDecimal(amount) {
    amount = Math.round((amount / NumberMultiplier) * 100) / 100;
    return (amount * NumberMultiplier);
}
