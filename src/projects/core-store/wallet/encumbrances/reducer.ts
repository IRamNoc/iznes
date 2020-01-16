import { AsyncTaskResponseAction } from '@setl/utils/sagaHelper/actions';
import * as MyWalletHoldingActions from './actions';
import { EncumbrancesState } from './model';
import * as _ from 'lodash';

const initialState: EncumbrancesState = {
    encumbrances: {},
    requested: false,
};

export const encumbrancesReducer = (state: EncumbrancesState = initialState, action: AsyncTaskResponseAction) => {
    switch (action.type) {
        case MyWalletHoldingActions.SET_ENCUMBRANCES:
            return setEncumbrances(action, state);

        case MyWalletHoldingActions.SET_REQUESTED_ENCUMBRANCES:
            return setEncumbrancesRequested(state);

        case MyWalletHoldingActions.CLEAR_REQUESTED_ENCUMBRANCES:
            return clearEncumbrancesRequested(state);

        default:
            return state;
    }

    function setEncumbrances(action, state) {
        const encumbrances = _.get(action, 'payload[1]data', {});

        // Remove addresses without encumbrance
        Object.keys(encumbrances).forEach((address) => {
            if (_.isEmpty(encumbrances[address])) delete encumbrances[address];
        });

        return Object.assign({}, state, { encumbrances });
    }

    function setEncumbrancesRequested(state) {
        const requested = true;

        return Object.assign({}, state, {
            requested,
        });
    }

    function clearEncumbrancesRequested(state) {
        const requested = false;

        return Object.assign({}, state, {
            requested,
        });
    }
};
