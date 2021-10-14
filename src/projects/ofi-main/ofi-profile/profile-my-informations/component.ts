import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgRedux, select } from '@angular-redux/store';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
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
import { get as getValue } from 'lodash';
import { Subject } from 'rxjs/Subject';
import { SET_LANGUAGE,SET_DECIMAL_SEPERATOR,SET_DATA_SEPERATOR } from '@setl/core-store/user/site-settings/actions';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-profile-my-informations',
    templateUrl: './component.html',
    styleUrls: ['./component.scss'],
})
export class OfiProfileMyInformationsComponent implements OnInit, OnDestroy {

    appConfig: AppConfig;
    userInfo = {
        firstName: '',
        lastName: '',
        teams: '',

    };
    userType: string;
    setHomePage: string;

    public userInfoExtended: any = {
        email: '',
        firstName: '',
        lastName: '',
        teams: '',
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

    userId: number;
    connectedWalletId: number;
    apiKey: string;
    copied = false;

    externalNotificationsAvailable: boolean = false;
    unSubscribe: Subject<any> = new Subject();

    language: string;
    decimalSeparator: string;
    dataSeperatorData: string;

    // first menu link in menu spec.
    firstMenuLink: string;

    @select(['user', 'myDetail']) myDetail: any;
    @select(['user', 'authentication']) authentication$;
    @select(['user', 'connected', 'connectedWallet']) connectedWalletId$;
    @select(['ofi', 'ofiKyc', 'myInformations']) myKyc: any;
    @select(['user', 'siteSettings', 'language']) requestLanguageObj;
    @select(['user', 'siteSettings', 'decimalSeparator']) requestDecimalObj$;
    @select(['user', 'siteSettings', 'dataSeperator']) requestDataObj$;
    @select(['user', 'siteSettings', 'siteMenu']) menSpec$;

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
        private activatedRoute: ActivatedRoute,
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
        this.myDetail.pipe(takeUntil(this.unSubscribe)).subscribe((d) => {
            this.userInfo = {
                firstName: d.firstName,
                lastName: d.lastName,
                teams: d.teams,
            };

            this.userInfoExtended = {
                email: d.emailAddress,
                firstName: d.firstName,
                lastName: d.lastName,
                teams: d.teams,
                companyName: d.companyName,
                phoneCode: d.phoneCode,
                phoneNumber: d.phoneNumber,
            };

            this.userType = d.userType;
            this.userId = d.userId;
        });

        this.myKyc.pipe(takeUntil(this.unSubscribe)).subscribe((d) => {
            this.userInfoExtended.amCompanyName = d.amCompanyName || 'IZNES';
        });

        this.setHomePage = this.activatedRoute.snapshot.paramMap.get('sethomepage') || undefined;

        this.connectedWalletId$.pipe(takeUntil(this.unSubscribe)).subscribe((id) => {
            this.connectedWalletId = id;
        });

        this.authentication$.pipe(takeUntil(this.unSubscribe)).subscribe((auth) => {
            this.apiKey = auth.apiKey;
        });
        this.requestLanguageObj.pipe(takeUntil(this.unSubscribe)).subscribe(requested => this.language = requested);
        this.requestDecimalObj$.pipe(takeUntil(this.unSubscribe)).subscribe(requested => this.decimalSeparator = requested);
        this.requestDataObj$.pipe(takeUntil(this.unSubscribe)).subscribe(requested => this.dataSeperatorData = requested);
    
        this.menSpec$.pipe(takeUntil(this.unSubscribe)).subscribe(ms => this.firstMenuLink = getFirstMenuLink(ms));
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

    /**
     * Check new password does not match existing password
     *
     * @param {FormControl} 
     * @return {object}
     */
    passwordValidator(g: FormGroup): object {
        const oldNew = g.get('oldPassword').value !== g.get('password').value ? null : { 'oldNew': true };
        const mismatch = g.get('password').value === g.get('passwordConfirm').value ? null : { 'mismatch': true };
        return (oldNew) ? oldNew : mismatch;
    }

    /**
     * Toggle visibilty of password
     *
     * @param {any} id
     * @return {void}
     */
    toggleShowPasswords(id: any): void {
        this.showPasswords[id] = !this.showPasswords[id];
    }

    /**
     * Update password
     *
     * @param {object} formValues
     * @return {void}
     */
    changePass(formValues): void {
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
                        this.router.navigateByUrl(this.firstMenuLink);
                    },
                    (e) => {
                        this.alertsService.create('warning', this.translate.translate('Failed to change your password'));
                    },
                ),
            );
        }
    }

    /**
     * Save user details
     *
     * @param {object} userInformations
     * @return {void}
     */
    saveUserInformations(userInformations): void {
        const user = {
            firstName: userInformations.firstName,
            lastName: userInformations.lastName,
            teams: userInformations.teams,
            email: userInformations.email,
            phoneCode: userInformations.phoneCode,
            phoneNumber: userInformations.phoneNumber,
            companyName: userInformations.companyName,
            defaultHomePage: this.setHomePage,
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

    /**
     * Check if a form control has an error (else any errors)
     *
     * @param {string} path - the name of the form control
     * @param {string} error - the name of the error to test for
     * @return {any}
     */
    hasError(path, error): any {
        if (this.changePassForm) {
            const formControl: AbstractControl = path ? this.changePassForm.get(path) : this.changePassForm;

            if (error !== 'required' && formControl.hasError('required')) {
                return false;
            }
            return formControl.touched && (error ? formControl.hasError(error) : formControl.errors);
        }
    }

    /**
     * Return whether the form control is touched
     *
     * @param {string} path - the name of the form control
     * @return {boolean}
     */
    isTouched(path): boolean {
        const formControl: AbstractControl = this.changePassForm.get(path);

        return formControl.touched;
    }

    /**
     * Redirect to Homepage
     *
     * @return {void}
     */
    closeUserInformations(): void {
        this.router.navigateByUrl(this.firstMenuLink);
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

    /**
     * Copy the API key to the clipboard
     *
     * @return {void}
     */
    handleCopyApiKey(): void {
        const textArea = document.createElement('textarea');
        textArea.setAttribute('style', 'width:1px;border:0;opacity:0;');
        document.body.appendChild(textArea);
        textArea.value = this.apiKey;
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        this.copied = true;
        setTimeout(
            () => {
                this.copied = false;
                this.changeDetectorRef.markForCheck();
            },
            500,
        );
    }

    /**
     * Changes Language and Stores in Redux (site-settings)
     *
     * @param lang
     */
    public changeLanguage(lang) {
        this.translate.updateLanguage(lang);

        // save language in db
        const asyncTaskPipe = this.myUserService.setLanguage({ lang });
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_LANGUAGE],
            [],
            asyncTaskPipe,
            {},
        ));

        /* Detect changes. */
        this.changeDetectorRef.detectChanges();
    }
    
    
    
    
    /**

     * Changes decimalSeperator

     *

     * @param decimalSeperator

     */

     public changeDecimalSeparator(decimalSeperator) {
           this.translate.updateDecimalSeperator(decimalSeperator);

           // save decimal values in db
        const asyncTaskPipe = this.myUserService.setDecimalSeperator(decimalSeperator);
        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_DECIMAL_SEPERATOR],
            [],
            asyncTaskPipe,
            {},
        ));

        /* Detect changes. */

        this.changeDetectorRef.detectChanges();

    }


    /**

     * Changes dataSeperator

     *

     * @param dataSeperator

     */

    public changeDataSeparator(dataSeperator) {
        this.translate.updateDataSeperator(dataSeperator);       

           // save data values in db
           const asyncTaskPipe = this.myUserService.setDataSeperator(dataSeperator);
           this.ngRedux.dispatch(SagaHelper.runAsync(
               [SET_DATA_SEPERATOR],
               [],
               asyncTaskPipe,
               {},
           ));
   

        /* Detect changes. */

        this.changeDetectorRef.detectChanges();

    }
}

/**
 * Get the first menu item from menuspec that has a actual 'router_link'
 * @param menuSpec
 */
function getFirstMenuLink(menuSpec: any) {
    // if there is no menu spec. default to '/home'
    if ( !menuSpec.side ) {
       return '/home';
    }

    // try to get the first menu entry
    const sideMenSpec = menuSpec.side;
    let menuSpecForUserType = Object.keys(sideMenSpec).map(k => sideMenSpec[k])[0][0];
    let firstItemWithLink;
    let firstEntry = menuSpecForUserType;

    while (!firstItemWithLink) {
        if (firstEntry.router_link) {
            firstItemWithLink = firstEntry.router_link
        } else {
            firstEntry = firstEntry['children'][0];
        }
    }

    return firstItemWithLink;
}