

export const transactionsFieldsModel = {
    hash: {
        label: 'Tx ID',
        options: {
            pipe: { name: 'truncate', params: 8 },
        },
    },
    assetName: {
        label: 'Asset',
        options: {
            pipe: { name: 'asset' },
        },
    },
    utc: {
        label: 'Time (UTC)',
        options: {
            pipe: { name: 'date' },
        },
    },
    txType: {
        label: 'Type',
    },
};
