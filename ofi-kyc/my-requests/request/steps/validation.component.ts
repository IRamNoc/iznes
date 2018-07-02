import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {select} from '@angular-redux/store';
import {Subject} from 'rxjs/Subject';
import {isEmpty, find, get as getValue} from 'lodash';
import {NewRequestService, configDate} from '../new-request.service';

@Component({
    selector: 'kyc-step-validation',
    templateUrl: './validation.component.html',
    styleUrls : ['./validation.component.scss']
})
export class NewKycValidationComponent implements OnInit, OnDestroy {

    @Input() form;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;

    unsubscribe: Subject<any> = new Subject();
    amcs = [];
    configDate;

    constructor(
        private newRequestService : NewRequestService
    ){}

    ngOnInit() {
        this.initData();
        this.configDate = configDate;
    }

    initData() {
        this.requests$
            .combineLatest(this.managementCompanyList$)
            .takeUntil(this.unsubscribe)
            .subscribe(([requests, managementCompanyList]) => {
                if(!isEmpty(requests) && !isEmpty(managementCompanyList)){
                    this.getCompanyNames(requests, managementCompanyList);
                }
            })
        ;
    }

    getCompanyNames(requests, managementCompanyList){
        requests.forEach(request => {
            let company = find(managementCompanyList, ['companyID', request.amcID]);
            let companyName = getValue(company, 'companyName');

            if(companyName){
                this.amcs.push({
                    amcID : request.amcID,
                    companyName : companyName
                });
            }
        })
    }

    handleSubmit($event) {

    }

    hasError(control, error = []){
        return this.newRequestService.hasError(this.form, control, error);
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}