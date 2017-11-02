import {ArrangementType} from '../../../ofi-req-services/ofi-fund-invest/model';

export interface CollectiveArchiveEntry {
    total: number;
    cutoffDate: string;
    asset: string;
    price: number;
    type: ArrangementType;
}

export interface OfiCollectiveArchiveState {
    collectiveArchiveList: Array<CollectiveArchiveEntry>;
    requested: boolean;
}
