import {combineReducers, Reducer} from 'redux';

import {
    WorkflowListReducer,
    WorkflowListState,
    SET_WORKFLOW_LIST,
    clearRequestedWorkflowList,
    setRequestedWorkflowList
} from './workflow-list';


export {
    WorkflowListState,
    SET_WORKFLOW_LIST,
    clearRequestedWorkflowList,
    setRequestedWorkflowList
};

export interface WorkflowState {
    workflowList: WorkflowListState;
}

export const WorkflowReducer: Reducer<WorkflowState> = combineReducers<WorkflowState>({
    workflowList: WorkflowListReducer,
});
