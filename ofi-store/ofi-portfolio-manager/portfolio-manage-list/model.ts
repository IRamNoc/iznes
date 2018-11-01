export interface FundAccess {
    fundId: number;
    kycId: number;
    walletId: number;
    status: boolean;
}

export interface PortfolioManagerDetail {
    pmId: number;
    emailAddress: string;
    userId: number;
    inviteId: number;
    firstName: string;
    pmActive: boolean;
    fundAccess?: {
        [fundId: string]: FundAccess;
    };
}

export interface PortfolioManagerList {
    requested: boolean;
    portfolioManagerList: {
        [pmId: string]: PortfolioManagerDetail;
    };
}
