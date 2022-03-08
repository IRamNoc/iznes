import { OnInit, ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { MultilingualService } from '@setl/multilingual';
import { List } from 'immutable';
import { combineLatest } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import {
    MoneyValuePipe,
} from '@setl/utils';
import { filter, takeUntil, switchMap } from 'rxjs/operators';
import * as _ from 'lodash';
import { OfiManagementCompanyService } from '../../ofi-req-services/ofi-product/management-company/management-company.service';
import { OfiReportsService } from '../../ofi-req-services/ofi-reports/service';
import { ToasterService } from 'angular2-toaster';
import { OfiFundShareService } from '../../ofi-req-services/ofi-product/fund-share/service';
import { OfiFundInvestService } from '../../ofi-req-services/ofi-fund-invest/service';
import * as moment from 'moment-timezone';
import * as json2csv from 'json2csv';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})
export class MyHoldingsHistoryComponent implements OnInit, OnDestroy {
    dateTypeList = [
        { id: 1, text: "Order Date" },
        { id: 2, text: "Cut off Date" },
        { id: 3, text: "Settlement Date" },
        { id: 4, text: "NAV Date" },
    ];

    connectedWalletId: number = 0;
    dateTypeSelected: any = 1; // default orderDate
    language = 'en';

    // Datepicker config
    fromConfigDate = {
        firstDayOfWeek: 'mo',
        format: 'YYYY-MM-DD',
        closeOnSelect: true,
        disableKeypress: true,
        locale: this.language,
        isDayDisabledCallback: (thisDate) => {
            if (!!thisDate && this.searchForm.controls['dateTo'].value !== '') {
                return (thisDate.diff(this.searchForm.controls['dateTo'].value) > 0);
            }
            return false;
        },
    };

    toConfigDate = {
      firstDayOfWeek: 'mo',
      format: 'YYYY-MM-DD',
      closeOnSelect: true,
      disableKeypress: true,
      locale: this.language,
      isDayDisabledCallback: (thisDate) => {
        if (!!thisDate && this.searchForm.controls['dateFrom'].value !== '') {
            return (thisDate.diff(this.searchForm.controls['dateFrom'].value) < 0);
        }
        return false;
      },
    };

    menuSpec = {};
    decimalSeparator: any;
    dataSeparator: any;

    holdingList: Array<any>;
    holdingListFiltered: Array<any>;
    searchForm: FormGroup;
    unSubscribe: Subject<any> = new Subject();

    // management company list
    managementCompanyList: any[] = [];
    managementCompanyListItems: any[] = [];
    managementCompanySelected: number = null;

    shareList: any[] = [];
    fundList: any[] = [];
    investorList: any[] = [];
    subportfolioList: any[] = [];

    filteredShareList: any[] = [];
    filteredFundList: any[] = [];
    filteredSubportfolioList: any[] = [];

    shareSelected: number;
    fundSelected: number;
    investorSelected: number;
    subportfolioSelected: number;

