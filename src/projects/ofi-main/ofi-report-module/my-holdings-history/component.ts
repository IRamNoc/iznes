import { OnInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { MultilingualService } from '@setl/multilingual';
import { List, fromJS } from 'immutable';
import { combineLatest } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { filter, takeUntil, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { OfiManagementCompanyService } from '../../ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiReportsService } from '../../ofi-req-services/ofi-reports/service';
import { OfiCurrenciesService } from '../../ofi-req-services/ofi-currencies/service';
import { InvestorHoldingRequestData } from '@ofi/ofi-main/ofi-req-services/ofi-reports/model';
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
    investorManagementCompanyList = [];
    fundNameList = [
        {
            id:1,text:"Test"
        }
    ];
    allList: any = [];
    fundList: any = [];
    sharesList: any = [];
    fundsData: any = [];
    sharesData: any = [];
    dateTypeList = [
        
           { id:1,text:"Settlement Date"},
           { id:2,text:"Cut off Date"},
           { id:3,text:"NAV Date"},
           { id:4,text:"Order Date"}
        
    ];
    holdingList: Array<any>;
    searchForm: FormGroup;
    unSubscribe: Subject<any> = new Subject();
    private subscriptions: Array<any> = [];
    language = 'en';
    managementCompanyList: any[] = [];
    allCompaniesList: any[] = [];
    loadingDatagrid: boolean = false;
    mananagementCompanyItems: any[] = [];
    managementCompanyAccessList: any[] = []; 
    managementCompanySelected: any = {};
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


    @select([
        'ofi',
        'ofiProduct',
        'ofiManagementCompany',
        'managementCompanyList',
        'managementCompanyList',
    ]) managementCompanyAccessListOb;    
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) fundShareObs;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['user', 'siteSettings', 'language']) language$;
    @select(['user', 'myDetail', 'accountId']) accountId$;
    @select(['ofi', 'ofiCurrencies', 'loaded']) loaded$;
    @select(['ofi', 'ofiCurrencies', 'currencies']) currencyList$;
    @select(['ofi', 'ofiReports', 'amHolders', 'invRequested']) investorHoldingRequested;
    @select(['ofi', 'ofiReports', 'amHolders', 'invHoldingsList']) investorHoldingList$;
    @select(['ofi', 'ofiAmDashboard', 'shareHolders', 'fundsByUserList']) fundsByUserListOb;
    @select(['ofi', 'ofiReports', 'amHolderHistoryList', 'amHoldersList']) OfiAmHoldersListObj;
    @select(['ofi', 'ofiReports', 'amHolderHistoryList', 'requested']) requestedOfiAmHoldersObj;

    
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
        private translate: MultilingualService,
        private transferService: TransferInOutService,
        private logService: LogService,
        private toaster: ToasterService,
        private ofiFundShareService: OfiFundShareService,
    ) {        
       
        this.subscriptions.push(this.OfiAmHoldersListObj.subscribe(list => this.getAmHoldersListFromRedux(list)));
        this.subscriptions.push(this.fundsByUserListOb.subscribe(list => this.fundsByUserList(list)));
        
        this.ofiFundShareService.fetchIznesAdminShareList();        
        this.managementCompanyService.getManagementCompanyList();
    }

    ngOnInit(): void {
        this.initCompanies();
        this.initForm();        
        this.initListItems();
        this.initSubscriptions();
        this.subscriptions.push(this.requestedOfiAmHoldersObj.subscribe(requested => this.getAmHoldersRequested(requested)));
        this.subscriptions.push(this.OfiAmHoldersListObj.subscribe(list => this.getAmHoldersListFromRedux(list)));

    }

    initListItems() {
        this.subscriptions.push(this.managementCompanyAccessListOb
            .subscribe((d) => {
                console.log(d, "444444444444");
                this.managementCompanyAccessList = d;
                this.mananagementCompanyItems = Object.keys(this.managementCompanyAccessList).map((key) => {
                    return {
                        id: this.managementCompanyAccessList[key].companyID,
                        text: this.managementCompanyAccessList[key].companyName,
                    };
                });
            }),
        );
        console.log(this.fundShareObs, "this.fundShareObs")
        this.subscriptions.push(this.fundShareObs.subscribe(shares => this.shareList = shares));
        this.changeDetectorRef.detectChanges();

    }

     ngOnDestroy(): void {
        this.unSubscribe.complete();
        this.changeDetectorRef.detach();

    }
    
    getAmHoldersRequested(requested): void {
        if (!requested) {
            OfiReportsService.defaultPositionHoldingList(this.ofiReportsService, this.ngRedux);
        }
    }
    fundsByUserList(list) {
        const listImu = fromJS(list);
        this.fundList = listImu.reduce(
            (result, item) => {
                const text = item.fundLei !== '' ? `${item.fundName} (${item.fundLei})` : item.fundName;

                result.push({
                    id: item.fundId,
                    text,
                });
                return result;
            },
            [],
        );

        this.changeDetectorRef.markForCheck();
    }
    /**
     * Get the actual list of holders from redux
     *
     * @param holderList
     */
    getAmHoldersListFromRedux(holderList) {
        if (holderList) {
            this.holdingList = holderList.toJS() || [];
            console.log("venkat123456", this.holdingList)

            this.sharesList = this.holdingList.filter(it => it.shareId !== 0).map((holder) => {
                return {
                    id: holder.shareId,
                    text: holder.fundName + ' - ' + holder.shareName + ' (' + holder.shareIsin + ')',
                };
            });
        }
        this.changeDetectorRef.markForCheck();
        this.loadingDatagrid = false;
    }

    initCompanies() {
        this.allCompaniesList = [{
            id: -1,
            text: this.translate.translate('All Asset Management Companies'),
        }];
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
            invistorInInvestorFunds:[''],
        });

        this.changeDetectorRef.detectChanges();
    }

    initSubscriptions() {
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
     * Format the list of holdings of the investor
     *
     * @param {List} d
     * @memberof MyHoldingsComponent
     */
    formatInvestorHoldingList(d) {
        this.defaultObjectData=d;
       
        this.totalOrderList=d;
        const data = d.toJS();
        console.log(data,"d")
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
        this.shareSelected = this.walletSelected = this.investorSelected = {};
        console.log('shareSelected.............',this.shareSelected);
        for (const key in this.managementCompanyAccessList) {
            if (this.managementCompanyAccessList[key].companyID === event.id) {
                this.managementCompanySelected = this.managementCompanyAccessList[key];
            }
        }
        console.log('managementCompanySelected..........',this.managementCompanySelected);
        this.filteredShareList = Object.keys(this.shareList).map((key) => {
            if (this.shareList[key].managementCompanyId === event.id) {
                return {
                    id: key,
                    text: this.shareList[key].fundShareName,
                };
            }
        });
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
}
