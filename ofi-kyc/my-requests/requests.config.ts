import {fundItems} from '@ofi/ofi-main/ofi-product/productConfig';

export const checkboxControls = ['capitalNature', 'financialInstruments', 'financialInstruments', 'marketArea', 'financialAssetManagementMethod', 'investmentvehiclesAlreadyUsed', 'frequencyFinancialTransactions', 'clientNeeds', 'investmentHorizonWanted', 'performanceProfile'];
export const selectControls = [
    'custodianHolderAccount',
    'custodianCountry',
    'financialInstruments',
    'marketArea',
    'natureTransactionPerYear',
    'volumeTransactionPerYear',
    'activities',
    'ownAccountinvestor',
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
    'legalStatus',
    'legalStatusInsurerType',
    'legalStatusPublicEstablishmentType',
    'riskProfile'
];

export const steps = {
    'amcSelection' : 1,
    'introduction' : 2,
    'identification' : 3,
    'riskProfile' : 4,
    'documents' : 5,
    'validation' : 6
};

export const countries = fundItems.domicileItems;

export const legalFormList = [
    {
        "id": "EARL",
        "text": "EARL : Entreprise agricole à responsabilité limitée"
    },
    {
        "id": "EI",
        "text": "EI : Entreprise individuelle"
    },
    {
        "id": "EIRL",
        "text": "EIRL: Entreprise individuelle à responsabilité limitée"
    },
    {
        "id": "EURL",
        "text": "EURL : Entreprise unipersonnelle à responsabilité limitée"
    },
    {
        "id": "GAEC",
        "text": "GAEC : Groupement agricole d'exploitation en commun"
    },
    {
        "id": "GEIE",
        "text": "GEIE : Groupement européen d'intérêt économiqueGIE : Groupement d'intérêt économique"
    },
    {
        "id": "SARL",
        "text": "SARL : Société à responsabilité limitée"
    },
    {
        "id": "SA",
        "text": "SA : Société anonyme"
    },
    {
        "id": "SAS",
        "text": "SAS : Société par actions simplifiée"
    },
    {
        "id": "SASU",
        "text": "SASU : Société par actions simplifiée unipersonnelle"
    },
    {
        "id": "SC",
        "text": "SC : Société civile"
    },
    {
        "id": "SCA",
        "text": "SCA : Société en commandite par actions"
    },
    {
        "id": "SCI",
        "text": "SCI : Société civile immobilière"
    },
    {
        "id": "SCIC",
        "text": "SCIC : Société coopérative d'intérêt collectif"
    },
    {
        "id": "Partnership",
        "text": "Partnership"
    },
    {
        "id": "Unincorporatedassociation",
        "text": "Unincorporated association"
    },
    {
        "id": "SoleTrader",
        "text": "Sole Trader"
    },
    {
        "id": "LimitedPartnership",
        "text": "Limited Partnership"
    },
    {
        "id": "Trust",
        "text": "Trust"
    },
    {
        "id": "LimitedCompany",
        "text": "Limited Company"
    },
    {
        "id": "LLP",
        "text": "LLP:Limited Liability Partnership"
    },
    {
        "id": "CIC",
        "text": "CIC:Community Interest Company"
    },
    {
        "id": "CIO",
        "text": "CIO:Charitable Incorporated Organisation"
    },
    {
        "id": "Coop",
        "text": "Co-op:Co-operative Society"
    },
    {
        "id": "BenCom",
        "text": "BenCom: Community Benefit Society"
    },
    {
        "id": "BuildingSocietyBuilding",
        "text": "Building Society Building"
    },
    {
        "id": "CreditUnion",
        "text": "Credit Union"
    },
    {
        "id": "FriendlySociety",
        "text": "Friendly Society"
    }
];

