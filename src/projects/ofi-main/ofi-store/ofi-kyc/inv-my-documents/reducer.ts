/* Core/Redux imports. */
import {Action} from 'redux';

/* Local types. */
import {OfiInvMyDocumentsState, InvMyDocumentDetails} from './model';
import * as ofiInvMyDocumentsActions from './actions';
import {immutableHelper} from '@setl/utils';
import {fromJS, Map} from 'immutable';
import * as _ from 'lodash';

/* Initial state. */
const initialState: OfiInvMyDocumentsState = {
    myDocumentsList: {},
    requested: false,
};

/* Reducer. */
export const OfiInvMyDocumentsListReducer = function (state: OfiInvMyDocumentsState = initialState, action: Action) {
    switch (action.type) {
        /* Set Coupon List. */
        case ofiInvMyDocumentsActions.OFI_SET_MY_DOCUMENTS_LIST:
            return ofiSetList(state, action);

        case ofiInvMyDocumentsActions.OFI_SET_REQUESTED_MY_DOCUMENTS:
            return toggleRequestState(state, true);

        case ofiInvMyDocumentsActions.OFI_CLEAR_REQUESTED_MY_DOCUMENTS:
            return toggleRequestState(state, false);

        /* Default. */
        default:
            return state;
    }
};

function ofiSetList(state: OfiInvMyDocumentsState, action: Action) {

    const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

    const myDocumentsList = formatDataResponse(data);
    return Object.assign({}, state, {
        myDocumentsList
    });
}

function formatDataResponse(rawData: Array<any>): Array<InvMyDocumentDetails> {
    const rawDataList = fromJS(rawData);

    const manageOrdersList = Map(rawDataList.reduce(
        function (result, item, idx) {
            result[idx] = {
                kycID: item.get('kycID'),
                kycDocumentID: item.get('kycDocumentID'),
                walletID: item.get('walletID'),
                name: item.get('name'),
                hash: item.get('hash'),
                type: item.get('type'),
                common: item.get('common'),
                isDefault: item.get('default'),
            };
            return result;
        },
        {}));

    return manageOrdersList.toJS();
}

function toggleRequestState(state: OfiInvMyDocumentsState, requested: boolean): OfiInvMyDocumentsState {
    return Object.assign({}, state, {requested});
}