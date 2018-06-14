import { MemberNodeMessageBody } from '@setl/utils/common';

export interface ProductCharacteristicsRequestBody extends MemberNodeMessageBody {
    token: string;
    isin: string;
}
