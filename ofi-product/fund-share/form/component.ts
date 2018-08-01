import {
    forkJoin as observableForkJoin,
    Observable,
    Subscription,
    combineLatest,
} from 'rxjs';
import { take, first } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { fromJS } from 'immutable';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';
import { ClrTabs } from '@clr/angular';
import { ConfirmationService, ClrTabsHelper } from '@setl/utils';

import { setRequestedFund } from '@ofi/ofi-main/ofi-store/ofi-product/fund';
import { setRequestedUmbrellaFund } from '@ofi/ofi-main/ofi-store/ofi-product/umbrella-fund';
import {
    clearRequestedFundShare,
    getOfiFundShareCurrentRequest,
    OfiFundShare,
} from '@ofi/ofi-main/ofi-store/ofi-product/fund-share';
import {
    getOfiFundShareSelectedFund,
    ofiSetCurrentFundShareSelectedFund,
} from '@ofi/ofi-main/ofi-store/ofi-product/fund-share-sf';
import {
    clearRequestedFundShareDocs,
    getOfiFundShareDocsCurrentRequest,
    setRequestedFundShareDocs,
    OfiFundShareDocuments,
    setCurrentFundShareDocsRequest,
} from '@ofi/ofi-main/ofi-store/ofi-product/fund-share-docs';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import { OfiManagementCompanyService } from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { FundShare, FundShareMode, PanelData } from '../model';
import { FundShareTestData } from './TestData';
import * as Enum from '../FundShareEnum';
import { FundShareTradeCycleModel } from './trade-cycle/model';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import { MultilingualService } from '@setl/multilingual';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-fund-share',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})

export class FundShareComponent implements OnInit, OnDestroy {
    private fundShareData: OfiFundShare;
    private fundShareDocsData: OfiFundShareDocuments;
    isReady: boolean = false;
    model: FundShare;
    mode: FundShareMode = FundShareMode.Create;
    private prefill: number;
    private fundList;
    fundListItems = [];
    shareListItems = [];
    private umbrellaFundList;
    private managementCompanyList;

    private fundShareId: number;
    private routeParams: Subscription;
    private subscriptionsArray: Subscription[] = [];
    private panels: { [key: string]: any } = new PanelData();
    private iznShareList;

    selectFundForm: FormGroup;
    shareControl = new FormControl([]);
    currDraft: number;

