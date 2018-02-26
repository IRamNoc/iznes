/* Core/Angular imports. */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Inject} from '@angular/core';
/* Redux */
import {NgRedux, select} from '@angular-redux/store';

import { fromJS } from 'immutable';
import {ToasterService} from 'angular2-toaster';
import {APP_CONFIG, AppConfig} from '@setl/utils';
import {OfiKycService} from '../../ofi-req-services/ofi-kyc/service';

/* Ofi orders request service. */
import {clearAppliedHighlight, SET_HIGHLIGHT_LIST, setAppliedHighlight} from '@setl/core-store/index';
import {setInformations, KycMyInformations} from '../../ofi-store/ofi-kyc/my-informations';
import {Observable} from 'rxjs/Observable';

@Component({
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiFundAccessComponent implements OnDestroy {

    appConfig: AppConfig;
    hasFilledAdditionnalInfos = false;

    /* Public properties. */
    tableData = [];
    access = {};
    showModal = false;
    modalRows = false;

    /* Private properties. */
    private subscriptions: Array<any> = [];

    /* Observables. */

    /* Constructor. */
    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _ngRedux: NgRedux<any>,
                private toasterService: ToasterService,
                private _ofiKycService: OfiKycService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
    }

    ngOnInit() {
        this.tableData = [
            {
                id: 1,
                fundName: 'Fund 1',
                shareName: 'Share Name A',
                isin: 'FR123457890',
                access: true
            },
            {
                id: 2,
                fundName: 'Fund 1',
                shareName: 'Share Name B',
                isin: 'FR123457890',
                access: true
            },
            {
                id: 3,
                fundName: 'Fund 1',
                shareName: 'Share Name C',
                isin: 'FR123457890',
                access: false
            },
            {
                id: 4,
                fundName: 'Fund 1',
                shareName: 'Share Name D',
                isin: 'FR123457890',
                access: false
            },
            {
                id: 5,
                fundName: 'Fund 1',
                shareName: 'Share Name E',
                isin: 'FR123457890',
                access: false
            }
        ];

        this.tableData.forEach((row)=>{
            this.access[row['id']] = row['access'];
        });
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

    displayModal(){
        this.modalRows = false;
        Object.keys(this.access).forEach((key)=>{
            if (this.access[key]) this.modalRows = true;
        });
        this.showModal = true;
    }

    saveAccess(){
        //save access for company
        //send email

    }
}
