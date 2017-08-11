import {MemberNodeRequest, MemberNodeMessageBody} from '@setl/utils/common';

export interface LoginRequestMessageBody extends MemberNodeMessageBody {
    UserName: string;
    Password: string;
    CFCountry: string;
}

export interface LoginRequestMessage extends MemberNodeRequest {
    MessageBody: LoginRequestMessageBody;
}

