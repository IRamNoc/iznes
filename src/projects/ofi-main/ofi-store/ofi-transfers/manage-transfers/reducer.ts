/* Core/Redux imports. */
import { Action } from 'redux';
import * as math from 'mathjs';

/* Local types. */
import { ManageTransfers, ManageTransferDetails } from './model';
import * as ofiManageTransfersActions from './actions';
import { immutableHelper } from '@setl/utils';
import { fromJS } from 'immutable';
import { get, merge } from 'lodash';

/* Initial state. */
const initialState: ManageTransfers = {
    transferList: {},
    listTransfer: [],
    requested: false,
    openedTabs: [],
    filters: {},
    currentPage: 1,
    totalResults: 0,
};

const patchTransfer = (state, referenceId, patch) => {
    const existingTransfer = get(state.transferList, referenceId, null);
    if (!existingTransfer) {
        return state;
    }

    if (Object.keys(patch).length == 1 && Object.keys(patch)[0] == 'transferStatus') {
        if (patch['transferStatus'] > 0 && patch['transferStatus'] < existingTransfer['transferStatus']) {
            return state;
        }
    }

    const update = {
        transferList: {
            [existingTransfer.referenceID]: { ...existingTransfer, ...patch },
        },
    };
    return merge({}, state, update);
};

const patchTransfers = (state, referenceIds, patch) => {
    return referenceIds.reduce((acc, referenceId) => patchTransfer(acc, referenceId, patch), state);
};

const patchTransferCallback = (state, referenceId, callback: (transfer: ManageTransferDetails) => any) => {
    const existingtransfer = get(state.transferList, referenceId, null);
    if (!existingtransfer) {
        return state;
    }
    const patchedTransfer = callback.call(null, existingtransfer);
    const update = {
        transferList: {
            [existingtransfer.referenceID]: { ...existingtransfer, ...patchedTransfer },
        },
    };

    return merge({}, state, update);
};

interface PayloadAction extends Action {
    payload: any;
}

/* Reducer. */
export const OfiManageTransferListReducer = function (
    state: ManageTransfers = initialState,
    action: PayloadAction,
) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiManageTransfersActions.OFI_SET_MANAGE_TRANSFER_LIST:
            return ofiSetTransferList(state, action);

        case ofiManageTransfersActions.OFI_SET_REQUESTED_MANAGE_TRANSFER:
            return toggleRequestState(state, true);

        case ofiManageTransfersActions.OFI_CLEAR_REQUESTED_MANAGE_TRANSFER:
            return toggleRequestState(state, false);

        case ofiManageTransfersActions.SET_ALL_TABS:
            return handleSetAllTabs(action, state);

        case ofiManageTransfersActions.OFI_SET_TRANSFERS_FILTERS:
            const filters = get(action, 'filters', []);    // use [] not {} for list and Data not Data[0]
            return { ...state, filters };

        case ofiManageTransfersActions.OFI_CLEAR_TRANSFERS_FILTERS:
            return { ...state, ...{ filters: {} } };

        case ofiManageTransfersActions.OFI_UPDATE_TRANSFER:
            switch (action.payload.event) {
                case 'create':
                    return handleNewTransfer(state, action);
                case 'cutoff':
                    return patchTransfer(state, action.payload.transfer.referenceId, { transferStatus: 2 });
                case 'cancel':
                    return patchTransfer(state, action.payload.transfer.referenceId, { transferStatus: 0 });
                case 'commit':
                    return patchTransfer(state, action.payload.transfer.referenceId, { transferStatus: 3 });
                case 'complete':
                    return patchTransfer(state, action.payload.transfer.referenceId, { transferStatus: 4 });
                case 'readyforpayment':
                    return patchTransfers(state, action.payload.transfers, { paymentMsgStatus: 'ready' });
                case 'settled':
                    return patchTransfer(state, action.payload.transfer.referenceId, { transferStatus: -1 });
                default:
                    return state;
            }
        case ofiManageTransfersActions.SET_CURRENT_PAGE:
            return { ...state, currentPage: action.payload.number };
        case ofiManageTransfersActions.SET_TOTAL_RESULTS:
            return { ...state, totalResults: action.payload.results };
        case ofiManageTransfersActions.INCREMENT_TOTAL_RESULTS:
            return { ...state, totalResults: state.totalResults + 1 };
        default:
            return state;
    }
};

function formatManageTransferDataResponse(rawData: any[]): ManageTransferDetails[] {
    const rawDataList = fromJS(rawData);

    const manageTransfersList = rawDataList.reduce(
        (result, item, idx) => {
            const transfer = {
                accountKeeperID: item.get('accountKeeperID'),
                accountLabel: item.get('accountLabel'),
                assetManagementCompanyName: item.get('assetManagementCompanyName'),
                comment: item.get('comment'),
                currency: item.get('currency'),
                currencyCode: item.get('currencyCode'),
                dateEntered: item.get('dateEntered'),
                externalReference: item.get('externalReference'),
                fundShareID: item.get('fundShareID'),
                fundShareISIN: item.get('fundShareISIN'),
                fundShareName: item.get('fundShareName'),
                initialDate: item.get('initialDate'),
                investorCompanyName: item.get('investorCompanyName'),
                investorFirstName: item.get('investorFirstName'),
                investorLastName: item.get('investorLastName'),
                investorSubportfolioID: item.get('investorSubportfolioID'),
                investorWalletID: item.get('investorWalletID'),
                maximumNumDecimal: item.get('maximumNumDecimal'),
                price: item.get('price'),
                quantity: item.get('quantity'),
                referenceID: item.get('referenceID'),
                theoricalDate: item.get('theoricalDate'),
                transferDirection: item.get('transferDirection'),
                transferStatus: item.get('transferStatus'),
                userEntered: item.get('userEntered'),
            };

            if (transfer.price > 0) {
                // Already validated - do not perform estimates.
                result[transfer.referenceID] = transfer;
                return result;
            }

            result[transfer.referenceID] = transfer;

            return result;
        },
        {});

    return manageTransfersList;
}

/**
 * Set Order List
 * ---------------
 * Deals with replacing the local orders list with a new one.
 *
 * @param {ManageTransfers} state
 * @param {Action} action
 * @return {any}
 */
function ofiSetTransferList(state: ManageTransfers, action: Action) {

    const data = get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

    const listTransfer = data.map(transfer => transfer.referenceID);
    const transferList = formatManageTransferDataResponse(data);
    return Object.assign({}, state, {
        listTransfer,
        transferList,
    });
}

/**
 *
 * @param {ManageTransfers} state
 * @param {boolean} requested
 * @return {ManageTransfers}
 */
function toggleRequestState(state: ManageTransfers, requested: boolean): ManageTransfers {
    return Object.assign({}, state, { requested });
}

/**
 * Set all tabs
 *
 * @param {Action} action
 * @param {ManageTransfers} state
 * @return {ManageTransfers}
 */
function handleSetAllTabs(action: Action, state: ManageTransfers): ManageTransfers {
    const tabs = immutableHelper.get(action, 'tabs', []);

    return Object.assign({}, state, { openedTabs: tabs });
}

function handleNewTransfer(state: ManageTransfers, action: PayloadAction): ManageTransfers {

    if (state.currentPage !== 1 || Object.keys(state.filters).length > 0) {
        // Only add orders to the first page and when no filters are set!
        return state;
    }

    const transferList = { ...formatManageTransferDataResponse([action.payload.transfer]), ...state.transferList };
    const listTransfer = [action.payload.transfer.referenceID, ...state.listTransfer.slice(0, 9)];

    return { ...state, transferList, listTransfer };
}
