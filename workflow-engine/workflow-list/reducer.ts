import {WorkflowListState} from './model';
import {Action} from 'redux';
import * as _ from 'lodash';
import {fromJS} from 'immutable';
import {immutableHelper} from '@setl/utils';

import {
    SET_WORKFLOW_LIST,
    CLEAR_REQUESTED_WORKFLOW_LIST,
    SET_REQUESTED_WORKFLOW_LIST
} from './actions';

const initialState: WorkflowListState = {
    workflowList: [],
    requested: true
};

/**
 *  WFL manage list reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const WorkflowListReducer = function (state: WorkflowListState = initialState, action: Action): WorkflowListState {
    switch (action.type) {
        case SET_WORKFLOW_LIST:
            return handleSetWorkflowList(state, action);

        case CLEAR_REQUESTED_WORKFLOW_LIST:
            return toggleRequested(state, true);

        case SET_REQUESTED_WORKFLOW_LIST:
            return toggleRequested(state, false);

        default:
            return state;
    }
};

/**
 * Handle set manage nav list
 *
 * @param state
 * @param action
 * @return {OfiManageNavListState}
 */
function handleSetWorkflowList(state: WorkflowListState, action: Action): WorkflowListState {
    const basicData = _.get(action, 'payload[1].Data', []);
    let workflowList = [];
    try {
        workflowList = immutableHelper.reduce(basicData, (result, item) => {
            result.push(JSON.parse(item.get('Information', '')));
            return result;
        }, []);
    } catch (e) {
        workflowList = [];
    }
    return Object.assign({}, state, {
        workflowList
    });
}

/**
 * Toggle requested
 * @param state
 * @return {{}&OfiManageNavListState&{requested: boolean}}
 */
function toggleRequested(state: WorkflowListState, requested): WorkflowListState {

    return Object.assign({}, state, {
        requested
    });
}




