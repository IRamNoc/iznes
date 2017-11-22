import {List, Set} from 'immutable';
import {immutableHelper, NumberConverterService} from '@setl/utils';
import _ from 'lodash';

export const enum ActionDirection {
    SUBSCRIPTION = 1,
    REDEMPTION
}

export interface TradeDetail {
    [transactionId: number]: {

        direction: ActionDirection;
        price: number;
        quantity: number;
        granularTxs: Array<any>;
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
        return immutableHelper.reduce(this.tradeList, (result, item) => {
            if (item.get('direction') === ActionDirection.REDEMPTION) {
                const thisPnl = item.get('pnl', 0);
                return result + thisPnl;
            }
            return result;
        }, 0);
    }

    get unRealisePnl() {

        return this.fifoDeque.reduce((result, item) => {
            const thisPnl = this.currentPrice - _.get(item, 'price', 0);
            return result + thisPnl;
        }, 0);
    }

    get totalPnl() {
        return this.realisePnl + this.unRealisePnl;
    }

    get activeBalance() {
        return this.fifoDeque.size;
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
        // todo
        // force support 2 decimal place for now
        const quantity = this.numberConverter.toFrontEnd(tx.transactionUnits) * 100;
        if (direction === ActionDirection.SUBSCRIPTION) {
            this.executeSubscription(direction, quantity, price, transactionId);
        } else if (direction === ActionDirection.REDEMPTION) {
            this.executeRedemptioin(direction, quantity, price, transactionId);
        }
        this.lastMovement = tx.transactionDate;
    }

    executeSubscription(direction, quantity: number, price: number, transactionId: number) {

        const granularTxs = this.getTradeGranular(quantity, price, transactionId);
        this.tradeList[transactionId] = {
            direction,
            price,
            quantity,
            granularTxs,
            pnl: 0,
            relatedSubscription: []
        };

        let i = 0;
        for (i; i < granularTxs.length; i++) {
            this.fifoDeque = this.fifoDeque.push(granularTxs[i]);
        }
    }

    executeRedemptioin(direction, quantity: number, price: number, transactionId: number) {

        const granularTxs = this.getTradeGranular(quantity, price, transactionId);
        let pnl = 0;
        let relatedSubscriptionSet = Set();

        let i = 0;
        for (i; i < granularTxs.length; i++) {
            const counterGranularTx = this.fifoDeque.first();
            this.fifoDeque = this.fifoDeque.shift();

            const counterPrice = _.get(counterGranularTx, 'price', 0);
            const counterTransactionId = _.get(counterGranularTx, 'transactionId', 0);
            if (counterPrice === 0) {
                throw new Error('Price can not be 0, something is gone wrong in pnl helper');
            }
            if (counterTransactionId === 0) {
                throw new Error('Transaction ID can not be 0, something is gone wrong in pnl helper');
            }
            relatedSubscriptionSet = relatedSubscriptionSet.add(counterTransactionId);
            pnl += (price - counterPrice);
        }

        this.tradeList[transactionId] = {
            direction,
            price,
            quantity,
            granularTxs,
            pnl,
            relatedSubscription: relatedSubscriptionSet.toJS()
        };
    }

    getTradeGranular(quantity, price, transactionId) {
        let thisQuantity = quantity;
        const granularTxs = [];

        let i = 0;
        for (i; thisQuantity > 0; i++, thisQuantity--) {
            granularTxs.push({
                price,
                transactionId
            });
        }

        return granularTxs;
    }
}
