/* Core/Redux imports. */
import { Action } from 'redux';

/* Local types. */
import { OfiClientReferentialAuditState } from './model';
import * as ofiClientReferentialAuditActions from './actions';
import { immutableHelper } from '@setl/utils';
import * as _ from 'lodash';
import { convertToLocal } from '@setl/utils/helper/m-date-wrapper';

/* Initial state. */
const initialState: OfiClientReferentialAuditState = {
    clientReferentialAudit: []
};

/* Reducer. */
export const OfiClientReferentialAuditReducer = function (state: OfiClientReferentialAuditState = initialState, action: Action) {

    switch (action.type) {
        /* Set Coupon List. */
    case ofiClientReferentialAuditActions.OFI_SET_CLIENT_REFERENTIAL_AUDIT:
        return ofiSetList(state, action);
        /* Default. */
    default:
        return state;
    }
};

function ofiSetList(state: OfiClientReferentialAuditState, action: Action) {

    const data = _.get(action, 'payload[1].Data', []);    // use [] not {} for list and Data not Data[0]

    let clientReferentialAudit: OfiClientReferentialAuditState[] = [];
    try {
        clientReferentialAudit = immutableHelper.reduce(data, (result, item) => {
            result.push({
                company: item.get('company'),
                isin: item.get('isin'),
                shareName: item.get('shareName'),
                info: item.get('info'),
                oldValue: item.get('oldValue'),
                newValue: item.get('newValue'),
                modifiedBy: item.get('modifiedBy'),
                date: convertToLocal(item.get('date'), 'YYYY-MM-DD HH:mm:ss'),
            });

            return result;
        }, []);
    } catch (e) {
        clientReferentialAudit = [];
    }

    return Object.assign({}, state, {
        clientReferentialAudit
    });
}