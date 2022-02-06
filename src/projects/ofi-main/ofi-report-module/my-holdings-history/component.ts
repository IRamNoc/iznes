import { OnInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { MultilingualService } from '@setl/multilingual';
import { List } from 'immutable';
import { combineLatest } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { filter, takeUntil, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { OfiManagementCompanyService } from '../../ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiReportsService } from '../../ofi-req-services/ofi-reports/service';
import { OfiCurrenciesService } from '../../ofi-req-services/ofi-currencies/service';
import { TransferInOutService } from '../../ofi-transfer-in-out/transfer-in-out.service';
import { LogService } from '../../../utils';
import { ToasterService } from 'angular2-toaster';
import { OfiFundShareService } from '../../ofi-req-services/ofi-product/fund-share/service';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})
export class MyHoldingsHistoryComponent implements OnInit, OnDestroy {
    currencyList = [];
    dateTypeList = [
        
           { id:1,text:"Settlement Date"},
           { id:2,text:"Cut off Date"},
           { id:3,text:"NAV Date"},
           { id:4,text:"Order Date"}
        
    ];
    holdingList: Array<any>;
    searchForm: FormGroup;
    unSubscribe: Subject<any> = new Subject();

    // management company list
    managementCompanyList: any[] = [];
    managementCompanyListItems: any[] = [];

    shareList: any[] = [];
    filteredShareList: any[] = [];
    shareSelected: any = {};
    investorSelected: any = {};
    walletSelected: any = {};
    investorShareList: any[] = [];
    investorListItems: any[] = [];
    walletListItems: any[] = [];
    defaultObjectData:any;
    totalOrderList: any[] = [];

    userType: number = 0;
   
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['user', 'myDetail', 'accountId']) accountId$;
    @select(['user', 'myDetail', 'userType']) userType$;
    @select(['ofi', 'ofiCurrencies', 'loaded']) loaded$;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currencyList$;
    @select(['ofi', 'ofiReports', 'amHolders', 'invHoldingsList']) investorHoldingList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) investorManagementCompanyList$;

    constructor(
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private fb: FormBuilder,
        private currenciesService: OfiCurrenciesService,
        private managementCompanyService: OfiManagementCompanyService,
        private ofiReportsService: OfiReportsService,
        private translate: MultilingualService,
        private transferService: TransferInOutService,
        private logService: LogService,
        private toaster: ToasterService,
        private ofiFundShareService: OfiFundShareService,
    ) {
    }

    ngOnInit(): void {
        this.initForm();        
        this.initSubscriptions();
    }

     ngOnDestroy(): void {
        this.unSubscribe.complete();
        this.changeDetectorRef.detach();

    }
    

    initForm() {
        this.holdingList = [];
        this.searchForm = this.fb.group({
            search: [''],
            isin:[''],
            fundName:[''],
            shareName:[''],
            dateFrom:[''],
            dateType:[''],
            dateTo:[''],
            investor:[''],
            portfolio:[''],
            postionsCal:[''],
            AggregationShare:[''],
            AggregationPortfolio:[''],
            hideZeroPositions:[''],
            investorInInvestorFunds:[''],
        });

        this.changeDetectorRef.detectChanges();
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

        this.userType$
        .pipe(
            filter(userType => userType && userType !== 0),
            takeUntil(this.unSubscribe),
        )
        .subscribe(userType => {
            this.userType = userType;

            // fetch management companies items
            if (this.isInvestor) {
                this.managementCompanyService.fetchInvestorManagementCompanyList(true);
            } else {
                this.managementCompanyService.getManagementCompanyList();
            }
        });

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

        this.managementCompanyList$
        .pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe(d => {
                const values = _.values(d);
                if (!values.length) {
                    return [];
                }

                this.managementCompanyList = d;
                this.managementCompanyListItems = values.map((item) => {
                    return {
                        id: item.companyID,
                        text: item.companyName,
                    };
                });
        });

        this.investorManagementCompanyList$
        .pipe(
            filter((v: List<any>) => v && v.size > 0),
            takeUntil(this.unSubscribe),
        )
        .subscribe(d => {
            this.managementCompanyList = d.toJS();
            this.formatManagementCompanyList();
        });
    }

    /**
     * Request holding list data
     */
    requestHoldingListHistory() {
        const params = {
            isin: '',
            fundId: '',
            shareId: '',
            dateFrom: '',
            dateTo: '',
            dateType: '',
            positionToCalculate: '',
            // investorId: '', // 
            walletId: '',
            shareAggregate: '',
            walletAggregate: '',
            hideZeroPosition: ''
        }
    }

    /**
     * Format the list of management company of the investor
     *
     * @memberof MyHoldingsComponent
     */
    formatManagementCompanyList() {
        this.managementCompanyListItems =
            this.managementCompanyList.map(it => {
                return {
                    id: it.companyID,
                    text: it.companyName
                };
            });
        
        this.changeDetectorRef.detectChanges();
        // this.searchForm.controls['search'].setValue(this.allCompaniesList);
    }

    /**
     * Format the list of holdings of the investor
     *
     * @param {List} d
     * @memberof MyHoldingsComponent
     */
    formatInvestorHoldingList(d) {
        this.defaultObjectData=d;
       
        this.totalOrderList=d;
        const data = d.toJS();
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
    }
