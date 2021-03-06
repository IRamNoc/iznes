export const mockAssetPayload = [
    null,
    {
        Status: 'OK',
        Data: {
            asset: 'OLLIECORP|SHARE001',
            next: null,
            before: {
                timestamp: 1535975266,
                address: 'ANVSb3bTH0sw1mZXp4Q3KQQx71DXvMdUgA',
                nonce: 2,
            },
            after: {
                timestamp: 1530785092,
                address: 'API8hqSuw_Z782HdJe1Fhta07c0W0PxLyQ',
                nonce: 80,
            },
            tx: [
                {
                    txtype: 'asiss',
                    updated: true,
                    chainid: 2700,
                    hash: 'ae62115b2e87cdd4bc6441acb9fd30a8edeae1a53683f9a0649dbad100337b02',
                    height: -1,
                    nonce: 4,
                    signature: 'signature1',
                    timestamp: 1535977109,
                    amount: 20000,
                    classid: 'SHARE001',
                    fromaddress: 'APMJNp2zgq2HOocdWdX_QA_ansZQfoAJWg',
                    frompublickey: '305930',
                    metadata: '',
                    namespace: 'OLLIECORP',
                    protocol: '',
                    toaddress: 'APMJNp2zgq2HOocdWdX_QA_ansZQfoAJWg',
                },
                {
                    txtype: 'astra',
                    updated: true,
                    chainid: 2700,
                    hash: 'cd4fb11ec9f6b45571e34b93ee54d9e3503950296af2b6f6bdae6bbb481995d3',
                    height: -1,
                    nonce: 2,
                    signature: 'signature2',
                    timestamp: 1535975266,
                    amount: 50,
                    classid: 'SHARE001',
                    fromaddress: 'ANVSb3bTH0sw1mZXp4Q3KQQx71DXvMdUgA',
                    frompubkey: '305930',
                    metadata: '',
                    namespace: 'OLLIECORP',
                    protocol: '',
                    toaddress: 'AJV9XPccWDVWwaGp-lkXjhAmlVh2nKN5FQ',
                },
            ],
        },
    },
];

export const mockAllPayload = [
    null,
    {
        Status: 'OK',
        Data: {
            next: {
                timestamp: 1530296892,
                address: 'API8hqSuw_Z782HdJe1Fhta07c0W0PxLyQ',
                nonce: 79,
            },
            before: {
                timestamp: 1535975266,
                address: 'ANVSb3bTH0sw1mZXp4Q3KQQx71DXvMdUgA',
                nonce: 2,
            },
            after: {
                timestamp: 1530785092,
                address: 'API8hqSuw_Z782HdJe1Fhta07c0W0PxLyQ',
                nonce: 80,
            },
            tx: [
                {
                    txtype: 'astra',
                    updated: true,
                    chainid: 2700,
                    hash: 'cd4fb11ec9f6b45571e34b93ee54d9e3503950296af2b6f6bdae6bbb481995d3',
                    height: -1,
                    nonce: 2,
                    poa: '',
                    signature: 'signature1',
                    timestamp: 1535975266,
                    amount: 50,
                    classid: 'SHARE001',
                    fromaddress: 'ANVSb3bTH0sw1mZXp4Q3KQQx71DXvMdUgA',
                    frompubkey: '305930',
                    metadata: '',
                    namespace: 'OLLIECORP',
                    protocol: '',
                    toaddress: 'AJV9XPccWDVWwaGp-lkXjhAmlVh2nKN5FQ',
                },
                {
                    txtype: 'adreg',
                    updated: true,
                    chainid: 2700,
                    hash: 'ae7846465e83aeab6251bf2c9a9da1e5a569834841fe4a7c2f8712413420d44f',
                    height: -1,
                    nonce: 0,
                    poa: '',
                    signature: 'signature2',
                    timestamp: 1535974393,
                    address: 'AJV9XPccWDVWwaGp-lkXjhAmlVh2nKN5FQ',
                    metadata: '',
                    newaddress: 'AJV9XPccWDVWwaGp-lkXjhAmlVh2nKN5FQ',
                    publickey: '305930',
                },
            ],
        },
    },
];