    @ViewChild('tabsRef') tabsRef: ClrTabs;
    @ViewChild('fundHolidayInput') fundHolidayInput;
    @ViewChild('tradeCycleSubscription') tradeCycleSubscription;
    @ViewChild('tradeCycleRedemption') tradeCycleRedemption;
    @ViewChild('documentsMandatory') documentsMandatory;
    @ViewChild('documentsOptional') documentsOptional;

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
    @select(['ofi', 'ofiCurrencies', 'currencies']) currenciesObs: Observable<any>;
    @select(['user', 'siteSettings', 'production']) productionOb;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private alerts: AlertsService,
        private toaster: ToasterService,
        private confirmationService: ConfirmationService,
        private ofiFundShareService: OfiFundShareService,
        private ofiUmbrellaFundService: OfiUmbrellaFundService,
        private ofiManagementCompanyService: OfiManagementCompanyService,
        private ofiFundService: OfiFundService,
        private ofiCurrenciesService: OfiCurrenciesService,
        private fb: FormBuilder,
        public _translate: MultilingualService,
    ) {
        this.ofiCurrenciesService.getCurrencyList();

        this.selectFundForm = this.fb.group({
            fund: [],
            domicile: [{ value: '', disabled: true }],
            lei: [{ value: '', disabled: true }],
        });
    }

    ngOnInit() {
        this.model = new FundShare();
        this.subscriptionsArray.push(
            this.route.queryParams.subscribe((params) => {
                if (params.prefill) {
                    this.prefill = Number(params.prefill);
                    const requestData = getOfiFundShareCurrentRequest(this.redux.getState());
                    requestData.fundShareID = this.prefill;
                    OfiFundShareService.defaultRequestFundShareDocs(this.ofiFundShareService, this.redux, requestData);

                } else if (params.fund) {
                    this.setCurrentFund(parseInt(params.fund, 10));
                }

                this.initSubscriptions();

                this.redux.dispatch(clearRequestedFundShare());
                this.redux.dispatch(clearRequestedFundShareDocs());
            }),
        );

        this.subscriptionsArray.push(
            combineLatest(
                this.route.queryParams,
                this.shareListObs,
            ).subscribe(([r, shareList]) => {
                if (!r || !shareList || !this.prefill || !this.shareListItems) {
                    return;
                }

                this.shareControl.setValue(
                    [_.find(this.shareListItems, { id: this.prefill.toString() })],
                    { emitEvent: false },
                );
            }),
        );

    }

    get fund() {
        if (this.model.fundID) {
            return _.find(this.fundList, (fundItem) => {
                return fundItem.fundID === this.model.fundID;
            });
        }
        const prefillShare = _.find(this.iznShareList, (share) => {
            return share.fundShareID === this.prefill;
        });
        return _.find(this.fundList, (fundItem) => {
            return fundItem.fundID === prefillShare.fundID;
        });
    }

    get umbrellaFund() {
        return this.model.umbrellaFundID ? _.find(this.umbrellaFundList, (umbrellaItem) => {
            return umbrellaItem.umbrellaFundID === this.model.umbrellaFundID;
        }) : null;
    }

    setCurrentFund(fundId) {
        this.redux.dispatch(ofiSetCurrentFundShareSelectedFund(fundId));
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(
            this.selectFundForm.controls.fund.valueChanges
                .subscribe((d) => {
                    const id = _.get(d, [0, 'id'], false);
                    if (!id) {
                        return;
                    }
                    const newFund = this.fundList[id];
                    const newUmbrella = newFund.umbrellaFundID ? this.umbrellaFundList[newFund.umbrellaFundID] : null;
                    this.model.updateFund(newFund, newUmbrella);

                    this.selectFundForm.controls.lei.setValue(
                        this.model.fund.LEI.value() || 'N/A',
                    );
                    this.selectFundForm.controls.domicile.setValue(
                        _.get(this.model.fund.domicile.value(), [0, 'text'], ''),
                    );

                    this.fundHolidayInput.markForCheck();
                    this.changeDetectorRef.markForCheck();
                    this.changeDetectorRef.detectChanges();
                }),
        );

        this.subscriptionsArray.push(
            this.shareControl.valueChanges
                .subscribe((v) => {
                    if (!v || !v.length) {
                        this.model.resetFundShare();
                    } else {

                        const id = Number(v[0].id);
                        const newShare = this.iznShareList[id];

                        this.redux.dispatch(setCurrentFundShareDocsRequest(id));
                        this.redux.dispatch(clearRequestedFundShareDocs());

                        this.model.setFundShareDocsValue(this.fundShareDocsData);

                        this.model.updateFundShare(newShare);

                        this.selectFundForm.controls.fund.setValue(
                            [_.find(this.fundListItems, { id: newShare.fundID.toString() })],
                        );

                        const newFund = this.fundList[newShare.fundID];
                        const newUmbrella = newFund.umbrellaFundID
                            ? this.umbrellaFundList[newFund.umbrellaFundID]
                            : null;

                        this.model.updateFund(newFund, newUmbrella);
                    }

                    this.fundHolidayInput.markForCheck();
                    this.tradeCycleSubscription.markForCheck();
                    this.tradeCycleRedemption.markForCheck();
                    this.changeDetectorRef.markForCheck();
                    this.changeDetectorRef.detectChanges();
                }),
        );

        this.subscriptionsArray.push(this.route.paramMap.subscribe(params => {
            const fundShareId = params.get('shareId') as any;
            this.fundShareId = fundShareId ? parseInt(fundShareId) : fundShareId;

            if (this.fundShareId != undefined) {
                this.model.fundShareId = parseInt(fundShareId);
                this.mode = FundShareMode.Update;
            }

            // if (this.mode === FundShareMode.Create) {
            //     this.model = FundShareTestData.generate(new FundShare());
            // }

            this.configureFormForMode();
        }));

        this.subscriptionsArray.push(this.currenciesObs.subscribe(c => this.getCurrencyList(c)));
        this.subscriptionsArray.push(this.requestedOfiManagementCompanyListOb.subscribe((requested) => this.getManagementCompanyRequested(requested)));
        this.subscriptionsArray.push(this.managementCompanyAccessListOb.subscribe((list) => this.getManagementCompanyList(list)));

        this.subscriptionsArray.push(this.fundShareRequestedOb.subscribe(requested => {
            if (this.mode === FundShareMode.Update) this.requestFundShare(requested);
        }));
        this.subscriptionsArray.push(this.fundShareOb.subscribe(fundShare => {
            if (this.fundShareId === fundShare.fundShareID) this.updateFundShare(fundShare);
        }));
        this.subscriptionsArray.push(this.fundShareDocsRequestedOb.subscribe(requested => {
            if (this.mode === FundShareMode.Update || this.prefill) this.requestFundShareDocs(requested);
        }));
        this.subscriptionsArray.push(this.fundShareDocsOb.subscribe(fundShareDocs => {
            if (this.fundShareId === fundShareDocs.fundShareID || this.prefill) this.updateFundShareDocs(fundShareDocs);
        }));
        this.subscriptionsArray.push(this.shareListObs.subscribe(fundShareList => {
            this.model.keyFacts.mandatory.feeder.listItems = this.generateListItems(fundShareList);

            /**
             * if no fund shares exist we remove the master and feeder options
             */
            if ((!fundShareList) || Object.keys(fundShareList).length === 0) {
                _.remove(this.model.keyFacts.mandatory.status.listItems, (item) => {
                    return item.id === Enum.StatusEnum.Feeder;
                });

            } else {
                this.shareListItems = Object.keys(fundShareList).map((key) => {
                    return {
                        id: key,
                        text: fundShareList[key].fundShareName,
                    };
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
        if (this.mode === FundShareMode.Update) {
            fork = observableForkJoin([
                this.route.paramMap.pipe(first()),
                this.managementCompanyAccessListOb.pipe(first()),
                this.fundShareOb.pipe(take(2)),
                this.fundShareDocsOb.pipe(take(2)),
                this.fundListOb.pipe(first()),
                this.shareListObs.pipe(first()),
                this.umbrellaFundListOb.pipe(first()),
                this.productionOb.pipe(first()),
            ]);
        } else {
            fork = observableForkJoin([
                this.route.paramMap.pipe(first()),
                this.managementCompanyAccessListOb.pipe(first()),
                this.fundListOb.pipe(first()),
                this.shareListObs.pipe(first()),
                this.umbrellaFundListOb.pipe(first()),
                this.productionOb.pipe(first()),
            ]);
        }

        this.subscriptionsArray.push(this.productionOb.subscribe(production => this.model.isProduction = production));

        fork.subscribe(
            data => {
                // nothing to do here
            },
            (err) => {
                this.toaster.pop('error', 'An error occured.');
                this.router.navigateByUrl(`product-module/product`);
            },
            () => {
                if (this.prefill) {

                    const prefillShare = this.iznShareList[this.prefill];

                    this.setCurrentFund(prefillShare.fundID);
                    this.model.setFundShare(prefillShare, true);
                    this.ofiFundShareService.fetchFundShareDocs({ fundShareID: this.prefill })
                        .then((d) => {
                            this.model.setFundShareDocsValue(d);
                            this.documentsMandatory.markForCheck();
                            this.documentsOptional.markForCheck();
                        });

                } else if (this.mode === FundShareMode.Update) {
                    if (this.fundShareData) this.model.setFundShare(this.fundShareData);

                    if (this.fundShareId === this.fundShareData.fundShareID &&
                        !!this.fundShareDocsData) {
                        this.model.setFundShareDocs(this.fundShareDocsData);
                    }
                }

                if (this.managementCompanyList) {
                    this.model.fund.managementCompany.listItems = this.managementCompanyList;
                    this.model.umbrella.managementCompanyID.listItems = this.managementCompanyList;
                }

                this.model.setFund(this.fund);

                if (this.hasUmbrellaFund()) {
                    this.model.setUmbrellaFund(_.find(this.umbrellaFundList, (umbFund, index: string) => {
                        return index === this.model.umbrellaFundID.toString();
                    }));
                }

                this.selectFundForm.setValue(
                    {
                        fund: [{
                            id: this.model.fundID,
                            text: this.model.fund.name.preset,
                        }],
                        domicile: _.get(this.model.fund.domicile.preset, [0, 'text'], ''),
                        lei: this.model.fund.LEI.preset || 'N/A',
                    },
                    { emitEvent: false },
                );

                if (!this.model.isProduction) {
                    this.model.documents.mandatory.kiid.required = false;
                    this.model.documents.mandatory.prospectus.required = false;
                }
                this.isReady = true;

                this.changeDetectorRef.markForCheck();
                this.changeDetectorRef.detectChanges();

                if (this.prefill) {
                    const prefillShare = this.iznShareList[this.prefill];
                    this.model.setRedemptionTradeCycleData(prefillShare);
                    this.model.setSubscriptionTradeCycleData(prefillShare);
                    this.tradeCycleSubscription.markForCheck();
                    this.tradeCycleRedemption.markForCheck();
                }
            });

    }

    private getCurrencyList(data): void {
        if (data) {
            const currencies = data.toJS();

            // Key facts
            this.model.keyFacts.mandatory.shareClassCurrency.listItems = currencies;
            this.model.keyFacts.optional.indexCurrency.listItems = currencies;

            // Characteristics
            this.model.characteristic.mandatory.subscriptionCurrency.listItems = currencies;
            this.model.characteristic.mandatory.redemptionCurrency.listItems = currencies;

            this.changeDetectorRef.markForCheck();
        }
    }

    private generateListItems(fundShareList): any[] {
        const items = [];

        _.forEach(fundShareList, (item) => {
            if (item.status === Enum.StatusEnum.Master) {
                items.push({
                    id: item.fundShareID,
                    text: item.fundShareName,
                });
            }
        });

        return items;
    }

    private configureFormForMode(): void {
        if (this.mode === FundShareMode.Update) {
            if (this.currDraft !== 1) {
                this.model.keyFacts.mandatory.fundShareName.disabled = true;
                this.model.keyFacts.mandatory.isin.disabled = true;
            }
        } else {
            this.model.fundID = getOfiFundShareSelectedFund(this.redux.getState());

            if (!this.model.fundID && !this.prefill) {
                this.router.navigateByUrl(`product-module/product/fund-share/new`);
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
        if (this.fundShareData) this.model.setSubscriptionTradeCycleData(this.fundShareData);
    }

    calendarRedemptionModelEvent(model: FundShareTradeCycleModel): void {
        this.model.calendar.redemptionTradeCycle = model;
        if (this.fundShareData) this.model.setRedemptionTradeCycleData(this.fundShareData);
    }

    /**
     * request the Umbrella fund list
     * @param requested boolean
     * @return void
     */
    private requestUmbrellaFundList(requested: boolean): void {
        if (requested) return;

        OfiUmbrellaFundService.defaultRequestUmbrellaFundList(this.ofiUmbrellaFundService, this.redux);
    }

    /**
     * get the Umbrella fund list
     * @param umbrellaFundList NavList
     * @return void
     */
    private updateUmbrellaFundList(umbrellaFundList: any): void {
        this.umbrellaFundList = umbrellaFundList ? umbrellaFundList : undefined;

        if (this.umbrellaFundList) {
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
        if (requested) return;

        OfiFundService.defaultRequestFundList(this.ofiFundService, this.redux);
    }

    /**
     * get the fund list
     * @param navList NavList
     * @return void
     */
    private updateFundList(fundList: any): void {
        if (!fundList || Object.keys(fundList).length === 0) return;

        this.fundList = fundList ? fundList : undefined;

        this.fundListItems = Object.keys(fundList).map((id) => {
            return {
                id,
                text: fundList[id].fundName,
            };
        });

        if (this.fundList) {
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
        if (requested) return;

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
        if ((!fundShare) || !fundShare.fundShareID) {
            return;
        }

        this.currDraft = fundShare.draft;

        this.fundShareData = fundShare;

        if (this.currDraft === 1) {
            this.model.keyFacts.mandatory.fundShareName.disabled = false;
            this.model.keyFacts.mandatory.isin.disabled = false;
        }

        this.changeDetectorRef.detectChanges();
    }

    /**
     * request the fund share documents
     * @param requested boolean
     * @return void
     */
    private requestFundShareDocs(requested: boolean): void {
        if (requested) return;

        const requestData = getOfiFundShareDocsCurrentRequest(this.redux.getState());

        if (this.fundShareId) {
            requestData.fundShareID = this.fundShareId;
        }

        OfiFundShareService.defaultRequestFundShareDocs(this.ofiFundShareService, this.redux, requestData);
    }

    /**
     * get the fund share documents
     * @param fundShareDocs fundShareDocs
     * @return void
     */
    private updateFundShareDocs(fundShareDocs: any): void {
        if ((!fundShareDocs.prospectus) || fundShareDocs.prospectus.length < 1) return;

        this.fundShareDocsData = fundShareDocs;

        if (this.isReady) {
            this.model.setFundShareDocsValue(fundShareDocs);

            this.documentsMandatory.markForCheck();
            this.documentsOptional.markForCheck();
        } else {
            this.model.setFundShareDocs(fundShareDocs);
        }

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
        const request = this.model.getRequest(0);
        if (this.mode === FundShareMode.Create || this.currDraft == 1) {
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
                    overlayClickToClose: false,
                });

            OfiFundShareService.defaultCreateFundShare(this.ofiFundShareService,
                this.redux,
                request,
                (data) => this.onCreateSuccess(data[1].Data, 0),
                (e) => this.onCreateError(e[1].Data[0], 0));
        } else {
            OfiFundShareService.defaultUpdateFundShare(this.ofiFundShareService,
                this.redux,
                request,
                (data) => this.onUpdateSuccess(data[1].Data, 0),
                (e) => this.onUpdateError(e[1].Data[0], 0));
        }
    }

    /**
     * save the draft fund share (this is used for create and update)
     * @return void
     */
    saveDraft(): void {
        const request = this.model.getRequest(1);

        if (this.mode === FundShareMode.Create) {
            OfiFundShareService.defaultCreateFundShare(this.ofiFundShareService,
                this.redux,
                request,
                (data) => this.onCreateSuccess(data[1].Data, 1),
                (e) => this.onCreateError(e[1].Data[0], 1));
        } else {
            OfiFundShareService.defaultUpdateFundShare(this.ofiFundShareService,
                this.redux,
                request,
                (data) => this.onUpdateSuccess(data[1].Data, 1),
                (e) => this.onUpdateError(e[1].Data[0], 1));
        }
    }

    private onCreateSuccess(data, draft): void {
        if (data.Status === 'Fail') {
            this.onCreateError(data, draft);
            return;
        }

        OfiFundShareService.defaultCreateFundShareDocuments(this.ofiFundShareService,
            this.redux,
            this.model.getDocumentsRequest(data.fundShareID),
            (docsData) => {
                this.toaster.pop('success', data.fundShareName + (draft == 1 ? ' draft' : '') + ' has been successfully created');
                this.router.navigateByUrl(`product-module/product`);
            },
            (e) => this.onCreateError(e[1].Data[0], draft));
    }

    private onCreateError(e, draft): void {
        this.alerts.create('error', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-danger">There was an issue creating the` + (draft == 1 ? ' draft' : '') + `Fund Share.<br />
                        ${e.Message}</td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    private onUpdateSuccess(data, draft): void {
        OfiFundShareService.defaultUpdateFundShareDocuments(this.ofiFundShareService,
            this.redux,
            this.model.getDocumentsRequest(data.fundShareID),
            (docsData) => {
                this.toaster.pop('success', this.model.keyFacts.mandatory.fundShareName.value() +
                    (draft == 1 ? ' draft' : '') +
                    ' has been successfully updated');
                this.router.navigateByUrl(`product-module/product`);
            },
            (e) => this.onUpdateError(e[1].Data[0], draft));
    }

    private onUpdateError(e, draft): void {
        this.toaster.pop('error', this.model.keyFacts.mandatory.fundShareName.value() +
            (draft == 1 ? ' draft' : '') +
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
            { confirmText: 'Confirm', declineText: 'Cancel' },
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.router.navigateByUrl('product-module/product');
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

    openPanel(obj: { [key: string]: any }, $event): void {
        $event.preventDefault();

        obj.open = !obj.open;
    }

    isPanelOpen(obj: { [key: string]: any }): boolean {
        return obj.open;
    }

    goToAuditTrail(): void {
        this.router.navigateByUrl(`product-module/product/fund-share/${this.fundShareId}/audit`);
    }

    duplicateShare() {
        const url = `product-module/product/fund-share?prefill=${this.fundShareId}`;

        this.router.navigateByUrl(url);
    }

    previousTab(): void {
        const activeTabIndex: number = ClrTabsHelper.getActiveTabIndex(this.tabsRef);

        if (activeTabIndex > 0) ClrTabsHelper.setActiveTab(this.tabsRef, activeTabIndex - 1);
    }

    nextTab(): void {
        const activeTabIndex: number = ClrTabsHelper.getActiveTabIndex(this.tabsRef);

        if (activeTabIndex < this.getTabsLength()) ClrTabsHelper.setActiveTab(this.tabsRef, activeTabIndex + 1);
    }

    hidePreviousTabButton(): boolean {
        if (!this.tabsRef) return true;

        return ClrTabsHelper.getActiveTabIndex(this.tabsRef) === 0;
    }

    hideNextTabButton(): boolean {
        if (!this.tabsRef) return true;

        return ClrTabsHelper.getActiveTabIndex(this.tabsRef) === this.getTabsLength();
    }

    private getTabsLength(): number {
        return this.tabsRef.tabLinkDirectives.length - 1;
    }

    showShareClosedWarning(): boolean {
        const value = this.model.keyFacts.status.shareClassInvestmentStatus.value();

        if ((!value) || !value.length) return;

        return value[0].id === Enum.InvestmentStatusEnum.ClosedSubscriptionRedemption;
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

}
