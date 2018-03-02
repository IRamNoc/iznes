import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {APP_CONFIG, AppConfig} from '@setl/utils/index';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {select} from '@angular-redux/store';
import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    selector: 'app-ofi-kyc-already-done',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
})
export class OfiKycAlreadyDoneComponent implements OnInit, OnDestroy {

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
    sendNewKycBody = {
        invitationToken: null,
        amManagementCompanyID: null,
    };
    lang: string;

    private unsubscribe: Subject<any> = new Subject();

    @select(['user', 'siteSettings', 'language']) language$;
    @select(['ofi', 'ofiKyc', 'myInformations']) myInfos$;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private ofiKycService: OfiKycService,
        @Inject(APP_CONFIG) appConfig: AppConfig
    ) {
        this.appConfig = appConfig;
        route.params.subscribe((p => this.investorStatus = p['status']))
        this.kycDoneForm = fb.group({
            opt: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.myInfos$
            .takeUntil(this.unsubscribe)
            .subscribe((d) => {
                this.amDetails.firstName.value = d.invitedBy.firstName;
                this.amDetails.lastName.value = d.invitedBy.lastName;
                this.amDetails.email.value = d.invitedBy.email;
                this.amDetails.phone.value = `${d.invitedBy.phoneCode} ${d.invitedBy.phoneNumber}`;
                this.amDetails.companyName.value = d.invitedBy.companyName;

                this.sendNewKycBody.invitationToken = d.invitationToken;
                this.sendNewKycBody.amManagementCompanyID = d.amManagementCompanyID;
            });

        this.language$.takeUntil(this.unsubscribe).subscribe((language) => this.lang = language);
    }

    onCancel() {
        this.router.navigate(['new-investor', 'informations']);
    }

    onSubmit() {
        if (this.kycDoneForm.value['opt'] === 'YES') {
            this.sendNewKycBody = Object.assign({}, this.sendNewKycBody, {
                selectedChoice: true,
                lang: this.lang
            });

            this.ofiKycService.sendNewKyc(this.sendNewKycBody);
            this.router.navigate(['new-investor', 'already-done', 'waiting-for-validation']);
        } else {
            this.showModal = true;

            this.sendNewKycBody = Object.assign({}, this.sendNewKycBody, {
                selectedChoice: false,
                lang: this.lang
            });
        }
    }

    closeModal() {
        this.showModal = false;
    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
