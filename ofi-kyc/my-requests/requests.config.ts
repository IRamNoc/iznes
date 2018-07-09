import {fundItems} from '@ofi/ofi-main/ofi-product/productConfig';

export const checkboxControls = ['capitalNature', 'financialInstruments', 'financialInstruments', 'marketArea', 'financialAssetManagementMethod', 'investmentvehiclesAlreadyUsed', 'frequencyFinancialTransactions', 'clientNeeds', 'investmentHorizonWanted', 'performanceProfile'];

export const countries = fundItems.domicileItems;

export const legalFormList = [
    {text: "EARL : Entreprise agricole à responsabilité limitée"},
    {text: "EI : Entreprise individuelle"},
    {text: "EIRL: Entreprise individuelle à responsabilité limitée"},
    {text: "EURL : Entreprise unipersonnelle à responsabilité limitée"},
    {text: "GAEC : Groupement agricole d'exploitation en commun"},
    {text: "GEIE : Groupement européen d'intérêt économiqueGIE : Groupement d'intérêt économique"},
    {text: "SARL : Société à responsabilité limitée"},
    {text: "SA : Société anonyme"},
    {text: "SAS : Société par actions simplifiée"},
    {text: "SASU : Société par actions simplifiée unipersonnelle"},
    {text: "SC : Société civile"},
    {text: "SCA : Société en commandite par actions"},
    {text: "SCI : Société civile immobilière"},
    {text: "SCIC : Société coopérative d'intérêt collectif"},
    {text: "Partnership"},
    {text: "Unincorporated association"},
    {text: "Sole Trader"},
    {text: "Limited Partnership"},
    {text: "Trust"},
    {text: "Limited Company"},
    {text: "LLP:Limited Liability Partnership"},
    {text: "CIC:Community Interest Company"},
    {text: "CIO:Charitable Incorporated Organisation"},
    {text: "Co-op:Co-operative Society"},
    {text: "BenCom: Community Benefit Society"},
    {text: "Building Society Building"},
    {text: "Credit Union"},
    {text: "Friendly Society"},
];

export const sectorActivityList = [
    {text: "Cosmetics"},
    {text: "Consumer Electronics"},
    {text: "Appliances"},
    {text: "Sporting equipment manufacturers"},
    {text: "Luxury"},
    {text: "Heavy industry (excluding energy)"},
    {text: "Industrial machinery"},
    {text: "Electrical equipment"},
    {text: "Aeronautics, Aerospace and Defense"},
    {text: "Building, construction and public works"},
    {text: "Cement"},
    {text: "Chemistry"},
    {text: "Automobile Manufacturers"},
    {text: "Tires"},
    {text: "Information and Communication Technologies"},
    {text: "Telecommunications operators"},
    {text: "Advertising"},
    {text: "Telecommunication and Network Equipment Manufacturers"},
    {text: "Programming & Software"},
    {text: "Mobile phones"},
    {text: "Computer equipment"},
    {text: "IT technologies and services"},
    {text: "Transportation"},
    {text: "Airlines"},
    {text: "Rail transport"},
    {text: "Shipping of goods"},
    {text: "Cruises"},
    {text: "Post, mail and deliveries"},
    {text: "Health"},
    {text: "Medical equipment and health products"},
    {text: "Pharmacy"},
    {text: "Tobacco"},
    {text: "Catering"},
    {id: "other", text: "Other"}
];

export const legalStatusList = [
    {id: "pensionOrMutualInsurance", text: "Pension fund/mutual insurance institution"},
    {id : "bankingInstitution", text: "Banking Institution"},
    {id: "insurer", text: "Insurer"},
    {text: "Local authorities/states"},
    {text: "Public Institution"},
    {id: "publicEstablishment", text: "Public establishment"},
    {id: "listedCompany", text: "Listed company"},
    {text: "Approved or regulated institutional investors"},
    {text: "Foundation/association"},
    {text: "Asset management company"},
    {text: "Supranational organization"},
    {text: "SICAV"},
    {text: "Financial Institution authorised or regulated under EU or national law of a member state"},
    {id: "other", text: "Other"}
];

