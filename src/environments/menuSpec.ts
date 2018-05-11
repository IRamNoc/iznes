import {MenuSpec} from '@setl/utils';

const home = {
    label: 'Home',
    label_txt: 'txt_home',
    icon_class: 'fa fa-home',
    element_id: 'menu-home',
    router_link: '/home'
};
const dashboard = {
    label: 'My Dashboard',
    label_txt: 'txt_mydashboard',
    icon_class: 'fa fa-bar-chart',
    element_id: 'menu-my-dashboard',
    router_link: '/asset-management/my-dashboard'
};
const subPortfolio = {
    label: 'Sub-portfolio',
    label_txt: 'txt_subportfolio',
    icon_class: 'fa fa-id-badge',
    element_id: 'menu-sub-portfolio',
    router_link: '/user-administration/subportfolio'
};
const messages = {
    label: 'Messages',
    label_txt: 'txt_messages',
    icon_class: 'fa fa-envelope',
    element_id: 'menu-messages',
    router_link: '/messages'
};
const listOfFunds = {
    label: 'List of funds',
    label_txt: 'txt_listoffunds',
    icon_class: 'fa fa-university',
    element_id: 'menu-list-of-fund',
    router_link: '/list-of-funds/0'
};
const orderBook = {
    label: 'Order Book',
    label_txt: 'txt_orderbook',
    icon_class: 'fa fa-university',
    element_id: 'menu-order-module',
    children: [
        {
            label: 'Place Order',
            label_txt: 'txt_placeorder',
            icon_class: 'fa fa-university',
            element_id: 'menu-list-of-fund',
            router_link: '/list-of-funds/0'
        },
        {
            label: 'My Orders',
            label_txt: 'txt_myorders',
            icon_class: 'fa fa-book',
            element_id: 'menu-my-orders',
            router_link: '/order-book/my-orders/list'
        }
    ]
};
const fundHoldings = {
    label: 'Fund Holdings',
    label_txt: 'txt_fundholdings',
    icon_class: 'fa fa-bar-chart',
    element_id: 'menu-asset-manager-dashboard',
    router_link: '/asset-management/fund-holdings'
};
const manageOrders = {
    label: 'Order Book',
    label_txt: 'txt_orderbook',
    icon_class: 'fa fa-list-ul',
    element_id: 'menu-manage-orders',
    router_link: '/manage-orders/list'
};
const reportsCollectsArchives = {
    label: 'Holders Lists',
    label_txt: 'txt_holderslist',
    icon_class: 'fa fa-book',
    element_id: 'holders-list',
    router_link: '/reports/holders-list/list'
};
const reportsCentralization = {
    label: 'Centralization',
    label_txt: 'txt_centralization',
    icon_class: 'fa fa-book',
    element_id: 'menu-report-centralization',
    router_link: '/reports/centralization'
};
// const reportsHistoricalOrders = {
//     label: 'Holders Lists',
//     label_txt: 'txt_holders_list',
//     icon_class: 'fa fa-book',
//     element_id: 'menu-am-reports-section-historical-orders',
//     router_link: '/reports-section/csv'
// };
const reportsTaxReport = {
    label: 'Tax Report',
    label_txt: 'txt_taxreport',
    icon_class: 'fa fa-eur',
    element_id: 'menu-reports-section-tax',
    router_link: '/reports-section/tax'
};
const reportsPL = {
    label: 'P&L',
    label_txt: 'txt_pl',
    icon_class: 'fa fa-list-alt',
    element_id: 'menu-reports-section-pnl',
    router_link: '/reports-section/pnl'
};
const reportsBalances = {
    label: 'Balances Reports',
    label_txt: 'txt_balancesreports',
    icon_class: 'fa fa-th-list',
    element_id: 'menu-report-balance-report',
    router_link: '/reports/balances'
};
const reportsIssues = {
    label: 'Issue Reports',
    label_txt: 'txt_issuereports',
    icon_class: 'fa fa-money',
    element_id: 'menu-report-issue',
    router_link: '/reports/issue'
};
const reportsTransactions = {
    label: 'Transactions Reports',
    label_txt: 'txt_transactionsreports',
    icon_class: 'fa fa-key',
    element_id: 'menu-report-transaction',
    router_link: '/reports/transactions'
};
const chainAdmin = {
    label: 'Chain Administration',
    label_txt: 'txt_chainadministration',
    icon_class: 'fa fa-chain',
    element_id: 'menu-chain-administration',
    children: [
        {
            label: 'Chains',
            label_txt: 'txt_chains',
            icon_class: 'fa fa-chain',
            element_id: 'chain-administration-chains',
            router_link: '/chain-admin/manage-chains'
        },
        {
            label: 'Wallet Nodes',
            label_txt: 'txt_walletnodes',
            icon_class: 'fa fa-code-fork',
            element_id: 'chain-administration-wallet-nodes',
            router_link: '/chain-admin/manage-wallet-nodes'
        },
        {
            label: 'Member',
            label_txt: 'txt_member',
            icon_class: 'fa fa-address-card',
            element_id: 'chain-administration-member',
            router_link: '/chain-admin/manage-member'
        },
        {
            label: 'Groups',
            label_txt: 'txt_groups',
            icon_class: 'fa fa-user-o',
            element_id: 'chain-administration-groups',
            router_link: '/chain-admin/manage-groups'
        },
        {
            label: 'Chain Membership',
            label_txt: 'txt_chainmembership',
            icon_class: 'fa fa-handshake-o',
            element_id: 'chain-administration-membership',
            router_link: '/chain-admin/chain-membership'
        },
    ]
};
const corpCouponPayment = {
    label: 'Coupon Payment',
    label_txt: 'txt_couponpayment',
    icon_class: 'fa fa-briefcase',
    element_id: 'menu-coupon',
    router_link: '/corporate-actions/coupon-payment/0'
};
const corpDividendDemo = {
    label: 'Dividend demo',
    label_txt: 'txt_Dividends',
    icon_class: 'fa fa-briefcase',
    element_id: 'menu-coupon',
    router_link: '/workflow-engine/dividend'
};
const userAdminUsers = {
    label: 'Users',
    label_txt: 'txt_users',
    icon_class: 'fa fa-user',
    element_id: 'menu-user-admin-users',
    router_link: '/user-administration/users/0'
};
const userAdminWallets = {
    label: 'Wallets',
    label_txt: 'txt_wallets',
    icon_class: 'fa fa-briefcase',
    element_id: 'menu-user-admin-wallets',
    router_link: '/user-administration/wallets/0'
};
const userAdminPermissions = {
    label: 'Permissions',
    label_txt: 'txt_permissions',
    icon_class: 'fa fa-key',
    element_id: 'menu-user-admin-permissions',
    router_link: '/user-administration/permissions/0'
};
const financing = {
    label: 'Financing',
    label_txt: 'txt_financing',
    icon_class: 'fa fa-money',
    element_id: 'menu-financing',
    children: [
        {
            label: 'Encumber Assets',
            label_txt: 'txt_encumberassets',
            icon_class: 'fa fa-money',
            element_id: 'financing-encumber-assets',
            router_link: '/financing/encumber-assets'
        },
    ]
};
const assetServicing = {
    label: 'Asset Servicing',
    label_txt: 'txt_assetservicing',
    icon_class: 'fa fa-archive',
    element_id: 'menu-asset-servicing',
    children: [
        {
            label: 'Register Issuer',
            label_txt: 'txt_registerissuer',
            icon_class: 'fa fa-user-plus',
            element_id: 'menu-asset-servicing-register-issuer',
            router_link: '/asset-servicing/register-issuer'
        },
        {
            label: 'Register Asset',
            label_txt: 'txt_registerasset',
            icon_class: 'fa fa-plus-circle',
            element_id: 'menu-asset-servicing-register-asset',
            router_link: '/asset-servicing/register-asset'
        },
        {
            label: 'Issue Asset',
            label_txt: 'txt_issueasset',
            icon_class: 'fa fa-paper-plane',
            element_id: 'menu-asset-servicing-issue-asset',
            router_link: '/asset-servicing/issue-asset'
        },
        {
            label: 'Send Asset',
            label_txt: 'txt_sendasset',
            icon_class: 'fa fa-share-square-o',
            element_id: 'menu-asset-servicing-send-asset',
            router_link: '/asset-servicing/send-asset'
        },
        {
            label: 'Request Asset',
            label_txt: 'txt_requestasset',
            icon_class: 'fa fa-exchange',
            element_id: 'menu-asset-servicing-request-asset',
            router_link: '/asset-servicing/request-asset'
        }
    ]
};
const ofiProductHome = {
    label: 'Shares / Funds / Umbrella funds',
    label_txt: 'txt_sharesfundsumbrellafunds',
    icon_class: 'fa fa-bar-chart',
    element_id: 'menu-product-home',
    router_link: '/product-module/product'
};
const productsManagementCompany = {
    label: 'Management Company',
    label_txt: 'txt_managementcompany',
    icon_class: 'fa fa-university',
    element_id: 'menu-management-company',
    router_link: '/management-company'
};
const productsSicav = {
    label: 'SICAV',
    label_txt: 'txt_sicav',
    icon_class: 'fa fa-user',
    element_id: 'menu-sicav',
    router_link: '/product-module/sicav'
};
const productsFund = {
    label: 'Fund',
    label_txt: 'txt_fund',
    icon_class: 'fa fa-area-chart',
    element_id: 'menu-product-fund',
    router_link: '/product-module/fund'
};
const productsNav = {
    label: 'Net Asset Value',
    label_txt: 'txt_netassetvalue',
    icon_class: 'fa fa-ellipsis-h',
    element_id: 'menu-nav',
    router_link: '/product-module/net-asset-value'
};

