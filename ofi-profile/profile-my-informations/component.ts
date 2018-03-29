import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import {NgRedux, select} from '@angular-redux/store';
import {ToasterService} from 'angular2-toaster';
import {APP_CONFIG, AppConfig} from '@setl/utils';
import {KycMyInformations} from '@ofi/ofi-main/ofi-store/ofi-kyc/my-informations';
import {Observable} from 'rxjs/Observable';
import {SagaHelper} from '@setl/utils/index';
import {MyUserService} from '@setl/core-req-services/index';
import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';

@Component({
    selector: 'app-profile-my-informations',
    templateUrl: './component.html',
    styleUrls: ['./component.css']
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

    @select(['user', 'myDetail']) myDetail: any;
    @select(['ofi', 'ofiKyc', 'myInformations']) myKyc: any;

    constructor(
        private _ngRedux: NgRedux<any>,
        private toasterService: ToasterService,
        private location: Location,
        private myUserService: MyUserService,
        private ofiKycService: OfiKycService,
        @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
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

    saveUserInformations(userInformations) {
        const user = {
            displayName: '',
            firstName: userInformations.firstName,
            lastName: userInformations.lastName,
            email: userInformations.email,
            mobilePhone: '',
            addressPrefix: '',
            address1: '',
            address2: '',
            address3: '',
            address4: '',
            postalCode: '',
            country: '',
            memorableQuestion: '',
            memorableAnswer: '',
            profileText: '',
            phoneCode: userInformations.phoneCode,
            phoneNumber: userInformations.phoneNumber,
            companyName: userInformations.companyName,
        };
        const asyncTaskPipe = this.myUserService.saveMyUserDetails(user);
        this._ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            () => {
                this.toasterService.pop('success', 'Saved changes');
            },
            (data) => {
                this.toasterService.pop('error', JSON.stringify(data));
            })
        );
    }

    closeUserInformations() {
        this.location.back();
    }

}
