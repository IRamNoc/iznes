import { List, Map } from 'immutable';

export interface HoldingHistoryDetails {
    
}

export interface OfiHoldingHistoryState {
    //holdingHistoryList: List<HoldingHistoryDetails>;
    holdingHistoryList: any;
    requested: boolean;
    holdingHistoryRequested: boolean;
}
