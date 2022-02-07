import { OnInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { select } from '@angular-redux/store';
import { MultilingualService } from '@setl/multilingual';
import { List } from 'immutable';
import { combineLatest } from 'rxjs'
import * as moment from 'moment';
import { ToasterService, Toast } from 'angular2-toaster';
import { Subject } from 'rxjs/Subject';
import { filter, takeUntil, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { OfiManagementCompanyService } from '../../ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiReportsService } from '../../ofi-req-services/ofi-reports/service';
import { OfiCurrenciesService } from '../../ofi-req-services/ofi-currencies/service';
import { InvestorHoldingRequestData, InvestorGenerateAICRequestData } from '@ofi/ofi-main/ofi-req-services/ofi-reports/model';
import { OfiSubPortfolioService } from './../../../ofi-main/ofi-sub-portfolio/sub-portfolio/service'
@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})
export class MyHoldingsComponent implements OnInit, OnDestroy {
    toastTimer;
    timerToast: Toast;
    toasterConfig: any = {
        type: 'warning',
        title: '',
        timeout: 0,
        tapToDismiss: false,
    };
    currencyList = [];
    investorManagementCompanyList = [];
    holdingList: Array<any>;
    searchForm: FormGroup;
    aicForm: FormGroup;
    unSubscribe: Subject<any> = new Subject();
    language = 'en';
    managementCompanyList: any[] = [];
    allCompaniesList: any[] = [];

    // modal
    showGenerateAIC = false;

