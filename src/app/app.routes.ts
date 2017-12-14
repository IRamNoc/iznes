import {Routes} from '@angular/router';
/* Layouts. */
import {BasicLayoutComponent, BlankLayoutComponent} from '@setl/core-layout';
/* Components. */
import {HomeComponent} from './home/home.component';
import {SetlMyAccountComponent} from '@setl/core-account';
/**
 * Login Guard service
 */
import {LoginGuardService, SetlLoginComponent} from '@setl/core-login';
import {FormElementsComponent} from './ui-elements/form-elements.component';
/* Ofi Manage Orders Module. */
/* Ofi Home Page. */
/**
 * Ofi main module.
 */
/**
 * Ofi report module
 */
import {
    CouponPaymentComponent,
    FundHoldingsComponent,
    ManageOrdersComponent,
    MyDashboardComponent,
    MyOrdersComponent,
    OfiCollectiveArchiveComponent,
    OfiHomeComponent,
    OfiInvestorFundListComponent,
    OfiManageCsvComponent,
    OfiManageOfiNavComponent,
    OfiPnlReportComponent,
    OfiTaxReportComponent
} from '@ofi/ofi-main';
/* UserAdmin Module. */
import {
    AdminPermissionsComponent,
    AdminUsersComponent,
    AdminWalletsComponent,
    AdminWizardComponent,
    ManageSubPortfolioComponent
} from '@setl/core-useradmin';
/* Product */
import {OfiFundComponent, OfiManagementCompanyComponent, OfiSicavComponent} from '@ofi/product';
/* Corporate Actions Components */
import {
    CreateResolutionComponent,
    DistributionComponent,
    IssueResolutionComponent,
    MergerAbsorptionComponent,
    SplitComponent
} from '@setl/core-corp-actions';
import { WorkflowEngineComponent } from '@setl/core-wfe';
/**
 * Asset serving module
 */
import {
    IssueAssetComponent,
    RegisterAssetComponent,
    RegisterIssuerComponent,
    RequestAssetComponent,
    SendAssetComponent
} from '@setl/asset-servicing';
/**
 * Manage member module.
 */
import {ManageAccountComponent, ManageChainMembershipComponent, ManageMemberComponent} from '@setl/core-manage-member';
import {SetlMessagesComponent} from '@setl/core-messages';
import {SetlBalancesComponent, SetlIssueComponent} from '@setl/core-balances';
/** Connection module */
import {ConnectionComponent} from '@setl/core-connections/connections/component';

