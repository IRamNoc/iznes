import { InvestorType } from '../../../shared/investor-types';

export interface MandateInvestor {
    id: number;
    walletId: number;
    kycId: number;
    firstName: string;
    lastName: string;
    reference: string;
    companyName: string;
    investorType: InvestorType.Institutional | InvestorType.Retail;
}

export interface OfiMandateInvestorListState {
    requested: boolean;
    records: MandateInvestor[],
}
