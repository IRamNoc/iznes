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
        },
    };
    return merge({}, state, update);
};
const patchOrderCallback = (state, orderId, callback: (order: ManageOrderDetails) => any) => {
    const existingOrder = get(state.orderList, orderId, null);
    if (!existingOrder) {
        return state;
    }
    const patchedOrder = callback.call(null, existingOrder);
    const update = {
        orderList: {
            [existingOrder.orderID]: { ...existingOrder, ...patchedOrder }
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

            const baseFilter = o => (o.orderStatus === 2 || o.orderStatus === 1) && o.valuationDate.substring(0, 10) === navDate;
            let filter = o => baseFilter(o) && o.isin === nav.isin;
            if (nav.status !== -1) {
                // Estimated NAV.
                Object.keys(state.orderList)
                    .map(k => state.orderList[k])
                    .filter(filter)
                    .forEach(o => state = patchOrderCallback(state, o.orderID, (order) => {
                        const figures = calculateFigures(
                            {
                                orderBy: order.byAmountOrQuantity,
                                orderType: order.orderType,
                                value: (order.byAmountOrQuantity === 1) ? order.quantity : order.amount,
                                nav: nav.price,
                                feePercentage: order.feePercentage,
                            },
                            order.maximumNumDecimal,
                            false,
                        );

                        let patch = <any>{
                            latestNav: nav.price,
                            estimatedQuantity: figures.estimatedQuantity,
                        };
                        if (order.byAmountOrQuantity === 1) {
                            // Quantity - Calculate estimated amount
                            patch = {
                                latestNav: nav.price,
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

            // We are updating from a validated NAV
            const patch = {
                amount: nav.amount,
                amountWithCost: nav.amountWithCost,
                price: nav.price,
                quantity: nav.quantity,
                orderStatus: 3,
            };
            filter = o => baseFilter(o) && o.orderID === nav.orderID;

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
                label: item.get('label'),
                lastName: item.get('lastName'),
                maximumNumDecimal: item.get('maximumNumDecimal'),
                navEntered: item.get('navEntered'),
                orderID: item.get('orderID'),
                orderDate: item.get('orderDate'),
                orderNote: item.get('orderNote'),
                orderStatus: item.get('orderStatus'),
                orderType: item.get('orderType'),
                sellBuyLinkOrderID: item.get('sellBuyLinkOrderID'),
                platFormFee: item.get('platFormFee'),
                price: item.get('price'),
                quantity: item.get('quantity'),
                settlementDate: item.get('settlementDate'),
                totalResult: item.get('totalResult'),
                valuationDate: item.get('valuationDate'),
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
                false,
            );

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
    return Object.assign({}, state, {requested});
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

    return Object.assign({}, state, {openedTabs: tabs});
}
