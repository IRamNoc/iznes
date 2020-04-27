import { Injectable } from '@angular/core';
import { select } from '@angular-redux/store';
import { KycMyInformations } from '../../ofi-store/ofi-kyc/my-informations';
import { Observable } from 'rxjs/Observable';
import { tap, takeUntil, map, filter, take } from 'rxjs/operators';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { MyUserService } from '../../../core-req-services';
import {
    isIZNES,
    isID2SIPA,
    getPartyCompanies,
    PartyCompaniesInterface,
    isCompanyListed,
    isCompanyRegulated,
    isStateOwned,
    getPartyNameFromInvestorType,
    isHighRiskActivity, isHighRiskCountry
} from './kyc-form-helper';
import { InvestorType } from '../../shared/investor-types';
import { FormGroup } from '@angular/forms';

@Injectable({
    providedIn: 'root',
})
export class KycFormHelperService {
    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformations$: Observable<KycMyInformations>;
    private kycForm: FormGroup;

    constructor(
        private ofiKycService: OfiKycService,
        private myUserService: MyUserService,
    ) {
    }

    /**
     * Sets the KYC Form property, needed for helper functions
     *
     * @param {FormGroup} form
     * @returns {void}
     */
    public setForm(form: FormGroup): void {
        this.kycForm = form;
    }

    /**
     * kyc party selection the user had made as observable.
     */
    public get kycPartySelections$() {
        return this.myInformations$.pipe(
            takeUntil(this.myUserService.logout$),
            map((d: KycMyInformations) => d.kycPartySelections),
        );
    }

    /**
     * Which party companies the user has selected. As observable
     */
    public get kycPartyCompanies$(): Observable<PartyCompaniesInterface> {
        return this.kycPartySelections$.pipe(
            takeUntil(this.myUserService.logout$),
            map(getPartyCompanies),
        );
    }

    /**
     * whether user selected iznes party, in party selection. as observable
     */
    public get isIZNES$(): Observable<boolean> {
        return this.kycPartySelections$.pipe(
            takeUntil(this.myUserService.logout$),
            map(isIZNES),
        );
    }

    /**
     * whether user selected id2s IPA party, in party selection. as observable
     */
    public get isID2SIPA$(): Observable<boolean> {
        return this.kycPartySelections$.pipe(
            takeUntil(this.myUserService.logout$),
            map(isID2SIPA),
        );
    }

    /**
     * Whether user was inivited by id2s management company
     * @return {boolean}
     */
    public get invitedByID2S$(): Observable<boolean> {
        return this.investorType$.pipe(
            takeUntil(this.myUserService.logout$),
            filter(d => !! d),
            map(getPartyNameFromInvestorType),
            map(d => d === 'id2s'),
        );
    }

    /**
     * Whether user was inivited by NowCP management company
     * @return {boolean}
     */
    public get invitedByNowCp$(): Observable<boolean> {
        return this.investorType$.pipe(
            takeUntil(this.myUserService.logout$),
            filter(d => !! d),
            map(getPartyNameFromInvestorType),
            map(d => {
                return d === 'nowcp';
            }),
        );
    }

    /**
     * Investor type the user was invited by. As observable
     */
    public get investorType$(): Observable<InvestorType> {
        return this.myInformations$.pipe(
            takeUntil(this.myUserService.logout$),
            map((d: KycMyInformations) => d.investorType),
        );
    }

    /**
     * whether user selected only ID2S. as observable
     */
    public get onlyID2S$(): Observable<boolean> {
        return this.kycPartySelections$.pipe(
            takeUntil(this.myUserService.logout$),
            filter(d => !! d),
            map((d) => {
                const selectedCompanies = getPartyCompanies(d);
                return selectedCompanies.id2s && !selectedCompanies.iznes && !selectedCompanies.nowcp;
            }),
            take(1),
        );
    }

    /**
     * whether user selected only NowCP. as observable
     */
    public get onlyNowCP$(): Observable<boolean> {
        return this.kycPartySelections$.pipe(
            takeUntil(this.myUserService.logout$),
            filter(d => !! d),
            map((d) => {
                const selectedCompanies = getPartyCompanies(d);
                return selectedCompanies.nowcp && !selectedCompanies.iznes && !selectedCompanies.id2s;
            }),
            take(1),
        );
    }

    /**
     * whether user selected only IZNES. as observable
     */
    public get onlyIznes$(): Observable<boolean> {
        return this.kycPartySelections$.pipe(
            takeUntil(this.myUserService.logout$),
            filter(d => !! d),
            map((d) => {
                const selectedCompanies = getPartyCompanies(d);
                return selectedCompanies.iznes && !selectedCompanies.id2s && !selectedCompanies.nowcp;
            }),
            take(1),
        );
    }

    /**
     * whether user selected ID2S or NowCP, and not iznes is not selected. as observable
     */
    public get onlyID2SOrNowCP$(): Observable<boolean> {
        return this.kycPartySelections$.pipe(
            takeUntil(this.myUserService.logout$),
            filter(d => !! d),
            map((d) => {
                const selectedCompanies = getPartyCompanies(d);
                return !selectedCompanies.iznes && (selectedCompanies.nowcp || selectedCompanies.id2s);
            }),
            take(1),
        );
    }

    private get myInformations$() {
        return this.kycMyInformations$.pipe(
            takeUntil(this.myUserService.logout$),
            tap(this.requestKycMyInformation.bind(this)), // if the data is not requested(investorType is 0), request it.
        );
    }

    private requestKycMyInformation(data: KycMyInformations) {
        if (data.investorType === 0) {
            this.ofiKycService.fetchInvestor();
        }
    }

    /**
     * Returns whether company is listed based on form values
     *
     * @returns {boolean}
     */
    public isCompanyListed(): boolean {
        if (!this.kycForm) return false;
        return isCompanyListed(this.kycForm);
    }

    /**
     * Returns whether company is listed based on form values
     *
     * @returns {boolean}
     */
    public isCompanyRegulated(): boolean {
        if (!this.kycForm) return false;
        return isCompanyRegulated(this.kycForm);
    }

    /**
     * Returns whether company is listed based on form values
     *
     * @returns {boolean}
     */
    public isStateOwned(): boolean {
        if (!this.kycForm) return false;
        return isStateOwned(this.kycForm);
    }

    public isHighRiskActivity(): boolean {
        if (!this.kycForm) return false;
        return isHighRiskActivity(this.kycForm);
    }

    public isHighRiskCountry(): boolean {
        if (!this.kycForm) return false;
        return isHighRiskCountry(this.kycForm);
    }
}
