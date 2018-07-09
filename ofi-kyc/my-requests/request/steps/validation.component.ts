import {Component, Input, OnInit, OnDestroy} from '@angular/core';
import {select} from '@angular-redux/store';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {isEmpty, find, get as getValue, castArray} from 'lodash';
import {AlertsService} from '@setl/jaspero-ng2-alerts';

import {RequestsService} from '../../requests.service';
import {NewRequestService, configDate} from '../new-request.service';
import {ValidationService} from './validation.service';

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
        private requestsService : RequestsService,
        private newRequestService : NewRequestService,
        private validationService : ValidationService,
        private alerts : AlertsService,
        private router : Router
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
        this.amcs = [];
        requests.forEach(request => {
            let company = find(managementCompanyList, ['companyID', request.amcID]);
            let companyName = getValue(company, 'companyName');

            if(companyName){
                this.amcs.push({
                    amcID : request.amcID,
                    companyName : companyName
                });
            }
        });
    }

    handleConfirm(){
        let bodyMessage;

        if(this.amcs.length == 1){
            bodyMessage = `<p>Your request has been successfully sent to [AM Company Name]. Once they will have validated your request, you will be able to start trading on IZNES on [AM Company Name]'s products.</p>`;
        }
        else {
            let companies = ['<ul>'];
            this.amcs.forEach(amc => {
                let companyText = `<li>${amc.companyName}</li>`;
                companies.push(companyText);
            });
            companies.push('</ul>');

            bodyMessage = `<p>Your request has been successfully sent to the following asset management companies:</p> ${companies.join('')} <p>Once they will have validated your request, you will be able to start trading on IZNES these asset management companies' products.</p>`;
        }

        this.alerts.create('success', `
            <table class="table grid">
                <tbody>
                    <tr>
                        <td class="text-center text-success">${bodyMessage}</td>
                    </tr>
                </tbody>
            </table>
        `).subscribe(() => {
            this.router.navigate(['my-requests', 'list']);
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        if(!this.form.valid){
            return;
        }

        this.requests$.take(1).subscribe(requests => {
            this.validationService.sendRequest(this.form, requests).then(() => {
                this.handleConfirm();
            });
        });
    }

    hasError(control, error = []){
        return this.newRequestService.hasError(this.form, control, error);
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }

    uploadFile($event){
        this.requestsService.uploadFile($event).then((file : any) => {
            this.form.get('electronicSignatureDocumentID').patchValue(file.fileID);
        });
    }

    getCurrentFormData(){
        this.requests$
            .filter(requests => !isEmpty(requests))
            .map(requests => castArray(requests[0]))
            .takeUntil(this.unsubscribe)
            .subscribe(requests => {
                requests.forEach(request => {
                    this.validationService.getCurrentFormValidationData(request.kycID);
                });
            })
        ;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

}