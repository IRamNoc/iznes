/* Core/Angular imports. */
import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Inject,
    OnInit
} from '@angular/core';
/* Redux */
import { NgRedux, select } from '@angular-redux/store';
import { Subpanel } from './models';
import { fromJS } from 'immutable';
import { ToasterService } from 'angular2-toaster';
import { APP_CONFIG, AppConfig } from '@setl/utils';

/* Ofi orders request service. */
import { clearAppliedHighlight, SET_HIGHLIGHT_LIST, setAppliedHighlight } from '@setl/core-store/index';
import { setInformations, KycMyInformations } from '../../ofi-store/ofi-kyc/my-informations';
import { Observable } from 'rxjs';

import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';

import { immutableHelper } from '@setl/utils';
import { Router } from '@angular/router';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiAmDocumentsComponent implements OnDestroy, OnInit {

    appConfig: AppConfig;
    hasFilledAdditionnalInfos = false;

    /* Private properties. */
    // public panelDefs: Subpanel[];
    public panelDefs = [];
    private subscriptions: Array<any> = [];

    /* Observables. */
    @select(['ofi', 'ofiKyc', 'amKycList', 'requested']) requestedOfiKycListOb;
    @select(['ofi', 'ofiKyc', 'amKycList', 'amKycList']) kycListOb;

    /* Constructor. */
    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _ofiKycService: OfiKycService,
                private _ngRedux: NgRedux<any>,
                private toasterService: ToasterService,
                private _router: Router,
                @Inject(APP_CONFIG) appConfig: AppConfig) {
        this.appConfig = appConfig;
    }

    ngOnInit() {
        this.subscriptions.push(this.requestedOfiKycListOb.subscribe(
            (requested) => this.requestKycList(requested)));
        this.subscriptions.push(this.kycListOb.subscribe(
            (amKycListData) => this.updateTable(amKycListData)));

    }

    updateTable(tableData) {
        const tableDataCopy = immutableHelper.copy(tableData);

        const columns = {
            1: {
                id: 'Status',
                label: 'Status',
                dataSource: 'status',
                sortable: true,
                hasLink: true,
            },
            2: {
                id: 'CompName',
                label: 'Company Name',
                dataSource: 'investorCompanyName',
                sortable: true,
                hasLink: true,
                kycDocLink: '/on-boarding/management/:kycID',
                kycFundAccessLink: '/fund-access/:kycID',
            },
            3: {
                id: 'DateModification',
                label: 'Date of latest modification by the investor',
                dataSource: 'lastUpdated',
                sortable: true,
            },
            4: {
                id: 'DateStarted',
                label: 'Date KYC started',
                dataSource: 'dateEntered',
                sortable: true,
                hasLink: true,
                kycDocLink: '/on-boarding/management/:kycID',
                kycFundAccessLink: '/fund-access/:kycID',
            },
            5: {
                id: 'DateApproval',
                label: 'Date of approval',
                dataSource: 'lastUpdated',
                sortable: true,
            },
            6: {
                id: 'Validated',
                label: 'Validated by',
                dataSource: 'amFirstName',
                sortable: true,
            },
            7: {
                id: 'DateModified',
                label: 'Date of latest modification by the investor',
                dataSource: 'lastUpdated',
                sortable: true,
            },
            8: {
                id: 'Reviewed',
                label: 'Reviewed by',
                dataSource: 'amFirstName',
                sortable: true,
                hasLink: true,
                kycDocLink: '/on-boarding/management/:kycID',
                kycFundAccessLink: '/fund-access/:kycID',
            },
            9: {
                id: 'DateRejection',
                label: 'Date of rejection',
                dataSource: 'lastUpdated',
                sortable: true,
            },
            10: {
                id: 'Rejected',
                label: 'Rejected by',
                dataSource: 'amFirstName',
                sortable: true,
            },
            11: {
                id: 'DateLatestModification',
                label: 'Date of latest modification',
                dataSource: 'lastUpdated',
                sortable: true,
                hasLink: true,
                kycDocLink: '/on-boarding/management/:kycID',
                kycFundAccessLink: '/fund-access/:kycID',
            }
        };

        const tables = {
            '1': [],
            '-1': [],
            '2': [],
            '-2': [],
            'invited': [],
            'all': []
        };

        const replaceStatus = {
            '1': 'To Review',
            '-1': 'Accepted',
            '2': 'Waiting for more info',
            '-2': 'Rejected'
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

        this.panelDefs = [
            {
                id: 'Waiting',
                title: 'Waiting for Approval',
                columns: [columns[1], columns[2], columns[3], columns[4]],
                open: true,
                data: tables[1]
            },
            {
                id: 'Accepted',
                title: 'Accepted - Funds Access Authorizations',
                columns: [columns[1], columns[2], columns[5], columns[4], columns[6]],
                open: true,
                data: tables[-1]
            },
            {
                id: 'Awaiting',
                title: 'Awaiting for more information from your client',
                columns: [columns[1], columns[2], columns[7], columns[4], columns[8]],
                open: true,
                data: tables[2]
            },
            {
                id: 'Rejected',
                title: 'Rejected',
                columns: [columns[1], columns[2], columns[9], columns[4], columns[10]],
                open: true,
                data: tables[-2]
            },
            {
                id: 'StartedClients',
                title: 'Started by your clients',
                columns: [columns[1], columns[2], columns[7], columns[4], columns[8]],
                open: true,
                data: tables['invited']
            },
            {
                id: 'AllClients',
                title: 'All your KYC and Client Folders',
                columns: [columns[1], columns[2], columns[11], columns[4], columns[8]],
                open: true,
                data: tables['all']
            }
        ];

        this._changeDetectorRef.markForCheck();
    }

    /**
     * Request my fund access base of the requested state.
     * @param requested
     * @return void
     */
    requestKycList(requested): void {
        if (!requested) {
            OfiKycService.defaultRequestAmKycList(this._ofiKycService, this._ngRedux);
        }
    }

    buildLink(column, row, event) {
        if (
            !event.target.classList.contains('datagrid-expandable-caret') &&
            !event.target.classList.contains('datagrid-expandable-caret-button') &&
            !event.target.classList.contains('datagrid-expandable-caret-icon')
        ) {
            let ret = row.status === 'Accepted' ? '/client-referential/:kycID' : '/on-boarding/management/:kycID';
            const link = row.status === -1 ? '/client-referential/:kycID' : '/on-boarding/management/:kycID';
            link.match(/:\w+/g).forEach((match) => {
                const key = match.substring(1);
                const regex = new RegExp(match);
                ret = ret.replace(regex, row[key]);
            });
            this._router.navigateByUrl(ret);
        }

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
