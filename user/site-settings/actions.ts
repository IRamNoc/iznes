import {
    Action,
    ActionCreator,
} from 'redux';

import {name} from './__init__';

export const SET_LANGUAGE = `${name}/SET_LANGUAGE`;
export const SET_MENU_SHOWN = `${name}/SET_MENU_SHOWN`;
export const SET_PRODUCTION = `${name}/SET_PRODUCTION`;

export interface SetLanguageAction extends Action {
    language: string;
}

export interface SetMenuShownAction extends Action {
    menuShown: boolean;
}

export const setLanguage: ActionCreator<SetLanguageAction> =
    (language) => ({
        type: SET_LANGUAGE,
        language: language,
    });


export const setMenuShown: ActionCreator<SetMenuShownAction> =
    (menuShown) => ({
        type: SET_MENU_SHOWN,
        menuShown: menuShown,
    });

