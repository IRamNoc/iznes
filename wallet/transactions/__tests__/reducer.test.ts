import { TransactionsReducer as reducer } from '../reducer';
import { mockAssetPayload, mockAllPayload } from './mock-actions';
import {
    SET_ASSET_TRANSACTIONS,
    SET_ALL_TRANSACTIONS,
    incrementAllCurrentPage,
    incrementAllRequestedPage,
    decrementAllCurrentPage,
    decrementAllRequestedPage,
    incrementAssetCurrentPage,
    incrementAssetRequestedPage,
    decrementAssetCurrentPage,
    decrementAssetRequestedPage,
    resetAllTransactions,
    resetAssetTransactions,
    setAllLoading,
    setAssetLoading,
} from '../actions';

describe('transactions reducer', () => {
    let initialState;
    beforeEach(() => {
        initialState = {
            all: {
                currentPage: 0,
                requestedPage: 0,
                loading: true,
                pages: [],
            },
            byAsset: {},
        };
    });
    it('should return the initial state', () => {
        expect(reducer(undefined, { type: undefined, payload: {} })).toEqual({
            all: {
                currentPage: 0,
                requestedPage: 0,
                loading: true,
                pages: [],
            },
            byAsset: {},
        });
    });
    it('should handle SET_ALL_TRANSACTIONS', () => {
        expect(reducer(initialState, { type: SET_ALL_TRANSACTIONS, payload: mockAllPayload })).toEqual({
            all: {
                currentPage: 0,
                requestedPage: 0,
                loading: false,
                pages: [
                    {
                        page: 0,
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
                        next: {
                            timestamp: 1530296892,
                            address: 'API8hqSuw_Z782HdJe1Fhta07c0W0PxLyQ',
                            nonce: 79,
                        },
                        transactions: [
                            {
                                txType: 'astra',
                                baseChain: 2700,
                                hash: 'cd4fb11ec9f6b45571e34b93ee54d9e3503950296af2b6f6bdae6bbb481995d3',
                                height: -1,
                                nonce: 2,
                                fromAddr: 'ANVSb3bTH0sw1mZXp4Q3KQQx71DXvMdUgA',
                                toAddr: 'AJV9XPccWDVWwaGp-lkXjhAmlVh2nKN5FQ',
                                fromPub: '305930',
                                shortHash: 'cd4fb11ec9f6b45571e34b93ee54d9e3503950296af2b6f6bdae6bbb481995d3',
                                utc: 1535975266000,
                                amount: 50,
                                issuer: 'OLLIECORP',
                                instrument: 'SHARE001',
                                protocol: '',
                                sig: 'signature1',
                            },
                            {
                                txType: 'adreg',
                                baseChain: 2700,
                                hash: 'ae7846465e83aeab6251bf2c9a9da1e5a569834841fe4a7c2f8712413420d44f',
                                height: -1,
                                nonce: 0,
                                fromAddr: undefined,
                                toAddr: undefined,
                                fromPub: undefined,
                                shortHash: 'ae7846465e83aeab6251bf2c9a9da1e5a569834841fe4a7c2f8712413420d44f',
                                utc: 1535974393000,
                                amount: undefined,
                                issuer: undefined,
                                instrument: undefined,
                                protocol: undefined,
                                sig: 'signature2',
                            },
                        ],
                    },

                ],
            },
            byAsset: {},
        });
    });
    it('should hande setting other pages for SET_ALL_TRANSACTIONS', () => {
        initialState.all.pages[0] = 'page1';
        initialState.all.requestedPage = 1;
        expect(reducer(initialState, { type: SET_ALL_TRANSACTIONS, payload: mockAllPayload })).toEqual({
            all: {
                currentPage: 1,
                requestedPage: 1,
                loading: false,
                pages: [
                    'page1',
                    {
                        page: 1,
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
                        next: {
                            timestamp: 1530296892,
                            address: 'API8hqSuw_Z782HdJe1Fhta07c0W0PxLyQ',
                            nonce: 79,
                        },
                        transactions: [
                            {
                                txType: 'astra',
                                baseChain: 2700,
                                hash: 'cd4fb11ec9f6b45571e34b93ee54d9e3503950296af2b6f6bdae6bbb481995d3',
                                height: -1,
                                nonce: 2,
                                fromAddr: 'ANVSb3bTH0sw1mZXp4Q3KQQx71DXvMdUgA',
                                toAddr: 'AJV9XPccWDVWwaGp-lkXjhAmlVh2nKN5FQ',
                                fromPub: '305930',
                                shortHash: 'cd4fb11ec9f6b45571e34b93ee54d9e3503950296af2b6f6bdae6bbb481995d3',
                                utc: 1535975266000,
                                amount: 50,
                                issuer: 'OLLIECORP',
                                instrument: 'SHARE001',
                                protocol: '',
                                sig: 'signature1',
                            },
                            {
                                txType: 'adreg',
                                baseChain: 2700,
                                hash: 'ae7846465e83aeab6251bf2c9a9da1e5a569834841fe4a7c2f8712413420d44f',
                                height: -1,
                                nonce: 0,
                                fromAddr: undefined,
                                toAddr: undefined,
                                fromPub: undefined,
                                shortHash: 'ae7846465e83aeab6251bf2c9a9da1e5a569834841fe4a7c2f8712413420d44f',
                                utc: 1535974393000,
                                amount: undefined,
                                issuer: undefined,
                                instrument: undefined,
                                protocol: undefined,
                                sig: 'signature2',
                            },
                        ],
                    },

                ],
            },
            byAsset: {},
        });
    });
    it('should handle SET_ASSET_TRANSACTIONS', () => {
        expect(reducer(initialState, { type: SET_ASSET_TRANSACTIONS, payload: mockAssetPayload })).toEqual({
            all: {
                currentPage: 0,
                requestedPage: 0,
                loading: true,
                pages: [],
            },
            byAsset: {
                'OLLIECORP|SHARE001': {
                    currentPage: 0,
                    requestedPage: 0,
                    loading: false,
                    pages: [
                        {
                            page: 0,
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
                            transactions: [
                                {
                                    txType: 'asiss',
                                    baseChain: 2700,
                                    hash: 'ae62115b2e87cdd4bc6441acb9fd30a8edeae1a53683f9a0649dbad100337b02',
                                    height: -1,
                                    nonce: 4,
                                    fromAddr: 'APMJNp2zgq2HOocdWdX_QA_ansZQfoAJWg',
                                    toAddr: 'APMJNp2zgq2HOocdWdX_QA_ansZQfoAJWg',
                                    fromPub: '305930',
                                    shortHash: 'ae62115b2e87cdd4bc6441acb9fd30a8edeae1a53683f9a0649dbad100337b02',
                                    utc: 1535977109000,
                                    amount: 20000,
                                    issuer: 'OLLIECORP',
                                    instrument: 'SHARE001',
                                    protocol: '',
                                    sig: 'signature1',
                                },
                                {
                                    txType: 'astra',
                                    baseChain: 2700,
                                    hash: 'cd4fb11ec9f6b45571e34b93ee54d9e3503950296af2b6f6bdae6bbb481995d3',
                                    height: -1,
                                    nonce: 2,
                                    fromAddr: 'ANVSb3bTH0sw1mZXp4Q3KQQx71DXvMdUgA',
                                    toAddr: 'AJV9XPccWDVWwaGp-lkXjhAmlVh2nKN5FQ',
                                    fromPub: '305930',
                                    shortHash: 'cd4fb11ec9f6b45571e34b93ee54d9e3503950296af2b6f6bdae6bbb481995d3',
                                    utc: 1535975266000,
                                    amount: 50,
                                    issuer: 'OLLIECORP',
                                    instrument: 'SHARE001',
                                    protocol: '',
                                    sig: 'signature2',
                                },
                            ],
                        },
                    ],
                },
            },
        });
    });
    it('should handle setting other pages for SET_ASSET_TRANSACTIONS', () => {
        initialState.byAsset = {
            'OLLIECORP|SHARE001': {
                currentPage: 0,
                requestedPage: 1,
                loading: true,
                pages: ['page1'],
            },
        };
        expect(reducer(initialState, { type: SET_ASSET_TRANSACTIONS, payload: mockAssetPayload })).toEqual({
            all: {
                currentPage: 0,
                requestedPage: 0,
                loading: true,
                pages: [],
            },
            byAsset: {
                'OLLIECORP|SHARE001': {
                    currentPage: 1,
                    requestedPage: 1,
                    loading: false,
                    pages: [
                        'page1',
                        {
                            page: 1,
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
                            transactions: [
                                {
                                    txType: 'asiss',
                                    baseChain: 2700,
                                    hash: 'ae62115b2e87cdd4bc6441acb9fd30a8edeae1a53683f9a0649dbad100337b02',
                                    height: -1,
                                    nonce: 4,
                                    fromAddr: 'APMJNp2zgq2HOocdWdX_QA_ansZQfoAJWg',
                                    toAddr: 'APMJNp2zgq2HOocdWdX_QA_ansZQfoAJWg',
                                    fromPub: '305930',
                                    shortHash: 'ae62115b2e87cdd4bc6441acb9fd30a8edeae1a53683f9a0649dbad100337b02',
                                    utc: 1535977109000,
                                    amount: 20000,
                                    issuer: 'OLLIECORP',
                                    instrument: 'SHARE001',
                                    protocol: '',
                                    sig: 'signature1',
                                },
                                {
                                    txType: 'astra',
                                    baseChain: 2700,
                                    hash: 'cd4fb11ec9f6b45571e34b93ee54d9e3503950296af2b6f6bdae6bbb481995d3',
                                    height: -1,
                                    nonce: 2,
                                    fromAddr: 'ANVSb3bTH0sw1mZXp4Q3KQQx71DXvMdUgA',
                                    toAddr: 'AJV9XPccWDVWwaGp-lkXjhAmlVh2nKN5FQ',
                                    fromPub: '305930',
                                    shortHash: 'cd4fb11ec9f6b45571e34b93ee54d9e3503950296af2b6f6bdae6bbb481995d3',
                                    utc: 1535975266000,
                                    amount: 50,
                                    issuer: 'OLLIECORP',
                                    instrument: 'SHARE001',
                                    protocol: '',
                                    sig: 'signature2',
                                },
                            ],
                        },
                    ],
                },
            },
        });
    });
    it('should inrement requestedPage for all', () => {
        const newState = reducer(initialState, incrementAllRequestedPage());

        expect(newState.all.requestedPage).toBe(1);
    });
    it('should increment requestedPage for asset', () => {
        initialState.byAsset = {
            'OLLIECORP|SHARE001': {
                requestedPage: 0,
            },
        };

        const newState = reducer(initialState, incrementAssetRequestedPage('OLLIECORP|SHARE001'));

        expect(newState.byAsset['OLLIECORP|SHARE001'].requestedPage).toBe(1);
    });
    it('should decrement requestedPage for asset', () => {
        initialState.byAsset = {
            'OLLIECORP|SHARE001': {
                requestedPage: 0,
            },
        };

        const newState = reducer(initialState, decrementAssetRequestedPage('OLLIECORP|SHARE001'));

        expect(newState.byAsset['OLLIECORP|SHARE001'].requestedPage).toBe(-1);
    });
    it('should decrement requestedPage for all', () => {
        const newState = reducer(initialState, decrementAllRequestedPage());

        expect(newState.all.requestedPage).toBe(-1);
    });
    it('should inrement currentPage for all', () => {
        const newState = reducer(initialState, incrementAllCurrentPage());

        expect(newState.all.currentPage).toBe(1);
    });
    it('should decrement currentPage for all', () => {
        const newState = reducer(initialState, decrementAllCurrentPage());

        expect(newState.all.currentPage).toBe(-1);
    });
    it('should inrement currentPage for asset', () => {
        initialState.byAsset = {
            'OLLIECORP|SHARE001': {
                currentPage: 0,
            },
        };

        const newState = reducer(initialState, incrementAssetCurrentPage('OLLIECORP|SHARE001'));

        expect(newState.byAsset['OLLIECORP|SHARE001'].currentPage).toBe(1);
    });
    it('should decrement currentPage for asset', () => {
        initialState.byAsset = {
            'OLLIECORP|SHARE001': {
                currentPage: 0,
            },
        };

        const newState = reducer(initialState, decrementAssetCurrentPage('OLLIECORP|SHARE001'));

        expect(newState.byAsset['OLLIECORP|SHARE001'].currentPage).toBe(-1);
    });
    it('should reset all assets', () => {
        initialState.all = {
            currentPage: 1,
            requestedPage: 4,
            loading: false,
            pages: [
                'test',
            ],
        };

        const newState = reducer(initialState, resetAllTransactions());

        expect(newState.all).toEqual({
            currentPage: 0,
            requestedPage: 0,
            loading: true,
            pages: [],
        });
    });
    it('should reset transactions for an asset', () => {
        initialState.byAsset = {
            'OLLIECORP|SHARE001': {
                currentPage: 1,
                requestedPage: 4,
                loading: false,
                pages: [
                    'test',
                ],
            },
        };

        const newState = reducer(initialState, resetAssetTransactions('OLLIECORP|SHARE001'));

        expect(newState.byAsset['OLLIECORP|SHARE001']).toEqual({
            currentPage: 0,
            requestedPage: 0,
            loading: true,
            pages: [],
        });
    });
    it('should set loading flag for all', () => {
        initialState.all = {
            currentPage: 1,
            requestedPage: 4,
            loading: false,
            pages: [
                'test',
            ],
        };

        const newState = reducer(initialState, setAllLoading());

        expect(newState.all).toEqual({
            currentPage: 1,
            requestedPage: 4,
            loading: true,
            pages: [
                'test',
            ],
        });
    });
    it('should set loading flag for asset', () => {
        const newState = reducer(
            {
                all: {
                    currentPage: 0,
                    requestedPage: 0,
                    loading: true,
                    pages: [],
                },
                byAsset: {
                    'OLLIECORP|SHARE001': {
                        currentPage: 1,
                        requestedPage: 4,
                        loading: false,
                        pages: [],
                    },
                },
            },
            setAssetLoading('OLLIECORP|SHARE001'),
        );

        expect(newState.byAsset['OLLIECORP|SHARE001']).toEqual({
            currentPage: 1,
            requestedPage: 4,
            loading: true,
            pages: [],
        });
    });
});
