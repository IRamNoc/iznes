/* Core/Redux imports. */
import { Action } from 'redux';
import * as math from 'mathjs';

/* Local types. */
import { ManageOrders, ManageOrderDetails } from './model';
import * as ofiManageOrdersActions from './actions';
import { immutableHelper } from '@setl/utils';
import { fromJS } from 'immutable';
import { get, merge } from 'lodash';
import { calculateFigures } from '@ofi/ofi-main/ofi-product/fund-share/helper/order-calculations';
import { OrderStatus } from '../../../ofi-product/fund-share/helper/order-view-helper';

/* Initial state. */
const initialState: ManageOrders = {
    orderList: {},
    listOrder: [],
    requested: false,
    openedTabs: [],
    filters: {},
    currentPage: 1,
    totalResults: 0,
};

const patchOrder = (state, orderId, patch) => {
    const existingOrder = get(state.orderList, orderId, null);
    if (!existingOrder) {
        return state;
    }

    if (Object.keys(patch).length == 1 && Object.keys(patch)[0] == 'orderStatus') {
        if (patch['orderStatus'] > 0 && patch['orderStatus'] < existingOrder['orderStatus']) {
            return state;
        }
    }

    const update = {
        orderList: {
            [existingOrder.orderID]: { ...existingOrder, ...patch }
        },
    };
    return merge({}, state, update);
};

const patchOrders = (state, orderIds, patch) => {
    return orderIds.reduce((acc, orderId) => patchOrder(acc, orderId, patch), state);
};

const patchOrderCallback = (state, orderId, callback: (order: ManageOrderDetails) => any) => {
    const existingOrder = get(state.orderList, orderId, null);
    if (!existingOrder) {
        return state;
    }
    const patchedOrder = callback.call(null, existingOrder);
    const update = {
        orderList: {
            [existingOrder.orderID]: { ...existingOrder, ...patchedOrder },
        },
    };

    return merge({}, state, update);
};

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
        return { ...state, filters };

    case ofiManageOrdersActions.OFI_CLEAR_ORDERS_FILTERS:
        return { ...state, ...{ filters: {} } };

    case ofiManageOrdersActions.OFI_UPDATE_ORDER:
        switch (action.payload.event) {
        case 'create':
            return handleNewOrder(state, action);
        case 'cutoff':
            return patchOrder(state, action.payload.order.orderId, { orderStatus: 2 });
        case 'initcomplete':
            return patchOrder(state, action.payload.order.orderId, { initialized: 1});
        case 'cancel':
            return patchOrder(state, action.payload.order.orderID, { orderStatus: 0 });
        case 'commit':
            return patchOrder(state, action.payload.orderID, { orderStatus: 3 });
        case 'complete':
            return patchOrder(state, action.payload.orderID, { orderStatus: 4 });
        case 'readyforpayment':
            return patchOrders(state, action.payload.orders, { paymentMsgStatus: 'ready' });
        case 'settled':
            return patchOrder(state, action.payload.order.orderID, { orderStatus: -1 });
        case 'updatenav':
            return handleUpdateNav(state, action);
        case 'validatednav':
            return handleValidatedOrder(state, action);
        default:
            return state;
        }
    case ofiManageOrdersActions.SET_CURRENT_PAGE:
        return { ...state, currentPage: action.payload.number };
    case ofiManageOrdersActions.SET_TOTAL_RESULTS:
        return { ...state, totalResults: action.payload.results };
    case ofiManageOrdersActions.INCREMENT_TOTAL_RESULTS:
        return { ...state, totalResults: state.totalResults + 1 };
    default:
        return state;
    }
};

function handleUpdateNav(state: ManageOrders, action: PayloadAction): ManageOrders {
    const { date, status, price, isin } = action.payload.nav;

    const filter = o =>
        o.isin === isin
        && (o.orderStatus === OrderStatus.Initiated || o.orderStatus === OrderStatus.WaitingNAV)
        && o.valuationDate.substring(0, 10) === date;

    Object.keys(state.orderList)
        .map(k => state.orderList[k])
        .filter(filter)
        .forEach(o => state = patchOrderCallback(state, o.orderID, (order) => {
            const figures = calculateFigures(
                {
                    orderBy: order.byAmountOrQuantity,
                    orderType: order.orderType,
                    value: (order.byAmountOrQuantity === 1) ? order.quantity : order.amount,
                    nav: price,
                    feePercentage: order.feePercentage,
                },
                order.maximumNumDecimal,
                false,
            );

            let patch = <any>{
                latestNav: price,
                estimatedQuantity: figures.estimatedQuantity,
            };
            if (order.byAmountOrQuantity === 1) {
                // Quantity - Calculate estimated amount
                patch = {
                    latestNav: price,
                    estimatedAmount: +figures.estimatedAmount,
                    estimatedAmountWithCost: +math
                        .chain(+figures.estimatedAmount)
                        .multiply(1 + (order.feePercentage / 100000))
                        .done(),
                };
            }

            return patch;
        }));

    return state;
}

