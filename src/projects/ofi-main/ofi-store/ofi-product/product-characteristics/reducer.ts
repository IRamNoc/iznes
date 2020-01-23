import { Map, List } from 'immutable';

import * as actions from './actions';

import { productCharacteristics } from './model';

export interface productCharacteristicsState {
    requested: boolean;
    product: Map<string, any>;
    productList: List<string>;
}

const initialState: productCharacteristicsState = {
    requested: false,
    product: Map(),
    productList: List(),
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
        if (!action.payload[1].Data.length) {
            return state;
        }

        const data = action.payload[1].Data[0];
        const newProduct = state.product.set(data.isin, Map({
            ...data,
            distributionPolicy: data.distributionPolicy,
            srri: data.srri,
            sri: data.sri,
            recommendedHoldingPeriod: data.recommendedHoldingPeriod,
        }));

        return {
            ...state,
            product: newProduct,
            productList: state.productList.push(data.isin),
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
