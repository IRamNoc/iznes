import {Action} from 'redux';
import * as SicavActions from './actions';
import {SicavDetail, SicavListState} from './model';
import * as _ from 'lodash';
import {List, fromJS, Map} from 'immutable';


const initialState: SicavListState = {
    sicavList: {},
    requested: false
};

export const SicavListReducer = function (state: SicavListState = initialState, action: Action) {

    switch (action.type) {
        case SicavActions.SET_SICAV_LIST:

            const mcData = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]
            const sicavList = formatSicavDataResponse(mcData);
            const newState = Object.assign({}, state, {
                sicavList
            });
            return newState;

        case SicavActions.SET_REQUESTED_SICAV:
            return handleSetRequested(state, action);

        case SicavActions.CLEAR_REQUESTED_SICAV:
            return handleClearRequested(state, action);

        default:
            return state;
    }
};


function formatSicavDataResponse(rawSicavData: Array<any>): Array<SicavDetail> {

    const rawSicavDataList = fromJS(rawSicavData);

    const sicavDetailList = Map(rawSicavDataList.reduce(
        function (result, item) {
            result[item.get('sicavID')] = {
                sicavID: item.get('sicavID'),
                companyID: item.get('companyID'),
                sicavName: item.get('sicavName'),
                country: item.get('country'),
                addrPrefix: item.get('addrPrefix'),  // addressPrefix to addrPrefix
                postalAddressLine1: item.get('postalAddressLine1'),
                postalAddressLine2: item.get('postalAddressLine2'),
                city: item.get('city'),
                stateArea: item.get('stateArea'),
                postalcode: item.get('postalcode'), // postalCode to postalcode
                taxResidence: item.get('taxResidence'),
                registrationNum: item.get('registrationNum'),
                supervisoryAuthority: item.get('supervisoryAuthority'),
                numSIRETorSIREN: item.get('numSIRETorSIREN'),
                creationDate: item.get('creationDate'),
                shareCapital: item.get('shareCapital'),
                commercialContact: item.get('commercialContact'),
                operationalContact: item.get('operationalContact'),
                directorContact: item.get('directorContact'),
                lei: item.get('lei'),
                bic: item.get('bic'),
                giinCode: item.get('giinCode'),
                logoName: item.get('logoName'),
                logoURL: item.get('logoURL'),
                externalEmail: item.get('externalEmail'),

            };
            
        },
        {}));

    return sicavDetailList.toJS();
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {SicavListReducer}
 */
function handleSetRequested(state: SicavListState, action: Action): SicavListState {
    const requested = true;

    return Object.assign({}, state, {
        requested
    });
}

/**
 * Handle action
 * @param state
 * @param action
 * @return {SicavListReducer}
 */
function handleClearRequested(state: SicavListState, action: Action): SicavListState {
    const requested = false;

    return Object.assign({}, state, {
        requested
    });
}
