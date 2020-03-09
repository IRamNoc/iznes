import { fundItems } from '@ofi/ofi-main/ofi-product/productConfig';

export const formStepsOnboarding = [
    {
        title: 'User Profile',
        id: 'step-userprofile',
    },
];

export const formStepsFull = [
    {
        title: 'Selection',
        id: 'step-selection',
        dbId: 'amcSelection',
    },
    {
        title: 'Introduction',
        dbId: 'introduction',
    },
    {
        title: 'Identification',
        id: 'step-identification',
        children: ['General Information', 'Company Information', 'Stakeholders', 'Bank Accounts', 'Classification'],
        dbId: 'identification',
    },
    {
        title: 'General Information',
        id: 'step-general-information',
        parentStep: 'Identification',
        dbId: 'generalInformation',
    },
    {
        title: 'Company Information',
        id: 'step-company-information',
        parentStep: 'Identification',
        dbId: 'companyInformation',
    },
    {
        title: 'Stakeholders',
        id: 'step-stakeholder-information',
        parentStep: 'Identification',
        dbId: 'stakeholders',
    },
    {
        title: 'Bank Accounts',
        id: 'step-bank-accounts',
        parentStep: 'Identification',
        dbId: 'bankAccounts',
    },
    {
        title: 'Classification',
        id: 'step-classification',
        parentStep: 'Identification',
        dbId: 'classification',
    },
    {
        title: 'Risk Profile',
        id: 'step-risk-profile',
        children: ['Investment Details', 'Investment Objectives', 'Investment Constraints'],
        dbId: 'riskProfile',
    },
    {
        title: 'Investment Details',
        id: 'step-investment-details',
        parentStep: 'Risk Profile',
        dbId: 'investmentDetails',
    },
    {
        title: 'Investment Objectives',
        id: 'step-investment-objectives',
        parentStep: 'Risk Profile',
        dbId: 'investmentObjectives',
    },
    {
        title: 'Investment Constraints',
        id: 'step-investment-constraints',
        parentStep: 'Risk Profile',
        dbId: 'investmentConstraints',
    },
    {
        title: 'Documents',
        id: 'step-documents',
        dbId: 'documents',
    },
    {
        title: 'Validation',
        id: 'step-validation',
        dbId: 'validation',
    },
];
export const formStepsLight = [
    {
        title: 'Selection',
        id: 'step-selection',
        dbId: 'amcSelection',
    },
    {
        title: 'Validation',
        id: 'step-validation',
        dbId: 'validation',
    },
];

export enum investorStatusList {
    nonPro,
    proByNature,
    proBySize,
}

export const investorStatusTextList = [
    {
        id: '0',
        text: 'Non professional',
    },
    {
        id: '1',
        text: 'Professional by nature',
    },
    {
        id: '2',
        text: 'Professional by size',
    },
];

export const minimalInvestorStatusTextList = [
    {
        id: '0',
        text: 'Non professional investor',
    },
    {
        id: '1',
        text: 'Professional investor',
    },
];

export const financialRatingList = [
    {
        id: 'AAA',
        text: 'AAA',
    },
    {
        id: 'AA+',
        text: 'AA+',
    },
    {
        id: 'AA',
        text: 'AA',
    },
    {
        id: 'AA-',
        text: 'AA-',
    },
    {
        id: 'A+',
        text: 'A+',
    },
    {
        id: 'A',
        text: 'A',
    },
    {
        id: 'A-',
        text: 'A-',
    },
    {
        id: 'BBB+',
        text: 'BBB+',
    },
    {
        id: 'BBB',
        text: 'BBB',
    },
    {
        id: 'BBB-',
        text: 'BBB-',
    },
    {
        id: 'BB+',
        text: 'BB+',
    },
    {
        id: 'BB',
        text: 'BB',
    },
    {
        id: 'BB-',
        text: 'BB-',
    },
    {
        id: 'B+',
        text: 'B+',
    },
    {
        id: 'B',
        text: 'B',
    },
    {
        id: 'B-',
        text: 'B-',
    },
    {
        id: 'B',
        text: 'B',
    },
    {
        id: 'CCC+',
        text: 'CCC+',
    },
    {
        id: 'CCC',
        text: 'CCC',
    },
    {
        id: 'CCC-',
        text: 'CCC-',
    },
    {
        id: 'CC',
        text: 'CC',
    },
    {
        id: 'C/CI/R',
        text: 'C/CI/R',
    },
    {
        id: 'SD',
        text: 'SD',
    },
    {
        id: 'D',
        text: 'D',
    },
];

export const regulatorSupervisoryAuthoritiesList = [
    {
        id: 'austriaFinanzmarktaufsicht',
        text: 'Austria - Finanzmarktaufsicht (FMA)',
    },
    {
        id: 'belgiumGinancialServicesAndMarketsAuthority',
        text: 'Belgium - Financial Services and Markets Authority (FSMA)',
    },
    {
        id: 'bulgariaFinancialSupervisionCommission',
        text: 'Bulgaria - Комисията за финансов надзор / Financial Supervision Commission (FSC)',
    },
    {
        id: 'croatianFinancialServicesSupervisoryAgency',
        text: 'Croatia - Hrvatska agencija za nadzor financijskih usluga / Croatian Financial Services Supervisory Agency (HANFA)',
    },
    {
        id: 'cyprusSecuritiesAndExchangeCommission',
        text: 'Cyprus - Cyprus Securities and Exchange Commission (CySEC)',
    },
    {
        id: 'cyprusCentralBankOfCyprus',
        text: 'Cyprus - Central Bank of Cyprus (CBC)',
    },
    {
        id: 'czechNationalBank',
        text: 'Czech Republic - Česká národní banka / Czech National Bank (CNB)',
    },
    {
        id: 'denmarkFinanstilsynet',
        text: 'Denmark - Finanstilsynet (Danish FSA)',
    },
    {
        id: 'estoniaFinantsinspektsioon',
        text: 'Estonia - Finantsinspektsioon (FSA)',
    },
    {
        id: 'finlandFinancialSupervisoryAuthority',
        text: 'Finland - Finanssivalvonta / Financial Supervisory Authority (FIN - FSA)',
    },
    {
        id: 'finlandMinistryOfFinance',
        text: 'Finland - Ministry of Finance',
    },
    {
        id: 'franceMinistryOfEconomyAndFinance',
        text: 'France - Ministry of Economy and Finance',
    },
    {
        id: 'franceACPR',
        text: 'France - ACPR',
    },
    {
        id: 'franceAutoriteDesMarchesFinanciers',
        text: 'France - Autorité des Marchés Financiers (AMF)',
    },
    {
        id: 'germanyBavarianMinistryOfEconomicAffairsEnergyAndTechnology',
        text: 'Germany - Bavarian Ministry of Economic Affairs, Energy and Technology',
    },
    {
        id: 'germanyBundesanstaltFurFinanzdienstleistungsaufsicht',
        text: 'Germany - Bundesanstalt für Finanzdienstleistungsaufsicht (BaFIN)',
    },
    {
        id: 'germanyExchangeSupervisoryAuthorityBerlin',
        text: 'Germany - Exchange Supervisory Authority Berlin (Senate Department for Economics, Energy and Public Enterprises)',
    },
    {
        id: 'germanyExchangeSupervisoryAuthorityOfTheSaxonState',
        text: 'Germany - Exchange Supervisory Authority of the Saxon State (Ministry for Economic Affairs, Labor and Transport)',
    },
    {
        id: 'germanyFinancialAdministrationOfTheCityOfHamburg',
        text: 'Germany - Financial Administration of the City of Hamburg',
    },
    {
        id: 'germanyMinistryOfEconomicAffairsLabourAndHousingBadenWuerttemberg',
        text: 'Germany - Ministry of Economic Affairs, Labour and Housing Baden - Wuerttemberg',
    },
    {
        id: 'germanyMinistryOfEconomicAffairsEmploymentTransportAndDigitalisationOfLowerSaxony',
        text: 'Germany - Ministry of Economic Affairs, Employment, Transport and Digitalisation of Lower Saxony',
    },
    {
        id: 'germanyMinistryOfEconomicsEnergyTransportAndRegionalDevelopmentStateOfHesse',
        text: 'Germany - Ministry of Economics, Energy, Transport and Regional Development, State of Hesse',
    },
    {
        id: 'germanyMinistryOfFinanceOfTheStateOfNorthRhineWestphalia',
        text: 'Germany - Ministry of Finance of the State of North Rhine - Westphalia',
    },
    {
        id: 'greeceHellenicCapitalMarketCommission',
        text: 'Greece - Ελληνική Επιτροπή Κεφαλαιαγοράς / Hellenic Capital Market Commission (HCMC)',
    },
    {
        id: 'greeceBankOfGreece',
        text: 'Greece - Τράπεζα Ελλάδος / Bank of Greece',
    },
    {
        id: 'hungaryMagyarNemzetiBank',
        text: 'Hungary - Magyar Nemzeti Bank (MNB)',
    },
    {
        id: 'irelandCentralBankOfIreland',
        text: 'Ireland - Central Bank of Ireland',
    },
    {
        id: 'italyCommissioneNazionalePerLeSocietaELaBorsa',
        text: 'Italy - Commissione Nazionale per le Società e la Borsa (Consob)',
    },
    {
        id: 'italyBankOfItaly',
        text: 'Italy - Banca d’Italia / Bank of Italy',
    },
    {
        id: 'latviaFinancialAndCapitalMarketCommission',
        text: 'Latvia - Finansu un Kapitala Tirgus Komisija / Financial and Capital Market Commission (FKTK)',
    },
    {
        id: 'lithuaniaBankOfLithuania',
        text: 'Lithuania - Lietuvos Bankas / Bank of Lithuania',
    },
    {
        id: 'luxembourgCommissionDeSurveillanceDuSecteurFinancier',
        text: 'Luxembourg - Commission de Surveillance du Secteur Financier (CSSF)',
    },
    {
        id: 'maltaMaltaFinancialServicesAuthority',
        text: 'Malta - Malta Financial Services Authority (MFSA)',
    },
    {
        id: 'netherlandsAutoriteitFinancieleMarkten',
        text: 'Netherlands - Autoriteit Financiele Markten (AFM)',
    },
    {
        id: 'polandPolishFinancialSupervisionAuthority',
        text: 'Poland - Komisja Nadzoru Finansowego / Polish Financial Supervision Authority (KNF)',
    },
    {
        id: 'portugalComissaoDoMercadoDeVa',
        text: 'Portugal - Comissão do Mercado de Va - lores Mobiliários (CMVM)',
    },
    {
        id: 'portugalBancoDePortugal',
        text: 'Portugal - Banco de Portugal',
    },
    {
        id: 'portugalMinistryOfFinance',
        text: 'Portugal - Ministry of Finance',
    },
    {
        id: 'romaniaFinancialSupervisoryAuthority',
        text: 'Romania - Autoritatea de Supraveghere Financiară - Financial Supervisory Authority (ASF)',
    },
    {
        id: 'romaniaNationalBankOfRomania',
        text: 'Romania - Banca Naţională a României - National Bank of Romania (BNR)',
    },
    {
        id: 'slovakiaNationalBankOfSlovakia',
        text: 'Slovakia - Národná Banka Slovenska / National Bank of Slovakia (NBS)',
    },
    {
        id: 'sloveniaSecuritiesMarketAgency',
        text: 'Slovenia - Agencija za trg Vrednostnih Papirjev / Securities Market Agency',
    },
    {
        id: 'spainComisionNacionalDelMercadoDeValores',
        text: 'Spain - Comisión Nacional del Mercado de Valores (CNMV)',
    },
    {
        id: 'swedenFinansinspektionen',
        text: 'Sweden - Finansinspektionen (FI)',
    },
    {
        id: 'swedenTheSwedishCompaniesRegistrationOffice',
        text: 'Sweden - Bolagsverket / The Swedish Companies Registration Office',
    },
    {
        id: 'unitedKingdomFinancialConductAuthority',
        text: 'United Kingdom - Financial Conduct Authority (FCA)',
    },
    {
        id: 'unitedKingdomPrudentialRegulationAuthority',
        text: 'United Kingdom - Prudential Regulation Authority (PRA)',
    },
    {
        id: 'unitedKingdomBankOfEngland',
        text: 'United Kingdom - Bank of England',
    },
    {
        id: 'unitedKingdomGibraltarFinancialServicesCommission',
        text: 'United Kingdom - Gibraltar Financial Services Commission (GFSC)',
    },
    {
        id: 'other',
        text: 'Other',
    },
];

