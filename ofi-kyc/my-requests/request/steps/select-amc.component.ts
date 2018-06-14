import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {select, NgRedux} from '@angular-redux/store';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {isEmpty, isNil, keyBy} from 'lodash';

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
    private filteredManagementCompanies;
    private kycList;
    preselectedManagementCompanyID;

    @Input() form: FormGroup;
    @Input('preselected') set preselected(value){
        this.preselectedManagementCompanyID = value;

        if(!isNil(value)){
            let formControl = this.form.get('managementCompanies');
            formControl.clearValidators();
            formControl.updateValueAndValidity();
        }
    };

    get preselected(){
        return this.preselectedManagementCompanyID;
    }

    @select(['ofi', 'ofiKyc', 'myKycList', 'kycList']) myKycList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'requested']) requestedManagementCompanyList$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'managementCompanyList', 'managementCompanyList']) managementCompanyList$;

    constructor(
        private ofiManagementCompanyService: OfiManagementCompanyService,
        private requestsService: RequestsService,
        private ofiKycService: OfiKycService,
        private ngRedux: NgRedux<any>
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
    }

    initSubscriptions() {
        this.requestedManagementCompanyList$
            .filter(requested => !requested)
            .takeUntil(this.unsubscribe)
            .subscribe(() => {
                this.getAssetManagementCompanies();
            })
        ;

        Observable
            .combineLatest(this.managementCompanyList$, this.myKycList$)
            .takeUntil(this.unsubscribe)
            .subscribe(([managementCompanies, kycList]) => {
                this.managementCompanies = keyBy(managementCompanies, 'companyID');
                this.filteredManagementCompanies = this.requestsService.extractManagementCompanyData(managementCompanies, kycList)
            })
        ;
    }

    getAssetManagementCompanies() {
        // @todo Use correct call for investor once merging is done
        OfiManagementCompanyService.defaultRequestManagementCompanyList(this.ofiManagementCompanyService, this.ngRedux);
    }

    handleFormSubmit($event) {
        $event.preventDefault();
        if(!this.form.valid){
            return;
        }

        this.requestsService.createMultipleDrafts(this.form.get('managementCompanies').value);
        this.ngRedux.dispatch(ClearMyKycListRequested());
    }

    ngOnDestroy(){
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}