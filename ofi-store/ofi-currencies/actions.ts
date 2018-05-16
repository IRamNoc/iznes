const name = 'currencies';

/* Actions */
export const LOAD_CURRENCIES = `${name}/LOAD_CURRENCIES`;
export const RESET_CURRENCIES = `${name}/RESET_CURRENCIES`;
export const GET_CURRENCIES = `${name}/GET_CURRENCIES`;

/* Action creators */
export const loadCurrencies = () => {
    return {
        type: LOAD_CURRENCIES
    };
};

export const resetCurrencies = () => {
    return {
        type: RESET_CURRENCIES
    };
};

export const getCurrencies = () => {
    return {
        type: GET_CURRENCIES
    };
};
