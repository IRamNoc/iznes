export interface AmHoldersDetails {
    fundId: any;
    fundName: any;
    fundLei: any;
    fundCurrency: any;
    fundAum: any;
    fundHolderNumber: any;
    shareId: any;
    shareName: any;
    shareIsin: any;
    shareNav: any;
    shareUnitNumber: any;
    shareCurrency: any;
    shareAum: any;
    shareHolderNumber: any;
    shareRatio: any;
}

export interface AmHolders {
    amHoldersList: {
        [key: string]: AmHoldersDetails
    };
    requested: boolean;
}
