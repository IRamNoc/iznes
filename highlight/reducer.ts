import {Action} from 'redux';
import * as Actions from './actions';
import {HighlightDetail, HighlightListState} from './model';
import * as _ from 'lodash';
import {List, fromJS, Map} from 'immutable';


const initialState: HighlightListState = {
    highlightList: {},
    applied: false
};

export const HighlightListReducer = function (state: HighlightListState = initialState, action: Action) {

    switch (action.type) {
        case Actions.SET_HIGHLIGHT_LIST:
            const data = _.get(action, 'data', []);    // use [] not {} for list and Data not Data[0]
            const highlightList = formatResponse(data);
            return Object.assign({}, state, {
                highlightList
            });

        case Actions.SET_APPLIED_HIGHLIGHT:
            return handleSetRequested(state, action);

        case Actions.CLEAR_APPLIED_HIGHLIGHT:
            return handleClearRequested(state, action);

        default:
            return state;
    }
};

function formatResponse(rawData: Array<any>): Array<HighlightDetail> {

    const rawDataList = fromJS(rawData);

    const highlightList = Map(rawDataList.reduce(
        function (result, item) {
            result[item.get('id')] = {
                id: item.get('id'),
            };
            return result;
        },
        {}));

    return highlightList.toJS();
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {HighlightListReducer}
 */
function handleSetRequested(state: HighlightListState, action: Action): HighlightListState {
    const applied = true;

    return Object.assign({}, state, {
        applied
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {HighlightListReducer}
 */
function handleClearRequested(state: HighlightListState, action: Action): HighlightListState {
    const applied = false;

    return Object.assign({}, state, {
        applied
    });
}
