import {List} from 'immutable';

export interface CurrencyType {
    id: string;
    text: string;
}

export interface CurrencyState {
    isRequested: boolean;
    currencies: List<CurrencyType>;
}
