import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { groupBy, find, map, flatten, castArray } from 'lodash';
import { take } from 'rxjs/operators';
import { NgRedux } from '@angular-redux/store';
import { MultilingualService } from '@setl/multilingual';
import { KycStatus as statusList, RequestsService } from '../requests.service';
import { NewRequestService } from '../request/new-request.service';
import { convertUtcStrToLocalStr } from '@setl/utils/helper/m-date-wrapper/index';
import { ConfirmationService } from '@setl/utils';
import { ClearMyKycListRequested } from '@ofi/ofi-main/ofi-store/ofi-kyc';
import { ToasterService } from 'angular2-toaster';

@Component({
    selector: 'my-requests-list',
    templateUrl: './list-grid.component.html',
})
export class MyRequestsGridComponent {
    @Input() set kycList(kycList) {
        this.rawKycList = kycList;

        this.groupedKycList = this.groupList(kycList);
    }
    get kycList() {
        return this.groupedKycList;
    }

    @Output() selectedKyc = new EventEmitter<number>();

    statusList;
    rawKycList;
    groupedKycList;

    constructor(
        private newRequestService: NewRequestService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private translateService: MultilingualService,
        private requestsService: RequestsService,
        private ngRedux: NgRedux<any>,
        private toasterService: ToasterService,
    ) {
        this.statusList = statusList;
    }

    groupList(kycList) {
        const groups = groupBy(kycList, 'currentGroup');
        let viewList = map(groups, (group) => {
            const first = group[0];
            const status = first.status;

            if (status !== 0) {
                return group;
            }

            const companyName = group.reduce((name, kyc) => ([...name, kyc.companyName]), []).join(', ');

            return {
                status: first.status,
                companyName,
                kycID: first.kycID,
                lastUpdated: first.lastUpdated,
            };
        });

        viewList = flatten(viewList);

        return viewList;
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
        const { currentKyc, currentGroup } = this.getKycsRelatedToKycID(kycID);
        const completedStep = currentKyc.completedStep;
        let extras = {};

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

        this.router.navigate(['onboarding-requests', 'new'], extras);
    }

    getKycsRelatedToKycID(kycID) {
        const currentKyc = find(this.rawKycList, ['kycID', kycID]);

        const grouped = groupBy(this.rawKycList, 'currentGroup');
        const currentGroup = grouped[currentKyc.currentGroup];

        return { currentKyc, currentGroup };
    }

    confirmDeletion(kycID) {
        const { currentGroup } = this.getKycsRelatedToKycID(kycID);
        const kycIDs = currentGroup.map(kyc => kyc.kycID);

        const declineText = this.translateService.translate('Cancel');
        const confirmText = this.translateService.translate('Delete');

        let title;
        let message;
        let success;
        let error;
        if (kycIDs.length === 1) {
            title = this.translateService.translate('Delete request');
            message = this.translateService.translate('Are you sure you want to delete this request?');
            success = this.translateService.translate('The request has been successfully deleted');
            error = this.translateService.translate('Couldn\'t delete KYC request, please try again later.');
        } else {
            title = this.translateService.translate('Delete requests');
            message = this.translateService.translate('Are you sure you want to delete these requests?');
            success = this.translateService.translate('The requests have been successfully deleted');
            error = this.translateService.translate('Couldn\'t delete KYC requests, please try again later.');
        }

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
                this.deleteKycs(kycIDs).then(() => {
                    this.ngRedux.dispatch(ClearMyKycListRequested());
                    this.toasterService.pop('success', success);
                }).catch(() => {
                    this.toasterService.pop('error', error);
                });
            }
        });
    }

    deleteKycs(kycIDs) {
        kycIDs = castArray(kycIDs);

        const promises = [];
        kycIDs.forEach((kycID) => {
            const promise = this.requestsService.deleteKyc(kycID);

            promises.push(promise);
        });

        return Promise.all(promises);
    }
}
