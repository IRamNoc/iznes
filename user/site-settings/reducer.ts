import {Action} from 'redux';
import {SET_LANGUAGE, SET_MENU_SHOWN, SET_PRODUCTION, SET_SITE_MENU} from './actions';
import {SiteSettingsState} from './model';
import * as _ from 'lodash';
import {backupMenuSpec} from './backupMenuSpec'

let defaultLanguage;
switch (window.navigator.language) {
    case 'en-GB':
        defaultLanguage = 'en-Latn';
        break;
    case 'fr-FR':
        defaultLanguage = 'fr-Latn';
        break;
    default:
        defaultLanguage = 'fr-Latn';
        break;
}

const initialState: SiteSettingsState = {
    language: defaultLanguage,
    menuShown: true,
    production: true,
    siteMenu: {}
};

export const SiteSettingsReducer = function (state: SiteSettingsState = initialState, action: Action) {
    switch (action.type) {
        case SET_LANGUAGE:
            return setLanguage(SET_LANGUAGE, action, state);
        case SET_MENU_SHOWN:
            return setMenuShown(SET_MENU_SHOWN, action, state);
        case SET_PRODUCTION:
            return setProduction(state, action);
        case SET_SITE_MENU:
            return setSiteMenu(SET_SITE_MENU, action, state);
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
    let languageData;

    if (_.get(action, 'payload[1].Data[0]', '') === '') {
        languageData = action;
    } else {
        languageData = _.get(action, 'payload[1].Data[0]');
    }

    let language = _.get(languageData, 'language', '');
    language = (language !== '' && language !== null ? language : 'en-Latn');

    newState = Object.assign({}, state, {
        language
    });

    return newState;
}

function setMenuShown(actionType, action, state) {
    let newState;
    const menuShown = _.get(action, 'menuShown', []);

    newState = Object.assign({}, state, {
        menuShown
    });

    return newState;
}

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


function setSiteMenu(actionType, action, state) {
    let newState;

    const siteMenu = _.get(action, 'payload[1].Data', []);

    newState = Object.assign({}, state, {
        siteMenu
    });

    return newState;
}
