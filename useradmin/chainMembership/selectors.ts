import {createSelector} from 'reselect';
import {AdminUsersState} from '../index';
import {ChainMembershipState} from './index';
import {getMemberList} from '../../member/index';
import {getWalletNodeList} from '../../useradmin/wallet-nodes/index';
import {fromJS, Map} from 'immutable';
import * as _ from 'lodash';

const getUserAdmin = (state): AdminUsersState => state.userAdmin;

export const getChainMembership = createSelector(
    getUserAdmin,
    (state: AdminUsersState) => state.chainMembership);

export const getCurrentChainMembershipList = createSelector(
    getChainMembership,
    getMemberList,
    getWalletNodeList,
    (chainMembershipListState: ChainMembershipState, memberListState, walletNodeListState) => {
        // console.log(state);
        // console.log(memberList);
        const chainMembershipListStateImu = fromJS(chainMembershipListState.currentChainMembership);
        const currentChainMembershipList = chainMembershipListStateImu.map(function (thisMembership) {
            const memberId = thisMembership.get('memberId');
            const nodeId = thisMembership.get('nodeId');
            const memberName = _.get(memberListState, [memberId, 'memberName'], '');
            const nodeName = _.get(walletNodeListState, [nodeId, 'walletNodeName']);
            const updateFields = Map({memberName, nodeName});
            return thisMembership.merge(updateFields);
        });

        return currentChainMembershipList.toJS();
    }
);
