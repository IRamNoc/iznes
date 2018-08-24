import { Component, OnInit, Inject } from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

import {ToasterService} from 'angular2-toaster';

import { MemberSocketService } from '@setl/websocket-service';
import {APP_CONFIG, AppConfig} from '@setl/utils';
import {SagaHelper} from '@setl/utils/index';
import {passwordValidator} from '@setl/utils/helper/validators/password.directive';
import {MyUserService} from '@setl/core-req-services/index';
import {SET_NEW_PASSWORD} from '@setl/core-store/index';
import {AlertsService} from '@setl/jaspero-ng2-alerts/index';
import {MultilingualService} from '@setl/multilingual';

import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';

import { take } from 'rxjs/operators';
import {get as getValue} from 'lodash'


@Component({
    selector: 'app-profile-my-informations',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
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
        phoneNumber: ''
    };

    changePassForm: FormGroup;
    oldPassword: AbstractControl;
    password: AbstractControl;
    passwordConfirm: AbstractControl;


    public showPasswords = false;

    @select(['user', 'myDetail']) myDetail: any;
    @select(['ofi', 'ofiKyc', 'myInformations']) myKyc: any;

    constructor(
        private _ngRedux: NgRedux<any>,
        private router: Router,
        private toasterService: ToasterService,
        private myUserService: MyUserService,
        private ofiKycService: OfiKycService,
        private alertsService: AlertsService,
        public _translate: MultilingualService,
        private memberSocketService: MemberSocketService,
        @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;

        let validator = this.appConfig.production ? passwordValidator : null;
        this.changePassForm = new FormGroup({
            'oldPassword': new FormControl(
                '',
                Validators.required
            ),
            'password': new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    validator
                ])
            ),
            'passwordConfirm': new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                ])
            )
        }, this.passwordValidator);

        this.oldPassword = this.changePassForm.controls['oldPassword'];
        this.password = this.changePassForm.controls['password'];
        this.passwordConfirm = this.changePassForm.controls['passwordConfirm'];
    }

    ngOnInit() {
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
                phoneNumber: d.phoneNumber
            };

            this.userType = d.userType;
        });
        this.myKyc.subscribe((d) => {
            this.userInfoExtended.amCompanyName = d.amCompanyName;
        });
    }

    passwordValidator(g: FormGroup) {
        const oldNew = g.get('oldPassword').value !== g.get('password').value ? null : {'oldNew': true};
        const mismatch = g.get('password').value === g.get('passwordConfirm').value ? null : {'mismatch': true};
        return (oldNew) ? oldNew : mismatch;
    }

    toggleShowPasswords() {
        this.showPasswords = !this.showPasswords;
    }

    changePass(formValues) {

        const asyncTaskPipe = this.myUserService.saveNewPassword({
            oldPassword: formValues.oldPassword,
            newPassword: formValues.password
        });

        // Get response
        this._ngRedux.dispatch(
            SagaHelper.runAsync(
                [SET_NEW_PASSWORD],
                [],
                asyncTaskPipe,
                {},
                (data) => {
                    const token = getValue(data, '[1].Data[0].Token', '');
                    this.memberSocketService.token = token;

                    this.changePassForm.reset();
                    this.alertsService.create('success', `
                        Your password has been successfully changed!
                    `)
                    .asObservable()
                    .pipe(take(1))
                    .subscribe(() => {
                        this.router.navigate(['home']);
                    });
                },
                (e) => {
                    this.alertsService.create('warning', `
                        Failed to change your password!
                    `);
                }
            )
        );

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
        this._ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            () => {
                this.toasterService.pop('success', 'Saved changes');
                this.router.navigate(['home']);
            },
            (data) => {
                this.toasterService.pop('error', JSON.stringify(data));
            })
        );
    }

    hasError(path, error) {
        if (this.changePassForm) {
            let formControl: AbstractControl = path ? this.changePassForm.get(path) : this.changePassForm;

            if (error !== 'required' && formControl.hasError('required')) {
                return false;
            }
            return formControl.touched && (error ? formControl.hasError(error) : formControl.errors);
        }
    }

    isTouched(path) {
        let formControl: AbstractControl = this.changePassForm.get(path);

        return formControl.touched;
    }

    closeUserInformations() {
        this.router.navigate(['home']);
    }

}
