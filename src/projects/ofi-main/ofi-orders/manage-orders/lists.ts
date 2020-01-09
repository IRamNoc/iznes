export interface SelectedItem {
    id: any;
    text: number | string;
}

export const orderStatuses: SelectedItem[] = [
    { id: -3, text: 'All' },
    { id: -1, text: 'Settled' },
    { id: 0, text: 'Cancelled' }, // estimatedPrice
    { id: 1, text: 'Initiated' },
    { id: 2, text: 'Waiting NAV' },
    { id: 3, text: 'Waiting Settlement' },
    { id: 4, text: 'Unpaid' },
];

export const orderTypes: SelectedItem[] = [
    { id: 0, text: 'All' },
    { id: 3, text: 'Subscription' },
    { id: 4, text: 'Redemption' },
];

export const dateTypes: SelectedItem[] = [
    { id: 'orderDate', text: 'Order Date' },
    { id: 'cutoffDate', text: 'Cut-off Date' },
    { id: 'navDate', text: 'NAV Date' },
    { id: 'settlementDate', text: 'Settlement Date' },
];