const profileMyInfo = {
    label: 'My Information',
    label_txt: 'txt_my_information',
    icon_class: '',
    element_id: 'top-menu-my-info',
    router_link: '/profile/my-information'
};

const kycDocuments = {
    label: 'My Clients',
    label_txt: 'txt_my_clients',
    icon_class: 'fa fa-align-left',
    element_id: 'top-menu-my-clients',
    children: [
        {
            label: 'On-boarding Management',
            label_txt: 'txt_on_boarding_management',
            icon_class: 'fa fa-align-left',
            element_id: 'top-menu-onboarding-management',
            router_link: '/kyc-am-documents'
        },
        {
            label: 'Invite Investors',
            label_txt: 'txt_invite_investors',
            icon_class: 'fa fa-align-left',
            element_id: 'top-menu-invite-investor',
            router_link: '/invite-investors'
        }
    ]
};

export const menuSpec: MenuSpec = {
    top: {
        profile: {
            investor: [
                profileMyInfo,
            ],
            am: [
                profileMyInfo,
            ],
            valuer: [
                profileMyInfo,
            ],
            custodian: [
                profileMyInfo,
            ],
            cac: [
                profileMyInfo,
            ],
            registrar: [
                profileMyInfo,
            ],
            system_admin: [
                profileMyInfo,
            ],
            chain_admin: [
                profileMyInfo,
            ],
            member_user: [
                profileMyInfo,
            ],
            standard_user: [
                profileMyInfo,
            ],
        }
    },
    side: {
        investor: [
            home,
            orderBook,
            dashboard,
            subPortfolio,
            // messages,
            // {
            //     label: 'Reports',
            //     label_txt: 'txt_reports',
            //     icon_class: 'fa fa-book',
            //     element_id: 'menu-report-section',
            //     children: [
            //         reportsTaxReport,
            //         reportsPL,
            //     ]
            // }
        ],
        am: [
            home,
            manageOrders,
            {
                label: 'My Reports',
                label_txt: 'txt_my_reports',
                icon_class: 'fa fa-book',
                element_id: 'menu-am-report-section',
                children: [
                    reportsCollectsArchives,
                    reportsCentralization,
                ]
            },
            kycDocuments,
            {
                label: 'My Products',
                label_txt: 'txt_my_products',
                icon_class: 'fa fa-industry',
                element_id: 'menu-my-products',
                children: [
                    ofiProductHome,
                    productsNav,
                ]
            },
            productsManagementCompany,
        ],
        valuer: [
            home,
            messages,
            {
                label: 'My Products',
                label_txt: 'txt_my_products',
                icon_class: 'fa fa-industry',
                element_id: 'menu-my-products',
                children: [
                    productsNav,
                ]
            },
            listOfFunds,
            {
                label: 'Reports',
                label_txt: 'txt_reports',
                icon_class: 'fa fa-book',
                element_id: 'menu-am-report-section',
                children: [
                    reportsCollectsArchives,
                ]
            }

        ],
        custodian: [
            home,
            fundHoldings,
            messages,
            listOfFunds,
        ],
        cac: [
            home,
            fundHoldings,
            messages,
            listOfFunds,
        ],
        registrar: [
            home,
            fundHoldings,
            messages,
            {
                label: 'My Products',
                label_txt: 'txt_my_products',
                icon_class: 'fa fa-industry',
                element_id: 'menu-my-products',
                children: [
                    productsSicav,
                    productsFund,
                    productsNav,
                ]
            },
            listOfFunds,
            manageOrders,
            orderBook,
            {
                label: 'Reports',
                label_txt: 'txt_reports',
                icon_class: 'fa fa-book',
                element_id: 'menu-report-section',
                children: [
                    reportsTaxReport,
                    reportsPL,
                ]
            },
            {
                label: 'Reports',
                label_txt: 'txt_reports',
                icon_class: 'fa fa-book',
                element_id: 'menu-am-report-section',
                children: [
                    reportsCollectsArchives,
                ]
            }
        ],
        system_admin: [
            {
                label: 'Corporate Actions',
                label_txt: 'txt_corporateactions',
                icon_class: 'fa fa-university',
                element_id: 'menu-corporate-actions',
                children: [
                    corpCouponPayment,
                ]
            },
            {
                label: 'User Administration',
                label_txt: 'txt_useradministration',
                icon_class: 'fa fa-cubes',
                element_id: 'menu-user-administration',
                children: [
                    userAdminUsers,
                    userAdminWallets,
                    userAdminPermissions,
                ]
            },
            messages,
            subPortfolio,
            financing,
            assetServicing,
            {
                label: 'Report',
                label_txt: 'txt_reports',
                icon_class: 'fa fa-flag',
                element_id: 'menu-asset-servicing',
                children: [
                    reportsBalances,
                    reportsIssues,
                    reportsTransactions,
                ]
            },
            chainAdmin,
        ],
        chain_admin: [
            {
                label: 'Corporate Actions',
                label_txt: 'txt_corporateactions',
                icon_class: 'fa fa-university',
                element_id: 'menu-corporate-actions',
                children: [
                    corpCouponPayment,
                    corpDividendDemo,
                ]
            },
            {
                label: 'User Administration',
                label_txt: 'txt_useradministration',
                icon_class: 'fa fa-cubes',
                element_id: 'menu-user-administration',
                children: [
                    userAdminUsers,
                    userAdminWallets,
                ]
            },
            messages,
            subPortfolio,
            financing,
            assetServicing,
            {
                label: 'Report',
                label_txt: 'txt_reports',
                icon_class: 'fa fa-flag',
                element_id: 'menu-asset-servicing',
                children: [
                    reportsBalances,
                    reportsIssues,
                    reportsTransactions,
                ]
            },
            chainAdmin,
            {
                label: 'Workflow Engine',
                label_txt: 'txt_wfe',
                icon_class: 'fa fa-gears',
                element_id: 'menu-workflow-engine',
                children: [
                    {
                        label: 'Editor',
                        label_txt: 'txt_editor',
                        icon_class: 'fa fa-edit',
                        element_id: 'workflow-editor',
                        router_link: '/workflow-engine/editor'
                    }
                ]
            },
        ],
        member_user: [
            {
                label: 'Corporate Actions',
                label_txt: 'txt_corporateactions',
                icon_class: 'fa fa-university',
                element_id: 'menu-corporate-actions',
                children: [
                    corpCouponPayment,
                ]
            },
            {
                label: 'User Administration',
                label_txt: 'txt_useradministration',
                icon_class: 'fa fa-cubes',
                element_id: 'menu-user-administration',
                children: [
                    userAdminUsers,
                    userAdminWallets,
                ]
            },
            messages,
            subPortfolio,
            assetServicing,
            {
                label: 'Report',
                label_txt: 'txt_reports',
                icon_class: 'fa fa-flag',
                element_id: 'menu-asset-servicing',
                children: [
                    reportsBalances,
                    reportsIssues,
                    reportsTransactions,
                ]
            }
        ],
        standard_user: [
            messages,
            subPortfolio,
            assetServicing,
            {
                label: 'Report',
                label_txt: 'txt_reports',
                icon_class: 'fa fa-flag',
                element_id: 'menu-asset-servicing',
                children: [
                    reportsBalances,
                    reportsIssues,
                    reportsTransactions,
                ]
            }
        ],
    },
    disabled: [] // '/manage-orders/list', '/am-reports-section/collects-archive', '/reports-section/csv','/order-book/my-orders/list', '/asset-management/my-dashboard'
};
