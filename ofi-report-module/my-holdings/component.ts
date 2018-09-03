import { OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { MultilingualService } from '@setl/multilingual';
import { List } from 'immutable';
import { combineLatest } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { filter, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { OfiManagementCompanyService } from '../../ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiReportsService } from '../../ofi-req-services/ofi-reports/service';
import { OfiCurrenciesService } from '../../ofi-req-services/ofi-currencies/service';
import { InvestorHoldingRequestData } from '@ofi/ofi-main/ofi-req-services/ofi-reports/model';
import { CurrencyType } from '@ofi/ofi-main/ofi-store/ofi-currencies/model';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyHoldingsComponent implements OnInit, OnDestroy {
    investorManagementCompanyList = [];
    holdingsList = [];
    searchForm: FormGroup;
    currencyList = [];
    unSubscribe: Subject<any> = new Subject();

    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['ofi', 'ofiReports', 'amHolders', 'invRequested']) requestedInvestorHolding$;
    @select(['ofi', 'ofiReports', 'amHolders', 'invHoldingsList']) investorHoldingList$;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currencyList$;
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
        private ofiReportsService: OfiReportsService,
        private _translate: MultilingualService,
    ) {
        this.currenciesService.getCurrencyList();
        this.managementCompanyService.fetchInvestorManagementCompanyList();
    }

    ngOnInit(): void {
        this.initForm();
        this.initSubscriptions();
    }

    ngOnDestroy(): void {
        this.unSubscribe.next();
        this.unSubscribe.complete();
        this.changeDetectorRef.detach();
    }

    initForm() {
        this.searchForm = this.fb.group({
            search: [''],
        });

        this.changeDetectorRef.markForCheck();
    }

    initSubscriptions() {
        this.currencyList$
            .pipe(
                filter((v: List<CurrencyType>) => v && v.size > 0),
                takeUntil(this.unSubscribe),
            )
            .subscribe(d => this.currencyList = d.toJS());

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
            .subscribe((d) => this.formatManagementCompanyList(d));

        this.investorHoldingList$
            .pipe(
                filter((v: List<any>) => v && v.size > 0),
                takeUntil(this.unSubscribe),
            )
            .subscribe((d) => {
                this.formatInvestorHoldingList(d);
            });
    }

    formatManagementCompanyList(d) {
        const data = d.toJS();

        this.investorManagementCompanyList = data.map(it => ({
            id: it.companyID,
            text: it.companyName,
        }));

        this.changeDetectorRef.markForCheck();
    }

    formatInvestorHoldingList(d) {
        const data = d.toJS();

        this.holdingsList = data.map(it => ({
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
