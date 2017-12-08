import {MemberNodeMessageBody} from '@setl/utils/common';

export interface GetConnectionsMessageBody extends MemberNodeMessageBody {
    token: string;
    leiId: string;
}

export interface CreateConnectionMessageBody extends MemberNodeMessageBody {
    RequestName: string;
    token: string;
    leiId: string;
    senderLeiId: string;
    address: string;
    connectionId: number;
    status: number;
}

export interface UpdateConnectionMessageBody extends MemberNodeMessageBody {
    RequestName: string;
    token: string;
    leiId: string;
    senderLei: string;
    keyDetail: string;
}

export interface DeleteConnectionMessageBody extends MemberNodeMessageBody {
    RequestName: string;
    token: string;
    leiId: string;
    senderLei: string;
}