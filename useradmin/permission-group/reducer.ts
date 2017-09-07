import {Action} from 'redux';
import * as PermissionGroupActions from './actions';
import {PermissionGroupState, AdminPermGroupDetail, TranPermGroupDetail} from './model';
import _ from 'lodash';
import {List, fromJS, Map} from 'immutable';

const initialState: PermissionGroupState = {
    adminPermList: {},
    tranPermList: {}
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

        default:
            return state;
    }
};


function formatToAdminPermGroupList(rawPermissionGroupList) {
    const rawAdminPermGroupDataList = fromJS(rawPermissionGroupList);

    const adminPermObject = Map(rawAdminPermGroupDataList.reduce(function (result, item) {

        const groupIsTx = item.get('groupIsTx') === 2;

        if (!groupIsTx) {
            const canDelegate = item.get('canDelegate') === 1;

            result[item.get('groupID')] = {
                groupId: item.get('groupID'),
                groupName: item.get('groupName'),
                groupDescription: item.get('groupDescription'),
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

        const groupIsTx = item.get('groupIsTx') === 2;

        if (groupIsTx) {
            const canDelegate = item.get('canDelegate') === 1;

            result[item.get('groupID')] = {
                groupId: item.get('groupID'),
                groupName: item.get('groupName'),
                groupDescription: item.get('groupDescription'),
                chainId: item.get('chainID'),
                canDelegate: canDelegate
            };
        }

        return result;
    }, {}));

    return adminPermObject.toJS();
}