export const sectorActivityList = [
    {
        "id": "Cosmetics",
        "text": "Cosmetics"
    },
    {
        "id": "ConsumerElectronics",
        "text": "Consumer Electronics"
    },
    {
        "id": "Appliances",
        "text": "Appliances"
    },
    {
        "id": "Sportingequipmentmanufacturers",
        "text": "Sporting equipment manufacturers"
    },
    {
        "id": "Luxury",
        "text": "Luxury"
    },
    {
        "id": "Heavyindustryexcludingenergy",
        "text": "Heavy industry (excluding energy)"
    },
    {
        "id": "Industrialmachinery",
        "text": "Industrial machinery"
    },
    {
        "id": "Electricalequipment",
        "text": "Electrical equipment"
    },
    {
        "id": "AeronauticsAerospaceandDefense",
        "text": "Aeronautics, Aerospace and Defense"
    },
    {
        "id": "Buildingconstructionandpublicworks",
        "text": "Building, construction and public works"
    },
    {
        "id": "Cement",
        "text": "Cement"
    },
    {
        "id": "Chemistry",
        "text": "Chemistry"
    },
    {
        "id": "AutomobileManufacturers",
        "text": "Automobile Manufacturers"
    },
    {
        "id": "Tires",
        "text": "Tires"
    },
    {
        "id": "InformationandCommunicationTechnologies",
        "text": "Information and Communication Technologies"
    },
    {
        "id": "Telecommunicationsoperators",
        "text": "Telecommunications operators"
    },
    {
        "id": "Advertising",
        "text": "Advertising"
    },
    {
        "id": "TelecommunicationandNetworkEquipmentManufacturers",
        "text": "Telecommunication and Network Equipment Manufacturers"
    },
    {
        "id": "ProgrammingSoftware",
        "text": "Programming & Software"
    },
    {
        "id": "Mobilephones",
        "text": "Mobile phones"
    },
    {
        "id": "Computerequipment",
        "text": "Computer equipment"
    },
    {
        "id": "ITtechnologiesandservices",
        "text": "IT technologies and services"
    },
    {
        "id": "Transportation",
        "text": "Transportation"
    },
    {
        "id": "Airlines",
        "text": "Airlines"
    },
    {
        "id": "Railtransport",
        "text": "Rail transport"
    },
    {
        "id": "Shippingofgoods",
        "text": "Shipping of goods"
    },
    {
        "id": "Cruises",
        "text": "Cruises"
    },
    {
        "id": "Postmailanddeliveries",
        "text": "Post, mail and deliveries"
    },
    {
        "id": "Health",
        "text": "Health"
    },
    {
        "id": "Medicalequipmentandhealthproducts",
        "text": "Medical equipment and health products"
    },
    {
        "id": "Pharmacy",
        "text": "Pharmacy"
    },
    {
        "id": "Tobacco",
        "text": "Tobacco"
    },
    {
        "id": "Catering",
        "text": "Catering"
    },
    {
        "id": "other",
        "text": "Other"
    }
];

export const legalStatusList = [
    {
        "id": "pensionOrMutualInsurance",
        "text": "Pension fund/mutual insurance institution"
    },
    {
        "id": "bankingInstitution",
        "text": "Banking Institution"
    },
    {
        "id": "insurer",
        "text": "Insurer"
    },
    {
        "id": "Localauthoritiesstates",
        "text": "Local authorities/states"
    },
    {
        "id": "PublicInstitution",
        "text": "Public Institution"
    },
    {
        "id": "publicEstablishment",
        "text": "Public establishment"
    },
    {
        "id": "listedCompany",
        "text": "Listed Company"
    },
    {
        "id": "Approvedorregulatedinstitutionalinvestors",
        "text": "Approved or regulated institutional investors"
    },
    {
        "id": "Foundationassociation",
        "text": "Foundation/association"
    },
    {
        "id": "Assetmanagementcompany",
        "text": "Asset Management Company"
    },
    {
        "id": "Supranationalorganization",
        "text": "Supranational organization"
    },
    {
        "id": "SICAV",
        "text": "SICAV"
    },
    {
        "id": "FinancialInstitutionauthorisedorregulatedunderEUornationallawofamemberstate",
        "text": "Financial Institution authorised or regulated under EU or national law of a member state"
    },
    {
        "id": "other",
        "text": "Other"
    }
];

