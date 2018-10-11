import {
    Action,
    ActionCreator,
} from 'redux';

import { name } from './__init__';

export const SET_VERSION = `${name}/SET_VERSION`;
export const SET_LANGUAGE = `${name}/SET_LANGUAGE`;
export const SET_MENU_SHOWN = `${name}/SET_MENU_SHOWN`;
export const SET_PRODUCTION = `${name}/SET_PRODUCTION`;
export const SET_SITE_MENU = `${name}/SET_SITE_MENU`;
export const SET_FORCE_TWO_FACTOR = `${name}/SET_FORCE_TWO_FACTOR`;

export interface SetVersionAction extends Action {
    version: string;
}

export interface SetLanguageAction extends Action {
    language: string;
}

export interface SetMenuShownAction extends Action {
    menuShown: boolean;
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

export const setMenuShown: ActionCreator<SetMenuShownAction> =
    menuShown => ({
        type: SET_MENU_SHOWN,
        menuShown,
    });
