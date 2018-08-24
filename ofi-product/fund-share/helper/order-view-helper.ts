import {multiply, toNormalScale, plus} from './cal-helper';
import * as math from 'mathjs';
import * as _ from 'lodash';
import { OrderType } from "../../../ofi-orders/order.model";

export interface OrderFiguresModel {
    byAmountOrQuantity: number;
    price: number;
    estimatedPrice: number;
    quantity: number;
    estimatedQuantity: number;
    amount: number;
    estimatedAmount: number;
    amountWithCost: number;
    estimatedAmountWithCost: number;
    feePercentage: number;
    platFormFee: number;
    orderStatus: number;
}

export enum OrderStatus {
    Settled = -1,
    Canceled = 0,
    Initiated = 1,
    WaitingNAV = 2,
    WaitingSettlement = 3,
    Unpaid = 4
}

export interface FigureResponse {
    quantity: number;
    amount: number;
    amountWithCost;
    fee: number;
    price: number;
    feePercentage: number;
    platFormFee: number;
}

const ShareUnitDecimal = 5;
const MoneyUnitDecimal = 4;

/**
 * Helpe to get the appropriate numbers to render depend on the order status.
 */

export function getOrderFigures(order: OrderFiguresModel): FigureResponse {
    let quantity = 0, amount = 0, amountWithCost = 0, fee = 0, price, feePercentage, platFormFee;

    const feePercentRaw = Number(_.get(order, 'feePercentage', 0));
    const priceRaw = Number(_.get(order, 'price', 0));
    const estimatedPriceRaw = Number(_.get(order, 'latestNav', 0));
    const quantityRaw = Number(_.get(order, 'quantity', 0));
    const estimatedQuantityRaw = Number(_.get(order, 'estimatedQuantity', 0));
    const amountRaw = Number(_.get(order, 'amount', 0));
    const estimatedAmountRaw = Number(_.get(order, 'estimatedAmount', 0));
    const amountWithCostRaw = Number(_.get(order, 'amountWithCost', 0));
    const estimatedAmountWithCostRaw = Number(_.get(order, 'estimatedAmountWithCost', 0));
    const platFormFeeRaw = Number(_.get(order, 'platformFee', 0));
    const orderStatus = Number(_.get(order, 'orderStatus', 1));

    if (orderStatus === Number(OrderStatus.Initiated) || orderStatus === Number(OrderStatus.WaitingNAV)) {
        quantity = Number(toNormalScale(estimatedQuantityRaw, ShareUnitDecimal));
        amount = Number(toNormalScale(estimatedAmountRaw, MoneyUnitDecimal));
        amountWithCost = Number(toNormalScale(estimatedAmountWithCostRaw, MoneyUnitDecimal));
        fee = Number(toNormalScale(plus(multiply(estimatedAmountRaw, feePercentRaw), platFormFeeRaw), MoneyUnitDecimal));
        price = Number(toNormalScale(estimatedPriceRaw, MoneyUnitDecimal));
    } else if (orderStatus === Number(OrderStatus.Canceled)) {
        quantity = Number(toNormalScale(getNonZeroValue(quantityRaw, estimatedQuantityRaw), ShareUnitDecimal));
        amount = Number(toNormalScale(getNonZeroValue(amountRaw, estimatedAmountRaw), MoneyUnitDecimal));
        amountWithCost = Number(toNormalScale(getNonZeroValue(amountWithCostRaw, estimatedAmountWithCostRaw), MoneyUnitDecimal));
        fee = Number(toNormalScale(plus(multiply(getNonZeroValue(amountRaw, estimatedAmountRaw), platFormFeeRaw), feePercentRaw), MoneyUnitDecimal));
        price = Number(toNormalScale(getNonZeroValue(priceRaw, estimatedPriceRaw), MoneyUnitDecimal));
    } else {
        quantity = Number(toNormalScale(quantityRaw, ShareUnitDecimal));
        amount = Number(toNormalScale(amountRaw, MoneyUnitDecimal));
        amountWithCost = Number(toNormalScale(amountWithCostRaw, MoneyUnitDecimal));
        fee = Number(toNormalScale(plus(multiply(amountRaw, feePercentRaw), platFormFeeRaw), MoneyUnitDecimal));
        price = Number(toNormalScale(priceRaw, MoneyUnitDecimal));
    }

    feePercentage = Number(toNormalScale(feePercentRaw * 100, 2));
    platFormFee = Number(toNormalScale(platFormFeeRaw, MoneyUnitDecimal));

    return {
        quantity,
        amount,
        amountWithCost,
        fee,
        price,
        feePercentage,
        platFormFee
    };
}

export function getNonZeroValue(val1: number, val2: number, defaultValue: number = 0): number {
    if (val1 !== 0) {
        return val1;
    }

    if (val2 !== 0) {
        return val2;
    }

    return defaultValue;
}

/**
 * Return the string of the order type, base on the order type and sellBuyLinkId (basically, this field should only has
 * value if it is a sell buy order)
 * orderType: 3 and sellBuyLinkId : null => 'Subscription',
 * orderType: 4 and sellBuyLinkId : null => 'Redemption'
 *
 * orderType: 3 and sellBuyLinkId : not Null => 'Sell/Buy - Subscription',
 * orderType: 4 and sellBuyLinkId : not Null => 'Sell/Buy - Redemption'
 *
 * @param {{orderType: number | string; sellBuyLinkOrderID: number | string}} orderData
 * @return {string}
 */
export function getOrderTypeString(orderData: {orderType: number | string; sellBuyLinkOrderID: number | string }): string {
    const orderType = orderData.orderType;
    const sellBuyLinkOrderId = orderData.sellBuyLinkOrderID;

    if (!sellBuyLinkOrderId) {
       if (Number(orderType) === OrderType.Subscription) {
          return 'Subscription';
       }

       if(Number(orderType) === OrderType.Redemption) {
          return 'Redemption';
       }
    } else {
        if (Number(orderType) === OrderType.Subscription) {
            return 'Sell/Buy - Subscription';
        }

        if(Number(orderType) === OrderType.Redemption) {
            return 'Sell/Buy - Redemption';
        }
    }
}

