import { MemberNodeMessageBody } from '@setl/utils/common';

export interface ReadInvitationRequest extends MemberNodeMessageBody {
    invitationToken: string;
}

export interface CompleteUserSignupRequest extends MemberNodeMessageBody {
    invitationToken: string;
    password: string;
}
