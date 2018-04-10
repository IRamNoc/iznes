import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {select, NgRedux} from '@angular-redux/store';
import * as _ from 'lodash';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ToasterService} from 'angular2-toaster';
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
import {FundShare, FundShareMode, PanelData} from '../model';
import * as Enum from '../FundShareEnum';
import {FundShareTradeCycleModel} from './trade-cycle/model';
import {FundShareTestData} from './TestData';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-fund-share',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class FundShareComponent implements OnInit, OnDestroy {

    private fundShareData: OfiFundShare;
    model: FundShare;
    mode: FundShareMode = FundShareMode.Create;

    private fundShareId: number;
    private isNewFundShare: boolean = false;
    private routeParams: Subscription;
    private subscriptionsArray: Subscription[] = [];
    private panels: {[key: string]: any} = new PanelData();
    private iznShareList;

    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'requested']) fundShareRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) fundShareOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) shareListObs;
    @select(['user', 'myDetail', 'accountId']) accountIdOb: Observable<any>;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private alerts: AlertsService,
        private toaster: ToasterService,
        private confirmationService: ConfirmationService,
        private ofiFundShareService: OfiFundShareService,
        private ofiFundService: OfiFundService) {}

    ngOnInit() {
        this.model = new FundShare();

        this.initSubscriptions();

        this.configureFormForMode();

        this.redux.dispatch(clearRequestedFundShare());
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.route.paramMap.subscribe(params => {
            const fundShareId = params.get('shareId') as any;
            this.fundShareId = fundShareId ? parseInt(fundShareId) : fundShareId;

            if(this.fundShareId != undefined) {
                this.model.fundShareId = parseInt(fundShareId);
                this.mode = FundShareMode.Update;
            }

            // FOR TESTING
            // if(this.mode === FundShareMode.Create) this.model = FundShareTestData.generate(new FundShare());
        }));
        this.subscriptionsArray.push(this.fundShareRequestedOb.subscribe(requested => {
            if(this.mode === FundShareMode.Update) this.requestFundShare(requested);
        }));
        this.subscriptionsArray.push(this.fundShareOb.subscribe(fundShare => {
            if(this.fundShareId === fundShare.fundShareID) this.updateFundShare(fundShare);
        }));
        this.subscriptionsArray.push(this.shareListObs.subscribe(fundShareList => {
            this.model.keyFacts.mandatory.master.listItems = this.generateListItems(fundShareList);
            this.model.keyFacts.mandatory.feeder.listItems = this.generateListItems(fundShareList);
            
            if((!fundShareList) || Object.keys(fundShareList).length === 0) {
                _.remove(this.model.keyFacts.mandatory.status.listItems, (item) => {
                    return item.id === Enum.StatusEnum.Master;
                });
                _.remove(this.model.keyFacts.mandatory.status.listItems, (item) => {
                    return item.id === Enum.StatusEnum.Feeder;
                });
            }

            this.iznShareList = fundShareList;
        }));

        this.subscriptionsArray.push(this.accountIdOb.subscribe(accountId => this.model.accountId = accountId));
    }

    private generateListItems(fundShareList): any[] {
        const items = [];

        _.forEach(fundShareList, (item) => {
            items.push({
                id: item.fundShareID,
                text: item.fundShareName
            });
        });

        return items;
    }

    private configureFormForMode(): void {
        if(this.mode === FundShareMode.Update) {
            this.model.keyFacts.mandatory.fundShareName.disabled = true;
            this.model.keyFacts.mandatory.isin.disabled = true;
        } else {
            this.model.fundID = getOfiFundShareSelectedFund(this.redux.getState());

            if(this.model.fundID == undefined) {
                this.router.navigateByUrl(`product-module/fund-share/new`);
            }
        }
    }

    loadUI(): boolean {
        return (!!this.model.fundID || this.isCreate()) &&
            this.iznShareList != undefined;
    }

    calendarSubscriptionModelEvent(model: FundShareTradeCycleModel): void {
        this.model.calendar.subscriptionTradeCycle = model;
        if(this.fundShareData) this.model.setSubscriptionTradeCycleData(this.fundShareData);
    }

    calendarRedemptionModelEvent(model: FundShareTradeCycleModel): void {
        this.model.calendar.redemptionTradeCycle = model;
        if(this.fundShareData) this.model.setRedemptionTradeCycleData(this.fundShareData);
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

        this.fundShareData = fundShare;
        this.model.setFundShare(fundShare);

        if(this.model.fundID) this.redux.dispatch(setRequestedFundShare());

        this.changeDetectorRef.detectChanges();
    }

    saveFundShare(): void {
        if(this.mode === FundShareMode.Create) {
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
            
            OfiFundShareService.defaultCreateFundShare(this.ofiFundShareService,
                this.redux,
                this.model.getRequest(),
                (data) => this.onCreateSuccess(data[1].Data),
                (e) => this.onCreateError(e[1].Data[0]));
        } else {
            OfiFundShareService.defaultUpdateFundShare(this.ofiFundShareService,
                this.redux,
                this.model.getRequest(),
                (data) => this.onUpdateSuccess(data[1]),
                (e) => this.onUpdateError(e[1].Data[0]));
        }
    }

    private onCreateSuccess(data): void {
        if(data.Status === "Fail") {
            this.onCreateError(data);
            return;
        }
        this.toaster.pop('success', data.fundShareName + ' has been successfully creates');
        this.router.navigateByUrl(`product-module/home`);
    }

    private onCreateError(e): void {
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
        this.toaster.pop('success', this.model.keyFacts.mandatory.fundShareName.value() +
            ' has been successfully updated');
    }

    private onUpdateError(e): void {
        this.toaster.pop('error', this.model.keyFacts.mandatory.fundShareName.value() +
            ' could not be updated');
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

    openPanel(obj: {[key: string]: any}, $event): void {
        $event.preventDefault();

        obj.open = !obj.open;
    }

    isPanelOpen(obj: {[key: string]: any}): boolean {
        return obj.open;
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}