import {Action} from 'redux';
import * as PermissionGroupActions from './actions';
import {PermissionGroupState, AdminPermGroupDetail, TranPermGroupDetail} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';
import {SET_ALL_TABS} from './actions';
import {immutableHelper} from '@setl/utils';

const initialState: PermissionGroupState = {
    adminPermList: {},
    tranPermList: {},
    openedTabs: []
};

export const PermissionGroupReducer = function (state: PermissionGroupState = initialState,
                                                action: Action) {

    /* Local stuff. */
    let newState: PermissionGroupState;
    let adminPermList: {
        [key: number]: AdminPermGroupDetail
    };
    let tranPermList: {
        [key: number]: TranPermGroupDetail
    };
    let permissionGroupData: Array<any>;

    switch (action.type) {
        case PermissionGroupActions.SET_ADMINISTRATIVE_PERMISSION_GROUP_LIST:
            permissionGroupData = _.get(action, 'payload[1].Data', []);

            adminPermList = formatToAdminPermGroupList(permissionGroupData);

            newState = Object.assign({}, state, {
                adminPermList
            });

            return newState;


        case PermissionGroupActions.SET_TRANSACTIONAL_PERMISSION_GROUP_LIST:
            permissionGroupData = _.get(action, 'payload[1].Data', []);

            tranPermList = formatToTranPermGroupList(permissionGroupData);

            newState = Object.assign({}, state, {
                tranPermList
            });

            return newState;

        case SET_ALL_TABS:
            return handleSetAllTabs(action, state);

        default:
            return state;
    }
};


function formatToAdminPermGroupList(rawPermissionGroupList) {
    const rawAdminPermGroupDataList = fromJS(rawPermissionGroupList);

    const adminPermObject = Map(rawAdminPermGroupDataList.reduce(function (result, item) {

        const groupIsTx = item.get('groupIsTx') === 1;

        if (!groupIsTx) {
            const canDelegate = item.get('canDelegate') === 1;

            result[item.get('groupID')] = {
                groupId: item.get('groupID'),
                groupName: item.get('groupName'),
                groupDescription: item.get('groupDescription'),
                groupIsTx: item.get('groupIsTx'),
                canDelegate: canDelegate
            };
        }

        return result;
    }, {}));

    return adminPermObject.toJS();
}

function formatToTranPermGroupList(rawPermissionGroupList) {
    const rawAdminPermGroupDataList = fromJS(rawPermissionGroupList);

    const adminPermObject = Map(rawAdminPermGroupDataList.reduce(function (result, item) {

        const groupIsTx = item.get('groupIsTx') === 1;

        if (groupIsTx) {
            const canDelegate = item.get('canDelegate') === 1;

            result[item.get('groupID')] = {
                groupId: item.get('groupID'),
                groupName: item.get('groupName'),
                groupDescription: item.get('groupDescription'),
                chainId: item.get('chainID'),
                groupIsTx: item.get('groupIsTx'),
                canDelegate: canDelegate
            };
        }

        return result;
    }, {}));

    return adminPermObject.toJS();
}

/**
 * Set all tabs
 *
 * @param {Action} action
 * @param {PermissionGroupState} state
 * @return {PermissionGroupState}
 */
function handleSetAllTabs(action: Action, state: PermissionGroupState): PermissionGroupState {
    const tabs = immutableHelper.get(action, 'tabs', []);

    return Object.assign({}, state, {openedTabs: tabs});
}
