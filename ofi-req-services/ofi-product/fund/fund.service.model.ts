import { MemberNodeMessageBody } from '@setl/utils/common';

import {
    isFundStructure,
    isEuDirective,
    openOrCloseEnded,
    isFundOfFund,
    isDedicatedFund,
    hasEmbeddedDirective,
    hasCapitalPreservation,
    hasCppi,
    hasHedgeFundStrategy,
    isLeveraged,
    has130_30Strategy,
    isFundTargetingEos,
    isFundTargetingSri,
    isPassiveFund,
    hasSecurityiesLending,
    hasSwap,
    hasDurationHedge,
} from '@ofi/ofi-main/ofi-product/productConfig';

export interface FundRequestMessageBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
}

export interface HistoryRequestMessageBody extends MemberNodeMessageBody {
    token: any;
    fundId: any;
    shareId: any;
    fieldTag: any;
    dateFrom: any;
    dateTo: any;
    pageNum: any;
    pageSize: any;
}

export interface FundShareRequestMessageBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
    fundId: any;
}

export interface SaveFundRequestBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
    companyId: any;
    fundName: any;
    fundProspectus: any;
    fundReport: any;
    fundLei: any;
    sicavId: any;
}

export interface UpdateFundRequestBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
    fundId: any;
    companyId: any;
    fundName: any;
    fundProspectus: any;
    fundReport: any;
    fundLei: any;
    sicavId: any;
}

export interface SaveFundShareRequestBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
    fundID: any;
    metadata: any;
    issuer: any;
    shareName: any;
    status: any;
}

export interface UpdateFundShareRequestBody extends MemberNodeMessageBody {
    token: any;
    accountId: any;
    shareID: any;
    fundID: any;
    metadata: any;
    issuer: any;
    shareName: any;
    status: any;
}

export interface SaveFundHistoryRequestBody extends MemberNodeMessageBody {
    token: any;
    changes: any;
}

export interface Fund {
    draft: string;
    fundName: string;
    isFundStructure: isFundStructure;
    umbrellaFundID: number;
    legalEntityIdentifier: string;
    registerOffice: string;
    registerOfficeAddress: string;
    domicile: string;
    isEuDirective: any;
    typeOfEuDirective: isEuDirective;
    ucitsVersion: number;
    legalForm: number;
    nationalNomenclatureOfLegalForm: number;
    homeCountryLegalType: number;
    fundCreationDate: string; // date
    fundLaunchate: string; // date
    fundCurrency: number; // number enum
    openOrCloseEnded: openOrCloseEnded;
    fiscalYearEnd: string; // date
    isFundOfFund: isFundOfFund;
    managementCompanyID: number;
    fundAdministrator: number;
    custodianBankID: number;
    investmentManagerID: number;
    principlePromoterID: string | string[];
    payingAgentID: string | string[];
    fundManagers: string;
    transferAgentID: number;
    centralizingAgentID: number;
    isDedicatedFund: isDedicatedFund;
    portfolioCurrencyHedge: number; // number enum
    globalItermediaryIdentification: string;
    delegatedManagementCompany: string;
    investmentAdvisorID: string | string[];
    auditorID: number;
    taxAuditorID: number;
    legalAdvisorID: number;
    directors: string;
    hasEmbeddedDirective: hasEmbeddedDirective;
    hasCapitalPreservation: hasCapitalPreservation;
    capitalPreservationLevel: number;
    capitalPreservationPeriod: number;
    hasCppi: hasCppi;
    cppiMultiplier: string;
    hasHedgeFundStrategy: hasHedgeFundStrategy;
    isLeveraged: isLeveraged;
    has130Or30Strategy: has130_30Strategy;
    isFundTargetingEos: isFundTargetingEos;
    isFundTargetingSri: isFundTargetingSri;
    isPassiveFund: isPassiveFund;
    hasSecurityiesLending: hasSecurityiesLending;
    hasSwap: hasSwap;
    hasDurationHedge: hasDurationHedge;
    investmentObjective: string;
    internalReference: string;
    additionnalNotes: string;
}

export interface IznesCreateFundRequestBody extends MemberNodeMessageBody, Fund {
    token: any;
    principlePromoterID: string;
    payingAgentID: string;
    investmentAdvisorID: string;
}

export interface IznesFundRequestMessageBody extends MemberNodeMessageBody {
    token: string;
}

export interface IznesUpdateFundRequestBody extends MemberNodeMessageBody, Fund {
    token: any;
    fundID: string;
    principlePromoterID: string;
    payingAgentID: string;
    investmentAdvisorID: string;
}

export interface IznDeleteFundDraftRequestBody extends MemberNodeMessageBody {
    token: any;
    id: string;
}