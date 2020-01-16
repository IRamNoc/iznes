import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';
import * as MyWalletHoldingActions from './actions';
import {
    CLEAR_REQUESTED_ALL_WALLET_HOLDING,
    CLEAR_REQUESTED_WALLET_HOLDING,
    SET_REQUESTED_ALL_WALLET_HOLDING,
    SET_REQUESTED_WALLET_HOLDING
} from './actions';
import {MyWalletHoldingState} from './model';
import * as _ from 'lodash';
import {ShortHash} from '@setl/utils/helper/common/shorthash';
import {randomBytes} from 'crypto';
import {immutableHelper} from '@setl/utils';

const initialState: MyWalletHoldingState = {
    holdingByAddress: {},
    holdingByAsset: {},
    requested: false,
    requestedAll: false,
};

export const MyWalletHoldingReducer = function (state: MyWalletHoldingState = initialState,
                                                action: AsyncTaskResponseAction) {
    switch (action.type) {
        case MyWalletHoldingActions.SET_WALLET_HOLDING:
            return setWalletHolding(action, state);

        case MyWalletHoldingActions.SET_ISSUE_HOLDING:
            return setIssueHolding(action, state);

        case CLEAR_REQUESTED_WALLET_HOLDING:
            return handleClearRequestedWalletHolding(state);

        case SET_REQUESTED_WALLET_HOLDING:
            return handleSetRequestedWalletHolding(state);

        case CLEAR_REQUESTED_ALL_WALLET_HOLDING:
            return toggleRequestedAllWalletHolding(state, false);

        case SET_REQUESTED_ALL_WALLET_HOLDING:
            return toggleRequestedAllWalletHolding(state, true);

        default:
            return state;
    }


    function setWalletHolding(action, state) {
        let payload = _.get(action, 'payload[1]', []);
        let walletId = payload.request.walletid;

        const holdingByAddress = immutableHelper.copy(state.holdingByAddress);
        const holdingByAddressBalances = _.get(action, 'payload[1].data.balances', []);

        let holdingByAsset = immutableHelper.copy(state.holdingByAsset);
        const holdingByAssetBalances = holdingByAddressToByAsset(holdingByAddressBalances);

        holdingByAddress[walletId] = holdingByAddressBalances;
        holdingByAsset[walletId] = holdingByAssetBalances;

        const newState = Object.assign({}, state, {
            holdingByAddress,
            holdingByAsset,
        });

        return newState;
    }

    function setIssueHolding(action, state) {
        let payload = _.get(action, 'payload[1]', []);
        let walletId = payload.request.walletid;

        let issuer = _.get(action, 'payload[1].request.namespace', []);
        let insturement = _.get(action, 'payload[1].request.classid', []);

        let asset = issuer + '|' + insturement;

        const holders = _.get(action, 'payload[1].data.holders', []);

        let holdingByAsset = state.holdingByAsset;

        holdingByAsset[walletId][asset].holders = holders;

        const newState = Object.assign({}, state, {
            holdingByAsset
        });

        return newState;
    }

    function holdingByAddressToByAsset(holdingByAddress: Array<any>): object {

        const holdingByAsset = {};

        for (const addr in holdingByAddress) {
            if (!holdingByAddress.hasOwnProperty(addr)) {
                continue;
            }

            const assetsBalances = holdingByAddress[addr];

            for (const asset in assetsBalances) {
                if (!assetsBalances.hasOwnProperty(asset)) {
                    continue;
                }

                const balance: number = assetsBalances[asset][0];
                const encumbrance: number = assetsBalances[asset][1];
                const free: number = balance - encumbrance;

                if (typeof holdingByAsset[asset] === 'undefined') {
                    holdingByAsset[asset] = {
                        asset: asset,
                        hash: ShortHash.unique(asset),
                        total: 0,
                        totalencumbered: 0,
                        free: 0,
                        breakdown: []
                    };
                }

                if (balance > 0) { // ignore those negative balance (normally is the master address of the asset.)
                    holdingByAsset[asset]['total'] += balance;
                }

                if (encumbrance > 0) { // ignore those negative balance (normally is the master address of the asset.)
                    holdingByAsset[asset]['totalencumbered'] += encumbrance;
                }

                if (free > 0) {
                    holdingByAsset[asset]['free'] += free;
                }

                holdingByAsset[asset].breakdown.push({addr, balance, encumbrance, free: balance - encumbrance});
            }
        }

        return holdingByAsset;
    }
};

/**
 * Handle SET_REQUESTED_WALLET_HOLDING action.
 *
 * @param state
 * @return {{}&U&{requested: boolean}}
 */
function handleSetRequestedWalletHolding(state) {
    const requested = true;

    return Object.assign({}, state, {
        requested
    });
}

/**
 * Handle CLEAR_REQUESTED_WALLET_HOLDING action.
 *
 * @param state
 * @return {{}&U&{requested: boolean}}
 */
function handleClearRequestedWalletHolding(state) {
    const requested = false;

    return Object.assign({}, state, {
        requested
    });
}

function toggleRequestedAllWalletHolding(state, requestedAll) {

    return Object.assign({}, state, {
        requestedAll,
    });
}
