/* Core/Redux imports. */
import {Action} from 'redux';
/* Local types. */
import {AmHoldersDetails, InvestorHoldingItem, OfiHolderState} from './model';
import * as ofiAmHoldersActions from './actions';
import {List, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: OfiHolderState = {
    amHoldersList: List<AmHoldersDetails>(),
    requested: false,
    invHoldingsList: List<InvestorHoldingItem>(),
    invRequested: false,
    holderDetailRequested: false,
    shareHolderDetail: Map(),
};

/* Reducer. */
export const OfiAmHoldersListReducer = (state: OfiHolderState = initialState, action: Action) => {
    switch (action.type) {
        case ofiAmHoldersActions.OFI_SET_AM_HOLDERS_LIST:
            return handleGetAmHolders(state, action);

        case ofiAmHoldersActions.OFI_SET_REQUESTED_AM_HOLDERS:
            return toggleRequestState(state, true);

        case ofiAmHoldersActions.OFI_CLEAR_REQUESTED_AM_HOLDERS:
            return toggleRequestState(state, false);

        case ofiAmHoldersActions.OFI_SET_HOLDER_DETAIL_REQUESTED:
            return toggleHolderDetaiRequestState(state, true);

        case ofiAmHoldersActions.OFI_CLEAR_HOLDER_DETAIL_REQUESTED:
            return toggleHolderDetaiRequestState(state, false);

        case ofiAmHoldersActions.OFI_GET_SHARE_HOLDER_DETAIL:
            return handleGetShareHolderDetail(state, action);

        case ofiAmHoldersActions.OFI_SET_INV_HOLDINGS_LIST:
            return handleGetInvestorHoldingList(state, action);

        case ofiAmHoldersActions.OFI_SET_REQUESTED_INV_HOLDINGS:
            return toggleInvRequestState(state, true);

        case ofiAmHoldersActions.OFI_CLEAR_REQUESTED_INV_HOLDINGS:
            return toggleInvRequestState(state, false);

        default:
            return state;
    }
};

const handleGetAmHolders = (state, action) => {
    const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

    if (data.Status !== 'Fail' && data.Message !== 'No holders found') {
        const amHoldersList = formatDataResponse(data);

        return Object.assign({}, state, {
            amHoldersList,
        });
    }

    return state;
};

const formatDataResponse = (rawData: Array<AmHoldersDetails>): List<AmHoldersDetails> => {
    let response: List<AmHoldersDetails> = List();

    if (rawData.length > 0) {
        rawData.forEach((iteratee) => {
            const holderItem = {
                fundId: iteratee.fundId,
                fundName: iteratee.fundName,
                fundLei: iteratee.fundLei,
                fundCurrency: iteratee.fundCurrency,
                fundAum: iteratee.fundAum,
                fundHolderNumber: iteratee.fundHolderNumber,
                shareId: iteratee.shareId,
                shareName: iteratee.shareName,
                shareIsin: iteratee.shareIsin,
                shareNav: iteratee.shareNav,
                shareUnitNumber: iteratee.shareUnitNumber,
                shareCurrency: iteratee.shareCurrency,
                shareAum: iteratee.shareAum,
                shareHolderNumber: iteratee.shareHolderNumber,
                shareRatio: iteratee.shareRatio,
            };
            response = response.push(holderItem);
        });
    }
    return response;
}

const handleGetInvestorHoldingList = (state, action) => {
    const response = action.payload[1].Data;
    let invHoldingsList = List();

    if (response && response.length > 0) {
        response.forEach((it) => {
            const item = Map({ ...it });
            invHoldingsList = invHoldingsList.push(item);
        });
    }

    return { ...state, invHoldingsList };
};

function toggleRequestState(state: OfiHolderState, requested: boolean): OfiHolderState {
    return Object.assign({}, state, {requested});
}

function toggleInvRequestState(state: OfiHolderState, invRequested: boolean): OfiHolderState {
    return Object.assign({}, state, {invRequested});
}

// Holder detail
const toggleHolderDetaiRequestState = (state: OfiHolderState, holderDetailRequested: boolean): OfiHolderState => {
    return Object.assign({}, state, {holderDetailRequested});
};

const handleGetShareHolderDetail = (state: OfiHolderState, action: Action): OfiHolderState => {
    const response = _.get(action, 'payload[1].Data', []);

    if (response.Status !== 'Fail' && response.Message !== 'No holder\'s detail found') {
        let holders = List();

        response.holders.forEach((it) => {
            const holderItem = Map({
                ranking: it.ranking,
                investorName: it.investorName,
                portfolio: it.portfolio,
                quantity: it.quantity,
                amount: it.amount,
                ratio: it.shareRatio,
            });

            holders = holders.push(holderItem);
        });

        const shareHolderDetail = Map({
            id: response.shareId,
            name: response.shareName,
            currency: response.shareCurrency,
            isin: response.shareIsin,
            nav: response.latestNav,
            unitNumber: response.shareUnitNumber,
            aum: response.shareAum,
            holderNumber: response.shareHolderNumber,
            ratio: response.shareRatio,
            lastSettlementDate: response.lastSettlementDate,
            holders,
        });

        return { ...state, shareHolderDetail };
    }

    return state;
};
