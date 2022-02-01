import { List, Map } from 'immutable';

export interface AmHoldersDetails {
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
export interface AmHoldersHistoryDetails {
    companyName: number;
    amWalletID: string;
    quantity: number; 
}

export interface InvestorHoldingItem {
    amManagementCompanyID: number;
    companyName: string;
    shareID: number;
    fundShareName: string;
    isin: string;
    shareClassCurrency: number;
    latestNav: number;
    portfolioAddr: string;
    portfolioLabel: string;
    quantity: number;
    amount: number;
    ratio: number;
}

export interface ShareHolderItem {
    ranking: number;
    investorName: string;
    portfolio: string;
    quantity: number;
    amount: number;
    ratio: number;
}

export interface OfiHoldingHistoryState {
    amHolderHistoryList: List<AmHoldersHistoryDetails>;
    requested: boolean;
    holderDetailRequested: boolean;
    shareHolderDetail: Map<any, any>;
    invHoldingsList: List<InvestorHoldingItem>;
    invRequested: boolean;
}
