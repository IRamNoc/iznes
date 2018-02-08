import {SET_LANGUAGE, SET_MENU_SHOWN, SET_PRODUCTION} from './actions';
import {SiteSettingsState} from './model';
import * as _ from 'lodash';

let defaultLanguage;
switch (window.navigator.language) {
    case 'en-GB':
        defaultLanguage = 'eng';
        break;
    case 'fr-FR':
        defaultLanguage = 'fra';
        break;
    default:
        defaultLanguage = 'fra';
        break;
}

const initialState: SiteSettingsState = {
    language: defaultLanguage,
    menuShown: true,
    production: true
};

export const SiteSettingsReducer = function (state: SiteSettingsState = initialState, action) {
    switch (action.type) {
        case SET_LANGUAGE:
            return setLanguage(SET_LANGUAGE, action, state);
        case SET_MENU_SHOWN:
            return setMenuShown(SET_MENU_SHOWN, action, state);
        case SET_PRODUCTION:
            return setProduction(state, action);
        default:
            return state;
    }
};

/**
 * Set Message List
 *
 * @param actionType
 * @param action
 * @param state
 * @returns {any}
 */
function setLanguage(actionType, action, state) {
    let newState;

    const language = _.get(action, 'language', []);

    newState = Object.assign({}, state, {
        language
    });

    return newState;
};

function setMenuShown(actionType, action, state) {
    let newState;

    const menuShown = _.get(action, 'menuShown', []);

    newState = Object.assign({}, state, {
        menuShown
    });

    return newState;
};

/**
 *
 * @param {SiteSettingsState} state
 * @param action
 * @return {SiteSettingsState}
 */
function setProduction(state: SiteSettingsState, action: any): SiteSettingsState {
    const loginData = _.get(action, 'payload[1].Data[0]');
    const isProduction = _.get(loginData, 'setting', '1');

    const production = isProduction === '1';
    return Object.assign({}, state, {production});
}
