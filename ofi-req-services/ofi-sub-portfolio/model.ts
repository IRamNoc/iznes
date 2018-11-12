import { MemberNodeMessageBody } from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiAddSubPortfolioRequestBody extends OfiMemberNodeBody {
    token: string;
    walletId: number;
    name: string;
    iban: string;
}

export interface OfiDeleteSubPortfolioRequestBody extends OfiMemberNodeBody {
    token: string;
    walletId: number;
    address: string;
}
