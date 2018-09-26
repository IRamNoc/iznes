import {MemberNodeMessageBody} from '@setl/utils/common';

export interface ValidateFileMessageBody extends MemberNodeMessageBody {
    token: string;
    walletId: string;
    fileHash: string;
    fileId: string;
}
