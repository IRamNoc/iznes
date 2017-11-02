export interface CollectiveArchiveEntry {
    subscriptionTotal: number;
    subscriptionQuantity: number;
    redemptionTotal: number;
    redemptionQuantity: number;
    cutoffDate: string;
    cutoffDateNumber: number;
    asset: string;
    price: number;
}

export interface OfiCollectiveArchiveState {
    collectiveArchiveList: Array<CollectiveArchiveEntry>;
    requested: boolean;
}
