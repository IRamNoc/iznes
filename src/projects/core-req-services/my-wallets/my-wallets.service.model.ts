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

export interface RequestWalletDirectoryMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface RequestManagedWalletsMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface RequestWalletToRelationshipMessageBody extends MemberNodeMessageBody {
    token: string;
    senderLei: number;
}

export interface RequestWalletLabelMessageBody extends MemberNodeMessageBody {
    token: string;
    walletId: number;
}

export interface NewWalletLabelMessageBody extends MemberNodeMessageBody {
    token: string;
    walletId: number;
    option: string;
    label: string;
    iban: string;
}

export interface UpdateWalletLabelMessageBody extends MemberNodeMessageBody {
    token: string;
    walletId: number;
    option: string;
    label: string;
    iban: string;
}
