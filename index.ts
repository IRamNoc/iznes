export {OfiFundInvestModule} from './ofi-fund-invest/module';
export {OfiInvestorFundListComponent} from './ofi-fund-invest/investor-fund-list/component';

/**
 * Services
 */
export {OfiFundInvestService} from './ofi-req-services/ofi-fund-invest/service';
export {OfiMemberNodeChannelService} from './ofi-req-services/ofi-member-node-channel/service';
export {OfiRequestServicesModule, ArrangementType} from './ofi-req-services/module';
export {OfiPostTxService} from './ofi-post-tx/service';

/**
 * Store
 */
export {
    OfiReducer,
    OfiState
} from './ofi-store';


/**
 * Corporate Actions
 */
export {OfiCorpActionsModule} from './ofi-corp-actions/ofi-corp-actions.module';
export {OfiCorpActionService} from './ofi-req-services/ofi-corp-actions/service';
export {CouponPaymentComponent} from './ofi-corp-actions/coupon-payment/coupon-payment.component';

/**
 * Corporate Actions
 */
export {OfiOrdersModule} from './ofi-orders/ofi-orders.module';
export {OfiOrdersService} from './ofi-req-services/ofi-orders/service';
export {ManageOrdersComponent} from './ofi-orders/manage-orders/manage-orders.component';
export {MyOrdersComponent} from './ofi-orders/my-orders/my-orders.component';

/**
 * Ofi main module
 */
export {OfiMainModule} from './module';
