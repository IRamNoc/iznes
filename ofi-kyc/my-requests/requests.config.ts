import { fundItems } from '@ofi/ofi-main/ofi-product/productConfig';

export const formStepsFull = [
    {
        title: 'Selection',
        id: 'step-selection',
    },
    {
        title: 'Introduction',
    },
    {
        title: 'Identification',
        id: 'step-identification',
    },
    {
        title: 'Risk profile',
        id: 'step-risk-profile',
    },
    {
        title: 'Documents',
        id: 'step-documents',
    },
    {
        title: 'Validation',
        id: 'step-validation',
    },
];
export const formStepsLight = [
    {
        title: 'Selection',
        id: 'step-selection',
    },
    {
        title: 'Validation',
        id: 'step-validation',
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
        text: 'Austria - Finanzmarktaufsicht(FMA)',
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
];

export const booleanControls = [
    'commercialDomiciliation',
    'activitiesBenefitFromExperience',
    'activityRegulated',
    'companyListed',
    'naturesSameInvestmentCrossAm',
    'objectivesSameInvestmentCrossAm',
    'constraintsSameInvestmentCrossAm',
    'optFor',
    'optForPro',
    'optForNonPro',
    'exerciseControl',
    'isLegalRepresentative',
];

export const currencyControls = [
    'balanceSheetTotal',
    'netRevenuesNetIncome',
    'shareCapital',
    'shareholderEquity',
];

export const percentageControls = [
    'riskAcceptanceLevel1',
    'riskAcceptanceLevel2',
    'riskAcceptanceLevel3',
    'riskAcceptanceLevel4',
    'holdingPercentage',
    'floatableShares',
    'votingPercentage',
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
    'ownAccountinvestor',
    'otherIdentificationNumberType',
    'listingMarkets',
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
    'sectorActivity',
    'regulatoryStatus',
    'regulatoryStatusInsurerType',
    'riskProfile',
    'nationalIdNumber',
    'holdingType',
    'parent',
    'country',
    'financialRating',
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
    'corporatePurpose',
    'geographicalAreaOfActivity',
    'geographicalAreaOfActivitySpecification',
    'activityRegulated',
    'regulator',
    'approvalNumber',
    'regulatoryStatus',
    'regulatoryStatusInsurerType',
    'regulatoryStatusListingOther',
    'companyListed',
    'listingMarkets',
    'bloombergCode',
    'isinCode',
    'floatableShares',
    'activities',
    'ownAccountinvestor',
    'investorOnBehalfThirdParties',
    'balanceSheetTotal',
    'netRevenuesNetIncome',
    'shareholderEquity',
    'capitalNature',
    'geographicalOrigin1',
    'geographicalOrigin2',
    'totalFinancialAssetsAlreadyInvested',

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
];

export const steps = {
    amcSelection: 0,
    introduction: 1,
    identification: 2,
    riskProfile: 3,
    documents: 4,
    validation: 5,
};

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
        id: 'other',
        text: 'Other',
    },
];

