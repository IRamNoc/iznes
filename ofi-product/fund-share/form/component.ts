import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ConfirmationService} from '@setl/utils';

import {
    clearRequestedFundShare,
    setRequestedFundShare,
    getOfiFundShareCurrentRequest,
    OfiFundShare
} from '@ofi/ofi-main/ofi-store/ofi-product/fund-share';
import {
    getOfiFundShareSelectedFund,
    ofiSetCurrentFundShareSelectedFund
} from '@ofi/ofi-main/ofi-store/ofi-product/fund-share-sf';
import {
    
} from '@setl/core-useradmin';
import {OfiFundShareService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import {OfiFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';  
import {FundShare, FundShareMode} from '../model';
import {FundShareTestData} from './TestData';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-fund-share',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FundShareComponent implements OnInit, OnDestroy {

    model: FundShare;
    mode: FundShareMode = FundShareMode.Create;

    private fundShareId: number;
    private routeParams: Subscription;
    private subscriptionsArray: Subscription[] = [];

    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'requested']) fundShareRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) fundShareOb: Observable<any>;
    @select(['user', 'myDetail', 'accountId']) accountIdOb: Observable<any>;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private alerts: AlertsService,
        private confirmationService: ConfirmationService,
        private ofiFundShareService: OfiFundShareService,
        private ofiFundService: OfiFundService) {}

    ngOnInit() {
        this.model = new FundShare();

        this.initSubscriptions();
        
        this.redux.dispatch(clearRequestedFundShare());

        this.configureFormForMode();
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.route.paramMap.subscribe(params => {
            this.fundShareId = params.get('shareId') as any;

            if(this.fundShareId != undefined) {
                this.mode = FundShareMode.Update;
            }

            if(this.mode === FundShareMode.Create) this.model = FundShareTestData.generate(new FundShare());
        }));
        this.subscriptionsArray.push(this.route.queryParamMap.subscribe(params => {
            if(params.get('new') != undefined) this.showNewFundShareAlert();
        }));
        this.subscriptionsArray.push(this.fundShareRequestedOb.subscribe(requested => {
            if(this.mode === FundShareMode.Update) this.requestFundShare(requested);
        }));
        this.subscriptionsArray.push(this.fundShareOb.subscribe(fundShare => {
            this.updateFundShare(fundShare);
        }));

        this.subscriptionsArray.push(this.accountIdOb.subscribe(accountId => this.model.accountId = accountId));
    }

    private configureFormForMode(): void {
        if(this.mode === FundShareMode.Update) {
            this.model.keyFacts.mandatory.fundShareName.disabled = true;
            this.model.keyFacts.mandatory.isin.disabled = true;
        } else {
            this.model.fundID = getOfiFundShareSelectedFund(this.redux.getState());
        }
    }

    private showNewFundShareAlert(): void {
        this.alerts.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-info">Fund Share Successfully Created.</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    /**
     * request the fund share
     * @param requested boolean
     * @return void
     */
    private requestFundShare(requested: boolean): void {
        if(requested) return;

        const requestData = getOfiFundShareCurrentRequest(this.redux.getState());
        requestData.fundShareID = this.fundShareId;

        OfiFundShareService.defaultRequestFundShare(this.ofiFundShareService, this.redux, requestData);
    }

    /**
     * get the fund share
     * @param navList NavList
     * @return void
     */
    private updateFundShare(fundShare: any): void {
        if((!fundShare) || !fundShare.fundShareID) return;

        this.model.setFundShare(fundShare);

        if(this.model.fundID) this.redux.dispatch(setRequestedFundShare());

        this.changeDetectorRef.markForCheck();
    }

    saveFundShare(): void {
        this.alerts.create('info', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-info">Creating Fund Share.<br />This may take a few moments.</td>
                    </tr>
                </tbody>
            </table>
        `, {
            showCloseButton: false,
            overlayClickToClose: false
        });
        
        const method = this.mode === FundShareMode.Create ?
            OfiFundShareService.defaultCreateFundShare :
            OfiFundShareService.defaultUpdateFundShare;

        const successCallback = this.mode === FundShareMode.Create ?
            this.onCreateSuccess :
            this.onUpdateSuccess;

        const errorCallback = this.mode === FundShareMode.Create ?
            this.onCreateError :
            this.onUpdateError;
        
        method(this.ofiFundShareService,
            this.redux,
            this.model.getRequest(),
            (data) => successCallback(data[1]),
            (e) => errorCallback(e[1].Data[0]));
    }

    private onCreateSuccess(data): void {
        console.log('onCreateSuccess',data);
        this.router.navigateByUrl(`product-module/fund-share/${data.Data.fundShareID}?new`);
    }

    private onCreateError(e): void {
        console.log('onCreateError',e);
        this.alerts.create('error', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-danger">There was an issue creating a Fund Share.<br />
                        ${e.Message}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    private onUpdateSuccess(data): void {
        console.log('onUpdateSuccess',data);
        this.alerts.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-danger">Fund Share successfully updated.</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    private onUpdateError(e): void {
        console.log('onUpdateError',e);
        this.alerts.create('error', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-danger">There was an issue updating the Fund Share.<br />
                        ${e.Message}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    cancelFundShare(): void {
        this.confirmationService.create(
            '<span>Are you sure?</span>',
            '<span>Any Fund Share data you have entered will be lost.</span>',
            { confirmText: 'Confirm', declineText: 'Cancel' }
        ).subscribe((ans) => {
            if(ans.resolved) {
                this.router.navigateByUrl('product-module/home');
            }
        });
    }

    isCreate(): boolean {
        return this.mode === FundShareMode.Create;
    }

    isUpdate(): boolean {
        return this.mode === FundShareMode.Update;
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}