export const booleanControls = [
    'commercialDomiciliation',
    'activitiesBenefitFromExperience',
    'trainingKnowledgeSkills',
    'knowledgeUCI',
    'knowledgeFundsAndRisks',
    'prospectusKIIDUnderstanding',
    'knowledgeSkillsPlaceUCIOrders',
    'activityRegulated',
    'companyListed',
    'naturesSameInvestmentCrossAm',
    'objectivesSameInvestmentCrossAm',
    'constraintsSameInvestmentCrossAm',
    'optFor',
    'optForPro',
    'optForNonPro',
    'operatorsHasExperienceNeuCP',
    'exerciseControl',
    'isLegalRepresentative',
    'isPoliticallyExposed',
    // 'investmentDecisionsAdHocCommittee', /* investmentDecisionsAdHocCommittee is VARCHAR in tblIznKycRiskObjective */
    'hasAlreadyInvestedNeuCp',
    'hasEverIssuedNeuCp',
];

export const currencyControls = [
    'balanceSheetTotal',
    'netRevenuesNetIncome',
    'shareCapital',
    'shareholderEquity',
    'typeOfRevenuesValue',
];

export const percentageControls = [
    'riskAcceptanceLevel1',
    'riskAcceptanceLevel2',
    'riskAcceptanceLevel3',
    'riskAcceptanceLevel4',
    'holdingPercentage',
    'floatableShares',
    'votingPercentage',
    'percentCapitalHeldByState',
];

export const fileControls = [
    'documentID',
    'electronicSignatureDocumentID',
];

export const checkboxControls = [
    'capitalNature',
    'financialInstruments',
    'marketArea',
    'financialAssetManagementMethod',
    'investmentvehiclesAlreadyUsed',
    'frequencyFinancialTransactions',
    'clientNeeds',
    'investmentHorizonWanted',
    'performanceProfile',
];

export const selectControls = [
    'custodianHolderAccount',
    'custodianCountry',
    'financialInstruments',
    'marketArea',
    'natureTransactionPerYear',
    'volumeTransactionPerYear',
    'activities',
    'sectorActivity',
    'otherSectorActivity',
    'otherIdentificationNumberType',
    'listingMarkets',
    'multilateralTradingFacilities',
    'investorOnBehalfThirdParties',
    'geographicalAreaOfActivity',
    'nationality',
    'countryOfBirth',
    'geographicalOrigin1',
    'geographicalOrigin2',
    'legalForm',
    'registeredCompanyCountry',
    'countryTaxResidence',
    'countryRegistration',
    'regulatoryStatus',
    'regulatoryStatusInsurerType',
    'riskProfile',
    'nationalIdNumberType',
    'relationType',
    'holdingType',
    'parent',
    'country',
    'financialRating',
    'regulator',
];

export const controlOrder = [
    // General
    'registeredCompanyName',
    'commercialName',
    'legalForm',
    'leiCode',
    'otherIdentificationNumberType',
    'otherIdentificationNumberTypeSpecify',
    'otherIdentificationNumberText',
    'shareCapital',
    'financialRating',
    'registeredCompanyAddressLine1',
    'registeredCompanyAddressLine2',
    'registeredCompanyZipCode',
    'registeredCompanyCity',
    'registeredCompanyCountry',
    'commercialDomiciliation',
    'commercialAddressLine1',
    'commercialAddressLine2',
    'commercialZipCode',
    'commercialCity',
    'commercialCountry',
    'countryTaxResidence',
    'countryRegistration',

    // Company
    'sectorActivity',
    'sectorActivityText',
    'otherSectorActivity',
    'otherSectorActivityText',
    'corporatePurpose',
    'geographicalAreaOfActivity',
    'geographicalAreaOfActivitySpecification',
    'activityRegulated',
    'regulator',
    'otherRegulator',
    'approvalNumber',
    'regulatoryStatus',
    'regulatoryStatusInsurerType',
    'regulatoryStatusListingOther',
    'companyListed',
    'listingMarkets',
    'otherListingMarkets',
    'multilateralTradingFacilities',
    'otherMultilateralTradingFacilities',
    'bloombergCode',
    'isinCode',
    'floatableShares',
    'companyStateOwned',
    'activities',
    'investorOnBehalfThirdParties',
    'balanceSheetTotal',
    'netRevenuesNetIncome',
    'shareholderEquity',
    'capitalNature',
    'otherCapitalNature',
    'geographicalOrigin1',
    'geographicalOrigin2',
    'totalFinancialAssetsAlreadyInvested',
    'typeOfRevenues',
    'typeOfRevenuesValue',

    // Classification
    'investorStatus',
    'optForPro',
    'optForNonPro',
    'excludeProducts',
    'firstName',
    'lastName',
    'jobPosition',
    'numberYearsExperienceRelatedFunction',
    'numberYearsCurrentPosition',
    'financialInstruments',
    'financialInstrumentsSpecification',
    'marketArea',
    'natureTransactionPerYear',
    'volumeTransactionPerYear',
    'activitiesBenefitFromExperience',
    'activitiesBenefitFromExperienceSpecification',
    'trainingKnowledgeSkills',
    'trainingKnowledgeSkillsSpecification',
    'knowledgeUCI',
    'knowledgeFundsAndRisks',
    'prospectusKIIDUnderstanding',
    'knowledgeSkillsPlaceUCIOrders',
];

export const countries = fundItems.domicileItems;

export const legalFormList = [
    {
        id: 'EARL',
        text: 'EARL: Entreprise agricole à responsabilité limitée',
    },
    {
        id: 'EI',
        text: 'EI: Entreprise individuelle',
    },
    {
        id: 'EIRL',
        text: 'EIRL: Entreprise individuelle à responsabilité limitée',
    },
    {
        id: 'EURL',
        text: 'EURL: Entreprise unipersonnelle à responsabilité limitée',
    },
    {
        id: 'GAEC',
        text: "GAEC: Groupement agricole d'exploitation en commun",
    },
    {
        id: 'GEIE',
        text: "GEIE: Groupement européen d'intérêt économique",
    },
    {
        id: 'GIE',
        text: 'GIE: Groupement d\'intérêt économique',
    },
    {
        id: 'SARL',
        text: 'SARL: Société à responsabilité limitée',
    },
    {
        id: 'SA',
        text: 'SA: Société anonyme',
    },
    {
        id: 'SAS',
        text: 'SAS: Société par actions simplifiée',
    },
    {
        id: 'SASU',
        text: 'SASU: Société par actions simplifiée unipersonnelle',
    },
    {
        id: 'SC',
        text: 'SC: Société civile',
    },
    {
        id: 'SCA',
        text: 'SCA: Société en commandite par actions',
    },
    {
        id: 'SCI',
        text: 'SCI: Société civile immobilière',
    },
    {
        id: 'SCIC',
        text: "SCIC: Société coopérative d'intérêt collectif",
    },
    {
        id: 'Partnership',
        text: 'Partnership',
    },
    {
        id: 'Unincorporatedassociation',
        text: 'Unincorporated association',
    },
    {
        id: 'SoleTrader',
        text: 'Sole Trader',
    },
    {
        id: 'LimitedPartnership',
        text: 'Limited Partnership',
    },
    {
        id: 'Trust',
        text: 'Trust',
    },
    {
        id: 'foundationAssociationEIG',
        text: 'Foundation / Association / EIG',
    },
    {
        id: 'LimitedCompany',
        text: 'Limited Company',
    },
    {
        id: 'LLP',
        text: 'LLP:Limited Liability Partnership',
    },
    {
        id: 'CIC',
        text: 'CIC:Community Interest Company',
    },
    {
        id: 'CIO',
        text: 'CIO:Charitable Incorporated Organisation',
    },
    {
        id: 'Coop',
        text: 'Co-op:Co-operative Society',
    },
    {
        id: 'BenCom',
        text: 'BenCom: Community Benefit Society',
    },
    {
        id: 'BuildingSocietyBuilding',
        text: 'Building Society Building',
    },
    {
        id: 'CreditUnion',
        text: 'Credit Union',
    },
    {
        id: 'FriendlySociety',
        text: 'Friendly Society',
    },
];

export const sectorActivityList = [
    {
        id: 'Cosmetics',
        text: 'Cosmetics',
    },
    {
        id: 'ConsumerElectronics',
        text: 'Consumer Electronics',
    },
    {
        id: 'Appliances',
        text: 'Appliances',
    },
    {
        id: 'Sportingequipmentmanufacturers',
        text: 'Sporting equipment manufacturers',
    },
    {
        id: 'Luxury',
        text: 'Luxury',
    },
    {
        id: 'Heavyindustryexcludingenergy',
        text: 'Heavy industry (excluding energy)',
    },
    {
        id: 'Industrialmachinery',
        text: 'Industrial machinery',
    },
    {
        id: 'Electricalequipment',
        text: 'Electrical equipment',
    },
    {
        id: 'AeronauticsAerospaceandDefense',
        text: 'Aeronautics, Aerospace and Defense',
    },
    {
        id: 'Buildingconstructionandpublicworks',
        text: 'Building, construction and public works',
    },
    {
        id: 'Cement',
        text: 'Cement',
    },
    {
        id: 'Chemistry',
        text: 'Chemistry',
    },
    {
        id: 'AutomobileManufacturers',
        text: 'Automobile Manufacturers',
    },
    {
        id: 'Tires',
        text: 'Tires',
    },
    {
        id: 'InformationandCommunicationTechnologies',
        text: 'Information and Communication Technologies',
    },
    {
        id: 'Telecommunicationsoperators',
        text: 'Telecommunications operators',
    },
    {
        id: 'Advertising',
        text: 'Advertising',
    },
    {
        id: 'TelecommunicationNetworkEquipmentManufacturer',
        text: 'Telecommunication and Network Equipment Manufacturers',
    },
    {
        id: 'ProgrammingSoftware',
        text: 'Programming & Software',
    },
    {
        id: 'Mobilephones',
        text: 'Mobile phones',
    },
    {
        id: 'Computerequipment',
        text: 'Computer equipment',
    },
    {
        id: 'ITtechnologiesandservices',
        text: 'IT technologies and services',
    },
    {
        id: 'Transportation',
        text: 'Transportation',
    },
    {
        id: 'Airlines',
        text: 'Airlines',
    },
    {
        id: 'Railtransport',
        text: 'Rail transport',
    },
    {
        id: 'Shippingofgoods',
        text: 'Shipping of goods',
    },
    {
        id: 'Cruises',
        text: 'Cruises',
    },
    {
        id: 'Postmailanddeliveries',
        text: 'Post, mail and deliveries',
    },
    {
        id: 'Health',
        text: 'Health',
    },
    {
        id: 'Medicalequipmentandhealthproducts',
        text: 'Medical equipment and health products',
    },
    {
        id: 'Pharmacy',
        text: 'Pharmacy',
    },
    {
        id: 'Tobacco',
        text: 'Tobacco',
    },
    {
        id: 'Catering',
        text: 'Catering',
    },
    {
        id: 'Realestate',
        text: 'Real Estate',
    },
    {
        id: 'Miningactivities',
        text: 'Mining activities',
    },
    {
        id: 'Other',
        text: 'Other',
    },
];

