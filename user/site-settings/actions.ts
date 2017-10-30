import {
    Action,
    ActionCreator,
} from 'redux';

import {name} from './__init__';

export const SET_LANGUAGE = `${name}/SET_LANGUAGE`;


export interface SetLanguageAction extends Action {
    language: string;
}

export const setLanguage: ActionCreator<SetLanguageAction> =
    (language) => ({
        type: SET_LANGUAGE,
        language: language,
    });

