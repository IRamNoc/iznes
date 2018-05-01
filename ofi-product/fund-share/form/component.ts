import {Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {select, NgRedux} from '@angular-redux/store';
import * as _ from 'lodash';
import {fromJS} from 'immutable';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/take';
import {Subscription} from 'rxjs/Subscription';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {ToasterService} from 'angular2-toaster';
import {ConfirmationService} from '@setl/utils';

import { setRequestedFund } from '@ofi/ofi-main/ofi-store/ofi-product/fund';
import { setRequestedUmbrellaFund } from '@ofi/ofi-main/ofi-store/ofi-product/umbrella-fund';
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
    clearRequestedFundShareDocs,
    setRequestedFundShareDocs,
    getOfiFundShareDocsCurrentRequest,
    OfiFundShareDocuments
} from '@ofi/ofi-main/ofi-store/ofi-product/fund-share-docs';
import {OfiFundShareService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import {OfiFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import {OfiUmbrellaFundService} from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import {OfiManagementCompanyService} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
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
    private fundShareDocsData: OfiFundShareDocuments;
    isReady: boolean = false;
    model: FundShare;
    mode: FundShareMode = FundShareMode.Create;
    private fundList;
    private umbrellaFundList;
    private managementCompanyList;

    private fundShareId: number;
    private isNewFundShare: boolean = false;
    private routeParams: Subscription;
    private subscriptionsArray: Subscription[] = [];
    private panels: {[key: string]: any} = new PanelData();
    private iznShareList;

    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'requested']) fundShareRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) fundShareOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFundShareDocs', 'requested']) fundShareDocsRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFundShareDocs', 'fundShareDocuments']) fundShareDocsOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) shareListObs;
    @select(['user', 'myDetail', 'accountId']) accountIdOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'requested']) fundListRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundListOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'requested']) umbrellaFundListRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaFundListOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'requested']) requestedOfiManagementCompanyListOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyAccessListOb: Observable<any>;

    constructor(private router: Router,
        private route: ActivatedRoute,
        private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private alerts: AlertsService,
        private toaster: ToasterService,
        private confirmationService: ConfirmationService,
        private ofiFundShareService: OfiFundShareService,
        private ofiUmbrellaFundService: OfiUmbrellaFundService,
        private ofiManagementCompanyService: OfiManagementCompanyService,
        private ofiFundService: OfiFundService) {}

    ngOnInit() {
        this.model = new FundShare();
        
        this.initSubscriptions();

        this.redux.dispatch(clearRequestedFundShare());
        this.redux.dispatch(clearRequestedFundShareDocs());
    }

    get fund() {
        return this.model.fundID ? _.find(this.fundList, (fundItem) => {
            return fundItem.fundID === this.model.fundID;
        }) : null;
    }

    get umbrellaFund() {
        return this.model.umbrellaFundID ? _.find(this.umbrellaFundList, (umbrellaItem) => {
            return umbrellaItem.umbrellaFundID === this.model.umbrellaFundID;
        }) : null;
    }

    private initSubscriptions(): void {        
        this.subscriptionsArray.push(this.route.paramMap.subscribe(params => {
            const fundShareId = params.get('shareId') as any;
            this.fundShareId = fundShareId ? parseInt(fundShareId) : fundShareId;
            
            if(this.fundShareId != undefined) {
                this.model.fundShareId = parseInt(fundShareId);
                this.mode = FundShareMode.Update;
            }
            
            // if(this.mode === FundShareMode.Create) {
            //     this.model = FundShareTestData.generate(new FundShare());
            // }
            
            this.configureFormForMode();
        }));
        
        this.subscriptionsArray.push(this.requestedOfiManagementCompanyListOb.subscribe((requested) => this.getManagementCompanyRequested(requested)));
        this.subscriptionsArray.push(this.managementCompanyAccessListOb.subscribe((list) => this.getManagementCompanyList(list)));
        
        this.subscriptionsArray.push(this.fundShareRequestedOb.subscribe(requested => {
            if(this.mode === FundShareMode.Update) this.requestFundShare(requested);
        }));
        this.subscriptionsArray.push(this.fundShareOb.subscribe(fundShare => {
            if(this.fundShareId === fundShare.fundShareID) this.updateFundShare(fundShare);
        }));
        this.subscriptionsArray.push(this.fundShareDocsRequestedOb.subscribe(requested => {
            if(this.mode === FundShareMode.Update) this.requestFundShareDocs(requested);
        }));
        this.subscriptionsArray.push(this.fundShareDocsOb.subscribe(fundShareDocs => {
            if(this.fundShareId === fundShareDocs.fundShareID) this.updateFundShareDocs(fundShareDocs);
        }));
        this.subscriptionsArray.push(this.shareListObs.subscribe(fundShareList => {
            this.model.keyFacts.mandatory.feeder.listItems = this.generateListItems(fundShareList);
            
            /**
             * if no fund shares exist we remove the master and feeder options
             */
            if((!fundShareList) || Object.keys(fundShareList).length === 0) {
                _.remove(this.model.keyFacts.mandatory.status.listItems, (item) => {
                    return item.id === Enum.StatusEnum.Feeder;
                });
            }

            this.iznShareList = fundShareList;
        }));

        this.subscriptionsArray.push(this.accountIdOb.subscribe(accountId => this.model.accountId = accountId));

        this.subscriptionsArray.push(this.fundListRequestedOb.subscribe(requested => {
            this.requestFundList(requested);
        }));
        this.subscriptionsArray.push(this.fundListOb.subscribe(fund => {
            this.updateFundList(fund);
        }));

        this.subscriptionsArray.push(this.umbrellaFundListRequestedOb.subscribe(requested => {
            this.requestUmbrellaFundList(requested);
        }));
        this.subscriptionsArray.push(this.umbrellaFundListOb.subscribe(umbrella => {
            this.updateUmbrellaFundList(umbrella);
        }));

        let fork;
        if(this.mode === FundShareMode.Update) {
            fork = Observable.forkJoin([
                this.route.paramMap.first(),
                this.managementCompanyAccessListOb.first(),
                this.fundShareOb.take(2),
                this.fundShareDocsOb.take(2),
                this.fundListOb.first(),
                this.shareListObs.first(),
                this.umbrellaFundListOb.first()
            ]);
        } else {
            fork = Observable.forkJoin([
                this.route.paramMap.first(),
                this.managementCompanyAccessListOb.first(),
                this.fundListOb.first(),
                this.shareListObs.first(),
                this.umbrellaFundListOb.first()
            ]);
        }
        
        fork.subscribe(data => {
            // nothing to do here
        },
        (err) => {
            this.toaster.pop('error', 'An error occured.');
            this.router.navigateByUrl(`product-module`);
        }, () => {
            if(this.mode === FundShareMode.Update) {
                if(this.fundShareData) this.model.setFundShare(this.fundShareData);
                
                if(this.fundShareId === this.fundShareData.fundShareID &&
                    !!this.fundShareDocsData) {
                    this.model.setFundShareDocs(this.fundShareDocsData);
                }
            }
            
            if(this.managementCompanyList) {
                this.model.fund.managementCompany.listItems = this.managementCompanyList;
                this.model.umbrella.managementCompanyID.listItems = this.managementCompanyList;
            }
            
            this.model.setFund(this.fund);

            if(this.hasUmbrellaFund()) {
                this.model.setUmbrellaFund(_.find(this.umbrellaFundList, (umbFund, index: string) => {
                    return index === this.model.umbrellaFundID.toString();
                }));
            }
            
            this.isReady = true;

            this.changeDetectorRef.markForCheck();
            this.changeDetectorRef.detectChanges();
        });
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
        return this.isReady;
    }

    hasUmbrellaFund(): boolean {
        return this.model.umbrellaFundID > 0;
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
     * request the Umbrella fund list
     * @param requested boolean
     * @return void
     */
    private requestUmbrellaFundList(requested: boolean): void {
        if(requested) return;

        OfiUmbrellaFundService.defaultRequestUmbrellaFundList(this.ofiUmbrellaFundService, this.redux);
    }

    /**
     * get the Umbrella fund list
     * @param umbrellaFundList NavList
     * @return void
     */
    private updateUmbrellaFundList(umbrellaFundList: any): void {
        this.umbrellaFundList = umbrellaFundList ? umbrellaFundList : undefined;

        if(this.umbrellaFundList) {
            this.redux.dispatch(setRequestedUmbrellaFund());
        }

        this.changeDetectorRef.markForCheck();
    }
    
    /**
     * request the fund list
     * @param requested boolean
     * @return void
     */
    private requestFundList(requested: boolean): void {
        if(requested) return;

        OfiFundService.defaultRequestFundList(this.ofiFundService, this.redux);
    }

    /**
     * get the fund list
     * @param navList NavList
     * @return void
     */
    private updateFundList(fundList: any): void {
        if(!fundList || Object.keys(fundList).length === 0) return;

        this.fundList = fundList ? fundList : undefined;

        if(this.fundList) {
            this.redux.dispatch(setRequestedFund());
        }

        this.changeDetectorRef.markForCheck();
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
     * @param fundShare fundShare
     * @return void
     */
    private updateFundShare(fundShare: any): void {
        if((!fundShare) || !fundShare.fundShareID) {
            return;
        }

        this.fundShareData = fundShare;

        this.changeDetectorRef.detectChanges();
    }

    /**
     * request the fund share documents
     * @param requested boolean
     * @return void
     */
    private requestFundShareDocs(requested: boolean): void {
        if(requested) return;

        const requestData = getOfiFundShareDocsCurrentRequest(this.redux.getState());
        requestData.fundShareID = this.fundShareId;

        OfiFundShareService.defaultRequestFundShareDocs(this.ofiFundShareService, this.redux, requestData);
    }

    /**
     * get the fund share documents
     * @param fundShareDocs fundShareDocs
     * @return void
     */
    private updateFundShareDocs(fundShareDocs: any): void {
        if((!fundShareDocs.prospectus) || fundShareDocs.prospectus.length < 1) return;

        this.fundShareDocsData = fundShareDocs;

        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
    }

    /**
     * get the list of management companies
     * @param requested boolean
     * @return void
     */
    private getManagementCompanyRequested(requested): void {
        if (!requested) {
            OfiManagementCompanyService.defaultRequestManagementCompanyList(this.ofiManagementCompanyService, this.redux);
        }
    }

    /**
     * process the list of management companies
     * @param list any
     * @return void
     */
    private getManagementCompanyList(list) {
        const listImu = fromJS(list);

        const items = listImu.reduce((result, item) => {
            result.push({
                id: item.get('companyID', 0),
                text: item.get('companyName', ''),
            });

            return result;
        }, []);

        this.managementCompanyList = items;
    }

    /**
     * save the fund share (this is used for create and update)
     * @return void
     */
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
                (data) => this.onUpdateSuccess(data[1].Data),
                (e) => this.onUpdateError(e[1].Data[0]));
        }
    }
    
    private onCreateSuccess(data): void {
        if(data.Status === "Fail") {
            this.onCreateError(data);
            return;
        }

        OfiFundShareService.defaultCreateFundShareDocuments(this.ofiFundShareService,
            this.redux,
            this.model.getDocumentsRequest(data.fundShareID),
            (docsData) => {
                this.toaster.pop('success', data.fundShareName + ' has been successfully created');
                this.router.navigateByUrl(`product-module`);
            },
            (e) => this.onCreateError(e[1].Data[0]));
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
        OfiFundShareService.defaultUpdateFundShareDocuments(this.ofiFundShareService,
            this.redux,
            this.model.getDocumentsRequest(data.fundShareID),
            (docsData) => {
                this.toaster.pop('success', this.model.keyFacts.mandatory.fundShareName.value() +
                    ' has been successfully updated');
            },
            (e) => this.onUpdateError(e[1].Data[0]));
    }

    private onUpdateError(e): void {
        this.toaster.pop('error', this.model.keyFacts.mandatory.fundShareName.value() +
            ' could not be updated');
    }

    /**
     * cancel and leave the fund share (this is used for create and update)
     * @return void
     */
    cancelFundShare(): void {
        this.confirmationService.create(
            '<span>Are you sure?</span>',
            '<span>Any Fund Share data you have entered will be lost.</span>',
            { confirmText: 'Confirm', declineText: 'Cancel' }
        ).subscribe((ans) => {
            if(ans.resolved) {
                this.router.navigateByUrl('product-module');
            }
        });
    }

    /**
     * helper/template methods
     */
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