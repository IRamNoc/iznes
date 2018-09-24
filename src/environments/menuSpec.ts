import { MenuSpec } from '@setl/utils';

const home = {
    label: 'Home',
    label_txt: 'txt_home',
    icon_class: 'fa fa-home',
    element_id: 'menu-home',
    router_link: '/home',
};
const dashboard = {
    label: 'My Dashboard',
    label_txt: 'txt_mydashboard',
    icon_class: 'fa fa-bar-chart',
    element_id: 'menu-my-dashboard',
    router_link: '/asset-management/my-dashboard',
};
const subPortfolio = {
    label: 'Sub-portfolio',
    label_txt: 'txt_subportfolio',
    icon_class: 'fa fa-id-badge',
    element_id: 'menu-sub-portfolio',
    router_link: '/user-administration/subportfolio',
};
const messages = {
    label: 'Messages',
    label_txt: 'txt_messages',
    icon_class: 'fa fa-envelope',
    element_id: 'menu-messages',
    router_link: '/messages',
};
const listOfFunds = {
    label: 'Place Order',
    label_txt: 'txt_placeorder',
    icon_class: 'fa fa-university',
    element_id: 'menu-list-of-fund',
    router_link: '/list-of-funds/0',
    dynamic_link: '/list-of-funds/[^\/]*',
};
const orderBook = {
    label: 'Order Book',
    label_txt: 'txt_orderbook',
    icon_class: 'fa fa-university',
    element_id: 'menu-order-module',
    children: [
        listOfFunds,
        {
            label: 'My Orders',
            label_txt: 'txt_myorders',
            icon_class: 'fa fa-book',
            element_id: 'menu-my-orders',
            router_link: '/order-book/my-orders',
            dynamic_link: '/order-book/my-orders/[^\/]*',
        },
    ],
};
const myHoldings = {
    label: 'My Holdings',
    label_txt: 'txt_myholdings',
    icon_class: 'fa fa-sitemap',
    element_id: 'menu-investor-my-holdings',
    router_link: '/my-holdings',
};
const fundHoldings = {
    label: 'Fund Holdings',
    label_txt: 'txt_fundholdings',
    icon_class: 'fa fa-bar-chart',
    element_id: 'menu-asset-manager-dashboard',
    router_link: '/asset-management/fund-holdings',
    dynamic_link: '/asset-management/fund-holdings/[^\/]*',
};
const manageOrders = {
    label: 'Order Book',
    label_txt: 'txt_orderbook',
    icon_class: 'fa fa-list-ul',
    element_id: 'menu-manage-orders',
    router_link: '/manage-orders/list',
    dynamic_link: '\/manage-orders\/[^\/]*',
};
const reportsCollectsArchives = {
    label: 'Recordkeeping',
    label_txt: 'txt_recordkeeping',
    icon_class: 'fa fa-book',
    element_id: 'holders-list',
    router_link: '/reports/holders-list',
    dynamic_link: '/reports/holders-list/[^\/]*',
};
const reportsPrecentralisation = {
    label: 'Precentralisation',
    label_txt: 'txt_precentralisation',
    icon_class: 'fa fa-book',
    element_id: 'menu-report-centralisation',
    router_link: '/reports/precentralisation',
    dynamic_link: '/reports/precentralisation/[^/]*',
};
const reportsCentralisation = {
    label: 'Centralisation',
    label_txt: 'txt_centralisation',
    icon_class: 'fa fa-book',
    element_id: 'menu-report-centralisation-select',
    router_link: '/reports/centralisation',
    dynamic_link: '/reports/centralisation/[^/]*',
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
    router_link: '/reports-section/tax',
};
const reportsPL = {
    label: 'P&L',
    label_txt: 'txt_pl',
    icon_class: 'fa fa-list-alt',
    element_id: 'menu-reports-section-pnl',
    router_link: '/reports-section/pnl',
};
const reportsBalances = {
    label: 'Balances Reports',
    label_txt: 'txt_balancesreports',
    icon_class: 'fa fa-th-list',
    element_id: 'menu-report-balance-report',
    router_link: '/reports/balances',
};
const reportsIssues = {
    label: 'Issue Reports',
    label_txt: 'txt_issuereports',
    icon_class: 'fa fa-money',
    element_id: 'menu-report-issue',
    router_link: '/reports/issue',
};
const reportsTransactions = {
    label: 'Transactions Reports',
    label_txt: 'txt_transactionsreports',
    icon_class: 'fa fa-key',
    element_id: 'menu-report-transaction',
    router_link: '/reports/transactions',
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
            router_link: '/chain-admin/manage-chains',
            dynamic_link: '/chain-admin/manage-chains/[^\/]*',
        },
        {
            label: 'Wallet Nodes',
            label_txt: 'txt_walletnodes',
            icon_class: 'fa fa-code-fork',
            element_id: 'chain-administration-wallet-nodes',
            router_link: '/chain-admin/manage-wallet-nodes',
            dynamic_link: '/chain-admin/manage-wallet-nodes/[^\/]*',
        },
        {
            label: 'Member',
            label_txt: 'txt_member',
            icon_class: 'fa fa-address-card',
            element_id: 'chain-administration-member',
            router_link: '/chain-admin/manage-member',
            dynamic_link: '/chain-admin/manage-member/[^\/]*',
        },
        {
            label: 'Groups',
            label_txt: 'txt_groups',
            icon_class: 'fa fa-user-o',
            element_id: 'chain-administration-groups',
            router_link: '/chain-admin/manage-groups',
            dynamic_link: '/chain-admin/manage-groups/[^\/]*',
        },
        {
            label: 'Chain Membership',
            label_txt: 'txt_chainmembership',
            icon_class: 'fa fa-handshake-o',
            element_id: 'chain-administration-membership',
            router_link: '/chain-admin/chain-membership',
            dynamic_link: '/chain-admin/chain-membership/[^\/]*',
        },
    ],
};
const corpCouponPayment = {
    label: 'Coupon Payment',
    label_txt: 'txt_couponpayment',
    icon_class: 'fa fa-briefcase',
    element_id: 'menu-coupon',
    router_link: '/corporate-actions/coupon-payment/0',
    dynamic_link: '/corporate-actions/coupon-payment/[^\/]*',

};
const userAdminUsers = {
    label: 'Users',
    label_txt: 'txt_users',
    icon_class: 'fa fa-user',
    element_id: 'menu-user-admin-users',
    router_link: '/user-administration/users/0',
    dynamic_link: '/user-administration/users/[^\/]*',
};
const userAdminWallets = {
    label: 'Wallets',
    label_txt: 'txt_wallets',
    icon_class: 'fa fa-briefcase',
    element_id: 'menu-user-admin-wallets',
    router_link: '/user-administration/wallets/0',
    dynamic_link: '/user-administration/wallets/[^\/]*',
};
const userAdminPermissions = {
    label: 'Permissions',
    label_txt: 'txt_permissions',
    icon_class: 'fa fa-key',
    element_id: 'menu-user-admin-permissions',
    router_link: '/user-administration/permissions/0',
    dynamic_link: '/user-administration/permissions/[^\/]*',
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
            router_link: '/financing/encumber-assets',
            dynamic_link: '/financing/encumber-assets/[^\/]*',
        },
    ],
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
            router_link: '/asset-servicing/register-issuer',
        },
        {
            label: 'Register Asset',
            label_txt: 'txt_registerasset',
            icon_class: 'fa fa-plus-circle',
            element_id: 'menu-asset-servicing-register-asset',
            router_link: '/asset-servicing/register-asset',
        },
        {
            label: 'Issue Asset',
            label_txt: 'txt_issueasset',
            icon_class: 'fa fa-paper-plane',
            element_id: 'menu-asset-servicing-issue-asset',
            router_link: '/asset-servicing/issue-asset',
        },
        {
            label: 'Send Asset',
            label_txt: 'txt_sendasset',
            icon_class: 'fa fa-share-square-o',
            element_id: 'menu-asset-servicing-send-asset',
            router_link: '/asset-servicing/send-asset',
        },
        {
            label: 'Request Asset',
            label_txt: 'txt_requestasset',
            icon_class: 'fa fa-exchange',
            element_id: 'menu-asset-servicing-request-asset',
            router_link: '/asset-servicing/request-asset',
        },
    ],
};
const ofiProductHome = {
    label: 'Shares / Funds / Umbrella funds',
    label_txt: 'txt_sharesfundsumbrellafunds',
    icon_class: 'fa fa-bar-chart',
    element_id: 'menu-product-home',
    router_link: '/product-module/product',
    dynamic_link: '/product-module/product/[^\/]*',
};
const productsSicav = {
    label: 'SICAV',
    label_txt: 'txt_sicav',
    icon_class: 'fa fa-user',
    element_id: 'menu-sicav',
    router_link: '/product-module/sicav',
    dynamic_link: '/product-module/sicav/[^\/]*',
};
const productsFund = {
    label: 'Fund',
    label_txt: 'txt_fund',
    icon_class: 'fa fa-area-chart',
    element_id: 'menu-product-fund',
    router_link: '/product-module/fund',
    dynamic_link: '/product-module/fund/[^\/]*',
};
const productsNav = {
    label: 'Net Asset Value',
    label_txt: 'txt_netassetvalue',
    icon_class: 'fa fa-ellipsis-h',
    element_id: 'menu-nav',
    router_link: '/product-module/net-asset-value',
    dynamic_link: '/product-module/net-asset-value/[^/]*',
};

