import {OfiFundAccessMyState} from './model';
import {Action} from 'redux';
import _ from 'lodash';
import {fromJS} from 'immutable';

import {
    SET_FUND_ACCESS_MY,
    SET_REQUESTED_FUND_ACCESS_MY,
    CLEAR_REQUESTED_FUND_ACCESS_MY,
} from './actions';

const initialState: OfiFundAccessMyState = {
    fundAccessList: {},
    fundShareAccessList: {},
    requested: false
};

/**
 *  Ofi investor fund list reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const OfiFundAccessMyReducer = function (state: OfiFundAccessMyState = initialState, action: Action): OfiFundAccessMyState {
    switch (action.type) {
        case SET_FUND_ACCESS_MY:
            return handleSetFundAccessMy(state, action);

        case SET_REQUESTED_FUND_ACCESS_MY:
            return handleSetRequestedFundAccessMy(state, action);

        case CLEAR_REQUESTED_FUND_ACCESS_MY:
            return handleClearRequestedFundAccessMy(state, action);

        default:
            return state;
    }
};

/**
 * Handle action
 * @param state
 * @param action
 * @return {OfiFundAccessMyState}
 */
function handleSetFundAccessMy(state: OfiFundAccessMyState, action: Action): OfiFundAccessMyState {
    const accessData = _.get(action, 'payload[1].Data', []);
    const accessDataImu = fromJS(accessData);
    const accessDataList = accessDataImu.reduce((result, item) => {
        const fundId = item.get('fundID', 0);
        if (!result.fundAccessList.hasOwnProperty(fundId)) {
            result.fundAccessList[fundId] = {
                fundId,
                fundName: item.get('fundName', ''),
                fundProspectus: item.get('fundProspectus', ''),
                fundReport: item.get('fundReport', ''),
                fundSicavId: item.get('fundSICAVID', 0)
            };
        }

        const shareId = item.get('shareID', 0);
        let metaData = {};
        try {
            metaData = JSON.parse(atob(item.get('metadata', '')));
        } catch (e) {
            metaData = {};
        }

        result.fundShareAccessList[shareId] = {
            shareId,
            issuer: item.get('issuer', ''),
            shareName: item.get('shareName', ''),
            entryFee: item.get('entryFee', 0),
            exitFee: item.get('exitFee', 0),
            shareStatus: item.get('fundStatus', 0),
            metaData: metaData,
            userStatus: item.get('userStatus', 0),
            fundId
        };

        return result;

    }, {
        fundAccessList: {},
        fundShareAccessList: {}
    });

    const fundAccessList = accessDataList.fundAccessList;
    const fundShareAccessList = accessDataList.fundShareAccessList;

    return Object.assign({}, state, {
        fundAccessList,
        fundShareAccessList
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {OfiFundAccessMyState}
 */
function handleSetRequestedFundAccessMy(state: OfiFundAccessMyState, action: Action): OfiFundAccessMyState {
    const requested = true;

    return Object.assign({}, state, {
        requested
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {OfiFundAccessMyState}
 */
function handleClearRequestedFundAccessMy(state: OfiFundAccessMyState, action: Action): OfiFundAccessMyState {
    const requested = false;

    return Object.assign({}, state, {
        requested
    });
}





