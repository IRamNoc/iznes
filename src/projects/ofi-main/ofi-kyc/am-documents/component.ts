/* Core/Angular imports. */
import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Inject,
    OnInit,
} from '@angular/core';
/* Redux */
import { NgRedux, select } from '@angular-redux/store';
import { Subpanel } from './models';
import { fromJS } from 'immutable';
import { ToasterService } from 'angular2-toaster';
import { APP_CONFIG, AppConfig, immutableHelper, PermissionsService } from '@setl/utils';

/* Ofi orders request service. */
import { clearAppliedHighlight, SET_HIGHLIGHT_LIST, setAppliedHighlight } from '@setl/core-store/index';
import { setInformations, KycMyInformations } from '../../ofi-store/ofi-kyc/my-informations';
import { Observable, combineLatest as observableCombineLatest } from 'rxjs';

import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { Router } from '@angular/router';
import { MultilingualService } from '@setl/multilingual';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfiAmDocumentsComponent implements OnDestroy, OnInit {
    appConfig: AppConfig;
    hasFilledAdditionnalInfos = false;

    /* Private properties. */
    // public panelDefs: Subpanel[];
    public panelDefs = [];
    private subscriptions: any[] = [];

    hasPermissionCanManageAllClientFile$: Observable<boolean>;
    hasPermissionCanManageAllClientFile = false;

    /* Observables. */
    @select(['user', 'siteSettings', 'language']) requestLanguageOb;
    @select(['ofi', 'ofiKyc', 'amKycList', 'requested']) requestedOfiKycListOb;
    @select(['ofi', 'ofiKyc', 'amKycList', 'amKycList']) kycListOb;

    /* Constructor. */
    constructor(private changeDetectorRef: ChangeDetectorRef,
                private ofiKycService: OfiKycService,
                private ngRedux: NgRedux<any>,
                private toasterService: ToasterService,
                private router: Router,
                private translate: MultilingualService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
                private permissionsService: PermissionsService,
    ) {
        this.appConfig = appConfig;
    }

    ngOnInit() {
        this.hasPermissionCanManageAllClientFile$ = Observable.fromPromise(this.permissionsService.hasPermission('manageAllClientFile', 'canUpdate'));

        this.subscriptions.push(this.requestedOfiKycListOb.subscribe(
            requested => this.requestKycList(requested)));
        this.subscriptions.push(
            observableCombineLatest(this.kycListOb, this.requestLanguageOb, this.hasPermissionCanManageAllClientFile$).subscribe(async ([amKycListData, _, hasPermission]) => {
                this.hasPermissionCanManageAllClientFile = hasPermission;
                this.updateTable(amKycListData);
            },
        ));
    }

    updateTable(tableData) {
        const tableDataCopy = immutableHelper.filter(tableData, (item, key) => {
            return Boolean(item.get('investorUserID'));
        });

        const columns = {
            1: {
                id: 'Status',
                label: this.translate.translate('Status'),
                dataSource: 'status',
                sortable: true,
                hasLink: true,
            },
            2: {
                id: 'CompName',
                label: this.translate.translate('Company Name'),
                dataSource: 'investorCompanyName',
                sortable: true,
                hasLink: true,
                kycDocLink: '/on-boarding/management/:kycID',
                kycFundAccessLink: '/fund-access/:kycID',
            },
            3: {
                id: 'DateModification',
                label: this.translate.translate('Date of Latest Modification by the Investor'),
                dataSource: 'lastUpdated',
                sortable: true,
            },
            4: {
                id: 'DateStarted',
                label: this.translate.translate('Date KYC Started'),
                dataSource: 'dateEntered',
                sortable: true,
                hasLink: true,
                kycDocLink: '/on-boarding/management/:kycID',
                kycFundAccessLink: '/fund-access/:kycID',
            },
            5: {
                id: 'DateApproval',
                label: this.translate.translate('Date of Approval'),
                dataSource: 'lastUpdated',
                sortable: true,
            },
            6: {
                id: 'Validated',
                label: this.translate.translate('Validated By'),
                dataSource: 'amFirstName',
                sortable: true,
            },
            7: {
                id: 'DateModified',
                label: this.translate.translate('Date of Latest Modification by the Investor'),
                dataSource: 'lastUpdated',
                sortable: true,
            },
            8: {
                id: 'Reviewed',
                label: this.translate.translate('Reviewed By'),
                dataSource: 'amFirstName',
                sortable: true,
                hasLink: true,
                kycDocLink: '/on-boarding/management/:kycID',
                kycFundAccessLink: '/fund-access/:kycID',
            },
            9: {
                id: 'DateRejection',
                label: this.translate.translate('Date of Rejection'),
                dataSource: 'lastUpdated',
                sortable: true,
            },
            10: {
                id: 'Rejected',
                label: this.translate.translate('Rejected By'),
                dataSource: 'amFirstName',
                sortable: true,
            },
            11: {
                id: 'DateLatestModification',
                label: this.translate.translate('Date of Latest Modification'),
                dataSource: 'lastUpdated',
                sortable: true,
                hasLink: true,
                kycDocLink: '/on-boarding/management/:kycID',
                kycFundAccessLink: '/fund-access/:kycID',
            },
        };

        const tables = {
            '1': [],
            '-1': [],
            '2': [],
            '-2': [],
            '3': [],
            'invited': [],
            'all': [],
        };

        const replaceStatus = {
            '1': this.translate.translate('To Review'),
            '-1': this.translate.translate('Accepted'),
            '2': this.translate.translate('Waiting For More Info'),
            '-2': this.translate.translate('Rejected'),
            '3': this.translate.translate('Pending Client File'),
        };

        let id = 0;
        tableDataCopy.forEach((row) => {
            const rowStatus = row['status'];

            row['status'] = replaceStatus[rowStatus];

            row['id'] = id;
            id++;

            if (tables[rowStatus]) {
                tables[rowStatus].push(row);
            }

            if (row['isInvited'] === 1) {
                tables['invited'].push(row);
            }
            tables['all'].push(row);
        });

        const acceptedPanelWording = !this.hasPermissionCanManageAllClientFile ?
            this.translate.translate('Accepted - Funds Access Authorizations') :
            this.translate.translate('Accepted');

        this.panelDefs = [
            {
                id: 'Waiting',
                title: this.translate.translate('Waiting for Approval'),
                columns: [columns[1], columns[2], columns[3], columns[4]],
                open: true,
                data: tables[1],
            },
            {
                id: 'Accepted',
                title: acceptedPanelWording,
                columns: [columns[1], columns[2], columns[5], columns[4], columns[6]],
                open: true,
                data: tables[-1],
            },
            {
                id: 'Awaiting',
                title: this.translate.translate('Awaiting for more information from your Client'),
                columns: [columns[1], columns[2], columns[7], columns[4], columns[8]],
                open: true,
                data: tables[2],
            },
            {
                id: 'Rejected',
                title: this.translate.translate('Rejected'),
                columns: [columns[1], columns[2], columns[9], columns[4], columns[10]],
                open: true,
                data: tables[-2],
            },
        ];

        // if the user is iznesAdmin which can manage all client file
        if (!this.hasPermissionCanManageAllClientFile) {
            const extraPanels = [
            {
                id: 'PendingClientFile',
                title: this.translate.translate('Waiting For Client File Validation'),
                columns: [columns[1], columns[2], columns[5], columns[4]],
                open: true,
                data: tables[3],
            },
            {
                id: 'StartedClients',
                    title: this.translate.translate('Started by your Clients'),
                columns: [columns[1], columns[2], columns[7], columns[4], columns[8]],
                open: true,
                data: tables['invited'],
            },
            {
                id: 'AllClients',
                    title: this.translate.translate('All your KYC and Client Folders'),
                columns: [columns[1], columns[2], columns[11], columns[4], columns[8]],
                open: true,
                data: tables['all'],
            }];

            this.panelDefs = [...this.panelDefs, ...extraPanels];
        }

        this.changeDetectorRef.markForCheck();
    }

    /**
     * Request my fund access base of the requested state.
     * @param requested
     * @return void
     */
    requestKycList(requested): void {
        if (!requested) {
            OfiKycService.defaultRequestAmKycList(this.ofiKycService, this.ngRedux);
        }
    }

    buildLink(column, row, event) {
        if (
            !event.target.classList.contains('datagrid-expandable-caret') &&
            !event.target.classList.contains('datagrid-expandable-caret-button') &&
            !event.target.classList.contains('datagrid-expandable-caret-icon')
        ) {
            let ret = this.getKycLinkTemplate(row.status);
            const link = this.getKycLinkTemplate(row.status);
            link.match(/:\w+/g).forEach((match) => {
                const key = match.substring(1);
                const regex = new RegExp(match);
                ret = ret.replace(regex, row[key]);
            });
            this.router.navigateByUrl(ret);
        }
    }

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (const key of this.subscriptions) {
            key.unsubscribe();
        }
    }

    getKycLinkTemplate(status) {
        if(!this.hasPermissionCanManageAllClientFile) {
            if (status === -1 || status === 'Accepted') {
                return  '/client-referential/:kycID'
            } else {
                return  '/on-boarding/management/:kycID'
            }
        } else {
            return '/client-file/management/:kycID'
        }
    }
}