export class WalletTransaction {
    txType?: string;
    hash?: string;
    baseChain?: string;
    fromPub?: string;
    fromAddr?: string;
    issuer?: string;
    issuer2?: string;
    instrument?: string;
    instrument2?: string;
    toPub?: string;
    toAddr?: string;
    toChain?: string;
    ratio?: string;
    utc?: string;
    sig?: string;
    sig2?: string;
    height?: string;
    shortHash?: string;
    txJsonTree?: string;
    protocol?: string;
    amount?: number;
    subjectAddr?: string;
    metaData?: string;
    dictData?: string;
    str_prop1?: string;
}

export class WalletTransactionFields {
    fields: WalletTransactionField[] = [
        {
            field: 'txType',
            displayName: 'Transaction Type',
        },
        {
            field: 'hash',
            displayName: 'Transaction Hash',
        },
        {
            field: 'baseChain',
            displayName: 'Base Chain',
        },
        {
            field: 'fromPub',
            displayName: 'From Public Key',
        },
        {
            field: 'fromAddr',
            displayName: 'From Address',
        },
        {
            field: 'issuer',
            displayName: 'Issuer',
        },
        {
            field: 'issuer2',
            displayName: 'Issuer 2',
        },
        {
            field: 'instrument',
            displayName: 'Instrument',
        },
        {
            field: 'instrument2',
            displayName: 'Instrument 2',
        },
        {
            field: 'toPub',
            displayName: 'To Public Key',
        },
        {
            field: 'toAddr',
            displayName: 'To Address',
        },
        {
            field: 'toChain',
            displayName: 'To Chain',
        },
        {
            field: 'ratio',
            displayName: 'Ratio',
        },
        {
            field: 'utc',
            displayName: 'UTC',
        },
        {
            field: 'sig',
            displayName: 'Transaction Signature',
        },
        {
            field: 'sig2',
            displayName: 'Transaction Signature 2',
        },
        {
            field: 'height',
            displayName: 'Block Height',
        },
        {
            field: 'protocol',
            displayName: 'Protocol',
        },
        {
            field: 'amount',
            displayName: 'Amount',
        },
        {
            field: 'subjectAddr',
            displayName: 'Subject Address',
        },
        {
            field: 'metaData',
            displayName: 'Meta Data',
        },
        {
            field: 'dictData',
            displayName: 'Dictionary Data',
        },
        {
            field: 'str_prop1',
            displayName: 'String',
        },
    ];
}

export class WalletTransactionField {
    field: string;
    displayName: string;
    mltag?: string;
}

/**
 *  Types of transaction
 */
export const TxRegisterIssuer = 'registerIssuer';
export const TxRegisterAsset = 'registerAsset';
export const TxIssueAsset = 'issueAsset';
export const TxRegisterAddress = 'registerAddress';
export const TxAssetTransferCX = 'assetTransferCX';
export const TxSplit = 'split';
export const TxDividend = 'dividend';
export const TxNewContract = 'newContract';
export const TxCommitContract = 'commitContract';
export const TxMemo = 'memoTX';
export const TxEncumber = 'encumber';
export const TxUnencumber = 'unencumber';
export const TxVoidingAsset = 'voidingAsset';
export const TxTransferToMany = 'transferToMany';

/**
 * Tx type lookup table, provide tx type decimal value, return tx type in string.
 */
export const TransactionTypes = {
    [parseInt('0x04', 16)]: TxRegisterIssuer,
    [parseInt('0x05', 16)]: TxRegisterAsset,
    [parseInt('0x06', 16)]: TxIssueAsset,
    [parseInt('0x08', 16)]: TxRegisterAddress,
    [parseInt('0x80', 16)]: TxAssetTransferCX,
    [parseInt('0x84', 16)]: TxSplit,
    [parseInt('0x85', 16)]: TxDividend,
    [parseInt('0x90', 16)]: TxNewContract,
    [parseInt('0x92', 16)]: TxCommitContract,
    [parseInt('0x10', 16)]: TxMemo,
    [parseInt('0x12', 16)]: TxEncumber,
    [parseInt('0x13', 16)]: TxUnencumber,
    [parseInt('0x11', 16)]: TxVoidingAsset,
    [parseInt('0x86', 16)]: TxTransferToMany,
};
