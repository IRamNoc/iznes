import { OnInit, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { MultilingualService } from '@setl/multilingual';
import { fromJS, List } from 'immutable';
import { Subject } from 'rxjs/Subject';
import { filter, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { MemberSocketService } from '@setl/websocket-service';
import { OfiManagementCompanyService } from '../../ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiReportsService } from '../../ofi-req-services/ofi-reports/service';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';

/* Types. */
interface SelectedItem {
    id: any;
    text: number | string;
}

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyHoldingsComponent implements OnInit, OnDestroy {
    private connectedWalletId: any = 0;

    selectedManagementCompanyId = 0;
    investorManagementCompanyList = [];
    holdingsList = [];
    searchForm: FormGroup;
    currencyList = [];
    unSubscribe: Subject<any> = new Subject();

    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['ofi', 'ofiReports', 'amHolders', 'invRequested']) requestedInvestorHolding$;
    @select(['ofi', 'ofiReports', 'amHolders', 'invHoldingsList']) investorHoldingList$;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currenciesObs;
    @select([
        'ofi',
        'ofiProduct',
        'ofiManagementCompany',
        'investorManagementCompanyList',
        'investorManagementCompanyList',
    ]) investorManagementCompany$;

    constructor(
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private fb: FormBuilder,
        private currenciesService: OfiCurrenciesService,
        private managementCompanyService: OfiManagementCompanyService,
        private memberSocketService: MemberSocketService,
        private ofiReportsService: OfiReportsService,
        private _translate: MultilingualService,
    ) {
        this.currenciesService.getCurrencyList();
        this.managementCompanyService.fetchInvestorManagementCompanyList();
    }

    ngOnInit(): void {
        this.searchForm = this.fb.group({
            search: [''],
        });

        this.searchForm.valueChanges
            .pipe(
                filter(v => v.search.length),
                takeUntil(this.unSubscribe),
            )
            .subscribe((d) => {
                // if (d.search.length > 0) {
                    this.selectedManagementCompanyId = d.search[0].id;

                    const payload = {
                        amCompanyID: d.search[0].id,
                        walletID: this.connectedWalletId,
                    };

                    OfiReportsService.defaultRequestInvHoldingsList(this.ofiReportsService, this.ngRedux, payload);

                    this.changeDetectorRef.markForCheck();
                // }
            });

        this.connectedWallet$
            .pipe(
                filter(v => !!v),
                takeUntil(this.unSubscribe)
            )
            .subscribe(d => this.connectedWalletId = d);

        this.investorManagementCompany$
            .pipe(
                filter((v: List<any>) => v && v.size > 0),
                takeUntil(this.unSubscribe),
            )
            .subscribe((d) => {
                const data = d.toJS();

                this.investorManagementCompanyList = data.map(it => ({
                    id: it.companyID,
                    text: it.companyName,
                }));

                this.changeDetectorRef.markForCheck();
            });

        // this.requestedInvestorHolding$
        //     .takeUntil(this.unSubscribe)
        //     .subscribe((d) => {
        //         console.log('d :', d);

        //         if (this.connectedWalletId !== 0 && this.selectedManagementCompanyId !== 0) {
        //             const payload = {
        //                 amCompanyID: this.selectedManagementCompanyId,
        //                 walletID: this.connectedWalletId,
        //             };

        //             OfiReportsService.defaultRequestInvHoldingsList(this.ofiReportsService, this.ngRedux, payload);
        //         }
        //     });

        this.investorHoldingList$
            .pipe(
                filter((v: List<any>) => {
                    console.log('v :', v);
                    return v && v.size > 0;
                }),
                takeUntil(this.unSubscribe),
            )
            .subscribe((d) => {
                const listImu = fromJS(d);

                console.log('listImu :', listImu);

                this.holdingsList = listImu.map(it => ({
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
                })) || [];

                this.changeDetectorRef.markForCheck();
            });
    }

    // ngAfterViewInit() {
    //     this.subscriptions['my-connected'] = this.connectedWalletOb.subscribe((connectedWalletId) => {
    //         this.connectedWalletId = connectedWalletId;

    //         if (this.connectedWalletId !== 0) {
    //             this.subscriptions.push(this.currenciesObs.subscribe(c => this.getCurrencyList(c)));
    //             this.subscriptions.push(this.invManagementCompanyAccessListOb.subscribe(investorManagementCompanyList => this.getINVManagementCompanyListFromRedux(investorManagementCompanyList)));
    //             this.subscriptions.push(this.requestedOfiInvHoldingsObj.subscribe(requested => this.getInvHoldingsRequested(requested)));
    //             this.subscriptions.push(this.ofiInvHoldingsListObj.subscribe(list => this.getInvHoldingsListFromRedux(list)));
    //         }
    //     });
    // }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
        this.changeDetectorRef.detach();
    }

    /**
     * Get the list of currencies from redux
     *
     * @param {Array} data
     * @memberof OfiNavFundView
     */
    getCurrencyList(data) {
        if (data) {
            this.currencyList = data.toJS();
        }
    }

    // getINVManagementCompanyListFromRedux(managementCompanyList) {
    //     const managementCompanyListImu = fromJS(managementCompanyList);

    //     this.managementCompanyList = managementCompanyListImu.reduce((result, item) => {
    //         result.push({
    //             id: item.get('companyID', 0),
    //             text: item.get('companyName', ''),
    //         });

    //         return result;
    //     }, []);

    //     this.changeDetectorRef.markForCheck();
    // }

    // getInvHoldingsRequested(requested): void {
    //     if (!requested) {
    //         const payload = {
    //             amCompanyID: this.selectedManagementCompany,
    //             walletID: this.connectedWalletId,
    //         };

    //         OfiReportsService.defaultRequestInvHoldingsList(this.ofiReportsService, this.ngRedux, payload);
    //     }
    // }

    // getInvHoldingsListFromRedux(list) {
    //     const listImu = fromJS(list);

    //     this.holdingsList = listImu.reduce((result, item) => {

    //         result.push({
    //             amManagementCompanyID: item.get('amManagementCompanyID', 0),
    //             companyName: item.get('companyName', ''),
    //             shareID: item.get('shareID', 0),
    //             fundShareName: item.get('fundShareName', ''),
    //             isin: item.get('isin', ''),
    //             shareClassCurrency: this.showCurrency(item.get('shareClassCurrency', '')),
    //             latestNav: item.get('latestNav', 0),
    //             portfolioAddr: item.get('portfolioAddr', ''),
    //             portfolioLabel: item.get('portfolioLabel', ''),
    //             quantity: item.get('quantity', 0),
    //             amount: item.get('amount', 0),
    //             ratio: item.get('ratio', 0),
    //         });

    //         return result;
    //     }, []);

    //     this.changeDetectorRef.markForCheck();
    // }

    requestSearch(form) {
        if (this.searchForm.get('search').value && this.searchForm.get('search').value[0] && this.searchForm.get('search').value[0].id) {
            this.selectedManagementCompanyId = this.searchForm.get('search').value[0].id;
            const payload = {amCompanyID: this.selectedManagementCompanyId, walletID: this.connectedWalletId};
            OfiReportsService.defaultRequestInvHoldingsList(this.ofiReportsService, this.ngRedux, payload);
        }
    }

    showCurrency(currency) {
        const obj = this.currencyList.find(o => o.id === currency);
        if (obj !== undefined) {
            return obj.text;
        }
        return currency;
    }

    /**
     * Get the label of the currency (3 characters)
     *
     * @param {number} currencyId
     * @returns {string}
     * @memberof OfiNavFundView
     */
    getCurrencyString(currencyId: number): string {
        return this.currencyList.find(v => v.id === currencyId).text || 'N/A';
    }
}
