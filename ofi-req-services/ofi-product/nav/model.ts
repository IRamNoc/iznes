import {MemberNodeMessageBody} from '@setl/utils/common';

export enum ArrangementType {
    SUBSCRIBE = 3,
    REDEEM
}

export interface RequetFundAccessMy extends MemberNodeMessageBody {
    token: string;
}

export interface AddArrangementRequestBody extends MemberNodeMessageBody {
    token: string;
    creatorId: number;
    type: ArrangementType;
    metaData: string;
    asset: string;
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



