import { List, Set } from 'immutable';
import { immutableHelper, NumberConverterService } from '@setl/utils';
import * as _ from 'lodash';
import * as math from 'mathjs';

export const enum ActionDirection {
    SUBSCRIPTION = 1,
    REDEMPTION,
}

export interface TradeDetail {
    [transactionId: number]: {
        direction: ActionDirection;
        price: number;
        quantity: number;
        pnl: number;
        relatedSubscription: Array<number>
    };
}

export class PnlHelper {
    currentPrice: number;
    fifoDeque: List<any>;
    tradeList: TradeDetail;
    numberConverter: NumberConverterService;
    lastMovement: string;

    get realisePnl() {
        return immutableHelper.reduce(
            this.tradeList,
            (result, item) => {
                if (item.get('direction') === ActionDirection.REDEMPTION) {
                    const thisPnl = item.get('pnl', 0);
                    return result + thisPnl;
                }
                return result;
            },
            0,
        );
    }

    get unRealisePnl() {
        return this.fifoDeque.reduce(
            (result, item) => {
                const thisRemaining = _.get(item, 'remainingQuantity', 0);
                const thisPnl = math.format(math.chain((this.currentPrice - _.get(item, 'price', 0))).multiply(thisRemaining), 14);
                return result + thisPnl;
            },
            0,
        );
    }

    get totalPnl() {
        return this.realisePnl + this.unRealisePnl;
    }

    get activeBalance() {
        return immutableHelper.reduce(
            this.fifoDeque,
            (total, item) => {
                const itemRemaining = _.get(item, 'remainingQuantity', 0);
                if (itemRemaining === 0) {
                    throw new Error('Something gone wrong, when calculating active-balance in Pnl helper.');
                }
                return total + itemRemaining;
            },
            0,
        );
    }

    constructor(currentPrice, numberConverter: NumberConverterService) {
        this.currentPrice = currentPrice;
        this.numberConverter = numberConverter;

        this.fifoDeque = List();
        this.tradeList = {};
    }

    execute(tx) {
        const transactionId = tx.transactionId;
        const direction = tx.transactionType;
        const price = this.numberConverter.toFrontEnd(tx.transactionPrice);

        const quantity = this.numberConverter.toFrontEnd(tx.transactionUnits);
        if (direction === ActionDirection.SUBSCRIPTION) {
            this.executeSubscription(direction, quantity, price, transactionId);
        } else if (direction === ActionDirection.REDEMPTION) {
            this.executeRedemption(direction, quantity, price, transactionId);
        }
        this.lastMovement = tx.transactionDate;
    }

    executeSubscription(direction, quantity: number, price: number, transactionId: number) {
        this.tradeList[transactionId] = {
            direction,
            price,
            quantity,
            pnl: 0,
            relatedSubscription: [],
        };

        this.fifoDeque = this.fifoDeque.push({
            price,
            quantity,
            transactionId,
            remainingQuantity: quantity,
        });
    }

    executeRedemption(direction, quantity: number, price: number, transactionId: number) {
        let pnl = 0;
        let remainingRedemptionQuantity = quantity;
        let relatedSubscriptionSet = Set();

        while (remainingRedemptionQuantity > 0) {
            // Take the first one in the stack.
            const counterTx = this.fifoDeque.first();
            const counterTxQuantity = counterTx.remainingQuantity;
            const counterTxPrice = _.get(counterTx, 'price', 0);
            const counterTxTransactionId = _.get(counterTx, 'transactionId', 0);

            if (counterTxPrice === 0) {
                throw new Error('Price can not be 0, something is gone wrong in pnl helper');
            }
            if (counterTxTransactionId === 0) {
                throw new Error('Transaction ID can not be 0, something is gone wrong in pnl helper');
            }

            // update the redemption remaining quantity
            const newRemainingRedemptionQuantity = remainingRedemptionQuantity - counterTxQuantity;

            if (newRemainingRedemptionQuantity < 0) {
                // If there is remaining quantity in the counterTx, put it back in the fifoDeque.
                counterTx.remainingQuantity = Math.abs(newRemainingRedemptionQuantity);
                this.fifoDeque.unshift(counterTx);
            }

            // update pnl
            // if countertx(subscription) quantity is greater than remainRedemption quantity,
            // the usedSubscriptionUnit should be same as the remaining Redemption quantity,
            // otherwise the counterTxQuantity should be used.
            const usedSubscriptionUnit = newRemainingRedemptionQuantity < 0 ? remainingRedemptionQuantity : counterTxQuantity;

            const costOnSubscription = math.format(math.chain(usedSubscriptionUnit).multiply(counterTxPrice).done(), 14);
            const receivedOnRedemption = math.format(math.chain(remainingRedemptionQuantity).multiply(price).done(), 14);

            relatedSubscriptionSet = relatedSubscriptionSet.add(counterTxTransactionId);
            pnl += (receivedOnRedemption - costOnSubscription);

            // update new remaining quantity
            remainingRedemptionQuantity = newRemainingRedemptionQuantity;
        }

        this.tradeList[transactionId] = {
            direction,
            price,
            quantity,
            pnl,
            relatedSubscription: relatedSubscriptionSet.toJS(),
        };
    }
}
