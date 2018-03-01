import {MemberNodeMessageBody} from '@setl/utils/common';

export interface AmAllFundShareListRequestBody extends MemberNodeMessageBody {
   token: string;
}

export interface InvestorFundAccessRequestBody extends MemberNodeMessageBody {
    token: string;
    investorWalletId: number;
}
