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
    @select(['ofi', 'ofiKyc', 'amKycList', 'kycList']) kycListOb;

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
        this.panelDefs = [
            {
                title: 'Waiting for Approval 1',
                columns: [
                    {
                        label: 'Status',
                        dataSource: 'status',
                        sortable: true,
                        link: '/product-module/shares/:id',
                    },
                    {
                        label: 'Company Name',
                        dataSource: 'companyName',
                        sortable: true,
                    },
                    {
                        label: 'Date of latest modification by the investor',
                        dataSource: 'actionDate',
                        sortable: true,
                    },
                    {
                        label: 'Date KYC started',
                        dataSource: 'kycDate',
                        sortable: true,
                    }
                ],
                open: false,
                data: [
                    {
                        status: 'To Review',
                        companyName: 'test',
                        actionDate: '2018-01-01',
                        kycDate: '2018-02-02'
                    },
                    {
                        status: 'To Review',
                        companyName: 'test2',
                        actionDate: '2018-01-01',
                        kycDate: '2018-02-02'
                    },
                ],
            },
            {
                title: 'Accepted KYC Requests -1',
                columns: [
                    {
                        label: 'Status',
                        dataSource: 'status',
                        sortable: true,
                        link: '/product-module/shares/:id',
                    },
                    {
                        label: 'Company Name',
                        dataSource: 'companyName',
                        sortable: true,
                    },
                    {
                        label: 'Date of approval',
                        dataSource: 'approvalDate',
                        sortable: true,
                    },
                    {
                        label: 'Date KYC started',
                        dataSource: 'kycDate',
                        sortable: true,
                    },
                    {
                        label: 'Validated by',
                        dataSource: 'reviewBy',
                        sortable: true,
                    }
                ],
                open: false,
                data: [
                    {
                        status: 'Accepted',
                        companyName: 'test',
                        actionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewBy: 'Me'
                    },
                    {
                        status: 'Accepted',
                        companyName: 'test2',
                        actionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewBy: 'You'
                    },
                ],
            },
            {
                title: 'Awaiting for more information from your client 2',
                columns: [
                    {
                        label: 'Status',
                        dataSource: 'status',
                        sortable: true,
                        link: '/product-module/shares/:id',
                    },
                    {
                        label: 'Company Name',
                        dataSource: 'companyName',
                        sortable: true,
                    },
                    {
                        label: 'Date of latest modification by the investor',
                        dataSource: 'actionDate',
                        sortable: true,
                    },
                    {
                        label: 'Date KYC started',
                        dataSource: 'kycDate',
                        sortable: true,
                    },
                    {
                        label: 'Reviewed by',
                        dataSource: 'reviewBy',
                        sortable: true,
                    }
                ],
                open: false,
                data: [
                    {
                        status: 'Accepted',
                        companyName: 'test',
                        actionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewBy: 'Me'
                    },
                    {
                        status: 'Accepted',
                        companyName: 'test2',
                        actionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewBy: 'You'
                    },
                ],
            },
            {
                title: 'Rejected Requests -2',
                columns: [
                    {
                        label: 'Status',
                        dataSource: 'status',
                        sortable: true,
                        link: '/product-module/shares/:id',
                    },
                    {
                        label: 'Company Name',
                        dataSource: 'companyName',
                        sortable: true,
                    },
                    {
                        label: 'Date of rejection',
                        dataSource: 'rejectionDate',
                        sortable: true,
                    },
                    {
                        label: 'Date KYC started',
                        dataSource: 'kycDate',
                        sortable: true,
                    },
                    {
                        label: 'Rejected by',
                        dataSource: 'reviewBy',
                        sortable: true,
                    }
                ],
                open: false,
                data: [
                    {
                        status: 'Accepted',
                        companyName: 'test',
                        actionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewBy: 'Me'
                    },
                    {
                        status: 'Accepted',
                        companyName: 'test2',
                        actionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewBy: 'You'
                    },
                ],
            },
            {
                title: 'Started by your clients [invited=true]',
                columns: [
                    {
                        label: 'Status',
                        dataSource: 'status',
                        sortable: true,
                        link: '/product-module/shares/:id',
                    },
                    {
                        label: 'Company Name',
                        dataSource: 'companyName',
                        sortable: true,
                    },
                    {
                        label: 'Date of rejection',
                        dataSource: 'rejectionDate',
                        sortable: true,
                    },
                    {
                        label: 'Date KYC started',
                        dataSource: 'kycDate',
                        sortable: true,
                    },
                    {
                        label: 'Rejected by',
                        dataSource: 'reviewBy',
                        sortable: true,
                    }
                ],
                open: false,
                data: [
                    {
                        status: 'Accepted',
                        companyName: 'test',
                        actionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewBy: 'Me'
                    },
                    {
                        status: 'Accepted',
                        companyName: 'test2',
                        actionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewBy: 'You'
                    },
                ],
            },
            {
                title: 'Started by your clients [all!] - redo title.',
                columns: [
                    {
                        label: 'Status',
                        dataSource: 'status',
                        sortable: true,
                        link: '/product-module/shares/:id',
                    },
                    {
                        label: 'Company Name',
                        dataSource: 'companyName',
                        sortable: true,
                    },
                    {
                        label: 'Date of latest modification',
                        dataSource: 'actionDate',
                        sortable: true,
                    },
                    {
                        label: 'Date KYC started',
                        dataSource: 'kycDate',
                        sortable: true,
                    },
                    {
                        label: 'Reviewed by',
                        dataSource: 'reviewBy',
                        sortable: true,
                    }
                ],
                open: false,
                data: [
                    {
                        status: 'Accepted',
                        companyName: 'test',
                        actionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewBy: 'Me'
                    },
                    {
                        status: 'Accepted',
                        companyName: 'test2',
                        actionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewBy: 'You'
                    },
                ],
            },
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