export const legalStatusInsurerTypeList = [
    {
        "id": "Regulatedasset",
        "text": "Regulated asset"
    },
    {
        "id": "Lifeinsurancecontracts",
        "text": "Life insurance contracts"
    }
];

export const publicEstablishmentList = [
    {
        "id": "Councilhouse",
        "text": "Council house"
    },
    {
        "id": "other",
        "text": "Others"
    }
];

export const companyActivitiesList = [
    {
        "id": "ownAccount",
        "text": "Own-account investor"
    },
    {
        "id": "onBehalfOfThirdParties",
        "text": "Investor on behalf of third parties"
    }
];

export const ownAccountInvestorList = [
    {
        "id": "EmbassiesandConsulates",
        "text": "Embassies and Consulates"
    },
    {
        "id": "UnionsPoliticalParties",
        "text": "Unions/Political Parties"
    },
    {
        "id": "Cultsandreligiousassociationspresentingaspecificriskradical",
        "text": "Cults and religious associations presenting a specific risk (radical...)"
    },
    {
        "id": "Nationalsportsassociationsandsportsagents",
        "text": "National sports associations and sports agents"
    },
    {
        "id": "Tradingretailingofpreciousmetals",
        "text": "Trading & retailing of precious metals"
    },
    {
        "id": "Artmarketantiques",
        "text": "Art market / antiques"
    },
    {
        "id": "Building",
        "text": "Building"
    },
    {
        "id": "Computertelephonytelecommunication",
        "text": "Computer / telephony / telecommunication"
    },
    {
        "id": "Guardingandsecurity",
        "text": "Guarding and security"
    },
    {
        "id": "Packaging",
        "text": "Packaging"
    },
    {
        "id": "Ironworkers",
        "text": "Ironworkers"
    },
    {
        "id": "GoldpannersFrenchGuiana",
        "text": "Gold panners (French Guiana)"
    },
    {
        "id": "Wastetreatment",
        "text": "Waste treatment"
    },
    {
        "id": "Usedvehicletrading",
        "text": "Used vehicle trading"
    },
    {
        "id": "Renewableenergies",
        "text": "Renewable energies"
    },
    {
        "id": "TrainingActivityInterim",
        "text": "Training Activity / Interim"
    },
    {
        "id": "MedicalParamedical",
        "text": "Medical / Paramedical"
    },
    {
        "id": "Restoration",
        "text": "Restoration"
    },
    {
        "id": "Vitiviniculture",
        "text": "Vitiviniculture"
    },
    {
        "id": "Realestateagencies",
        "text": "Real estate agencies"
    },
    {
        "id": "Onlinegamingcompanies",
        "text": "Online gaming companies"
    },
    {
        "id": "LogisticsTransport",
        "text": "Logistics / Transport"
    },
    {
        "id": "Cleaning",
        "text": "Cleaning"
    },
    {
        "id": "ManagementCompanyInvestmentserviceprovider",
        "text": "Management Company / Investment service provider"
    }
];

export const investorOnBehalfList = [
    {
        "id": "ManagementCompanyInvestmentserviceprovidermanagingaUCITS",
        "text": "Management Company / Investment service provider managing a UCITS"
    },
    {
        "id": "ManagementCompanyInvestmentserviceprovidermanagingamandate",
        "text": "Management Company / Investment service provider managing a mandate"
    }
];

export const geographicalAreaList = [
    {
        "id": "Europeanunion",
        "text": "European union"
    },
    {
        "id": "oecd",
        "text": "OECD outside the European Union"
    },
    {
        "id": "outsideOecd",
        "text": "Outside OECD / Outside European Union"
    }
];

export const geographicalOriginTypeList = [
    {
        "id": "country",
        "text": "Country"
    },
    {
        "id": "area",
        "text": "Area"
    }
];

