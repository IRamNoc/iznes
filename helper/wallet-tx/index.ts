import * as _ from 'lodash';
import * as Model from './model';
import * as moment from '../m-date-wrapper';
import * as common from '../common';

export class WalletTxHelper {
    /**
     * Convert an array of array transactions
     * @param transactions any[]
     * @return {any}
     */
    static convertTransactions(transactions: any[][]) {
        const rtnTransactions: Model.WalletTransaction[] = [];

        _.forEach(transactions, (transaction: any[]) => {
            const txType = Model.TransactionTypes[transaction[2]];

            rtnTransactions.push(WalletTxHelper.convertTransactionArray(txType, transaction));
        });

        return rtnTransactions;
    }

    /**
     * Convert a transaction array to an Object
     * @param txType string
     * @param transaction any[]
     * @return {any}
     */
    static convertTransactionArray(txType: string, transaction: any[]): Model.WalletTransaction {
        let rtnTransaction = WalletTxHelper.createBaseTransaction(transaction);

        switch(txType) {
            case Model.TxRegisterIssuer:
                WalletTxHelper.createRegisterIssuerTransaction(rtnTransaction, transaction);
                break;
            case Model.TxRegisterAsset:
                WalletTxHelper.createRegisterAssetTransaction(rtnTransaction, transaction);
                break;
            case Model.TxIssueAsset:
                WalletTxHelper.createIssueAssetTransaction(rtnTransaction, transaction);
                break;
            case Model.TxRegisterAddress:
                WalletTxHelper.createRegisterAddressTransaction(rtnTransaction, transaction);
                break;
            case Model.TxAssetTransferCX:
                WalletTxHelper.createAssetTransferTransaction(rtnTransaction, transaction);
                break;
            case Model.TxSplit:
                WalletTxHelper.createSplitTransaction(rtnTransaction, transaction);
                break;
            case Model.TxDividend:
                WalletTxHelper.createDividentTransaction(rtnTransaction, transaction);
                break;
            case Model.TxNewContract:
                WalletTxHelper.createNewContractTransaction(rtnTransaction, transaction);
                break;
            case Model.TxCommitContract:
                WalletTxHelper.createCommitContractTransaction(rtnTransaction, transaction);
                break;
            case Model.TxMemo:
                WalletTxHelper.createMemoTransaction(rtnTransaction, transaction);
                break;
            case Model.TxEncumber:
                WalletTxHelper.createEncumberTransaction(rtnTransaction, transaction);
                break;
            case Model.TxUnencumber:
                WalletTxHelper.createEncumberTransaction(rtnTransaction, transaction);
                break;
            case Model.TxVoidingAsset:
                WalletTxHelper.createVoidingAssetTransaction(rtnTransaction, transaction);
                break;
            case Model.TxTransferToMany:
                WalletTxHelper.createVoidingAssetTransaction(rtnTransaction, transaction);
                break;
            default:
                rtnTransaction = null;
                break;
        }

        return rtnTransaction;
    }

    /**
     * Create a base transaction
     * @param transaction
     * @return {any}
     */
    static createBaseTransaction(transaction: any[]): Model.WalletTransaction {
        const rtnTransaction = new Model.WalletTransaction();

        rtnTransaction.baseChain = transaction[0];
        rtnTransaction.fromAddr = transaction[7];
        rtnTransaction.fromPub = transaction[6];
        rtnTransaction.hash = transaction[3];
        rtnTransaction.shortHash = `${transaction[3].substr(0, 5)}...`;
        rtnTransaction.utc = WalletTxHelper.getUTCDateTime(transaction[8]);

        return rtnTransaction;
    }

