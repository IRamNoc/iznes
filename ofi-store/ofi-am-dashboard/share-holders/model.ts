import {List} from 'immutable';

export interface FundsByUserDetails {
    fundId: number;
    fundName: string;
    fundLei: string;
}

export interface FundWithHoldersDetails {
    managementCompanyId: number;
    fundId: number;
    fundName: string;
    fundCurrency: string;
    fundAum: number;
    fundHolderNumber: number;
    lastSettlementDate: number;
    holders: {
        ranking: number;
        portfolio: string;
        investorName: string;
        amount: number;
        fundRatio: number;
    };
}

export interface OfiShareHoldersState {
    fundsByUserList: List<FundsByUserDetails>;
    fundsByUserRequested: boolean;
    fundWithHoldersList: List<FundWithHoldersDetails>;
    fundWithHoldersRequested: boolean;
}