export const financialAssetsInvestedList = [
    {
        "id": "0to50millions",
        "text": "0 to 50 millions €"
    },
    {
        "id": "50to100millions",
        "text": "50 to 100 millions €"
    },
    {
        "id": "100to500millions",
        "text": "100 to 500 millions €"
    },
    {
        "id": "500millionsto1milliard",
        "text": "500 millions to 1 milliard €"
    },
    {
        "id": "Beyond",
        "text": "Beyond"
    }
];

export const custodianHolderAccountList = [
    {
        "id": "BancodeOroUnibank",
        "text": "Banco de Oro Unibank"
    },
    {
        "id": "BankofAmerica",
        "text": "Bank of America"
    },
    {
        "id": "BankofChinaHongKongLimited",
        "text": "Bank of China (Hong Kong) Limited"
    },
    {
        "id": "BankofIrelandSecuritiesServices",
        "text": "Bank of Ireland Securities Services"
    },
    {
        "id": "BankofNewYorkMellon",
        "text": "Bank of New York Mellon"
    },
    {
        "id": "Barclays",
        "text": "Barclays"
    },
    {
        "id": "BBVACompass",
        "text": "BBVA Compass"
    },
    {
        "id": "BNPParibasSecuritiesServices",
        "text": "BNP Paribas Securities Services"
    },
    {
        "id": "BrownBrothersHarriman",
        "text": "Brown Brothers Harriman"
    },
    {
        "id": "CACEIS",
        "text": "CACEIS"
    },
    {
        "id": "CIBCMellon",
        "text": "CIBC Mellon"
    },
    {
        "id": "Citigroup",
        "text": "Citigroup"
    },
    {
        "id": "Clearstream",
        "text": "Clearstream"
    },
    {
        "id": "ComericaBank",
        "text": "Comerica Bank"
    },
    {
        "id": "CreditSuisse",
        "text": "Credit Suisse"
    },
    {
        "id": "DeutscheBank",
        "text": "Deutsche Bank"
    },
    {
        "id": "EstrategiaInvestimentos",
        "text": "Estrategia Investimentos"
    },
    {
        "id": "ESUNCommercialBank",
        "text": "E.SUN Commercial Bank"
    },
    {
        "id": "Euroclear",
        "text": "Euroclear"
    },
    {
        "id": "FifthThirdBank",
        "text": "Fifth Third Bank"
    },
    {
        "id": "GoldmanSachs",
        "text": "Goldman Sachs"
    },
    {
        "id": "HDFCBank",
        "text": "HDFC Bank"
    },
    {
        "id": "HuntingtonNationalBank",
        "text": "Huntington National Bank"
    },
    {
        "id": "HSBC",
        "text": "HSBC"
    },
    {
        "id": "ICBC",
        "text": "ICBC"
    },
    {
        "id": "ICICIBank",
        "text": "ICICI Bank"
    },
    {
        "id": "JapanTrusteeServicesBank",
        "text": "Japan Trustee Services Bank"
    },
    {
        "id": "JPMorganChase",
        "text": "JPMorgan Chase"
    },
    {
        "id": "KasbankNV",
        "text": "Kasbank N.V."
    },
    {
        "id": "KeyBank",
        "text": "KeyBank"
    },
    {
        "id": "LBBW",
        "text": "LBBW"
    },
    {
        "id": "Maybank",
        "text": "Maybank"
    },
    {
        "id": "MegaInternationalCommercialBank",
        "text": "Mega International Commercial Bank"
    },
    {
        "id": "MitsubishiUFJTrustandBankingCorporation",
        "text": "Mitsubishi UFJ Trust and Banking Corporation"
    },
    {
        "id": "MorganStanleySmithBarney",
        "text": "Morgan Stanley Smith Barney"
    },
    {
        "id": "NAB",
        "text": "NAB"
    },
    {
        "id": "NationalBankofAbuDhabi",
        "text": "National Bank of Abu Dhabi"
    },
    {
        "id": "NorthernTrust",
        "text": "Northern Trust"
    },
    {
        "id": "PTBankCentralAsiaTbk",
        "text": "PT. Bank Central Asia, Tbk."
    },
    {
        "id": "QatarNationalBank",
        "text": "Qatar National Bank"
    },
    {
        "id": "RBCInvestorServices",
        "text": "RBC Investor Services"
    },
    {
        "id": "SocitGnraleSecuritiesServices",
        "text": "Société Générale Securities Services"
    },
    {
        "id": "StandardBank",
        "text": "Standard Bank"
    },
    {
        "id": "StandardCharteredBank",
        "text": "Standard Chartered Bank"
    },
    {
        "id": "StateBankofIndia",
        "text": "State Bank of India"
    },
    {
        "id": "StateStreetBankTrust",
        "text": "State Street Bank & Trust"
    },
    {
        "id": "TheMasterTrustBankofJapan",
        "text": "The Master Trust Bank of Japan"
    },
    {
        "id": "TrustCustodyServicesBank",
        "text": "Trust & Custody Services Bank"
    },
    {
        "id": "MauritiusCommercialBank",
        "text": "Mauritius Commercial Bank"
    },
    {
        "id": "USBank",
        "text": "U.S. Bank"
    },
    {
        "id": "UBS",
        "text": "UBS"
    },
    {
        "id": "UniCredit",
        "text": "UniCredit"
    },
    {
        "id": "UnionBankNA",
        "text": "Union Bank N.A."
    },
    {
        "id": "Vontobel",
        "text": "Vontobel"
    },
    {
        "id": "WellsFargoBank",
        "text": "Wells Fargo Bank"
    },
    {
        "id": "other",
        "text": "Other"
    }
];

