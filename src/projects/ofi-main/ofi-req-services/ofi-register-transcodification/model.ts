import { MemberNodeMessageBody } from '@setl/utils/common';

export interface IznesUpdateRegisterTranscofification {
    transcodificationId: number;
    transcodificationCode: number;
}

export interface IznesUpdateRegisterTranscofificationRequestBody extends MemberNodeMessageBody {
    token: string;
    transcodificationId: number;
    transcodificationCode: number;
}

export interface IznesGetRegisterTranscofificationRequestBody extends MemberNodeMessageBody {
    token: string;
    kycId: number;
}

export interface IznesGetThirdPartiesRequestBody extends MemberNodeMessageBody {
    token: string;
}

export interface IznesDeleteRegisterTranscofificationRequestBody extends MemberNodeMessageBody {
    token: string;
    transcodificationId: number;
}

export interface IznesCreateRegisterTranscofification {
    transcodificationCode: string;
    kycId: number;
    thirdPartyId: number;
}

export interface IznesCreateRegisterTranscofificationRequestBody extends MemberNodeMessageBody {
    token: string;
    transcodificationCode: string;
    kycId: number;
    thirdPartyId: number;
}