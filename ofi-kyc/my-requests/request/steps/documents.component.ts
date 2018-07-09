import {Component, OnInit, Input, OnDestroy} from '@angular/core';
import {PersistService} from '@setl/core-persist';
import {isEmpty, castArray} from 'lodash';
import {select} from '@angular-redux/store';
import {Subject} from 'rxjs/Subject';

import {RequestsService} from '../../requests.service';
import {NewRequestService} from '../new-request.service';
import {DocumentsService, documentFormPaths} from './documents.service';

@Component({
    selector : 'kyc-step-documents',
    templateUrl : './documents.component.html'
})
export class NewKycDocumentsComponent implements OnInit, OnDestroy{

    @select(['user', 'connected', 'connectedWallet']) connectedWallet$;
    @select(['ofi', 'ofiKyc', 'myKycRequested', 'kycs']) requests$;

    @Input() form;
    @Input() set isListedCompany(isCompany){
        if(isCompany){
            this.form.get('other').disable();
            this.form.get('listedCompany').enable();
        }
        else {
            this.form.get('other').enable();
            this.form.get('listedCompany').disable();
        }
    };

    unsubscribe: Subject<any> = new Subject();
    connectedWallet;

    constructor(
        private requestsService : RequestsService,
        private newRequestService : NewRequestService,
        private persistService : PersistService,
        private documentsService : DocumentsService
    ){}

    ngOnInit() {
        this.persistForm();
        this.initData();
        this.getCurrentFormData();
    }

    initData(){
        this.connectedWallet$.subscribe(connectedWallet => {
            this.connectedWallet = connectedWallet;
        });
    }

    persistForm(){
        this.persistService.watchForm(
            'newkycrequest/documents',
            this.form
        );
    }

    clearPersistForm(){
        this.persistService.refreshState(
            'newkycrequest/documents',
            this.newRequestService.createDocumentsFormGroup()
        );
    }

    uploadFile($event, formControl){
        this.requestsService.uploadFile($event).then((file : any) => {
            formControl.get('hash').patchValue(file.fileHash);
            formControl.get('name').patchValue(file.fileTitle);
        });
    }

    isDisabled(path) {
        let control = this.form.get(path);

        return control.disabled;
    }

    hasError(control, error = []){
        return this.newRequestService.hasError(this.form, control, error);
    }

    handleSubmit(e){
        e.preventDefault();

        // if(!this.form.valid){
        //     return;
        // }

        this.requests$.take(1).subscribe(requests => {
            this.documentsService.sendRequest(this.form, requests, this.connectedWallet);

            this.clearPersistForm();
        });

        return;
    }

    getCurrentFormData() {
        this.requests$
            .filter(requests => !isEmpty(requests))
            .map(requests => castArray(requests[0]))
            .takeUntil(this.unsubscribe)
            .subscribe(requests => {
                requests.forEach(request => {
                    this.documentsService.getCurrentFormDocumentsData(request.kycID, this.connectedWallet).then(formData => {
                        formData.forEach(value => {
                            let type = value.type;

                            if(type){
                                let path = documentFormPaths[type];
                                let control = this.form.get([path, type]);

                                control.patchValue(value);
                            }
                        });
                    });
                });
            })
        ;
    }

    ngOnDestroy(){
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}