export const financialInstrumentsList = [
    {
        "id": "MoneyMarketSecurities",
        "text": "Money Market Securities"
    },
    {
        "id": "Bonds",
        "text": "Bonds"
    },
    {
        "id": "Convertiblebonds",
        "text": "Convertible Bonds"
    },
    {
        "id": "Listedshares",
        "text": "Listed shares"
    },
    {
        "id": "Unlistedshares",
        "text": "Unlisted shares"
    },
    {
        "id": "UCITS",
        "text": "UCITS"
    },
    {
        "id": "FIA",
        "text": "FIA"
    },
    {
        "id": "Foreignexchangemarket",
        "text": "Foreign exchange market"
    },
    {
        "id": "Swaps",
        "text": "Swaps"
    },
    {
        "id": "IFT",
        "text": "IFT"
    },
    {
        "id": "DerivativesandcomplexproductsstructuredproductsEMTNetc",
        "text": "Derivatives and complex products (structured products, EMTN, etc.)"
    },
    {
        "id": "PierrePapierSCPI",
        "text": "Pierre Papier (SCPI...)"
    },
    {
        "id": "other",
        "text": "Other"
    }
];

export const natureOfTransactionsList = [
    {
        "id": "0to1000",
        "text": "0 to 1 000 €"
    },
    {
        "id": "1000to10000",
        "text": "1 000 to 10 000 €"
    },
    {
        "id": "10000to100000",
        "text": "10 000 to 100 000 €"
    },
    {
        "id": "100000to1million",
        "text": "100 000 to 1 million €"
    },
    {
        "id": "Beyond",
        "text": "Beyond"
    }
];

export const volumeOfTransactionsList = [
    {
        "id": "1to10transactions",
        "text": "1 to 10 transactions"
    },
    {
        "id": "10to50transactions",
        "text": "10 to 50 transactions"
    },
    {
        "id": "50to100transactions",
        "text": "50 to 100 transactions"
    },
    {
        "id": "100to500transactions",
        "text": "100 to 500 transactions"
    },
    {
        "id": "Beyond",
        "text": "Beyond"
    }
];

