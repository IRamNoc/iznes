import { MemberNodeMessageBody } from '@setl/utils/common';

export interface OfiMemberNodeBody extends MemberNodeMessageBody {
    token: string;
}

export interface Subportfolio {
    walletId: number;
    investorReference: string;
    accountLabel: string;
    emailtransactionnotice: string;
    emailcertificationbookentry: string;
    accountCurrency: number;
    custodianPayment: number;
    custodianPosition: number;
    custodianTransactionNotices: number;
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
    bicInvestorCode: string;
    notes: string;
    bankIdentificationStatement: string;
    securityAccount: string;
    cashAccount: string;
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

export interface OfiDeleteSubPortfolioDraftRequestBody extends OfiMemberNodeBody {
    token: string;
    walletId: number;
    RN: string;
}

export interface OfiGetSubPortfolioBankingDetailsBody extends OfiMemberNodeBody {
    token: string;
    walletId: number;
}

export interface OfiUpdateSubPortfolioData extends Subportfolio {
    option: string;
    oldSubportifolio: any;
}

export interface OfiUpdateSubPortfolioDraftData extends Subportfolio {
    option: string;
    oldSubportifolio: any;
    RN: string;
}

export interface OfiDeleteSubPortfolioData {
    walletId: number;
    address: string;
}

export interface OfiDeleteSubPortfolioDraftData {
    walletId: number;
    RN: string;
}

export interface OfiGetSubPortfolioBankingDetailsData {
    walletId: number;
}

export interface SubPortfolioDataDraft extends Subportfolio {
    RN: string;
}