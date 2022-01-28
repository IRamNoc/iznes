/* Core/Redux imports. */
import {Action} from 'redux';
/* Local types. */
import { InvestorHoldingItem, OfiHoldingHistoryState ,AmHoldersHistoryDetails} from './model';
import * as ofiAmHoldersActions from './actions';
import {List, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: OfiHoldingHistoryState = {
    amHolderHistoryList: List<AmHoldersHistoryDetails>(),
    requested: false,
    invHoldingsList: List<InvestorHoldingItem>(),
    invRequested: false,
    holderDetailRequested: false,
    shareHolderDetail: Map(),

};

/* Reducer. */
export const OfiAmHoldersHistoryListReducer = (state: OfiHoldingHistoryState = initialState, action: Action) => {
    switch (action.type) {
        case ofiAmHoldersActions.OFI_SET_AM_HOLDING_HISTORY:
            return handleGetAmHolders(state, action);

        default:
            return state;
    }
};

const handleGetAmHolders = (state, action) => {
    const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

    console.log(action,"action");
    console.log(data,"data");

    if (data.Status !== 'Fail' && data.Message !== 'No holders found') {
        const amHolderHistoryList = formatDataResponse(data);



        return Object.assign({}, state, {
            amHolderHistoryList,
        });
    }

    return state;
};

const formatDataResponse = (rawData: Array<AmHoldersHistoryDetails>): List<AmHoldersHistoryDetails> => {
    let response: List<AmHoldersHistoryDetails> = List();

    if (rawData.length > 0) {
        rawData.forEach((iteratee) => {
            const holderItem = {
                companyName: iteratee.companyName,
                amWalletID: iteratee.amWalletID,
                quantity: iteratee.quantity 
            };
            response = response.push(holderItem);
        });
    }
    return response;
};

