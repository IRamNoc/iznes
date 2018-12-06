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

    private subscriptions: Array<Subscription> = [];
    public subPortfolioList: any[] = [];
    public connectedWalletId: number = 0;
    public subPortfolioListOb: Subject<any> = new Subject;

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
        this.initSubscriptions();
    }

    /**
     * Initialise Subscriptions
     * @return void
     */
    private initSubscriptions() {
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
                this.subPortfolioList = [];
                this.subPortfolioList = [];
                Object.keys(addressList).forEach((subPortfolio) => {
                    this.subPortfolioList.push(Object.assign({}, addressList[subPortfolio], bankingDetails[subPortfolio]));
                });
                this.updateSubPortfolioObservable();
            });
    }

    /**
     * Resets the Redux requested flags for WalletLabels and Sub-portfolio banking details
     * @return void
     */
    public resetRequestedFlags() {
        this.ngRedux.dispatch(resetSubPortfolioBankingDetailsRequested());
        this.ngRedux.dispatch(clearRequestedWalletLabel());
    }

    /**
     * Calls next on the Sub-portfolio List Observable
     * @return void
     */
    public updateSubPortfolioObservable() {
        this.subPortfolioListOb.next(this.subPortfolioList);
    }

    /**
     * Gets the Sub-portfolio list observable
     * @return {observable} subPortfolioListOb
     */
    public getSubPortfolioData() {
        return this.subPortfolioListOb;
    }

    /**
     * Requests the Sub-portfolio banking details
     * @param requestedState
     */
    public requestBankingDetails(requestedState) {
        if (!requestedState && this.connectedWalletId !== 0) {
            const asyncTaskPipe = this.ofiSubPortfolioReqService.getSubPortfolioBankingDetails({
                walletId: this.connectedWalletId,
            });

            this.ngRedux.dispatch(SagaHelper.runAsync(
                [SET_SUB_PORTFOLIO_BANKING_DETAILS_REQUESTED, SET_SUB_PORTFOLIO_BANKING_DETAILS_LIST],
                [],
                asyncTaskPipe,
                {},
            ));
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
