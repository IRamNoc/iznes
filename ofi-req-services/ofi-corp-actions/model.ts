import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiRequestCouponsList extends OfiMemberNodeBody {
    couponId: number;
}

export interface OfiSetNewCouponBody extends OfiMemberNodeBody {
    userCreated: string;
    dateValuation: string;
    fund: string;
    fundIsin: string;
    amount: string;
    amountGross: string;
    dateSettlement: string;
    comment: string;
    status: string;
    accountId: string;
    dateLastUpdated: string;
}
