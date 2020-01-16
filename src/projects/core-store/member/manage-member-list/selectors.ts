import {createSelector} from 'reselect';
import {MemberState} from '../index';
import {ManageMemberListState} from './index';

const getMember = (state): MemberState => state.member;

export const getManageMember = createSelector(
    getMember,
    (state: MemberState) => Object.assign({}, state.manageMemberList)
);

export const getMemberList = createSelector(
    getManageMember,
    (state: ManageMemberListState) => Object.assign({}, state.memberList));


