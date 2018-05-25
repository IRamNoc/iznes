import { List, Map } from 'immutable';
import { Action, Reducer } from 'redux';
import * as CurrencyActions from './actions';
import { CurrencyState, CurrencyType } from './model';

const initialState: CurrencyState = {
    loaded: false,
    currencies: List<CurrencyType>(),
};

const handleLoadCurrencies = (state, action) => {
    const response = action.payload[1].Data;
    let currencies = List();

    if (response.length > 0) {
        response.map((currencyItem) => {
            const currency = Map({
                id: currencyItem.currencyID,
                text: currencyItem.currencyCode,
            });

            currencies = currencies.push(currency);
        });
    }

    return Object.assign({}, state, {
        currencies,
        loaded: true,
    });
};

export const CurrencyReducer: Reducer<CurrencyState> = (state = initialState, action: Action) => {
    switch (action.type) {
        case CurrencyActions.LOAD_CURRENCIES:
            return handleLoadCurrencies(state, action);

        default:
            return state;
    }
};
