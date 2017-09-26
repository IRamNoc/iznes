import {OfiInvestorFundListState} from './model';
import {Action} from 'redux';

const initialState: OfiInvestorFundListState = {
    fundList: []
};

export const OfiInvestorFundListReducer = function (state: OfiInvestorFundListState = initialState, action: Action) {
    switch (action.type) {
        default:
            return state;
    }
}



