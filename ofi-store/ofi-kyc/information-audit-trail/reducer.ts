import * as _ from 'lodash';
import {
    informationAuditTrailAction,
    SET_INFORMATION_AUDIT_TRAIL,
    SET_INFORMATION_AUDIT_TRAIL_REQUESTED,
    SET_INFORMATION_AUDIT_TRAIL_RESET,
} from './actions';
import { informationAuditTrailItem } from './model';
import {
    convertUtcStrToLocalStr,
} from '@setl/utils/helper/m-date-wrapper';

export interface kycInformationAuditTrailState {
    requested: boolean;
    data: {
        [kycID: number]: informationAuditTrailItem[];
    };
    list: number[];
}

const initialState = {
    requested: false,
    data: {},
    list: [],
};

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export function kycInformationAuditTrailReducer(
    state: kycInformationAuditTrailState = initialState,
    action: informationAuditTrailAction,
): kycInformationAuditTrailState {
    switch (action.type) {
    case SET_INFORMATION_AUDIT_TRAIL:
        let data = _.get(action.payload.data, [1, 'Data'], []);
        if (data.length) {
            data = data.map(item => ({
                ..._.omit(item, ['Status']),
                dateModified: convertUtcStrToLocalStr(item.dateModified, DATE_FORMAT),
            }));
        }

        return {
            ...state,
            data: {
                ...state.data,
                [action.payload.kycID]: data,
            },
            list: _.uniq(state.list.concat([action.payload.kycID])),
        };
    case SET_INFORMATION_AUDIT_TRAIL_REQUESTED:
        return {
            ...state,
            requested: true,
        };
    case SET_INFORMATION_AUDIT_TRAIL_RESET:
        return {
            ...state,
            requested: false,
        };
    default:
        return state;
    }
}
