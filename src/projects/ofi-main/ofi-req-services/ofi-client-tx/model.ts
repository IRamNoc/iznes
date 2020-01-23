import { MemberNodeMessageBody } from '@setl/utils/common';

export interface RequestClientTxRequestBody extends MemberNodeMessageBody {
    token: string;
    walletId: number;
    shareName: string;
}
