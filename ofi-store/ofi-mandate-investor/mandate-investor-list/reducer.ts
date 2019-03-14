import { Action } from 'redux';
import { OfiMandateInvestorListState } from './model';
import {
    OFI_SET_MANDATE_INVESTOR_LIST,
    OFI_REQUEST_MANDATE_INVESTORS,
    OFI_MANDATE_INVESTORS_REQUESTED
} from './actions';

interface PayloadAction extends Action {
    payload: any;
}

const initialState: OfiMandateInvestorListState = {
    requested: false,
    records: {},
}

export const OfiMandateInvestorListReducer = function(
    state: OfiMandateInvestorListState = initialState,
    action: PayloadAction
) {
    switch (action.type) {
        case OFI_SET_MANDATE_INVESTOR_LIST:
            return { ...state, records: action.payload[1].Data };
        case OFI_MANDATE_INVESTORS_REQUESTED:
            return { ...state, requested: true };
        case OFI_REQUEST_MANDATE_INVESTORS:
            return { ...state, requested: false };
        default:
            return state;
    }
}