export const otherSectorActivityList = [
    {
        id: 'Cosmetics',
        text: 'Cosmetics',
    },
    {
        id: 'ConsumerElectronics',
        text: 'Consumer Electronics',
    },
    {
        id: 'Appliances',
        text: 'Appliances',
    },
    {
        id: 'Sportingequipmentmanufacturers',
        text: 'Sporting equipment manufacturers',
    },
    {
        id: 'Luxury',
        text: 'Luxury',
    },
    {
        id: 'Heavyindustryexcludingenergy',
        text: 'Heavy industry (excluding energy)',
    },
    {
        id: 'Industrialmachinery',
        text: 'Industrial machinery',
    },
    {
        id: 'Electricalequipment',
        text: 'Electrical equipment',
    },
    {
        id: 'AeronauticsAerospaceandDefense',
        text: 'Aeronautics, Aerospace and Defense',
    },
    {
        id: 'Buildingconstructionandpublicworks',
        text: 'Building, construction and public works',
    },
    {
        id: 'Cement',
        text: 'Cement',
    },
    {
        id: 'Chemistry',
        text: 'Chemistry',
    },
    {
        id: 'AutomobileManufacturers',
        text: 'Automobile Manufacturers',
    },
    {
        id: 'Tires',
        text: 'Tires',
    },
    {
        id: 'InformationandCommunicationTechnologies',
        text: 'Information and Communication Technologies',
    },
    {
        id: 'Telecommunicationsoperators',
        text: 'Telecommunications operators',
    },
    {
        id: 'Advertising',
        text: 'Advertising',
    },
    {
        id: 'TelecommunicationNetworkEquipmentManufacturer',
        text: 'Telecommunication and Network Equipment Manufacturers',
    },
    {
        id: 'ProgrammingSoftware',
        text: 'Programming & Software',
    },
    {
        id: 'Mobilephones',
        text: 'Mobile phones',
    },
    {
        id: 'Computerequipment',
        text: 'Computer equipment',
    },
    {
        id: 'ITtechnologiesandservices',
        text: 'IT technologies and services',
    },
    {
        id: 'Transportation',
        text: 'Transportation',
    },
    {
        id: 'Airlines',
        text: 'Airlines',
    },
    {
        id: 'Railtransport',
        text: 'Rail transport',
    },
    {
        id: 'Shippingofgoods',
        text: 'Shipping of goods',
    },
    {
        id: 'Cruises',
        text: 'Cruises',
    },
    {
        id: 'Postmailanddeliveries',
        text: 'Post, mail and deliveries',
    },
    {
        id: 'Health',
        text: 'Health',
    },
    {
        id: 'Medicalequipmentandhealthproducts',
        text: 'Medical equipment and health products',
    },
    {
        id: 'Pharmacy',
        text: 'Pharmacy',
    },
    {
        id: 'Tobacco',
        text: 'Tobacco',
    },
    {
        id: 'Catering',
        text: 'Catering',
    },
    {
        id: 'Realestate',
        text: 'Real Estate',
    },
    {
        id: 'Miningactivities',
        text: 'Mining activities',
    },
    {
        id: 'Other',
        text: 'Other',
    },
];

export const listingMarketsList = [
    {
        id: 'lm001',
        text: 'FISH POOL ASA',
    },
    {
        id: 'lm002',
        text: 'NASDAQ OSLO ASA',
    },
    {
        id: 'lm003',
        text: 'MONEP',
    },
    {
        id: 'lm004',
        text: 'OSLO AXESS',
    },
    {
        id: 'lm005',
        text: 'NOREXECO ASA',
    },
    {
        id: 'lm006',
        text: 'Powernext SAS',
    },
    {
        id: 'lm007',
        text: 'OSLO BØRS ASA',
    },
    {
        id: 'lm008',
        text: 'Euronext Paris SA',
    },
    {
        id: 'lm009',
        text: 'MATIF',
    },
    {
        id: 'lm010',
        text: 'Mercado de Renta Fija, AIAF',
    },
    {
        id: 'lm011',
        text: 'Mercado Electrónico de Renta Fija, MERF',
    },
    {
        id: 'lm012',
        text: 'Bolsa de Barcelona',
    },
    {
        id: 'lm013',
        text: 'NASDAQ COPENHAGEN A/S',
    },
    {
        id: 'lm014',
        text: 'MEFF',
    },
    {
        id: 'lm015',
        text: 'Bolsa de Bilbao',
    },
    {
        id: 'lm016',
        text: 'Mercado de Renta Fija,AIAF',
    },
    {
        id: 'lm017',
        text: 'Bolsa de Valencia',
    },
    {
        id: 'lm018',
        text: 'Bolsa de Madrid',
    },
    {
        id: 'lm019',
        text: 'Nasdaq Copenhagen A/S',
    },
    {
        id: 'lm020',
        text: 'Nasdaq Copenhagen - Auction on Demand',
    },
    {
        id: 'lm021',
        text: 'Borsa Italiana S.P.A. - ETFPlus',
    },
    {
        id: 'lm022',
        text: 'Borsa Italiana S.P.A. - Mercato Telematico Azionario',
    },
    {
        id: 'lm023',
        text: 'Borsa Italiana S.P.A. - MOT',
    },
    {
        id: 'lm024',
        text: 'Borsa Italiana S.P.A. - MIV',
    },
    {
        id: 'lm025',
        text: 'Borsa Italiana S.P.A. - IDEM',
    },
    {
        id: 'lm026',
        text: 'MTS S.P.A. - MTS Italia',
    },
    {
        id: 'lm027',
        text: 'Burza cenných papírů Praha, a.s.',
    },
    {
        id: 'lm028',
        text: 'RM-SYSTÉM, česká burza cenných papírů',
    },
    {
        id: 'lm029',
        text: 'Bourse de Luxembourg',
    },
    {
        id: 'lm030',
        text: 'Nasdaq Helsinki Oy',
    },
    {
        id: 'lm031',
        text: 'DUESSELDORFER BOERSE (REGULIERTER MARKT)',
    },
    {
        id: 'lm032',
        text: 'BOERSE BERLIN (REGULIERTER MARKT)',
    },
    {
        id: 'lm033',
        text: 'Börse Berlin (Berlin Second Regulated Market)',
    },
    {
        id: 'lm034',
        text: 'BADEN-WUERTTEMBERGISCHE WERTPAPIERBOERSE (REGULIERTER MARKT - TECHNICAL PLATFORM 2)',
    },
    {
        id: 'lm035',
        text: 'BADEN-WUERTTEMBERGISCHE WERTPAPIERBOERSE (REGULIERTER MARKT)',
    },
    {
        id: 'lm036',
        text: 'Boerse Hamburg Lang and Schwarz Exchange (Regulierter Markt)',
    },
    {
        id: 'lm037',
        text: 'HANSEATISCHE WERTPAPIERBOERSE HAMBURG (REGULIERTER MARKT)',
    },
    {
        id: 'lm038',
        text: 'DUESSELDORFER BOERSE QUOTRIX (REGULIERTER MARKT)',
    },
    {
        id: 'lm039',
        text: 'NIEDERSAECHSICHE BOERSE ZU HANNOVER (REGULIERTER MARKT)',
    },
    {
        id: 'lm040',
        text: 'BOERSE MUENCHEN - GETTEX - REGULIERTER MARKT',
    },
    {
        id: 'lm041',
        text: 'EUROPEAN ENERGY EXCHANGE (REGULIERTER MARKT)',
    },
    {
        id: 'lm042',
        text: 'BOERSE MUENCHEN  (REGULIERTER MARKT)',
    },
    {
        id: 'lm043',
        text: 'TRADEGATE EXCHANGE (REGULIERTER MARKT)',
    },
    {
        id: 'lm044',
        text: 'BOERSE BERLIN EQUIDUCT TRADING (BERLIN SECOND REGULATED MARKET)',
    },
    {
        id: 'lm045',
        text: 'BOERSE BERLIN EQUIDUCT TRADING (REGULIERTER MARKT)',
    },
    {
        id: 'lm046',
        text: 'FRANKFURTER WERTPAPIERBOERSE (REGULIERTER MARKT)',
    },
    {
        id: 'lm047',
        text: 'XETRA (REGULIERTER MARKT)',
    },
    {
        id: 'lm048',
        text: 'EUREX DEUTSCHLAND',
    },
    {
        id: 'lm049',
        text: 'Zagrebačka burza d.d.',
    },
    {
        id: 'lm050',
        text: 'Euronext Brussels Derivatives',
    },
    {
        id: 'lm051',
        text: 'Euronext Brussels',
    },
    {
        id: 'lm052',
        text: 'Wiener Börse AG',
    },
    {
        id: 'lm053',
        text: 'Ljubljana Stock Exchange Inc.',
    },
    {
        id: 'lm054',
        text: 'CYPRUS STOCK EXCHANGE',
    },
    {
        id: 'lm055',
        text: 'Nasdaq Iceland hf.',
    },
    {
        id: 'lm056',
        text: 'NASDAQ Tallinn Aktsiaselts',
    },
    {
        id: 'lm057',
        text: 'Nxchange B.V.',
    },
    {
        id: 'lm058',
        text: 'Euronext Amsterdam N.V.',
    },
    {
        id: 'lm059',
        text: 'Malta Stock Exchange',
    },
    {
        id: 'lm060',
        text: 'ICE Endex Markets B.V.',
    },
    {
        id: 'lm061',
        text: 'Institutional Financial Securities Market',
    },
    {
        id: 'lm062',
        text: 'HUDEX Energiatőzsde Zrt.',
    },
    {
        id: 'lm063',
        text: 'Nasdaq Vilnius, AB',
    },
    {
        id: 'lm064',
        text: 'European Wholesale Securities Market',
    },
    {
        id: 'lm065',
        text: 'Nasdaq Riga AS',
    },
    {
        id: 'lm066',
        text: 'Giełda Papierów Wartościowych w Warszawie S.A.',
    },
    {
        id: 'lm067',
        text: 'Towarowa Giełda Energii S.A.',
    },
    {
        id: 'lm068',
        text: 'Giełda Papierów Wartościowych w Warszawie S.A.',
    },
    {
        id: 'lm069',
        text: 'BondSpot S.A.',
    },
    {
        id: 'lm070',
        text: 'The Irish Stock Exchange plc',
    },
    {
        id: 'lm071',
        text: 'EURONEXT - MERCADO DE FUTUROS E OPÇÕES',
    },
    {
        id: 'lm072',
        text: 'OMIP - Pólo Português, S.G.M.R., SA',
    },
    {
        id: 'lm073',
        text: 'Euronext Lisbon - Sociedade Gestora de Mercados Regulamentados, SA',
    },
    {
        id: 'lm074',
        text: 'Nasdaq Stockholm AB - EUR WB EQ Derivatives',
    },
    {
        id: 'lm075',
        text: 'Nasdaq Stockholm AB - Finnish EQ Derivatives',
    },
    {
        id: 'lm076',
        text: 'Nasdaq Stockholm AB',
    },
    {
        id: 'lm077',
        text: 'Nasdaq Stockholm AB - Danish EQ Derivatives',
    },
    {
        id: 'lm078',
        text: 'Nasdaq Stockholm AB - EUR FI Derivated',
    },
    {
        id: 'lm079',
        text: 'Nasdaq Stockholm AB - Commodities',
    },
    {
        id: 'lm080',
        text: 'Nasdaq Stockholm AB - Pan Nordic EQ Derivatives',
    },
    {
        id: 'lm081',
        text: 'Nasdaq Stockholm AB - USD WB EQ Derivatives',
    },
    {
        id: 'lm082',
        text: 'Nasdaq Stockholm AB - Norwegian FI Derivatives',
    },
    {
        id: 'lm083',
        text: 'Nasdaq Stockholm AB - Danish FI Derivatives',
    },
    {
        id: 'lm084',
        text: 'Nasdaq Stockholm AB - Nordic@Mid',
    },
    {
        id: 'lm085',
        text: 'Nasdaq Stockholm AB - Norwegian EQ Derivatives',
    },
    {
        id: 'lm086',
        text: 'Nasdaq Stockholm AB - Auction on Demand',
    },
    {
        id: 'lm087',
        text: 'Nasdaq Stockholm AB - Swedish EQ Derivatives',
    },
    {
        id: 'lm088',
        text: 'Nordic Growth Market NGM AB',
    },
    {
        id: 'lm089',
        text: 'Cboe Europe Equities Regulated Market – Integrated Book Segment',
    },
    {
        id: 'lm090',
        text: 'London Metal Exchange',
    },
    {
        id: 'lm091',
        text: 'Cboe Europe Equities Regulated Market – Reference Price Book Segment',
    },
    {
        id: 'lm092',
        text: 'Cboe Europe Equities Regulated Market – Off-Book Segment',
    },
    {
        id: 'lm093',
        text: 'London Stock Exchange Regulated Market (derivatives)',
    },
    {
        id: 'lm094',
        text: 'NEX Exchange Main Board (non-equity)',
    },
    {
        id: 'lm095',
        text: 'London Stock Exchange Regulated Market',
    },
    {
        id: 'lm096',
        text: 'NEX Exchange Main Board (equity)',
    },
    {
        id: 'lm097',
        text: 'Euronext London Regulated Market',
    },
    {
        id: 'lm098',
        text: 'Bursa de Valori Bucuresti SA',
    },
    {
        id: 'lm099',
        text: 'Budapesti Értéktőzsde Zrt. (Budapest Stock Exchange)',
    },
    {
        id: 'lm100',
        text: 'Nasdaq Helsinki Oy - Auction on Demand',
    },
    {
        id: 'lm101',
        text: 'Nasdaq Helsinki Oy - Nordic@Mid',
    },
    {
        id: 'lm102',
        text: 'Hellenic Exchanges - Athens Stock Exchange SA',
    },
    {
        id: 'lm103',
        text: 'Hellenic Exchanges - Athens Stock Exchange SA',
    },
    {
        id: 'lm104',
        text: 'ELECTRONIC SECONDARY SECURITIES MARKET',
    },
    {
        id: 'lm105',
        text: 'Giełda Papierów Wartościowych w Warszawie S.A.',
    },
    {
        id: 'lm106',
        text: 'ICE FUTURES EUROPE',
    },
    {
        id: 'lm107',
        text: 'ICE FUTURES EUROPE - AGRICULTURAL PRODUCTS DIVISION',
    },
    {
        id: 'lm108',
        text: 'ICE FUTURES EUROPE - FINANCIAL PRODUCTS DIVISION',
    },
    {
        id: 'lm109',
        text: 'ICE FUTURES EUROPE - EQUITY PRODUCTS DIVISION',
    },
    {
        id: 'lm110',
        text: 'Nasdaq Stockholm AB - Norway ETF',
    },
    {
        id: 'lm111',
        text: 'BULGARIAN STOCK EXCHANGE',
    },
    {
        id: 'lm112',
        text: 'EURONEXT EQF, EQUITIES AND INDICES DERIVATIVES',
    },
    {
        id: 'lm113',
        text: 'EURONEXT COM, COMMODITIES FUTURES AND OPTIONS',
    },
    {
        id: 'lm114',
        text: 'Burza cenných papierov v Bratislave, a.s.',
    },
    {
        id: 'lmXXX',
        text: 'Other',
    },
];

