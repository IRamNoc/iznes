import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {APP_CONFIG, AppConfig} from '@setl/utils/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-ofi-kyc-already-done',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiKycAlreadyDoneComponent implements OnInit {

    appConfig: AppConfig;
    hasFilledUp = false;
    kycDoneForm: FormGroup;
    showModal = false;
    amDetails = {
        firstName: {value: '', label: 'First name'},
        lastName: {value: '', label: 'Last name'},
        email: {value: '', label: 'Email'},
        phone: {value: '', label: 'Phone number'},
        companyName: {value: '', label: 'AM Company name'},
    };

    constructor(
        private fb: FormBuilder,
        private router: Router,
        @Inject(APP_CONFIG) appConfig: AppConfig
    ) {
        this.appConfig = appConfig;
        this.kycDoneForm = fb.group({
            opt: ['', Validators.required],
        });
    }

    ngOnInit() {

    }

    onCancel() {
        this.router.navigate(['new-investor', 'informations']);
    }

    onSubmit() {
        if (this.kycDoneForm.value['opt'] === 'YES') {
            this.hasFilledUp = true;
        } else {
            this.showModal = true;
        }
    }

    closeModal() {
        this.showModal = false;
    }
}
