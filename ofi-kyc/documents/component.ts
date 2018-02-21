import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Subpanel } from './models';
import { MockKYCDocumentsService } from './documents.mock.service';

@Component({
    selector: 'app-invite-investors',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiDocumentsComponent implements OnInit, OnDestroy {

    showModal = false;
    countdown = 5;

    public panelDefs: Subpanel[];
    private subscriptions: Array<any> = [];

    /* Constructor. */
    constructor(
        private _fb: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private service: MockKYCDocumentsService,
    ) {

    }

    ngOnInit() {
        this.panelDefs = [
            {
                title: 'Shares',
                columns: [
                    {
                        label: 'Share name',
                        dataSource: 'name',
                        sortable: true,
                        link: '/product-module/shares/:id',
                    },
                    {
                        label: 'Fund name',
                        dataSource: 'fund',
                        sortable: true,
                    },
                    {
                        label: 'ISIN',
                        dataSource: 'isin',
                        sortable: true,
                    },
                    {
                        label: 'Management company',
                        dataSource: 'managementCompany',
                        sortable: true,
                    },
                    {
                        label: 'Type of share',
                        dataSource: 'type',
                        sortable: true,
                    },
                    {
                        label: 'Status (close or open?)',
                        dataSource: 'status',
                        sortable: true,
                    },
                ],
                action: {
                    title: 'Add new Share',
                    icon: 'plus',
                    callback: this.addShare,
                },
                open: false,
                data: this.service.getShares(),
            },
            {
                title: 'Funds',
                columns: [
                    {
                        label: 'Fund name',
                        dataSource: 'name',
                        sortable: true,
                        //link: '/product-module/funds/:id',
                    },
                    {
                        label: 'LEI',
                        dataSource: 'lei',
                        sortable: true,
                    },
                    {
                        label: 'Management company',
                        dataSource: 'managementCompany',
                        sortable: true,
                    },
                    {
                        label: 'Country',
                        dataSource: 'country',
                        sortable: true,
                    },
                    {
                        label: 'Low status',
                        dataSource: 'lowStatus',
                        sortable: true,
                    },
                    {
                        label: 'Umbrella fund (to which the fund belongs)',
                        dataSource: 'umbrellaFund',
                        sortable: true,
                    },
                    {
                        label: 'Currency of the fund',
                        dataSource: 'currency',
                        sortable: true,
                    },
                ],
                action: {
                    title: 'Add new Fund',
                    icon: 'plus',
                    callback: this.addFund,
                },
                open: false,
                data: this.service.getFunds(),
            },
            {
                title: 'Umbrella Funds',
                columns: [
                    {
                        label: 'Umbrella fund name',
                        dataSource: 'name',
                        sortable: true,
                        //link: '/product-module/umbrella-funds/:id',
                    },
                    {
                        label: 'LEI',
                        dataSource: 'lei',
                        sortable: true,
                    },
                    {
                        label: 'Management company',
                        dataSource: 'managementCompany',
                        sortable: true,
                    },
                    {
                        label: 'Country',
                        dataSource: 'country',
                        sortable: true,
                    },
                    {
                        label: 'Currency of the umbrealla fund',
                        dataSource: 'currency',
                        sortable: true,
                    },
                ],
                action: {
                    title: 'Add new Fund',
                    icon: 'plus',
                    callback: this.addUmbreallaFund,
                },
                open: false,
                data: this.service.getUmbrellaFunds(),
            },
            {
                title: 'Shares, Funds & Umbreallas waiting for your validation (modification not yet published to investors on IZNES)',
                columns: [
                    {
                        label: 'Status',
                        dataSource: 'status',
                        sortable: true,
                    },
                    {
                        label: 'Type',
                        dataSource: 'type',
                        sortable: true,
                    },
                    {
                        label: 'Product name',
                        dataSource: 'name',
                        sortable: true,
                    },
                    {
                        label: 'Date of modification',
                        dataSource: 'date',
                        sortable: true,
                    },
                    {
                        label: 'To be validated for (date)',
                        dataSource: 'validationDate',
                        sortable: true,
                    },
                    {
                        label: 'Modified by',
                        dataSource: 'modifiedBy',
                        sortable: true,
                    },
                ],
                open: false,
                data: this.service.getAwaitings(),
            },
        ];
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

    addShare() {
        console.log('add new share!');
    }

    addFund() {
        console.log('add new fund!');
    }

    addUmbreallaFund() {
        console.log('add umbrealla fund!');
    }

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }

    markForCheck() {
        this._changeDetectorRef.markForCheck();
    }
}
