export enum FundShareStatus {
   active = 1,
   locked = -1,
   disabled = -2
}

export interface AllFundShareDetail {
   shareId: number;
   shareName: string;
   fundId: number;
   fundName: string;
   fundShareIsin: string;
   fundShareStatus: FundShareStatus;
}

export interface OfiFundShareListState {
    amAllFundShareList: {
        [shareId: string]: AllFundShareDetail
    };
    requestedAmAllFundShareList: boolean;
}