const profileMyInfo = {
    label: 'My Information',
    label_txt: 'txt_my_information',
    icon_class: '',
    element_id: 'top-menu-my-info',
    router_link: '/profile/my-information',
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
            router_link: '/on-boarding/management',
            dynamic_link: '/on-boarding/[^\/]*',
        },
        {
            label: 'Client Referential',
            label_txt: 'txt_client_referential',
            icon_class: 'fa fa-users',
            element_id: 'top-menu-client-referential',
            router_link: '/client-referential',
            dynamic_link: '/client-referential/[^\/]*',
        },
    ],
};

const myAssetManagers = {
    label: 'My Asset Managers',
    label_txt: 'txt_my_asset_managers',
    icon_class: 'fa fa-users',
    element_id: 'top-menu-my-asset-managers',
    always_displayed: true,
    children: [
        {
            label: 'My documents',
            label_txt: 'txt_my-documents',
            icon_class: 'fa fa-copy',
            element_id: 'top-menu-my-documents',
            router_link: '/my-asset-managers/my-documents',
        },
        {
            label: 'My Requests',
            label_txt: 'txt_my_requests',
            icon_class: 'fa fa-file-text',
            element_id: 'top-menu-my-requests',
            router_link: '/my-requests/list',
            dynamic_link: '/my-requests/list[^\/]*',
        },
    ],
};

