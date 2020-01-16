import {Action} from 'redux';
import * as ChainActions from './actions';
import {ChainDetail, ChainListState} from './model';
import * as _ from 'lodash';
import {List, fromJS, Map} from 'immutable';


const initialState: ChainListState = {
    chainList: {},
    requested: false
};

export const ChainListReducer = function (state: ChainListState = initialState, action: Action) {

    switch (action.type) {
        case ChainActions.SET_CHAINS_LIST:
            const sData = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]
            const chainList = formatChainDataResponse(sData);
            const newState = Object.assign({}, state, {
                chainList
            });
            return newState;

        case ChainActions.SET_REQUESTED_CHAIN:
            return handleSetRequested(state, action);

        case ChainActions.CLEAR_REQUESTED_CHAIN:
            return handleClearRequested(state, action);

        default:
            return state;
    }
};


function formatChainDataResponse(rawChainData: Array<any>): Array<ChainDetail> {
    const rawChainDataList = fromJS(rawChainData);

    const chainDetailList = Map(rawChainDataList.reduce(
        function (result, item) {
            result[item.get('chainID')] = {
                chainId: item.get('chainID'),
                chainName: item.get('chainName'),
            };
            return result;
        },
        {}));

    return chainDetailList.toJS();
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {ChainListReducer}
 */
function handleSetRequested(state: ChainListState, action: Action): ChainListState {
    const requested = true;

    return Object.assign({}, state, {
        requested
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {ChainListReducer}
 */
function handleClearRequested(state: ChainListState, action: Action): ChainListState {
    const requested = false;

    return Object.assign({}, state, {
        requested
    });
}
