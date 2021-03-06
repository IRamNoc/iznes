import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgRedux, select } from '@angular-redux/store';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';
import * as _ from 'lodash';
import * as model from '../OfiNav';
import { OfiManageNavPopupService, ManageNavCloseEvent } from '../ofi-manage-nav-popup/service';
import { OfiNavService } from '../../ofi-req-services/ofi-product/nav/service';
import {
    clearRequestedNavFundsList,
    getOfiNavFundsListCurrentRequest,
    ofiSetCurrentNavFundsListRequest,
    ofiSetCurrentNavFundViewRequest,
} from '../../ofi-store/ofi-product/nav';
import {
    APP_CONFIG,
    AppConfig,
    FileDownloader,
    MoneyValuePipe,
    NumberConverterService,
    ConfirmationService,
} from '@setl/utils';
import { MultilingualService } from '@setl/multilingual';
import { AlertsService } from '@setl/jaspero-ng2-alerts/src/alerts.service';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import { PermissionsService } from '@setl/utils/services/permissions';
import { ClrDatagrid } from '@clr/angular';

const ADMIN_USER_URL = '/net-asset-value';

@Component({
    selector: 'app-nav-manage-list',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
})
export class OfiNavFundsList implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('dataGrid') public dataGrid: ClrDatagrid;

    shareListItems: any[];
    navListItems: model.NavModel[];
    socketToken: string;
    userId: number;

    searchForm: FormGroup;
    dateTypes: any[];
    dateConfig = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: null,
    };
    isNavUploadModalDisplayed: boolean;
    navCsvFile: any;
    hasResult: boolean;

    @ViewChild('globalNavCsvFile')
    globalNavCsvFile: any;

    navPopupMode: model.NavPopupMode = model.NavPopupMode.ADD;

    appConfig: AppConfig;
    currencyList: any[];

    public hasPermissionCreateNav: boolean = false;
    public hasPermissionUpdateNav: boolean = false;
    public hasPermissionDeleteNav: boolean = false;
    public showColumnSpacer: boolean = true;

    private cancelNavTitle: string;
    private cancelNavMessage: string;
    private cancelNavSuccessMessage: string;
    private cancelNavErrorMessage: string;

    get isIznesAdmin(): boolean {
        return this.router.url.startsWith(ADMIN_USER_URL);
    }

    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundsList', 'requested']) navRequestedOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiManageNav', 'ofiNavFundsList', 'navFundsList']) navListOb: Observable<any>;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currenciesObs;
    @select(['user', 'authentication', 'token']) tokenOb;
    @select(['user', 'myDetail']) userOb;
    @select(['user', 'siteSettings', 'language']) requestLanguageOb;

    private subscriptionsArray: Subscription[] = [];

    constructor(
        private router: Router,
        private redux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private ofiNavService: OfiNavService,
        private numberConverterService: NumberConverterService,
        private moneyPipe: MoneyValuePipe,
        private popupService: OfiManageNavPopupService,
        private alertService: AlertsService,
        private confirmationService: ConfirmationService,
        private ofiCurrenciesService: OfiCurrenciesService,
        private fileDownloader: FileDownloader,
        private route: ActivatedRoute,
        public permissionsService: PermissionsService,
        public translate: MultilingualService,
        @Inject(APP_CONFIG) appConfig: AppConfig) {
        this.appConfig = appConfig;
        this.isNavUploadModalDisplayed = false;
        this.navCsvFile = null;
        this.hasResult = true;
        this.ofiCurrenciesService.getCurrencyList();
    }

    ngOnInit() {
        this.initDataTypes();
        this.initSearchForm();
        this.initSubscriptions();
        this.initTranslations();

        this.permissionsService.hasPermission('manageNav', 'canInsert').then(
            (hasPermission) => {
                this.hasPermissionCreateNav = hasPermission;
            });

        this.permissionsService.hasPermission('manageNav', 'canUpdate').then(
            (hasPermission) => {
                this.hasPermissionUpdateNav = hasPermission;
            });

        this.permissionsService.hasPermission('manageNav', 'canDelete').then(
            (hasPermission) => {
                this.hasPermissionDeleteNav = hasPermission;
            });
    }

    ngAfterViewInit() {
        this.resizeDatagrid();
    }

    /**
     * Resizes the datagrid and removes the spacer elements
     * The column space elements are a bit of a hack to get the Datagrid to correctly set the cell size
     * hopefully this will be fixed in a Clarity update soon...
     */
    public resizeDatagrid() {
        setTimeout(
            () => {
                this.dataGrid.resize();
                this.showColumnSpacer = false;
            },
            200,
        );
    }

    /**
     * Returns a single line of text to space the datagrid column correctly
     * Strips all non-alphanumeric characters and replaces them with '_'
     * @param text
     */
    public getColumnSpaceText(text: string) {
        return typeof text === 'string' ? text.replace(/[\W_]+/g, '_') : text;
    }

    private initTranslations(): void {
        this.cancelNavTitle = this.translate.translate('Cancel NAV');
        this.cancelNavErrorMessage = this.translate.translate('Could not cancel NAV. Open orders may exist.');
        this.cancelNavSuccessMessage = this.translate.translate('NAV successfully cancelled.');
    }

    /**
     * Returns message detailing missing permissions
     *
     * @returns {string}
     */
    public getPermissionMessage(): string {
        if (!this.hasPermissionCreateNav && !this.hasPermissionUpdateNav && !this.hasPermissionDeleteNav) {
            return this.translate.translate('Please contact the administrator to request permission to add, edit or cancel a NAV.');
        }

        if (this.hasPermissionCreateNav && !this.hasPermissionUpdateNav && !this.hasPermissionDeleteNav) {
            return this.translate.translate('Please contact the administrator to request permission to edit or cancel a NAV.');
        }

        if (this.hasPermissionCreateNav && this.hasPermissionUpdateNav && !this.hasPermissionDeleteNav) {
            return this.translate.translate('Please contact the administrator to request permission to cancel a NAV.');
        }

        if (!this.hasPermissionCreateNav && this.hasPermissionUpdateNav && !this.hasPermissionDeleteNav) {
            return this.translate.translate('Please contact the administrator to request permission to add or cancel a NAV.');
        }

        if (!this.hasPermissionCreateNav && this.hasPermissionUpdateNav && this.hasPermissionDeleteNav) {
            return this.translate.translate('Please contact the administrator to request permission to add a NAV.');
        }

        if (!this.hasPermissionCreateNav && !this.hasPermissionUpdateNav && this.hasPermissionDeleteNav) {
            return this.translate.translate('Please contact the administrator to request permission to add or edit a NAV.');
        }

        if (this.hasPermissionCreateNav && !this.hasPermissionUpdateNav && this.hasPermissionDeleteNav) {
            return this.translate.translate('Please contact the administrator to request permission to edit a NAV.');
        }
    }

    /**
     * Get the list of currencies from redux
     *
     * @param {Object[]} data
     * @memberof OfiNavFundView
     */
    getCurrencyList(data) {
        if (data) {
            this.currencyList = data.toJS();
        }
    }

    /**
     * Get the currency symbol
     *
     * @param {number} currencyId
     * @returns {string}
     * @memberof OfiNavFundView
     */
    getCurrencySymbol(currencyId: number): string {
        return model.CurrencySymbols[this.getCurrencyString(currencyId)];
    }

    /**
     * Get the label of the currency (3 characters)
     *
     * @param {number} currencyId
     * @returns {string}
     * @memberof OfiNavFundView
     */
    getCurrencyString(currencyId: number): string {
        try {
            return this.currencyList.find(v => v.id === currencyId).text || 'N/A';
        } catch (e) {
            return 'N/A';
        }
    }

    getNextValuationClass(nextValuationDate: string): string {
        const fromNow = moment(nextValuationDate).diff(moment());
        const duration = moment.duration(fromNow);
        const timeBetween = duration.asDays();

        if (timeBetween > 1 && timeBetween < 2) {
            return 'time-orange';
        } else if (timeBetween > 0 && timeBetween < 1) {
            return 'time-red';
        } else {
            return '';
        }
    }

    isNavNull(nav: number): boolean {
        return nav === null;
    }

    isAddNavDisabled(share: model.NavInfoModel): boolean {
        if (share.status as any == 3) return false;

        return share.status as any == -1;
        // return !this.isNavNull(share.nav);
    }

    addNav(share: model.NavInfoModel): void {
        this.popupService.open(share, model.NavPopupMode.ADD_EXISTING);
    }

    cancelNav(share: model.NavInfoModel): void {
        this.cancelNavMessage = this.translate.translate(
            'Are you sure you wish to cancel the NAV for @shareName@?',
            { 'shareName': share.fundShareName },
        );

        this.confirmationService.create(this.cancelNavTitle, this.cancelNavMessage)
            .subscribe((resolved) => {
                if (resolved.resolved) {
                    OfiNavService.defaultCancelNav(
                        this.ofiNavService,
                        this.redux,
                        {
                            token: this.socketToken,
                            shareId: share.shareId,
                            navDate: share.navDate,
                        },
                        res => this.onCancelNavSuccess(res),
                        () => this.onCancelNavError(),
                    );
                }
            });
    }

    private onCancelNavSuccess(res): void {
        if ((res[1]) && res[1].Data[0]) {

            if (res[1].Data[0].Status === 'Fail') return this.onCancelNavError();

            this.alertService.create('success', this.cancelNavSuccessMessage);

            this.clearRequestedList();
        }
    }

    private onCancelNavError(): void {
        this.alertService.create('error', this.cancelNavErrorMessage);
    }

    modifyNav(share: model.NavInfoModel): void {
        this.popupService.open(share, model.NavPopupMode.EDIT);
    }

    navigateToShare(shareId: number): void {
        const navFundViewRequest: any = getOfiNavFundsListCurrentRequest(this.redux.getState());
        navFundViewRequest.navDate = moment().format('YYYY-MM-DD 00:00:00');
        navFundViewRequest.shareId = shareId;

        this.redux.dispatch(ofiSetCurrentNavFundViewRequest(navFundViewRequest));

        this.router.navigate(['fund-view'], {relativeTo: this.route});
    }

    exportCSV(): void {
        const requestData = this.getRequestNavListData();

        this.fileDownloader.downLoaderFile({
            method: 'exportNavFundShares',
            token: this.socketToken,
            shareId: null,
            fundName: requestData.fundName,
            navDateField: requestData.navDateField,
            navDate: requestData.navDate,
            userId: this.userId,
        });
    }

    clearRequestedList(): void {
        this.redux.dispatch(clearRequestedNavFundsList());
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
        this.changeDetectorRef.detach();
    }

    handleUploadNavSubmitClick() {
        if (this.navCsvFile) {
            const reader = new FileReader();
            reader.readAsText(this.navCsvFile);

            reader.onload = () => {
                const payload = {
                    navData: JSON.stringify(reader.result),
                };

                this.ofiNavService.uploadNavFile(
                    'global',
                    payload,
                    this.redux,
                    res => this.handleUploadNavSuccess(res),
                    err => this.handleUploadNavFail(err),
                );

                this.hasResult = false;
            };
        }
    }

    handleUploadNavSuccess(res) {
        this.resetNavUploadModal();

        if (res) {
            const successMessage = res[1].Data[0].Message;

            this.alertService.create(
                'success',
                `
                <table class="table grid">
                    <tbody>
                        <tr>
                            <td class="text-center text-success">${this.translate.translate(successMessage)}</td>
                        </tr>
                    </tbody>
                </table>`,
                {},
                this.translate.translate('NAVs Upload - Success'),
            );
        }
    }

    handleUploadNavFail(err) {
        this.resetNavUploadModal();

        if (err) {
            const errorMessage = err[1].Data[0].Message;

            this.alertService.create(
                'error',
                `
                <table class="table grid">
                    <tbody>
                        <tr>
                            <td class="text-center text-danger">${this.translate.translate('NAVs upload has failed for the following reason:')}</td>
                        </tr>
                        <tr>
                            <td class="text-center text-danger">${this.translate.translate(errorMessage)}</td>
                        </tr>
                    </tbody>
                </table>`,
                {},
                this.translate.translate('NAVs Upload - Error'),
            );
        }
    }

    resetNavUploadModal() {
        this.globalNavCsvFile.nativeElement.value = '';
        this.navCsvFile = null;
        this.isNavUploadModalDisplayed = false;
        this.hasResult = true;

        this.changeDetectorRef.markForCheck();
    }

    private initSubscriptions(): void {
        this.subscriptionsArray.push(this.navRequestedOb.subscribe((requested) => {
            this.requestNavList(requested);
        }));
        this.subscriptionsArray.push(this.navListOb.subscribe((navList) => {
            this.updateNavList(navList);
        }));
        this.subscriptionsArray.push(this.tokenOb.subscribe((token) => {
            this.socketToken = token;
        }));
        this.subscriptionsArray.push(this.userOb.subscribe((user) => {
            this.userId = user.userId;
        }));

        this.subscriptionsArray.push(this.currenciesObs.subscribe(c => this.getCurrencyList(c)));

        this.subscriptionsArray.push(this.requestLanguageOb.subscribe(() => {
            this.initDataTypes();
            this.initTranslations();
            this.initSearchForm();
        }));
    }

    private initSearchForm(): void {
        this.searchForm = new FormGroup({
            shareName: new FormControl(''),
            dateType: new FormControl([this.dateTypes[0]]),
            date: new FormControl(moment().format('YYYY-MM-DD')),
        });

        // this.subscriptionsArray.push(this.searchForm.valueChanges.debounceTime(1000).subscribe(() => {
        this.subscriptionsArray.push(this.searchForm.valueChanges.subscribe(() => {
            if (this.searchForm.value.date.match('([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))')) {
                this.clearRequestedList();
            }
        }));
    }

    /**
     * request the nav list
     * @param requested boolean
     * @return void
     */
    private requestNavList(requested: boolean): void {
        if (requested) return;

        this.changeDetectorRef.detectChanges();

        const requestData = this.getRequestNavListData();

        OfiNavService.defaultRequestNavList(this.ofiNavService, this.redux, requestData);

        this.redux.dispatch(ofiSetCurrentNavFundsListRequest(requestData));
    }

    private getRequestNavListData(): any {
        return {
            fundName: this.searchForm.value.shareName,
            navDateField: this.searchForm.value.dateType[0].id,
            navDate: `${this.searchForm.value.date} 00:00:00`,
        };
    }

    /**
     * update the nav list
     * @param navList NavList
     * @return void
     */
    private updateNavList(navList: model.NavModel[]): void {
        this.navListItems = _.orderBy(this.processNavList(navList), ['shareId'], ['desc']);
        this.changeDetectorRef.markForCheck();
    }

    private processNavList(navList: model.NavModel[]): model.NavModel[] {
        const uniques = _.uniqBy(navList, (e) => {
            return e.fundShareName;
        });

        _.forEach(uniques, (item: model.NavModel) => {
            if (item.navValidated) {
                item.nav = item.navValidated;
            } else if (item.navTechnical) {
                item.nav = item.navTechnical;
            } else {
                item.nav = item.navEstimated;
            }
        });

        return uniques;
    }

    private navToFrontEndString(nav: number): string {
        return this.moneyPipe.transform(this.numberConverterService.toFrontEnd(nav), 4);
    }

    private initDataTypes(): void {
        this.dateTypes = this.translate.translate([
            {
                id: 'navDate',
                text: 'NAV Date',
            },
            {
                id: 'navPubDate',
                text: 'NAV Published Date',
            },
        ]);
    }
}
