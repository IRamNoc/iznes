import { Injectable } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { combineLatest, Subscription, Subject } from 'rxjs';
import {
    SET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED,
    resetSubPortfolioBankingDetailsRequested,
    SET_SUB_PORTFOLIO_BANKING_DETAILS_LIST,
} from '@ofi/ofi-main/ofi-store';
import { clearRequestedWalletLabel } from '@setl/core-store';
import * as SagaHelper from '@setl/utils/sagaHelper';
import { OfiSubPortfolioReqService } from '@ofi/ofi-main/ofi-req-services/ofi-sub-portfolio/service';
import { WalletNodeRequestService, MyWalletsService } from '@setl/core-req-services';

@Injectable()
export class OfiSubPortfolioService {

    public subPortfolioList: any[] = [];
    private subscriptions: Array<Subscription> = [];
    public connectedWalletId: number = 0;
    subPortfolioListOb: Subject<any> = new Subject;

    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb;
    @select(['wallet', 'myWalletAddress', 'addressList']) addressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedAddressListOb;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedLabelListOb;
    @select(['ofi', 'ofiSubPortfolio', 'bankingDetails']) subPortfolioBankingDetailsOb;
    @select(['ofi', 'ofiSubPortfolio', 'requested']) subPortfolioRequestedOb;

    constructor(
        private ngRedux: NgRedux<any>,
        private walletNodeRequestService: WalletNodeRequestService,
        private myWalletsService: MyWalletsService,
        private ofiSubPortfolioReqService: OfiSubPortfolioReqService,
    ) {
        this.subscriptions.push(this.connectedWalletOb.subscribe((connected: number) => {
            if (this.connectedWalletId !== 0) {
                this.connectedWalletId = connected;
                this.resetRequestedFlags();
            } else {
                this.connectedWalletId = connected;
            }
        }));

        this.subscriptions.push(this.subPortfolioRequestedOb.subscribe((requested) => {
            this.requestBankingDetails(requested);
        }));

        combineLatest(this.addressListOb, this.subPortfolioBankingDetailsOb)
        .subscribe(([addressList, bankingDetails]) => {
            console.log('+++ bankingDetails', bankingDetails);
            this.subPortfolioList = [];
            Object.keys(addressList).forEach((subPortfolio) => {
                this.subPortfolioList.push(Object.assign({}, addressList[subPortfolio], bankingDetails[subPortfolio]));
            });
            this.updateSubPortfolioObservable();
        });
    }

    public resetRequestedFlags() {
        this.ngRedux.dispatch(resetSubPortfolioBankingDetailsRequested());
        this.ngRedux.dispatch(clearRequestedWalletLabel());
    }

    public updateSubPortfolioObservable() {
        this.subPortfolioListOb.next(this.subPortfolioList);
    }

    public getSubPortfolioData() {
        return this.subPortfolioListOb;
    }

    public requestBankingDetails(requestedState) {
        if (!requestedState && this.connectedWalletId !== 0) {
            OfiSubPortfolioService.requestSubPortfolioBankingDetails(this.ngRedux, this.ofiSubPortfolioReqService, this.connectedWalletId);
        }
    }

    static requestSubPortfolioBankingDetails(ngRedux: NgRedux<any>, ofiSubPortfolioReqService: OfiSubPortfolioReqService, walletId: number) {
        const asyncTaskPipe = ofiSubPortfolioReqService.getSubPortfolioBankingDetails({
            walletId,
        });

        ngRedux.dispatch(SagaHelper.runAsync(
            [SET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED, SET_SUB_PORTFOLIO_BANKING_DETAILS_LIST],
            [],
            asyncTaskPipe,
            {},
        ));
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
