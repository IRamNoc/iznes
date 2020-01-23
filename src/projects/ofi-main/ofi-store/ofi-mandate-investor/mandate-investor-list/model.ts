import { InvestorType } from '../../../shared/investor-types';

export interface MandateInvestor {
    id: number;
    walletId: number;
    kycId: number;
    firstName: string;
    lastName: string;
    reference: string;
    companyName: string;
    walletName: string;
    investorType: InvestorType.InstitutionalMandate | InvestorType.RetailMandate;
}

export interface OfiMandateInvestorListState {
    requested: boolean;
    records: MandateInvestor[],
}
