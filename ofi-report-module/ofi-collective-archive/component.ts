import {
    Component, OnInit, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef, Pipe,
    PipeTransform
} from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import {NgRedux, select} from '@angular-redux/store';
import {OfiClientTxService} from '../../ofi-req-services/ofi-client-tx/service';
import {immutableHelper, NumberConverterService, mDateHelper} from '@setl/utils';
import _ from 'lodash';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {OfiOrdersService} from '../../ofi-req-services/ofi-orders/service';
import {setRequestedCollectiveArchive} from '../../ofi-store/ofi-orders/collective-archive/actions';
import {FormControl, FormGroup} from "@angular/forms";

@Component({
    selector: 'app-ofi-pnl-report',
    templateUrl: 'component.html',
    styleUrls: ['./component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class OfiCollectiveArchiveComponent implements OnInit, OnDestroy {
    tabsControl: Array<any>;

    archiveList: Array<any>;
    archiveListFiltered: Array<any>;

    // Date picker configuration
    configDate = {
        firstDayOfWeek: 'mo',
        format: 'DD-MM-YYYY',
        closeOnSelect: true,
        opens: 'right',
        locale: 'en',
    };

    // Date range search form
    dateRangeForm: FormGroup;
    fromDateValue: string;
    toDateValue: string;

    // List of observable subscription
    subscriptionsArray: Array<Subscription> = [];

    // List of redux observable.
    @select(['ofi', 'ofiOrders', 'collectiveArchive', 'collectiveArchiveList']) collectiveArchiveListOb;
    @select(['ofi', 'ofiOrders', 'collectiveArchive', 'requested']) collectiveArchiveRequestOb;

    constructor(private _ngRedux: NgRedux<any>,
                private _ofiClientTxService: OfiClientTxService,
                private _numberConverterService: NumberConverterService,
                private _alertsService: AlertsService,
                private _ofiOrdersService: OfiOrdersService,
                private _changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnDestroy() {

        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }

    ngOnInit() {

        /**
         * Default tabs.
         */
        this.tabsControl = [
            {
                title: {
                    icon: '',
                    text: 'List',
                    colorClass: ''
                },
                active: true
            }
        ];

        this.fromDateValue = mDateHelper.unixTimestampToDateStr(mDateHelper.substractYear(new Date(), 1), 'DD/MM/YYYY');
        this.toDateValue = mDateHelper.getCurrentUnixTimestampStr('DD/MM/YYYY');

        this.dateRangeForm = new FormGroup({
            fromDate: new FormControl(this.fromDateValue),
            toDate: new FormControl(this.toDateValue)
        });

        // List of observable subscription.
        this.subscriptionsArray.push(this.collectiveArchiveRequestOb.subscribe(
            (requested) => this.requestCollectiveArchive(requested)));
        this.subscriptionsArray.push(this.collectiveArchiveListOb.subscribe((archiveList) => {
            this.updateCollectiveArchive(archiveList);
        }));

    }

    requestCollectiveArchive(requestedState: boolean) {

        // If the state is false, that means we need to request the list.
        if (!requestedState) {
            // Set the state flag to true. so we do not request it again.
            this._ngRedux.dispatch(setRequestedCollectiveArchive());

            // Request the list.
            OfiOrdersService.defaultGetArrangementCollectiveArchive(this._ofiOrdersService, this._ngRedux);
        }
    }

    updateCollectiveArchive(archiveList) {
        this.archiveList = archiveList;
        const archiveListFiltered = this.filterTxsWithDate(archiveList);

        this.archiveListFiltered = immutableHelper.reduce(archiveListFiltered, (result, item) => {

            const price = item.get('price', 0);
            const currentTimeNumber = mDateHelper.getCurrentUnixTimestamp();
            const cutoffDateNumber = item.get('cutoffDateNumber', 0);
            let status = '';

            if (currentTimeNumber > cutoffDateNumber) {
                status += 'Definitive';
            } else {
                status += 'Estimate';
            }

            if (price === 0 || !price) {
                status += ' unknown';
            } else {
                status += ' known';
            }

            result.push({
                subscriptionTotal: this._numberConverterService.toFrontEnd(item.get('subscriptionTotal', 0)),
                subscriptionQuantity: this._numberConverterService.toFrontEnd(item.get('subscriptionQuantity', 0)),
                redemptionTotal: this._numberConverterService.toFrontEnd(item.get('redemptionTotal', 0)),
                redemptionQuantity: this._numberConverterService.toFrontEnd(item.get('redemptionQuantity', 0)),
                cutoffDate: item.get('cutoffDate', 0),
                cutoffDateNumber: item.get('cutoffDateNumber', 0),
                asset: item.get('asset', ''),
                status
            });
            return result;
        }, []);
        this._changeDetectorRef.markForCheck();
    }

    dateChange(dateType, $event) {
        if (dateType === 'from') {
            this.fromDateValue = $event;
        } else {
            this.toDateValue = $event;
        }
        this.updateCollectiveArchive(this.archiveList);
    }

    filterTxsWithDate(archiveListData): any {
        const fromDate = mDateHelper.dateStrToUnixTimestamp(this.fromDateValue + ' ' + '00:00', 'DD/MM/YYYY HH:mm');
        const toDate = mDateHelper.dateStrToUnixTimestamp(this.toDateValue + ' ' + '23:59', 'DD/MM/YYYY HH:mm');

        return immutableHelper.reduce(archiveListData, (result, item) => {
            const thisDate = item.get('cutoffDateNumber', 0);

            if (thisDate >= fromDate && thisDate <= toDate) {
                result.push(item.toJS());
            }

            return result;

        }, []);
    }
}
