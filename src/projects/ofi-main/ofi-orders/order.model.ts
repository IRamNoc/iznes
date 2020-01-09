export enum OrderType {
    Subscription = 3,
    Redemption = 4,
}

export enum OrderByType {
    Quantity = 1,
    Amount = 2,
}

const labelMap = {
    3: 'Subscription',
    4: 'Redemption',
};

export const labelForOrder = (order: { orderType: number }): string => {
    return labelMap[order.orderType] || 'Not found!';
};
