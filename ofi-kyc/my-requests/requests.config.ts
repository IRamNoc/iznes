import { fundItems } from '@ofi/ofi-main/ofi-product/productConfig';

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
];

export const currencyControls = [
    'balanceSheetTotal',
    'netRevenuesNetIncome',
    'shareholderEquity',
];

export const percentageControls = [
    'riskAcceptanceLevel1',
    'riskAcceptanceLevel2',
    'riskAcceptanceLevel3',
    'riskAcceptanceLevel4',
    'holdingPercentage',
    'floatableShares',
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
    'otherIdentificationNumber',
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
    'sectorActivity',
    'regulatoryStatus',
    'regulatoryStatusInsurerType',
    'riskProfile',
    'beneficiaryType',
    'nationalIdNumber',
    'holdingType',
];

export const controlOrder = [

    // General
    'registeredCompanyName',
    'legalForm',
    'leiCode',
    'otherIdentificationNumber',
    'otherIdentificationNumberText',
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

    // Company
    'sectorActivity',
    'sectorActivityText',
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
];

export const steps = {
    amcSelection: 1,
    introduction: 2,
    identification: 3,
    riskProfile: 4,
    documents: 5,
    validation: 6,
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
        text: "GEIE: Groupement européen d'intérêt économiqueGIE : Groupement d'intérêt économique",
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
    { id: 'nyse', text: 'NYSE' },
    { id: 'euronext', text: 'Euronext' },
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
        text: 'Approved or regulated institutional investors',
    },
    {
        id: 'otherInvestors',
        text: 'Other institutional investors whose main activity is to invest in financial instruments (investment companies, venture capital companies, innovation finance companies)',
    },
    {
        id: 'managementCompany',
        text: 'Management company (including SICAV) / Financial Investment Advisor',
    },
    {
        id: 'centralBank',
        text: 'Central Bank',
    },
    {
        id: 'nationalGovService',
        text: 'National government or service, including public bodies responsible for public debt at national level',
    },
    {
        id: 'internationBodies',
        text: 'Public international financial bodies to which France or any other OECD Member State adheres (IMF, EIB, World Bank, etc.)',
    },
    {
        id: 'other',
        text: 'Other',
    },
];

export const regulatoryStatusInsurerTypeList = [
    {
        id: 'Regulatedasset',
        text: 'Regulated asset',
    },
    {
        id: 'Lifeinsurancecontracts',
        text: 'Life insurance contracts',
    },
];

export const publicEstablishmentList = [
    {
        id: 'Councilhouse',
        text: 'Council house',
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
        text: 'Third parties',
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
        text: 'National sports associations and sports agents',
    },
    {
        id: 'Tradingretailingofpreciousmetals',
        text: 'Trading & retailing of precious metals',
    },
    {
        id: 'Artmarketantiques',
        text: 'Art market / antiques',
    },
    {
        id: 'Building',
        text: 'Building',
    },
    {
        id: 'Computertelephonytelecommunication',
        text: 'Computer / telephony / telecommunication',
    },
    {
        id: 'Guardingandsecurity',
        text: 'Guarding and security',
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
        text: 'Gold panners (French Guiana)',
    },
    {
        id: 'Wastetreatment',
        text: 'Waste treatment',
    },
    {
        id: 'Usedvehicletrading',
        text: 'Used vehicle trading',
    },
    {
        id: 'Renewableenergies',
        text: 'Renewable energies',
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
        text: 'Real estate agencies',
    },
    {
        id: 'Onlinegamingcompanies',
        text: 'Online gaming companies',
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
        text: 'Management Company / Investment service provider',
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
        text: 'European union',
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
        text: 'Listed shares',
    },
    {
        id: 'Unlistedshares',
        text: 'Unlisted shares',
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
        text: 'Foreign exchange market',
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
        text: 'Money market securities (Treasury)',
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
        text: 'Listed shares',
    },
    {
        id: 'Unlistedshares',
        text: 'Unlisted shares',
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
        text: 'Foreign exchange market',
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
        text: 'Internal management',
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
        text: 'Leverage effect',
    },
    {
        id: 'others',
        text: 'Others (e.g. liability(s) related)',
    },
];

