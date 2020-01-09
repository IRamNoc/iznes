// Arrangement
export const enum ArrangementActionType {
    SEND,
    ISSUE,
    ENCUMBER,
    COMMIT
}

export const enum ConditionType {
    AUTHORISE,
    TIME
}

export interface SendActionData {
    fromAddress: string;
    toAddress: string;
    asset: string;
    amount: number | string;
    metaData: any;
}

export interface IssueActionData {
    fromAddress: string;
    toAddress: string;
    asset: string;
    amount: string;
    metaData: any;
}

// export interface EncumberActionData {
// }
//
// export interface CommitActionData {
// }
//
// export interface EncumberData {
//
// }

export interface AuthoriseConditionData {
    authoriseRef: string;
    address: string;
}

export interface TimeConditionData {
    executeTimeStamp: number;
}

export interface ActionData {
    actionType: ArrangementActionType;
    actionData: SendActionData | IssueActionData;
}

export interface ConditionData {
    conditionType: ConditionType;
    conditionData: any;
}

export interface ArrangementData {
    actions: Array<ActionData>;
    docs?: Array<any>;
    expiry: number;
    conditions?: Array<ConditionData>;
    datas?: Array<any>;
    numStep: string;
    stepTitle: string;
    creatorAddress: string;
    addEncs?: Array<any>;
    useEncum?: Array<any>;
    mustSigns?: {[address: string]: boolean};
}


// Blockchain contract
export interface PayAmountData {
    amount: number | string;
    isIssuance: boolean;
    metaData: any;
}

export interface PayData {
    [asset: string]: PayAmountData;
}

export type ReceiveAmountData = number | string;

export interface ReceiveData {
    [asset: string]: ReceiveAmountData;
}

export interface PartyData {
    pay: PayData;
    receive: ReceiveData;
}

export interface PartiesData {
    [address: string]: PartyData;
}

export type Address = string;
export type AssetPartOne = string;
export type AssetPartTwo = string;
export type PaymentAmount = string | number;
export type PayPublicKey = string;
export type PaySignature = string;
export type IsIssuance = boolean;
export type MetaData = string;

export type PartyListEntryPayListData = [
    Address,
    AssetPartOne,
    AssetPartTwo,
    PaymentAmount,
    PayPublicKey,
    PaySignature,
    IsIssuance,
    MetaData
    ];

export type PartyListEntryReceiveListData = [
    Address,
    AssetPartOne,
    AssetPartTwo,
    PaymentAmount
    ];


export type PartyIdentifier = string;

export type PartySignAddress = string;

export type PartyPublicKey = string;

export type SignContractAddress = string;

export type MustSign = boolean;

export type PartyListEntryData = [
    PartyIdentifier,
    PartySignAddress,
    Array<PartyListEntryPayListData>,
    Array<PartyListEntryReceiveListData>,
    PartyPublicKey,
    SignContractAddress,
    MustSign
    ];

export type AuthorisationAddress = string;
export type AuthorisationId = string;

export interface VerfierMsg {
    title: string;
    hash: string;
}

export interface AuthorisationMetaData {
    type: string;
    msg: string;
    address: AuthorisationAddress;
}

export type AuthorisationMetaDataStr = string;

export type AuthorisationEntryData = [
    AuthorisationAddress,
    AuthorisationId,
    // todo
    string, // ? need document what this one is
    AuthorisationMetaDataStr
    ];

export type ParamterAddress = string;

export type ParameterData = [
    ParamterAddress,
    string,
    number,
    number,
    number,
    string
    ];

export interface ContractData {
    __function: string;
    parties: Array<number | PartyListEntryData>;
    authorisations: Array<AuthorisationEntryData>;
    parameters: Array<ParameterData>;
    addencumbrances: Array<any>;
    events: Array<string>;
    expiry: number;
    startdate: number;
    protocol: 'dvp';
    encumbrance: Array<any>;
    metadata: string;
}

export interface Contract {
    creatorAddress: Address;
    contractFunction: string;
    contractData: ContractData;
}