export const investmentVehiclesList = [
    {
        "id": "MoneymarketsecuritiesTreasury",
        "text": "Money market securities (Treasury)"
    },
    {
        "id": "Bonds",
        "text": "Bonds"
    },
    {
        "id": "Convertiblebonds",
        "text": "Convertible Bonds"
    },
    {
        "id": "Listedshares",
        "text": "Listed shares"
    },
    {
        "id": "Unlistedshares",
        "text": "Unlisted shares"
    },
    {
        "id": "UCITS",
        "text": "UCITS"
    },
    {
        "id": "FIA",
        "text": "FIA"
    },
    {
        "id": "Notrated",
        "text": "Not Rated"
    },
    {
        "id": "PierrePapier",
        "text": "Pierre Papier"
    },
    {
        "id": "Foreignexchangemarket",
        "text": "Foreign exchange market"
    },
    {
        "id": "Swaps",
        "text": "Swaps"
    },
    {
        "id": "IFT",
        "text": "IFT"
    },
    {
        "id": "otherderivatives",
        "text": "Other derivatives and complex products (structured products, EMTN, etc.)"
    },
    {
        "id": "other",
        "text": "Other"
    }
];

export const frequencyList = [
    {
        "id": "Daily",
        "text": "Daily"
    },
    {
        "id": "Weekly",
        "text": "Weekly"
    },
    {
        "id": "Monthly",
        "text": "Monthly"
    },
    {
        "id": "Quarterly",
        "text": "Quarterly"
    },
    {
        "id": "Semiannual",
        "text": "Semi-annual"
    },
    {
        "id": "Annual",
        "text": "Annual"
    },
    {
        "id": "Punctual",
        "text": "Punctual"
    }
];

export const performanceProfileList = [
    {
        "id": "Capitalpreservation",
        "text": "Capital preservation"
    },
    {
        "id": "Performance",
        "text": "Performance"
    },
    {
        "id": "Income",
        "text": "Income"
    },
    {
        "id": "Hedge",
        "text": "Hedge"
    },
    {
        "id": "Leverageeffect",
        "text": "Leverage effect"
    },
    {
        "id": "Othersegliabilitysrelated",
        "text": "Others (e.g. liability(s) related)"
    }
];

export const clientNeedsList = [
    {
        "id": "Standaloneinvestment",
        "text": "Standalone investment"
    },
    {
        "id": "PortfolioComponentDiversification",
        "text": "Portfolio Component (Diversification)"
    },
    {
        "id": "Specificinvestmentneed",
        "text": "Specific investment need"
    }
];

export const investmentHorizonList = [
    {
        "id": "Notimeconstraints",
        "text": "No time constraints"
    },
    {
        "id": "Veryshortterm1year",
        "text": "Very short term (<1 year)"
    },
    {
        "id": "Shortterm1year3years",
        "text": "Short term (>1 year < 3 years)"
    },
    {
        "id": "Mediumterm3years5years",
        "text": "Medium term (>3years <5 years)"
    },
    {
        "id": "Longterm5years",
        "text": "Long-term (>5 years)"
    },
    {
        "id": "specific",
        "text": "Specific timeframe"
    }
];

export const riskProfileList = [
    {
        "id": "GuaranteedCapital",
        "text": "Guaranteed Capital"
    },
    {
        "id": "partiallyProtected",
        "text": "Partially protected capital"
    },
    {
        "id": "Nocapitalguaranteecapitallossuptotheamountinvested",
        "text": "No capital guarantee (capital loss up to the amount invested)"
    },
    {
        "id": "Riskoflossbeyondtheinvestedcapital",
        "text": "Risk of loss beyond the invested capital"
    }
];

export const riskAcceptanceList = [
    {
        profile: "Level 1: Basic",
        volatility: "Volatility less than 0.5%",
        srri: "1",
        sri: "1"
    },
    {
        profile: "Level 2: Middleman",
        volatility: "Volatility between 0.5% and 5%",
        srri: "2 & 3",
        sri: "2"
    },
    {
        profile: "Level 3: Advanced",
        volatility: "Volatility between 5% and 25%",
        srri: "4 to 6",
        sri: "3 to 5"
    },
    {
        profile: "Level 4: Expert",
        volatility: "Volatility greater than 25%",
        srri: "6",
        sri: "6 & 7"
    }
];