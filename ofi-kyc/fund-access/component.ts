/* Core/Angular imports. */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, Inject, OnInit} from '@angular/core';
/* Redux */
import {NgRedux, select} from '@angular-redux/store';

import {ToasterService} from 'angular2-toaster';
import {APP_CONFIG, AppConfig} from '@setl/utils';
import {OfiKycService} from '../../ofi-req-services/ofi-kyc/service';
import {MessagesService, MessageActionsConfig} from '@setl/core-messages';
import {ActivatedRoute} from '@angular/router';
import {mDateHelper, immutableHelper} from '@setl/utils';
import {Observable} from 'rxjs/Observable';
import {OfiFundShareService} from '../../ofi-req-services/ofi-product/fund-share/service';
import {AllFundShareDetail} from '../../ofi-store/ofi-product/fundshare/model';

@Component({
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiFundAccessComponent implements OnDestroy, OnInit {

    appConfig: AppConfig;

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
    kycId: number;

    /* Private properties. */
    private subscriptions: Array<any> = [];

    /* Observables. */
    @select(['ofi', 'ofiKyc', 'requested']) requestedAmKycListObs;
    @select(['ofi', 'ofiKyc', 'amKycList', 'amKycList']) amKycListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'requestedAmAllFundShareList']) requestedAmAllFundShareListOb: Observable<any>;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'amAllFundShareList']) amAllFundShareListOb: Observable<any>;

    /* Constructor. */
    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _ngRedux: NgRedux<any>,
                private toasterService: ToasterService,
                private _ofiKycService: OfiKycService,
                private _messagesService: MessagesService,
                private _route: ActivatedRoute,
                private _ofiFundShareService: OfiFundShareService,
                @Inject(APP_CONFIG) appConfig: AppConfig,) {
        this.appConfig = appConfig;
    }

    ngOnInit() {
        this.subscriptions.push(this.requestedAmKycListObs.subscribe((requested) => this.setAmKycListRequested(requested)));
        this.subscriptions.push(this.amKycListObs.subscribe((amKycList) => this.getAmKycList(amKycList)));
        this.subscriptions.push(this.requestedAmKycListObs.subscribe(requested => {
            this.requestAllFundShareList(requested);
        }));
        this.subscriptions.push(this.amAllFundShareListOb.subscribe(navList => {
            this.updateAllFundShareList(navList);
        }));

        // Get the parameter passed to URL
        this._route.params.subscribe((params) => {
            if (params.kycId) {
                this.kycId = Number(params.kycId);
            }
        });

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

        // test data.
        this.tableData = [];

        this.access = {};

        this.amCompany = '';
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

    displayModal() {
        this.changes = {
            add: false,
            remove: false
        };
        Object.keys(this.access).forEach((key) => {
            if (this.access[key]['changed']) this.changes[(this.access[key]['access'] ? 'add' : 'remove')] = true;
        });
        this.showModal = true;
    }

    saveAccess() {
        if (this.changes['add'] || this.changes['remove']) {
            let shareArray = {
                add: [],
                remove: []
            };
            let emailArray = {
                add: {},
                remove: {}
            };
            Object.keys(this.access).forEach((key) => {
                if (this.access[key]['changed']) {
                    shareArray[(this.access[key]['access'] ? 'add' : 'remove')].push(key);

                    //array for email
                    if (emailArray[(this.access[key]['access'] ? 'add' : 'remove')][this.access[key]['fundName']] == null) emailArray[(this.access[key]['access'] ? 'add' : 'remove')][this.access[key]['fundName']] = [];
                    emailArray[(this.access[key]['access'] ? 'add' : 'remove')][this.access[key]['fundName']].push({
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
            Promise.all(promises).then(() => {
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

    setAmKycListRequested(requested) {
        if (!requested) {
            OfiKycService.defaultRequestAmKycList(this._ofiKycService, this._ngRedux);
        }
    }

    getAmKycList(amKycList: any) {
        if (amKycList.length > 0 && amKycList.findIndex((kyc) => kyc.kycID === this.kycId) !== -1) {
            const kyc = amKycList.filter((kyc) => kyc.kycID === this.kycId)[0];
            const phoneNumber = (kyc.investorPhoneCode && kyc.investorPhoneNumber) ? `${kyc.investorPhoneCode} ${kyc.investorPhoneNumber}` : '';
            const approvalDateRequestTs = mDateHelper.dateStrToUnixTimestamp(kyc.lastUpdated, 'YYYY-MM-DD hh:mm:ss');
            const approvalDateRequest = mDateHelper.unixTimestampToDateStr(approvalDateRequestTs, 'DD / MM / YYYY');

            this.investorData = {
                'investorWalletID': kyc.investorWalletID,
                'companyName': kyc.investorCompanyName,
                'firstName': kyc.investorFirstName,
                'lastName': kyc.investorLastName,
                'email': kyc.investorEmail,
                'telephoneNumber': phoneNumber,
                'approvalDate': approvalDateRequest
            };

            this.amCompany = kyc.companyName;

            console.log(this.investorData);

            this._changeDetectorRef.markForCheck();
        }
    }

    requestAllFundShareList(requested: boolean) {

        if (requested) {
            return;
        }

        OfiFundShareService.defaultRequestAmAllFundShareList(this._ofiFundShareService, this._ngRedux);
    }

    updateAllFundShareList(shareData: { [shareId: string]: AllFundShareDetail }) {
        this.tableData = immutableHelper.reduce(shareData, (result, item) => {
            result.push({
                id: item.get('shareId', ''),
                fundName: item.get('fundName', ''),
                shareName: item.get('shareName', ''),
                isin: item.get('fundShareIsin', ''),
                assess: false
            });
            return result;
        }, []);

        this.updateFundAccess();

        this._changeDetectorRef.markForCheck();
    }

    updateFundAccess() {
        this.tableData.forEach((row) => {
            this.access[row['id']] = {
                access: row['access'],
                changed: false,
                fundName: row['fundName'],
                shareName: row['shareName'],
                isin: row['isin']
            };
        });
    }
}
