import { Component, OnDestroy, OnInit } from '@angular/core';
import { AppObservableHandler } from '@setl/utils/decorators/app-observable-handler';
import { ActivatedRoute, Router } from '@angular/router';
import {
    PortfolioManagerDetail,
    PortfolioManagerList,
} from '../../ofi-store/ofi-portfolio-manager/portfolio-manage-list/model';
import { OfiFundDataService } from '../../ofi-data-service/product/fund/ofi-fund-data-service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { OfiPortfolioMangerService } from '../../ofi-req-services/ofi-portfolio-manager/service';
import { OfiPortfolioManagerDataService } from '../../ofi-data-service/portfolio-manager/ofi-portfolio-manager-data.service';
import { IznesFundDetail } from '../../ofi-store/ofi-product/fund/fund-list/model';
import { get } from 'lodash';
import { FormControl } from '@angular/forms';
import { ConfirmationService } from '@setl/utils/index';
import { ToasterService } from 'angular2-toaster';
import { MultilingualService } from '@setl/multilingual';

interface FundAccess {
    fundName: string;
    fundId: number;
    pmId: number;
    kycId: number;
    walletId: number;
    status: boolean;
    statusFormControl: FormControl;
}

interface FundChnage {
    fundName: string;
    fundId: number;
    pmId: number;
    status: number;
}

@AppObservableHandler
@Component({
    templateUrl: './portfolio-manager-detail.component.html',
})
export class PortfolioManagerDetailComponent implements OnInit, OnDestroy {
    pm: PortfolioManagerDetail;
    fundAccessList: FundAccess[];
    fundAccessChanges: FundChnage[];

    constructor(
        private activeRoute: ActivatedRoute,
        private ofiFundDataService: OfiFundDataService,
        private ofiPortfolioMangerService: OfiPortfolioMangerService,
        private ofiPortfolioManagerDataService: OfiPortfolioManagerDataService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private toasterService: ToasterService,
        public translate: MultilingualService,
    ) {
    }

    ngOnInit() {
        (<any>this).appSubscribe(
            this.activeRoute.queryParams,
            (params: PortfolioManagerDetail) => {
                this.pm = params;
                this.requestPmDetail(params.pmId);
            });

        const $accessFundData = combineLatest(
            this.ofiFundDataService.getFundArrayList(),
            this.ofiPortfolioManagerDataService.getPortfolioManagerList(),
        ).pipe(
            map((dataArr) => {
                return buildFundAccessData(dataArr, this.pm.pmId);
            }),
        );

        (<any>this).appSubscribe(
            $accessFundData,
            fundAccesses => this.fundAccessList = fundAccesses);
    }

    ngOnDestroy() {
    }

    /**
     * Request PM detail for the pmId.
     * @param {number} pmId
     */
    requestPmDetail(pmId: number) {
        this.ofiPortfolioMangerService.defaultRequestPortpolioManagerDetail(pmId);
    }

    /**
     * Manager fund access
     * @param {FundAccess} fundAccess
     */
    handleManagerShareAccess(fundAccess: FundAccess) {
        const kycId = fundAccess.kycId;
        // this.router.navigate(['client-referential'], { queryParams: { kycId } });
        this.router.navigateByUrl(`client-referential/${kycId}`);
    }

    /**
     * Check whether fund access has kycId link to.
     * if portfolio manager has access to the fund, it would have an kycId link to it.
     * we check kycId here, because user can toggle the fund access to true, but the action is not save yet, we don't
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
            ? this.translate.translate('No changes have been made to the Portfolio Manager\' Fund Access permissions.')
            : this.translate.translate('Please confirm the changes made to the Portfolio Manager\' Fund Access permissions.');

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
                    '@emailAddress@\'s fund authorisation has been successfully updated',
                    { 'emailAddress': this.pm.emailAddress },
                ),
            );
        });
    }

}

function buildFundAccessData(dataArr, pmId: number) {
    const fundData: IznesFundDetail[] = dataArr[0];
    const accessData: {[pmId: string]: PortfolioManagerDetail} = dataArr[1];

    return fundData.map((fund: IznesFundDetail) => {
        const fundId = fund.fundID;
        const thisFundAccess = get(accessData, [pmId, 'fundAccess', fundId], { status: false, fundId });
        return {
            fundName: fund.fundName,
            ...thisFundAccess,
            pmId,
            statusFormControl: new FormControl(thisFundAccess.status),
        };
    });
}
