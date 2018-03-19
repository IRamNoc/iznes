import {Routes} from '@angular/router';
/* Layouts. */
import {BasicLayoutComponent, BlankLayoutComponent, FormElementsComponent, HomeComponent} from '@setl/core-layout';
/* Components. */
import {SetlMyAccountComponent} from '@setl/core-account';
import {SetlDemoDatagridComponent} from '@setl/demo';
/**
 * Login Guard service
 */
import {LoginGuardService} from '@setl/core-login';
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
    OfiAmDocumentsComponent,
    OfiCollectiveArchiveComponent,
    OfiDocumentsComponent,
    OfiFundAccessComponent,
    OfiHomeComponent,
    OfiInvestorFundListComponent,
    OfiInviteInvestorsComponent,
    OfiKycAlreadyDoneComponent,
    OfiKycHomeComponent,
    OfiManageCsvComponent,
    OfiNavFundsList,
    OfiNavFundView,
    OfiPnlReportComponent,
    OfiProfileMyInformationsComponent,
    OfiSignUpComponent,
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
import {ProductHomeComponent, UmbrellaFundComponent, FundCreateComponent} from '@ofi/ofi-main';
/* Corporate Actions Components */
import {
    CreateResolutionComponent,
    DistributionComponent,
    IssueResolutionComponent,
    MergerAbsorptionComponent,
    SplitComponent
} from '@setl/core-corp-actions';
import {WorkflowEngineDividendComponent, WorkflowEngineEditorComponent} from '@setl/core-wfe';
/**
 * Asset serving module
 */
import {
    EncumberAssetsComponent,
    IssueAssetComponent,
    RegisterAssetComponent,
    RegisterIssuerComponent,
    RequestAssetComponent,
    SendAssetComponent,
} from '@setl/asset-servicing';
/**
 * Manage member module.
 */
import {
    ManageAccountComponent,
    ManageChainMembershipComponent,
    ManageChainsComponent,
    ManageMemberComponent,
    ManageWalletNodesComponent,
} from '@setl/core-manage-member';
import {SetlBalancesComponent, SetlIssueComponent, SetlTransactionsComponent} from '@setl/core-balances';
/** Connection module */
import {ConnectionComponent} from '@setl/core-connections/connections/component';
/**
 * T2S Module.
 */
import {T2sMessagesComponent} from '@setl/core-t2s';
import {SetlMessagesComponent} from '@setl/core-messages';
import {OfiWaitingApprovalComponent} from '@ofi/ofi-main/ofi-kyc/waiting-approval/component';

