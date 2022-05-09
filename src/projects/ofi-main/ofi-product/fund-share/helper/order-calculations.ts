import { OrderType, OrderByType, FeeInFavourOfFundCalculation } from '../../../ofi-orders/order.model';
import { fixToDecimal, lowerRoundedQuantity as lowerRoundedFct } from '@setl/utils/helper/common/math-helper'; //notcompile
//import { fixToDecimal, lowerRoundedQuantity as lowerRoundedFct } from '../../../../utils/helper/common/math-helper'; //compile
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
        managementFeeType: number,
        managementFeePercentage: number;
    },
    maxDecimalisation: number,
    knownNav: boolean,
    lowerRoundedQuantity: boolean = false,
): OrderFigures => {
    let amount;
    let quantity;
    let estimatedQuantity;
    let estimatedAmount;
    let fee;
    let managementFeeCalc;
    let estimatedAmountWithCost;
    let amountWithCost;
    const validatedPrice = knownNav ? order.nav : 0;

    switch (order.orderBy) {
    case OrderByType.Quantity:

        quantity = order.value;
        estimatedQuantity = quantity;

        if (getNumberDecimalPlace(quantity / NumberMultiplier) > maxDecimalisation) {
            throw new Error(`maximum number of decimal place is ${maxDecimalisation}`);
        }

        /**
         * amount = unit * nav
         */
        amount = 0;
        estimatedAmount = fixToDecimal(quantity * order.nav / NumberMultiplier, BlockchainNumberDecimal, 'floor');

        // change to 2 decimal place
        estimatedAmount = getAmountTwoDecimal(estimatedAmount);

        // calculate fee
        fee = calFee(estimatedAmount, order.feePercentage);

        // calculate management fee
        managementFeeCalc = calManagementFee(estimatedAmount, order.managementFeePercentage, estimatedQuantity, order.managementFeeType, order.nav);

        // net amount change to 2 decimal place
        fee = getAmountTwoDecimal(fee + managementFeeCalc);

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
        estimatedQuantity = lowerRoundedQuantity ? lowerRoundedFct(estimatedQuantity / NumberMultiplier, maxDecimalisation) : toNormalScale(estimatedQuantity, maxDecimalisation);
        estimatedQuantity = convertToBlockChainNumber(estimatedQuantity);
        // make sure the quantity meet the share maximumNumberDecimal
        // 1. convert back to normal number scale. cap at fund maxNumDecimal
        // 2. convert back to blockchain number

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

        // calculate management fee
        managementFeeCalc = calManagementFee(estimatedAmount, order.managementFeePercentage, estimatedQuantity, order.managementFeeType, order.nav);

        // change to 2 decimal place
        fee = getAmountTwoDecimal(fee + managementFeeCalc);

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
 * Calculate order management fee.
 *
 * @param amount
 * @param feePercent
 * @return {number}
 */
 export function calManagementFee(amount: number | string, feePercent: number | string, quantity: number | string, type: number, nav: number | string): number {
    amount = Number(amount);
    quantity = Number(quantity);
    nav = Number(nav);
    feePercent = Number(feePercent) / NumberMultiplier;

    if (type === FeeInFavourOfFundCalculation.Unitary) {
        return fixToDecimal(quantity * (nav * (feePercent / 100)), BlockchainNumberDecimal, 'floor');
    }

    if (type === FeeInFavourOfFundCalculation.Global) {
        return fixToDecimal(amount * (feePercent / 100), BlockchainNumberDecimal, 'floor');
    }

    return 0;
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

/**
 * @param {number} num
 * @return {number}
 */
export function getNumberDecimalPlace(num: number) {
    // trim any zero value at the end.
    const floatNum = parseFloat(num.toString());
    const floorNum = Math.floor(floatNum);
    if (floorNum === floatNum) return 0;
    return floatNum.toString().split('.')[1].length || 0;
}
