import { Action } from 'redux';
import {
    SET_VERSION,
    SET_LANGUAGE,
    SET_MENU_SHOWN,
    SET_PRODUCTION,
    SET_SITE_MENU,
    SET_FORCE_TWO_FACTOR,
    SET_MENU_COLLAPSED,
} from './actions';
import { SiteSettingsState } from './model';
import * as _ from 'lodash';

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
    version: '',
    language: defaultLanguage,
    menuShown: true,
    production: true,
    siteMenu: {
        fetched: false,
    },
    forceTwoFactor: false,
    menuCollapsed: false,
};

export const SiteSettingsReducer = function (state: SiteSettingsState = initialState, action: Action) {
    switch (action.type) {
        case SET_VERSION:
            return setVersion(SET_VERSION, action, state);
        case SET_LANGUAGE:
            return setLanguage(SET_LANGUAGE, action, state);
        case SET_MENU_SHOWN:
            return setMenuShown(SET_MENU_SHOWN, action, state);
        case SET_PRODUCTION:
            return setProduction(state, action);
        case SET_FORCE_TWO_FACTOR:
            return setTwoFactor(state, action);
        case SET_SITE_MENU:
            return setSiteMenu(SET_SITE_MENU, action, state);
        case SET_MENU_COLLAPSED:
            return setMenuCollapsed(state, action);
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
function setVersion(actionType, action, state) {
    const versionData = _.get(action, 'payload[1].Data[0]', '') === '' ? action : _.get(action, 'payload[1].Data[0]');
    const version = _.get(versionData, 'version', '');
    const newState = Object.assign({}, state, { version });

    return newState;
}

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
        language,
    });

    return newState;
}

function setDecimalSeperator(actionType, action, state) {
    let newState;
    let decimalData;

    if (_.get(action, 'payload[1].Data[0]', '') === '') {
        decimalData = action;
    } else {
        decimalData = _.get(action, 'payload[1].Data[0]');
    }

    let deciSeparator = _.get(decimalData, 'deciSeparator', '');
    deciSeparator = (deciSeparator !== '' && deciSeparator !== null ? deciSeparator : 'dot');

    newState = Object.assign({}, state, {
        deciSeparator,
    });

    return newState;
}

function setDataSeperator(actionType, action, state) {
    let newState;
    let dataseratepData;

    if (_.get(action, 'payload[1].Data[0]', '') === '') {
        dataseratepData = action;
    } else {
        dataseratepData = _.get(action, 'payload[1].Data[0]');
    }

    let dataSeparator = _.get(dataseratepData, 'dataSeparator', '');
    dataSeparator = (dataSeparator !== '' && dataSeparator !== null ? dataSeparator : 'Semicolon');

    newState = Object.assign({}, state, {
        dataSeparator,
    });

    return newState;
}

function setMenuShown(actionType, action, state) {
    let newState;
    const menuShown = _.get(action, 'menuShown', []);

    newState = Object.assign({}, state, {
        menuShown,
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
    const isProduction = _.get(loginData, 'isProduction', '1');

    const production = isProduction === '1';
    return Object.assign({}, state, { production });
}

function setTwoFactor(state: SiteSettingsState, action: any): SiteSettingsState {
    const loginData = _.get(action, 'payload[1].Data[0]');
    const forceTwoFactorData = _.get(loginData, 'forceTwoFactor', '1');

    const forceTwoFactor = forceTwoFactorData === '1';
    return Object.assign({}, state, { forceTwoFactor });
}

function setSiteMenu(actionType, action, state) {
    let newState;

    const siteMenu = _.get(action, 'payload[1].Data', []);
    siteMenu.fetched = true;

    newState = Object.assign({}, state, {
        siteMenu,
    });

    return newState;
}

function setMenuCollapsed(state: SiteSettingsState, action: any): SiteSettingsState {
    return Object.assign({}, state, { menuCollapsed: action.menuCollapsed });
}
