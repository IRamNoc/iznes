import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';
import 'rxjs/add/operator/takeUntil';
import {MultilingualService} from '@setl/multilingual';
import {fromJS} from 'immutable';
import * as _ from 'lodash';

import {MemberSocketService} from '@setl/websocket-service';
import {OfiManagementCompanyService} from '../../ofi-req-services/ofi-product/management-company/management-company.service';
import {OfiReportsService} from '../../ofi-req-services/ofi-reports/service';

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
export class MyHoldingsComponent implements AfterViewInit, OnDestroy {

    unknownValue = '???';

    managementCompanyList: Array<any> = [];

    selectedManagementCompany = 0;

    holdingsList: Array<any> = [];

    searchForm: FormGroup;

    currencyList = [
        {id: 0, text: 'EUR'},
        {id: 1, text: 'USD'},
        {id: 2, text: 'GBP'},
        {id: 3, text: 'CHF'},
        {id: 4, text: 'JPY'},
        {id: 5, text: 'AUD'},
        {id: 6, text: 'NOK'},
        {id: 7, text: 'SEK'},
        {id: 8, text: 'ZAR'},
        {id: 9, text: 'RUB'},
        {id: 10, text: 'SGD'},
        {id: 11, text: 'AED'},
        {id: 12, text: 'CNY'},
        {id: 13, text: 'PLN'},
    ];

    private myDetails: any = {};
    private appConfig: any = {};
    private subscriptions: Array<any> = [];

    private connectedWalletId: any = 0;

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'myDetail']) myDetailOb: any;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletOb: any;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'invRequested']) requestedINVManagementCompanyListOb;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) invManagementCompanyAccessListOb;
    @select(['ofi', 'ofiReports', 'amHolders', 'invRequested']) requestedOfiInvHoldingsObj;
    @select(['ofi', 'ofiReports', 'amHolders', 'invHoldingsList']) ofiInvHoldingsListObj;

    constructor(
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private _fb: FormBuilder,
        private mcService: OfiManagementCompanyService,
        private memberSocketService: MemberSocketService,
        private ofiReportsService: OfiReportsService,
        private _translate: MultilingualService,
    ) {
        this.createsearchForm();
    }

    ngAfterViewInit() {
        this.subscriptions['my-connected'] = this.connectedWalletOb.subscribe((connectedWalletId) => {
            /* Assign list to a property. */
            this.connectedWalletId = connectedWalletId;

            if (this.connectedWalletId !== 0) {
                this.subscriptions.push(this.requestedINVManagementCompanyListOb.subscribe(invRequested => this.getINVManagementCompanyListRequested(invRequested)));
                this.subscriptions.push(this.invManagementCompanyAccessListOb.subscribe(investorManagementCompanyList => this.getINVManagementCompanyListFromRedux(investorManagementCompanyList)));
                this.subscriptions.push(this.requestedOfiInvHoldingsObj.subscribe(requested => this.getInvHoldingsRequested(requested)));
                this.subscriptions.push(this.ofiInvHoldingsListObj.subscribe(list => this.getInvHoldingsListFromRedux(list)));
            }
        });
    }

    getINVManagementCompanyListRequested(requested): void {
        // this.logService.log('requested', requested);
        if (!requested) {
            OfiManagementCompanyService.defaultRequestINVManagementCompanyList(this.mcService, this.ngRedux);
        }
    }

    getINVManagementCompanyListFromRedux(managementCompanyList) {
        const managementCompanyListImu = fromJS(managementCompanyList);

        this.managementCompanyList = managementCompanyListImu.reduce((result, item) => {

            result.push({
                id: item.get('companyID', 0),
                text: item.get('companyName', ''),
                // companyID: item.get('companyID', 0),
                // companyName: item.get('companyName', ''),
                // country: item.get('country', ''),
                // addressPrefix: item.get('addressPrefix', ''),
                // postalAddressLine1: item.get('postalAddressLine1', ''),
                // postalAddressLine2: item.get('postalAddressLine2', ''),
                // city: item.get('city', ''),
                // stateArea: item.get('stateArea', ''),
                // postalCode: item.get('postalCode', ''),
                // taxResidence: item.get('taxResidence', ''),
                // registrationNum: item.get('registrationNum', ''),
                // supervisoryAuthority: item.get('supervisoryAuthority', ''),
                // numSiretOrSiren: item.get('numSiretOrSiren', ''),
                // creationDate: item.get('creationDate', ''),
                // shareCapital: item.get('shareCapital', 0),
                // commercialContact: item.get('commercialContact', ''),
                // operationalContact: item.get('operationalContact', ''),
                // directorContact: item.get('directorContact', ''),
                // lei: item.get('lei', ''),
                // bic: item.get('bic', ''),
                // giinCode: item.get('giinCode', ''),
                // logoName: item.get('logoName', ''),
                // logoURL: item.get('logoURL', ''),
            });

            return result;
        }, []);

        this.changeDetectorRef.markForCheck();
    }

    getInvHoldingsRequested(requested): void {
        // this.logService.log('requested', requested);
        if (!requested) {
            const payload = {amCompanyID: this.selectedManagementCompany, walletID: this.connectedWalletId};
            OfiReportsService.defaultRequestInvHoldingsList(this.ofiReportsService, this.ngRedux, payload);
        }
    }

    getInvHoldingsListFromRedux(list) {
        const listImu = fromJS(list);

        this.holdingsList = listImu.reduce((result, item) => {

            result.push({
                amManagementCompanyID: item.get('amManagementCompanyID', 0),
                companyName: item.get('companyName', ''),
                shareID: item.get('shareID', 0),
                fundShareName: item.get('fundShareName', ''),
                isin: item.get('isin', ''),
                shareClassCurrency: item.get('shareClassCurrency', ''),
                latestNav: item.get('latestNav', 0),
                portfolioAddr: item.get('portfolioAddr', ''),
                portfolioLabel: item.get('portfolioLabel', ''),
                quantity: item.get('quantity', 0),
                amount: item.get('amount', 0),
                ratio: item.get('ratio', 0),
            });

            return result;
        }, []);

        this.changeDetectorRef.markForCheck();
    }

    requestSearch(form) {
        if (this.searchForm.get('search').value && this.searchForm.get('search').value[0] && this.searchForm.get('search').value[0].id) {
            this.selectedManagementCompany = this.searchForm.get('search').value[0].id;
            const payload = {amCompanyID: this.selectedManagementCompany, walletID: this.connectedWalletId};
            OfiReportsService.defaultRequestInvHoldingsList(this.ofiReportsService, this.ngRedux, payload);
        }
    }

    createsearchForm() {
        this.searchForm = this._fb.group({
            search: [
                '',
            ],
        });
        this.subscriptions.push(this.searchForm.valueChanges.subscribe((form) => this.requestSearch(form)));
    }

    showCurrency(currency) {
        const obj = this.currencyList.find(o => o.id === currency);
        if (obj !== undefined) {
            return obj.text;
        } else {
            return currency;
        }
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptions) {
            subscription.unsubscribe();
        }
    }
}