export const multilateralTradingFacilitiesList = [
    {
        id: 'mtf001',
        text: 'MTS France SAS',
     },
     {
        id: 'mtf003',
        text: 'MERKUR MARKET',
     },
     {
        id: 'mtf004',
        text: 'OSLO CONNECT',
     },
     {
        id: 'mtf005',
        text: 'Marché Libre Paris',
     },
     {
        id: 'mtf006',
        text: 'Mercado Alternativo de Renta Fija (MARF)',
     },
     {
        id: 'mtf007',
        text: 'Sistema Electrónico de Negociación de Activos Financieros (SENAF)',
     },
     {
        id: 'mtf008',
        text: 'Mercado Alternativo Bursátil (MAB SMN)',
     },
     {
        id: 'mtf009',
        text: 'Mercado de Valores Latinoamericanos (Latibex SMN)',
     },
     {
        id: 'mtf010',
        text: 'First North Denmark - Nordic@MID',
     },
     {
        id: 'mtf011',
        text: 'First North Denamrk - Auction at Demand',
     },
     {
        id: 'mtf013',
        text: 'Hi-MTF SIM S.P.A. - HI-MTF',
     },
     {
        id: 'mtf014',
        text: 'Borsa Italiana S.P.A. - ExtraMOT',
     },
     {
        id: 'mtf015',
        text: 'Borsa Italiana S.P.A. - Mercato Borsa Italiana Equity MTF',
     },
     {
        id: 'mtf017',
        text: 'HI-MTF SIM S.P.A. -  HI-MTF RFQ',
     },
     {
        id: 'mtf018',
        text: 'E-MID SIM S.p.A. - E-MID REPO',
     },
     {
        id: 'mtf019',
        text: 'Borsa Italiana S.P.A. -SeDeX',
     },
     {
        id: 'mtf021',
        text: 'HI-MTF SIM S.P.A. - ITALY HI-MTF Order Driven',
     },
     {
        id: 'mtf022',
        text: 'Borsa Italiana S.P.A. - AIM Italia/MercatO',
     },
     {
        id: 'mtf023',
        text: 'Euro MTF',
     },
     {
        id: 'mtf024',
        text: 'First North Finland',
     },
     {
        id: 'mtf025',
        text: 'BOERSE MUENCHEN - GETTEX - FREIVERKEHR',
     },
     {
        id: 'mtf026',
        text: 'BOERSE MUENCHEN (FREIVERKEHR)',
     },
     {
        id: 'mtf027',
        text: 'HANSEATISCHE WERTPAPIERBOERSE HAMBURG (FREIVERKEHR)',
     },
     {
        id: 'mtf028',
        text: 'BADEN- WUERTTEMBERGISCHE WERTPAPIERBOERSE (FREIVERKEHR - TECHNICAL PLATFORM 2)',
     },
     {
        id: 'mtf029',
        text: 'DUESSELDORFER BOERSE (FREIVERKEHR)',
     },
     {
        id: 'mtf030',
        text: 'NIEDERSAECHSICHE BOERSE ZU HANNOVER (FREIVERKEHR)',
     },
     {
        id: 'mtf031',
        text: 'BADEN- WUERTTEMBERGISCHE WERTPAPIERBOERSE (FREIVERKEHR)',
     },
     {
        id: 'mtf032',
        text: 'TRADEGATE EXCHANGE (FREIVERKEHR)',
     },
     {
        id: 'mtf033',
        text: 'Boerse Hamburg Lang and Schwarz Exchange (Freiverkehr)',
     },
     {
        id: 'mtf034',
        text: 'DUESSELDORFER BOERSE QUOTRIX (FREIVERKEHR)',
     },
     {
        id: 'mtf035',
        text: 'BOERSE BERLIN (FREIVERKEHR)',
     },
     {
        id: 'mtf036',
        text: 'BOERSE BERLIN EQUIDUCT TRADING (FREIVERKEHR)',
     },
     {
        id: 'mtf037',
        text: 'FRANKFURTER WERTPAPIERBOERSE (FREIVERKEHR)',
     },
     {
        id: 'mtf038',
        text: 'FRANKFURTER WERTPAPIERBOERSE XETRA (FREIVERKEHR)',
     },
     {
        id: 'mtf039',
        text: 'MTS Finland',
     },
     {
        id: 'mtf040',
        text: 'Trading Facility',
     },
     {
        id: 'mtf041',
        text: 'Ventes Publiques (Expert Market)',
     },
     {
        id: 'mtf042',
        text: 'Euronext Growth Brussels (Alternext)',
     },
     {
        id: 'mtf043',
        text: 'MTS Belgium',
     },
     {
        id: 'mtf044',
        text: 'MTS Denmark',
     },
     {
        id: 'mtf045',
        text: 'Euronext Access Brussels',
     },
     {
        id: 'mtf046',
        text: 'Nasdaq Iceland hf.',
     },
     {
        id: 'mtf047',
        text: 'NASDAQ OMX Tallinn Aktsiaselts',
     },
     {
        id: 'mtf048',
        text: 'MTF - CYPRUS EXCHANGE',
     },
     {
        id: 'mtf049',
        text: 'Nasdaq Iceland hf.',
     },
     {
        id: 'mtf050',
        text: 'Captin B.V.',
     },
     {
        id: 'mtf051',
        text: 'Prospects',
     },
     {
        id: 'mtf052',
        text: 'Nasdaq Riga AS (First North Latvia)',
     },
     {
        id: 'mtf053',
        text: 'Wiener Börse AG',
     },
     {
        id: 'mtf054',
        text: '360 Treasury Systems AG',
     },
     {
        id: 'mtf056',
        text: 'EURONEXT ACCESS  LISBON',
     },
     {
        id: 'mtf057',
        text: 'Nasdaq First North Sweden - Norway',
     },
     {
        id: 'mtf058',
        text: 'Nasdaq First North Sweden',
     },
     {
        id: 'mtf059',
        text: 'Nordic Growth Market NGM AB',
     },
     {
        id: 'mtf060',
        text: 'Nasdaq First North Sweden - Nordic@Mid',
     },
     {
        id: 'mtf061',
        text: 'SI ENTER',
     },
     {
        id: 'mtf062',
        text: 'Cboe Europe Equities MTF – BXE Periodic Auction Book Segment',
     },
     {
        id: 'mtf063',
        text: 'Property Partner Exchange',
     },
     {
        id: 'mtf064',
        text: 'Cboe Europe Equities MTF – BXE Reference Price Book Segmen',
     },
     {
        id: 'mtf065',
        text: 'Cboe Europe Equities MTF – Cboe Large in Scale Service',
     },
     {
        id: 'mtf066',
        text: 'Euronext Block',
     },
     {
        id: 'mtf067',
        text: 'ICAP WCLK MTF',
     },
     {
        id: 'mtf068',
        text: 'NEX Exchange Growth Market (non-equity)',
     },
     {
        id: 'mtf069',
        text: 'NEX Exchange Trading (non-equity)',
     },
     {
        id: 'mtf070',
        text: 'Integral MTF',
     },
     {
        id: 'mtf071',
        text: 'EM Bonds MTF',
     },
     {
        id: 'mtf072',
        text: 'London Stock Exchange AIM MTF',
     },
     {
        id: 'mtf074',
        text: 'Dowgate MTF',
     },
     {
        id: 'mtf075',
        text: 'Bursa de Valori Bucuresti SA',
     },
     {
        id: 'mtf076',
        text: 'Giełda Papierów Wartościowych  Warszawie S.A.',
     },
     {
        id: 'mtf077',
        text: 'BondSpot S.A.',
     },
     {
        id: 'mtf078',
        text: 'NPEX B.V.',
     },
     {
        id: 'mtf079',
        text: 'The Irish Stock Exchange plc Atlantic Securities Market',
     },
     {
        id: 'mtf080',
        text: 'The Irish Stock Exchange plc Global Exchange Market',
     },
     {
        id: 'mtf081',
        text: 'BETA MARKET',
     },
     {
        id: 'mtf082',
        text: 'Xtend',
     },
     {
        id: 'mtf083',
        text: 'RM-SYSTÉM, česká burza cenných papírů a.s.',
     },
     {
        id: 'mtf084',
        text: 'Burza cenných papírů Praha, a.s.',
     },
     {
        id: 'mtf085',
        text: 'Nasdaq First North Sweden - Norway Nordic@Mid',
     },
     {
        id: 'mtf086',
        text: 'Nasdaq First North Sweden - Norway Auction on Demand',
     },
     {
        id: 'mtf087',
        text: 'Eurex Repo GmbH',
     },
     {
        id: 'mtf088',
        text: 'BlockMatch Request for Quote Functionality',
     },
     {
        id: 'mtf089',
        text: 'LMAX FX',
     },
     {
        id: 'mtf090',
        text: 'Turquoise Block AuctionsTM',
     },
     {
        id: 'mtf091',
        text: 'First North Finland - Nordic@Mid',
     },
     {
        id: 'mtf092',
        text: 'First North Finland - Auction on Demand',
     },
     {
        id: 'mtf093',
        text: 'Hellenic Exchanges - Athens Stock Exchange SA',
     },
     {
        id: 'mtf097',
        text: 'ICAP Global Derivatives Limited',
     },
     {
        id: 'mtf098',
        text: 'BlockMatch Negotiated Trade Functionality',
     },
     {
        id: 'mtf099',
        text: 'BlockMatch Dark Central Limit Order Book',
     },
     {
        id: 'mtf100',
        text: 'ICAP MTF - CASH EQUITY',
     },
     {
        id: 'mtf101',
        text: 'ICAP MTF - EQUITY DERIVATIVES',
     },
     {
        id: 'mtf102',
        text: 'ICAP MTF -  CORPORATE BONDS AND SECURITIES DEBT',
     },
     {
        id: 'mtf103',
        text: 'ICAP MTF - MONEY MARKET INSTRUMENTS',
     },
     {
        id: 'mtf104',
        text: 'ICAP MTF - GOVERNMENT BONDS EXCLUDING GILTS',
     },
     {
        id: 'mtf105',
        text: 'ICAP MTF - INTEREST RATE DERIVATIVES',
     },
     {
        id: 'mtf106',
        text: 'ICAP MTF - FX DERIVATIVES',
     },
     {
        id: 'mtf107',
        text: 'ICAP MTF - GILTS',
     },
     {
        id: 'mtf108',
        text: 'ICAP MTF - ETFS',
     },
     {
        id: 'mtf109',
        text: 'SIGMA X MTF - SIGMA X Auction Book',
     },
     {
        id: 'mtf111',
        text: 'I-SWAP - TRADE REGISTRATION',
     },
     {
        id: 'mtf112',
        text: 'I-SWAP ORDER BOOK',
     },
     {
        id: 'mtf113',
        text: 'TULLETT PREBON EUROPE - MTF - FX DERIVATIVES',
     },
     {
        id: 'mtf114',
        text: 'ICAP GLOBAL DERIVATIVES LIMITED - ELECTRONIC',
     },
     {
        id: 'mtf115',
        text: 'ICAP GLOBAL DERIVATIVES LIMITED - VOICE',
     },
     {
        id: 'mtf117',
        text: 'TULLETT PREBON EUROPE - MTF - CORPORATE BONDS AND SECURITISED DEBT',
     },
     {
        id: 'mtf118',
        text: 'TULLETT PREBON EUROPE - MTF - GOVERNMENT BONDS EXCLUDING UK GILTS',
     },
     {
        id: 'mtf119',
        text: 'TULLETT PREBON EUROPE - MTF - MONEY MARKETS',
     },
     {
        id: 'mtf120',
        text: 'TULLETT PREBON EUROPE - MTF - REPOS',
     },
     {
        id: 'mtf122',
        text: 'TULLETT PREBON SECURITIES - MTF - REPOS',
     },
     {
        id: 'mtf123',
        text: 'Spotlight Stock Market',
     },
     {
        id: 'mtf124',
        text: 'Nasdaq First North Sweden - Auction on Demand',
     },
     {
        id: 'mtf125',
        text: 'ATFUND MTF',
     },
     {
        id: 'mtf126',
        text: 'UBS MTF Periodic Auction',
     },
     {
        id: 'mtf127',
        text: 'UBS MTF',
     },
     {
        id: 'mtf128',
        text: 'Cboe Europe Equities MTF – BXE Integrated Book Segment',
     },
     {
        id: 'mtf129',
        text: 'Creditex Brokerage LLP - MTF',
     },
     {
        id: 'mtf130',
        text: 'Cboe Europe Equities MTF – CXE Integrated Book Segment',
     },
     {
        id: 'mtf132',
        text: 'TULLETT PREBON EUROPE - MTF - INTEREST RATE DERIVATIVES',
     },
     {
        id: 'mtf133',
        text: 'I-SWAP TARGETED STREAMING/RFQ',
     },
     {
        id: 'mtf135',
        text: 'Liquidnet Europe Fixed Income',
     },
     {
        id: 'mtf136',
        text: 'Liquidnet Europe Equities',
     },
     {
        id: 'mtf139',
        text: 'MarketAxess Europe MTF',
     },
     {
        id: 'mtf140',
        text: 'LMAX',
     },
     {
        id: 'mtf142',
        text: 'MTS Cash Domestic Market-UNITED KINGDOM',
     },
     {
        id: 'mtf149',
        text: 'EBM',
     },
     {
        id: 'mtf150',
        text: 'Turquoise Plato',
     },
     {
        id: 'mtf151',
        text: 'Turquoise Lit',
     },
     {
        id: 'mtf152',
        text: 'Tradeweb Europe Limited MTF',
     },
     {
        id: 'mtf153',
        text: 'Elixium',
     },
     {
        id: 'mtf154',
        text: 'Tullett Prebon Europe MTF',
     },
     {
        id: 'mtf155',
        text: 'Trad-X',
     },
     {
        id: 'mtf156',
        text: 'NEX SEF MTF - RESET',
     },
     {
        id: 'mtf157',
        text: 'NEX SEF MTF - EBS',
     },
     {
        id: 'mtf158',
        text: 'BONDVISION UK',
     },
     {
        id: 'mtf159',
        text: 'London Stock Exchange Non-AIM MTF',
     },
     {
        id: 'mtf160',
        text: 'Turquoise Lit Auctions',
     },
     {
        id: 'mtf161',
        text: 'Reuters Transaction Services Limited – Forwards Matching',
     },
     {
        id: 'mtf162',
        text: 'Reuters Transaction Services Limited – Fxall RFQ',
     },
     {
        id: 'mtf163',
        text: 'Turquoise SwapMatch',
     },
     {
        id: 'mtf164',
        text: 'Bloomberg Multilateral Trading Facility',
     },
     {
        id: 'mtf165',
        text: 'Cboe Europe Equities MTF – CXE Reference Price Book Segment',
     },
     {
        id: 'mtf166',
        text: 'Cboe Europe Equities MTF – CXE Off-Book Segment',
     },
     {
        id: 'mtf167',
        text: 'Cboe Europe Equities MTF – BXE Off-Book Segment',
     },
     {
        id: 'mtf168',
        text: 'NEX Exchange Growth Market (equity)',
     },
     {
        id: 'mtf169',
        text: 'Aquis MTF',
     },
     {
        id: 'mtf170',
        text: 'NEX Exchange Trading (equity)',
     },
     {
        id: 'mtf172',
        text: 'GFI SECURITIES - MTF',
     },
     {
        id: 'mtf173',
        text: 'GFI BROKERS - MTF',
     },
     {
        id: 'mtf174',
        text: 'EquiLend',
     },
     {
        id: 'mtf179',
        text: 'BrokerTec EU MTF',
     },
     {
        id: 'mtf180',
        text: 'Capman AD',
     },
     {
        id: 'mtf181',
        text: 'BULGARIAN STOCK EXCHANGE',
     },
     {
        id: 'mtf182',
        text: '42 Financial Services',
     },
     {
        id: 'mtf183',
        text: 'Zagrebačka burza d.d.',
     },
     {
        id: 'mtf184',
        text: 'AQUIS EXCHANGE EUROPE',
     },
     {
        id: 'mtf185',
        text: 'Bloomberg Trading Facility B.V.',
     },
     {
        id: 'mtf186',
        text: 'BNY Mellon Markets Europe Limited',
     },
     {
        id: 'mtf187',
        text: 'CBOE Europe B.V.',
     },
     {
        id: 'mtf188',
        text: 'CME Amsterdam B.V.',
     },
     {
        id: 'mtf189',
        text: 'Currenex MTF - RFQ',
     },
     {
        id: 'mtf190',
        text: 'Equilend Limited',
     },
     {
        id: 'mtf191',
        text: 'Euronext Blocki',
     },
     {
        id: 'mtf192',
        text: 'Euronext Growth',
     },
     {
        id: 'mtf193',
        text: 'Euronext Growth Dublin',
     },
     {
        id: 'mtf194',
        text: 'EURONEXT GROWTH PARIS',
     },
     {
        id: 'mtf195',
        text: 'Financial & Risk Transaction Services Ireland Limited - Forwards Matching',
     },
     {
        id: 'mtf196',
        text: 'Financial & Risk Transaction Services Ireland Limited - FXall RFQ',
     },
     {
        id: 'mtf197',
        text: 'First North Denmark',
     },
     {
        id: 'mtf198',
        text: 'Frankfurter Wertpapierboerse (Scale)',
     },
     {
        id: 'mtf199',
        text: 'FRANKFURTER WERTPAPIERBOERSE XETRA (FREIVERKEHR ? OFF-BOOK)',
     },
     {
        id: 'mtf200',
        text: 'FRANKFURTER WERTPAPIERBOERSE XETRA (SCALE ? OFF-BOOK)',
     },
     {
        id: 'mtf201',
        text: 'FX Connect MTF - Allocations',
     },
     {
        id: 'mtf202',
        text: 'FX Connect MTF - RFQ',
     },
     {
        id: 'mtf203',
        text: 'iSwap Euro B.V.',
     },
     {
        id: 'mtf204',
        text: 'Liquidnet EU Equities MTF',
     },
     {
        id: 'mtf205',
        text: 'Liquidnet EU Fixed Income MTF',
     },
     {
        id: 'mtf206',
        text: 'MarketAxess NL B.V.',
     },
     {
        id: 'mtf207',
        text: 'MORGAN STANLEY FRANCE',
     },
     {
        id: 'mtf208',
        text: 'MTS S.P.A. - Bond Vision Europe',
     },
     {
        id: 'mtf209',
        text: 'MTS S.p.A. - MTS Cash Domestic MTF',
     },
     {
        id: 'mtf210',
        text: 'NASDAQ COPENHAGEN A/S First North Denmark SME Growth Market',
     },
     {
        id: 'mtf211',
        text: 'Nasdaq First North Growth Market',
     },
     {
        id: 'mtf212',
        text: 'Nasdaq First North Sweden - SME Growth Market',
     },
     {
        id: 'mtf213',
        text: 'NOWCP',
     },
     {
        id: 'mtf214',
        text: 'Spectrum MTF Operator GmbH',
     },
     {
        id: 'mtf215',
        text: 'The Goldman Sachs Group, inc',
     },
     {
        id: 'mtf216',
        text: 'TP ICAP (Europe)',
     },
     {
        id: 'mtf217',
        text: 'Tradeweb EU B.V.',
     },
     {
        id: 'mtf218',
        text: 'Tullett Prebon Securities MTF',
     },
     {
        id: 'mtf219',
        text: 'Turquoise Global Holdings Europe B.V.',
     },
     {
        id: 'mtf220',
        text: 'Verto MTF',
     },
     {
        id: 'mtf221',
        text: 'Virtu ITG Europe Limited - POSIT MTF - Periodic Auction Segment',
     },
     {
        id: 'mtf222',
        text: 'Virtu ITG Europe Limited ? POSIT MTF - dark',
     },
     {
        id: 'mtf223',
        text: 'Virtual Auction Global Markets Limited MTF',
     },
     {
        id: 'mtf224',
        text: 'XBond',
     },
     {
        id: 'mtfXXX',
        text: 'Other',
     },
];

