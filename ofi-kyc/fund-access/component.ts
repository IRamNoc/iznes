/* Core/Angular imports. */
import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Inject} from '@angular/core';
/* Redux */
import {NgRedux, select} from '@angular-redux/store';

import { fromJS } from 'immutable';
import {ToasterService} from 'angular2-toaster';
import {APP_CONFIG, AppConfig} from '@setl/utils';
import {OfiKycService} from '../../ofi-req-services/ofi-kyc/service';
import {MessagesService, MessageActionsConfig} from '@setl/core-messages';

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
    investorData = {};
    tableData = [];
    access = {};
    showModal = false;
    changes = {
        add: false,
        remove: false
    };
    amCompany: string;

    /* Private properties. */
    private subscriptions: Array<any> = [];

    /* Observables. */

    /* Constructor. */
    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _ngRedux: NgRedux<any>,
                private toasterService: ToasterService,
                private _ofiKycService: OfiKycService,
                private _messagesService: MessagesService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
    }

    ngOnInit() {
        this.investorData = {
            kycID: 1,
            investorWalletID: 6,
            companyName: 'Test Company',
            firstName: 'Tester',
            lastName: 'McTest',
            email: 't.mctest@comp.com',
            telephoneNumber: '01247889568',
            approvalDate: '2018-02-28'
        };

        //test data.
        this.tableData = [
            {
                id: 1,
                fundName: 'Fund 1',
                shareName: 'Share Name A',
                isin: 'FR123457890',
                access: false
            }
        ];

        this.tableData.forEach((row)=>{
            this.access[row['id']] = {
                access: row['access'],
                changed: false,
                fundName: row['fundName'],
                shareName: row['shareName'],
                isin: row['isin']
            };
        });

        this.amCompany = 'AM Company';
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
        this.changes = {
            add: false,
            remove: false
        };
        Object.keys(this.access).forEach((key)=>{
            if (this.access[key]['changed']) this.changes[(this.access[key]['access']?'add':'remove')] = true;
        });
        this.showModal = true;
    }

    saveAccess(){
        if (this.changes['add'] || this.changes['remove']){
            let shareArray = {
                add: [],
                remove: []
            };
            let emailArray = {
                add: {},
                remove: {}
            };
            Object.keys(this.access).forEach((key)=> {
                if (this.access[key]['changed']){
                    shareArray[(this.access[key]['access']?'add':'remove')].push(key);

                    //array for email
                    if (emailArray[(this.access[key]['access']?'add':'remove')][this.access[key]['fundName']]==null) emailArray[(this.access[key]['access']?'add':'remove')][this.access[key]['fundName']] = [];
                    emailArray[(this.access[key]['access']?'add':'remove')][this.access[key]['fundName']].push({
                        shareName: this.access[key]['shareName'],
                        isin: this.access[key]['isin']
                    });
                }
            });

            let promises = [];
            if (shareArray['add'].length > 0) {
                promises.push(new Promise((resolve, reject) => {
                    this._ofiKycService.saveFundAccess({
                        kycID: this.investorData['kycID'],
                        investorWalletID: this.investorData['investorWalletID'],
                        shareArray: shareArray['add']
                    }).then(() => {
                        // success call back
                        resolve();
                    }, () => {
                        // fail call back
                        // todo
                    });
                }));
            }
            if (shareArray['remove'].length > 0) {
                promises.push(new Promise((resolve, reject) => {
                    this._ofiKycService.removeFundAccess({
                        kycID: this.investorData['kycID'],
                        investorWalletID: this.investorData['investorWalletID'],
                        shareArray: shareArray['remove']
                    }).then(() => {
                        // success call back
                        resolve();
                    }, () => {
                        // fail call back
                        // todo
                    });
                }));
            }
            Promise.all(promises).then(()=>{
                this.toasterService.pop('success', 'Share Permissions Saved');

                let recipientsArr = [this.investorData['investorWalletID']];
                let subjectStr = this.amCompany + ' has approved your application - You can invest!';

                let bodyStr = 'Hello ' + this.investorData['firstName'] + ',<br><br>Good news: you are now authorised to start trading on IZNES.';
                if (shareArray['add'].length > 0) {
                    bodyStr += '<br><br>You have been authorised to access the following shares:';
                    Object.keys(emailArray['add']).forEach((key) => {
                        bodyStr += '<br><br>' + key;
                        emailArray['add'][key].forEach((row) => {
                            bodyStr += '<br>' + row['shareName'] + ' - ISIN: ' + row['isin'];
                        });
                    });
                }
                if (shareArray['remove'].length > 0) {
                    bodyStr += '<br><br>Access to the following shares has been removed:';
                    Object.keys(emailArray['remove']).forEach((key) => {
                        bodyStr += '<br><br>' + key;
                        emailArray['remove'][key].forEach((row) => {
                            bodyStr += '<br>' + row['shareName'] + ' - ISIN: ' + row['isin'];
                        });
                    });
                }
                bodyStr += '<br><br><a class="btn" href="/#/funds">Go to the Funds shares page to start trading</a> [link needs ammending]<br><br>Thank you,<br><br>The IZNES team.';
                this._messagesService.sendMessage(recipientsArr, subjectStr, bodyStr);
            });
        }
    }
}
