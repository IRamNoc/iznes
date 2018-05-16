import {List} from 'immutable';

export interface CurrencyType {
    code: string;
    name: string;
}

export interface CurrencyState {
    isRequested: boolean;
    currencies: List<CurrencyType>;
}