export const typeOfRevenuesList = [
    {
        id: 'NetIncome',
        text: 'Net Income',
    },
    {
        id: 'NetRevenue',
        text: 'Net Revenue',
    },
    {
        id: 'NetBankingIncome',
        text: 'Net Banking Income (only applicable for Credit Institution)',
    },
];

export const regulatoryStatusList = [
    {
        id: 'pensionMutual',
        text: 'Pension Fund / Mutual Insurance Institution / Paid Holiday Fund and similar ',
    },
    {
        id: 'creditInstitution',
        text: 'Credit Institution',
    },
    {
        id: 'insurer',
        text: 'Insurer',
    },
    {
        id: 'institutionalInvestors',
        text: 'Approved or regulated Institutional Investors',
    },
    {
        id: 'otherInvestors',
        text: 'Other institutional investors whose main activity is to invest in financial instruments (investment companies, venture capital companies, innovation finance companies)',
    },
    {
        id: 'managementCompany',
        text: 'Management Company (including SICAV) / Financial Investment Advisor',
    },
    {
        id: 'centralBank',
        text: 'Central Bank',
    },
    {
        id: 'nationalGovService',
        text: 'National Government or Service, including public bodies responsible for public debt at national level',
    },
    {
        id: 'internationBodies',
        text: 'Public International Financial bodies to which France or any other OECD Member State adheres (IMF, EIB, World Bank, etc.)',
    },
    {
        id: 'other',
        text: 'Other',
    },
];

