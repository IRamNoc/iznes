import { Injectable } from '@angular/core';
import { select } from '@angular-redux/store';
import { KycMyInformations } from '../../ofi-store/ofi-kyc/my-informations';
import { Observable } from 'rxjs/Observable';
import { tap, takeUntil, map } from 'rxjs/operators';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { MyUserService } from '../../../core-req-services';
import { KycPartySelections } from '../../ofi-store/ofi-kyc/my-informations/model';
import { isIZNES, isID2SIPA, getPartyCompanies, PartyCompaniesInterface } from './kyc-form-helper';
import { InvestorType } from '../../shared/investor-types';

@Injectable({
    providedIn: 'root',
})
export class KycFormHelperService {
    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformations$: Observable<KycMyInformations>;

    constructor(
        private ofiKycService: OfiKycService,
        private myUserService: MyUserService,
    ) {
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
     * Investor type the user was invited by. As observable
     */
    public get investorType$(): Observable<InvestorType> {
        return this.myInformations$.pipe(
            takeUntil(this.myUserService.logout$),
            map((d: KycMyInformations) => d.investorType),
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
}
