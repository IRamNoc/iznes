import {List, Map} from 'immutable';
import {Action, Reducer} from 'redux';
import * as currencyActions from './actions';
import {CurrencyType, CurrencyState} from './model';

const initialState: CurrencyState = {
    isRequested: false,
    currencies: List()
};

const handleLoadCurrencies = (state) => {
    return state.set('isRequested', true);
};

const handleResetCurrencies = (state) => {
    return state.set('isRequested', false);
};

const handleGetCurrencies = (state, action) => {
    const response = action.payload[1].Data;
    const currencies = List();

    if (response.length > 0) {
        response.map((currencyItem) => {
            const currency: CurrencyType = {
                code: currencyItem.currencyCode,
                name: currencyItem.currencyTag,
            };

            currencies.push(currency);
        });
    }

    return state.set('currencies', currencies);
};

export const CurrencyReducer: Reducer<CurrencyState> = (state = initialState, action: Action) => {
    switch (action.type) {
        case currencyActions.LOAD_CURRENCIES:
            return this.handleLoadCurrencies(state);

        case currencyActions.RESET_CURRENCIES:
            return handleResetCurrencies(state);

        case currencyActions.GET_CURRENCIES:
            return handleGetCurrencies(state, action);

        default:
            return state;
    }
};