export const regulatoryStatusListID2S = [
    ...regulatoryStatusList,
    {
        id: 'custodian',
        text: 'Custodian',
    },
    {
        id: 'issuingAndPayingAgent',
        text: 'Issuing and Paying Agent',
    },
];

export const regulatoryStatusInsurerTypeList = [
    {
        id: 'Regulatedasset',
        text: 'Regulated Asset',
    },
    {
        id: 'Lifeinsurancecontracts',
        text: 'Life Insurance Contracts',
    },
];

export const publicEstablishmentList = [
    {
        id: 'Councilhouse',
        text: 'Council House',
    },
    {
        id: 'other',
        text: 'Others',
    },
];

export const companyActivitiesList = [
    {
        id: 'ownAccount',
        text: 'Own-account',
    },
    {
        id: 'onBehalfOfThirdParties',
        text: 'Third Parties',
    },
];

export const investorOnBehalfList = [
    {
        id: 'UCITS',
        text: 'Management Company / Investment service provider managing a UCITS',
    },
    {
        id: 'mandate',
        text: 'Management Company / Investment service provider managing a mandate',
    },
];

export const geographicalAreaList = [
    {
        id: 'Europeanunion',
        text: 'European Union',
    },
    {
        id: 'oecd',
        text: 'OECD outside the European Union',
    },
    {
        id: 'outsideOecd',
        text: 'Outside OECD / Outside European Union',
    },
];

export const geographicalOriginTypeList = [
    {
        id: 'country',
        text: 'Country',
    },
    {
        id: 'area',
        text: 'Area',
    },
];

export const financialAssetsInvestedList = [
    {
        id: '0to50millions',
        text: '0 to 50 million €',
    },
    {
        id: '50to100millions',
        text: '50 to 100 million €',
    },
    {
        id: '100to500millions',
        text: '100 to 500 million €',
    },
    {
        id: '500millionsto1milliard',
        text: '500 million to 1 billion €',
    },
    {
        id: 'Beyond',
        text: 'Beyond',
    },
];

export const custodianHolderAccountList = [
    {
        id: 'BancodeOroUnibank',
        text: 'Banco de Oro Unibank',
    },
    {
        id: 'BankofAmerica',
        text: 'Bank of America',
    },
    {
        id: 'BankofChinaHongKongLimited',
        text: 'Bank of China (Hong Kong) Limited',
    },
    {
        id: 'BankofIrelandSecuritiesServices',
        text: 'Bank of Ireland Securities Services',
    },
    {
        id: 'BankofNewYorkMellon',
        text: 'Bank of New York Mellon',
    },
    {
        id: 'Barclays',
        text: 'Barclays',
    },
    {
        id: 'BBVACompass',
        text: 'BBVA Compass',
    },
    {
        id: 'BNPParibasSecuritiesServices',
        text: 'BNP Paribas Securities Services',
    },
    {
        id: 'BrownBrothersHarriman',
        text: 'Brown Brothers Harriman',
    },
    {
        id: 'CACEIS',
        text: 'CACEIS',
    },
    {
        id: 'CIBCMellon',
        text: 'CIBC Mellon',
    },
    {
        id: 'Citigroup',
        text: 'Citigroup',
    },
    {
        id: 'Clearstream',
        text: 'Clearstream',
    },
    {
        id: 'ComericaBank',
        text: 'Comerica Bank',
    },
    {
        id: 'CreditSuisse',
        text: 'Credit Suisse',
    },
    {
        id: 'DeutscheBank',
        text: 'Deutsche Bank',
    },
    {
        id: 'EstrategiaInvestimentos',
        text: 'Estrategia Investimentos',
    },
    {
        id: 'ESUNCommercialBank',
        text: 'E.SUN Commercial Bank',
    },
    {
        id: 'Euroclear',
        text: 'Euroclear',
    },
    {
        id: 'FifthThirdBank',
        text: 'Fifth Third Bank',
    },
    {
        id: 'GoldmanSachs',
        text: 'Goldman Sachs',
    },
    {
        id: 'HDFCBank',
        text: 'HDFC Bank',
    },
    {
        id: 'HuntingtonNationalBank',
        text: 'Huntington National Bank',
    },
    {
        id: 'HSBC',
        text: 'HSBC',
    },
    {
        id: 'ICBC',
        text: 'ICBC',
    },
    {
        id: 'ICICIBank',
        text: 'ICICI Bank',
    },
    {
        id: 'JapanTrusteeServicesBank',
        text: 'Japan Trustee Services Bank',
    },
    {
        id: 'JPMorganChase',
        text: 'JPMorgan Chase',
    },
    {
        id: 'KasbankNV',
        text: 'Kasbank N.V.',
    },
    {
        id: 'KeyBank',
        text: 'KeyBank',
    },
    {
        id: 'LBBW',
        text: 'LBBW',
    },
    {
        id: 'Maybank',
        text: 'Maybank',
    },
    {
        id: 'MegaInternationalCommercialBank',
        text: 'Mega International Commercial Bank',
    },
    {
        id: 'MitsubishiUFJTrustandBankingCorporation',
        text: 'Mitsubishi UFJ Trust and Banking Corporation',
    },
    {
        id: 'MorganStanleySmithBarney',
        text: 'Morgan Stanley Smith Barney',
    },
    {
        id: 'NAB',
        text: 'NAB',
    },
    {
        id: 'NationalBankofAbuDhabi',
        text: 'National Bank of Abu Dhabi',
    },
    {
        id: 'NorthernTrust',
        text: 'Northern Trust',
    },
    {
        id: 'PTBankCentralAsiaTbk',
        text: 'PT. Bank Central Asia, Tbk.',
    },
    {
        id: 'QatarNationalBank',
        text: 'Qatar National Bank',
    },
    {
        id: 'RBCInvestorServices',
        text: 'RBC Investor Services',
    },
    {
        id: 'SocitGnraleSecuritiesServices',
        text: 'Société Générale Securities Services',
    },
    {
        id: 'StandardBank',
        text: 'Standard Bank',
    },
    {
        id: 'StandardCharteredBank',
        text: 'Standard Chartered Bank',
    },
    {
        id: 'StateBankofIndia',
        text: 'State Bank of India',
    },
    {
        id: 'StateStreetBankTrust',
        text: 'State Street Bank & Trust',
    },
    {
        id: 'TheMasterTrustBankofJapan',
        text: 'The Master Trust Bank of Japan',
    },
    {
        id: 'TrustCustodyServicesBank',
        text: 'Trust & Custody Services Bank',
    },
    {
        id: 'MauritiusCommercialBank',
        text: 'Mauritius Commercial Bank',
    },
    {
        id: 'USBank',
        text: 'U.S. Bank',
    },
    {
        id: 'UBS',
        text: 'UBS',
    },
    {
        id: 'UniCredit',
        text: 'UniCredit',
    },
    {
        id: 'UnionBankNA',
        text: 'Union Bank N.A.',
    },
    {
        id: 'Vontobel',
        text: 'Vontobel',
    },
    {
        id: 'WellsFargoBank',
        text: 'Wells Fargo Bank',
    },
    {
        id: 'other',
        text: 'Other',
    },
];

export const financialInstrumentsList = [
    {
        id: 'MoneyMarketSecurities',
        text: 'Money Market Securities',
    },
    {
        id: 'Bonds',
        text: 'Bonds',
    },
    {
        id: 'Convertiblebonds',
        text: 'Convertible Bonds',
    },
    {
        id: 'Listedshares',
        text: 'Listed Shares',
    },
    {
        id: 'Unlistedshares',
        text: 'Unlisted Shares',
    },
    {
        id: 'UCITS',
        text: 'UCITS',
    },
    {
        id: 'FIA',
        text: 'FIA',
    },
    {
        id: 'Foreignexchangemarket',
        text: 'Foreign Exchange Market',
    },
    {
        id: 'Swaps',
        text: 'Swaps',
    },
    {
        id: 'IFT',
        text: 'IFT',
    },
    {
        id: 'Derivativesandcomplexproducts',
        text: 'Derivatives and complex products (structured products, EMTN, etc.)',
    },
    {
        id: 'PierrePapierSCPI',
        text: 'Pierre Papier (SCPI, etc.)',
    },
    {
        id: 'other',
        text: 'Other',
    },
];

