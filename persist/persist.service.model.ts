import {MemberNodeMessageBody} from '@setl/utils/common';

/*
 * Persist requests,
 */
export interface BasicRequestBody extends MemberNodeMessageBody {
    token: string;
}

export interface SaveStateRequestBody extends MemberNodeMessageBody {
    token: string;
    formId: string;
    formData: any;
}

export interface LoadStateRequestBody extends MemberNodeMessageBody {
    token: string;
    formId: string;
}
