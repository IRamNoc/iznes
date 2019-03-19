export enum InvestorType {
    Institutional = 10,
    FundOfFundsManager = 20,
    Retail = 30,
    Mandate = 40,
    DiscretionaryManager = 50,
}

export type InvestorTypeList = { id: InvestorType, text: string }[];

export const investorTypeList: InvestorTypeList = [
    { id: InvestorType.Institutional, text: 'Institutional Investor' },
    { id: InvestorType.FundOfFundsManager, text: 'Fund of Funds Manager' },
    { id: InvestorType.Retail, text: 'Retail Investor' },
    { id: InvestorType.Mandate, text: 'Investor by Mandate' },
    { id: InvestorType.DiscretionaryManager, text: 'Discretionary Manager' },
];

export function buildInvestorTypeList(...types: InvestorType[]): InvestorTypeList {
    return investorTypeList.filter(type => types.includes(type.id));
}
