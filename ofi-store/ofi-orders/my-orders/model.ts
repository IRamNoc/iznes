export interface OrderTab {
    title: {
        icon: string;
        text: string;
    };
    orderId: string;
    active: string;
    orderData: any;
}

export interface MyOrders {
    orderList: Array<any>;
    requested: boolean;
    openedTabs: Array<OrderTab>;
}
