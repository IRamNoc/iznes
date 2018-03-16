import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {select, NgRedux} from '@angular-redux/store';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

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
import {FundShare, FundShareMode} from '../model';
import {FundShareTestData} from './TestData';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-fund-share',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FundShareComponent implements OnInit, OnDestroy {

    model: FundShare = FundShareTestData.generate(new FundShare());
    mode: FundShareMode = FundShareMode.Create;

    private fundShare: OfiFundShare;
    private fundShareId: number;
    private routeParams: Subscription;
    private subscriptionsArray: Subscription[] = [];

    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'requested']) fundShareRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) fundShareOb: Observable<any>;
    @select(['user', 'myDetail', 'accountId']) accountIdOb: Observable<any>;

    constructor(private route: ActivatedRoute,
        private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private ofiFundShareService: OfiFundShareService) {}

    ngOnInit() {
        this.initSubscriptions();
        
        this.redux.dispatch(clearRequestedFundShare());
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.route.params.subscribe(params => {
            this.fundShareId = params['shareId'];

            if(this.fundShareId != undefined) {
                this.mode = FundShareMode.Update;
            }
        }));
        this.subscriptionsArray.push(this.fundShareRequestedOb.subscribe(requested => {
            this.requestFundShare(requested);
        }));
        this.subscriptionsArray.push(this.fundShareOb.subscribe(navFund => {
            this.updateFundShare(navFund);
        }));

        this.subscriptionsArray.push(this.accountIdOb.subscribe(accountId => this.model.accountId = accountId));
    }

    /**
     * request the fund share
     * @param requested boolean
     * @return void
     */
    private requestFundShare(requested: boolean): void {
        if(requested) return;

        const requestData = getOfiFundShareCurrentRequest(this.redux.getState());

        OfiFundShareService.defaultRequestFundShare(this.ofiFundShareService, this.redux, requestData);
    }

    /**
     * get the fund share
     * @param navList NavList
     * @return void
     */
    private updateFundShare(fundShare: any): void {
        this.fundShare = fundShare ? fundShare[0] : undefined;

        if(this.fundShare) this.redux.dispatch(setRequestedFundShare());

        this.changeDetectorRef.markForCheck();
    }

    saveFundShare(): void {
        this.model.fundID = getOfiFundShareSelectedFund(this.redux.getState());
        
        OfiFundShareService.defaultCreateFundShare(this.ofiFundShareService,
            this.redux,
            this.model.getRequest(),
            (data) => { console.log(data)},
            (e) => { console.log(e)});
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