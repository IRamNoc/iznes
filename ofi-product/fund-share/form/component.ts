import {
    forkJoin,
    Subscription,
} from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { take, takeUntil, filter, map, switchMap } from 'rxjs/operators';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    Inject,
    AfterViewInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import * as _ from 'lodash';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { ToasterService } from 'angular2-toaster';
import { ClrTabs } from '@clr/angular';
import { ConfirmationService, ClrTabsHelper } from '@setl/utils';
import { DynamicFormComponent } from '@setl/utils/components/dynamic-forms/';
import { Location } from '@angular/common';

import { setRequestedIznesFunds } from '@ofi/ofi-main/ofi-store/ofi-product/fund';
import { setRequestedUmbrellaFund } from '@ofi/ofi-main/ofi-store/ofi-product/umbrella-fund';
import { ManagementCompanyState } from '@ofi/ofi-main/ofi-store/ofi-product';
import {
    clearRequestedFundShare,
    OfiFundShare,
} from '@ofi/ofi-main/ofi-store/ofi-product/fund-share';
import {
    clearRequestedFundShareDocs,
    OfiFundShareDocuments,
    setCurrentFundShareDocsRequest,
} from '@ofi/ofi-main/ofi-store/ofi-product/fund-share-docs';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { OfiUmbrellaFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/umbrella-fund/service';
import {
    OfiManagementCompanyService,
} from '@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service';
import { FundShare, FundShareMode, PanelData, userTypeEnum } from '../model';
import { OfiFundShareFormService } from './service';
import { FundShareTestData } from './TestData';
import * as Enum from '../FundShareEnum';
import { FundShareTradeCycleModel } from './trade-cycle/model';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import { MultilingualService } from '@setl/multilingual';
import {
    StepsHelper,
    ShareCreationStep,
} from '@ofi/ofi-main/ofi-product/fund-share/form/StepsHelper';

@Component({
    styleUrls: ['./component.scss'],
    selector: 'app-ofi-am-product-fund-share',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FundShareComponent implements OnInit, AfterViewInit, OnDestroy {
    private fundShareData: OfiFundShare;
    private fundShareDocsData: OfiFundShareDocuments;
    isReady: boolean = false;
    model: FundShare;
    mode: FundShareMode = FundShareMode.Create;

    // ID of the share to hydrate the model with
    prefill: number;
    userType: userTypeEnum;
    private fundList;
    fundListItems = [];
    shareListItems = [];
    private umbrellaFundList;
    private managementCompanyList;
    private countriesEnum;

    private fundShareId: number;
    private fundID: number;
    private panels: { [key: string]: any } = new PanelData();
    private iznShareList;
    private errorHelper: StepsHelper;

    selectFundForm: FormGroup;
    shareControl = new FormControl([]);
    currDraft: number;

    unSubscribe: Subject<any> = new Subject();

    private isSubscribedDynamicFormValueChanges: boolean = false;

    @ViewChild('calendarSubscriptionForm')
    private calendarSubscriptionForm: DynamicFormComponent;

    @ViewChild('calendarRedemptionForm')
    private calendarRedemptionForm: DynamicFormComponent;

    @ViewChild('tabsRef') tabsRef: ClrTabs;
    @ViewChild('fundHolidayInput') fundHolidayInput;
    @ViewChild('tradeCycleSubscription') tradeCycleSubscription;
    @ViewChild('tradeCycleRedemption') tradeCycleRedemption;
    @ViewChild('documentsMandatory') documentsMandatory;
    @ViewChild('documentsOptional') documentsOptional;

    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'requested']) fundShareRequestedOb;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) fundShareOb;
    @select(['ofi', 'ofiProduct', 'ofiFundShareDocs', 'requested']) fundShareDocsRequestedOb;
    @select(['ofi', 'ofiProduct', 'ofiFundShareDocs', 'fundShareDocuments']) fundShareDocsOb;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) shareListObs;
    @select(['user', 'myDetail']) userDetailOb;
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundListOb;
    @select(['ofi', 'ofiProduct', 'ofiUmbrellaFund', 'umbrellaFundList', 'umbrellaFundList']) umbrellaFundListOb;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany']) managementCompanyListOb;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currenciesObs;
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
        private ofiFundShareFormService: OfiFundShareFormService,
        private ofiCurrenciesService: OfiCurrenciesService,
        private fb: FormBuilder,
        public translate: MultilingualService,
        private location: Location,
        @Inject('product-config') productConfig,
    ) {
        this.countriesEnum = productConfig.fundItems.domicileItems;
        this.ofiCurrenciesService.getCurrencyList();

        this.selectFundForm = this.fb.group({
            fund: [],
            domicile: [{ value: '', disabled: true }],
            lei: [{ value: '', disabled: true }],
        });

        this.errorHelper = new StepsHelper(this.translate);
    }

    ngOnInit() {
        this.model = new FundShare();
        this.initSubscriptions();

        this.redux.dispatch(clearRequestedFundShare());
        this.redux.dispatch(clearRequestedFundShareDocs());
    }

    ngAfterViewInit() {
    // ngDoCheck() {
        this.isCalendar();
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

    private initSubscriptions(): void {
        this.userDetailOb
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((userDetail) => {
            this.model.accountId = userDetail.accountId;
            this.userType = userDetail.userType;

            if (this.userType === userTypeEnum.INVESTOR) {
                this.mode = FundShareMode.Read;
                this.model.disableAllShareFields();
                this.ofiManagementCompanyService.fetchInvestorManagementCompanyList();
            } else {
                this.ofiManagementCompanyService.getManagementCompanyList();
                this.ofiFundService.getFundList();
            }
        });

        this.route.queryParams
        .pipe(
            filter(v => v.prefill || v.fund),
            takeUntil(this.unSubscribe),
        )
        .subscribe((params) => {
            this.mode = FundShareMode.Create;
            if (params.prefill) {
                this.prefill = Number(params.prefill);
                this.fundShareId = this.prefill;
            } else if (params.fund) {
                this.fundID = Number(params.fund);
                this.model.fundID = this.fundID;
            }
        });

        this.route.paramMap
        .pipe(
            filter(v => !!v.get('shareId') as any),
            takeUntil(this.unSubscribe),
        )
        .subscribe((params) => {
            const fundShareId = params.get('shareId') as any;
            this.fundShareId = fundShareId ? parseInt(fundShareId, 10) : fundShareId;
            this.prefill = null;

            if (this.userType === userTypeEnum.AM && this.fundShareId) {
                this.model.fundShareId = parseInt(fundShareId, 10);
                this.mode = FundShareMode.Update;
                if (this.currDraft !== 1) {
                    this.model.keyFacts.mandatory.fundShareName.disabled = true;
                    this.model.keyFacts.mandatory.isin.disabled = true;
                }
            }

            // if (this.mode === FundShareMode.Create) {
            //     this.model = FundShareTestData.generate(new FundShare());
            // }
        });

        // Hydrates the duplicate share select
        this.route.queryParams
        .pipe(
            filter(v => !!v.prefill),
            switchMap(() => this.shareListObs),
            filter(v => Object.keys(v).length !== 0),
            takeUntil(this.unSubscribe),
        )
        .subscribe((shareList) => {
            if (!shareList || !this.shareListItems) {
                return;
            }

            this.shareControl.setValue(
                [_.find(this.shareListItems, { id: this.prefill.toString() })],
                { emitEvent: false },
            );
        });

        this.selectFundForm.controls.fund.valueChanges
        .pipe(
            takeUntil(this.unSubscribe),
        )
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
        });

        this.shareControl.valueChanges
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((v) => {
            if (!v || !v.length) {
                this.model.resetFundShare();
            } else {
                const id = Number(v[0].id);
                const newShare = this.iznShareList[id];
                this.model.updateFundShare(newShare, true);

                this.selectFundForm.controls.fund.setValue(
                    [_.find(this.fundListItems, { id: newShare.fundID.toString() })],
                );

                const newFund = this.fundList[newShare.fundID];
                const newUmbrella = newFund.umbrellaFundID
                    ? this.umbrellaFundList[newFund.umbrellaFundID]
                    : null;

                this.model.updateFund(newFund);
                this.model.updateUmbrella(newUmbrella);
            }

            this.fundHolidayInput.markForCheck();
            this.tradeCycleSubscription.markForCheck();
            this.tradeCycleRedemption.markForCheck();
            this.changeDetectorRef.markForCheck();
            this.changeDetectorRef.detectChanges();
        });

        this.currenciesObs
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe(c => this.getCurrencyList(c));

        this.managementCompanyListOb
        .pipe(
            map((v: ManagementCompanyState) => {
                return {
                    ...v.managementCompanyList.managementCompanyList,
                    ..._.keyBy(v.investorManagementCompanyList.investorManagementCompanyList.toJS(), 'companyID'),
                };
            }),
            takeUntil(this.unSubscribe),
        )
        .subscribe((list) => {
            this.getManagementCompanyList(list);

            this.model.fund.managementCompany.listItems = this.managementCompanyList;
            this.model.umbrella.managementCompanyID.listItems = this.managementCompanyList;
        });

        this.userDetailOb
        .pipe(
            filter(v => !!v),
            switchMap(() => this.fundShareRequestedOb),
            filter(requested => !requested),
            takeUntil(this.unSubscribe),
        )
        .subscribe(() => {
            if (this.userType === userTypeEnum.AM) {
                this.ofiFundShareService.fetchIznesShareList();
            } else if (this.userType === userTypeEnum.INVESTOR) {
                this.ofiFundShareService.fetchInvestorShareByID(this.fundShareId);
            }
        });

        this.userDetailOb
        .pipe(
            take(2),
            filter(v => !!v),
            switchMap(() => this.fundShareOb),
            filter(v => Object.keys(v).length !== 0),
            takeUntil(this.unSubscribe),
        )
        .subscribe((fundShares) => {
            const fundShare = fundShares[this.fundShareId];
            if (!fundShare) {
                return;
            }

            this.updateFundShare(fundShare);
            this.model.setFundShare(fundShare, !!this.prefill);

            if (this.isCreate() && !this.prefill || !this.model.isReady()) {
                return;
            }

            this.model.updateFundShare(fundShare, !!this.prefill);
            if (this.isRead()) {
                this.ofiFundService.fetchFundByID(fundShare.fundID);
            }
        });

        this.userDetailOb
        .pipe(
            filter(v => !!v),
            switchMap(() => this.fundShareDocsRequestedOb),
            filter(requested => !requested),
            takeUntil(this.unSubscribe),
        )
        .subscribe(() => {
            if (!this.isCreate() || this.prefill) {
                this.ofiFundShareService.fetchFundShareDocs(this.fundShareId);
            }
        });

        this.fundShareDocsOb
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((fundShareDocs) => {
            if (this.fundShareId === fundShareDocs.fundShareID || this.prefill) {
                this.updateFundShareDocs(fundShareDocs);
            }
        });

        this.shareListObs
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((fundShareList) => {
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
        });

        this.userDetailOb
        .pipe(
            filter(v => !!v),
            switchMap(() => this.fundShareOb),
            filter(v => Object.keys(v).length !== 0),
            switchMap(() => this.fundListOb),
            filter(v => Object.keys(v).length !== 0),
            takeUntil(this.unSubscribe),
        )
        .subscribe((fund) => {
            this.updateFundList(fund);

            this.selectFundForm.setValue(
                {
                    fund: [{
                        id: this.model.fundID,
                        text: this.fund.fundName,
                    }],
                    domicile: _.find(this.countriesEnum, { id: this.fund.domicile }).text,
                    lei: this.model.fund.LEI.preset || 'N/A',
                },
                { emitEvent: false },
            );

            this.isCreate() && !this.prefill || !this.model.isReady()
                ? this.model.setFund(this.fund)
                : this.model.updateFund(fund[this.model.fundID], null);

            if (!this.fund.umbrellaFundID) {
                return;
            }

            this.isRead()
                ? this.ofiUmbrellaFundService.fetchUmbrellaByID(fund[this.model.fundID].umbrellaFundID)
                : this.ofiUmbrellaFundService.fetchUmbrellaList();
        });

        this.route.queryParams
        .pipe(
            filter(v => v.fund),
            switchMap(() => this.userDetailOb),
            filter(v => !!v),
            switchMap(() => this.fundListOb),
            filter(v => Object.keys(v).length !== 0),
            takeUntil(this.unSubscribe),
        )
        .subscribe((fund) => {
            const currentFund = fund[this.model.fundID];
            this.model.setFund(currentFund);
            this.selectFundForm.setValue(
                {
                    fund: [{
                        id: this.model.fundID,
                        text: currentFund.fundName,
                    }],
                    domicile: _.find(this.countriesEnum, { id: currentFund.domicile }).text,
                    lei: currentFund.LEI || 'N/A',
                },
                { emitEvent: false },
            );
            this.ofiUmbrellaFundService.fetchUmbrellaList();
        });

        this.userDetailOb
        .pipe(
            filter(v => !!v),
            switchMap(() => this.fundListOb),
            filter(v => Object.keys(v).length !== 0),
            switchMap(() => this.umbrellaFundListOb),
            filter(v => Object.keys(v).length !== 0),
            takeUntil(this.unSubscribe),
        )
        .subscribe((umbrella) => {
            this.updateUmbrellaFundList(umbrella);
            if (this.hasUmbrellaFund()) {
                this.isCreate() && !this.prefill || !this.model.isReady()
                    ? this.model.setUmbrellaFund(umbrella[this.model.umbrellaFundID])
                    : this.model.updateUmbrella(umbrella[this.model.umbrellaFundID]);
            }
        });

        this.productionOb
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe((production) => {
            this.model.isProduction = production;

            if (!this.model.isProduction) {
                this.model.documents.mandatory.kiid.required = false;
                this.model.documents.mandatory.prospectus.required = false;
            }
        });

        this.ofiFundShareFormService.subscribeToSteps((step) => {
            const stepObj = (this.errorHelper.steps(step.Step) as ShareCreationStep);
            const message = stepObj ? stepObj.message : '';
            const stepNo = step.Step === 9 ? 100 : step.Step * 10;

            this.alerts.updateView('info', this.getSaveShareText(message, stepNo));
        });

        this.isReady = true;

        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
        return;
    }

    private getCurrencyList(data): void {
        if (!data) {
            return;
        }

        const currencies = data.toJS();

        this.model.fund.currency.listItems = currencies;

        // Key facts
        this.model.keyFacts.mandatory.shareClassCurrency.listItems = currencies;
        this.model.keyFacts.optional.indexCurrency.listItems = currencies;

        // Characteristics
        this.model.characteristic.mandatory.subscriptionCurrency.listItems = currencies;
        this.model.characteristic.mandatory.redemptionCurrency.listItems = currencies;

        this.changeDetectorRef.markForCheck();
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

    loadUI(): boolean {
        return this.isReady;
    }

    hasUmbrellaFund(): boolean {
        return this.model.umbrellaFundID > 0;
    }

    calendarSubscriptionModelEvent(model: FundShareTradeCycleModel): void {
        this.model.calendarSubscription.subscriptionTradeCycle = model;
        if (this.isRead()) {
            this.model.calendarSubscription.subscriptionTradeCycle.disable();
            this.model.calendarSubscription.subscriptionTradeCycle.clearAllValidators();
        }
        if (this.fundShareData) this.model.setSubscriptionTradeCycleData(this.fundShareData);
    }

    calendarRedemptionModelEvent(model: FundShareTradeCycleModel): void {
        this.model.calendarRedemption.redemptionTradeCycle = model;
        if (this.isRead()) {
            this.model.calendarRedemption.redemptionTradeCycle.disable();
            this.model.calendarRedemption.redemptionTradeCycle.clearAllValidators();
        }
        if (this.fundShareData) this.model.setRedemptionTradeCycleData(this.fundShareData);
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
     * get the fund list
     * @param navList NavList
     * @return void
     */
    private updateFundList(fundList: any): void {
        if (!fundList || Object.keys(fundList).length === 0) return;

        this.fundList = fundList ? fundList : undefined;

        this.fundListItems = Object.keys(fundList).map((id) => {
            if (fundList[id].draft == 0) {
                return {
                    id,
                    text: fundList[id].fundName,
                };
            }
        });

        if (this.fundList) {
            this.redux.dispatch(setRequestedIznesFunds());
        }

        this.changeDetectorRef.markForCheck();
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

        if (this.currDraft == 1) {
            this.model.keyFacts.mandatory.fundShareName.disabled = false;
            this.model.keyFacts.mandatory.isin.disabled = false;
        }

        this.changeDetectorRef.detectChanges();
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
     * process the list of management companies
     * @param list any
     * @return void
     */
    private getManagementCompanyList(list) {
        const listIndexes = Object.keys(list);

        if (!listIndexes) {
            this.managementCompanyList = [];
            return;
        }

        const managementCompanyListItems = listIndexes.map((idx) => {
            return {
                id: list[idx].companyID || 0,
                text: list[idx].companyName || '',
            };
        });

        this.managementCompanyList = managementCompanyListItems;
    }

    /**
     * save the fund share (this is used for create and update)
     * @return void
     */
    saveFundShare(): void {
        const request = this.model.getRequest(0);
        if (this.isCreate() || this.currDraft == 1) {

            if (this.isCreate()) request.fundShareID = null;

            this.alerts.create('info', this.getSaveShareText('', 0), {
                showCloseButton: false,
                overlayClickToClose: false,
            });

            OfiFundShareService
            .defaultCreateFundShare(
                this.ofiFundShareService,
                this.redux,
                request,
                (data: any) => (this.isCreate() ? this.onCreateSuccess(data[1].Data, 0) : this.onUpdateSuccess(data[1].Data, 0)),
                (e: any) => this.onCreateError(e[1].Data[0], 0),
            );
        } else {
            OfiFundShareService
            .defaultUpdateFundShare(
                this.ofiFundShareService,
                this.redux,
                request,
                (data: any) => this.onUpdateSuccess(data[1].Data, 0),
                (e: any) => this.onUpdateError(0),
            );
        }
    }

    private getSaveShareText(message: string, progress: number): string {
        return `<table class="table grid">
            <tbody>
                <tr>
                    <td class="text-center text-info">
                        ${this.translate.translate('Creating Fund Share')}.
                        <br />
                        <i>` + message + `</i>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="progress-bar">
            <span class="progress-` + progress + `"></span>
        </div>`;
    }

    /**
     * save the draft fund share (this is used for create and update)
     * @return void
     */
    saveDraft(): void {
        const request = this.model.getRequest(1);

        if (this.mode === FundShareMode.Create) {
            OfiFundShareService
            .defaultCreateFundShare(
                this.ofiFundShareService,
                this.redux,
                request,
                (data: any) => this.onCreateSuccess(data[1].Data, 1),
                (e: any) => this.onCreateError(e[1].Data[0], 1),
            );
        } else {
            OfiFundShareService
            .defaultUpdateFundShare(
                this.ofiFundShareService,
                this.redux,
                request,
                (data: any) => this.onUpdateSuccess(data[1].Data, 1),
                (e: any) => this.onUpdateError(1),
            );
        }
    }

    private onCreateSuccess(data, draft: number): void {
        data = data[0];
        if (data.Status === 'Fail') {
            this.onCreateError(data, draft);
            return;
        }

        OfiFundShareService
        .defaultCreateFundShareDocuments(
            this.ofiFundShareService,
            this.redux,
            this.model.getDocumentsRequest(data.fundShareID),
            () => this.onCreateDocumentsSuccess(data, draft),
            (e: any) => this.onCreateError(e[1].Data[0], draft),
        );
    }

    private onCreateDocumentsSuccess(data, draft: number): void {
        let message;

        if (draft) {
            message = this.translate.translate(
                '@fundShareName@ draft has been successfully created',
                { 'fundShareName': data.fundShareName },
            );
        } else {
            message = this.translate.translate(
                '@fundShareName@ has been successfully created',
                { 'fundShareName': data.fundShareName },
            );
        }

        this.toaster.pop('success', message);

        this.router.navigateByUrl('product-module/product');
    }

    private onCreateError(e, draft: number): void {
        let message: string;

        if (e && e.Step !== undefined) {
            message = `(#${e.Step}) ` + (this.errorHelper.steps(e.Step) as ShareCreationStep).error;
        } else if (e && e.Message) {
            message = e.Message;
        }

        this.alerts.create('error', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-danger"><b>${this.translate.translate('An error occurred')}</b><br />
                        <i>${this.translate.translate(message)}</i></td>
                    </tr>
                </tbody>
            </table>
        `);
    }

    private onUpdateSuccess(data, draft: number): void {
        data = (!!data[0] ? data[0] : data);

        OfiFundShareService
        .defaultUpdateFundShareDocuments(
            this.ofiFundShareService,
            this.redux,
            this.model.getDocumentsRequest(data.fundShareID),
            () => this.onUpdateDocumentSuccess(draft),
            (e: any) => this.onUpdateError(draft),
        );
    }

    private onUpdateDocumentSuccess(draft: number): void {
        let message;

        if (draft) {
            message = this.translate.translate(
                '@fundShareName@ draft has been successfully updated',
                { 'fundShareName': this.model.keyFacts.mandatory.fundShareName.value() },
            );
        } else {
            message = this.translate.translate(
                '@fundShareName@ has been successfully updated',
                { 'fundShareName': this.model.keyFacts.mandatory.fundShareName.value() },
            );
        }

        this.toaster.pop(
            'success',
            message,
        );

        this.router.navigateByUrl('product-module/product');
    }

    private onUpdateError(draft: number): void {
        let message;

        if (draft) {
            message = this.translate.translate(
                '@fundShareName@ draft could not be updated',
                { 'fundShareName': this.model.keyFacts.mandatory.fundShareName.value() },
            );
        } else {
            message = this.translate.translate(
                '@fundShareName@ could not be updated',
                { 'fundShareName': this.model.keyFacts.mandatory.fundShareName.value() },
            );
        }

        this.toaster.pop(
            'error',
            message,
        );
    }

    /**
     * cancel and leave the fund share (this is used for create and update)
     * @return void
     */
    cancelFundShare(): void {
        if (this.isRead()) {
            this.location.back();
            return;
        }

        this.confirmationService.create(
            `<span>${this.translate.translate('Are you sure?')}</span>`,
            `<span>${this.translate.translate('Any Fund Share data you have entered will be lost.')}</span>`,
            { confirmText: this.translate.translate('Confirm'), declineText: this.translate.translate('Cancel') },
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

    isRead(): boolean {
        return this.mode === FundShareMode.Read;
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
        this.changeDetectorRef.markForCheck();
        this.changeDetectorRef.detectChanges();
    }

    isCalendar() {
        if (this.calendarSubscriptionForm && this.calendarRedemptionForm && !this.isSubscribedDynamicFormValueChanges) {
            console.log('+++ this.calendarSubscriptionForm: ', this.calendarSubscriptionForm);
            this.isSubscribedDynamicFormValueChanges = true;

            this.calendarSubscriptionForm.form.controls['subscriptionCutOffTimeZone'].valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((d) => {
                console.log('+++ subscriptionCutOffTimeZone: ', d);
            });

            this.calendarRedemptionForm.form.controls['redemptionCutOffTimeZone'].valueChanges
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((d) => {
                console.log('+++ redemptionCutOffTimeZone: ', d);
            });
        }
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
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }
}
