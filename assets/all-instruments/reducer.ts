import {Action} from 'redux';
import {AllInstrumentsState} from './model';
import {
    SET_ALL_INSTRUMENTS_LIST,
    SET_REQUESTED_ALL_INSTRUMENTS,
    CLEAR_REQUESTED_ALL_INSTRUMENTS
} from './actions';
import * as _ from 'lodash';
import {List, fromJS, Map} from 'immutable';
import {immutableHelper} from '@setl/utils';

const initialState: AllInstrumentsState = {
    instrumentList: {},
    requested: false
};

export const AllInstrumentsReducer = function (state: AllInstrumentsState = initialState,
                                               action: Action): AllInstrumentsState {

    switch (action.type) {
        case SET_ALL_INSTRUMENTS_LIST:
            return handleSetAllInstrumentsList(state, action);

        case SET_REQUESTED_ALL_INSTRUMENTS:
            return toggleRequesteAllInstrumentsFlag(state, true);

        case CLEAR_REQUESTED_ALL_INSTRUMENTS:
            return toggleRequesteAllInstrumentsFlag(state, false);

        default:
            return state;
    }
};

function handleSetAllInstrumentsList(state: AllInstrumentsState, action: any): AllInstrumentsState {
    const instrumentData = _.get(action, 'payload[1].data', []);
    const instrumentList = immutableHelper.reduce(instrumentData, (result, item) => {
        const issuer = item.get('1');
        const instrument = item.get('2');
        const assetName = issuer + '|' + instrument;

        result[assetName] = {
            issuer: item.get('1'),
            instrument: item.get('2'),
            issuerAddress: item.get('0'),
            metaData: item.get('3')
        };

        return result;
    }, {});

    return Object.assign({}, state, {
        instrumentList
    });
}

function toggleRequesteAllInstrumentsFlag(state, requested: boolean): AllInstrumentsState {
    return Object.assign({}, state, {requested});
}

