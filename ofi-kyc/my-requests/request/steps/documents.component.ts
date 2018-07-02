import {Component, OnInit, Input} from '@angular/core';
import {PersistService} from '@setl/core-persist';

import {NewRequestService} from '../new-request.service';

@Component({
    selector : 'kyc-step-documents',
    templateUrl : './documents.component.html'
})
export class NewKycDocumentsComponent implements OnInit{

    @Input() isListedCompany;
    @Input() form;

    constructor(
        private newRequestService : NewRequestService,
        private persistService : PersistService
    ){}

    ngOnInit(){
        this.persistForm();
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

    uploadFile($event){
        this.newRequestService.uploadFile($event).then(fileID => {

        });
    }

    handleSubmit(){
        this.clearPersistForm();
    }
}