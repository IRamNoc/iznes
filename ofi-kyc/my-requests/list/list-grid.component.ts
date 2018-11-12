import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { groupBy, find } from 'lodash';
import { take } from 'rxjs/operators';
import { NgRedux } from '@angular-redux/store';
import { MultilingualService } from '@setl/multilingual';
import { KycStatus as statusList, RequestsService } from '../requests.service';
import { NewRequestService } from '../request/new-request.service';
import { convertUtcStrToLocalStr } from '@setl/utils/helper/m-date-wrapper/index';
import { ConfirmationService } from '@setl/utils';
import { ClearMyKycListRequested } from '@ofi/ofi-main/ofi-store/ofi-kyc';

@Component({
    selector: 'my-requests-list',
    templateUrl: './list-grid.component.html',
})
export class MyRequestsGridComponent {
    @Input() kycList;
    @Output() selectedKyc = new EventEmitter<number>();

    statusList;

    constructor(
        private newRequestService: NewRequestService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private translateService: MultilingualService,
        private requestsService: RequestsService,
        private ngRedux: NgRedux<any>,
    ) {
        this.statusList = statusList;
    }

    viewDetails(kycID) {
        this.selectedKyc.emit(kycID);
    }

    buttonToDisplay(status) {
        if ([statusList.Approved, statusList.WaitingForApproval, statusList.Rejected].indexOf(status) !== -1) {
            return 'view';
        }

        if (status === statusList.WaitingForMoreInfo) {
            return 'waitingInformation';
        }

        return 'draft';
    }

    convertDate(date) {
        return convertUtcStrToLocalStr(date, 'YYYY-MM-DD HH:mm:SS');
    }

    redirectToRelatedKycs(kycID) {
        const currentKyc = find(this.kycList, ['kycID', kycID]);
        const completedStep = currentKyc.completedStep;
        let extras = {};

        const grouped = groupBy(this.kycList, 'currentGroup');
        const currentGroup = grouped[currentKyc.currentGroup];

        const kycIDs = [];
        currentGroup.forEach((kyc) => {
            kycIDs.push({
                kycID: kyc.kycID,
                amcID: kyc.amManagementCompanyID,
                context: kyc.context,
                completedStep,
            });
        });

        if (completedStep) {
            extras = {
                queryParams: {
                    step: completedStep,
                    completed: currentGroup.reduce((acc, kyc) => acc && !!kyc.alreadyCompleted, true),
                },
            };
        }

        this.newRequestService.storeCurrentKycs(kycIDs);

        this.router.navigate(['my-requests', 'new'], extras);
    }

    confirmDeletion(kycID) {
        const declineText = this.translateService.translate('Cancel');
        const confirmText = this.translateService.translate('Delete');
        const title = this.translateService.translate('Delete request');
        const message = this.translateService.translate('Are you sure you want to delete this request?');

        this.confirmationService.create(
            title,
            `<p>${message}</p>`,
            {
                declineText,
                confirmText,
            },
        ).pipe(
            take(1),
        ).subscribe((ans) => {
            if (ans.resolved) {
                this.requestsService.deleteKyc(kycID).then(() => {
                    this.ngRedux.dispatch(ClearMyKycListRequested());
                });
            }
        });
    }
}
