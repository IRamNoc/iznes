import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface RequestCouponsList extends OfiMemberNodeBody {
    couponId: number;
}
