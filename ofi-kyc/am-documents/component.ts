/* Core/Angular imports. */
import {
    AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Inject,
    OnInit
} from '@angular/core';
/* Redux */
import {NgRedux, select} from '@angular-redux/store';
import {Subpanel} from './models';
import {fromJS} from 'immutable';
import {ToasterService} from 'angular2-toaster';
import {APP_CONFIG, AppConfig} from '@setl/utils';

/* Ofi orders request service. */
import {clearAppliedHighlight, SET_HIGHLIGHT_LIST, setAppliedHighlight} from '@setl/core-store/index';
import {setInformations, KycMyInformations} from '../../ofi-store/ofi-kyc/my-informations';
import {Observable} from 'rxjs/Observable';

import {OfiKycService} from '../../ofi-req-services/ofi-kyc/service';

import {immutableHelper} from '@setl/utils';

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
                label: 'Status',
                dataSource: 'status',
                sortable: true,
                hasLink: true,
                kycDocLink: '/kyc-documents/client/:kycID',
                kycFundAccessLink: '/fund-access/:kycID',
            },
            2: {
                label: 'Company Name',
                dataSource: 'investorCompanyName',
                sortable: true,
            },
            3: {
                label: 'Date of latest modification by the investor',
                dataSource: 'lastUpdated',
                sortable: true,
            },
            4: {
                label: 'Date KYC started',
                dataSource: 'dateEntered',
                sortable: true,
            },
            5: {
                label: 'Date of approval',
                dataSource: 'lastUpdated',
                sortable: true,
            },
            6: {
                label: 'Validated by',
                dataSource: 'amFirstName',
                sortable: true,
            },
            7: {
                label: 'Date of latest modification by the investor',
                dataSource: 'lastUpdated',
                sortable: true,
            },
            8: {
                label: 'Reviewed by',
                dataSource: 'amFirstName',
                sortable: true,
            },
            9: {
                label: 'Date of rejection',
                dataSource: 'lastUpdated',
                sortable: true,
            },
            10: {
                label: 'Rejected by',
                dataSource: 'amFirstName',
                sortable: true,
            },
            11: {
                label: 'Date of latest modification',
                dataSource: 'lastUpdated',
                sortable: true,
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

        tableDataCopy.forEach((row) => {
            const rowStatus = row['status'];

            row['status'] = replaceStatus[rowStatus];
            tables[rowStatus].push(row);

            if (row['isInvited'] === 1) {
                tables['invited'].push(row);
            }
            tables['all'].push(row);
        });

        this.panelDefs = [
            {
                title: 'Waiting for Approval',
                columns: [columns[1], columns[2], columns[3], columns[4]],
                open: false,
                data: tables[1]
            },
            {
                title: 'Accepted - Funds Access Authorizations',
                columns: [columns[1], columns[2], columns[5], columns[4], columns[6]],
                open: false,
                data: tables[-1]
            },
            {
                title: 'Awaiting for more information from your client',
                columns: [columns[1], columns[2], columns[7], columns[4], columns[8]],
                open: false,
                data: tables[2]
            },
            {
                title: 'Rejected',
                columns: [columns[1], columns[2], columns[9], columns[4], columns[10]],
                open: false,
                data: tables[-2]
            },
            {
                title: 'Started by your clients',
                columns: [columns[1], columns[2], columns[7], columns[4], columns[8]],
                open: false,
                data: tables['invited']
            },
            {
                title: 'All your KYC and Client Folders',
                columns: [columns[1], columns[2], columns[11], columns[4], columns[8]],
                open: false,
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

    buildLink(column, row) {
        let ret = row.status === 'Accepted' ? column.kycFundAccessLink : column.kycDocLink;
        const linkKey = row.status === -1 ? 'kycFundAccessLink' : 'kycDocLink';
        column[linkKey].match(/:\w+/g).forEach((match) => {
            const key = match.substring(1);
            const regex = new RegExp(match);
            ret = ret.replace(regex, row[key]);
        });
        return ret;
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
