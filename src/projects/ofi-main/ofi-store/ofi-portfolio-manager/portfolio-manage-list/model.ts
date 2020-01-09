export interface FundAccess {
    fundId: number;
    kycId: number;
    walletId: number;
    status: boolean;
}

export interface MandateInvestor {
    investorId: number;
    kycId: number;
    walletId: number;
    status: boolean;
}

export interface PortfolioManagerDetail {
    pmId: number;
    type: string;
    emailAddress: string;
    userId: number;
    inviteId: number;
    firstName: string;
    pmActive: boolean;
    fundAccess?: {
        [fundId: string]: FundAccess;
    };
    mandateInvestors?: {
        [investorId: string]: MandateInvestor
    }
}

export interface PortfolioManagerList {
    requested: boolean;
    portfolioManagerList: {
        [pmId: string]: PortfolioManagerDetail;
    };
}
