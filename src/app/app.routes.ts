import { Routes } from '@angular/router';
/* Layouts. */
import { BasicLayoutComponent, BlankLayoutComponent, FormElementsComponent, HomeComponent } from '@setl/core-layout';
import {
    UiTranslationsComponent,
    UiTooltipsComponent,
    UiFormStepsComponent,
    UiFormPercentComponent,
} from '@setl/core-layout';
/* Components. */
import { SetlMyAccountComponent } from '@setl/core-account';
/**
 * Login Guard service
 */
import { LoginGuardService } from '@setl/core-login';
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
    ShareHoldersComponent,
    ManageOrdersComponent,
    MyDashboardComponent,
    MyOrdersComponent,
    OfiAmDocumentsComponent,
    OfiCollectiveArchiveComponent,
    CentralizationReportComponent,
    CentralizationSelectComponent,
    OfiCentralizationHistoryComponent,
    OfiDocumentsComponent,
    OfiFundAccessComponent,
    OfiHomeComponent,
    OfiInvestorFundListComponent,
    OfiInviteInvestorsComponent,
    OfiKycAlreadyDoneComponent,
    OfiKycHomeComponent,
    KycAuditTrailComponent,
    OfiManageCsvComponent,
    OfiNavFundsList,
    OfiNavFundView,
    OfiNavAuditComponent,
    OfiPnlReportComponent,
    OfiProfileMyInformationsComponent,
    OfiSignUpComponent,
    OfiTaxReportComponent,
    ProductConfigurationComponent,
    OfiInvMyDocumentsComponent,
    OfiRedirectTokenComponent,
    OfiConsumeTokenComponent,
    MyRequestsComponent,
    NewKycRequestComponent,
    MyRequestsContainerComponent,
    MyHoldingsComponent,
} from '@ofi/ofi-main';
/* UserAdmin Module. */
import {
    AdminPermissionsComponent,
    AdminUsersComponent,
    AdminWalletsComponent,
    AdminWizardComponent,
    ManageSubPortfolioComponent,
} from '@setl/core-useradmin';
/* Account Admin Module. */
import {
    UsersAuditComponent,
    UsersCreateUpdateComponent,
    UsersListComponent,
    UserTeamsAuditComponent,
    UserTeamsCreateUpdateComponent,
    UserTeamsListComponent,
} from '@setl/core-account-admin';
/* Product */
import {
    OfiFundComponent,
    OfiManagementCompanyComponent,
    OfiSicavComponent,
} from '@ofi/product';
import {
    ProductHomeComponent,
    UmbrellaFundComponent,
    FundShareComponent,
    AddNewFundShareComponent,
    FundShareAuditComponent,
    FundComponent,
    ProductCharacteristicComponent,
} from '@ofi/ofi-main';
/* Corporate Actions Components */
import {
    CreateResolutionComponent,
    DistributionComponent,
    IssueResolutionComponent,
    MergerAbsorptionComponent,
    SplitComponent,
} from '@setl/core-corp-actions';
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
import { SetlBalancesComponent, SetlIssueComponent, SetlTransactionsComponent } from '@setl/core-balances';
/** Connection module */
import { ConnectionComponent } from '@setl/core-connections/connections/component';
import { SetlMessagesComponent } from '@setl/core-messages';
import { OfiWaitingApprovalComponent } from '@ofi/ofi-main/ofi-kyc/waiting-approval/component';

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
        path: 'redirect/:lang/:invitationToken',
        component: OfiRedirectTokenComponent,
    },
    {
        path: 'consume',
        component: OfiConsumeTokenComponent,
    },
    {
        path: 'signup',
        component: BlankLayoutComponent,
        children: [
            {
                path: '',
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
                canActivate: [LoginGuardService],
            },
            {
                path: 'core-home',
                component: HomeComponent,
                canActivate: [LoginGuardService],
                data: { state: 'home' },
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
                redirectTo: '/messages/inbox',
            },
            {
                path: 'account',
                children: [
                    {
                        path: 'my-account/:tabname',
                        component: SetlMyAccountComponent,
                        canActivate: [LoginGuardService],
                        data: { state: 'my-account' },
                    },
                ],
            },
            {
                path: 'my-asset-managers',
                children: [
                    {
                        path: 'my-documents',
                        component: OfiInvMyDocumentsComponent,
                        canActivate: [LoginGuardService],
                    },
                ],
            },
            {
                path: 'kyc',
                component: OfiDocumentsComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'fund-access/:kycId',
                component: OfiFundAccessComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'kyc-am-documents',
                component: OfiAmDocumentsComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'kyc-audit-trail/:kycID',
                component: KycAuditTrailComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'new-investor',
                children: [
                    {
                        path: 'informations',
                        component: OfiKycHomeComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'already-done/:status',
                        component: OfiKycAlreadyDoneComponent,
                        canActivate: [LoginGuardService],
                    },
                ],
            },
            {
                path: 'profile',
                children: [
                    {
                        path: 'my-information',
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
                ],
            },
            {
                path: 'product-module',
                children: [
                    {
                        path: 'product',
                        component: ProductHomeComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/umbrella-fund/:id',
                        component: UmbrellaFundComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/fund-share/new',
                        component: AddNewFundShareComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/fund-share/:shareId/audit',
                        component: FundShareAuditComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/fund-share/:shareId',
                        component: FundShareComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/fund-share',
                        component: FundShareComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/fund/:id',
                        component: FundComponent,
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
                        path: 'net-asset-value',
                        component: OfiNavFundsList,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'nav-fund-view/:shareId/audit',
                        component: OfiNavAuditComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'nav-fund-view',
                        component: OfiNavFundView,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'configuration',
                        component: ProductConfigurationComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product-characteristic/:isin',
                        component: ProductCharacteristicComponent,
                        canActivate: [LoginGuardService],
                    },
                ],
            },
            {
                path: 'management-company',
                component: OfiManagementCompanyComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'ui-elements',
                children: [
                    {
                        path: 'form',
                        component: FormElementsComponent,
                        canActivate: [LoginGuardService],
                    },
                ],
            },
            {
                path: 'ui-layouts',
                children: [
                    {
                        path: 'translations',
                        component: UiTranslationsComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'tooltips',
                        component: UiTooltipsComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'formsteps',
                        component: UiFormStepsComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'formpercent',
                        component: UiFormPercentComponent,
                        canActivate: [LoginGuardService],
                    },
                ],
            },
            {
                path: 'reports',
                children: [
                    {
                        path: 'balances',
                        component: SetlBalancesComponent,
                        canActivate: [LoginGuardService],
                        data: { state: 'reports-my-account' },
                    },
                    {
                        path: 'issue',
                        component: SetlIssueComponent,
                        canActivate: [LoginGuardService],
                        data: { state: 'reports-issue' },
                    },
                    {
                        path: 'transactions',
                        component: SetlTransactionsComponent,
                        canActivate: [LoginGuardService],
                        data: { state: 'reports-transactions' },
                    },
                    {
                        path: 'holders-list',
                        children: [
                            {
                                path: 'funds/:tabid',
                                component: ShareHoldersComponent,
                                canActivate: [LoginGuardService],
                            },
                            {
                                path: 'shares/:tabid',
                                component: ShareHoldersComponent,
                                canActivate: [LoginGuardService],
                            },
                        ],
                    },
                    {
                        path: 'centralization',
                        component: CentralizationReportComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'select-centralization',
                        component: CentralizationSelectComponent,
                        canActivate: [LoginGuardService],
                    },
                ],
                data: { state: 'reports' },
            },
            {
                path: 'connections',
                children: [
                    {
                        path: 'my-connections',
                        component: ConnectionComponent,
                        canActivate: [LoginGuardService],
                    },
                ],
            },
            {
                path: 'asset-servicing',
                children: [
                    {
                        path: 'register-issuer',
                        component: RegisterIssuerComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'register-asset',
                        component: RegisterAssetComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'issue-asset',
                        component: IssueAssetComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'send-asset',
                        component: SendAssetComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'request-asset',
                        component: RequestAssetComponent,
                        canActivate: [LoginGuardService],
                    },
                ],
                canActivate: [LoginGuardService],
            },
            {
                path: 'financing',
                children: [
                    {
                        path: 'encumber-assets',
                        component: EncumberAssetsComponent,
                        canActivate: [LoginGuardService],
                    },
                ],
                canActivate: [LoginGuardService],
            },
            {
                path: 'user-administration',
                children: [
                    {
                        path: 'users/:tabid',
                        component: AdminUsersComponent,
                        canActivate: [LoginGuardService],
                        data: { state: 'admin-users' },
                    },
                    {
                        path: 'wallets/:walletid',
                        component: AdminWalletsComponent,
                        canActivate: [LoginGuardService],
                        data: { state: 'admin-wallets' },
                    },
                    {
                        path: 'permissions/:permissionid',
                        component: AdminPermissionsComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'wizard',
                        component: AdminWizardComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'subportfolio',
                        component: ManageSubPortfolioComponent,
                        canActivate: [LoginGuardService],
                    },

                ],
                canActivate: [LoginGuardService],
            },
            {
                path: 'chain-admin',
                children: [
                    {
                        path: 'manage-member',
                        component: ManageMemberComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'manage-groups',
                        component: ManageAccountComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'chain-membership',
                        component: ManageChainMembershipComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'manage-chains',
                        component: ManageChainsComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'manage-wallet-nodes',
                        component: ManageWalletNodesComponent,
                        canActivate: [LoginGuardService],
                    },
                ],
                canActivate: [LoginGuardService],
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
                ],
            },

            /**
             * OFI
             */
            {
                path: 'list-of-funds/:tabid',
                component: OfiInvestorFundListComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'manage-orders/:tabid',
                component: ManageOrdersComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'order-book',
                canActivate: [LoginGuardService],
                children: [
                    {
                        path: 'my-orders/:tabid',
                        canActivate: [LoginGuardService],
                        component: ManageOrdersComponent,
                    },
                ],
            },
            {
                path: 'my-holdings',
                component: MyHoldingsComponent,
                canActivate: [LoginGuardService],
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
                        component: OfiTaxReportComponent,
                    },
                    {
                        path: 'pnl',
                        canActivate: [LoginGuardService],
                        component: OfiPnlReportComponent,
                    },
                    {
                        path: 'csv',
                        canActivate: [LoginGuardService],
                        component: OfiManageCsvComponent,
                    },
                ],
            },
            {
                path: 'am-reports-section',
                canActivate: [LoginGuardService],
                children: [
                    {
                        path: 'collects-archive',
                        canActivate: [LoginGuardService],
                        component: OfiCollectiveArchiveComponent,
                    },
                    {
                        path: 'centralization-history/:tabid',
                        canActivate: [LoginGuardService],
                        component: OfiCentralizationHistoryComponent,
                    },
                ],
            },
            {
                path: 'kyc-documents',
                canActivate: [LoginGuardService],
                children: [
                    {
                        path: 'client/:kycId',
                        component: OfiWaitingApprovalComponent,
                    },
                ],
            },
            {
                path: 'my-requests',
                canActivate: [LoginGuardService],
                component: MyRequestsContainerComponent,
                children: [
                    {
                        path: 'list',
                        component: MyRequestsComponent,
                    },
                    {
                        path: 'new',
                        component: NewKycRequestComponent,
                    },
                ],
            },
            {
                path: 'account-admin',
                canActivate: [LoginGuardService],
                children: [
                    {
                        path: 'users',
                        canActivate: [LoginGuardService],
                        component: UsersListComponent,
                    },
                    {
                        path: 'users/audit',
                        canActivate: [LoginGuardService],
                        component: UsersAuditComponent,
                    },
                    {
                        path: 'users/new',
                        canActivate: [LoginGuardService],
                        component: UsersCreateUpdateComponent,
                    },
                    {
                        path: 'users/:id',
                        canActivate: [LoginGuardService],
                        component: UsersCreateUpdateComponent,
                    },
                    {
                        path: 'teams',
                        canActivate: [LoginGuardService],
                        component: UserTeamsListComponent,
                    },
                    {
                        path: 'teams/audit',
                        canActivate: [LoginGuardService],
                        component: UserTeamsAuditComponent,
                    },
                    {
                        path: 'teams/new',
                        canActivate: [LoginGuardService],
                        component: UserTeamsCreateUpdateComponent,
                    },
                    {
                        path: 'teams/:id',
                        canActivate: [LoginGuardService],
                        component: UserTeamsCreateUpdateComponent,
                    },
                ],
            },
        ],
        canActivate: [LoginGuardService],
    },
];
