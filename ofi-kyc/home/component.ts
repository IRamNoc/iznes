/* Core/Angular imports. */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Inject} from '@angular/core';
/* Redux */
import {NgRedux, select} from '@angular-redux/store';

import { fromJS } from 'immutable';
import {ToasterService} from 'angular2-toaster';
import {APP_CONFIG, AppConfig} from '@setl/utils';

/* Ofi orders request service. */
import {clearAppliedHighlight, SET_HIGHLIGHT_LIST, setAppliedHighlight} from '@setl/core-store/index';
import {setInformations, KycMyInformations} from '@ofi/ofi-main/ofi-store/ofi-kyc/my-informations';
import {Observable} from 'rxjs/Observable';
import {Router} from '@angular/router';
import {OfiKycService} from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import {MyUserService} from '@setl/core-req-services';
import {SagaHelper} from '@setl/utils/index';

@Component({
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiKycHomeComponent implements AfterViewInit, OnDestroy {

    appConfig: AppConfig;
    hasFilledAdditionnalInfos = false;

    /* Public properties. */
    public showModal = false;
    public userInfo: KycMyInformations = {
        email: '',
        firstName: '',
        lastName: '',
        invitedBy: {
            email: '',
            firstName: '',
            lastName: '',
            companyName: '',
            phoneCode: '',
            phoneNumber: '',
        },
        companyName: '',
        phoneCode: '',
        phoneNumber: '',
    };

    /* Private properties. */
    private subscriptions: Array<any> = [];

    /* Observables. */
    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformations: Observable<KycMyInformations>;

    /* Constructor. */
    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _ngRedux: NgRedux<any>,
                private toasterService: ToasterService,
                private router: Router,
                private ofiKycService: OfiKycService,
                private myUserService: MyUserService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
    }

    ngAfterViewInit() {
        /* Do observable subscriptions here. */

        /* Subscribe for this user's connected info. */
        this.subscriptions['kyc-my-informations'] = this.kycMyInformations.subscribe((d) => {
            /* Assign list to a property. */
            this.userInfo = d;
        });

        /* fetch backend for existing data to pre fill the form */
        this.ofiKycService.fetchInvestor();

    }

    openMyInformationsModal(userInformations: KycMyInformations) {
        this.userInfo = userInformations;

        const listImu = fromJS([
            {id: 'dropdown-user'},
            {id: 'menu-account-module'},
        ]);

        const listToRedux = listImu.reduce((result, item) => {

            result.push({
                id: item.get('id', ''),
            });

            return result;
        }, []);

        this._ngRedux.dispatch({type: SET_HIGHLIGHT_LIST, data: listToRedux});
        this._ngRedux.dispatch(setAppliedHighlight());
        this.showModal = true;

    }

    closeModal() {
        const user = {
            displayName: '',
            firstName: this.userInfo.firstName,
            lastName: this.userInfo.lastName,
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
            phoneCode: this.userInfo.phoneCode,
            phoneNumber: this.userInfo.phoneNumber,
            companyName: this.userInfo.companyName,
        };
        const asyncTaskPipe = this.myUserService.saveMyUserDetails(user);
        this._ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            () => {
                this.toasterService.pop('success', `Your form has been saved successfully!`);
            },
            (data) => {
                this.toasterService.pop('error', JSON.stringify(data));
            })
        );
        this._ngRedux.dispatch({type: SET_HIGHLIGHT_LIST, data: [{}]});
        this._ngRedux.dispatch(clearAppliedHighlight());
        this.showModal = false;
        this.router.navigate(['new-investor', 'already-done', 'confirmation']);
    }

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (let key of this.subscriptions) {
            key.unsubscribe();
        }
    }
}
