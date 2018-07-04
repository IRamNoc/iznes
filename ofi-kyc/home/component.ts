/* Core/Angular imports. */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Inject } from '@angular/core';
/* Redux */
import { NgRedux, select } from '@angular-redux/store';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

import { fromJS } from 'immutable';
import { ToasterService } from 'angular2-toaster';
import { APP_CONFIG, AppConfig } from '@setl/utils';

import { MultilingualService } from '@setl/multilingual';

/* Ofi orders request service. */
import { clearAppliedHighlight, SET_HIGHLIGHT_LIST, setAppliedHighlight } from '@setl/core-store/index';
import { setInformations, KycMyInformations } from '@ofi/ofi-main/ofi-store/ofi-kyc/my-informations';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { MyUserService } from '@setl/core-req-services';
import { SagaHelper } from '@setl/utils/index';
import { Endpoints } from '../config';
import { ConfirmationService } from '@setl/utils';

@Component({
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfiKycHomeComponent implements AfterViewInit, OnDestroy {

    appConfig: AppConfig;
    endpointsConfig: Endpoints;
    hasFilledAdditionnalInfos = false;
    userType: number;

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
        amCompanyName: '',
        phoneCode: '',
        phoneNumber: '',
        amManagementCompanyID: 0,
        invitationToken: '',
    };

    unSubscribe: Subject<any> = new Subject();

    /* Observables. */
    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformations: Observable<KycMyInformations>;
    @select(['user', 'myDetail', 'userType']) userType$: Observable<number>;

    /* Constructor. */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _ngRedux: NgRedux<any>,
        private toasterService: ToasterService,
        private router: Router,
        private route: ActivatedRoute,
        private ofiKycService: OfiKycService,
        private confirmationService: ConfirmationService,
        private myUserService: MyUserService,
        public _translate: MultilingualService,
        @Inject('endpoints') endpoints,
        @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
        this.endpointsConfig = endpoints;
    }

    ngAfterViewInit() {
        /* Do observable subscriptions here. */

        /* Subscribe for this user's connected info. */
        this.kycMyInformations
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                /* Assign list to a property. */
                this.userInfo = d;
                this._changeDetectorRef.markForCheck();
            });

        this.userType$
            .takeUntil(this.unSubscribe)
            .subscribe(v => this.userType = v);

        /* fetch backend for existing data to pre fill the form */
        this.ofiKycService.fetchInvestor();

    }

    openMyInformationsModal(userInformations: KycMyInformations) {

        this.userInfo = {
            ...this.userInfo,
            email: userInformations.email,
            firstName: userInformations.firstName,
            lastName: userInformations.lastName,
            phoneCode: userInformations.phoneCode,
            phoneNumber: userInformations.phoneNumber,
            companyName: userInformations.companyName,
        };

        const listImu = fromJS([
            { id: 'dropdown-user' },
            { id: 'menu-account-module' },
        ]);

        const listToRedux = listImu.reduce((result, item) => {

            result.push({
                id: item.get('id', ''),
            });

            return result;
        }, []);

        this._ngRedux.dispatch({ type: SET_HIGHLIGHT_LIST, data: listToRedux });
        this._ngRedux.dispatch(setAppliedHighlight());
        // this.showModal = true;

        this.confirmationService.create(
            'My Information',
            'My information can be changed later in "Profile" at the top of the page.',
            { confirmText: 'Ok, I understand', declineText: '' }
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const user = {
            firstName: this.userInfo.firstName,
            lastName: this.userInfo.lastName,
            phoneCode: this.userInfo.phoneCode,
            phoneNumber: this.userInfo.phoneNumber,
            companyName: this.userInfo.companyName,
            defaultHomePage: this.endpointsConfig.home,
        };
        const asyncTaskPipe = this.myUserService.saveMyUserDetails(user);
        this._ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            () => {
                this.toasterService.pop('success', `Your form has been saved successfully!`);
            },
            () => {
                this.toasterService.pop('error', 'Failed to save your informations.');
                return;
            }),
        );
        this._ngRedux.dispatch({ type: SET_HIGHLIGHT_LIST, data: [{}] });
        this._ngRedux.dispatch(clearAppliedHighlight());
        //this.showModal = false;

        this.route.queryParams.subscribe(queryParams => {
            if (queryParams.invitationToken) {
                this.router.navigate(['my-requests', 'new'], {
                    queryParams: {
                        invitationToken: queryParams.invitationToken,
                        amcID: queryParams.amcID
                    }
                });
            } else{
                this.router.navigate(['my-requests', 'list']);
            }
        });
    }

    ngOnDestroy(): void {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }
}
