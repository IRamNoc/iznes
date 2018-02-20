import {MemberNodeMessageBody} from '@setl/utils/common';

// Invitation
interface Invitation {
    email: string;
    firstname?: string;
    lastname?: string;
}

export interface SendInvitationRequestData {
   assetManagerName: string;
   amCompanyName: string;
   investors: Array<Invitation>;
   lang: string;
}

export interface SendInvestInvitationRequestBody extends MemberNodeMessageBody {
    token: string;
    assetManagerName: string;
    amCompanyName: string;
    investors: Array<Invitation>;
    lang: string;
}

