import { Map } from 'immutable';

import * as actions from './actions';

import { productCharacteristics } from './model';

export interface productCharacteristicsState {
    requested: boolean;
    product: productCharacteristics|Map<any, any>;
}

const initialState: productCharacteristicsState = {
    requested: false,
    product: Map(),
};

/**
 *  Ofi fund share reducer
 * @param state
 * @param action
 * @return {any}
 * @constructor
 */
export const productCharacteristicsReducer = (state = initialState, action) => {
    switch (action.type) {
    case actions.SET_PRODUCT_CHARACTERISTICS:
        const data = action.payload[1].Data[0];
        const product = Map({
            ...data,
            distributionPolicy: JSON.parse(data.distributionPolicy),
            srri: JSON.parse(data.srri),
            sri: JSON.parse(data.sri),
            recommendedHoldingPeriod: JSON.parse(data.recommendedHoldingPeriod),
        });

        return {
            ...state,
            product,
        };

    case actions.SET_REQUESTED_PRODUCT_CHARACTERISTICS:
        return {
            ...state,
            requested: true,
        };

    default:
        return state;
    }
};
