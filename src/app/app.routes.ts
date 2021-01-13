import { Routes } from '@angular/router';
/* Layouts. */
import { BasicLayoutComponent, BlankLayoutComponent, HomeComponent } from '@setl/core-layout';

/* Components. */
import { SetlMyAccountComponent } from '@setl/core-account';
/**
 * Login Guard service
 */
import { LoginGuardService } from '@setl/core-login';
/**
 * Ofi main module.
 */
import {
    ShareHoldersComponent,
    ManageOrdersComponent,
    OfiAmDocumentsComponent,
    CentralisationReportComponent,
    PrecentralisationReportComponent,
    OfiDocumentsComponent,
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
    OfiProfileMyInformationsComponent,
    OfiSignUpComponent,
    ProductConfigurationComponent,
    ProductSetupComponent,
    OfiInvMyDocumentsComponent,
    OfiRedirectTokenComponent,
    MyHoldingsComponent,
    OfiSubPortfolioComponent,
    OfiClientReferentialComponent,
    UmbrellaAuditComponent,
    FundAuditComponent,
    OfiInviteMandateInvestorsComponent,
    OfiManagementCompanyComponent,
    ManageTransfersComponent,
    CreateTransferComponent,
} from '@ofi/ofi-main';

import { requestsRoute } from '@ofi/ofi-main/ofi-kyc/my-requests/requests-route.config';

/* UserAdmin Module. */
import {
    AdminPermissionsComponent,
    AdminUsersComponent,
    AdminWalletsComponent,
} from '@setl/core-useradmin';
/* Account Admin Module. */
import {
    UsersAuditComponent,
    UsersCreateUpdateComponent,
    UsersListComponent,
    UserTeamsAuditComponent,
    UserTeamsCreateUpdateComponent,
    UserTeamsListComponent,
    AccountSignUpComponent,
    AccountSignUpRedirectComponent,
} from '@setl/core-account-admin';
import {
    ProductHomeComponent,
    UmbrellaFundComponent,
    FundShareComponent,
    AddNewFundShareComponent,
    FundShareAuditComponent,
    FundComponent,
    ProductCharacteristicComponent,
} from '@ofi/ofi-main';
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
import { SetlLoginComponent, SetlLogoutComponent, SignupComponent, LoginSSOEngieComponent } from '@setl/core-login';

/* Portfolio manager */
import {
    PortfolioManagerListComponent,
    PortfolioManagerDetailComponent,
    PortfolioManagerInviteComponent,
} from '@ofi/ofi-main/ofi-portfolio-manager';

