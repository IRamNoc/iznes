import {Component, Inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APP_CONFIG, AppConfig} from '@setl/utils/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {select} from '@angular-redux/store';

@Component({
    selector: 'app-ofi-kyc-already-done',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiKycAlreadyDoneComponent implements OnInit {

    appConfig: AppConfig;
    investorStatus: string;
    kycDoneForm: FormGroup;
    showModal = false;
    amDetails = {
        firstName: {value: '', label: 'First name'},
        lastName: {value: '', label: 'Last name'},
        email: {value: '', label: 'Email'},
        phone: {value: '', label: 'Phone number'},
        companyName: {value: '', label: 'AM Company name'},
    };

    @select(['ofi', 'ofiKyc', 'myInformations', 'invitedBy']) amDetails$;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        @Inject(APP_CONFIG) appConfig: AppConfig
    ) {
        this.appConfig = appConfig;
        route.params.subscribe((p => this.investorStatus = p['status']))
        this.kycDoneForm = fb.group({
            opt: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.amDetails$.subscribe((d) => {
            this.amDetails.firstName.value = d.firstName;
            this.amDetails.lastName.value = d.lastName;
            this.amDetails.email.value = d.email;
            this.amDetails.phone.value = `${d.phoneCode} ${d.phoneNumber}`;
            this.amDetails.companyName.value = d.companyName;
        });
    }

    onCancel() {
        this.router.navigate(['new-investor', 'informations']);
    }

    onSubmit() {
        if (this.kycDoneForm.value['opt'] === 'YES') {
            this.router.navigate(['new-investor', 'already-done', 'waiting-for-validation']);
        } else {
            this.showModal = true;
        }
    }

    closeModal() {
        this.showModal = false;
    }
}
