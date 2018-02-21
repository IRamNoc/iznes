/* Core/Angular imports. */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Inject} from '@angular/core';
/* Redux */
import {NgRedux, select} from '@angular-redux/store';

import { fromJS } from 'immutable';
import {ToasterService} from 'angular2-toaster';
import {APP_CONFIG, AppConfig} from '@setl/utils';

/* Ofi orders request service. */
import {clearAppliedHighlight, SET_HIGHLIGHT_LIST, setAppliedHighlight} from '@setl/core-store/index';
import {setInformations, KycMyInformations} from '../../ofi-store/ofi-kyc/my-informations';
import {Observable} from 'rxjs/Observable';

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
        invitedBy: '',
        companyName: '',
        phoneCode: '',
        phoneNumber: '',
    };

    /* Private properties. */
    private subscriptions: Array<any> = [];
    private userSaved = false;

    /* Observables. */
    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformations: Observable<KycMyInformations>;

    /* Constructor. */
    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _ngRedux: NgRedux<any>,
                private toasterService: ToasterService,
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

        if (!this.userSaved) {
            this._ngRedux.dispatch({type: SET_HIGHLIGHT_LIST, data: listToRedux});
            this._ngRedux.dispatch(setAppliedHighlight());
            this.showModal = true;
            this.userSaved = true;
        } else {
            this._ngRedux.dispatch(setInformations(this.userInfo));
            this.toasterService.pop('success', 'Your profile has been saved');
        }
    }

    closeModal() {
        this._ngRedux.dispatch(setInformations(this.userInfo));
        this._ngRedux.dispatch({type: SET_HIGHLIGHT_LIST, data: [{}]});
        this._ngRedux.dispatch(clearAppliedHighlight());
        this.showModal = false;
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