export const clientNeedsList = [
    {
        id: 'Standaloneinvestment',
        text: 'Standalone investment',
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
        text: 'Guaranteed Capital',
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
        text: 'Equity & reserves',
    },
    {
        id: 'generalAssets',
        text: 'General assets (insurance contracts)',
    },
    {
        id: 'premiumsAndContributions',
        text: 'Premiums & contributions',
    },
    {
        id: 'saleGoodsServices',
        text: 'Sale of goods and services',
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
        id: 'kyclistshareholdersdoc',
        text: 'Official documents (or equivalent) listing the shareholders with their % of ownership if greater than 25%',
    },
    {
        id: 'kyclistdirectorsdoc',
        text: 'Official document (or equivalent) listing the directors',
    },
    {
        id: 'kycbeneficialownersdoc',
        text: 'List of beneficial owners',
    },
    {
        id: 'kyclistauthoriseddoc',
        text: 'List of persons authorised to give instructions',
    },
    {
        id: 'kyctaxcertificationdoc',
        text: 'Tax self-certification form',
    },
    {
        id: 'kycw8benefatcadoc',
        text: 'Form W-8BEN-E (FATCA',
    },
    {
        id: 'kycstatuscertifieddoc',
        text: 'Status "certified" (or equivalent) by the duly authorized representative of the client',
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
        id: 'kycproofofapprovaldoc',
        text: 'Proof of approval or copy of decree',
    },
    {
        id: 'kycisincodedoc',
        text: 'ISIN code of the listed share',
    },
    {
        id: 'kycwolfsbergdoc',
        text: 'Wolfsberg Questionnaire or equivalentFor',
    },

];

export const beneficiaryTypesList = [
    {
        id: 'legalPerson',
        text: 'Legal person',
    },
    {
        id: 'naturalPerson',
        text: 'Natural person',
    },
];

