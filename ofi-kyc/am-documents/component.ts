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

    /* Constructor. */
    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _ngRedux: NgRedux<any>,
                private toasterService: ToasterService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
    }


    ngOnInit() {
        this.panelDefs = [
            {
                title: 'Waiting for Approval',
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
                        dataSource: 'modDate',
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
                        modDate: '2018-01-01',
                        kycDate: '2018-02-02'
                    },
                    {
                        status: 'To Review',
                        companyName: 'test2',
                        modDate: '2018-01-01',
                        kycDate: '2018-02-02'
                    },
                ],
            },
            {
                title: 'Accepted KYC Requests',
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
                        dataSource: 'validated',
                        sortable: true,
                    }
                ],
                open: false,
                data: [
                    {
                        status: 'Accepted',
                        companyName: 'test',
                        approvalDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        validated: 'Me'
                    },
                    {
                        status: 'Accepted',
                        companyName: 'test2',
                        approvalDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        validated: 'You'
                    },
                ],
            },
            {
                title: 'Awaiting for more information from your client',
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
                        dataSource: 'modDate',
                        sortable: true,
                    },
                    {
                        label: 'Date KYC started',
                        dataSource: 'kycDate',
                        sortable: true,
                    },
                    {
                        label: 'Reviewed by',
                        dataSource: 'reviewed',
                        sortable: true,
                    }
                ],
                open: false,
                data: [
                    {
                        status: 'Waiting for more info',
                        companyName: 'test',
                        modDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewed: 'Me'
                    },
                    {
                        status: 'Waiting for more info',
                        companyName: 'test2',
                        modDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewed: 'You'
                    },
                ],
            },
            {
                title: 'Rejected Requests',
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
                        dataSource: 'rejected',
                        sortable: true,
                    }
                ],
                open: false,
                data: [
                    {
                        status: 'Rejected',
                        companyName: 'test',
                        rejectionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        rejected: 'Me'
                    },
                    {
                        status: 'Rejected',
                        companyName: 'test2',
                        rejectionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        rejected: 'You'
                    },
                ],
            },
            {
                title: 'Started by your clients',
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
                        dataSource: 'rejected',
                        sortable: true,
                    }
                ],
                open: false,
                data: [
                    {
                        status: 'Rejected',
                        companyName: 'test',
                        rejectionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        rejected: 'Me'
                    },
                    {
                        status: 'Rejected',
                        companyName: 'test2',
                        rejectionDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        rejected: 'You'
                    },
                ],
            },
            {
                title: 'Started by your clients',
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
                        dataSource: 'modDate',
                        sortable: true,
                    },
                    {
                        label: 'Date KYC started',
                        dataSource: 'kycDate',
                        sortable: true,
                    },
                    {
                        label: 'Reviewed by',
                        dataSource: 'reviewed',
                        sortable: true,
                    }
                ],
                open: false,
                data: [
                    {
                        status: 'To review',
                        companyName: 'test',
                        modDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewed: 'Me'
                    },
                    {
                        status: 'To review',
                        companyName: 'test2',
                        modDate: '2018-01-01',
                        kycDate: '2018-02-02',
                        reviewed: 'You'
                    },
                ],
            },
        ];

        //need to grab this data from redux.

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
