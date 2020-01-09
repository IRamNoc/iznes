export interface SubPortfolioBankingDetailsItems {
    establishmentName: string;
    bic: string;
    addressLine1: string;
    addressLine2: string;
    zipCode: string;
    city: string;
    country: string;
}

export interface SubPortfolioBankingDetails {
    [key: string]: SubPortfolioBankingDetailsItems;
}

export interface SubPortfolioBankingDetailsState {
    requested: boolean;
    bankingDetails: SubPortfolioBankingDetails;
}