export const ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'user-administration', redirectTo: 'user-administration/users', pathMatch: 'full' },
    { path: 'connections', redirectTo: 'connections/my-connections', pathMatch: 'full' },
    { path: 'ui-elements', redirectTo: 'ui-elements/form', pathMatch: 'full' },
    /* Blank layout connections */
    {
        path: '',
        component: BlankLayoutComponent,
        loadChildren: '@setl/core-login/login.module#SetlLoginModule',
    },
    {
        path: 'signup',
        component: BlankLayoutComponent,
        children: [
            {
                path: ':invitationToken',
                component: OfiSignUpComponent,
            },
        ],
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
                canActivate: [LoginGuardService],
                data: { state: 'home' }
            },
            {
                path: 'invite-investors',
                component: OfiInviteInvestorsComponent,
                canActivate: [LoginGuardService],
            },
            {

                path: 'messages/:category',
                component: SetlMessagesComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'messages',
                redirectTo: '/messages/inbox'
            },
            {
                path: 'account',
                children: [
                    {
                        path: 'my-account/:tabname',
                        component: SetlMyAccountComponent,
                        canActivate: [LoginGuardService],
                        data: { state: 'my-account' }
                    }
                ]
            },
            {
                path: 'kyc',
                component: OfiDocumentsComponent,
                canActivate: [LoginGuardService]
            },
            {
                path: 'fund-access/:kycId',
                component: OfiFundAccessComponent,
                canActivate: [LoginGuardService]
            },
            {
                path: 'kyc-am-documents',
                component: OfiAmDocumentsComponent,
                canActivate: [LoginGuardService]
            },
            {
                path: 'new-investor',
                children: [
                    {
                        path: 'informations',
                        component: OfiKycHomeComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'already-done/:status',
                        component: OfiKycAlreadyDoneComponent,
                        canActivate: [LoginGuardService]
                    }
                ],
            },
            {
                path: 'profile',
                children: [
                    {
                        path: 'my-informations',
                        component: OfiProfileMyInformationsComponent,
                        canActivate: [LoginGuardService],
                    },
                ],
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
                        path: 'home',
                        component: ProductHomeComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'umbrella-fund/:id',
                        component: UmbrellaFundComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'fund/create',
                        component: FundCreateComponent,
                        canActivate: [LoginGuardService],
                    },
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
                        component: OfiNavFundsList,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'nav-fund-view',
                        component: OfiNavFundView,
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
                        canActivate: [LoginGuardService],
                        data: { state: 'reports-my-account' }
                    },
                    {
                        path: 'issue',
                        component: SetlIssueComponent,
                        canActivate: [LoginGuardService],
                        data: { state: 'reports-issue' }
                    },
                    {
                        path: 'transactions',
                        component: SetlTransactionsComponent,
                        canActivate: [LoginGuardService],
                        data: { state: 'reports-transactions' }
                    },
                ],
                data: { state: 'reports' }
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
                path: 'financing',
                children: [
                    {
                        path: 'encumber-assets',
                        component: EncumberAssetsComponent,
                        canActivate: [LoginGuardService]
                    },
                ],
                canActivate: [LoginGuardService]
            },
            {
                path: 'user-administration',
                children: [
                    {
                        path: 'users/:tabid',
                        component: AdminUsersComponent,
                        canActivate: [LoginGuardService],
                        data: { state: 'admin-users' }
                    },
                    {
                        path: 'wallets/:walletid',
                        component: AdminWalletsComponent,
                        canActivate: [LoginGuardService],
                        data: { state: 'admin-wallets' }
                    },
                    {
                        path: 'permissions/:permissionid',
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
                    },
                    {
                        path: 'manage-chains',
                        component: ManageChainsComponent,
                        canActivate: [LoginGuardService]
                    },
                    {
                        path: 'manage-wallet-nodes',
                        component: ManageWalletNodesComponent,
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
                        path: 'coupon-payment/:tabid',
                        component: CouponPaymentComponent,
                        canActivate: [LoginGuardService],
                    },
                ]
            },

            /**
             * OFI
             */
            {
                path: 'list-of-funds/:tabid',
                component: OfiInvestorFundListComponent,
                canActivate: [LoginGuardService]
            },
            {
                path: 'manage-orders/:tabid',
                component: ManageOrdersComponent,
                canActivate: [LoginGuardService]
            },
            {
                path: 'order-book',
                canActivate: [LoginGuardService],
                children: [
                    {
                        path: 'my-orders/:tabid',
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
                        path: 'dividend',
                        canActivate: [LoginGuardService],
                        component: WorkflowEngineDividendComponent
                    },
                    {
                        path: 'editor',
                        canActivate: [LoginGuardService],
                        component: WorkflowEngineEditorComponent
                    }
                ]
            },
            {
                path: 't2s',
                canActivate: [LoginGuardService],
                children: [
                    {
                        path: 'messages',
                        canActivate: [LoginGuardService],
                        component: T2sMessagesComponent
                    }
                ]
            },
            {
                path: 'kyc-documents',
                canActivate: [LoginGuardService],
                children: [
                    {
                        path: 'client/:kycId',
                        component: OfiWaitingApprovalComponent,
                    }
                ]
            },
            {
                path: 'demo',
                children: [
                    {
                        path: 'datagrid',
                        component: SetlDemoDatagridComponent,
                        canActivate: [LoginGuardService],
                    }
                ]
            },
        ],
        canActivate: [LoginGuardService]
    }
];
