import {FundShareTest} from './share-data';
import {RequestData} from './request-data';
import {OrderHelper} from '../order-helper';
import {expect} from 'chai';
import 'mocha';

describe('Subscription order', () => {
    let fundshareTestData;
    let requestTestData;

    beforeEach(() => {
        fundshareTestData = FundShareTest;
        requestTestData = RequestData;
    });

    it('subscription by amount', () => {
        requestTestData.orderby = 'a';
        requestTestData.ordervalue = 10000000;
        const orderHelper = new OrderHelper(fundshareTestData, requestTestData);
        const requestData = orderHelper.buildContractRequestBody();
        expect(JSON.stringify(requestData)).to.deep.equal(JSON.stringify({
            'messagetype': 'tx',
            'messagebody': {
                'txtype': 'conew',
                'walletid': 58,
                'address': 'AG0YlfYb1KlINJc0XphF63G4gEj8sk2WCg',
                'contractdata': {
                    '__function': 'dvp_uk',
                    'parties': [
                        2,
                        [
                            '',
                            'wallet_address',
                            [
                                [
                                    'wallet_address',
                                    'ordershare2',
                                    'ordershare2',
                                    '(10000000 / nav) * 100000',
                                    '',
                                    '',
                                    true,
                                    "{\"clientTxType\":\"subscription\"}"
                                ]
                            ],
                            [],
                            '',
                            '',
                            false
                        ],
                        [
                            '',
                            'AG0YlfYb1KlINJc0XphF63G4gEj8sk2WCg',
                            [],
                            [
                                [
                                    'AG0YlfYb1KlINJc0XphF63G4gEj8sk2WCg',
                                    'ordershare2',
                                    'ordershare2',
                                    '(10000000 / nav) * 100000'
                                ]
                            ],
                            '',
                            '',
                            false
                        ]
                    ],
                    'authorisations': [
                        [
                            'wallet_address',
                            '0',
                            '',
                            "{\"type\":\"authorisor\",\"msg\":\"Confirm receipt of payment\",\"address\":\"wallet_address\"}"
                        ]
                    ],
                    'parameters': {
                        'nav': [
                            'wallet_address',
                            '',
                            0,
                            0,
                            0,
                            ''
                        ]
                    },
                    'addencumbrances': [],
                    'events': [
                        'commit',
                        'expiry'
                    ],
                    'expiry': orderHelper.getOrderTimeStamp().expiryTimeStamp,
                    'startdate': orderHelper.getOrderTimeStamp().settleTimeStamp,
                    'protocol': 'dvp',
                    'encumbrance': [
                        true,
                        'use_encumbrance'
                    ],
                    'metadata': "{\"doc\":{},\"title\":\"Subscription order for ordershare2|ordershare2\"}"
                }
            }
        }));
    });

    it('subscription by quantity', () => {
        requestTestData.orderby = 'q';
        requestTestData.ordervalue = 10000000;
        const orderHelper = new OrderHelper(fundshareTestData, requestTestData);
        const requestData = orderHelper.buildContractRequestBody();
        expect(JSON.stringify(requestData)).to.deep.equal(JSON.stringify({
            "messagetype": "tx",
            "messagebody": {
                "txtype": "conew",
                "walletid": 58,
                "address": "AG0YlfYb1KlINJc0XphF63G4gEj8sk2WCg",
                "contractdata": {
                    "__function": "dvp_uk",
                    "parties": [
                        2,
                        [
                            "",
                            "wallet_address",
                            [
                                [
                                    "wallet_address",
                                    "ordershare2",
                                    "ordershare2",
                                    10000000,
                                    "",
                                    "",
                                    true,
                                    "{\"clientTxType\":\"subscription\"}"
                                ]
                            ],
                            [],
                            "",
                            "",
                            false
                        ],
                        [
                            "",
                            "AG0YlfYb1KlINJc0XphF63G4gEj8sk2WCg",
                            [],
                            [
                                [
                                    "AG0YlfYb1KlINJc0XphF63G4gEj8sk2WCg",
                                    "ordershare2",
                                    "ordershare2",
                                    10000000
                                ]
                            ],
                            "",
                            "",
                            false
                        ]
                    ],
                    "authorisations": [
                        [
                            "wallet_address",
                            "0",
                            "",
                            "{\"type\":\"authorisor\",\"msg\":\"Confirm receipt of payment\",\"address\":\"wallet_address\"}"
                        ]
                    ],
                    "parameters": {
                        "nav": [
                            "wallet_address",
                            "",
                            0,
                            0,
                            0,
                            ""
                        ]
                    },
                    "addencumbrances": [],
                    "events": [
                        "commit",
                        "expiry"
                    ],
                    'expiry': orderHelper.getOrderTimeStamp().expiryTimeStamp,
                    'startdate': orderHelper.getOrderTimeStamp().settleTimeStamp,
                    "protocol": "dvp",
                    "encumbrance": [
                        true,
                        "use_encumbrance"
                    ],
                    "metadata": "{\"doc\":{},\"title\":\"Subscription order for ordershare2|ordershare2\"}"
                }
            }
        }));
    });

    it('redemption by amount', () => {
        requestTestData.ordertype = 'r';
        requestTestData.orderby = 'a';
        requestTestData.ordervalue = 10000000;
        const orderHelper = new OrderHelper(fundshareTestData, requestTestData);
        const requestData = orderHelper.buildContractRequestBody();
        expect(JSON.stringify(requestData)).to.deep.equal(JSON.stringify({
            "messagetype": "tx",
            "messagebody": {
                "txtype": "conew",
                "walletid": 58,
                "address": "AG0YlfYb1KlINJc0XphF63G4gEj8sk2WCg",
                "contractdata": {
                    "__function": "dvp_uk",
                    "parties": [
                        2,
                        [
                            "",
                            "AG0YlfYb1KlINJc0XphF63G4gEj8sk2WCg",
                            [
                                [
                                    "AG0YlfYb1KlINJc0XphF63G4gEj8sk2WCg",
                                    "ordershare2",
                                    "ordershare2",
                                    "(10000000 / nav) * 100000",
                                    "",
                                    "",
                                    false,
                                    "{\"clientTxType\":\"redemption\"}"
                                ]
                            ],
                            [],
                            "",
                            "",
                            false
                        ],
                        [
                            "",
                            "wallet_address",
                            [],
                            [
                                [
                                    "wallet_address",
                                    "ordershare2",
                                    "ordershare2",
                                    "(10000000 / nav) * 100000"
                                ]
                            ],
                            "",
                            "",
                            false
                        ]
                    ],
                    "authorisations": [
                        [
                            "wallet_address",
                            "0",
                            "",
                            "{\"type\":\"authorisor\",\"msg\":\"Confirm receipt of payment\",\"address\":\"wallet_address\"}"
                        ]
                    ],
                    "parameters": {
                        "nav": [
                            "wallet_address",
                            "",
                            0,
                            0,
                            0,
                            ""
                        ]
                    },
                    "addencumbrances": [],
                    "events": [
                        "commit",
                        "expiry"
                    ],
                    'expiry': orderHelper.getOrderTimeStamp().expiryTimeStamp,
                    'startdate': orderHelper.getOrderTimeStamp().settleTimeStamp,
                    "protocol": "dvp",
                    "encumbrance": [
                        true,
                        "use_encumbrance"
                    ],
                    "metadata": "{\"doc\":{},\"title\":\"Subscription order for ordershare2|ordershare2\"}"
                }
            }
        }));

    });

    it('redemption by quantity', () => {
        requestTestData.ordertype = 'r';
        requestTestData.orderby = 'q';
        requestTestData.ordervalue = 10000000;
        const orderHelper = new OrderHelper(fundshareTestData, requestTestData);
        const requestData = orderHelper.buildContractRequestBody();
        expect(JSON.stringify(requestData)).to.deep.equal(JSON.stringify({
            "messagetype": "tx",
            "messagebody": {
                "txtype": "conew",
                "walletid": 58,
                "address": "AG0YlfYb1KlINJc0XphF63G4gEj8sk2WCg",
                "contractdata": {
                    "__function": "dvp_uk",
                    "parties": [
                        2,
                        [
                            "",
                            "AG0YlfYb1KlINJc0XphF63G4gEj8sk2WCg",
                            [
                                [
                                    "AG0YlfYb1KlINJc0XphF63G4gEj8sk2WCg",
                                    "ordershare2",
                                    "ordershare2",
                                    10000000,
                                    "",
                                    "",
                                    false,
                                    "{\"clientTxType\":\"redemption\"}"
                                ]
                            ],
                            [],
                            "",
                            "",
                            false
                        ],
                        [
                            "",
                            "wallet_address",
                            [],
                            [
                                [
                                    "wallet_address",
                                    "ordershare2",
                                    "ordershare2",
                                    10000000
                                ]
                            ],
                            "",
                            "",
                            false
                        ]
                    ],
                    "authorisations": [
                        [
                            "wallet_address",
                            "0",
                            "",
                            "{\"type\":\"authorisor\",\"msg\":\"Confirm receipt of payment\",\"address\":\"wallet_address\"}"
                        ]
                    ],
                    "parameters": {
                        "nav": [
                            "wallet_address",
                            "",
                            0,
                            0,
                            0,
                            ""
                        ]
                    },
                    "addencumbrances": [],
                    "events": [
                        "commit",
                        "expiry"
                    ],
                    'expiry': orderHelper.getOrderTimeStamp().expiryTimeStamp,
                    'startdate': orderHelper.getOrderTimeStamp().settleTimeStamp,
                    "protocol": "dvp",
                    "encumbrance": [
                        true,
                        "use_encumbrance"
                    ],
                    "metadata": "{\"doc\":{},\"title\":\"Subscription order for ordershare2|ordershare2\"}"
                }
            }
        }));
    });
});
