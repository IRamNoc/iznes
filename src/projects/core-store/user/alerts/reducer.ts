import {
    SET_ALERTS,
} from './actions';
import {AlertDetail, AlertState} from './model';
import * as _ from 'lodash';
import {Action} from 'redux';
import {fromJS, List, Map} from 'immutable';

const initialState: AlertState = {
    alerts: {},
};

export const alertReducer = function (state: AlertState = initialState,
                                            action: Action) {
    let newState: AlertState;
    let alerts: object;

    switch (action.type) {
        case SET_ALERTS:
            const alertsData = _.get(action, 'payload[1].Data', []);
            alerts = formatAlertData(alertsData);

            newState = Object.assign({}, state, {
                alerts,
            });

            return newState;

        default:
            return state;
    }
};

function formatAlertData(rawAlertData: Array<any>): {
    [key: number]: AlertDetail
} {
    const rawAlertList = fromJS(rawAlertData);

    const alertList = Map(rawAlertList.reduce(
        (result, item) => {
            let alert = {}
            alert = JSON.parse(item.get('alertData'));
            alert['alertID'] = item.get('alertID');
        
            result[item.get('alertID')] = alert;
            return result;
        }, {}));

    return alertList.toJS();
}
