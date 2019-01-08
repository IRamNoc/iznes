interface Assets {
    [asset: string]: {
        [address: string]: {
            reference: string;
            amount: string;
            beneficiaries: {
                address: string;
                endtime: number;
                starttime: number;
            };
            administrators: {
                address: string;
                endtime: number;
                starttime: number;
            };
        };
    };
}

export interface EncumbrancesState {
    encumbrances: Assets;
    requested: boolean;
}