export const ROUTES: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'sso-engie', component: LoginSSOEngieComponent, pathMatch: 'full' },
    { path: 'user-administration', redirectTo: 'user-administration/users', pathMatch: 'full' },
    { path: 'connections', redirectTo: 'connections/my-connections', pathMatch: 'full' },
    { path: 'ui-elements', redirectTo: 'ui-elements/form', pathMatch: 'full' },
    /* Blank layout connections */
    {
        path: '',
        component: BlankLayoutComponent,
        children: [
            {
                path: 'login',
                component: SetlLoginComponent,
            },
            {
                path: 'logout',
                component: SetlLogoutComponent,
            },
            {
                path: 'reset/:token',
                component: SetlLoginComponent,
            },
            {
                path: 'reset-two-factor/:twofactortoken',
                component: SetlLoginComponent,
            },
        ],
    },
    {
        path: 'redirect/:lang/:invitationToken',
        component: OfiRedirectTokenComponent,
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
    {
        path: 'account-signup',
        component: AccountSignUpComponent,
    },
    {
        path: 'account-signup-redirect/:invitationToken',
        component: AccountSignUpRedirectComponent,
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
                path: 'home/product-characteristic/:isin',
                component: ProductCharacteristicComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'home/fund-share/:shareId',
                component: FundShareComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'core-home',
                component: HomeComponent,
                canActivate: [LoginGuardService],
                data: { state: 'home' },
            },
            {
                path: 'client-referential',
                component: OfiClientReferentialComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'client-referential/invite-investors',
                component: OfiInviteInvestorsComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'client-referential/invite-mandate-investors',
                component: OfiInviteMandateInvestorsComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'client-referential/:kycId',
                component: OfiClientReferentialComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'portfolio-manager',
                component: PortfolioManagerListComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'portfolio-manager/invite',
                component: PortfolioManagerInviteComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'portfolio-manager/:pmId',
                component: PortfolioManagerDetailComponent,
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
                path: 'product-module',
                children: [
                    {
                        path: 'product',
                        component: ProductHomeComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/umbrella-fund/new',
                        component: UmbrellaFundComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/umbrella-fund/:id',
                        component: UmbrellaFundComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/fund/new',
                        component: FundComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/fund/:id',
                        component: FundComponent,
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
                        path: 'product/umbrella-fund/:umbrellaID/audit',
                        component: UmbrellaAuditComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/fund/:fundID/audit',
                        component: FundAuditComponent,
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
                        path: 'net-asset-value',
                        component: OfiNavFundsList,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'net-asset-value/fund-view',
                        component: OfiNavFundView,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'net-asset-value/fund-view/:shareId/audit',
                        component: OfiNavAuditComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'configuration',
                        component: ProductConfigurationComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'setup',
                        component: ProductSetupComponent,
                        canActivate: [LoginGuardService],
                    },
                ],
            },
            {
                path: 'admin-product-module',
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
                        path: 'product/fund/:id',
                        component: FundComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/fund-share/:shareId/audit',
                        component: FundShareAuditComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/umbrella-fund/:umbrellaID/audit',
                        component: UmbrellaAuditComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'product/fund/:fundID/audit',
                        component: FundAuditComponent,
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
                ],
            },
            {
                path: 'net-asset-value',
                component: OfiNavFundsList,
                canActivate: [LoginGuardService],
            },
            {
                path: 'net-asset-value/fund-view',
                component: OfiNavFundView,
                canActivate: [LoginGuardService],
            },
            {
                path: 'net-asset-value/fund-view/:shareId/audit',
                component: OfiNavAuditComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'management-company',
                component: OfiManagementCompanyComponent,
                canActivate: [LoginGuardService],
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
                        component: ShareHoldersComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'holders-list/funds/:tabid',
                        component: ShareHoldersComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'holders-list/shares/:tabid',
                        component: ShareHoldersComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'precentralisation',
                        component: PrecentralisationReportComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'precentralisation/funds',
                        component: PrecentralisationReportComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'precentralisation/shares',
                        component: PrecentralisationReportComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'centralisation',
                        component: CentralisationReportComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'centralisation/funds',
                        component: CentralisationReportComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'centralisation/shares',
                        component: CentralisationReportComponent,
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
                        path: 'subportfolio',
                        component: OfiSubPortfolioComponent,
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

            /**
             * OFI
             */
            {
                path: 'list-of-funds/:tabid',
                component: OfiInvestorFundListComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'list-of-funds/0/product-characteristic/:isin',
                component: ProductCharacteristicComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'list-of-funds/0/fund-share/:shareId',
                component: FundShareComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'manage-orders',
                component: ManageOrdersComponent,
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
                        path: 'my-orders',
                        canActivate: [LoginGuardService],
                        component: ManageOrdersComponent,
                    },
                    {
                        path: 'my-orders/product-characteristic/:isin',
                        component: ProductCharacteristicComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'my-orders/fund-share/:shareId',
                        component: FundShareComponent,
                        canActivate: [LoginGuardService],
                    },
                    {
                        path: 'my-orders/:tabid',
                        canActivate: [LoginGuardService],
                        component: ManageOrdersComponent,
                    },
                ],
            },
            {
                path: 'transfer-in-out',
                canActivate: [LoginGuardService],
                children:
                [
                    {
                        path: '',
                        component: ManageTransfersComponent,
                    },
                    {
                        path: 'create',
                        component: CreateTransferComponent,
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
                        path: 'csv',
                        canActivate: [LoginGuardService],
                        component: OfiManageCsvComponent,
                    },
                ],
            },
            {
                path: 'on-boarding',
                canActivate: [LoginGuardService],
                children: [
                    {
                        path: 'management',
                        component: OfiAmDocumentsComponent,
                    },
                    {
                        path: 'management/:kycId',
                        component: OfiWaitingApprovalComponent,
                    },
                ],
            },
            {
                path: 'onboarding-requests',
                children: requestsRoute,
            },
            {
                path: 'onboarding-requests/list/kyc-audit-trail/:kycID',
                component: KycAuditTrailComponent,
                canActivate: [LoginGuardService],
            },
            {
                path: 'client-file',
                canActivate: [LoginGuardService],

                children: [
                    {
                        path: 'management',
                        component: OfiAmDocumentsComponent,
                    },
                    {
                        path: 'management/:kycId',
                        component: OfiWaitingApprovalComponent,
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
