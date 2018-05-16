import {List} from 'immutable';

export interface CurrencyState {
    isRequested: boolean;
    currencies: List;
}
