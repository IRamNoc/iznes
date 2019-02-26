import { MemberNodeMessageBody } from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface Subportfolio {
    walletId: number;
    investorReference: string;
    accountLabel: string;
    accountCurrency: number;
    label: string;
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    city: string;
    country: string;
    accountOwner: string;
    ownerAddressLine1: string;
    ownerAddressLine2: string;
    ownerZipCode: string;
    ownerCity: string;
    ownerCountry: string;
    iban: string;
    bic: string;
    notes: string;
    bankIdentificationStatement: string;
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

export interface OfiUpdateSubPortfolioData extends Subportfolio {
    option: string;
}

export interface OfiDeleteSubPortfolioData {
    walletId: number;
    address: string;
}

export interface OfiGetSubPortfolioBankingDetailsData {
    walletId: number;
}
