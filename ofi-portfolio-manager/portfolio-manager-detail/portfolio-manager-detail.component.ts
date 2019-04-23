import { Component, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
import { AppObservableHandler } from '@setl/utils/decorators/app-observable-handler';
import { ActivatedRoute, Router } from '@angular/router';
import { PortfolioManagerDetail } from '../../ofi-store/ofi-portfolio-manager/portfolio-manage-list/model';
import { OfiFundDataService } from '../../ofi-data-service/product/fund/ofi-fund-data-service';
import { combineLatest, of, Observable, Subject } from 'rxjs';
import { map, flatMap, filter, tap, shareReplay, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { OfiPortfolioMangerService } from '../../ofi-req-services/ofi-portfolio-manager/service';
import { OfiKycObservablesService } from '../../ofi-req-services/ofi-kyc/kyc-observable';
import { OfiPortfolioManagerDataService } from '../../ofi-data-service/portfolio-manager/ofi-portfolio-manager-data.service';
import { IznesFundDetail } from '../../ofi-store/ofi-product/fund/fund-list/model';
import { get, isEqual, isUndefined, bind } from 'lodash';
import { FormControl } from '@angular/forms';
import { ConfirmationService } from '@setl/utils/index';
import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';
import * as moment from 'moment';
import { investorInvitation } from '@ofi/ofi-main/ofi-store/ofi-kyc/invitationsByUserAmCompany';
import { Location } from '@angular/common';

interface FundAccess {
    fundName: string;
    fundId: number;
    pmId: number;
    kycId: number;
    walletId: number;
    status: boolean;
    statusFormControl: FormControl;
}

interface FundChange {
    fundName: string;
    fundId: number;
    pmId: number;
    status: number;
}

interface InvestorChange {
    investorId: number;
    pmId: number;
    status: number;
}

@AppObservableHandler
@Component({
    templateUrl: './portfolio-manager-detail.component.html',
    providers: [OfiKycObservablesService],
})
export class PortfolioManagerDetailComponent implements OnInit, OnDestroy {
    pm: PortfolioManagerDetail;
    fundAccessList: FundAccess[];
    fundAccessChanges: FundChange[];
    inviteItems: investorInvitation[];
    portfolioManager$: Observable<PortfolioManagerDetail>;
    accessFundData$: Observable<any>;
    unsubscribe = new Subject<boolean>();

    constructor(
        private activeRoute: ActivatedRoute,
        private ofiFundDataService: OfiFundDataService,
        private ofiPortfolioMangerService: OfiPortfolioMangerService,
        private ofiPortfolioManagerDataService: OfiPortfolioManagerDataService,
        private confirmationService: ConfirmationService,
        private ofiKycObservablesService: OfiKycObservablesService,
        private router: Router,
        private changeDetectorRef: ChangeDetectorRef,
        private toasterService: ToasterService,
        public translate: MultilingualService,
        private changeDetector: ChangeDetectorRef,
        private location: Location,
        private toaster: ToasterService,
    ) {
    }

    ngOnInit() {
        this.portfolioManager$ = combineLatest(
                this.activeRoute.params,
                this.ofiPortfolioManagerDataService.getPortfolioManagerArrayList()
            ).pipe(
                distinctUntilChanged(isEqual),
                flatMap(this.findPortfolioManager),
                tap(this.handleNotFound),
                filter(this.filterOutUndefined),
                tap(bind(this.requestDetail, this)),
                takeUntil(this.unsubscribe),
                shareReplay(1),
            );

        this.accessFundData$ = combineLatest(
            this.ofiFundDataService.getFundArrayList(),
            this.portfolioManager$,
        ).pipe(
            map(([data, pm]) => buildFundAccessData(data, pm)),
            tap((list) => this.fundAccessList = list)
        );

        (<any>this).appSubscribe(this.ofiKycObservablesService.getInvitationData(), (d: investorInvitation[]) => {
            this.inviteItems = d.filter(inv => inv.investorType === 40).map((invite) => {
                const tokenUsedAt = invite.tokenUsedAt ? moment(invite.tokenUsedAt).local().format('YYYY-MM-DD HH:mm:ss') : null;
                const kycStarted = invite.kycStarted ? moment(invite.kycStarted).local().format('YYYY-MM-DD HH:mm:ss') : '';
                return {
                    ...invite,
                    invitationLink: `${window.location.origin}/#/redirect/${invite.lang}/${invite.invitationToken}`,
                    inviteSent: moment(invite.inviteSent).local().format('YYYY-MM-DD HH:mm:ss'),
                    tokenUsedAt,
                    kycStarted,
                };
            });
            this.changeDetectorRef.markForCheck();
        });
    }

    ngOnDestroy() {
        this.unsubscribe.next();
    }

    /**
     * RxJS - If PM is undefined, it can't be found in the store (Can only happen if someone manually
     * navigates to this page and gets the pmId wrong).  Pop a toast with a message and go back to previous page.
     *
     * @param {PortfolioManager | undefined} Portfolio Manager
     */
    handleNotFound(pm: PortfolioManagerDetail | undefined) {
        if (isUndefined(pm)) {
            this.toaster.pop('error', this.translate.translate('Portfolio Manager not found'));
            this.location.back();
        }
    }

    /**
     * RxJS - Find the Portfolio Manager from redux using the params (pmId) and the pmList.
     *
     * @param {array}
     */
    findPortfolioManager([params, pmList]) {
        return of(pmList.find(pm => pm.pmId === +params.pmId));
    }

    /**
     * RxJS - Return false for undefined.
     *
     * @param {array}
     */
    filterOutUndefined(val: any | undefined) {
        return !isUndefined(val);
    }

    /**
     * RxJS - Request Pm or Wm detail depending on type.
     *
     * @param {array}
     */
    requestDetail(pm: PortfolioManagerDetail) {
        if (pm.type === 'PM') {
            this.requestPmDetail(pm.pmId);
        } else {
            this.requestWmDetail(pm.pmId);
        }
    }

    /**
     * Request PM detail for the pmId.
     * @param {number} pmId
     */
    requestPmDetail(pmId: number) {
        this.ofiPortfolioMangerService.defaultRequestPortpolioManagerDetail(pmId);
    }

    /**
     * Request PM detail for the pmId.
     * @param {number} pmId
     */
    requestWmDetail(pmId: number) {
        this.ofiPortfolioMangerService.defaultRequestWealthManagerDetail(pmId);
    }

    /**
     * Manager fund access
     * @param {FundAccess} fundAccess
     */
    handleManageShareAccess(fundAccess: FundAccess) {
        const kycId = fundAccess.kycId;
        this.router.navigateByUrl(`client-referential/${kycId}?tab=2`);
    }

    /**
     * Check whether fund access has kycId link to.
     * if portfolio manager has access to the fund, it would have an kycId link to it.
     * we check kycId here, because user can handleInvestorChange the fund access to true, but the action is not save yet, we don't
     * want to allow them to click the button.
     * @param {FundAccess} fundAccess
     * @return {boolean}
     */
    fundAccessHasKyc(fundAccess: FundAccess) {
        return !!fundAccess.kycId && fundAccess.status;
    }

    handleAccessChange() {
       // if the fund access is not the same, we add it to fundAccessChanges array.
        this.fundAccessChanges = this.fundAccessList.reduce(
            (accu, fundAccess: FundAccess) => {
                if (fundAccess.status !== fundAccess.statusFormControl.value) {
                    accu.push({
                        fundName: fundAccess.fundName,
                        fundId: fundAccess.fundId,
                        pmId: fundAccess.pmId,
                        status: fundAccess.statusFormControl.value,
                    });
                }

                return accu;
            },
            [],
        );
    }

    handleInvestorChange(e) {
        console.log('handleInvestorChange', e);
    }

    /**
     *  Navigate back to portfolio manager list.
     */
    backToPmList() {
        this.router.navigateByUrl('portfolio-manager');
    }

    /**
     * show confirmation about applying fund access changes
     */
    confirmSave() {
        const message = this.fundAccessChanges.length === 0
            ? this.translate.translate('No changes have been made to the Portfolio Manager\'s Fund Access permissions.')
            : this.translate.translate('Please confirm the changes made to the Portfolio Manager\'s Fund Access permissions.');

        this.confirmationService.create(this.translate.translate('Confirm Fund Access:'), message, {
            confirmText: this.translate.translate('Confirm Access and Save Changes'),
            declineText: this.translate.translate('Cancel'),
            btnClass: 'primary',
        }).subscribe((ans) => {
            if (ans.resolved) {
                this.saveFundAccess();
            }
        });
    }

    /**
     * make request to server to update fund accesses.
     */
    saveFundAccess() {
        const requests = this.fundAccessChanges.map((accessChange) => {
            return this.ofiPortfolioMangerService.updatePortfolioManagerFundAccess({
                pmId: accessChange.pmId,
                fundId: accessChange.fundId,
                status: accessChange.status ? 1 : 0,
            });
        });

        Promise.all(requests).then(() => {
            this.fundAccessChanges = [];
            this.toasterService.pop(
                'success',
                this.translate.translate(
                    '@emailAddress@\'s investor authorisation has been successfully updated',
                    { 'emailAddress': this.pm.emailAddress },
                ),
            );
        });
    }
}

function buildFundAccessData(fundData, pm: PortfolioManagerDetail) {
    return fundData.map((fund: IznesFundDetail) => {
        const fundId = fund.fundID;
        const thisFundAccess = get(pm, ['fundAccess', fundId], { status: false, fundId });
        return {
            fundName: fund.fundName,
            ...thisFundAccess,
            pmId: pm.pmId,
            statusFormControl: new FormControl(thisFundAccess.status),
        };
    });
}
