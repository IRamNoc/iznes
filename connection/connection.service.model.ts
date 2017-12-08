import { MemberNodeMessageBody } from '@setl/utils/common';

export interface GetConnectionsMessageBody extends MemberNodeMessageBody {
    token: string;
    leiId: string;
}

export interface CreateConnectionMessageBody extends MemberNodeMessageBody {
    token: string;
    leiId: string;
    senderLeiId: string;
    address: string;
    connectionId: number;
    status: number;
}
