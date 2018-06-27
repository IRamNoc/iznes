import * as _ from 'lodash';
import {
    statusAuditTrailAction,
    SET_STATUS_AUDIT_TRAIL,
    SET_STATUS_AUDIT_TRAIL_REQUESTED,
    SET_STATUS_AUDIT_TRAIL_RESET,
} from './actions';
import { statusAuditTrailItem } from './model';
import {
    convertUtcStrToLocalStr,
} from '@setl/utils/helper/m-date-wrapper';

export interface kycStatusAuditTrailState {
    requested: boolean;
    data: {
        [kycID: number]: statusAuditTrailItem[];
    };
    list: number[];
}

const initialState = {
    requested: false,
    data: {},
    list: [],
};

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

export function kycStatusAuditTrailReducer(
    state: kycStatusAuditTrailState = initialState,
    action: statusAuditTrailAction,
): kycStatusAuditTrailState {
    switch (action.type) {
    case SET_STATUS_AUDIT_TRAIL:
        let data = _.get(action.payload.data, [1, 'Data'], []);
        if (data.length) {
            data = data.map(item => ({
                ..._.omit(item, ['Status']),
                dateEntered: convertUtcStrToLocalStr(item.dateEntered, DATE_FORMAT),
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
    case SET_STATUS_AUDIT_TRAIL_REQUESTED:
        return {
            ...state,
            requested: true,
        };
    case SET_STATUS_AUDIT_TRAIL_RESET:
        return {
            ...state,
            requested: false,
        };
    default:
        return state;
    }
}
