import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

/*
 Messages.
 */
export interface BasicRequestBody extends MemberNodeMessageBody {
    token: string;
}

export interface NewMessageBody extends MemberNodeMessageBody {
    token: string;
    message: string;
}

export interface GetMessagesBody extends MemberNodeMessageBody {
    token: string;
}
