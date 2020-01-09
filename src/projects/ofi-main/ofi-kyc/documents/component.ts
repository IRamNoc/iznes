import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subpanel } from './models';
import { MockKYCDocumentsService } from './documents.mock.service';
import { LogService } from '@setl/utils';
import { Router } from '@angular/router';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-invite-investors',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfiDocumentsComponent implements OnInit, OnDestroy {
    showModal = false;
    countdown = 5;

    public panelDefs: Subpanel[];
    private subscriptions: Array<any> = [];

    /* Constructor. */
    constructor(
        private fb: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef,
        private service: MockKYCDocumentsService,
        private logService: LogService,
        private router: Router,
        public translate: MultilingualService,
    ) {
    }

    ngOnInit() {
        this.panelDefs = [
            {
                title: this.translate.translate('Shares'),
                columns: [
                    {
                        label: this.translate.translate('Share Name'),
                        dataSource: 'name',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Fund Name'),
                        dataSource: 'fund',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('ISIN'),
                        dataSource: 'isin',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Management Company'),
                        dataSource: 'managementCompany',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Type of Share'),
                        dataSource: 'type',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Status (Close or Open?)'),
                        dataSource: 'status',
                        sortable: true,
                    },
                ],
                action: {
                    title: this.translate.translate('Add New Share'),
                    icon: 'plus',
                    callback: this.addShare,
                },
                open: false,
                link: '/product-module/shares/:id',
                data: this.service.getShares(),
            },
            {
                title: this.translate.translate('Funds'),
                columns: [
                    {
                        label: this.translate.translate('Fund Name'),
                        dataSource: 'name',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('LEI'),
                        dataSource: 'lei',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Management Company'),
                        dataSource: 'managementCompany',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Country'),
                        dataSource: 'country',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Low Status'),
                        dataSource: 'lowStatus',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Umbrella Fund (to which the fund belongs)'),
                        dataSource: 'umbrellaFund',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Currency of the Fund'),
                        dataSource: 'currency',
                        sortable: true,
                    },
                ],
                action: {
                    title: this.translate.translate('Add New Fund'),
                    icon: 'plus',
                    callback: this.addFund,
                },
                open: false,
                data: this.service.getFunds(),
                // link: '/product-module/funds/:id',
            },
            {
                title: this.translate.translate('Umbrella Funds'),
                columns: [
                    {
                        label: this.translate.translate('Umbrella Fund Name'),
                        dataSource: 'name',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('LEI'),
                        dataSource: 'lei',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Management Company'),
                        dataSource: 'managementCompany',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Country'),
                        dataSource: 'country',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Currency of the Umbrella Fund'),
                        dataSource: 'currency',
                        sortable: true,
                    },
                ],
                action: {
                    title: this.translate.translate('Add New Fund'),
                    icon: 'plus',
                    callback: this.addUmbrellaFund,
                },
                open: false,
                data: this.service.getUmbrellaFunds(),
                // link: '/product-module/umbrella-funds/:id',
            },
            {
                title: this.translate.translate('Shares, Funds & Umbrella Funds waiting for your validation (modification not yet published to investors on IZNES)'),
                columns: [
                    {
                        label: this.translate.translate('Status'),
                        dataSource: 'status',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Type'),
                        dataSource: 'type',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Product Name'),
                        dataSource: 'name',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Date of Modification'),
                        dataSource: 'date',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('To be validated for (date)'),
                        dataSource: 'validationDate',
                        sortable: true,
                    },
                    {
                        label: this.translate.translate('Modified By'),
                        dataSource: 'modifiedBy',
                        sortable: true,
                    },
                ],
                open: false,
                data: this.service.getAwaitings(),
            },
        ];
    }

    buildLink(column, row, link, event) {
        if (
            !event.target.classList.contains('datagrid-expandable-caret') &&
            !event.target.classList.contains('datagrid-expandable-caret-button') &&
            !event.target.classList.contains('datagrid-expandable-caret-icon')
        ) {
            if (link !== undefined) {
                let ret = link;
                link.match(/:\w+/g).forEach((match) => {
                    const key = match.substring(1);
                    const regex = new RegExp(match);
                    ret = ret.replace(regex, row[key]);
                });
                this.router.navigateByUrl(ret);
            }
        }
    }

    addShare() {
        this.logService.log('add new share!');
    }

    addFund() {
        this.logService.log('add new fund!');
    }

    addUmbrellaFund() {
        this.logService.log('add umbrella fund!');
    }

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this.changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }
}