export const natureOfTransactionsList = [
    {
        id: '0to1000',
        text: '0 to 1 000 €',
    },
    {
        id: '1000to10000',
        text: '1 000 to 10 000 €',
    },
    {
        id: '10000to100000',
        text: '10 000 to 100 000 €',
    },
    {
        id: '100000to1million',
        text: '100 000 to 1 million €',
    },
    {
        id: 'Beyond',
        text: 'Beyond',
    },
];

export const volumeOfTransactionsList = [
    {
        id: '1to10transactions',
        text: '1 to 10 transactions',
    },
    {
        id: '10to50transactions',
        text: '10 to 50 transactions',
    },
    {
        id: '50to100transactions',
        text: '50 to 100 transactions',
    },
    {
        id: '100to500transactions',
        text: '100 to 500 transactions',
    },
    {
        id: 'Beyond',
        text: 'Beyond',
    },
];

export const investmentVehiclesList = [
    {
        id: 'MoneymarketsecuritiesTreasury',
        text: 'Money Market Securities (Treasury)',
    },
    {
        id: 'Bonds',
        text: 'Bonds',
    },
    {
        id: 'Convertiblebonds',
        text: 'Convertible Bonds',
    },
    {
        id: 'Listedshares',
        text: 'Listed Shares',
    },
    {
        id: 'Unlistedshares',
        text: 'Unlisted Shares',
    },
    {
        id: 'UCITS',
        text: 'UCITS',
    },
    {
        id: 'FIA',
        text: 'FIA',
    },
    {
        id: 'Notrated',
        text: 'Not Rated',
    },
    {
        id: 'PierrePapier',
        text: 'Pierre Papier',
    },
    {
        id: 'Foreignexchangemarket',
        text: 'Foreign Exchange Market',
    },
    {
        id: 'Swaps',
        text: 'Swaps',
    },
    {
        id: 'IFT',
        text: 'IFT',
    },
    {
        id: 'otherderivatives',
        text: 'Other derivatives and complex products (structured products, EMTN, etc.)',
    },
    {
        id: 'other',
        text: 'Other',
    },
];

export const financialAssetManagementMethodList = [
    {
        id: 'internalManagement',
        text: 'Internal Management',
    },
    {
        id: 'withAdviceOfAuthorisedThirdPartyInstitution',
        text: 'With the advice of an authorised third party institution',
    },
    {
        id: 'mandateEntrustedToManagers',
        text: 'By mandate(s) entrusted to a manager(s)',
    },
];

export const frequencyList = [
    {
        id: 'Daily',
        text: 'Daily',
    },
    {
        id: 'Weekly',
        text: 'Weekly',
    },
    {
        id: 'Monthly',
        text: 'Monthly',
    },
    {
        id: 'Quarterly',
        text: 'Quarterly',
    },
    {
        id: 'Semiannual',
        text: 'Semi-annual',
    },
    {
        id: 'Annual',
        text: 'Annual',
    },
    {
        id: 'Punctual',
        text: 'Punctual',
    },
];

export const performanceProfileList = [
    {
        id: 'Treasuryinvestment',
        text: 'Treasury Investment',
    },
    {
        id: 'Capitalpreservation',
        text: 'Capital preservation',
    },
    {
        id: 'Performance',
        text: 'Performance',
    },
    {
        id: 'Income',
        text: 'Income',
    },
    {
        id: 'Hedge',
        text: 'Hedge',
    },
    {
        id: 'Leverageeffect',
        text: 'Leverage Effect',
    },
    {
        id: 'Backingupaliability',
        text: 'Backing up a liability(s)',
    },
    {
        id: 'others',
        text: 'Others (e.g. liability(s) related)',
    },
];

export const clientNeedsList = [
    {
        id: 'Standaloneinvestment',
        text: 'Standalone Investment',
    },
    {
        id: 'PortfolioComponentDiversification',
        text: 'Portfolio Component (Diversification)',
    },
    {
        id: 'Specificinvestmentneed',
        text: 'Specific investment need',
    },
];

export const investmentHorizonList = [
    {
        id: 'Notimeconstraints',
        text: 'No time constraints',
    },
    {
        id: 'Veryshortterm1year',
        text: 'Very short term (<1 year)',
    },
    {
        id: 'Shortterm1year3years',
        text: 'Short term (>1 year < 3 years)',
    },
    {
        id: 'Mediumterm3years5years',
        text: 'Medium term (>3years <5 years)',
    },
    {
        id: 'Longterm5years',
        text: 'Long-term (>5 years)',
    },
    {
        id: 'specific',
        text: 'Specific timeframe',
    },
];

export const riskProfileList = [
    {
        id: 'GuaranteedCapital',
        text: 'Guaranteed capital',
    },
    {
        id: 'partiallyProtected',
        text: 'Partially protected capital',
    },
    {
        id: 'Nocapitalguarantee',
        text: 'No capital guarantee (capital loss up to the amount invested)',
    },
    {
        id: 'Riskoflossbeyondtheinvestedcapital',
        text: 'Risk of loss beyond the invested capital',
    },
];

export const riskAcceptanceList = [
    {
        profile: 'Level 1: Basic',
        volatility: 'Volatility less than 0.5%',
        srri: '1',
        sri: '1',
    },
    {
        profile: 'Level 2: Middleman',
        volatility: 'Volatility between 0.5% and 5%',
        srri: '2 & 3',
        sri: '2',
    },
    {
        profile: 'Level 3: Advanced',
        volatility: 'Volatility between 5% and 25%',
        srri: '4 to 6',
        sri: '3 to 5',
    },
    {
        profile: 'Level 4: Expert',
        volatility: 'Volatility greater than 25%',
        srri: '6',
        sri: '6 & 7',
    },
];

export const capitalNatureList = [
    {
        id: 'equityAndReserves',
        text: 'Equity & Reserves',
    },
    {
        id: 'generalAssets',
        text: 'General Assets (Insurance Contracts)',
    },
    {
        id: 'premiumsAndContributions',
        text: 'Premiums & Contributions',
    },
    {
        id: 'saleGoodsServices',
        text: 'Sale of Goods and Services',
    },
    {
        id: 'exceptionalEvents',
        text: 'Exceptional Events',
    },
    {
        id: 'treasury',
        text: 'Treasury',
    },
    {
        id: 'others',
        text: 'Others',
    },
];

export const documentTypesList = [
    {
        id: 'kycstatuscertifieddoc',
        text: 'Articles of Association',
    },
    {
        id: 'kyckbisdoc',
        text: 'KBIS extract (or equivalent) less than 3 months old',
    },
    {
        id: 'kycannualreportdoc',
        text: 'Audited annual reports of last year ',
    },
    {
        id: 'kycidorpassportdoc',
        text: 'IDs of persons authorised to bind the company',
    },
    {
        id: 'kyctaxcertificationdoc',
        text: 'Tax self certification form (CRS)',
    },
    {
        id: 'kycw8benefatcadoc',
        text: 'Form W-8BEN-F (FACTA)',
    },
    {
        id: 'kycisincodedoc',
        text: 'ISIN Code of the listed share',
    },
    {
        id: 'kycevidencefloatable',
        text: 'Evidence of stocklisting and confirmation that 75% of the company\'s shares are floatable and tradable on the market',
    },
    {
        id: 'kycproofofapprovaldoc',
        text: 'Proof of approval or copy of order',
    },
    {
        id: 'kycproofregulationdoc',
        text: 'Proof of regulation/supervision from the regulator\'s website',
    },
    {
        id: 'kycwolfsbergdoc',
        text: 'Wolfsberg questionnaire or equivalent',
    },
    {
        id: 'kycribdoc',
        text: 'RIB',
    },
    {
        id: 'kycorgchartdoc',
        text: 'Org chart with key operational teams',
    },
    {
        id: 'kyclistsigningauthoritiesdoc',
        text: 'List of Signing Authorities if the signatory is not on the KBIS',
    },
    {
        id: 'kycbeneficialownerdoc',
        text: 'Ultimate Beneficial Owner Statement',
    },
    {
        id: 'kycdisclosureproceduredoc',
        text: 'Disclosure of risk management procedure',
    },
    {
        id: 'kyccompositioncommitteedoc',
        text: 'Composition of the risk committee',
    },
    {
        id: 'kycannual3yeardoc',
        text: 'Audited annual reports of the last 3 years',
    },
    {
        id: 'kycannual3yeartaxdoc',
        text: 'Annual accounts certified by CAC or last 3 tax returns',
    },
    {
        id: 'kyccriticalcustomersdoc',
        text: 'Notification of critical customers',
    },
    {
        id: 'kycbusinessplandoc',
        text: 'Copy of the business continuity plan',
    },
];

export const beneficiaryTypesList = [
    {
        id: 'legalPerson',
        text: 'Legal Person',
    },
    {
        id: 'naturalPerson',
        text: 'Natural Person',
    },
];

export const relationTypesList = [
    {
        id: 'ubo',
        text: 'UBO',
    },
    {
        id: 'director',
        text: 'Director',
    },
    {
        id: 'signatory',
        text: 'Signatory',
    },
    {
        id: 'shareholder',
        text: 'Shareholder',
    },
    {
        id: 'executiveBoardMember',
        text: 'Executive Board Member',
    },
    {
        id: 'supervisoryBoardMemberOrEquivalent',
        text: 'Supervisory Board Member or equivalent',
    },
];

export const holdingTypesList = [
    {
        id: 'directHolding',
        text: 'Direct Holding',
    },
    {
        id: 'indirectHolding',
        text: 'Indirect Holding',
    },
];

export const identificationNumberList = [
    {
        id: 'siret',
        text: 'SIRET',
    },
    {
        id: 'siren',
        text: 'SIREN',
    },
    {
        id: 'other',
        text: 'Other',
    },
];

