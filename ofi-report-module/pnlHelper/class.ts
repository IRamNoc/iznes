import {Stack} from 'immutable';
import {immutableHelper} from '@setl/utils';
import {count} from "rxjs/operator/count";
import {current} from "codelyzer/util/syntaxKind";

const enum ActionDirection {
    SUBSCRIPTION = 1,
    REDEMPTION
}

interface TradeDetail {
    [transactionId: number]: {

        direction: ActionDirection;
        price: number;
        quantity: number;
        granularTxs: Array<any>;
        pnl: number;
    };
}

export class PnlHelper {
    currentPrice: number;
    fifoStack: Stack<any>;
    tradeList: TradeDetail;

    get realisePnl() {
        return immutableHelper.reduce(this.tradeList, (result, item) => {
            if (item.get('direction') === ActionDirection.REDEMPTION) {
                const thisPnl = item.get('pnl', 0);
                return result + thisPnl;
            }
        }, 0);
    }

    get unRealisePnl() {

        return this.fifoStack.reduce((result, item) => {
            const thisPnl = this.currentPrice - item.get('price', 0);
            return result + thisPnl;
        }, 0);
    }

    constructor(currentPrice) {
        this.currentPrice = currentPrice;
    }

    execute(tx) {
        const transactionId = tx.transactionId;
        const direction = tx.transactionType;
        const price = tx.transactionPrice;
        const quantity = tx.transactionUnits;
        if (direction === ActionDirection.SUBSCRIPTION) {
            this.executeSubscription(direction, quantity, price, transactionId);
        } else if (direction === ActionDirection.REDEMPTION) {
            this.executeRedemptioin(direction, quantity, price, transactionId);
        }
    }

    executeSubscription(direction, quantity: number, price: number, transactionId: number) {

        const granularTxs = this.getTradeGranular(quantity, price);
        this.tradeList[transactionId] = {
            direction,
            price,
            quantity,
            granularTxs,
            pnl: 0
        };

        let i = 0;
        for (i; i < granularTxs.length; i++) {
            this.fifoStack.push(granularTxs[i]);
        }
    }

    executeRedemptioin(direction, quantity: number, price: number, transactionId: number) {

        const granularTxs = this.getTradeGranular(quantity, price);
        let pnl = 0;

        let i = 0;
        for (i; i < granularTxs.length; i++) {
            const counterGranularTx = this.fifoStack.pop();
            const counterPrice = counterGranularTx.get('price', 0);
            pnl += (price - counterPrice);
        }

        this.tradeList[transactionId] = {
            direction,
            price,
            quantity,
            granularTxs,
            pnl
        };
    }

    getTradeGranular(quantity, price) {
        let thisQuantity = immutableHelper.copy(quantity);
        const granularTxs = [];

        let i = 0;
        for (i; thisQuantity > 0; i++, thisQuantity--) {
            granularTxs.push({
                price,
            });
        }

        return granularTxs;
    }
}
