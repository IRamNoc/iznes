import {List} from 'immutable';

export interface CurrencyType {
    id: string;
    text: string;
}

export interface CurrencyState {
    loaded: boolean;
    currencies: List<CurrencyType>;
}
