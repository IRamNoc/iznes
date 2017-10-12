import {MemberNodeMessageBody} from '@setl/utils/common';

export interface AddFileMessageBody extends MemberNodeMessageBody {
    token: string;
    walletId: string;
    files: string;
}

