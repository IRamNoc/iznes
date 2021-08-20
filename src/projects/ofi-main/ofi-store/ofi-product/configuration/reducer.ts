import { Action } from 'redux';
import * as _ from 'lodash';
import { immutableHelper } from '@setl/utils';

import * as actions from './actions';

import { ProductConfiguration, OfiProductConfigState } from './model';
import { OrderedMap } from 'immutable';

const initialState: OfiProductConfigState = {
    configuration: {
        calendarModels: [],
    },
    requestedConfiguration: false,
};

/**
 *  Ofi product config reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiProductConfigReducer =
    function (state: OfiProductConfigState = initialState, action: Action): OfiProductConfigState {
        switch (action.type) {
        case actions.SET_PRODUCT_CONFIGURATION:
            return handleSetOfiProductConfig(state, action);

        case actions.SET_REQUESTED_CONFIGURATION:
            return toggleProductConfigRequested(state, true);

        case actions.CLEAR_REQUESTED_CONFIGURATION:
            return toggleProductConfigRequested(state, false);

        default:
            return state;
        }
    };

/**
 * Handle set fund share audit
 *
 * @param state
 * @param action
 * @return {OfiNAVAuditState}
 */
function handleSetOfiProductConfig(state: OfiProductConfigState,
                                   action: Action): OfiProductConfigState {
    const configData = _.get(action, 'payload[1].Data', []);
    const configuration: ProductConfiguration = {
        calendarModels: [],
    };

    if (configData[0]) {
        configuration.calendarModels = configData;
    }

    return Object.assign({}, state, {
        configuration,
    });
}

/**
 * Toggle requested
 * @param state
 * @return {OfiFundShareState}
 */
function toggleProductConfigRequested(state: OfiProductConfigState,
                                      requestedConfiguration): OfiProductConfigState {
    return Object.assign({}, state, {
        requestedConfiguration,
    });
}
