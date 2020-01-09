import {name} from './__init__';
import {FundTab} from './model';
import {Action, ActionCreator} from 'redux';

// update tabs
export const SET_ALL_TABS = `${name}/SET_ALL_TABS`;

export interface SetAllTab extends Action {
    tabs: Array<FundTab>;
}

export const setAllTabs: ActionCreator<SetAllTab> = (tabs: Array<FundTab>) => (
    {
        type: SET_ALL_TABS,
        tabs
    }
);

