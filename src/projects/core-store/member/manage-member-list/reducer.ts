import {
    SET_MANAGE_MEMBER_LIST,
    SET_REQUESTED_MANAGE_MEMBER_LIST,
    CLEAR_REQUESTED_MANAGE_MEMBER_LIST
} from './actions';
import {ManageMemberListState, MemberDetail} from './model';
import * as _ from 'lodash';
import {Action} from 'redux';
import {fromJS, List, Map} from 'immutable';

const initialState: ManageMemberListState = {
    memberList: {},
    requestedManagedMemberList: false
};


export const ManageMemberListReducer = function (state: ManageMemberListState = initialState,
                                                 action: Action) {

    let newState: ManageMemberListState;

    switch (action.type) {
        case SET_MANAGE_MEMBER_LIST:

            newState = handleAction(SET_MANAGE_MEMBER_LIST, action, state);

            return newState;

        case SET_REQUESTED_MANAGE_MEMBER_LIST:

            newState = handleAction(SET_REQUESTED_MANAGE_MEMBER_LIST, action, state);

            return newState;

        case CLEAR_REQUESTED_MANAGE_MEMBER_LIST:

            newState = handleAction(CLEAR_REQUESTED_MANAGE_MEMBER_LIST, action, state);

            return newState;

        default:
            return state;
    }
};

function handleAction(actionType, action, state) {
    const handler = {
        [SET_MANAGE_MEMBER_LIST]: function (thisAction, thisState): ManageMemberListState {

            let newState: ManageMemberListState;
            const memberListData = _.get(thisAction, 'payload[1].Data');

            const memberListImu = fromJS(memberListData);

            const memberList = memberListImu.reduce((result, thisMember) => {
                const memberId = thisMember.get('memberID');
                const memberName = thisMember.get('memberName');

                result[memberId] = {
                    memberId,
                    memberName,
                };

                return result;
            }, {});

            newState = Object.assign({}, thisState, {
                memberList
            });

            return newState;
        },

        [SET_REQUESTED_MANAGE_MEMBER_LIST]: function (thisAction, thisState): ManageMemberListState {
            let newState: ManageMemberListState;
            const requestedManagedMemberList = true;

            newState = Object.assign({}, thisState, {
                requestedManagedMemberList
            });

            return newState;
        },

        [CLEAR_REQUESTED_MANAGE_MEMBER_LIST]: function (thisAction, thisState): ManageMemberListState {
            let newState: ManageMemberListState;
            const requestedManagedMemberList = false;

            newState = Object.assign({}, thisState, {
                requestedManagedMemberList
            });

            return newState;
        }
    };

    return handler[actionType](action, state);
}

