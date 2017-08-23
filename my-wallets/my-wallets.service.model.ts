import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface RequestOwnWalletsMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface RequestOwnWalletsMessage extends MemberNodeRequest {
    MessageBody: RequestOwnWalletsMessageBody;
}

export interface SetActiveWalletMessageBody extends MemberNodeMessageBody {
    token: string;
    walletId: number;
}