import * as WalletRelationshipActions from './actions';
import {WalletDetail, WalletRelationshipState} from './model';
import * as _ from 'lodash';
import {Action} from 'redux';
import {fromJS, List, Map} from 'immutable';

const initialState: WalletRelationshipState = {
    toRelationshipList: {},
    requestedToRelationship: false
};

export const WalletRelationshipReducer = function (state: WalletRelationshipState = initialState,
                                                   action: Action) {
    let newState: WalletRelationshipState;
    let toRelationshipList: object;
    let requestedToRelationship: boolean;

    switch (action.type) {
        case WalletRelationshipActions.SET_WALLET_TO_RELATIONSHIP:
            const walletToRelationshipData = _.get(action, 'payload[1].Data', []);

            toRelationshipList = formatWalletToRelationshipDataResponse(walletToRelationshipData);

            newState = Object.assign({}, state, {
                toRelationshipList
            });

            return newState;

        case WalletRelationshipActions.SET_REQUESTED_WALLET_TO_RELATIONSHIP:
            requestedToRelationship = true;

            newState = Object.assign({}, state, {
                requestedToRelationship
            });

            return newState;

        case WalletRelationshipActions.CLEAR_REQUESTED_WALLET_TO_RELATIONSHIP:
            requestedToRelationship = false;

            newState = Object.assign({}, state, {
                requestedToRelationship
            });

            return newState;

        default:
            return state;
    }
};

function formatWalletToRelationshipDataResponse(rawWalletToRelationshipData: Array<any>): object {
    const rawWalletToRelationshipList = fromJS(rawWalletToRelationshipData);

    const walletToRelationshipObject = Map(rawWalletToRelationshipList.reduce(
        function (result, item) {
            result[item.get('LeiID')] = {
                correspondenceAddress: item.get('CorrespondenceAddress'),
                toWalletId: item.get('LeiID'),
                keyDetail: item.get('keyDetail')
            };
            return result;
        },
        {}));

    return walletToRelationshipObject.toJS();
}



