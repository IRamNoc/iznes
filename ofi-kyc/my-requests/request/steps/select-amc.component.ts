
import {combineLatest as observableCombineLatest, Subject, Observable} from 'rxjs';
import { takeUntil, filter as rxfilter } from 'rxjs/operators';
import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {select, NgRedux} from '@angular-redux/store';
import {ActivatedRoute} from '@angular/router';
import {isEmpty, isNil, keyBy, filter} from 'lodash';

import {ClearMyKycListRequested} from '@ofi/ofi-main/ofi-store/ofi-kyc';
import {OfiManagementCompanyService} from "@ofi/ofi-main/ofi-req-services/ofi-product/management-company/management-company.service";
import {OfiKycService} from "@ofi/ofi-main/ofi-req-services/ofi-kyc/service";
import {RequestsService} from '../../requests.service';

@Component({
    selector: 'kyc-step-select-amc',
    styleUrls : ['./select-amc.component.scss'],
    templateUrl: './select-amc.component.html'
})
export class NewKycSelectAmcComponent implements OnInit, OnDestroy {

    private unsubscribe: Subject<any> = new Subject();
    private managementCompanies;
    private kycList;
    private managementCompaniesExtract;

    preselectedManagementCompany : any = {};

    get filteredManagementCompanies(){
        let id = this.preselectedManagementCompany.id;

        if(id){
            return filter(this.managementCompaniesExtract, company => {
                return company.id !== id;
            });
        }

        return this.managementCompaniesExtract;
    }

    @Input() form: FormGroup;

    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'requested']) requestedManagementCompanyList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;

    constructor(
        private ofiManagementCompanyService: OfiManagementCompanyService,
        private requestsService: RequestsService,
        private ofiKycService: OfiKycService,
        private ngRedux: NgRedux<any>,
        private route: ActivatedRoute
    ) {}

    get selectedManagementCompanies() {
        let selected = this.form.get('managementCompanies').value;

        if (isEmpty(selected)) {
            return [{}];
        }
        return selected;
    }

    ngOnInit() {
        this.initSubscriptions();
        this.getAssetManagementCompanies();
        this.getQueryParams();
    }

    initSubscriptions() {
        this.requestedManagementCompanyList$
            .pipe(
                filter(requested => !requested),
                takeUntil(this.unsubscribe),
            )
            .subscribe(() => {
                this.getAssetManagementCompanies();
            })
        ;

        observableCombineLatest(this.managementCompanyList$, this.myKycList$)
            .pipe(
                takeUntil(this.unsubscribe),
            )
            .subscribe(([managementCompanies, kycList]) => {
                this.managementCompanies = keyBy(managementCompanies, 'companyID');
                this.kycList = kycList;
                this.managementCompaniesExtract = this.requestsService.extractManagementCompanyData(managementCompanies, kycList)
            })
        ;
    }

    getQueryParams() {
        this.route.queryParams.subscribe(queryParams => {

            if (queryParams.invitationToken) {
                this.preselectedManagementCompany = {
                    id : parseInt(queryParams.amcID),
                    invitationToken: queryParams.invitationToken
                };
                this.disableValidators();
            }

        });
    }

    disableValidators(){
        let formControl = this.form.get('managementCompanies');
        formControl.clearValidators();
        formControl.updateValueAndValidity();
    }

    getAssetManagementCompanies() {
        OfiManagementCompanyService.defaultRequestINVManagementCompanyList(this.ofiManagementCompanyService, this.ngRedux, true);
    }

    async handleFormSubmit($event) {
        $event.preventDefault();
        if(!this.form.valid){
            return;
        }

        let values = this.form.get('managementCompanies').value;

        if(this.preselectedManagementCompany.id){
            values = values.concat([this.preselectedManagementCompany]);
        }

        await this.requestsService.createMultipleDrafts(values);
        this.ngRedux.dispatch(ClearMyKycListRequested());
    }

    ngOnDestroy(){
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}