export const controlToName = {
    // General
    registeredCompanyName: 'Registered Company Name or Legal Name',
    commercialName: 'Commercial Name',
    legalForm: 'Legal Form',
    leiCode: 'LEI Code',
    otherIdentificationNumberType: 'Other Identification Number Type',
    otherIdentificationNumberTypeSpecify: 'Other Identification Number Type Specification',
    otherIdentificationNumberText: 'Other Identification Number',
    shareCapital: 'Share Capital',
    financialRating: 'Financial Rating',
    registeredCompanyAddressLine1: "Registered Company's Headquarters Address",
    registeredCompanyAddressLine2: 'Address Line 2',
    registeredCompanyZipCode: 'ZIP Code',
    registeredCompanyCity: 'City',
    registeredCompanyCountry: 'Country',
    commercialDomiciliation: 'Does the client have a commercial address?',
    commercialAddressLine1: 'Commercial Address',
    commercialAddressLine2: 'Address Line 2',
    commercialZipCode: 'ZIP Code',
    commercialCity: 'City',
    commercialCountry: 'Country',
    countryTaxResidence: 'Country of Tax Residence',
    countryRegistration: 'Country of Registration',
    regulatoryStatus: 'Regulatory Status',
    regulatoryStatusListingOther: 'Regulatory Status Specification',
    regulatoryStatusInsurerType: 'Insurer Type',
    regulatoryStatusListingMarkets: 'Listing Market(s)',

    // Company
    sectorActivity: 'Primary sector of activity',
    sectorActivityText: 'Primary sector of activity specification',
    otherSectorActivity: 'Other(s) sector(s) of activity',
    otherSectorActivityText: 'Other(s) sector(s) of activity specification',
    corporatePurpose: 'Corporate Purpose',
    activities: 'Management in behalf of',
    investorOnBehalfThirdParties: 'Third parties type',
    geographicalAreaOfActivity: 'Geographical area of the activity',
    geographicalAreaOfActivitySpecification: 'Geographical area of the activity specification',
    totalFinancialAssetsAlreadyInvested: 'Total Financial assets already invested',
    capitalNature: 'Nature and origin of the capital invested by the Legal Entity',
    otherCapitalNature: 'Nature and origin of the capital invested by the Legal Entity',
    activityRegulated: 'Is the activity regulated?',
    regulator: 'Regulator or a Supervisory Authority',
    otherRegulator: 'Other Regulator or a Supervisory Authority',
    approvalNumber: 'Approval Number',
    companyListed: 'Is the company listed?',
    listingMarkets: 'Listing Market(s)',
    otherListingMarkets: 'Listing market(s) specification',
    multilateralTradingFacilities: 'Multilateral Trading Facilities',
    otherMultilateralTradingFacilities: 'Other Multilateral Trading Facilities',
    bloombergCode: 'Bloomberg Code',
    isinCode: 'ISIN code of the listed share',
    floatableShares: 'Percentage of floatable and tradable company\'s shares',
    companyStateOwned: 'Is the company state-owned?',
    percentCapitalHeldByState: 'Percentage of the capital held by the state',
    balanceSheetTotal: 'Balance Sheet Total (€)',
    netRevenuesNetIncome: 'Net Revenues or Net Income (€)',
    shareholderEquity: "Shareholder's Equity (€)",
    equityAndReserves: 'Equity & Reserves',
    generalAssets: 'General Assets (Insurance Contracts)',
    premiumsAndContributions: 'Premiums & Contributions',
    saleGoodsServices: 'Sale of Goods and Services',
    treasury: 'Treasury',
    others: 'Others',
    geographicalOrigin1: 'Geographical origin (specify by area or country)',
    geographicalOrigin2: 'Geographical origin precision',
    typeOfRevenues: 'Type of Revenues',
    typeOfRevenuesValue: 'Value of Revenues',

    // Beneficiaries
    beneficiaryType: 'Beneficiary Type',
    firstName: 'First Name',
    lastName: 'Last Name',
    address: 'Beneficiary Address',
    address2: 'Address Line 2',
    nationality: 'Nationality',
    dateOfBirth: 'Date of Birth',
    cityOfBirth: 'City of Birth',
    countryOfBirth: 'Country of Birth',
    documentID: 'Document',
    holdingPercentage: 'Holding Percentage',
    relationType: 'Relation Type',
    holdingType: 'Holding Type',
    nationalIdNumberType: 'National Identification Number Type',
    otherNationalIdNumberType: 'Your Number Type',
    nationalIdNumberText: 'National ID Number Specification',
    legalName: 'Legal Name',

    // Custodian
    accountName: 'Account Name',
    establishmentName: 'Establishment Name',
    iban: 'IBAN',
    bic: 'BIC',
    addressLine1: 'Establishment Address',
    addressLine2: 'Address Line 2',
    zipCode: 'Zip Code',
    city: 'City',
    country: 'Country',

    // Classification
    optForPro: 'Asked for professional status',
    optForNonPro: 'Opted for non professional classification',
    operatorsHasExperienceNeuCP: 'Do your operators have experience in trading NeuCP',
    classificationChangeAccepted: 'Classification change accepted',
    investorStatus: 'Initial investor status',
    excludeProducts: 'Excluded category of products/services',
    jobPosition: 'Job position',
    numberYearsExperienceRelatedFunction: 'Number of years of experience in a function related to financial markets',
    numberYearsCurrentPosition: 'Number of years of experience in current position',
    financialInstruments: 'Financial instruments that have already been the subject of transactions by the said natural person in the professional environment',
    financialInstrumentsSpecification: 'Financial instruments specification',
    marketArea: 'Market area(s) which have been the subject of transactions',
    natureTransactionPerYear: 'Nature of transactions per year (in €)',
    volumeTransactionPerYear: 'Volume of transactions per year (in €)',
    activitiesBenefitFromExperience: 'Activities/Professions allow to benefit from experience in the financial field',
    activitiesBenefitFromExperienceSpecification: 'Benefit Details',
    trainingKnowledgeSkills: 'Does your training provide you with knowledge and skills in the financial field?',
    trainingKnowledgeSkillsSpecification: 'Training Details',
    knowledgeUCI: 'Do you have a good knowledge of Collective Investment Schemes (UCIs)?',
    knowledgeFundsAndRisks:
    'Do you have a good knowledge of the different types of existing funds (UCITS, AIFs, ETFs, structured funds, money market funds, OPCIs, etc.) and the risks inherent in each of them?',
    prospectusKIIDUnderstanding:
    'Do you know what a financial prospectus and a KIID (Key Information Document for Investors) is and are you able to read and understand them?',
    // tslint:disable-next-line:max-line-length
    knowledgeSkillsPlaceUCIOrders: 'Do you have the knowledge and skills to place subscription and redemption orders for units of collective investment undertakings (UCIs) directly with management companies?',

    // Risk nature
    financialAssetManagementMethod: 'Financial asset management method',
    internalManagement: 'Internal management',
    withAdviceOfAuthorisedThirdPartyInstitution: 'With the advice of an authorised third party institution',
    mandateEntrustedToManagers: 'By mandate(s) entrusted to a manager(s)',
    frequencyFinancialTransactions: 'Frequency of financial transactions',
    investmentvehiclesAlreadyUsed: 'Which investment vehicles do you currently use',
    investmentvehiclesAlreadyUsedSpecification: 'Investment vehicles already used specification',
    naturesSameInvestmentCrossAm: 'I would like to have the same investment nature for all management companies',

    // Risk objective
    performanceProfile: 'Performance Profile',
    performanceProfileSpecification: 'Performance Profile Specification',
    clientNeeds: 'Client Needs (purpose of the investment)',
    otherFinancialInformation: 'Other relevant financial information (optional) including periodic cash flows to be invested in cash management, asset allocation',
    investmentHorizonWanted: 'Investment horizons wanted',
    investmentHorizonWantedSpecificPeriod: 'Investment horizons wanted (specific period)',
    riskProfile: 'Risk profile: ability to incur losses',
    riskProfileCapital: 'Capital loss limited to',
    riskAcceptanceLevel1: 'Risk acceptance: Basic (SRRI = 1, SRI = 1)',
    riskAcceptanceLevel2: 'Risk acceptance: Middleman (SRRI = 2/3, SRI = 2)',
    riskAcceptanceLevel3: 'Risk acceptance: Advanced (SRRI = 4 to 6, SRI = 3 to 5)',
    riskAcceptanceLevel4: 'Risk acceptance: Expert (SRRI = 6, SRI = 6/7)',
    objectivesSameInvestmentCrossAm: 'I would like to have the same investment objectives for all management companies',

    // Risk constraints
    statutoryConstraints: 'Statutory constraints/special rules concerning eligible assets',
    taxConstraints: 'Tax constraints',
    otherConstraints: 'Others (including SRI, ESG, etc.)',
    investmentDecisionsAdHocCommittee: 'Are investment decisions validated by an ad hoc committee?',
    investmentDecisionsAdHocCommitteeSpecification: 'Ad hoc committee specification',
    otherPersonsAuthorised: 'Other persons authorised to take investment decisions and give instructions',
    constraintsSameInvestmentCrossAm: 'I would like to have the same investment objectives for all management companies',
    hasEverIssuedNeuCp: 'Has your company ever issued Neu CPs?',
    hasAlreadyInvestedNeuCp: 'Has your company already invested in Neu CPs?',

    // Validation
    undersigned: 'Identity',
    actingOnBehalfOf: 'On behalf of',
    doneAt: 'Done at',
    doneDate: 'Date',
    positionRepresentative: 'Position of the representative of the Legal Person',
    electronicSignatureDocumentID: 'National Identification Card',
};

export const controlToList = {
    // General
    legalForm: 'legalFormList',
    registeredCompanyCountry: 'countries',
    financialRating: 'financialRatingList',
    regulatoryStatus: 'regulatoryStatusList',
    regulatoryStatusInsurerType: 'regulatoryStatusInsurerTypeList',
    otherIdentificationNumberType: 'identificationNumberTypeList',
    commercialCountry: 'countries',
    countryRegistration: 'countries',

    // Company
    sectorActivity: 'sectorActivityList',
    otherSectorActivity: 'otherSectorActivityList',
    activities: 'companyActivitiesList',
    investorOnBehalfThirdParties: 'investorOnBehalfList',
    regulator: 'regulatorSupervisoryAuthoritiesList',
    listingMarkets: 'listingMarketsList',
    multilateralTradingFacilities: 'multilateralTradingFacilitiesList',
    geographicalAreaOfActivity: 'geographicalAreaList',
    geographicalOrigin1: 'geographicalOriginTypeList',
    capitalNature: 'capitalNatureList',
    otherCapitalNature: 'otherCapitalNature',
    geographicalOrigin2: 'countries',
    totalFinancialAssetsAlreadyInvested: 'financialAssetsInvestedList',
    countryOfBirth: 'countries',
    beneficiaryType: 'beneficiaryTypesList',
    relationType: 'relationTypesList',
    holdingType: 'holdingTypesList',
    nationalIdNumberType: 'identificationNumberList',
    typeOfRevenues: 'typeOfRevenuesList',


    // Banking
    custodianHolderAccount: 'custodianHolderAccountList',
    custodianCountry: 'countries',

    // Classification
    investorStatus: 'investorStatusTextList',
    financialInstruments: 'financialInstrumentsList',
    marketArea: 'geographicalAreaList',
    natureTransactionPerYear: 'natureOfTransactionsList',
    volumeTransactionPerYear: 'volumeOfTransactionsList',

    // Risk nature
    financialAssetManagementMethod: 'financialAssetManagementMethodList',
    investmentvehiclesAlreadyUsed: 'investmentVehiclesList',
    frequencyFinancialTransactions: 'frequencyList',

    // Risk objectives
    performanceProfile: 'performanceProfileList',
    clientNeeds: 'clientNeedsList',
    investmentHorizonWanted: 'investmentHorizonList',
    riskProfile: 'riskProfileList',

    // Stakeholder
    nationality: 'countries',
    countryTaxResidence: 'countries',
    country: 'countries',
};

// Conditionally remove fields from kyc datagrids
export const omitConditionalFields = {
    otherIdentificationNumberType: {
        condition: ['siren', 'siret'],
        fields: ['otherIdentificationNumberTypeSpecify'],
    },
    commercialDomiciliation: {
        condition: [0],
        fields: ['commercialAddressLine1', 'commercialAddressLine2', 'commercialZipCode', 'commercialCity', 'commercialCountry'],
    },
    companyListed: {
        condition: [1],
        fields: ['balanceSheetTotal', 'netRevenuesNetIncome', 'shareholderEquity'],
    },
};
