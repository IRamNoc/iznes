import { MemberNodeMessageBody } from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface OfiAddSubPortfolioRequestBody extends OfiMemberNodeBody {
    token: string;
    walletId: number;
    label: string;
    establishmentName: string;
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    city: string;
    country: string;
    iban: string;
    bic: string;
}

export interface OfiUpdateSubPortfolioRequestBody extends OfiMemberNodeBody {
    token: string;
    walletId: number;
    option: string;
    label: string;
    establishmentName: string;
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    city: string;
    country: string;
    iban: string;
    bic: string;
}

export interface OfiDeleteSubPortfolioRequestBody extends OfiMemberNodeBody {
    token: string;
    walletId: number;
    address: string;
}

export interface OfiGetSubPortfolioBankingDetailsBody extends OfiMemberNodeBody {
    token: string;
    walletId: number;
}
