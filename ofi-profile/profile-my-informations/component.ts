import { Component, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import {NgRedux, select} from '@angular-redux/store';
import {ToasterService} from 'angular2-toaster';

import {APP_CONFIG, AppConfig} from '@setl/utils';
import {KycMyInformations, setInformations} from '../../ofi-store/ofi-kyc/my-informations';
import {Observable} from 'rxjs/Observable';

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

    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformations: Observable<KycMyInformations>;

    constructor(
        private _ngRedux: NgRedux<any>,
        private toasterService: ToasterService,
        private location: Location,
        @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
    }

    ngOnInit() {
        this.kycMyInformations.subscribe((d) => {
            this.userInfo = {
                firstName: d.firstName,
                lastName: d.lastName,
            };
        });
    }

    saveUserInformations(userInformations: KycMyInformations) {
        this._ngRedux.dispatch(setInformations(userInformations));
        this.toasterService.pop('success', 'Saved changes');
    }

    closeUserInformations() {
        this.location.back();
    }

}
