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

export interface PortfolioManagerDetailDashboard {
    emailAddress: string,
    firstName: string,
    lastName: string,
    type: string,
    investorName: string,
    fundName: string,
    portfolioName: string,
    subportfolioName: string,
    subportfolioHashIdentifierCode: string,
    fundCustodianBank: number,
    subportfolioEtablishmentName: string,
    subportfolioBIC: string,
    subportfolioIBAN: string,
    subportfolioSecurityAccount: string,
    subportfolioEntityReceivingPaymentInstructions: string,
    subportfolioEntityReceivingPositionCertificates: string,
    subportfolioEntityReceivingTransactionNotices: string,
    fundAdministrator: string
}
