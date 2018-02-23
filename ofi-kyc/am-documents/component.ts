/* Core/Angular imports. */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Inject} from '@angular/core';
/* Redux */
import {NgRedux, select} from '@angular-redux/store';
import { Subpanel } from './models';
import { fromJS } from 'immutable';
import {ToasterService} from 'angular2-toaster';
import {APP_CONFIG, AppConfig} from '@setl/utils';

/* Ofi orders request service. */
import {clearAppliedHighlight, SET_HIGHLIGHT_LIST, setAppliedHighlight} from '@setl/core-store/index';
import {setInformations, KycMyInformations} from '../../ofi-store/ofi-kyc/my-informations';
import {Observable} from 'rxjs/Observable';

import {OfiKycService} from '../../ofi-req-services/ofi-kyc/service';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiAmDocumentsComponent implements OnDestroy {

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
                @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
    }


    ngOnInit() {

        this.subscriptions.push(this.requestedOfiKycListOb.subscribe(
            (requested) => this.requestKycList(requested)));
        this.subscriptions.push(this.kycListOb.subscribe(
            (amKycListData) => this.updateTable(amKycListData)));

    }

    updateTable(tableData){

        let columns = {
            1: {
                label: 'Status',
                dataSource: 'status',
                sortable: true,
                link: '/product-module/shares/:id',
            },
            2: {
                label: 'Company Name',
                dataSource: 'companyName',
                sortable: true,
            },
            3:{
                label: 'Date of latest modification by the investor',
                dataSource: 'actionDate',
                sortable: true,
            },
            4:{
                label: 'Date KYC started',
                dataSource: 'kycDate',
                sortable: true,
            },
            5:{
                label: 'Date of approval',
                dataSource: 'actionDate',
                sortable: true,
            },
            6:{
                label: 'Validated by',
                dataSource: 'reviewBy',
                sortable: true,
            },
            7:{
                label: 'Date of latest modification by the investor',
                dataSource: 'actionDate',
                sortable: true,
            },
            8:{
                label: 'Reviewed by',
                dataSource: 'reviewBy',
                sortable: true,
            },
            9:{
                label: 'Date of rejection',
                dataSource: 'actionDate',
                sortable: true,
            },
            10:{
                label: 'Rejected by',
                dataSource: 'reviewBy',
                sortable: true,
            },
            11:{
                label: 'Date of latest modification',
                dataSource: 'actionDate',
                sortable: true,
            }
        };

        let tables = {
            '1':[],
            '-1': [],
            '2': [],
            '-2': [],
            'invited': [],
            'all': []
        };

        let replaceStatus = {
            '1': 'To Review',
            '-1': 'Accepted',
            '2': 'Waiting for more info',
            '-2': 'Refused'
        };

        tableData.forEach((row)=>{
            let rowStatus = row['status'];
            if (row['invited']){
                row['status'] = 'KYC started by client';
                tables['invited'].push(row);
            }else{
                row['status'] = replaceStatus[rowStatus];
                tables[rowStatus].push(row);
            }
            tables['all'].push(row);
        });

        this.panelDefs = [
            {
                title: 'Waiting for Approval',
                columns: [columns[1],columns[2],columns[3],columns[4]],
                open: false,
                data: tables[1]
            },
            {
                title: 'Accepted KYC Requests',
                columns: [columns[1],columns[2],columns[5],columns[4],columns[6]],
                open: false,
                data: tables[-1]
            },
            {
                title: 'Awaiting for more information from your client',
                columns: [columns[1],columns[2],columns[7],columns[4],columns[8]],
                open: false,
                data: tables[2]
            },
            {
                title: 'Rejected Requests',
                columns: [columns[1],columns[2],columns[9],columns[4],columns[10]],
                open: false,
                data: tables[-2]
            },
            {
                title: 'Started by your clients',
                columns: [columns[1],columns[2],columns[9],columns[4],columns[10]],
                open: false,
                data: tables['invited']
            },
            {
                title: 'All your KYC and Client Folders',
                columns: [columns[1],columns[2],columns[11],columns[4],columns[8]],
                open: false,
                data: tables['all']
            }
        ];
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
        let ret = column.link;
        column.link.match(/:\w+/g).forEach((match) => {
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
