/* Core/Redux imports. */
import { Action } from 'redux';

/* Local types. */
import { ManageOrders, ManageOrderDetails } from './model';
import * as ofiManageOrdersActions from './actions';
import { SET_ALL_TABS } from './actions';
import { immutableHelper } from '@setl/utils';
import { fromJS, Map } from 'immutable';
import { get, merge } from 'lodash';

/* Initial state. */
const initialState: ManageOrders = {
    orderList: {},
    requested: false,
    openedTabs: [],
    filters: {},
};

const patchOrder = (state, orderId, patch) => {
    const existingOrder = get(state.orderList, orderId, null);
    if (!existingOrder) {
        return state;
    }

    const update = {
        orderList: {
            [existingOrder.orderID]: { ...existingOrder, ...patch }
        }
    }
    return merge({}, state, update);
}

interface PayloadAction extends Action {
    payload: any;
}

/* Reducer. */
export const OfiManageOrderListReducer = function (
    state: ManageOrders = initialState,
    action: PayloadAction,
) {
    switch (action.type) {
        /* Set Coupon List. */
    case ofiManageOrdersActions.OFI_SET_MANAGE_ORDER_LIST:
        return ofiSetOrderList(state, action);

    case ofiManageOrdersActions.OFI_SET_REQUESTED_MANAGE_ORDER:
        return toggleRequestState(state, true);

    case ofiManageOrdersActions.OFI_CLEAR_REQUESTED_MANAGE_ORDER:
        return toggleRequestState(state, false);

    case ofiManageOrdersActions.SET_ALL_TABS:
        return handleSetAllTabs(action, state);

    case ofiManageOrdersActions.OFI_SET_ORDERS_FILTERS:
        const filters = get(action, 'filters', []);    // use [] not {} for list and Data not Data[0]
        return Object.assign({}, state, filters);

    case ofiManageOrdersActions.OFI_UPDATE_ORDER:
        console.log('MANAGE ORDERS REDUCER', action);
        switch (action.payload.event) {
        case 'create':
            state = merge({}, state, { orderList: formatManageOrderDataResponse([action.payload.order]) });
            break;
        case 'cutoff':
            state = patchOrder(state, action.payload.order.orderId, { orderStatus: 2 });
            break;
        case 'cancel':
            state = patchOrder(state, action.payload.orderID, { orderStatus: 0 });
            break;
        case 'commit':
            state = patchOrder(state, action.payload.orderID, { orderStatus: 3 });
            break;
        case 'complete':
            state = patchOrder(state, action.payload.orderID, { orderStatus: 4 });
            break;
        case 'settled':
            state = patchOrder(state, action.payload.order.orderID, { orderStatus: -1 });
            break;
        case 'updatenav':
            const nav = action.payload.nav;
            const navDate = nav.valuationDate.substring(0, 10);

            if (nav.status !== -1) {
                // This is until we sort out updating for estimates (need to add figure recalculation).
                return state;
            }

            let patch: any = { latestNav: nav.price };
            const baseFilter = o => o.orderStatus === 2 && o.valuationDate.substring(0, 10) === navDate;
            let filter = o => baseFilter(o) && o.isin === nav.isin;
            if (nav.status === -1) {
                patch = {
                    amount: nav.amount,
                    amountWithCost: nav.amountWithCost,
                    price: nav.price,
                    quantity: nav.quantity,
                    orderStatus: 3,
                };
                filter = o => baseFilter(o) && o.fundShareID === nav.fundShareID;
            }

            Object.keys(state.orderList)
            .map(k => state.orderList[k])
            .filter(filter)
            .forEach(o => state = patchOrder(state, o.orderID, patch));
            break;
        }

        return state;


        /* Default. */
    default:
        return state;
    }
};

function formatManageOrderDataResponse(rawData: Array<any>): Array<ManageOrderDetails> {
    const rawDataList = fromJS(rawData);

    const manageOrdersList = rawDataList.reduce(
        function (result, item, idx) {
            result[item.get('orderID')] = {
                amAddress: item.get('amAddress'),
                amCompanyID: item.get('amCompanyID'),
                amCompanyName: item.get('amCompanyName'),
                amWalletID: item.get('amWalletID'),
                amount: item.get('amount'),
                amountWithCost: item.get('amountWithCost'),
                byAmountOrQuantity: item.get('byAmountOrQuantity'),
                canceledBy: item.get('canceledBy'),
                contractAddr: item.get('contractAddr'),
                contractExpiryTs: item.get('contractAddr'),
                contractStartTs: item.get('contractStartTs'),
                currency: item.get('currency'),
                cutoffDate: item.get('cutoffDate'),
                estimatedAmount: item.get('estimatedAmount'),
                estimatedAmountWithCost: item.get('estimatedAmountWithCost'),
                estimatedPrice: item.get('estimatedPrice'),
                latestNav: item.get('latestNav'),
                estimatedQuantity: item.get('estimatedQuantity'),
                feePercentage: item.get('feePercentage'),
                firstName: item.get('firstName'),
                fundShareID: item.get('fundShareID'),
                fundShareName: item.get('fundShareName'),
                iban: item.get('iban'),
                investorAddress: item.get('investorAddress'),
                investorWalletID: item.get('investorWalletID'),
                investorCompanyName: item.get('investorCompanyName'),
                isin: item.get('isin'),
                label: item.get('label'),
                lastName: item.get('lastName'),
                navEntered: item.get('navEntered'),
                orderID: item.get('orderID'),
                orderDate: item.get('orderDate'),
                orderNote: item.get('orderNote'),
                orderStatus: item.get('orderStatus'),
                orderType: item.get('orderType'),
                platFormFee: item.get('platFormFee'),
                price: item.get('price'),
                quantity: item.get('quantity'),
                settlementDate: item.get('settlementDate'),
                totalResult: item.get('totalResult'),
                valuationDate: item.get('valuationDate'),
            };
            return result;
        },
        {});

    return manageOrdersList;
}

/**
 * Set Order List
 * ---------------
 * Deals with replacing the local orders list with a new one.
 *
 * @param {ManageOrders} state
 * @param {Action} action
 * @return {any}
 */
function ofiSetOrderList(state: ManageOrders, action: Action) {

    const data = get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

    const orderList = formatManageOrderDataResponse(data);
    return Object.assign({}, state, {
        orderList
    });
}

/**
 *
 * @param {ManageOrders} state
 * @param {boolean} requested
 * @return {ManageOrders}
 */
function toggleRequestState(state: ManageOrders, requested: boolean): ManageOrders {
    return Object.assign({}, state, { requested });
}

/**
 * Set all tabs
 *
 * @param {Action} action
 * @param {ManageOrders} state
 * @return {ManageOrders}
 */
function handleSetAllTabs(action: Action, state: ManageOrders): ManageOrders {
    const tabs = immutableHelper.get(action, 'tabs', []);

    return Object.assign({}, state, { openedTabs: tabs });
}