export const legalStatusInsurerTypeList = [
    {text: "Regulated asset"},
    {text: "Life insurance contracts"},
];

export const publicEstablishmentList = [
    {text: "Council house"},
    {id : "other", text: "Others"}
];

export const companyActivitiesList = [
    {id: "ownAccount", text: "Own-account investor"},
    {id: "onBehalfOfThirdParties", "text": "Investor on behalf of third parties"}
];

export const ownAccountInvestorList = [
    {text: "Embassies and Consulates"},
    {text: "Unions/Political Parties"},
    {text: "Cults and religious associations presenting a specific risk (radical...)"},
    {text: "National sports associations and sports agents"},
    {text: "Trading & retailing of precious metals"},
    {text: "Art market / antiques"},
    {text: "Building"},
    {text: "Computer / telephony / telecommunication"},
    {text: "Guarding and security"},
    {text: "Packaging"},
    {text: "Ironworkers"},
    {text: "Gold panners (French Guiana)"},
    {text: "Waste treatment"},
    {text: "Used vehicle trading"},
    {text: "Renewable energies"},
    {text: "Training Activity / Interim"},
    {text: "Medical / Paramedical"},
    {text: "Restoration"},
    {text: "Vitiviniculture"},
    {text: "Real estate agencies"},
    {text: "Online gaming companies"},
    {text: "Logistics / Transport"},
    {text: "Cleaning"},
    {text: "Management Company / Investment service provider"}
];

export const investorOnBehalfList = [
    {text: "Management Company / Investment service provider managing a UCITS"},
    {text: "Management Company / Investment service provider managing a mandate"}
];

export const geographicalAreaList = [
    {text: "European union"},
    {id: "oecd", text: "OECD outside the European Union"},
    {id: "outsideOecd", text: "Outside OECD / Outside European Union"}
];

export const geographicalOriginTypeList = [
    {id: "country", text: "Country"},
    {id: "area", text: "Area"}
];

export const financialAssetsInvestedList = [
    {text: "0 to 50 millions €"},
    {text: "50 to 100 millions €"},
    {text: "100 to 500 millions €"},
    {text: "500 millions to 1 milliard €"},
    {text: "Beyond"}
];

export const custodianHolderAccountList = [
    {text: "Banco de Oro Unibank"},
    {text: "Bank of America"},
    {text: "Bank of China (Hong Kong) Limited"},
    {text: "Bank of Ireland Securities Services"},
    {text: "Bank of New York Mellon"},
    {text: "Barclays"},
    {text: "BBVA Compass"},
    {text: "BNP Paribas Securities Services"},
    {text: "Brown Brothers Harriman"},
    {text: "CACEIS"},
    {text: "CIBC Mellon"},
    {text: "Citigroup"},
    {text: "Clearstream"},
    {text: "Comerica Bank"},
    {text: "Credit Suisse"},
    {text: "Deutsche Bank"},
    {text: "Estrategia Investimentos"},
    {text: "E.SUN Commercial Bank"},
    {text: "Euroclear"},
    {text: "Fifth Third Bank"},
    {text: "Goldman Sachs"},
    {text: "HDFC Bank"},
    {text: "Huntington National Bank"},
    {text: "HSBC"},
    {text: "ICBC"},
    {text: "ICICI Bank"},
    {text: "Japan Trustee Services Bank"},
    {text: "JPMorgan Chase"},
    {text: "Kasbank N.V."},
    {text: "KeyBank"},
    {text: "LBBW"},
    {text: "Maybank"},
    {text: "Mega International Commercial Bank"},
    {text: "Mitsubishi UFJ Trust and Banking Corporation"},
    {text: "Morgan Stanley Smith Barney"},
    {text: "NAB"},
    {text: "National Bank of Abu Dhabi"},
    {text: "Northern Trust"},
    {text: "PT. Bank Central Asia, Tbk."},
    {text: "Qatar National Bank"},
    {text: "RBC Investor Services"},
    {text: "Société Générale Securities Services"},
    {text: "Standard Bank"},
    {text: "Standard Chartered Bank"},
    {text: "State Bank of India"},
    {text: "State Street Bank & Trust"},
    {text: "The Master Trust Bank of Japan"},
    {text: "Trust & Custody Services Bank"},
    {text: "Mauritius Commercial Bank"},
    {text: "U.S. Bank"},
    {text: "UBS"},
    {text: "UniCredit"},
    {text: "Union Bank N.A."},
    {text: "Vontobel"},
    {text: "Wells Fargo Bank"},
    {id: "other", text: "Other"}
];