clearFilters(){
    this.searchForm.get('isin').patchValue(['']);
    this.searchForm.get('centra-funds-date-from').patchValue(['']);
    this.formatInvestorHoldingList(this.totalOrderList)
}
    filterOrders(){
        const isin=this.searchForm.controls['isin'].value;
        this.holdingList=this.holdingList.filter(e=>e.isin==isin);
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


    handleDropdownAmSelect(event) {        
        // this.shareSelected = this.walletSelected = this.investorSelected = {};
        // for (const key in this.managementCompanyAccessList) {
        //     if (this.managementCompanyAccessList[key].companyID === event.id) {
        //         this.managementCompanySelected = this.managementCompanyAccessList[key];
        //     }
        // }
        // this.filteredShareList = Object.keys(this.shareList).map((key) => {
        //     if (this.shareList[key].managementCompanyId === event.id) {
        //         return {
        //             id: key,
        //             text: this.shareList[key].fundShareName,
        //         };
        //     }
        // });
    }

    handleDropdownShareSelect(event) {
        this.walletSelected = this.investorSelected = {};
        this.shareSelected = this.shareList[event.id];
        this.transferService.fetchInvestorListByShareID(
            this.shareSelected['fundShareID'],
            (res) => {
                if (res[1].Status === 'OK') {
                    const data = res[1].Data;
                    this.investorShareList = data;
                    this.investorListItems = _.uniqBy(
                        Object.keys(this.investorShareList).map((key) => {
                            return {
                                id: key,
                                text:
                                    `${this.investorShareList[key].Type === "investor" ? this.investorShareList[key].companyName : this.investorShareList[key].walletName }`,
                                walletID: this.investorShareList[key].walletID,
                            };
                        }),
                        'walletID');
                }
            },
            (error) => {
                this.logService.log('Error: ', error);
                this.toaster.pop('error', 'Cannot fetch Investor List');
            });
    }

    handleDropdownInvestorSelect(event) {
        this.walletSelected = {};
        this.investorSelected = this.investorShareList[event.id];
        this.walletListItems = Object.keys(this.investorShareList).map((key) => {
            if (this.investorShareList[key].walletID === this.investorSelected['walletID']) {
                return {
                    id: key,
                    text: this.investorShareList[key].accountLabel,
                    investorSubportfolioID: this.investorShareList[key].investorSubportfolioID,
                };
            }
        });
    }

    handleDropdownInvestorWalletSelect(event) {
        this.walletSelected = this.walletListItems[event.id];

    }
    filterUpdateOrders(){
        let formData=this.searchForm.value;
        this.holdingList=this.holdingList.filter(e=> (e.isin==formData.isin));
    }
    searchFiltersclear(){
        this.searchForm.get('isin').patchValue(['']);
        this.formatInvestorHoldingList(this.defaultObjectData);
    }

    // getters
    get isInvestor(): boolean {
        return Boolean(this.userType === 46);
    }
}