export const listingMarketsList = [
    { id: 'londonstockexchange', text: 'London Stock Exchange' },
    { id: 'borsefrankfurter', text: 'Börse Frankfurter' },
    { id: 'nyse', text: 'NYSE Euronext' },
    { id: 'deutscheborse', text: 'Deutsche Börse' },
    { id: 'borseberlin', text: 'Börse Berlin' },
    { id: 'batseurope', text: 'Bats Europe' },
    { id: 'chix', text: 'Chi-X' },
    { id: 'turquoise', text: 'Turquoise' },
    { id: 'tradegate', text: 'Tradegate' },
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

export const ownAccountInvestorList = [
    {
        id: 'EmbassiesandConsulates',
        text: 'Embassies and Consulates',
    },
    {
        id: 'UnionsPoliticalParties',
        text: 'Unions/Political Parties',
    },
    {
        id: 'cultsReligiousAssociations',
        text: 'Cults and religious associations presenting a specific risk (radical, etc.)',
    },
    {
        id: 'Nationalsportsassociationsandsportsagents',
        text: 'National Sports Associations and Sports Agents',
    },
    {
        id: 'Tradingretailingofpreciousmetals',
        text: 'Trading & Retailing of precious metals',
    },
    {
        id: 'Artmarketantiques',
        text: 'Art Market / Antiques',
    },
    {
        id: 'Building',
        text: 'Building',
    },
    {
        id: 'Computertelephonytelecommunication',
        text: 'Computer / Telephony / Telecommunication',
    },
    {
        id: 'Guardingandsecurity',
        text: 'Guarding and Security',
    },
    {
        id: 'Packaging',
        text: 'Packaging',
    },
    {
        id: 'Ironworkers',
        text: 'Ironworkers',
    },
    {
        id: 'GoldpannersFrenchGuiana',
        text: 'Gold Panners (French Guiana)',
    },
    {
        id: 'Wastetreatment',
        text: 'Waste Treatment',
    },
    {
        id: 'Usedvehicletrading',
        text: 'Used Vehicle Trading',
    },
    {
        id: 'Renewableenergies',
        text: 'Renewable Energies',
    },
    {
        id: 'TrainingActivityInterim',
        text: 'Training Activity / Interim',
    },
    {
        id: 'MedicalParamedical',
        text: 'Medical / Paramedical',
    },
    {
        id: 'Restoration',
        text: 'Restoration',
    },
    {
        id: 'Vitiviniculture',
        text: 'Vitiviniculture',
    },
    {
        id: 'Realestateagencies',
        text: 'Real Estate Agencies',
    },
    {
        id: 'Onlinegamingcompanies',
        text: 'Online Gaming Companies',
    },
    {
        id: 'LogisticsTransport',
        text: 'Logistics / Transport',
    },
    {
        id: 'Cleaning',
        text: 'Cleaning',
    },
    {
        id: 'ManagementCompanyInvestmentserviceprovider',
        text: 'Management Company / Investment Service Provider',
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
        text: 'Statuses "certified" by the duly authorized representative of the client',
    },
    {
        id: 'kyckbisdoc',
        text: 'Kbis extract (or equivalent) less than 3 months old',
    },
    {
        id: 'kycannualreportdoc',
        text: 'Latest audited annual report',
    },
    {
        id: 'kycidorpassportdoc',
        text: 'National identity card or valid passport or residence card of the signatory with photograph',
    },
    {
        id: 'kycwolfsbergdoc',
        text: 'Wolfsberg Questionnaire or equivalent',
    },
    {
        id: 'kyctaxcertificationdoc',
        text: 'Tax self certification form (CRS)',
    },
    {
        id: 'kycw8benefatcadoc',
        text: 'Form W-8BEN-E (FACTA)',
    },
    {
        id: 'kycisincodedoc',
        text: 'ISIN code of the listed share',
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
        text: 'Proof of regulation/supervision from the Regulator’s Website',
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
    corporatePurpose: 'Corporate Purpose',
    activities: 'Management in behalf of',
    ownAccountinvestor: 'Own-account for',
    investorOnBehalfThirdParties: 'Third parties type',
    geographicalAreaOfActivity: 'Geographical area of the activity',
    geographicalAreaOfActivitySpecification: 'Geographical area of the activity specification',
    totalFinancialAssetsAlreadyInvested: 'Total Financial assets already invested',
    capitalNature: 'Nature and origin of the capital invested by the Legal Entity',
    activityRegulated: 'Is the activity regulated?',
    regulator: 'Regulator or a Supervisory Authority',
    approvalNumber: 'Approval Number',
    companyListed: 'Is the company listed?',
    listingMarkets: 'Listing Market(s)',
    bloombergCode: 'Bloomberg Code',
    isinCode: 'ISIN code of the listed share',
    floatableShares: 'Percentage of floatable and tradable company\'s shares',
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
    holdingType: 'Holding Type',
    nationalIdNumber: 'National Identification Number',
    nationalIdNumberText: 'National ID Number Specification',
    legalName: 'Legal Name',

    // Custodian
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
    activitiesBenefitFromExperienceSpecification: 'Benefit Specification',

    // Risk nature
    financialAssetManagementMethod: 'Financial asset management method',
    internalManagement: 'Internal management',
    withAdviceOfAuthorisedThirdPartyInstitution: 'With the advice of an authorised third party institution',
    mandateEntrustedToManagers: 'By mandate(s) entrusted to a manager(s)',
    frequencyFinancialTransactions: 'Frequency of financial transactions',
    investmentvehiclesAlreadyUsed: 'Investment vehicles already used',
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
    sectorActivity: 'sectorActivityList',
    regulatorSupervisoryAuthorities: 'regulatorSupervisoryAuthoritiesList',
    regulatoryStatus: 'regulatoryStatusList',
    regulatoryStatusInsurerType: 'regulatoryStatusInsurerTypeList',
    otherIdentificationNumberType: 'identificationNumberTypeList',
    commercialCountry: 'countries',
    countryRegistration: 'countries',

    // Company
    activities: 'companyActivitiesList',
    ownAccountinvestor: 'ownAccountInvestorList',
    investorOnBehalfThirdParties: 'investorOnBehalfList',
    listingMarkets: 'listingMarketsList',
    geographicalAreaOfActivity: 'geographicalAreaList',
    geographicalOrigin1: 'geographicalOriginTypeList',
    capitalNature: 'capitalNatureList',
    geographicalOrigin2: 'countries',
    totalFinancialAssetsAlreadyInvested: 'financialAssetsInvestedList',
    countryOfBirth: 'countries',
    beneficiaryType: 'beneficiaryTypesList',
    holdingType: 'holdingTypesList',
    nationalIdNumber: 'identificationNumberList',

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

// Conditionally remove fields from kyc data grids
export const omitConditionalFields = {
    otherIdentificationNumberType: {
        condition: 'other',
        fields: ['otherIdentificationNumberTypeSpecify'],
    },
    commercialDomiciliation: {
        condition: 0,
        fields: ['commercialAddressLine1', 'commercialAddressLine2', 'commercialZipCode', 'commercialCity', 'commercialCountry'],
    },
};
