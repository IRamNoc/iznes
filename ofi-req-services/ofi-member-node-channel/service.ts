/* Core/Angular imports. */
import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
/* Actions. */
import {
    clearrequested,
    clearRequestedFundAccessMy,
    clearRequestedNavFundsList,
    OFI_SET_COUPON_LIST,
    ofiClearRequestedIssuedAssets,
    setamkyclist,
    ofiManageOrderActions,
    FundAccessMyActions,
} from '../../ofi-store';
import { clearRequestedIznesShares } from '../../ofi-store/ofi-product/fund-share-list/actions';
import { ofiNewMandateInvestor } from '../../ofi-store/ofi-mandate-investor';
import {
    clearRequestedPrecentraFundsList,
    clearRequestedPrecentraSharesList,
} from '../../ofi-store/ofi-reports/precentralisation-reports/actions';
import { setInvestorInvitationListReset } from '@ofi/ofi-main/ofi-store/ofi-kyc/invitationsByUserAmCompany';
import { setStatusAuditTrailReset } from '@ofi/ofi-main/ofi-store/ofi-kyc/status-audit-trail';
import { resetHomepage } from '@setl/core-store';
import { ofiClearHolderDetailRequested, ofiClearRequestedAmHolders } from '../../ofi-store/ofi-reports/holders/actions';
import { OfiFundInvestService } from '../ofi-fund-invest/service';
import { OfiManagementCompanyService } from '../ofi-product/management-company/management-company.service';
import { OfiUmbrellaFundService } from '../ofi-product/umbrella-fund/service';
import { OfiFundService } from '../ofi-product/fund/fund.service';
import { OfiFundShareFormService } from '../../ofi-product/fund-share/form/service';
import { LeiService } from '../ofi-product/lei/lei.service';
import { LogService, SagaHelper } from '@setl/utils';
import { MyUserService } from '@setl/core-req-services';
import { SET_SITE_MENU } from '@setl//core-store';
import {
    ofiAddNewPM, ofiPMActive,
    ofiUpdatePmDetail,
    ofiUpdateWmDetail,
} from '../../ofi-store/ofi-portfolio-manager/portfolio-manage-list/actions';

/* Service class. */
@Injectable()
export class OfiMemberNodeChannelService {
    connectedWalletID: number;

    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;

    /* Constructor. */
    constructor(
        private ngRedux: NgRedux<any>,
        private logService: LogService,
        private fundInvestService: OfiFundInvestService,
        private managementCompanyService: OfiManagementCompanyService,
        private umbrellaService: OfiUmbrellaFundService,
        private fundService: OfiFundService,
        private fundShareService: OfiFundShareFormService,
        private myUserService: MyUserService,
        private leiService: LeiService,
    ) {
        this.connectedWallet$
        .subscribe(v => this.connectedWalletID = v);
    }

