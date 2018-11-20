import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToasterService } from 'angular2-toaster';
import { MemberSocketService } from '@setl/websocket-service';
import { APP_CONFIG, AppConfig } from '@setl/utils';
import { SagaHelper } from '@setl/utils/index';
import { passwordValidator } from '@setl/utils/helper/validators/password.directive';
import { MyUserService } from '@setl/core-req-services/index';
import { SET_NEW_PASSWORD } from '@setl/core-store/index';
import { AlertsService } from '@setl/jaspero-ng2-alerts/index';
import { MultilingualService } from '@setl/multilingual';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { take } from 'rxjs/operators';
import { get as getValue } from 'lodash';

@Component({
    selector: 'app-profile-my-informations',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
})
export class OfiProfileMyInformationsComponent implements OnInit {
    appConfig: AppConfig;
    userInfo = {
        firstName: '',
        lastName: '',
    };
    userType: string;

    public userInfoExtended: any = {
        email: '',
        firstName: '',
        lastName: '',
        amCompanyName: '',
        companyName: '',
        phoneCode: '',
        phoneNumber: '',
    };

    changePassForm: FormGroup;
    oldPassword: AbstractControl;
    password: AbstractControl;
    passwordConfirm: AbstractControl;
    validation: number = 3;

    public showPasswords = {
        1: false,
        2: false,
        3: false,
    };

    externalNotificationsAvailable: boolean = false;

    @select(['user', 'myDetail']) myDetail: any;
    @select(['ofi', 'ofiKyc', 'myInformations']) myKyc: any;

    constructor(
        private ngRedux: NgRedux<any>,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private toasterService: ToasterService,
        private myUserService: MyUserService,
        private ofiKycService: OfiKycService,
        private alertsService: AlertsService,
        public translate: MultilingualService,
        private memberSocketService: MemberSocketService,
        @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;

        const validator = this.appConfig.production ? passwordValidator : null;
        this.changePassForm = new FormGroup(
            {
                oldPassword: new FormControl(
                    '',
                    Validators.required,
                ),
                password: new FormControl(
                    '',
                    Validators.compose([
                        Validators.required,
                        validator,
                    ]),
                ),
                passwordConfirm: new FormControl(
                    '',
                    Validators.compose([
                        Validators.required,
                    ]),
                ),
            },
            this.passwordValidator,
        );

        this.oldPassword = this.changePassForm.controls['oldPassword'];
        this.password = this.changePassForm.controls['password'];
        this.passwordConfirm = this.changePassForm.controls['passwordConfirm'];
    }

    ngOnInit() {
        this.getExternalNotificationsAvailable();

        this.ofiKycService.fetchInvestor();
        this.myDetail.subscribe((d) => {
            this.userInfo = {
                firstName: d.firstName,
                lastName: d.lastName,
            };

            this.userInfoExtended = {
                email: d.emailAddress,
                firstName: d.firstName,
                lastName: d.lastName,
                companyName: d.companyName,
                phoneCode: d.phoneCode,
                phoneNumber: d.phoneNumber,
            };

            this.userType = d.userType;
        });
        this.myKyc.subscribe((d) => {
            this.userInfoExtended.amCompanyName = d.amCompanyName;
        });
    }

    passwordValidator(g: FormGroup) {
        const oldNew = g.get('oldPassword').value !== g.get('password').value ? null : { 'oldNew': true };
        const mismatch = g.get('password').value === g.get('passwordConfirm').value ? null : { 'mismatch': true };
        return (oldNew) ? oldNew : mismatch;
    }

    toggleShowPasswords(id) {
        this.showPasswords[id] = !this.showPasswords[id];
    }

    changePass(formValues) {
        this.validation = 0;

        if (formValues.password.length > 7) {
            this.validation += (formValues.password.match(/[A-Z]/) ? 1 : 0);
            this.validation += (formValues.password.match(/[a-z]/) ? 1 : 0);
            this.validation += (formValues.password.match(/[0-9]/) ? 1 : 0);
            this.validation += (formValues.password.match(/[\u0020-\u002F|\u003A-\u0040|\u005B-\u0060|\u007B-\u007F]/) ? 1 : 0);
            this.validation += (formValues.password.match(/[\u00A0-\uFFFF]/) ? 1 : 0);
        }

        if (this.validation > 2) {
            const asyncTaskPipe = this.myUserService.saveNewPassword({
                oldPassword: formValues.oldPassword,
                newPassword: formValues.password,
            });

            // Get response
            this.ngRedux.dispatch(
                SagaHelper.runAsync(
                    [SET_NEW_PASSWORD],
                    [],
                    asyncTaskPipe,
                    {},
                    (data) => {
                        const token = getValue(data, '[1].Data[0].Token', '');
                        this.memberSocketService.token = token;

                        this.toasterService.pop(
                            'success', this.translate.translate('Your password has been successfully changed'));
                        this.router.navigate(['home']);
                    },
                    (e) => {
                        this.alertsService.create('warning', this.translate.translate('Failed to change your password'));
                    },
                ),
            );
        }
    }

    saveUserInformations(userInformations) {
        const user = {
            firstName: userInformations.firstName,
            lastName: userInformations.lastName,
            email: userInformations.email,
            phoneCode: userInformations.phoneCode,
            phoneNumber: userInformations.phoneNumber,
            companyName: userInformations.companyName,
        };
        const asyncTaskPipe = this.myUserService.saveMyUserDetails(user);
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            () => {
                this.toasterService.pop('success', this.translate.translate('Saved changes'));
                this.router.navigate(['home']);
            },
            (data) => {
                this.toasterService.pop('error', JSON.stringify(data));
            }),
        );
    }

    hasError(path, error) {
        if (this.changePassForm) {
            const formControl: AbstractControl = path ? this.changePassForm.get(path) : this.changePassForm;

            if (error !== 'required' && formControl.hasError('required')) {
                return false;
            }
            return formControl.touched && (error ? formControl.hasError(error) : formControl.errors);
        }
    }

    isTouched(path) {
        const formControl: AbstractControl = this.changePassForm.get(path);

        return formControl.touched;
    }

    closeUserInformations() {
        this.router.navigate(['home']);
    }

    /**
     * Checks if RabbitMQ is available for this system
     *
     * @return {object} status
     */
    getExternalNotificationsAvailable(): any {
        const asyncTaskPipe = this.myUserService.statusNotifications();

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [],
            [],
            asyncTaskPipe,
            {},
            (response) => {
                const responseData = getValue(response, '[1].Data', {});
                if (responseData.hasOwnProperty('state')) this.externalNotificationsAvailable = true;
                this.changeDetectorRef.detectChanges();
            },
            (response) => {
                const responseData = getValue(response, '[1].Data.message.code', 0);
                if (responseData === 503) this.externalNotificationsAvailable = false;
                if (responseData === 404) this.externalNotificationsAvailable = true;
                this.changeDetectorRef.detectChanges();
            },
        ));
    }
}
