export {OfiFundInvestModule} from './ofi-fund-invest/module';
export {OfiInvestorFundListComponent} from './ofi-fund-invest/investor-fund-list/component';

/**
 * Home
 */
export {OfiHomeComponent} from './ofi-home/home/component';
/**
 * Invite Investors
 */
export {OfiInviteInvestorsComponent} from './ofi-kyc/invite-investors/component';
export {OfiSignUpComponent} from './ofi-kyc/signup/component';
export {OfiDocumentsComponent} from './ofi-kyc/documents/component';
export {OfiAmDocumentsComponent} from './ofi-kyc/am-documents/component';
export {OfiKycHomeComponent} from './ofi-kyc/home/component';
export {OfiFundAccessComponent} from './ofi-kyc/fund-access/component';
export {OfiKycAlreadyDoneComponent} from './ofi-kyc/already-done/component';
/**
 * My informations
 */
export {OfiMyInformationsComponent} from './ofi-my-informations/my-informations/component';
/**
 * Products
 */
export {ProductHomeComponent} from './ofi-product/home/component';
export {UmbrellaFundComponent} from './ofi-product/umbrella-fund/component';
export {FundShareComponent} from './ofi-product/fund-share/form/component';
export {AddNewFundShareComponent} from './ofi-product/fund-share/add-new/component';
export {FundComponent} from './ofi-product/fund/component';
/**
 * Nav
 */
export {OfiNavModule} from './ofi-nav/module';
export {OfiNavFundsList} from './ofi-nav/ofi-nav-funds-list/component';
export {OfiNavFundView} from './ofi-nav/ofi-nav-fund-view/component';
export {OfiManageNavPopup} from './ofi-nav/ofi-manage-nav-popup/component';

/**
 * Waiting for approval
 */
export {OfiWaitingApprovalComponent} from './ofi-kyc/waiting-approval/component';

/**
 * Services
 */
export {OfiFundInvestService} from './ofi-req-services/ofi-fund-invest/service';
export {OfiMemberNodeChannelService} from './ofi-req-services/ofi-member-node-channel/service';
export {OfiRequestServicesModule, ArrangementType} from './ofi-req-services/module';
export {OfiPostTxService} from './ofi-post-tx/service';
export {OfiWalletnodeChannelService} from './ofi-req-services/ofi-walletnode-channel/service';

/**
 * Store
 */
export {
    OfiReducer,
    OfiState,
    OfiFundShare
} from './ofi-store';


/**
 * Corporate Actions
 */
export {OfiCorpActionsModule} from './ofi-corp-actions/ofi-corp-actions.module';
export {OfiCorpActionService} from './ofi-req-services/ofi-corp-actions/service';
export {CouponPaymentComponent} from './ofi-corp-actions/coupon-payment/coupon-payment.component';

/**
 * Orders
 */
export {OfiOrdersModule} from './ofi-orders/ofi-orders.module';
export {OfiOrdersService} from './ofi-req-services/ofi-orders/service';
export {ManageOrdersComponent} from './ofi-orders/manage-orders/manage-orders.component';
export {MyOrdersComponent} from './ofi-orders/my-orders/my-orders.component';
export {PlaceOrdersComponent} from './ofi-orders/place-orders/place-orders.component';

/**
 *
 */
export {OfiAmDashboardModule} from './ofi-am-dashboard/module';
export {OfiAmDashboardService} from './ofi-req-services/ofi-am-dashboard/service';
export {FundHoldingsComponent} from './ofi-am-dashboard/fund-holdings/component';
export {MyDashboardComponent} from './ofi-am-dashboard/my-dashboard/component';
export {ShareHoldersComponent} from './ofi-am-dashboard/share-holders/component';

/**
 * Report module
 */
export {
    OfiPnlReportComponent,
    OfiTaxReportComponent,
    OfiCollectiveArchiveComponent,
    OfiReportModule,
    OfiManageCsvComponent
} from './ofi-report-module';

/*
 * Profile module
 */
export {
    OfiProfileMyInformationsComponent,
} from './ofi-profile/profile-my-informations/component';


/**
 * Ofi main module
 */
export {OfiMainModule} from './module';