    /**
     * Resolve Channel Update
     * ----------------------
     * Hanldes a broadcasts aimed at Ofi requests.
     *
     * @param {object} data
     * @return {void}
     */
    resolveChannelUpdate(data: any): void {
        /* Parse the broadcast data. */
        data = JSON.parse(data);

        /* Switch the request. */
        this.logService.log(' |--- Resolving Ofi channel brodcast.');
        this.logService.log(' | name: ', data.Request);
        this.logService.log(' | data: ', data);
        switch (data.Request) {
            /* Coupon requests. */
            case 'newcoupon':
            case 'updatecoupon':
                /* Dispatch the event. */
                this.ngRedux.dispatch(
                    {
                        type: OFI_SET_COUPON_LIST,
                        payload: [null, data, null],
                    },
                );
                break;

            case 'newmanagementcompany':
                this.logService.log(' | Update managment company list: ', data);
                this.managementCompanyService.fetchManagementCompanyList();
                break;

            case 'latestnav':
                this.ngRedux.dispatch(FundAccessMyActions.ofiFundLatestNav(data.Data));
                break;

            case 'validatednav': // Called when a validated NAV is entered
                this.ngRedux.dispatch(ofiManageOrderActions.ofiUpdateOrder({ event: 'validatednav', nav: data.Data }));
                break;

            case 'updatenav': // Update the NAV
                handleUpdateNav(this.ngRedux);
                this.ngRedux.dispatch(ofiManageOrderActions.ofiUpdateOrder({ event: 'updatenav', nav: data.Data }));
                break;

            case 'getfundaccessmy':
                this.ngRedux.dispatch(clearRequestedNavFundsList());
                this.ngRedux.dispatch(clearRequestedFundAccessMy());
                this.fundInvestService.fetchFundAccessMy(this.connectedWalletID);
                break;

            case 'iznesupdateorder':
                this.logService.log(' | got the broadcast order', data);
                this.ngRedux.dispatch(ofiManageOrderActions.ofiUpdateOrder(data.Data));
                this.ngRedux.dispatch(ofiClearRequestedAmHolders());
                this.ngRedux.dispatch(ofiClearHolderDetailRequested());
                this.ngRedux.dispatch(clearRequestedPrecentraFundsList());
                this.ngRedux.dispatch(clearRequestedPrecentraSharesList());
                break;

            case 'updatekyc':
                this.ngRedux.dispatch(clearrequested());
                this.ngRedux.dispatch(setamkyclist());
                this.ngRedux.dispatch(setInvestorInvitationListReset());
                this.ngRedux.dispatch(setStatusAuditTrailReset());
                break;

            case 'kycaccepted': // enable menu
                this.ngRedux.dispatch(resetHomepage());
                this.refetchMenu();
                break;

            case 'iznprekycupdate':
                this.ngRedux.dispatch(setInvestorInvitationListReset());
                break;

                // new umbrella fund created and umbrella fund updated.
                // todo
                // At the moment, this broacast will cause the front-end to request all the umbrella fund
                // when create/update umbrella fund.
                // we should broadcast the changes from the backend. and the front should just handle the new/updated entry
                // to avoid to make another call.
            case 'izncreateumbrellafund':
            case 'iznupdateumbrellafund':
                this.umbrellaService.fetchUmbrellaList();
                this.leiService.fetchLEIs();
                break;

                // new fund created and fund updated.
                // todo
                // At the moment, this broacast will cause the front-end to request all the fund
                // when create/update fund.
                // we should broadcast the changes from the backend. and the front should just handle the new/updated entry
                // to avoid to make another call.
            case 'izncreatefund':
            case 'iznupdatefund':
                this.fundService.fetchFundList();
                this.leiService.fetchLEIs();
                break;

                // new fund share created and fund share updated.
                // todo
                // At the moment, this broacast will cause the front-end to request all the fund share
                // when create/update fund share.
                // we should broadcast the changes from the backend. and the front should just handle the new/updated entry
                // to avoid to make another call.
            case 'iznescreatefundshare':
            case 'iznesupdatefundshare':
                this.ngRedux.dispatch(clearRequestedIznesShares());
                break;

            case 'scsu':
                this.fundShareService.publishStep(data.Data);
                break;

            // handle pm fund access update
            case 'iznupdatepmfundaccess':
                this.ngRedux.dispatch(ofiUpdatePmDetail(data.Data));
                break;

            // handle new pm
            case 'iznesnewpm':
                this.ngRedux.dispatch(ofiAddNewPM(data.Data));
                break;

            // handle new pm
            case 'iznespmactive':
                this.ngRedux.dispatch(ofiPMActive(data.Data));
                break;

            case 'iznesnewmandateinv':
                this.ngRedux.dispatch(ofiNewMandateInvestor(data.Data));
                break;

            case 'mandateinvestoraccess':
                this.ngRedux.dispatch(ofiUpdateWmDetail(data.Data));
                break;
        }
    }

    /**
     * Re-fetch user's menu spec.
     */
    refetchMenu() {
        const asyncTaskPipes = this.myUserService.getSiteMenu(this.ngRedux);
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_SITE_MENU],
            [],
            asyncTaskPipes,
            {},
        ));
    }
}

function handleUpdateNav(ngRedux) {
    ngRedux.dispatch(ofiClearRequestedIssuedAssets());
}
