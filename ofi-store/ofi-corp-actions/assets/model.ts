export enum AssetStatus {
    SUSPENDED = 0,
    ACTIVE = 1,
    DELETED = 2
}

export interface AssetDetail {
    address: string;
    asset: string;
    companyName: string;
    isin: 'string';
    managementCompanyId: number;
    status: AssetStatus;
    walletId: number;
}

export interface OfiUserAssetsState {
    ofiUserAssetList: Array<AssetDetail>;
    requested: boolean;
}
