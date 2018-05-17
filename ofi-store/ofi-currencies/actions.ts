const NAME = 'currencies';

/* Actions */
export const LOAD_CURRENCIES = `${NAME}/LOAD_CURRENCIES`;
export const RESET_CURRENCIES = `${NAME}/RESET_CURRENCIES`;
export const GET_CURRENCIES = `${NAME}/GET_CURRENCIES`;

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
