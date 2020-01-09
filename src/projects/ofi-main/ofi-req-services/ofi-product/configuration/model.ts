import { MemberNodeMessageBody } from '@setl/utils/common';

export interface GetProductConfigRequestBody extends MemberNodeMessageBody {
    token: string;
}

export interface UpdateProductConfigRequestBody extends MemberNodeMessageBody {
    token: string;
    name: string;
    value: string;
}