const productConfiguration = {
    label: 'Configuration',
    label_txt: 'txt_productconfig',
    icon_class: 'fa fa-cog',
    element_id: 'menu-product-config',
    router_link: '/product-module/configuration',
};

const accountAdmin = {
    label: 'Administration',
    label_txt: 'txt_administration',
    icon_class: 'fa fa-align-left',
    element_id: 'menu-administration',
    children: [
        {
            label: 'Users',
            label_txt: 'txt_users',
            icon_class: 'fa fa-users',
            element_id: 'menu-administration-users',
            router_link: '/account-admin/users',
            dynamic_link: '/account-admin/users/[^\/]*',
        },
        {
            label: 'Teams',
            label_txt: 'txt_teams',
            icon_class: 'fa fa-address-book-o',
            element_id: 'menu-administration-teams',
            router_link: '/account-admin/teams',
            dynamic_link: '/account-admin/teams/[^\/]*',
        },
    ],
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
        },
    },
    side: {
        investor: [
            home,
            orderBook,
            myAssetManagers,
            myHoldings,
            // dashboard,
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
                    reportsPrecentralisation,
                    reportsCentralisation,
                ],
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
                    productConfiguration,
                ],
            },
            accountAdmin,
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
                ],
            },
            listOfFunds,
            {
                label: 'Reports',
                label_txt: 'txt_reports',
                icon_class: 'fa fa-book',
                element_id: 'menu-am-report-section',
                children: [
                    reportsCollectsArchives,
                ],
            },

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
                ],
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
                ],
            },
            {
                label: 'Reports',
                label_txt: 'txt_reports',
                icon_class: 'fa fa-book',
                element_id: 'menu-am-report-section',
                children: [
                    reportsCollectsArchives,
                ],
            },
        ],
        system_admin: [
            home,
            {
                label: 'Corporate Actions',
                label_txt: 'txt_corporateactions',
                icon_class: 'fa fa-university',
                element_id: 'menu-corporate-actions',
                children: [
                    corpCouponPayment,
                ],
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
                ],
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
                ],
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
                ],
            },
            {
                label: 'User Administration',
                label_txt: 'txt_useradministration',
                icon_class: 'fa fa-cubes',
                element_id: 'menu-user-administration',
                children: [
                    userAdminUsers,
                    userAdminWallets,
                ],
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
                ],
            },
            chainAdmin,
        ],
        member_user: [
            {
                label: 'Corporate Actions',
                label_txt: 'txt_corporateactions',
                icon_class: 'fa fa-university',
                element_id: 'menu-corporate-actions',
                children: [
                    corpCouponPayment,
                ],
            },
            {
                label: 'User Administration',
                label_txt: 'txt_useradministration',
                icon_class: 'fa fa-cubes',
                element_id: 'menu-user-administration',
                children: [
                    userAdminUsers,
                    userAdminWallets,
                ],
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
                ],
            },
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
                ],
            },
        ],
        iznes_admin: [
            {
                label: 'Management Companies',
                label_txt: 'txt_management-companies',
                icon_class: 'fa fa-users',
                element_id: 'menu-management-companies',
                router_link: '/management-company',
            }
        ]
    },
    disabled: [],
};
