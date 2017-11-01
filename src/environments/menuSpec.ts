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
            label: 'My Dashboard',
            label_txt: 'txt_mydashboard',
            icon_class: 'fa fa-bar-chart',
            element_id: 'menu-my-dashboard',
            router_link: '/my-dashboard'
        },
        {
            label: 'Sub-portfolio',
            label_txt: 'txt_subportfolio',
            icon_class: 'fa fa-id-badge',
            element_id: 'menu-sub-portfolio',
            router_link: '/user-admin/subportfolio'
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
                    icon_class: 'fa fa-area-char',
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
                }
            ]
        }
    ],
    valuer: [
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
    custodian: [
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
    cac: [
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
    registrar: [
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

    ]
};
