import {Action} from 'redux';
import * as _ from 'lodash';
import {fromJS} from 'immutable';
import {immutableHelper} from '@setl/utils';

import * as actions from './actions';

import {AllFundShareDetail, OfiFundShareListState} from './model';

const initialState: OfiFundShareListState = {
    amAllFundShareList: {},
    requestedAmAllFundShareList: false
};

/**
 *  Ofi fund share reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiFundShareListReducer = function (state: OfiFundShareListState = initialState, action: Action): OfiFundShareListState {
    switch (action.type) {
        case actions.SET_AM_ALL_FUND_SHARE_LIST:
            return handleSetOfiNavFundsList(state, action);

        case actions.SET_REQUESTED_AM_All_FUND_SHARE:
            return toggleAmAllFundShareListRequested(state, true);

        case actions.CLEAR_REQUESTED_AM_All_FUND_SHARE:
            return toggleAmAllFundShareListRequested(state, false);

        default:
            return state;
    }
};

/**
 * Handle set am all fund share list
 *
 * @param state
 * @param action
 * @return {OfiFundShareListState}
 */
function handleSetOfiNavFundsList(state: OfiFundShareListState, action: Action): OfiFundShareListState {
    const fundShareListData = _.get(action, 'payload[1].Data', []);
    let amAllFundShareList: { [shareId: string]: AllFundShareDetail } = {};
    try {
        amAllFundShareList = immutableHelper.reduce(fundShareListData, (result: { [shareId: string]: AllFundShareDetail }, item) => {

            const shareId = item.get('shareID', 0);

            if (shareId === 0) {
                throw new Error('ShareId should not be zero');
            }

            result[shareId] = {
                shareId: item.get('shareID', 0),
                shareName: item.get('shareName', ''),
                fundId: item.get('fundID', 0),
                fundName: item.get('fundName', 'fund name here'),
                fundShareIsin: item.get('fundShareIsin', 'isin here'),
                fundShareStatus: item.get('fundStatus', 0),
            };

            return result;
        }, {});
    } catch (e) {
        amAllFundShareList = {};
    }

    return Object.assign({}, state, {
        amAllFundShareList
    });
}

/**
 * Toggle requested
 * @param state
 * @return {OfiFundShareState}
 */
function toggleAmAllFundShareListRequested(state: OfiFundShareListState, requestedAmAllFundShareList): OfiFundShareListState {

    return Object.assign({}, state, {
        requestedAmAllFundShareList
    });
}

