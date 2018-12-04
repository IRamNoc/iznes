import { MemberNodeMessageBody } from '@setl/utils/common';

export enum ArrangementType {
    SUBSCRIBE = 3,
    REDEEM,
}

export interface RequetFundAccessMy extends MemberNodeMessageBody {
    token: string;
    walletId: number;
}

export interface AddArrangementRequestBody extends MemberNodeMessageBody {
    token: string;
    creatorId: number;
    type: ArrangementType;
    metaData: string;
    asset: string;
    investBy: number;
    quantity: number;
    amountWithCost: number;
    feePercent: number;
    platFormFee: number;
    parties: object;
    cutoff: string;
    delivery: string;
    valuation: string;
}

export interface AddArrangementContractMapRequestBody extends MemberNodeMessageBody {
    token: string;
    walletId: number;
    arrangementId: number;
    contractAddress: string;
    expiry: number;
}

export interface InsertIssueAssetMapBody extends MemberNodeMessageBody {
    token: string;
    address: string;
    asset: string;
    isin: string;
    companyId: string;
}
