export interface FundInterface {
    fundName: string;
    shares: SharesInterface[];
}

export interface SharesInterface {

    // Fond

    fundName: string;
    fundLei: string;
    fundSicavFcp: string;
    fundSicavId: string;

    // Administratif

    isin: string;
    portfolioCode: string;
    shareName: string;
    fundShareStatus: string;
    fundAddressPrefix: string;
    fundAddress1: string;
    fundAddress2: string;
    fundAddress3: string;                                       // ville
    fundAddress4: string;                                       // Etat
    fundCodePostal: string;
    leiCode: string;
    shareType: string;
    incomeAllocation: string;
    shareCurrency: string;
    portfolioCurrency: string;
    approvalDate: string;
    creationDate: string;
    dissolutionDate: string;
    sidePocket: string;
    fundInLiquidation: string;
    valuationFrequency: string;
    fundBusinessDayRule: string;
    applicableRight: string;
    fundEstimated: string;
    estimatedNavDate: string;
    amfDisclosure: string;
    reportingCountry: string;
    endOfFirstYearDate: string;
    closingDate: string;

    // Services

    assetManagementCompany: string;
    managementCompanyAddressPrefix: string;
    managementCompanyAddress1: string;
    managementCompanyAddress2: string;
    managementCompanyAddress3: string;                      // ville
    managementCompanyAddress4: string;                      // Etat
    managementCompanyCodePostal: string;
    delegatedAssetManagementCompany: string;
    delegatedManagementCompanyAddressPrefix: string;
    delegatedManagementCompanyAddress1: string;
    delegatedManagementCompanyAddress2: string;
    delegatedManagementCompanyAddress3: string;             // ville
    delegatedManagementCompanyAddress4: string;             // Etat
    delegatedManagementCompanyCodePostal: string;
    delegationFxTreasury: string;
    promoter: string;
    statutoryAdvisor: string;
    cacRenewalDate: string;
    compensator: string;
    finInvestAllocAdviser: string;
    custodian: string;
    depositary: string;
    subCustodian: string;
    orderAgent: string;
    primeBroker: string;
    registryAccountManager: string;
    adminAccountManager: string;
    administratorNav: string;

    // Catégorie

    assetClass: string;
    subAssetClass: string;
    graphicalArea: string;
    fundSri: string;
    fundCopromotion: string;

    // Juridique

    supervisoryAuthority: string;
    amfClassification: string;
    ucitsIVClassification: string;
    legalNature: string;
    formOfOpcvm: string;
    fundUcitsOfUcits: string;
    fundFeeder: string;
    fundMaster: string;

    // Frais

    maxIndirectFees: string;
    maxManagementFees: string;
    prospectusCalcBasis: string;
    actualCalcBasis: string;
    provisionedActualManagementFees: string;
    acquiredSubscriptionFees: string;
    acquiredRedemptionFees: string;
    maxSubscriptionFees: string;
    maxRedemptionFees: string;
    outPerformanceFee: string;
    hurdle: string;
    highWaterMark: string;
    vmfFirstCollectionDate: string;
    vmfBillingMonth: string;
    vmfFrequency: string;
    fundAcquisitionOnRedemption: string;

    // Risque

    fundGuaranteeOfCapital: string;
    methodOfEngagement: string;
    regulatoryLevelOfLeverage: string;
    srri: string;
    mainRisks: string;

    // Profile

    subscriberProfile: string;
    fundDedicated: string;
    fundReserved: string;
    accessCondition: string;
    investmentHorizon: string;
    fundPeaEligibility: string;
    fundTaxRatio90Percent: string;
    fundReverseSolicitation: string;

    // Caractéristique

    initialNav: string;
    knownNav: string;
    decimalisation: string;
    formOfUnit: string;
    formOfRedemption: string;
    formOfsubscription: string;
    minInitSubscription: string;
    minSubscriptionvalue: string;
    minsubscriptionUnits: string;
    fundSwingPricing: string;
    fundAdmissionToBlockchain: string;
    fundCurrencyHedgedAmount: string;
    fundGuaranteeOrProtection: string;

    // Calendrier

    srSchedule: string;
    valuationPrice: string;
    fundDvp: string;
    dateCalculationConditions: string;
    cashDeliveryDate: string;
    settlementDate: string;
    subscriptionCutOff: string;
    subscriptionCutOffHour: string;
    advancedNotice: string;
    redemptionCutOff: string;
    redemptionCutOffHour: string;
    redemptionAdvancedNotice: string;
    blockingPeriod: string;
    gate: string;
    salePurchaseConditions: string;
    initialNavDate: string;
    settlementDateOnInitial: string;
    fundSwitchFreePossibility: string;

    // Documents

    fundDocDici: string;
    fundDocProductSheet: string;
}