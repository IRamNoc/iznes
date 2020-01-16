import {
    SET_CHAIN_MEMBERSHIP_LIST
} from './actions';
import {ChainMembershipState} from './model';
import * as _ from 'lodash';
import {Action} from 'redux';
import {fromJS, List, Map} from 'immutable';

const initialState: ChainMembershipState = {
    currentChainMembership: {}
};

export const ChainMembershipReducer = function (state: ChainMembershipState = initialState,
                                                action: Action) {
    switch (action.type) {

        case SET_CHAIN_MEMBERSHIP_LIST:
            return handleSetChainMembershipList(state, action);

        default:
            return state;
    }
};

function handleSetChainMembershipList(state, action) {
    const chainMembershipListData = _.get(action, 'payload[1].Data');
    const chainMembershipListImu = fromJS(chainMembershipListData);

    const currentChainMembership = chainMembershipListImu.reduce(function (resultMembership, thisMembership) {
        resultMembership[thisMembership.get('memberID')] = {
            chainId: thisMembership.get('chainID'),
            memberId: thisMembership.get('memberID'),
            memberType: thisMembership.get('memberType'),
            nodeId: thisMembership.get('nodeID')
        };
        return resultMembership;
    }, {});

    const newState = Object.assign({}, state, {
        currentChainMembership
    });

    return newState;
}