    public subportfolioListData: Array<any>;
    public sharesList: Array<any>;
    shareISIN: string = "";
    selectedWalletId: any;
    selectedSubportfolio: any = "";
    validationMaxDate = moment();

    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['user', 'siteSettings', 'language']) language$;
    @select(['user', 'myDetail', 'accountId']) accountId$;
    @select(['ofi', 'ofiCurrencies', 'loaded']) loaded$;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currencyList$;
    @select(['ofi', 'ofiReports', 'amHolders', 'invRequested']) investorHoldingRequested;
    @select(['ofi', 'ofiReports', 'amHolders', 'invHoldingsList']) investorHoldingList$;
    @select([
        'ofi',
        'ofiProduct',
        'ofiManagementCompany',
        'investorManagementCompanyList',
        'investorManagementCompanyList',
    ]) investorManagementCompany$;

    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private fb: FormBuilder,
        private currenciesService: OfiCurrenciesService,
        private managementCompanyService: OfiManagementCompanyService,
        private ofiReportsService: OfiReportsService,
        private translate: MultilingualService,
        private ofiSubPortfolioService: OfiSubPortfolioService,
        private toaster: ToasterService,
    ) {}

    ngOnInit(): void {
        this.initCompanies();
        this.initForm();
        this.initSubscriptions();
        this.managementCompanyService.fetchInvestorManagementCompanyList();
    }

    ngOnDestroy(): void {
        this.searchForm.get('search').patchValue(['']);
        this.holdingList.splice(0, this.holdingList.length);
        this.ofiReportsService.clearInvestorHoldingList();

        this.unSubscribe.next();
        this.unSubscribe.complete();
        this.changeDetectorRef.detach();
    }

    initCompanies() {
        this.allCompaniesList = [{
            id: -1,
            text: this.translate.translate('All Asset Management Companies'),
        }];
    }
    // Datepicker config
    fromConfigDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,

    };

    initForm() {
        this.holdingList = [];
        this.searchForm = this.fb.group({
            search: ['', Validators.required],
        });

        this.aicForm = this.fb.group({
            fromDate: [ moment().format('YYYY-MM-DD'), Validators.required ],
            isinCode: ['', Validators.required],
            subportfolio: ['', Validators.required],
            fundShare: ['', Validators.required],
        });

        this.changeDetectorRef.detectChanges();
    }

    initSubscriptions() {
        this.ofiSubPortfolioService.getSubPortfolioData()
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((data) => {
                const defaultList: any[] = [{
                    id: -1,
                    text: this.translate.translate('All subporfolios'),
                    option: 'all',
                }];
                
                if (data) {
                    this.subportfolioListData = defaultList.concat(_.map(data, (subportfolio, index) => {
                        return  {
                            id: index,
                            text: subportfolio.label,
                            option: subportfolio.addr,
                        }
                    }));
                }
            });
        this.ofiSubPortfolioService.updateSubPortfolioObservable();

        this.language$
            .pipe(
                takeUntil(this.unSubscribe),
            )
            .subscribe((language) => {
                this.language = language;
                this.initCompanies();
                this.formatManagementCompanyList();
            });

        this.currencyList$
            .pipe(
                switchMap(() => this.loaded$),
                filter((loaded) => !loaded),
                takeUntil(this.unSubscribe),
            )
            .subscribe(() => this.currenciesService.getCurrencyList());

        this.currencyList$
            .pipe(filter((v: List<any>) => v && v.size > 0), takeUntil(this.unSubscribe))
            .subscribe((d) => this.currencyList = d.toJS());

        this.accountId$
            .pipe(
                filter(accountId => accountId && accountId !== 0),
                takeUntil(this.unSubscribe),
            )
            .subscribe(accountId => this.managementCompanyService.setAccountId(accountId));

        combineLatest(
            this.accountId$,
            this.connectedWallet$,
            this.searchForm.valueChanges,
        ).pipe(
            filter(([accountId, walletId, selectedItem]) => accountId && accountId !== 0 && walletId && selectedItem.search.length),
            takeUntil(this.unSubscribe),
        )
            .subscribe(([accountId, selectedWalletId, selectedItem]) => {
                this.selectedWalletId = selectedWalletId;

                const payload: InvestorHoldingRequestData = {
                    amCompanyID: selectedItem.search[0].id,
                    walletID: Number(selectedWalletId),
                    accountID: Number(accountId),
                };

                this.ofiReportsService.fetchInvestorHoldingList(payload);
            });

        this.investorManagementCompany$
            .pipe(
                filter((v: List<any>) => v && v.size > 0),
                takeUntil(this.unSubscribe),
            )
            .subscribe(d => {
                this.managementCompanyList = d.toJS();
                this.formatManagementCompanyList();
            });

        combineLatest(
            this.investorHoldingRequested,
            this.investorHoldingList$,
        ).pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe(([requested, d]) => this.formatInvestorHoldingList(d));
    }

    /**
     * Format the list of management company of the investor
     *
     * @memberof MyHoldingsComponent
     */
    formatManagementCompanyList() {
        this.investorManagementCompanyList = this.allCompaniesList.concat(
            this.managementCompanyList.map(it => ({
                id: it.companyID,
                text: it.companyName,
            })));

        this.changeDetectorRef.detectChanges();
        this.searchForm.controls['search'].setValue(this.allCompaniesList);
    }

    /**
     * Generate AIC
     */
    handleGenerateAIC() {
        const payload: InvestorGenerateAICRequestData = {
            fromDate: moment(this.aicForm.controls['fromDate'].value).format('YYYY-MM-DD HH:mm:ss'),
            isin: this.aicForm.controls['isinCode'].value,
            subportfolio: this.selectedSubportfolio.option,
            walletId: this.selectedWalletId,
        }

        this.ofiReportsService.requestGenerateAICInvestor(payload).then((result) => {
            const data = result[1].Data;
            
            if (data.error) {
                return this.toaster.pop('error', this.translate.translate('There is a problem with the request.'));
            }

            // decodes base64 file payload
            const byteArray = new Uint8Array(atob(data.payload).split('').map(char => char.charCodeAt(0)));

            // create temporary element and delete it after file download
            const element = document.createElement('a');
            document.body.appendChild(element);
            const fileURL = window.URL.createObjectURL(new Blob([byteArray], {type: 'application/pdf'}));
            element.href = fileURL;
            element.download = data.filename;
            element.click();
            document.body.removeChild(element);

            // hide modal and return toaster message notification
            this.showGenerateAIC = false;
            this.aicForm.reset();
            this.shareISIN = null;
            this.selectedSubportfolio = null;
            return this.toaster.pop('success', this.translate.translate('PDF file successfully generated.'));
        });
    }

    /**
     * Format the list of holdings of the investor
     *
     * @param {List} d
     * @memberof MyHoldingsComponent
     */
    formatInvestorHoldingList(d) {
        const data = d.toJS();

        this.holdingList = data.map((it) => ({
            amManagementCompanyID: it.amManagementCompanyID,
            companyName: it.companyName,
            shareID: it.shareID,
            fundShareName: it.fundShareName,
            isin: it.isin,
            shareClassCurrency: this.getCurrencyString(it.shareClassCurrency),
            latestNav: it.latestNav,
            portfolioAddr: it.portfolioAddr,
            portfolioLabel: it.portfolioLabel,
            quantity: it.quantity,
            amount: it.amount,
            ratio: it.ratio,
        }));

        this.sharesList = _.map(_.uniqBy(data, 'shareID'), it => ({
            id: it.shareID,
            text: it.fundShareName,
            shareIsin: it.isin,
        }));
    }

    onSubmit(): void {

    }

    /**
    * Get the code of the currency by its id
    *
    * @param {number} currencyId
    * @returns {string}
    */
    getCurrencyString(currencyId: number): string {
        try {
            return this.currencyList.find(v => v.id === currencyId).text || '';
        } catch (e) {
            return '';
        }
    }

    clickReset() {
        this.aicForm.reset();
    }

    onChange(event) {
        this.shareISIN = this.sharesList.filter(e => e.id == event.id)[0].shareIsin;
        this.aicForm.controls['isinCode'].setValue(this.shareISIN);
    }

    onSubportfolioChange(event) {
        this.selectedSubportfolio = this.subportfolioListData.filter(e => e.id == event.id)[0];
    }
}
