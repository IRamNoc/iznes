import {AsyncTaskResponseAction} from '@setl/utils/sagaHelper/actions';
import * as MyWalletHoldingActions from './actions';
import {MyWalletHoldingState} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: MyWalletHoldingState = {
    holdingByAddress: {},
    holdingByAsset: {}
};

export const MyWalletHoldingReducer = function (state: MyWalletHoldingState = initialState,
                                                action: AsyncTaskResponseAction) {
    switch (action.type) {
        case MyWalletHoldingActions.SET_WALLET_HOLDING:
            return setWalletHolding(action, state);

        case MyWalletHoldingActions.SET_ISSUE_HOLDING:
            return setIssueHolding(action, state);

        default:
            return state;
    }


    function setWalletHolding(action, state) {
        let payload = _.get(action, 'payload[1]', []);
        let walletId = payload.request.walletid;

        const holdingByAddress = state.holdingByAddress;
        const holdingByAddressBalances = _.get(action, 'payload[1].data.balances', []);

        let holdingByAsset = state.holdingByAsset;
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
        console.log(action);

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

                const balance = assetsBalances[asset][0];
                const encumbrance = assetsBalances[asset][1];

                if (typeof holdingByAsset[asset] == 'undefined') {
                    holdingByAsset[asset] = {
                        'total': 0,
                        'totalencumbered': 0,
                        'breakdown': {}
                    };
                }

                if (balance > 0) { // ignore those negative balance (normally is the master address of the asset.)
                    holdingByAsset[asset]['total'] += balance;
                }

                if (encumbrance > 0) { // ignore those negative balance (normally is the master address of the asset.)
                    holdingByAsset[asset]['totalencumbered'] += encumbrance;
                }
                holdingByAsset[asset]['breakdown'][addr] = [balance, encumbrance];
            }
        }

        return holdingByAsset;
    }
};