export const ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'user-administration', redirectTo: 'user-administration/users', pathMatch: 'full' },
    { path: 'connections', redirectTo: 'connections/my-connections', pathMatch: 'full' },
    { path: 'ui-elements', redirectTo: 'ui-elements/form', pathMatch: 'full' },

    /* Blank layout connections */
    {
        path: '', component: BlankLayoutComponent,
        children: [
            {
                path: 'login', component: SetlLoginComponent,
            }
        ]
    },

    /* Basic Layout pages. */
    {
        path: '',
        component: BasicLayoutComponent,
        children: [
            {
                path: 'home',
                component: OfiHomeComponent,
                canActivate: [LoginGuardService]
            },
            {
                path: 'core-home',
                component: HomeComponent,
                canActivate: [LoginGuardService]
            },
            {
                path: 'messages',
                component: SetlMessagesComponent,
                canActivate: [LoginGuardService]
            },
            {
                path: 'account',
                children: [
                    {
                        path: 'my-account',
                        component: SetlMyAccountComponent,
                        canActivate: [LoginGuardService],
                    }
                ]
            },
            {
                path: 'asset-management',
                children: [
                    {
                        path: 'fund-holdings',
                        component: FundHoldingsComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'my-dashboard',
                        component: MyDashboardComponent,
                        canActivate: [LoginGuardService],
                    },
                ]
            },
            {
                path: 'product-module',
                children: [
                    {
                        path: 'fund',
                        component: OfiFundComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'sicav',
                        component: OfiSicavComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'management-company',
                        component: OfiManagementCompanyComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'net-asset-value',
                        component: OfiManageOfiNavComponent,
                        canActivate: [LoginGuardService],
                    }
                ]
            },
            {
                path: 'ui-elements',
                children: [
                    {
                        path: 'form',
                        component: FormElementsComponent,
                        canActivate: [LoginGuardService]
                    },
                ]
            },
            {
                path: 'reports',
                children: [
                    {
                        path: 'balances',
                        component: SetlBalancesComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'issue',
                        component: SetlIssueComponent,
                        canActivate: [LoginGuardService]
                    }
                ]
            },
            {
                path: 'connections',
                children: [
                    {
                        path: 'my-connections',
                        component: ConnectionComponent,
                        canActivate: [LoginGuardService]
                    }
                ]
            },
            {
                path: 'asset-servicing',
                children: [
                    {
                        path: 'register-issuer',
                        component: RegisterIssuerComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'register-asset',
                        component: RegisterAssetComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'issue-asset',
                        component: IssueAssetComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'send-asset',
                        component: SendAssetComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'request-asset',
                        component: RequestAssetComponent,
                        canActivate: [LoginGuardService]
                    }
                ],
                canActivate: [LoginGuardService]
            },
            {
                path: 'user-administration',
                children: [
                    {
                        path: 'users',
                        component: AdminUsersComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'wallets',
                        component: AdminWalletsComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'permissions',
                        component: AdminPermissionsComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'wizard',
                        component: AdminWizardComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'subportfolio',
                        component: ManageSubPortfolioComponent,
                        canActivate: [LoginGuardService]
                    }

                ],
                canActivate: [LoginGuardService]
            },
            {
                path: 'chain-admin',
                children: [
                    {
                        path: 'manage-member',
                        component: ManageMemberComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'manage-groups',
                        component: ManageAccountComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'chain-membership',
                        component: ManageChainMembershipComponent,
                        canActivate: [LoginGuardService]
                    }
                ],
                canActivate: [LoginGuardService]
            },
            {
                path: 'corporate-actions',
                children: [
                    /**
                     * Core corporate actions.
                     */
                    {
                        path: 'create-resolution',
                        component: CreateResolutionComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'issue-resolution',
                        component: IssueResolutionComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'distribution',
                        component: DistributionComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'merger-absorption',
                        component: MergerAbsorptionComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'split',
                        component: SplitComponent,
                        canActivate: [LoginGuardService],
                    },

                    /**
                     * OFI corporate actions.
                     */
                    {
                        path: 'coupon-payment',
                        component: CouponPaymentComponent,
                        canActivate: [LoginGuardService],
                    },
                ]
            },

            /**
             * OFI
             */
            {
                path: 'list-of-funds',
                component: OfiInvestorFundListComponent,
                canActivate: [LoginGuardService]
            },
            {
                path: 'manage-orders',
                component: ManageOrdersComponent,
                canActivate: [LoginGuardService]
            },
            {
                path: 'order-book',
                canActivate: [LoginGuardService],
                children: [
                    {
                        path: 'my-orders',
                        canActivate: [LoginGuardService],
                        component: MyOrdersComponent,
                    }
                ]
            },

            /**
             * Ofi report
             */
            {
                path: 'reports-section',
                canActivate: [LoginGuardService],
                children: [
                    {
                        path: 'tax',
                        canActivate: [LoginGuardService],
                        component: OfiTaxReportComponent
                    },
                    {
                        path: 'pnl',
                        canActivate: [LoginGuardService],
                        component: OfiPnlReportComponent
                    },
                    {
                        path: 'csv',
                        canActivate: [LoginGuardService],
                        component: OfiManageCsvComponent
                    }
                ]
            },
            {
                path: 'am-reports-section',
                canActivate: [LoginGuardService],
                children: [
                    {
                        path: 'collects-archive',
                        canActivate: [LoginGuardService],
                        component: OfiCollectiveArchiveComponent
                    }
                ]
            },
            {
                path: 'workflow-engine',
                canActivate: [LoginGuardService],
                children: [
                    {
                        path: 'manage',
                        canActivate: [LoginGuardService],
                        component: WorkflowEngineComponent
                    }
                ]
            }
        ],
        canActivate: [LoginGuardService]
    }
];
