import { MemberNodeMessageBody } from '@setl/utils/common';

export interface RequestAccountListMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface EditAccountMessageBody extends MemberNodeMessageBody {
    token: string;
    accountId: number;
    accountName: string;
    description: string;
    wallet: number;
}

export interface AddAccountMessageBody extends MemberNodeMessageBody {
    token: string;
    accountName: string;
    accountDescription: string;
    accountMember: number;
}

export interface DeleteAccountMessageBody extends MemberNodeMessageBody {
    token: string;
    accountId: number;
}
