import {SET_LANGUAGE} from './actions';
import {SiteSettingsState} from './model';
import _ from 'lodash';

const initialState: SiteSettingsState = {
    language: 'eng',
};

export const SiteSettingsReducer = function (state: SiteSettingsState = initialState, action) {

    switch (action.type) {
        case SET_LANGUAGE:
            return setLanguage(SET_LANGUAGE, action, state);
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