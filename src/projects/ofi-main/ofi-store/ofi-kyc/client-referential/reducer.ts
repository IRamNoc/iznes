/* Core/Redux imports. */
import { Action } from 'redux';

/* Local types. */
import { OfiClientReferentialState, ClientReferentialDetails } from './model';
import * as ofiClientReferentialActions from './actions';
import { immutableHelper } from '@setl/utils';
import * as _ from 'lodash';

/* Initial state. */
const initialState: OfiClientReferentialState = {
    clientReferential: [],
    requested: false,
};

/* Reducer. */
export const OfiClientReferentialReducer = function (state: OfiClientReferentialState = initialState, action: Action) {

    switch (action.type) {
        /* Set Coupon List. */
    case ofiClientReferentialActions.OFI_SET_CLIENT_REFERENTIAL:
        return ofiSetList(state, action);

    case ofiClientReferentialActions.OFI_SET_REQUESTED_CLIENT_REFERENTIAL:
        return toggleRequestState(state, true);

    case ofiClientReferentialActions.OFI_CLEAR_REQUESTED_CLIENT_REFERENTIAL:
        return toggleRequestState(state, false);

        /* Default. */
    default:
        return state;
    }
};

function ofiSetList(state: OfiClientReferentialState, action: Action) {

    const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

    let clientReferential: OfiClientReferentialState[] = [];

    try {
        clientReferential = immutableHelper.reduce(data, (result, item) => {
            result.push({
                clientReference: item.get('clientReference'),
                walletName: item.get('walletName'),
                companyName: item.get('companyName'),
                firstName: item.get('firstName'),
                lastName: item.get('lastName'),
                email: item.get('emailAddress'),
                investorType: item.get('investorType'),
                kycID: item.get('kycID'),
                investmentMethod: item.get('investmentMethod'),
            });

            return result;
        }, []);
    } catch (e) {
        clientReferential = [];
    }

    return Object.assign({}, state, {
        clientReferential
    });
}

function toggleRequestState(state: OfiClientReferentialState, requested: boolean): OfiClientReferentialState {

    return Object.assign({}, state, { requested });
}
