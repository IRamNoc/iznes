import {MenuSpec, MenuItem} from '@setl/utils';

export const menuSpec: MenuSpec = {
    investor: [
        {
            label: 'Home',
            label_txt: 'txt_home',
            icon_class: 'fa fa-home',
            element_id: 'menu-home',
            router_link: '/home'
        },
        {
            label: 'My dashboard',
            label_txt: 'txt_mydashboard',
            icon_class: 'fa fa-bar-chart',
            element_id: 'menu-my-dashboard',
            router_link: '/asset-management/my-dashboard'
        },
        {
            label: 'Sub-portfolio',
            label_txt: 'txt_subportfolio',
            icon_class: 'fa fa-id-badge',
            element_id: 'menu-sub-portfolio',
            router_link: '/user-administration/subportfolio'
        },
        {
            label: 'Messages',
            label_txt: 'txt_messages',
            icon_class: 'fa fa-envelope',
            element_id: 'menu-messages',
            router_link: '/messages'
        },
        {
            label: 'Account Module',
            label_txt: 'txt_accountmodule',
            icon_class: 'fa fa-user',
            element_id: 'menu-account-module',
            children: [
                {
                    label: 'My Account',
                    label_txt: 'txt_myaccount',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-my-account',
                    router_link: '/account/my-account'
                }
            ]
        },
        {
            label: 'List of funds',
            label_txt: 'txt_listoffunds',
            icon_class: 'fa fa-university',
            element_id: 'menu-list-of-fund',
            router_link: '/list-of-funds'
        },
        {
            label: 'My Orders',
            label_txt: 'txt_myorders',
            icon_class: 'fa fa-book',
            element_id: 'menu-my-orders',
            router_link: '/order-book/my-orders'
        },
        {
            label: 'Reports',
            label_txt: 'txt_reports',
            icon_class: 'fa fa-book',
            element_id: 'menu-report-section',
            children: [
                {
                    label: 'Tax Report',
                    label_txt: 'txt_taxreport',
                    icon_class: 'fa fa-eur',
                    element_id: 'menu-reports-section-tax',
                    router_link: '/reports-section/tax'
                },
                {
                    label: 'P&L',
                    label_txt: 'txt_pl',
                    icon_class: 'fa fa-list-alt',
                    element_id: 'menu-reports-section-pnl',
                    router_link: '/reports-section/pnl'
                }
            ]
        }
    ],
    am: [
        {
            label: 'Home',
            label_txt: 'txt_home',
            icon_class: 'fa fa-home',
            element_id: 'menu-home',
            router_link: '/home'
        },
        {
            label: 'Fund Holidings',
            label_txt: 'txt_fundholidings',
            icon_class: 'fa fa-bar-chart',
            element_id: 'menu-asset-manager-dashboard',
            router_link: '/asset-management/fund-holdings'
        },
        {
            label: 'Messages',
            label_txt: 'txt_messages',
            icon_class: 'fa fa-envelope',
            element_id: 'menu-messages',
            router_link: '/messages'
        },
        {
            label: 'Account Module',
            label_txt: 'txt_accountmodule',
            icon_class: 'fa fa-user',
            element_id: 'menu-account-module',
            children: [
                {
                    label: 'My Account',
                    label_txt: 'txt_myaccount',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-my-account',
                    router_link: '/account/my-account'
                }
            ]
        },
        {
            label: 'Product Module',
            label_txt: 'txt_productmodule',
            icon_class: 'fa fa-industry',
            element_id: 'menu-product-module',
            children: [
                {
                    label: 'Management Company',
                    label_txt: 'txt_managementcompany',
                    icon_class: 'fa fa-university',
                    element_id: 'menu-management-company',
                    router_link: '/product-module/management-company'
                },
                {
                    label: 'SICAV',
                    label_txt: 'txt_sicav',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-sicav',
                    router_link: '/product-module/sicav'
                },
                {
                    label: 'Fund',
                    label_txt: 'txt_fund',
                    icon_class: 'fa fa-area-chart',
                    element_id: 'menu-product-fund',
                    router_link: '/product-module/fund'
                },
                {
                    label: 'Net Asset Value',
                    label_txt: 'txt_netassetvalue',
                    icon_class: 'fa fa-ellipsis-h',
                    element_id: 'menu-nav',
                    router_link: '/product-module/net-asset-value'
                }
            ]
        },
        {
            label: 'Manage Orders',
            label_txt: 'txt_manageorders',
            icon_class: 'fa fa-pencil',
            element_id: 'menu-manage-orders',
            router_link: '/manage-orders'
        },
        {
            label: 'Reports',
            label_txt: 'txt_reports',
            icon_class: 'fa fa-book',
            element_id: 'menu-am-report-section',
            children: [
                {
                    label: 'Collects Archives',
                    label_txt: 'txt_collects-archives',
                    icon_class: 'fa fa-book',
                    element_id: 'menu-am-reports-section-collective-archives',
                    router_link: '/am-reports-section/collects-archive'
                },
                {
                    label: 'Historical Orders',
                    label_txt: 'txt_historical_orders',
                    icon_class: 'fa fa-book',
                    element_id: 'menu-am-reports-section-historical-orders',
                    router_link: '/reports-section/csv'
                }
            ]
        }
    ],
    valuer: [
        {
            label: 'Home',
            label_txt: 'txt_home',
            icon_class: 'fa fa-home',
            element_id: 'menu-home',
            router_link: '/home'
        },
        {
            label: 'Messages',
            label_txt: 'txt_messages',
            icon_class: 'fa fa-envelope',
            element_id: 'menu-messages',
            router_link: '/messages'
        },
        {
            label: 'Account Module',
            label_txt: 'txt_accountmodule',
            icon_class: 'fa fa-user',
            element_id: 'menu-account-module',
            children: [
                {
                    label: 'My Account',
                    label_txt: 'txt_myaccount',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-my-account',
                    router_link: '/account/my-account'
                }
            ]
        },
        {
            label: 'Product Module',
            label_txt: 'txt_productmodule',
            icon_class: 'fa fa-industry',
            element_id: 'menu-product-module',
            children: [
                {
                    label: 'Net Asset Value',
                    label_txt: 'txt_netassetvalue',
                    icon_class: 'fa fa-ellipsis-h',
                    element_id: 'menu-nav',
                    router_link: '/product-module/net-asset-value'
                }
            ]
        },
        {
            label: 'List of funds',
            label_txt: 'txt_listoffunds',
            icon_class: 'fa fa-university',
            element_id: 'menu-list-of-fund',
            router_link: '/list-of-funds'
        },
        {
            label: 'Reports',
            label_txt: 'txt_reports',
            icon_class: 'fa fa-book',
            element_id: 'menu-am-report-section',
            children: [
                {
                    label: 'Collects Archives',
                    label_txt: 'txt_collects-archives',
                    icon_class: 'fa fa-book',
                    element_id: 'menu-am-reports-section-collective-archives',
                    router_link: '/am-reports-section/collects-archive'
                }
            ]
        }

    ],
    custodian: [
        {
            label: 'Home',
            label_txt: 'txt_home',
            icon_class: 'fa fa-home',
            element_id: 'menu-home',
            router_link: '/home'
        },
        {
            label: 'Fund Holidings',
            label_txt: 'txt_fundholidings',
            icon_class: 'fa fa-bar-chart',
            element_id: 'menu-asset-manager-dashboard',
            router_link: '/asset-management/fund-holdings'
        },
        {
            label: 'Messages',
            label_txt: 'txt_messages',
            icon_class: 'fa fa-envelope',
            element_id: 'menu-messages',
            router_link: '/messages'
        },
        {
            label: 'Account Module',
            label_txt: 'txt_accountmodule',
            icon_class: 'fa fa-user',
            element_id: 'menu-account-module',
            children: [
                {
                    label: 'My Account',
                    label_txt: 'txt_myaccount',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-my-account',
                    router_link: '/account/my-account'
                }
            ]
        },
        {
            label: 'List of funds',
            label_txt: 'txt_listoffunds',
            icon_class: 'fa fa-university',
            element_id: 'menu-list-of-fund',
            router_link: '/list-of-funds'
        },
    ],
    cac: [
        {
            label: 'Home',
            label_txt: 'txt_home',
            icon_class: 'fa fa-home',
            element_id: 'menu-home',
            router_link: '/home'
        },
        {
            label: 'Fund Holidings',
            label_txt: 'txt_fundholidings',
            icon_class: 'fa fa-bar-chart',
            element_id: 'menu-asset-manager-dashboard',
            router_link: '/asset-management/fund-holdings'
        },
        {
            label: 'Messages',
            label_txt: 'txt_messages',
            icon_class: 'fa fa-envelope',
            element_id: 'menu-messages',
            router_link: '/messages'
        },
        {
            label: 'Account Module',
            label_txt: 'txt_accountmodule',
            icon_class: 'fa fa-user',
            element_id: 'menu-account-module',
            children: [
                {
                    label: 'My Account',
                    label_txt: 'txt_myaccount',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-my-account',
                    router_link: '/account/my-account'
                }
            ]
        },
        {
            label: 'List of funds',
            label_txt: 'txt_listoffunds',
            icon_class: 'fa fa-university',
            element_id: 'menu-list-of-fund',
            router_link: '/list-of-funds'
        },

    ],
    registrar: [
        {
            label: 'Home',
            label_txt: 'txt_home',
            icon_class: 'fa fa-home',
            element_id: 'menu-home',
            router_link: '/home'
        },
        {
            label: 'Fund Holidings',
            label_txt: 'txt_fundholidings',
            icon_class: 'fa fa-bar-chart',
            element_id: 'menu-asset-manager-dashboard',
            router_link: '/asset-management/fund-holdings'
        },
        {
            label: 'Messages',
            label_txt: 'txt_messages',
            icon_class: 'fa fa-envelope',
            element_id: 'menu-messages',
            router_link: '/messages'
        },
        {
            label: 'Account Module',
            label_txt: 'txt_accountmodule',
            icon_class: 'fa fa-user',
            element_id: 'menu-account-module',
            children: [
                {
                    label: 'My Account',
                    label_txt: 'txt_myaccount',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-my-account',
                    router_link: '/account/my-account'
                }
            ]
        },
        {
            label: 'Product Module',
            label_txt: 'txt_productmodule',
            icon_class: 'fa fa-industry',
            element_id: 'menu-product-module',
            children: [
                {
                    label: 'SICAV',
                    label_txt: 'txt_sicav',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-sicav',
                    router_link: '/product-module/sicav'
                },
                {
                    label: 'Fund',
                    label_txt: 'txt_fund',
                    icon_class: 'fa fa-area-chart',
                    element_id: 'menu-product-fund',
                    router_link: '/product-module/fund'
                },
                {
                    label: 'Net Asset Value',
                    label_txt: 'txt_netassetvalue',
                    icon_class: 'fa fa-ellipsis-h',
                    element_id: 'menu-nav',
                    router_link: '/product-module/net-asset-value'
                }
            ]
        },
        {
            label: 'List of funds',
            label_txt: 'txt_listoffunds',
            icon_class: 'fa fa-university',
            element_id: 'menu-list-of-fund',
            router_link: '/list-of-funds'
        },
        {
            label: 'Manage Orders',
            label_txt: 'txt_manageorders',
            icon_class: 'fa fa-pencil',
            element_id: 'menu-manage-orders',
            router_link: '/manage-orders'
        },
        {
            label: 'My Orders',
            label_txt: 'txt_myorders',
            icon_class: 'fa fa-book',
            element_id: 'menu-my-orders',
            router_link: '/order-book/my-orders'
        },
        {
            label: 'Reports',
            label_txt: 'txt_reports',
            icon_class: 'fa fa-book',
            element_id: 'menu-report-section',
            children: [
                {
                    label: 'Tax Report',
                    label_txt: 'txt_taxreport',
                    icon_class: 'fa fa-eur',
                    element_id: 'menu-reports-section-tax',
                    router_link: '/reports-section/tax'
                },
                {
                    label: 'P&L',
                    label_txt: 'txt_pl',
                    icon_class: 'fa fa-list-alt',
                    element_id: 'menu-reports-section-pnl',
                    router_link: '/reports-section/pnl'
                }
            ]
        },
        {
            label: 'Reports',
            label_txt: 'txt_reports',
            icon_class: 'fa fa-book',
            element_id: 'menu-am-report-section',
            children: [
                {
                    label: 'Collects Archives',
                    label_txt: 'txt_collects-archives',
                    icon_class: 'fa fa-book',
                    element_id: 'menu-am-reports-section-collective-archives',
                    router_link: '/am-reports-section/collects-archive'
                }
            ]
        }
    ],
    system_admin: [
        {
            label: 'Account Module',
            label_txt: 'txt_accountmodule',
            icon_class: 'fa fa-user',
            element_id: 'menu-account-module',
            children: [
                {
                    label: 'My Account',
                    label_txt: 'txt_myaccount',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-my-account',
                    router_link: '/account/my-account'
                }
            ]
        },
        {
            label: 'Corporate Actions',
            label_txt: 'txt_corporateactions',
            icon_class: 'fa fa-university',
            element_id: 'menu-corporate-actions',
            children: [
                {
                    label: 'Coupon Payment',
                    label_txt: 'txt_couponpayment',
                    icon_class: 'fa fa-briefcase',
                    element_id: 'menu-coupon',
                    router_link: '/corporate-actions/coupon-payment'
                }
            ]
        },
        {
            label: 'User Administration',
            label_txt: 'txt_useradministration',
            icon_class: 'fa fa-cubes',
            element_id: 'menu-user-administration',
            children: [
                {
                    label: 'Users',
                    label_txt: 'txt_users',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-user-admin-users',
                    router_link: '/user-administration/users'
                },
                {
                    label: 'Wallets',
                    label_txt: 'txt_wallets',
                    icon_class: 'fa fa-briefcase',
                    element_id: 'menu-user-admin-wallets',
                    router_link: '/user-administration/wallets'
                },
                {
                    label: 'Permissions',
                    label_txt: 'txt_permissions',
                    icon_class: 'fa fa-key',
                    element_id: 'menu-user-admin-permissions',
                    router_link: '/user-administration/permissions'
                }
            ]
        },
        {
            label: 'Messages',
            label_txt: 'txt_messages',
            icon_class: 'fa fa-envelope',
            element_id: 'menu-messages',
            router_link: '/messages'
        },
        {
            label: 'Sub-portfolio',
            label_txt: 'txt_subportfolio',
            icon_class: 'fa fa-id-badge',
            element_id: 'menu-sub-portfolio',
            router_link: '/user-administration/subportfolio'
        },
        {
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
        },
        {
            label: 'Report',
            label_txt: 'txt_reports',
            icon_class: 'fa fa-flag',
            element_id: 'menu-asset-servicing',
            children: [
                {
                    label: 'Balances Reports',
                    label_txt: 'txt_balancesreports',
                    icon_class: 'fa fa-th-list',
                    element_id: 'menu-report-balance-report',
                    router_link: '/reports/balances'
                },
                {
                    label: 'Issue Reports',
                    label_txt: 'txt_issuereports',
                    icon_class: 'fa fa-money',
                    element_id: 'menu-report-issue',
                    router_link: '/reports/issue'
                },
                {
                    label: 'Transactions Reports',
                    label_txt: 'txt_transactionsreports',
                    icon_class: 'fa fa-key',
                    element_id: 'menu-report-transaction',
                    router_link: '/reports/transactions'
                }
            ]
        },
        {
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
        }
    ],
    chain_admin: [
        {
            label: 'Account Module',
            label_txt: 'txt_accountmodule',
            icon_class: 'fa fa-user',
            element_id: 'menu-account-module',
            children: [
                {
                    label: 'My Account',
                    label_txt: 'txt_myaccount',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-my-account',
                    router_link: '/account/my-account'
                }
            ]
        },
        {
            label: 'Corporate Actions',
            label_txt: 'txt_corporateactions',
            icon_class: 'fa fa-university',
            element_id: 'menu-corporate-actions',
            children: [
                {
                    label: 'Coupon Payment',
                    label_txt: 'txt_couponpayment',
                    icon_class: 'fa fa-briefcase',
                    element_id: 'menu-coupon',
                    router_link: '/corporate-actions/coupon-payment'
                },
                {
                    label: 'Dividend demo',
                    label_txt: 'txt_Dividends',
                    icon_class: 'fa fa-briefcase',
                    element_id: 'menu-coupon',
                    router_link: '/workflow-engine/dividend'
                }
            ]
        },
        {
            label: 'User Administration',
            label_txt: 'txt_useradministration',
            icon_class: 'fa fa-cubes',
            element_id: 'menu-user-administration',
            children: [
                {
                    label: 'Users',
                    label_txt: 'txt_users',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-user-admin-users',
                    router_link: '/user-administration/users'
                },
                {
                    label: 'Wallets',
                    label_txt: 'txt_wallets',
                    icon_class: 'fa fa-briefcase',
                    element_id: 'menu-user-admin-wallets',
                    router_link: '/user-administration/wallets'
                }
            ]
        },
        {
            label: 'Messages',
            label_txt: 'txt_messages',
            icon_class: 'fa fa-envelope',
            element_id: 'menu-messages',
            router_link: '/messages'
        },
        {
            label: 'Sub-portfolio',
            label_txt: 'txt_subportfolio',
            icon_class: 'fa fa-id-badge',
            element_id: 'menu-sub-portfolio',
            router_link: '/user-administration/subportfolio'
        },
        {
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
        },
        {
            label: 'Report',
            label_txt: 'txt_reports',
            icon_class: 'fa fa-flag',
            element_id: 'menu-asset-servicing',
            children: [
                {
                    label: 'Balances Reports',
                    label_txt: 'txt_balancesreports',
                    icon_class: 'fa fa-th-list',
                    element_id: 'menu-report-balance-report',
                    router_link: '/reports/balances'
                },
                {
                    label: 'Issue Reports',
                    label_txt: 'txt_issuereports',
                    icon_class: 'fa fa-money',
                    element_id: 'menu-report-issue',
                    router_link: '/reports/issue'
                },
                {
                    label: 'Transactions Reports',
                    label_txt: 'txt_transactionsreports',
                    icon_class: 'fa fa-key',
                    element_id: 'menu-report-transaction',
                    router_link: '/reports/transactions'
                }
            ]
        },
        {
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
        },
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
            label: 'Account Module',
            label_txt: 'txt_accountmodule',
            icon_class: 'fa fa-user',
            element_id: 'menu-account-module',
            children: [
                {
                    label: 'My Account',
                    label_txt: 'txt_myaccount',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-my-account',
                    router_link: '/account/my-account'
                }
            ]
        },
        {
            label: 'Corporate Actions',
            label_txt: 'txt_corporateactions',
            icon_class: 'fa fa-university',
            element_id: 'menu-corporate-actions',
            children: [
                {
                    label: 'Coupon Payment',
                    label_txt: 'txt_couponpayment',
                    icon_class: 'fa fa-briefcase',
                    element_id: 'menu-coupon',
                    router_link: '/corporate-actions/coupon-payment'
                }
            ]
        },
        {
            label: 'User Administration',
            label_txt: 'txt_useradministration',
            icon_class: 'fa fa-cubes',
            element_id: 'menu-user-administration',
            children: [
                {
                    label: 'Users',
                    label_txt: 'txt_users',
                    icon_class: 'fa fa-user',
                    element_id: 'menu-user-admin-users',
                    router_link: '/user-administration/users'
                },
                {
                    label: 'Wallets',
                    label_txt: 'txt_wallets',
                    icon_class: 'fa fa-briefcase',
                    element_id: 'menu-user-admin-wallets',
                    router_link: '/user-administration/wallets'
                },
            ]
        },
        {
            label: 'Messages',
            label_txt: 'txt_messages',
            icon_class: 'fa fa-envelope',
            element_id: 'menu-messages',
            router_link: '/messages'
        },
        {
            label: 'Sub-portfolio',
            label_txt: 'txt_subportfolio',
            icon_class: 'fa fa-id-badge',
            element_id: 'menu-sub-portfolio',
            router_link: '/user-administration/subportfolio'
        },
        {
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
        },
        {
            label: 'Report',
            label_txt: 'txt_reports',
            icon_class: 'fa fa-flag',
            element_id: 'menu-asset-servicing',
            children: [
                {
                    label: 'Balances Reports',
                    label_txt: 'txt_balancesreports',
                    icon_class: 'fa fa-th-list',
                    element_id: 'menu-report-balance-report',
                    router_link: '/reports/balances'
                },
                {
                    label: 'Issue Reports',
                    label_txt: 'txt_issuereports',
                    icon_class: 'fa fa-money',
                    element_id: 'menu-report-issue',
                    router_link: '/reports/issue'
                },
                {
                    label: 'Transactions Reports',
                    label_txt: 'txt_transactionsreports',
                    icon_class: 'fa fa-key',
                    element_id: 'menu-report-transaction',
                    router_link: '/reports/transactions'
                }
            ]
        }
    ],
};
