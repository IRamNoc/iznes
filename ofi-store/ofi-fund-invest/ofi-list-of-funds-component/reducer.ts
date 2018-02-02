import {OfiListOfFundsComponentState} from './model';
import {Action} from 'redux';
import {immutableHelper} from '@setl/utils';

import {
    SET_ALL_TABS
} from './actions';

const initialState: OfiListOfFundsComponentState = {
    openedTabs: []
};

/**
 *  Ofi List of funds component reducer.
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiListOfFundComponentReducer =
    function (state: OfiListOfFundsComponentState = initialState, action: Action): OfiListOfFundsComponentState {
        switch (action.type) {
            case SET_ALL_TABS:
                return handleSetAllTabs(action, state);

            default:
                return state;
        }
    };

/**
 * Set all tabs
 *
 * @param {Action} action
 * @param {UsersState} state
 * @return {UsersState}
 */
function handleSetAllTabs(action: Action, state: OfiListOfFundsComponentState): OfiListOfFundsComponentState {
    const tabs = immutableHelper.get(action, 'tabs', []);

    return Object.assign({}, state, {openedTabs: tabs});
}


