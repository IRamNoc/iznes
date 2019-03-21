import { Action } from 'redux';
import { OfiMandateInvestorListState } from './model';
import {
    OFI_SET_MANDATE_INVESTOR_LIST,
    OFI_NEW_MANDATE_INVESTOR,
    OFI_MANDATE_INVESTORS_REQUESTED
} from './actions';

interface PayloadAction extends Action {
    payload: any;
}

const initialState: OfiMandateInvestorListState = {
    requested: false,
    records: [],
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
        case OFI_NEW_MANDATE_INVESTOR:
            return {
                ...state,
                records: [
                    ...state.records,
                    {
                        id: action.payload.id,
                        walletId: action.payload.walletID,
                        walletName: action.payload.walletName,
                        kycID: action.payload.kycID,
                        firstName: action.payload.firstName,
                        lastName: action.payload.lastName,
                        reference: action.payload.reference,
                        companyName: action.payload.companyName,
                        investorType: action.payload.investorType,
                    },
                ]
            };
        default:
            return state;
    }
}
