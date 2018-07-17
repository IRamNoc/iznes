import {List} from 'immutable';

export interface AmHoldersDetails {
    isFund: boolean;
    fundId: number;
    fundName: string;
    fundLei: string;
    fundCurrency: string;
    fundAum: number;
    fundHolderNumber: number;
    shareId: number;
    shareName: string;
    shareIsin: string;
    shareNav: number;
    shareUnitNumber: number;
    shareCurrency: string;
    shareAum: number;
    shareHolderNumber: number;
    shareRatio: number;
}

export interface InvHoldingsDetails {

}

export interface HolderDetailStructure {
    id: number;
    name: string;
    currency: string;
    isin: string;
    nav: number;
    unitNumber: number;
    aum: number;
    holderNumber: number;
    ratio: number;
    lastSettlementDate: string;
    holders: List<ShareHolderItem>;
}

export interface ShareHolderItem {
    ranking: number;
    investorName: string;
    companyName: string;
    quantity: number;
    amount: number;
    ratio: number;
}

export interface OfiHolderState {
    amHoldersList: List<AmHoldersDetails>;
    requested: boolean;
    holderDetailRequested: boolean;
    shareHolderDetail: HolderDetailStructure;
    invHoldingsList: List<InvHoldingsDetails>;
    invRequested: boolean;
}
