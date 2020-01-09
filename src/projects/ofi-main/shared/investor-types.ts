export enum InvestorType {
    InstitutionalDirect = 10,
    FundOfFundsManager = 20,
    RetailDirect = 30,
    InstitutionalMandate = 40,
    DiscretionaryManager = 50,
    RetailMandate = 60,
    NowCPKycIssuer = 70,
    NowCPKycInvestor = 80,
}

export type InvestorTypeList = { id: InvestorType, text: string }[];

export const investorTypeList: InvestorTypeList = [
    { id: InvestorType.InstitutionalDirect, text: 'Institutional Investor' },
    { id: InvestorType.FundOfFundsManager, text: 'Fund of Funds Manager' },
    { id: InvestorType.RetailDirect, text: 'Retail Investor' },
    { id: InvestorType.InstitutionalMandate, text: 'Institutional Investor' },
    { id: InvestorType.DiscretionaryManager, text: 'Discretionary Manager' },
    { id: InvestorType.RetailMandate, text: 'Retail Investor' },
];

export function buildInvestorTypeList(...types: InvestorType[]): InvestorTypeList {
    return investorTypeList.filter(type => types.includes(type.id));
}

export function isRetail(type: InvestorType): boolean {
    return [InvestorType.RetailDirect, InvestorType.RetailMandate].includes(type);
}

export function isInstitutional(type: InvestorType): boolean {
    return [InvestorType.InstitutionalDirect, InvestorType.InstitutionalMandate].includes(type);
}

export function isPortfolioManager(type: InvestorType): boolean {
    return [InvestorType.FundOfFundsManager, InvestorType.DiscretionaryManager].includes(type);
}

export function isMandate(type: InvestorType): boolean {
    return [InvestorType.InstitutionalMandate, InvestorType.RetailMandate].includes(type);
}

export function isDirect(type: InvestorType): boolean {
    return [InvestorType.InstitutionalDirect, InvestorType.RetailDirect].includes(type);
}
