import {Reducer, combineReducers} from 'redux';

import {
    OfiFundInvestState,
    OfiFundInvestReducer
} from './ofi-fund-invest';

import {
    OfiCorpActionsState,
    OfiCorpActionsReducer
} from './ofi-corp-actions';
export {
    getOfiCouponList,
    OFI_SET_COUPON_LIST
} from './ofi-corp-actions';

export interface OfiState {
    ofiFundInvest: OfiFundInvestState;
    ofiCorpActions: OfiCorpActionsState;
}

export const OfiReducer: Reducer<OfiState> = combineReducers<OfiState>({
    ofiFundInvest: OfiFundInvestReducer,
    ofiCorpActions: OfiCorpActionsReducer,
});
