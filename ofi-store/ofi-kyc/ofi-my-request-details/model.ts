export interface KycGeneral {

}

export interface KycMyRequestDetailsState {
    kycMyRequestDetailsGeneral: Array<KycGeneral>;
    kycMyRequestDetailsGeneralRequested: boolean;
    kycMyRequestDetailsCompany: Array<KycGeneral>;
    kycMyRequestDetailsCompanyRequested: boolean;
    kycMyRequestDetailsCompanyBeneficiaries: Array<KycGeneral>;
    kycMyRequestDetailsCompanyBeneficiariesRequested: boolean;
    kycMyRequestDetailsBanking: Array<KycGeneral>;
    kycMyRequestDetailsBankingRequested: boolean;
    kycMyRequestDetailsClassification: Array<KycGeneral>;
    kycMyRequestDetailsClassificationRequested: boolean;
    kycMyRequestDetailsRisknature: Array<KycGeneral>;
    kycMyRequestDetailsRisknatureRequested: boolean;
    kycMyRequestDetailsRiskobjective: Array<KycGeneral>;
    kycMyRequestDetailsRiskobjectiveRequested: boolean;
    kycMyRequestDetailsDocuments: Array<KycGeneral>;
    kycMyRequestDetailsDocumentsRequested: boolean;
}