export const financialInstrumentsList = [
    {text: "Money Market Securities"},
    {text: "Bonds"},
    {text: "Convertible bonds"},
    {text: "Listed shares"},
    {text: "Unlisted shares"},
    {text: "UCITS"},
    {text: "FIA"},
    {text: "Foreign exchange market"},
    {text: "Swaps"},
    {text: "IFT"},
    {text: "Derivatives and complex products (structured products, EMTN, etc.)"},
    {text: "Pierre Papier (SCPI...)"},
    {id: "other", text: "Other"}
];

export const natureOfTransactionsList = [
    {text: "0 to 1 000 €"},
    {text: "1 000 to 10 000 €"},
    {text: "10 000 to 100 000 €"},
    {text: "100 000 to 1 million €"},
    {text: "Beyond"}
];

export const volumeOfTransactionsList = [
    {text: "1 to 10 transactions"},
    {text: "10 to 50 transactions"},
    {text: "50 to 100 transactions"},
    {text: "100 to 500 transactions"},
    {text: "Beyond"}
];

export const investmentVehiclesList = [
    {text: "Money market securities (Treasury)"},
    {text: "Bonds"},
    {text: "Convertible bonds"},
    {text: "Listed shares"},
    {text: "Unlisted shares"},
    {text: "UCITS"},
    {text: "FIA"},
    {text: "Not rated"},
    {text: "Pierre Papier"},
    {text: "Foreign exchange market"},
    {text: "Swaps"},
    {text: "IFT"},
    {text: "Other derivatives and complex products (structured products, EMTN, etc.)"},
    {id: "other", text: "Other"}
];

export const frequencyList = [
    {text: "Daily"},
    {text: "Weekly"},
    {text: "Monthly"},
    {text: "Quarterly"},
    {text: "Semi-annual"},
    {text: "Annual"},
    {text: "Punctual"}
];

export const performanceProfileList = [
    {text: "Capital preservation"},
    {text: "Performance"},
    {text: "Income"},
    {text: "Hedge"},
    {text: "Leverage effect"},
    {text: "Others (e.g. liability(s) related)"}
];

export const clientNeedsList = [
    {text: "Standalone investment"},
    {text: "Portfolio Component (Diversification)"},
    {text: "Specific investment need"}
];

export const investmentHorizonList = [
    {text: "No time constraints"},
    {text: "Very short term (<1 year)"},
    {text: "Short term (>1 year < 3 years)"},
    {text: "Medium term (>3years <5 years)"},
    {text: "Long-term (>5 years)"},
    {id: "specific", text: "Specific timeframe"}
];

export const riskProfileList = [
    {text: "Guaranteed Capital"},
    {id : "partiallyProtected",text: "Partially protected capital"},
    {text: "No capital guarantee (capital loss up to the amount invested)"},
    {text: "Risk of loss beyond the invested capital"}
];

export const riskAcceptanceList = [
    {
        profile : "Level 1: Basic",
        volatility : "Volatility less than 0.5%",
        srri : "1",
        sri : "1"
    },
    {
        profile : "Level 2: Middleman",
        volatility : "Volatility between 0.5% and 5%",
        srri : "2 & 3",
        sri : "2"
    },
    {
        profile : "Level 3: Advanced",
        volatility : "Volatility between 5% and 25%",
        srri : "4 to 6",
        sri : "3 to 5"
    },
    {
        profile : "Level 4: Expert",
        volatility : "Volatility greater than 25%",
        srri : "6",
        sri : "6 & 7"
    }
];