    /**
     * Create a Register Issuer transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createRegisterIssuerTransaction(transaction: Model.WalletTransaction,
                                           original: any[]): Model.WalletTransaction {
        transaction.txType = 'Register Issuer';

        transaction.height = common.commaSeparateNumber(original[13]);
        transaction.instrument = original[11];
        transaction.issuer = original[10];
        transaction.sig = original[12];

        return transaction;
    }

    /**
     * Create a Register Address transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createRegisterAddressTransaction(transaction: Model.WalletTransaction,
                                            original: any[]): Model.WalletTransaction {
        transaction.txType = 'Register Address';

        transaction.height = common.commaSeparateNumber(original[13]);
        transaction.sig = original[12];

        return transaction;
    }

    /**
     * Create a Stock Split transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createSplitTransaction(transaction: Model.WalletTransaction, original: any[]): Model.WalletTransaction {
        transaction.txType = 'Stock Split';

        transaction.height = common.commaSeparateNumber(original[13]);
        transaction.issuer = original[10];
        transaction.instrument = original[11];
        transaction.sig = original[14];

        return transaction;
    }

    /**
     * Create a Dividend transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createDividentTransaction(transaction: Model.WalletTransaction,
                                     original: any[]): Model.WalletTransaction {
        transaction.txType = 'Stock Split';

        transaction.height = common.commaSeparateNumber(original[13]);
        transaction.instrument = original[11];
        transaction.instrument2 = original[15];
        transaction.issuer = original[10];
        transaction.issuer2 = original[14];
        transaction.ratio = original[16];
        transaction.sig = original[18];
        transaction.sig = original[19];
        transaction.toPub = original[12];
        transaction.toAddr = original[13];

        return transaction;
    }

    /**
     * Create a New Contract transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createNewContractTransaction(transaction: Model.WalletTransaction,
                                        original: any[]): Model.WalletTransaction {
        transaction.txType = 'New Contract';

        transaction.height = common.commaSeparateNumber(original[13]);
        transaction.sig = original[12];
        transaction.toAddr = original[10];

        return transaction;
    }

    /**
     * Create a Commit Contract transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createCommitContractTransaction(transaction: Model.WalletTransaction,
                                           original: any[]): Model.WalletTransaction {
        transaction.txType = 'Contract Commitment';

        transaction.height = common.commaSeparateNumber(original[13]);
        transaction.sig = original[12];
        transaction.toAddr = original[10];

        return transaction;
    }

    /**
     * Create a Issue Asset transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createIssueAssetTransaction(transaction: Model.WalletTransaction,
                                       original: any[]): Model.WalletTransaction {
        transaction.txType = 'Issue Asset';

        transaction.amount = original[13];
        transaction.issuer = original[10];
        transaction.instrument = original[11];
        transaction.height = common.commaSeparateNumber(original[17] || '');
        transaction.protocol = original[12];
        transaction.sig = original[16];
        transaction.toAddr = original[12];

        return transaction;
    }

    /**
     * Create a Register Asset transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createRegisterAssetTransaction(transaction: Model.WalletTransaction,
                                          original: any[]): Model.WalletTransaction {
        transaction.txType = 'Register Asset';

        transaction.issuer = original[10];
        transaction.instrument = original[11];
        transaction.height = common.commaSeparateNumber(original[14] || '');
        transaction.sig = original[13];

        return transaction;
    }

    /**
     * Create a Asset Transfer transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createAssetTransferTransaction(transaction: Model.WalletTransaction,
                                          original: any[]): Model.WalletTransaction {
        transaction.txType = 'Asset Transfer';

        transaction.amount = original[14];
        transaction.issuer = original[10];
        transaction.instrument = original[11];
        transaction.height = common.commaSeparateNumber(original[18] || '');
        transaction.protocol = original[16];
        transaction.sig = original[15];
        transaction.toAddr = original[13];
        transaction.toChain = original[12];

        return transaction;
    }

    /**
     * Create a Memo transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createMemoTransaction(transaction: Model.WalletTransaction,
                                 original: any[]): Model.WalletTransaction {
        transaction.txType = 'Memo Tx';

        transaction.issuer = original[10];
        transaction.instrument = original[11];
        transaction.height = common.commaSeparateNumber(original[10] || '');
        transaction.sig = original[9];

        return transaction;
    }

    /**
     * Create a Encumber transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createEncumberTransaction(transaction: Model.WalletTransaction,
                                     original: any[]): Model.WalletTransaction {
        transaction.txType = 'Encumber';

        transaction.amount = original[13];
        transaction.dictData = original[14];
        transaction.issuer = original[11];
        transaction.instrument = original[12];
        transaction.height = common.commaSeparateNumber(original[18] || '');
        transaction.metaData = original[16];
        transaction.sig = original[17];
        transaction.subjectAddr = original[10];
        transaction.toChain = original[12];

        return transaction;
    }

    /**
     * Create a Encumber transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createUnencumberTransaction(transaction: Model.WalletTransaction,
                                       original: any[]): Model.WalletTransaction {
        transaction.txType = 'Unencumber';

        transaction.amount = original[13];
        transaction.dictData = original[14];
        transaction.issuer = original[11];
        transaction.instrument = original[12];
        transaction.height = common.commaSeparateNumber(original[18] || '');
        transaction.metaData = original[16];
        transaction.sig = original[17];
        transaction.subjectAddr = original[10];
        transaction.toChain = original[12];

        return transaction;
    }

    /**
     * Create a Voiding Asset transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createVoidingAssetTransaction(transaction: Model.WalletTransaction,
                                         original: any[]): Model.WalletTransaction {
        transaction.txType = 'Voiding Asset';

        transaction.amount = original[15];
        transaction.issuer = original[10];
        transaction.instrument = original[11];
        transaction.height = common.commaSeparateNumber(original[19] || '');
        transaction.metaData = original[17];
        transaction.sig = original[18];
        transaction.subjectAddr = original[14];
        transaction.toChain = original[12];

        return transaction;
    }

    /**
     * Create a Transfer To Many transaction
     * @param transaction WalletTransaction
     * @param original any[]
     * @return {any}
     */
    static createTransferToManyTransaction(transaction: Model.WalletTransaction,
                                           original: any[]): Model.WalletTransaction {
        transaction.txType = 'Transfer to many';

        transaction.issuer = original[10];
        transaction.instrument = original[11];
        transaction.height = common.commaSeparateNumber(original[18] || '');
        transaction.metaData = original[17];
        transaction.sig = original[15];
        transaction.subjectAddr = original[14];
        transaction.toChain = original[12];

        return transaction;
    }

    /**
     * Helpers
     */
    private static getUTCDateTime(unix: number): string {
        return moment.unixTimestampToDateStr(unix, 'YYYY-MM-DD HH:mm:ss UTC');
    }
}
