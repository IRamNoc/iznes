import {combineReducers, Reducer} from 'redux';
import { OfiMandateInvestorListState, OfiMandateInvestorListReducer } from './mandate-investor-list';

export {
    OFI_SET_MANDATE_INVESTOR_LIST,
    OfiMandateInvestorListState,
    ofiMandateInvestorsRequested,
    ofiNewMandateInvestor
} from './mandate-investor-list';

export interface OfiMandateInvestorState {
    list: OfiMandateInvestorListState;
}

export const OfiMandateInvestorReducer: Reducer<OfiMandateInvestorState> = combineReducers<OfiMandateInvestorState>({
    list: OfiMandateInvestorListReducer,
});
