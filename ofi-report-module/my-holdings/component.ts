import { OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select } from '@angular-redux/store';
import { MultilingualService } from '@setl/multilingual';
import { List } from 'immutable';
import { combineLatest } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { filter, takeUntil, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { OfiManagementCompanyService } from '../../ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiReportsService } from '../../ofi-req-services/ofi-reports/service';
import { OfiCurrenciesService } from '../../ofi-req-services/ofi-currencies/service';
import { InvestorHoldingRequestData } from '@ofi/ofi-main/ofi-req-services/ofi-reports/model';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyHoldingsComponent implements OnInit, OnDestroy {
    currencyList = [];
    investorManagementCompanyList = [];
    holdingList: Array<any>;
    searchForm: FormGroup;
    unSubscribe: Subject<any> = new Subject();

    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
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
        private _translate: MultilingualService,
    ) {
    }

    ngOnInit(): void {
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

    initForm() {
        this.holdingList = [];
        this.searchForm = this.fb.group({
            search: [''],
        });

        this.changeDetectorRef.markForCheck();
    }

    initSubscriptions() {
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
            this.connectedWallet$,
            this.searchForm.valueChanges,
        ).pipe(
            filter(([walletId, selectedItem]) => walletId && selectedItem.search.length),
            takeUntil(this.unSubscribe),
        )
        .subscribe(([selectedWalletId, selectedItem]) => {
            const payload: InvestorHoldingRequestData = {
                amCompanyID: selectedItem.search[0].id,
                walletID: Number(selectedWalletId),
            };

            this.ofiReportsService.fetchInvestorHoldingList(payload);
        });

        this.investorManagementCompany$
            .pipe(
                filter((v: List<any>) => v && v.size > 0),
                takeUntil(this.unSubscribe),
            )
            .subscribe(d => this.formatManagementCompanyList(d));

        combineLatest(
            this.investorHoldingRequested,
            this.investorHoldingList$,
        ).pipe(
            filter(([requested, v]) => requested && v && v.size > 0),
            takeUntil(this.unSubscribe),
        )
        .subscribe(([requested, d]) => this.formatInvestorHoldingList(d));
    }

    /**
     * Format the list of management company of the investor
     *
     * @param {List} d
     * @memberof MyHoldingsComponent
     */
    formatManagementCompanyList(d) {
        const data = d.toJS();

        this.investorManagementCompanyList = data.map(it => ({
            id: it.companyID,
            text: it.companyName,
        }));

        this.changeDetectorRef.markForCheck();
    }

    /**
     * Format the list of holdings of the investor
     *
     * @param {List} d
     * @memberof MyHoldingsComponent
     */
    formatInvestorHoldingList(d) {
        const data = d.toJS();

        if (data && data.length > 0) {
            this.holdingList = data.map(it => ({
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

            this.changeDetectorRef.markForCheck();
        }
    }

    /**
     * Get the code of the currency by its id
     *
     * @param {number} currencyId
     * @returns {string}
     */
    getCurrencyString(currencyId: number): string {
        return this.currencyList.find(v => v.id === currencyId).text || '';
    }
}
