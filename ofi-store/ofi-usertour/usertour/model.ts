import {List} from 'immutable';

export interface MySubPortfoliosDetails {
    isDone: boolean;
}

export interface UserTourState {
    mySubPortfolios: List<MySubPortfoliosDetails>;
    mySubPortfoliosRequested: boolean;
}
