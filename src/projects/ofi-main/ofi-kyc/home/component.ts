/* Core/Angular imports. */
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Inject, ElementRef } from '@angular/core';
/* Redux */
import { NgRedux, select } from '@angular-redux/store';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { fromJS } from 'immutable';
import { ToasterService } from 'angular2-toaster';
import { APP_CONFIG, AppConfig, ConfirmationService } from '@setl/utils';
import { MultilingualService } from '@setl/multilingual';

/* Ofi orders request service. */
import { clearAppliedHighlight, SET_HIGHLIGHT_LIST, setAppliedHighlight, setMenuCollapsed } from '@setl/core-store/index';
import { KycMyInformations } from '@ofi/ofi-main/ofi-store/ofi-kyc/my-informations';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { MyUserService } from '@setl/core-req-services';
import { SagaHelper } from '@setl/utils/index';
import { Endpoints } from '../config';
import { InvestorType } from '../../shared/investor-types';
import { FormGroup, FormControl, ValidatorFn } from '@angular/forms';
import {KycPartySelections} from '../../ofi-store/ofi-kyc/my-informations/model';
import {getPartyCompanies, PartyCompaniesInterface} from '../my-requests/kyc-form-helper';
import {OfiManagementCompanyService} from '../../ofi-req-services/ofi-product/management-company/management-company.service';
import {first} from 'rxjs/operators';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})
export class OfiKycHomeComponent implements AfterViewInit, OnDestroy {
    appConfig: AppConfig;
    endpointsConfig: Endpoints;
    hasFilledAdditionnalInfos = false;
    userType: number;
    investorType: number;

    /* Public properties. */
    public showModal = false;
    public userInfo: KycMyInformations;
    public kycPartySelectionsForm: FormGroup;
    public showWelcomeModal: boolean = true;
    public kycPartySelections: KycPartySelections;


    unSubscribe: Subject<any> = new Subject();

    /* Observables. */
    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformations: Observable<KycMyInformations>;
    @select(['user', 'myDetail', 'userType']) userType$: Observable<number>;
    // obervable for full list of management companies.
    @select(['ofi', 'ofiProduct', 'ofiManagementCompany', 'investorManagementCompanyList', 'investorManagementCompanyList']) managementCompanyList$;

    /* Constructor. */
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        private ngRedux: NgRedux<any>,
        private toasterService: ToasterService,
        private router: Router,
        private route: ActivatedRoute,
        private ofiKycService: OfiKycService,
        private confirmationService: ConfirmationService,
        private myUserService: MyUserService,
        public translate: MultilingualService,
        private ofiManagementCompanyService: OfiManagementCompanyService,
        @Inject('endpoints') endpoints,
        @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
        this.endpointsConfig = endpoints;

        // Collapse nav bar
        this.ngRedux.dispatch(setMenuCollapsed(true));
    }

    ngAfterViewInit() {
        /* Do observable subscriptions here. */

        /* Subscribe for this user's connected info. */
        this.kycMyInformations
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                /* Assign list to a property. */
                this.userInfo = d;
                this.investorType = d.investorType;
                this.changeDetectorRef.markForCheck();
            });

        this.userType$
            .takeUntil(this.unSubscribe)
            .subscribe(v => this.userType = v);

        /* fetch backend for existing data to pre fill the form */
        this.ofiKycService.fetchInvestor();
    }

    ngOnInit() {
        this.getAssetManagementCompanies();
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

        const listToRedux = listImu.reduce(
            (result, item) => {
                result.push({
                    id: item.get('id', ''),
                });

                return result;
            },
            [],
        );

        this.ngRedux.dispatch({ type: SET_HIGHLIGHT_LIST, data: listToRedux });
        this.ngRedux.dispatch(setAppliedHighlight());
        // this.showModal = true;

        this.saveMyUserDetails();
    }

    saveMyUserDetails() {
        const user = {
            firstName: this.userInfo.firstName,
            lastName: this.userInfo.lastName,
            phoneCode: this.userInfo.phoneCode,
            phoneNumber: this.userInfo.phoneNumber,
            companyName: this.userInfo.companyName,
            defaultHomePage: this.getHomePageToSet(),
        };
        const asyncTaskPipe = this.myUserService.saveMyUserDetails(user);
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            () => {},
            () => {
                this.toasterService.pop('error', this.translate.translate('Failed to save your information.'));
                return;
            }),
        );
        this.ngRedux.dispatch({ type: SET_HIGHLIGHT_LIST, data: [{}] });
        this.ngRedux.dispatch(clearAppliedHighlight());
        // this.showModal = false;

        this.route.queryParams.subscribe(async (queryParams) => {
            if (this.isPortfolioManagerType()) {
                this.portfolioManagerAction();
            } else {
                if (queryParams.invitationToken) {
                    this.router.navigate(['onboarding-requests', 'new'], {
                        queryParams: {
                            invitationToken: queryParams.invitationToken,
                            selectedAmcIds: await this.getAmcIdsToCreateKycs.bind(this)(Number(queryParams.amcID)),
                            invitedAmcId: queryParams.amcID,
                            onboardingMode: 'true',
                        },
                    });
                } else {
                    this.router.navigate(['onboarding-requests', 'list']);
                }
            }
        });
    }

    /**
     * Get all the AmcIDs to create kycs with
     * Work out the additional AMCs selected that would need to create kycs with.
     * The additional AMCs are work out from the kyc parties selections
     * @param {number} invitedAmcId
     * @return {Promise<number[]>}
     */
    async getAmcIdsToCreateKycs(invitedAmcId: number): Promise<number[]> {
        const companySelections:PartyCompaniesInterface  = getPartyCompanies(this.kycPartySelections);
        const companiesList = (await this.managementCompanyList$.pipe(first()).toPromise()).toJS();
        const amcIds = [invitedAmcId];
        // only pick the first one. if there are more then one. they would get ignored.
        const id2sAmc = companiesList.find(c => c.managementCompanyType === 'id2s');
        const nowCpAmc = companiesList.find(c => c.managementCompanyType === 'nowcp');

        // try to get id2s companyID
        if (id2sAmc && companySelections.id2s && invitedAmcId !== id2sAmc.companyID) {
            amcIds.push(id2sAmc.companyID);
        }

        // try to get nowCP companyID
        if (nowCpAmc && companySelections.nowcp && invitedAmcId !== nowCpAmc.companyID) {
            amcIds.push(nowCpAmc.companyID);
        }

        return amcIds;
    }

    /**
     * Get default home to set after saving user detail.
     * @return {string}
     */
    getHomePageToSet(): string {
        return (this.isPortfolioManagerType()) ? '/home' : this.endpointsConfig.myRequests
    }

    /**
     * Check is investor type is portfolio manager.
     * @return {boolean}
     */
    isPortfolioManagerType(): boolean {
        return [InvestorType.DiscretionaryManager, InvestorType.FundOfFundsManager].includes(this.investorType);
    }

    /**
     * Perform porfolio manager action after saving data.
     * Navigate to home page.
     */
    portfolioManagerAction(): void {
        this.router.navigate(['home']);
    }

    /**
     * Whether to show kyc onboarding flow
     * portfolio manager does not need kyc onboarding
     * @return {boolean}
     */
    showOnboardingFlow():boolean {
        return !this.isPortfolioManagerType();
    }

    /**
     * fetch management companies list from membernode
     */
    getAssetManagementCompanies() {
        this.ofiManagementCompanyService.fetchInvestorManagementCompanyList(true);
    }

    ngOnDestroy(): void {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }
}