function handleValidatedOrder(state: ManageOrders, action: PayloadAction): ManageOrders {
    const { orderID, amount, amountWithCost, price, quantity, valuationDate } = action.payload.nav;

    const patch = {
        amount,
        amountWithCost,
        price,
        quantity,
        orderStatus: 3,
    };
    const filter = o =>
        o.orderID === orderID
        && (o.orderStatus === OrderStatus.Initiated || o.orderStatus === OrderStatus.WaitingNAV)
        && o.valuationDate.substring(0, 10) === valuationDate.substring(0, 10);

    Object.keys(state.orderList)
        .map(k => state.orderList[k])
        .filter(filter)
        .forEach(o => state = patchOrder(state, o.orderID, patch));

    return state;
}

function formatManageOrderDataResponse(rawData: any[]): ManageOrderDetails[] {
    const rawDataList = fromJS(rawData);
    const manageOrdersList = rawDataList.reduce(
        (result, item, idx) => {
            const order = {
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
                isKnownNav: item.get('isKnownNav'), // PHILZ [2018-11-06]
                label: item.get('label'),
                lastName: item.get('lastName'),
                maximumNumDecimal: item.get('maximumNumDecimal'),
                initialized: item.get('initialized'),
                navEntered: item.get('navEntered'),
                orderID: item.get('orderID'),
                orderDate: item.get('orderDate'),
                orderNote: item.get('orderNote'),
                orderStatus: item.get('orderStatus'),
                orderType: item.get('orderType'),
                isTransfer: item.get('isTransfer'),
                reference: item.get('reference'),
                sellBuyLinkOrderID: item.get('sellBuyLinkOrderID'),
                platFormFee: item.get('platFormFee'),
                classificationFee: item.get('classificationFee'),
                price: item.get('price'),
                quantity: item.get('quantity'),
                settlementDate: item.get('settlementDate'),
                totalResult: item.get('totalResult'),
                valuationDate: item.get('valuationDate'),
                paymentMsgStatus: item.get('paymentMsgStatus'),
                useCBDC: item.get('useCBDC'),
            };

            if (order.price > 0) {
                // Already validated - do not perform estimates.
                result[order.orderID] = order;
                return result;
            }

            // Perform price estimates here.
            const figures = calculateFigures(
                {
                    orderBy: order.byAmountOrQuantity,
                    orderType: order.orderType,
                    value: (order.byAmountOrQuantity === 1) ? order.quantity : order.amount,
                    nav: order.latestNav,
                    feePercentage: order.feePercentage,
                },
                order.maximumNumDecimal,
                order.isKnownNav, // PHILZ [2018-11-06]
            );

            // order.amount = figures.amount;

            if (order.byAmountOrQuantity === 1) {
                // Quantity - Calculate estimated amount
                order.estimatedAmount = +math
                    .chain(+figures.estimatedAmount)
                    .done();
                order.estimatedAmountWithCost = +math
                    .chain(+figures.estimatedAmount)
                    .multiply(1 + (order.feePercentage / 100000))
                    .done();
            } else {
                // Amount - Calculate quantity
                order.estimatedQuantity = figures.estimatedQuantity;
            }

            result[order.orderID] = order;

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

    const listOrder = data.map(order => order.orderID);
    const orderList = formatManageOrderDataResponse(data);
    return Object.assign({}, state, {
        listOrder,
        orderList,
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

function handleNewOrder(state: ManageOrders, action: PayloadAction): ManageOrders {

    if (state.currentPage !== 1 || Object.keys(state.filters).length > 0) {
        // Only add orders to the first page and when no filters are set!
        return state;
    }

    const orderList = { ...formatManageOrderDataResponse([action.payload.order]), ...state.orderList };
    const listOrder = [action.payload.order.orderID, ...state.listOrder.slice(0, 9)];

    return { ...state, orderList, listOrder };
}
