import {combineReducers, Reducer} from 'redux';

import {
    SicavListState,
    SicavListReducer,
    SET_SICAV_LIST,
} from './sicav-list';

export {
    SicavListState,
    SicavListReducer,
    SET_SICAV_LIST,
};

export interface SicavState {
    sicavList: SicavListState;
}

export const SicavReducer: Reducer<SicavState> = combineReducers<SicavState>({
    sicavList: SicavListReducer,
});
