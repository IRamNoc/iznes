export interface KycDetailGeneral {
}

export interface KycDetailsGeneral {
    [index: string]: KycDetailGeneral
}

export interface KycDetailCompany {
}

export interface KycDetailsCompany {
    [index: string]: KycDetailCompany
}


export interface KycDetailBanking {
}

export interface KycDetailsBanking {
    [index: string]: KycDetailBanking
}


export interface KycDetailClassification {
}

export interface KycDetailsClassification {
    [index: string]: KycDetailClassification
}

export interface KycDetailBeneficiaries {
}

export interface KycDetailsBeneficiaries {
    [index: string]: KycDetailBeneficiaries
}

export interface KycDetailRiskNature {
}

export interface KycDetailsRiskNature {
    [index: string]: KycDetailRiskNature
}

export interface KycDetailRiskobjective {
}

export interface KycDetailsRiskobjective {
    [index: string]: KycDetailRiskobjective
}

export interface KycDetailDocuments {
}

export interface KycDetailsDocuments {
    [index: string]: KycDetailDocuments
}

export interface KycDetailValidation {
}

export interface KycDetailsValidation {
    [index: string]: KycDetailValidation,
}


export interface KycDetailsState {

    kycDetailsGeneral: KycDetailsGeneral;
    kycDetailsGeneralRequested: boolean;

    kycDetailsCompany: KycDetailsCompany;
    kycDetailsCompanyRequested: boolean;

    kycDetailsBanking: KycDetailsBanking;
    kycDetailsBankingRequested: boolean;

    kycDetailsClassification: KycDetailsClassification;
    kycDetailsClassificationRequested: boolean;

    kycDetailsCompanyBeneficiaries: KycDetailsBeneficiaries
    kycDetailsCompanyBeneficiariesRequested: boolean

    kycDetailsRiskNature: KycDetailsRiskNature,
    kycDetailsRiskNatureRequested: boolean,

    kycDetailsRiskObjective: KycDetailsRiskobjective,
    kycDetailsRiskObjectiveRequested: boolean,

    kycDetailsDocuments: KycDetailsDocuments,
    kycDetailsDocumentsRequested: boolean,

    kycDetailsValidation: KycDetailsValidation,
    kycDetailsValidationRequested: boolean,
}