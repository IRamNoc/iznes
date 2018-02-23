import * as actions from './actions';
import {Action} from 'redux';
import * as _ from 'lodash';
import {AmKycListState} from './model';
import {immutableHelper} from '@setl/utils';

const initialState: AmKycListState = {
    amKycList: [],
    requested: false
};

export function AmKycListReducer(
    state: AmKycListState = initialState,
    action: Action
): AmKycListState {
    switch (action.type) {
        case actions.SET_AMKYCLIST:
            return handleSetAmKycList(state, action);
        case actions.SET_REQUESTED:
            return toggleRequested(state, true);
        case actions.CLEAR_REQUESTED:
            return toggleRequested(state, false);
        default:
            return state;
    }
}
/**
 * Handle set am kyc list
 *
 * @param state
 * @param action
 * @return {AmKycListState}
 */
function handleSetAmKycList(state: AmKycListState, action: Action): AmKycListState {
    const amKycListData = _.get(action, 'payload[1].Data', []);
    let amKycList: AmKycListState[] = [];
    try {
        amKycList = immutableHelper.reduce(amKycListData, (result, item) => {
            result.push({
                status: item.get('kycStatus', 0),
                companyName: item.get('companyName', 0),
                actionDate: item.get('actionDate', 0),
                kycDate: item.get('kycDate', 0),
                reviewBy: item.get('reviewBy', 0),
                invited: item.get('invited', 0)
            });
            return result;
        }, []);
    } catch (e) {
        amKycList = [];
    }

    return Object.assign({}, state, {
        amKycList
    });
}

/**
 * Toggle requested
 * @param state
 * @return {{}&AmKycListState&{requested: boolean}}
 */
function toggleRequested(state: AmKycListState, requested): AmKycListState {

    return Object.assign({}, state, {
        requested
    });
}