import {MemberNodeMessageBody} from '@setl/utils/common';

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
    isfundTargetingEos,
    isFundTargetingSri,
    isPassiveFund,
    hasSecurityiesLending,
    hasSwap,
    hasDurationHedge,
} from '@ofi/ofi-main/ofi-product/fundConfig';

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
    custodianBank: number;
    investmentManager: number;
    principalPromoter: number;
    payingAgent: number;
    fundManagers: string;
    transferAgent: number;
    centralizingAgent: number;
    isDedicatedFund: isDedicatedFund;
    portfolioCurrencyHedge: number; // number enum
    globalItermediaryIdentification: string;
    delegatedManagementCompany: string;
    investmentAdvisor: number;
    auditor: number;
    taxAuditor: number;
    legalAdvisor: number;
    directors: string;
    pocket: string;
    hasEmbeddedDirective: hasEmbeddedDirective;
    hasCapitalPreservation: hasCapitalPreservation;
    capitalPreservationLevel: number;
    capitalPreservationPeriod: number;
    hasCppi: hasCppi;
    cppiMultiplier: string;
    hasHedgeFundStrategy: hasHedgeFundStrategy;
    isLeveraged: isLeveraged;
    has130Or30Strategy: has130_30Strategy;
    isfundTargetingEos: isfundTargetingEos;
    isFundTargetingSri: isFundTargetingSri;
    isPassiveFund: isPassiveFund;
    hasSecurityiesLending: hasSecurityiesLending;
    hasSwap: hasSwap;
    hasDurationHedge: hasDurationHedge;
    investmentObjective: string;
}

export interface CreateFundRequestBody extends MemberNodeMessageBody, Fund {
    token: any;
}

export interface IznesFundRequestMessageBody extends MemberNodeMessageBody {
    token: string;
}

//
// export interface UpdateFund_RequestBody extends MemberNodeMessageBody, Fund {
//     token: any;
//
// }
