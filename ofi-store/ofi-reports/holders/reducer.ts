/* Core/Redux imports. */
import {Action} from 'redux';
/* Local types. */
import {AmHoldersDetails, InvHoldingsDetails, HolderDetailStructure, OfiHolderState, ShareHolderItem} from './model';
import * as ofiAmHoldersActions from './actions';
import {List} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: OfiHolderState = {
    amHoldersList: List<AmHoldersDetails>(),
    requested: false,
    invHoldingsList: List<InvHoldingsDetails>(),
    invRequested: false,
    holderDetailRequested: false,
    shareHolderDetail: null,
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
            return handleGetInvHoldings(state, action);

        case ofiAmHoldersActions.OFI_SET_REQUESTED_INV_HOLDINGS:
            return toggleRequestState(state, true);

        case ofiAmHoldersActions.OFI_CLEAR_REQUESTED_INV_HOLDINGS:
            return toggleRequestState(state, false);

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

const handleGetInvHoldings = (state, action) => {
    const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

    if (data.Status !== 'Fail') {
        const invHoldingsList = formatDataResponse(data);

        return Object.assign({}, state, {
            invHoldingsList,
        });
    }

    return state;
};

const formatDataResponse = (rawData: Array<AmHoldersDetails>): List<AmHoldersDetails> => {
    let response: List<AmHoldersDetails> = List();

    if (rawData.length > 0) {
        rawData.forEach((iteratee) => {
            const holderItem = {
                isFund: iteratee.isFund,
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
                shareRatio: iteratee.shareRatio
            };

            response = response.push(holderItem);
        });
    }

    return response;
};

function toggleRequestState(state: OfiHolderState, requested: boolean): OfiHolderState {
    return Object.assign({}, state, {requested});
}

// Holder detail
const toggleHolderDetaiRequestState = (state: OfiHolderState, holderDetailRequested: boolean): OfiHolderState => {
    return Object.assign({}, state, {holderDetailRequested});
};

const handleGetShareHolderDetail = (state: OfiHolderState, action: Action): OfiHolderState => {
    const response = _.get(action, 'payload[1].Data', []);

    if (response.Status !== 'Fail' && response.Message !== 'No holder\'s detail found') {
        let holders: List<ShareHolderItem> = List();

        // Share holders
        response.holders.forEach((holder) => {
            const holderItem: ShareHolderItem = {
                ranking: holder.ranking,
                investorName: holder.investorName,
                quantity: holder.quantity,
                amount: holder.amount,
                ratio: holder.ratio,
            };

            holders = holders.push(holderItem);
        });

        // Share info
        const shareHolderDetail: HolderDetailStructure = {
            id: response.id,
            name: response.name,
            currency: response.currency,
            isin: response.isin,
            nav: response.nav,
            unitNumber: response.unitNumber,
            aum: response.aum,
            holderNumber: response.holderNumber,
            ratio: response.ratio,
            holders,
        };

        return Object.assign({}, state, {shareHolderDetail});
    }

    return state;
};
