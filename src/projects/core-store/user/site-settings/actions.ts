import {
    Action,
    ActionCreator,
} from 'redux';

import { name } from './__init__';

export const SET_VERSION = `${name}/SET_VERSION`;
export const SET_LANGUAGE = `${name}/SET_LANGUAGE`;
export const SET_DECIMAL_SEPERATOR = `${name}/SET_DECIMAL_SEPERATOR`;
export const SET_DATA_SEPERATOR = `${name}/SET_DATA_SEPERATOR`;
export const SET_MENU_SHOWN = `${name}/SET_MENU_SHOWN`;
export const SET_PRODUCTION = `${name}/SET_PRODUCTION`;
export const SET_SITE_MENU = `${name}/SET_SITE_MENU`;
export const SET_FORCE_TWO_FACTOR = `${name}/SET_FORCE_TWO_FACTOR`;
export const SET_MENU_COLLAPSED = `${name}/SET_MENU_COLLAPSED`;

export interface SetVersionAction extends Action {
    version: string;
}

export interface SetLanguageAction extends Action {
    language: string;
}
export interface SetDecimalAction extends Action {
    decimalSeparator: string;
}
export interface SetDataAction extends Action {
    dataSeperator: string;
}

export interface SetMenuShownAction extends Action {
    menuShown: boolean;
}

export interface SetMenuCollapsed extends Action {
    menuCollapsed: boolean;
}

export const setVersion: ActionCreator<SetVersionAction> =
    version => ({
        type: SET_VERSION,
        version,
    });

export const setLanguage: ActionCreator<SetLanguageAction> =
    language => ({
        type: SET_LANGUAGE,
        language,
    });
export const setDecimalSeperator: ActionCreator<SetDecimalAction> =
decimalSeparator => ({
        type: SET_DECIMAL_SEPERATOR,
        decimalSeparator,
    });
export const setDataSeperator: ActionCreator<SetDataAction> =
dataSeperator => ({
        type: SET_DATA_SEPERATOR,
        dataSeperator,
    });

export const setMenuShown: ActionCreator<SetMenuShownAction> =
    menuShown => ({
        type: SET_MENU_SHOWN,
        menuShown,
    });

export const setMenuCollapsed: ActionCreator<SetMenuCollapsed> =
    menuCollapsed => ({
        type: SET_MENU_COLLAPSED,
        menuCollapsed,
    });
