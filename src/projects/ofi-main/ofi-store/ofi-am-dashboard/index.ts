import {combineReducers, Reducer} from 'redux';

import {OfiShareHoldersListReducer, OfiShareHoldersState} from './share-holders';

export {
    OFI_SET_FUNDS_BY_USER_LIST,
    ofiSetFundsByUserRequested,
    ofiClearFundsByUserRequested,
    OFI_SET_FUNDS_WITH_HOLDERS_LIST,
    ofiSetFundsWithHoldersRequested,
    ofiClearFundsWithHoldersRequested,
} from './share-holders/actions';

export interface OfiAmDashboardsState {
    shareHolders: OfiShareHoldersState;
}

export const OfiAmDashboardsReducer: Reducer<OfiAmDashboardsState> = combineReducers<OfiAmDashboardsState>({
    shareHolders: OfiShareHoldersListReducer,
});