    userType: number = 0;
   
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['user', 'myDetail', 'accountId']) accountId$;
    @select(['user', 'myDetail', 'userType']) userType$;
    @select(['ofi', 'ofiCurrencies', 'loaded']) loaded$;
    @select(['ofi', 'ofiReports', 'amHolders', 'invHoldingsList']) investorHoldingList$;
    @select(['ofi', 'ofiReports', 'holdingHistory', 'holdingHistoryList']) holdingHistoryList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) investorManagementCompanyList$;

    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'requested']) readonly requestedOfiInvestorFundList$;
    @select(['ofi', 'ofiFundInvest', 'ofiInvestorFundList', 'fundShareAccessList']) readonly fundShareAccessList$;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'requestedIznesShare']) readonly requestedShareList$;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) readonly shareList$;
    @select(['user', 'siteSettings', 'siteMenu', 'side']) readonly menuSpec$;
    @select(['user', 'siteSettings', 'decimalSeparator']) readonly decimalSeparator$;
    @select(['user', 'siteSettings', 'dataSeperator']) readonly dataSeparator$;
    

    constructor(
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private fb: FormBuilder,
        private managementCompanyService: OfiManagementCompanyService,
        private ofiReportsService: OfiReportsService,
        private translate: MultilingualService,
        private toaster: ToasterService,
        private ofiFundShareService: OfiFundShareService,
        private fundInvestService: OfiFundInvestService,
        private moneyValue: MoneyValuePipe,
    ) {
    }

    ngOnInit(): void {
        this.initForm();
        this.initSubscriptions();
        this.requestHoldingListHistory();
    }

     ngOnDestroy(): void {
        this.unSubscribe.complete();
        this.changeDetectorRef.detach();

    }
    
    initForm() {

        this.searchForm = new FormGroup({
            managementCompany: new FormControl(''),
            isin: new FormControl(''),
            fundName: new FormControl(''),
            shareName: new FormControl(''),
            dateFrom: new FormControl(moment().subtract(1, 'months').format('YYYY-MM-DD')),
            dateTo: new FormControl(moment().format('YYYY-MM-DD')),
            dateType: new FormControl(null),
            investor: new FormControl(''),
            portfolio: new FormControl(''),
            includeHoliday: new FormControl('all'),
            aggregationShare:new FormControl('none'),
            aggregationPortfolio:new FormControl('none'),
            hideZeroPosition: new FormControl(false),
            investorInInvestorFunds: new FormControl(false),
        });

        this.changeDetectorRef.detectChanges();
    }

    initSubscriptions() {
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

        this.menuSpec$
        .pipe(takeUntil(this.unSubscribe))
        .subscribe(menuSpec => this.menuSpec = menuSpec);

        this.decimalSeparator$
        .pipe(takeUntil(this.unSubscribe))
        .subscribe(data => this.decimalSeparator = data);

        this.dataSeparator$
        .pipe(takeUntil(this.unSubscribe))
        .subscribe(data => this.dataSeparator = data);

        this.connectedWallet$.pipe(
            takeUntil(this.unSubscribe),
        )
        .subscribe(walletId => {
            this.connectedWalletId = walletId;

            if (this.isInvestor) {
                this.requestedOfiInvestorFundList$.subscribe(requested => this.requestMyFundAccess(requested));
                this.fundShareAccessList$.subscribe(list => this.formatSharesList(list));
            } else if (this.isIznesAdmin) {
                this.requestedShareList$.subscribe(requested => this.requestAllShareList(requested));
                this.shareList$.subscribe(shares => this.formatSharesList(shares));
            } else {
                this.requestedShareList$.subscribe(requested => this.requestShareList(requested));
                this.shareList$.subscribe(shares => this.formatSharesList(shares));
            }

            this.changeDetectorRef.markForCheck();
        })

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

        this.holdingHistoryList$.subscribe(d => {
            const data = d.toJS();

            this.holdingList = data;
            this.holdingListFiltered = [];
            
            // get investor list from holding list
            this.investorList = _.reduce(this.holdingList, (result, value, key) => {
                if (_.findIndex(result, { id: value.investorWalletID }) < 0) {
                    result.push({
                        id: value.investorWalletID,
                        text: value.investorCompanyName || value.investorWalletName
                    })
                }

                return result;
            }, []);

            this.subportfolioList = _.reduce(this.holdingList, (result, value, key) => {
                if (_.findIndex(result, { id: value.subportfolioID }) < 0) {
                    result.push({
                        id: value.subportfolioID,
                        text: value.subportfolioLabel,
                    })
                }
    
                return result;
            }, []);

            this.filteredSubportfolioList = this.subportfolioList;
            
            _.forEach(this.holdingList, (list) => {
                const found = _.findIndex(this.holdingListFiltered, {
                    companyName: list.companyName,
                    fundShareName: list.fundShareName,
                    investorWalletName: list.investorWalletName,
                    portfolio: list.subportfolioLabel,
                });

                if (found < 0) {
                    return this.holdingListFiltered.push({
                        companyName: list.companyName,
                        fundName: list.fundName,
                        fundShareName: list.fundShareName,
                        isin: list.isin,
                        currency: list.currency,
                        portfolioManager: list.investorCompanyName === null ? list.investorWalletName : '',
                        investor: list.investorCompanyName,
                        investorWalletName: list.investorWalletName,
                        portfolio: list.subportfolioLabel,
                        date: moment().format('YYYY-MM-DD'),
                        quantity: Number(list.quantity),
                        navPrice: Number(list.latestValuationPrice),
                        navDate: list.latestValuationDate,
                        AUI: (Number(list.latestValuationPrice) * Number(list.quantity)),
                    });
                }

                if (list.orderType === 3) {
                    this.holdingListFiltered[found].quantity += Number(list.quantity);
                } else {
                    this.holdingListFiltered[found].quantity -= Number(list.quantity);
                }
            });
        })
    }

    /**
     * Request holding list data
     */
    requestHoldingListHistory() {
        this.ofiReportsService.defaultRequestMyHoldingHistory({});
    }

    /**
     * Request my fund access base of the requested state.
     * @param requested
     * @return void
     */
    requestMyFundAccess(requested): void {
        if (!requested) {
            OfiFundInvestService.defaultRequestFunAccessMy(
                this.fundInvestService,
                this.ngRedux,
                this.connectedWalletId,
            );
        }
    }

    requestShareList(requested): void {
        if (!requested) {
            OfiFundShareService.defaultRequestIznesShareList(this.ofiFundShareService, this.ngRedux);
        }
    }

    requestAllShareList(requested): void {
        if (!requested) {
            OfiFundShareService.requestIznesAllShareList(this.ofiFundShareService, this.ngRedux);
        }
    }

    /**
     * Format the list of management company
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
        
        //this.changeDetectorRef.detectChanges();
        // this.searchForm.controls['search'].setValue(this.allCompaniesList);
    }

    /**
     * Format the list of fund shares
     *
     * @memberof MyHoldingsComponent
     */
    formatSharesList(list) {
        // store shares
        this.shareList = _.map(list, (share) => {
            const companyName = _.get(share, 'managementCompanyName', null);

            return {
                fundID: share.fundID,
                managementCompanyName: companyName || share.companyName,
                id: share.fundShareID,
                text: share.fundShareName,
            }
        });

        this.filteredShareList = this.shareList;
        
        // store funds
        this.fundList = _.reduce(list, (result, value) => {
            if (!_.find(result, { id: value.fundID })) {
                const companyName = _.get(value, 'managementCompanyName', null);

                result.push({
                    id: value.fundID,
                    text: value.fundName,
                    managementCompanyName: companyName || value.companyName,
                });
            }

            return result;
        }, []);

        this.filteredFundList = _.uniq(this.fundList);
    }

    clearFilters() {
        this.searchForm.reset();
        this.initForm();
        this.shareSelected = null;
        this.fundSelected = null;
        this.investorSelected = null;
        this.subportfolioSelected = null;
        this.managementCompanySelected = null;
        this.filteredFundList = this.fundList;
        this.filteredShareList = this.shareList;
        this.filteredSubportfolioList = this.subportfolioList;
    }

    exportHolding() {
        const exportData = _.map(this.holdingListFiltered, (item) => {
            const parsedNavPrice = item.navPrice ? this.moneyValue.transform(item.navPrice, 4) : '';
            const parsedQuantity = this.moneyValue.transform(item.quantity, 5);
            return {
                'Asset Management Company': item.companyName,
                'Fund Name': item.fundName,
                'Share Name': item.fundShareName,
                'ISIN': item.isin,
                'Currency': item.currency,
                'Portfolio Manager': item.portfolioManager,
                'Investor': item.investor,
                'Portfolio': item.investorWalletName,
                'Date': item.date,
                'Quantity': this.decimalSeparator === 'dot' ? parsedQuantity : parsedQuantity.replace('.', ','),
                'NAV': this.decimalSeparator === 'dot' ? parsedNavPrice : parsedNavPrice.replace('.', ','),
                'NAV Date': item.navDate,
                'AUI': item.navPrice ? (item.navPrice * item.quantity) : '',
            }
        });

        const separator = this.dataSeparator === 'semicolon' ? ';' : ',';        
        const data = json2csv.parse(exportData, { delimiter: separator, quote: '' });
        const element = document.createElement('a');

        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(data));
        element.setAttribute('download', `holding_history_${moment().format('YYYY-MM-DD HH:mm')}.csv`);
        element.style.display = 'none'
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    filterHolding() {
        // reset filtered holding list
        this.holdingListFiltered = [];
        let holdingListPrep = [];

        const params = {
            isin: this.searchForm.controls['isin'].value,
            managementCompanyId: this.managementCompanySelected || null,
            fundId: this.fundSelected || null,
            shareId: this.shareSelected || null,
            dateFrom: moment(this.searchForm.controls['dateFrom'].value).format('YYYY-MM-DD'),
            dateTo: moment(this.searchForm.controls['dateTo'].value).format('YYYY-MM-DD'),
            dateType: this.dateTypeSelected || 1,
            includeHoliday: this.searchForm.controls['includeHoliday'].value,
            investorId: this.investorSelected || null,
            subportfolioId: this.subportfolioSelected || null,
            hideZeroPosition: this.searchForm.controls['hideZeroPosition'].value,
            aggregationShare: this.searchForm.controls['aggregationShare'].value,
            aggregationPortfolio: this.searchForm.controls['aggregationPortfolio'].value,
            investorInInvestorFunds: this.searchForm.controls['investorInInvestorFunds'].value,
        }

        _.forEach(this.holdingList, (list) => {
            let targetDate;
            let holidayCalendar;

            switch (params.dateType) {
                case 2:
                    targetDate = moment(list.cutoffDate).format('YYYY-MM-DD');
                    holidayCalendar = list.orderType === 3 ? list.buyCentralizationCalendar : list.sellCentralizationCalendar;
                    break;
                case 3:
                    targetDate = moment(list.settlementDate).format('YYYY-MM-DD');
                    holidayCalendar = list.orderType === 3 ? list.buySettlementCalendar : list.sellSettlementCalendar;
                    break;
                case 4:
                    targetDate = moment(list.valuationDate).format('YYYY-MM-DD');
                    holidayCalendar = list.orderType === 3 ? list.buyNAVCalendar : list.sellNAVCalendar;
                    break;
                case 1:
                default:
                    targetDate = moment(list.orderDate).format('YYYY-MM-DD');
                    holidayCalendar = null;
                    break;
            }

            if (params.dateTo !== null && targetDate > params.dateTo) {
                return;
            }

            // removes holiday orders
            if (params.includeHoliday === 'non-holiday' && holidayCalendar !== null) {
                if (holidayCalendar.includes(targetDate)) return;
            }

            // removes non-selected management companies
            if (params.managementCompanyId !== null && params.managementCompanyId !== list.companyID)
                return;
            
            // removes non-selected funds
            if (params.fundId !== null && params.fundId !== list.fundID)
                return;
            
            // removes non-selected fund shares
            if (params.shareId !== null && params.shareId !== list.fundShareID)
                return;
            
            // removes non-selected isin
            if (params.isin !== '' && !list.isin.includes(params.isin))
                return;

            // removes non-selected investors
            if (params.investorId !== null && params.investorId !== list.investorWalletID)
                return;
            
            // removes non-selected subportfolios
            if (params.subportfolioId !== null && params.subportfolioId !== list.subportfolioID)
                return;
            
            const foundParams = {
                companyName: list.companyName,
                fundShareName: list.fundShareName,
                investorWalletName: list.investorWalletName,
                portfolio: list.subportfolioLabel,
            };

            if (params.dateFrom !== null) {
                switch (params.dateType) {
                    case 2:
                        foundParams['cutoffDate'] = targetDate;
                        break;
                    case 3:
                        foundParams['settlementDate'] = targetDate;
                        break;
                    case 4:
                        foundParams['valuationDate'] = targetDate; 
                        break;
                    case 1:
                    default:
                        foundParams['orderDate'] = targetDate;
                        break;
                }
            }

            const found = _.findIndex(holdingListPrep, foundParams);
            
            if (found < 0) {
                return holdingListPrep.push({
                    companyName: list.companyName,
                    fundName: list.fundName,
                    fundShareName: list.fundShareName,
                    isin: list.isin,
                    currency: list.currency,
                    portfolioManager: list.investorCompanyName === null ? list.investorWalletName : '',
                    investor: list.investorCompanyName,
                    investorWalletName: list.investorWalletName,
                    portfolio: list.subportfolioLabel,
                    date: targetDate,
                    quantity: Number(list.quantity),
                    navPrice: Number(list.valuationPrice),
                    navDate: list.valuationDate,
                    AUI: (list.valuationPrice * list.quantity),
                });
            }

            if (list.orderType === 3) {
                holdingListPrep[found].quantity += list.quantity;
            } else {
                holdingListPrep[found].quantity -= list.quantity;
            }
        });
    
        // removes previous dates
        if (params.dateFrom !== null) {
            // add default holders                        
            const previousHolding = _.filter(holdingListPrep, (a) => a.date < params.dateFrom);
            
            const previousHoldingPrep = [];
            _.forEach(previousHolding, (it) => {
                const alreadyExist = _.findIndex(previousHoldingPrep, {
                    companyName: it.companyName,
                    fundName: it.fundName,
                    fundShareName: it.fundShareName,
                    investorWalletName: it.investorWalletName,
                    portfolio: it.portfolio,
                });

                // check duplicate in filtered array
                const foundDuplicateDate = _.findIndex(holdingListPrep, {
                    companyName: it.companyName,
                    fundName: it.fundName,
                    fundShareName: it.fundShareName,
                    investorWalletName: it.investorWalletName,
                    portfolio: it.portfolio,
                    date: params.dateFrom,
                });

                if (foundDuplicateDate !== -1) return;

                // already exist in array, check if date is more recent
                if (alreadyExist > -1) {
                    const foundItem = previousHoldingPrep[alreadyExist];
                    if (foundItem.realDate >= it.date) {
                        foundItem.quantity = it.quantity + foundItem.quantity;
                        return;
                    }
                    foundItem.realDate = it.date;
                    foundItem.quantity = it.quantity + foundItem.quantity;
                    foundItem.navDate = it.navDate;
                    foundItem.navPrice = it.navPrice;
                    foundItem.AUI = it.navPrice * it.quantity;
                    return;
                }

                it.realDate = it.date;
                it.date = params.dateFrom;
                previousHoldingPrep.push(it);
                return;
            });

            holdingListPrep = _.merge(previousHoldingPrep, _.filter(holdingListPrep, (a) => a.date >= params.dateFrom));
        }

        // share aggregation
        holdingListPrep = this.shareAggregation(holdingListPrep, params.aggregationShare);

        // portfolio aggregation
        holdingListPrep = this.portfolioAggregation(holdingListPrep, params.aggregationPortfolio);

        // Hide zero position
        if (params.hideZeroPosition) {
            holdingListPrep = _.filter(holdingListPrep, (a) => a.quantity > 0);
        }

        this.holdingListFiltered = _.uniq(holdingListPrep);
    }

    portfolioAggregation(data, type) {
        let filteredData = data;

        if (type === 'investor' || type === "pm") {
            filteredData = _.reduce(data, (result, value, key) => {
                const found = _.findIndex(result, {
                    companyName: value.companyName,
                    fundName: value.fundName,
                    fundShareName: value.fundShareName,
                    date: value.date,
                    investorWalletName: value.investorWalletName,
                });

                if (found < 0) {
                    value.portfolio = null;
                    result.push(value);
                    return result;
                }

                result[found].quantity += value.quantity;
                return result;
            }, []);
        }

        if (type === 'global') {

        }

        return filteredData;
    }

    shareAggregation(data, type) {
        let filteredData = data;

        if (type === 'fund') {
            filteredData = _.reduce(data, (result, value, key) => {
                const found = _.findIndex(result, {
                    companyName: value.companyName,
                    investorWalletName: value.investorWalletName,
                    portfolio: value.portfolio,
                    fundName: value.fundName,
                    date: value.date,
                });

                if (found < 0) {
                    value.fundShareName = null;
                    value.isin = null;
                    value.navPrice = null;
                    value.navDate = null;

                    result.push(value);
                    return result;
                }

                result[found].quantity += value.quantity;
                return result;
            }, []);
        }

        if (type === 'amc') {
            filteredData = _.reduce(data, (result, value, key) => {
                const found = _.findIndex(result, {
                    companyName: value.companyName,
                    investorWalletName: value.investorWalletName,
                    portfolio: value.portfolio,
                    date: value.date,
                });

                if (found < 0) {
                    value.fundName = null;
                    value.fundShareName = null;
                    value.isin = null;
                    value.navPrice = null;
                    value.navDate = null;

                    result.push(value);
                    return result;
                }

                result[found].quantity += value.quantity;
                return result;
            }, []);
        }

        if (type === 'global') {
            filteredData = _.reduce(data, (result, value, key) => {
                const found = _.findIndex(result, {
                    investorWalletName: value.investorWalletName,
                    portfolio: value.portfolio,
                    date: value.date,
                });

                if (found < 0) {
                    value.companyName = null;
                    value.fundName = null;
                    value.fundShareName = null;
                    value.isin = null;
                    value.navPrice = null;
                    value.navDate = null;

                    result.push(value);
                    return result;
                }

                result[found].quantity += value.quantity;
                return result;
            }, []);
        }
        return filteredData;
    }

    handleDropdownInvestorSelect(event) {
        this.investorSelected = event.id;
        this.subportfolioSelected = null;
        this.searchForm.controls['portfolio'].setValue('');

        // get subportfolio investor list from holding list
        this.filteredSubportfolioList = _.reduce(this.holdingList, (result, value, key) => {
            if (_.findIndex(result, { id: value.subportfolioID }) < 0) {

                if (value.investorWalletID === event.id) {
                    result.push({
                        id: value.subportfolioID,
                        text: value.subportfolioLabel,
                    })
                }
            }

            return result;
        }, []);
    }

    handleDropdownInvestorWalletSelect(event) {
        this.subportfolioSelected = event.id;
    }

    handleDropdownDateTypeSelect(event) {
        this.dateTypeSelected = event.id;
    }

    handleDropdownAmSelect(event) {
        this.managementCompanySelected = event.id;
        this.filteredFundList = _.filter(this.fundList, { managementCompanyName: event.text });
        this.filteredShareList = [];

        this.searchForm.controls['fundName'].setValue('');
        this.fundSelected = null;

        this.searchForm.controls['shareName'].setValue('');
        this.shareSelected = null;
    }

    handleDropdownFundSelect(event) {
        this.fundSelected = event.id;
        this.filteredShareList = _.filter(this.shareList, { fundID: event.id });

        this.shareSelected = null;
        this.searchForm.controls['shareName'].setValue('');
    }

    handleDropdownShareSelect(event) {
        this.shareSelected = event.id;
    }

    // getters
    get isInvestor(): boolean {
        return Boolean(this.userType === 46);
    }

    get isIznesAdmin() {
        let iznesAdmin = false;
        if (!!this.menuSpec && Object.keys(this.menuSpec).length > 0) {
            this.menuSpec[Object.keys(this.menuSpec)[0]].forEach((row) => {
                if (String(row['element_id']) === 'order-activity') iznesAdmin = true;
            });
        }
        return iznesAdmin;
    }
}
