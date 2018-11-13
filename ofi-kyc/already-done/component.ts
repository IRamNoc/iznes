import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APP_CONFIG, AppConfig, SagaHelper } from '@setl/utils/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Endpoints } from '../config';
import { MyUserService } from '@setl/core-req-services';
import { ToasterService } from 'angular2-toaster';
import { immutableHelper } from '@setl/utils';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-ofi-kyc-already-done',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})
export class OfiKycAlreadyDoneComponent implements OnInit, OnDestroy {
    appConfig: AppConfig;
    endpointsConfig: Endpoints;
    investorStatus: string;
    kycDoneForm: FormGroup;
    showModal = false;
    investorAnsweredNo = false;
    amDetails = {
        firstName: { value: '', label: '' },
        lastName: { value: '', label: '' },
        email: { value: '', label: '' },
        phone: { value: '', label: '' },
        companyName: { value: '', label: '' },
    };

    investorDetails = {
        email: '',
        phoneCode: '',
        phoneNumber: '',
        companyName: ''
    };

    sendNewKycBody = {
        invitationToken: null,
        amManagementCompanyID: null,
    };
    lang: string;
    @select(['user', 'siteSettings', 'language']) language$;
    @select(['ofi', 'ofiKyc', 'myInformations']) myInfos$;
    @select(['user', 'myDetail']) myDetails$;
    private unsubscribe: Subject<any> = new Subject();

    constructor(private fb: FormBuilder,
                private router: Router,
                private route: ActivatedRoute,
                private ofiKycService: OfiKycService,
                private myUserService: MyUserService,
                private ngRedux: NgRedux<any>,
                private changeDetectorRef: ChangeDetectorRef,
                private translate: MultilingualService,
                @Inject('endpoints') endpoints,
                @Inject(APP_CONFIG) appConfig: AppConfig) {
        this.appConfig = appConfig;
        this.endpointsConfig = endpoints;

        route.params.subscribe((p => {
            this.investorStatus = p['status'];
            this.investorAnsweredNo = this.investorStatus === 'waiting-for-more-info';
            this.showModal = this.investorAnsweredNo;
        }));
        this.kycDoneForm = fb.group({
            opt: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.amDetails = {
            firstName: { value: '', label: this.translate.translate('First Name') },
            lastName: { value: '', label: this.translate.translate('Last Name') },
            email: { value: '', label: this.translate.translate('Email') },
            phone: { value: '', label: this.translate.translate('Phone Number') },
            companyName: { value: '', label: this.translate.translate('AM Company Name') },
        };

        this.myInfos$
        // .takeUntil(this.unsubscribe)
            .subscribe((d) => {
                this.amDetails.firstName.value = d.invitedBy.firstName;
                this.amDetails.lastName.value = d.invitedBy.lastName;
                this.amDetails.email.value = d.invitedBy.email;
                this.amDetails.phone.value = `${d.invitedBy.phoneCode} ${d.invitedBy.phoneNumber}`;
                this.amDetails.companyName.value = d.amCompanyName;

                this.sendNewKycBody.invitationToken = d.invitationToken;
                this.sendNewKycBody.amManagementCompanyID = d.amManagementCompanyID;

                this.amDetails = immutableHelper.copy(this.amDetails);

                this.changeDetectorRef.markForCheck();

            });
        this.myDetails$.pipe(
            takeUntil(this.unsubscribe))
            .subscribe((d) => {
                const phoneNumber = (d.phoneCode && d.phoneNumber) ? `${d.phoneCode} ${d.phoneNumber}` : '';

                this.investorDetails.email = d.emailAddress;
                this.investorDetails.phoneNumber = phoneNumber;
                this.investorDetails.companyName = d.companyName;
            });

        /* fetch backend for existing data to pre fill the form */
        this.ofiKycService.fetchInvestor();

        this.language$.pipe(
            takeUntil(this.unsubscribe))
            .subscribe((language) => this.lang = language);
    }

    onCancel() {
        this.router.navigate(['new-investor', 'informations']);
    }

    onSubmit() {
        if (this.kycDoneForm.value['opt'] === 'YES') {
            this.sendNewKycBody = Object.assign({}, this.sendNewKycBody, {
                selectedChoice: true,
                lang: this.lang,
                amFirstName: this.amDetails.firstName.value,
                amCompanyName: this.amDetails.companyName.value,
                investorCompanyName: this.investorDetails.companyName
            });

            const newUserDetails = {
                defaultHomePage: this.endpointsConfig.alreadyDoneWaitingForApproval,
            };

            const asyncTaskPipe = this.myUserService.saveMyUserDetails(newUserDetails);
            this.ngRedux.dispatch(SagaHelper.runAsyncCallback(asyncTaskPipe));
            this.ofiKycService.sendNewKyc(this.sendNewKycBody);
            this.router.navigate(['new-investor', 'already-done', 'waiting-for-validation']);
        } else {
            this.showModal = true;
            this.investorAnsweredNo = true;

            this.sendNewKycBody = Object.assign({}, this.sendNewKycBody, {
                selectedChoice: false,
                lang: this.lang,
                amFirstName: this.amDetails.firstName.value,
                amCompanyName: this.amDetails.companyName.value,
                investorCompanyName: this.investorDetails.companyName,
                investorEmail: this.investorDetails.email,
                investorPhoneNumber: this.investorDetails.phoneNumber,
                defaultHomePage: this.endpointsConfig.alreadyDoneConfirmation,
            });

            this.ofiKycService.sendNewKyc(this.sendNewKycBody);
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