export const holdingTypesList = [
    {
        id: 'directHolding',
        text: 'Direct holding',
    },
    {
        id: 'indirectHolding',
        text: 'Indirect holding',
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
    legalForm: 'Legal form',
    leiCode: 'LEI Code',
    otherIdentificationNumber: 'Other identification number type',
    otherIdentificationNumberText: 'Other identification number',
    registeredCompanyAddressLine1: "Registered company's headquarters address (including country)",
    registeredCompanyAddressLine2: 'Address line 2',
    registeredCompanyZipCode: 'ZIP Code',
    registeredCompanyCity: 'City',
    registeredCompanyCountry: 'Country',
    commercialDomiciliation: 'Commercial domiciliation : Does the client have a commercial address (mailbox: P/O BOX)?',
    commercialAddressLine1: 'Commercial address',
    commercialAddressLine2: 'Address line 2',
    commercialZipCode: 'ZIP Code',
    commercialCity: 'City',
    commercialCountry: 'Country',
    countryTaxResidence: 'Country of tax residence',
    regulatoryStatus: 'Regulatory status',
    regulatoryStatusListingOther: 'Regulatory status specification',
    regulatoryStatusInsurerType: 'Insurer type',
    regulatoryStatusListingMarkets: 'Listing market(s)',

    // Company
    sectorActivity: 'Primary sector of activity',
    sectorActivityText: 'Sector of activity',
    activities: 'Management in behalf of',
    ownAccountinvestor: 'Own-account for',
    investorOnBehalfThirdParties: 'Third parties type',
    geographicalAreaOfActivity: 'Geographical area of the activity',
    geographicalAreaOfActivitySpecification: 'Geographical area of the activity specification',
    totalFinancialAssetsAlreadyInvested: 'Total Financial assets already invested',
    capitalNature: 'Nature and origin of the capital invested by the legal entity',
    activityRegulated: 'Is the activity regulated?',
    regulator: 'Regulator or a supervisory authority',
    approvalNumber: 'Approval number',
    companyListed: 'Is the company listed?',
    listingMarkets: 'Listing market(s)',
    bloombergCode: 'Bloomberg code',
    isinCode: 'ISIN code of the listed share',
    floatableShares: 'Percentage of floatable and tradable company\'s shares',
    balanceSheetTotal: 'Balance Sheet Total (€)',
    netRevenuesNetIncome: 'Net Revenues or Net Income (€)',
    shareholderEquity: "Shareholder's Equity (€)",
    equityAndReserves: 'Equity & reserves',
    generalAssets: 'General assets (insurance contracts)',
    premiumsAndContributions: 'Premiums & contributions',
    saleGoodsServices: 'Sale of goods and services',
    treasury: 'Treasury',
    others: 'Others',
    geographicalOrigin1: 'Geographical origin (specify by area or country)',
    geographicalOrigin2: 'Geographical origin precision',

    // Beneficiaries
    beneficiaryType: 'Beneficiary type',
    firstName: 'First name',
    lastName: 'Last name',
    address: 'Beneficiary address',
    address2: 'Address line 2',
    nationality: 'Nationality',
    dateOfBirth: 'Date of birth',
    cityOfBirth: 'City of birth',
    countryOfBirth: 'Country of birth',
    documentID: 'Document',
    holdingPercentage: 'Holding percentage',
    holdingType: 'Holding type',
    nationalIdNumber: 'National Identification Number',
    nationalIdNumberText: 'National ID Number Specification',
    legalName: 'Legal name',

    // Custodian
    establishmentName: 'Establishment Name',
    iban: 'IBAN',
    bic: 'BIC',
    addressLine1: 'Establishement address',
    addressLine2: 'Address line 2',
    zipCode: 'Zip Code',
    city: 'City',
    country: 'Country',

    // Classification
    optForPro: 'Asked for professional classification',
    optForNonPro: 'Opted for non professional classification',
    investorStatus: 'Investor status',
    excludeProducts: 'Excluded category of products/services',
    jobPosition: 'Job position',
    numberYearsExperienceRelatedFunction: 'Number of years of experience in a function related to financial markets',
    numberYearsCurrentPosition: 'Number of years of experience in current position',
    financialInstruments: 'Financial instruments that have already been the subject of transactions by the said natural person in the professional environment',
    financialInstrumentsSpecification: 'Financial instruments specification',
    marketArea: 'Market area(s) which have been the subject of transactions',
    natureTransactionPerYear: 'Nature of transactions per year (in €)',
    volumeTransactionPerYear: 'Volume of transactions per year (in €)',
    activitiesBenefitFromExperience: 'Activities/professions allow to benefit from experience in the financial field',
    activitiesBenefitFromExperienceSpecification: 'Benefit specification',

    // Risk nature
    financialAssetManagementMethod: 'Financial asset management method',
    internalManagement: 'Internal management',
    withAdviceOfAuthorisedThirdPartyInstitution: 'With the advice of an authorised third party institution',
    mandateEntrustedToManagers: 'By mandate(s) entrusted to a manager(s)',
    frequencyFinancialTransactions: 'Frequency of financial transactions',
    investmentvehiclesAlreadyUsed: 'Investment vehicles already used',
    investmentvehiclesAlreadyUsedSpecification: 'Investment vehicles already used specification',

    // Risk objective
    performanceProfile: 'Performance profile',
    performanceProfileSpecification: 'Performance profile specification',
    clientNeeds: 'Client needs (purpose of the investment)',
    otherFinancialInformation: 'Other relevant financial information (optional) including periodic cash flows to be invested in cash management, asset allocation',
    investmentHorizonWanted: 'Investment horizons wanted',
    investmentHorizonWantedSpecificPeriod: 'Investment horizons wanted (specific period)',
    riskProfile: 'Risk profile: ability to incur losses',
    riskProfileCapital: 'Capital loss limited to',
    riskAcceptanceLevel1: 'Risk acceptance: Basic (SRRI = 1, SRI = 1)',
    riskAcceptanceLevel2: 'Risk acceptance: Middleman (SRRI = 2/3, SRI = 2)',
    riskAcceptanceLevel3: 'Risk acceptance: Advanced (SRRI = 4 to 6, SRI = 3 to 5)',
    riskAcceptanceLevel4: 'Risk acceptance: Expert (SRRI = 6, SRI = 6/7)',

    // Risk constraints
    statutoryConstraints: 'Statutory constraints/special rules concerning eligible assets',
    taxConstraints: 'Tax constraints',
    otherConstraints: 'Others (including SRI, ESG, etc.)',
    investmentDecisionsAdHocCommittee: 'Are investment decisions validated by an ad hoc committee?',
    investmentDecisionsAdHocCommitteeSpecification: 'Ad hoc committee specification',
    otherPersonsAuthorised: 'Other persons authorised to take investment decisions and give instructions',

    // Validation
    undersigned: 'Identity',
    actingOnBehalfOf: 'On behalf of',
    doneAt: 'Done at',
    doneDate: 'Date',
    positionRepresentative: 'Position of the representative of the legal person',
    electronicSignatureDocumentID: 'National identification card',
};

export const controlToList = {

    // General
    legalForm: 'legalFormList',
    registeredCompanyCountry: 'countries',
    sectorActivity: 'sectorActivityList',
    regulatoryStatus: 'regulatoryStatusList',
    regulatoryStatusInsurerType: 'regulatoryStatusInsurerTypeList',
    otherIdentificationNumber: 'identificationNumberList',
    commercialCountry: 'countries',

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

    nationality: 'countries',
    countryTaxResidence: 'countries',
};
