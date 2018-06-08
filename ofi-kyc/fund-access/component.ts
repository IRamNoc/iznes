/* Core/Angular imports. */
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit} from '@angular/core';
/* Redux */
import {NgRedux, select} from '@angular-redux/store';

import {ToasterService} from 'angular2-toaster';
import {APP_CONFIG, AppConfig, ConfirmationService, immutableHelper, mDateHelper} from '@setl/utils';
import {OfiKycService} from '../../ofi-req-services/ofi-kyc/service';
import {MessagesService} from '@setl/core-messages';
import {ActivatedRoute} from '@angular/router';
import {OfiFundShareService} from '../../ofi-req-services/ofi-product/fund-share/service';
import {AllFundShareDetail} from '../../ofi-store/ofi-product/fund-share-list/model';
import * as _ from 'lodash';
import {FormBuilder, FormGroup} from '@angular/forms';
import {FileService} from '@setl/core-req-services';
import {SagaHelper} from '@setl/utils';

@Component({
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiFundAccessComponent implements OnDestroy, OnInit {

    appConfig: AppConfig;

    /* Public properties. */
    currentInvestor: any = {};
    investorData = {};
    tableData = [];
    access = {};
    changes = {
        add: false,
        remove: false
    };
    amCompany: string;
    kycId: number;
    investorWalletId: number;
    investorWalletData = {};

    investorForm: FormGroup;

    showOverrideModal = false;
    currentOverride: number = 0;
    newOverride = {
        amount: 0,
        document: ''
    };
    uploadFiles = {};

    /* Private properties. */
    private subscriptions: Array<any> = [];

    /* Observables. */
    @select(['ofi', 'ofiKyc', 'requested']) requestedAmKycListObs;
    @select(['ofi', 'ofiKyc', 'amKycList', 'amKycList']) amKycListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'requestedShare']) requestedAmAllFundShareListOb;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) amAllFundShareListOb;

    /* Constructor. */
    constructor(private _changeDetectorRef: ChangeDetectorRef,
                private _ngRedux: NgRedux<any>,
                private toasterService: ToasterService,
                private _ofiKycService: OfiKycService,
                private _messagesService: MessagesService,
                private _route: ActivatedRoute,
                private _confirmationService: ConfirmationService,
                private _ofiFundShareService: OfiFundShareService,
                private _fb: FormBuilder,
                private fileService: FileService,
                @Inject(APP_CONFIG) appConfig: AppConfig,
    ) {
        this.appConfig = appConfig;
        this.investorForm = this._fb.group({
            companyName: {value: '', disabled: true},
            clientReference: '',
            firstName: {value: '', disabled: true},
            lastName: {value: '', disabled: true},
            email: {value: '', disabled: true},
            phoneNumber: {value: '', disabled: true},
            approvalDateRequest: {value: '', disabled: true},
        });
    }

    ngOnInit() {
        this.subscriptions.push(this.requestedAmKycListObs.subscribe((requested) => this.setAmKycListRequested(requested)));
        this.subscriptions.push(this.amKycListObs.subscribe((amKycList) => this.getAmKycList(amKycList)));
        this.subscriptions.push(this.requestedAmKycListObs.subscribe(requested => {
            this.requestAllFundShareList(requested);
        }));
        this.subscriptions.push(this.amAllFundShareListOb.subscribe(fundShareList => {
            this.updateAllFundShareList(fundShareList);
        }));

        // Get the parameter passed to URL
        this._route.params.subscribe((params) => {
            if (params.kycId) {
                this.kycId = Number(params.kycId);
            }
        });

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

        let message = '';
        if (!this.changes['add'] && !this.changes['remove']) {
            message += 'No changes have been made to the Investors\' Fund Access permissions.';
        }
        if (this.changes['add']) {
            message += `<br>You are giving ${this.investorData['companyName']} permission to invest in the following funds' shares:<br><br>
                       <table class="table grid"><tr><td><b>Fund Name</b></td><td><b>Share Name</b></td><td><b>ISIN</b></td></tr>`;
            this.tableData.forEach((row) => {
                if (this.access[row['id']]['changed'] && this.access[row['id']]['access']) {
                    message += `<tr><td>${row['fundName']}</td><td>${row['shareName']}</td><td>${row['isin']}</td></tr>`;
                }
            });
            message += '</table>';
            if (this.changes['remove']) message += '<br>';
        }
        if (this.changes['remove']) {
            message += `<br>You are removing ${this.investorData['companyName']}'s permission to invest in the following funds' shares:<br><br>
                       <table class="table grid"><tr><td><b>Fund Name</b></td><td><b>Share Name</b></td><td><b>ISIN</b></td></tr>`;
            this.tableData.forEach((row) => {
                if (this.access[row['id']]['changed'] && !this.access[row['id']]['access']) {
                    message += `<tr><td>${row['fundName']}</td><td>${row['shareName']}</td><td>${row['isin']}</td></tr>`;
                }
            });
            message += '</table>';
        }

        this._confirmationService.create('Confirm Fund Share Access:', message, {
            confirmText: 'Confirm Access and Save Changes',
            declineText: 'Cancel',
            btnClass: 'primary'
        }).subscribe((ans) => {
            if (ans.resolved) {
                this.saveAccess();
            } else {
                //this.updateFundAccess();
            }
        });
    }

    saveClientReference() {
        const payload = {
            clientReference: this.investorForm.controls['clientReference'].value,
            invitedID: this.currentInvestor.invitedID,
        };
        this._ofiKycService.updateInvestor(payload)
            .then(() => {
                this.toasterService.pop('success', 'Client reference updated');
            })
            .catch(() => {
                this.toasterService.pop('success', 'Failed to update client reference');
            });
    }

    saveAccess() {

        let promises = [];
        let uploadData = {};

        Object.keys(this.access).forEach((key) => {
            if (this.access[key]['newOverride'] && this.access[key]['override']) {
                promises.push(new Promise((resolve, reject) => {
                    const asyncTaskPipe = this.fileService.addFile({
                        files: this.uploadFiles[key],
                    });
                    this._ngRedux.dispatch(SagaHelper.runAsyncCallback(
                        asyncTaskPipe,
                        (function (data) {
                            uploadData[key] = data[1].Data[0][0];
                            resolve();
                        })
                    ));
                }));
            }
            if (this.access[key]['newOverride'] && !this.access[key]['override']) {
                //remove file
                this.access[key]['overrideDocument'] = '';
            }
        });

        Promise.all(promises).then(() => {
            Object.keys(uploadData).forEach((key) => {
                this.access[key]['overrideDocument'] = uploadData[key]['fileHash'];
            });

            this._ofiKycService.saveFundAccess({
                kycID: this.investorData['kycID'],
                investorWalletID: this.investorData['investorWalletID'],
                access: this.access
            }).then(() => {

                // success call back
                this.toasterService.pop('success', 'Share Permissions Saved');

                let recipientsArr = [this.investorData['investorWalletID']];
                let subjectStr = this.amCompany + ' has updated your access';

                let bodyStr = 'Hello ' + this.investorData['firstName'] + ',<br><br>' + this.amCompany + ' has made updates on your access list.';
                bodyStr += '<br><br>Click on the button below to go to the Funds shares page to see all changes and begin trading on IZNES<br><br><a class="btn" href="/#/list-of-funds/0">Start Trading</a><br><br>Thank you,<br><br>The IZNES team.';
                this._messagesService.sendMessage(recipientsArr, subjectStr, bodyStr);
            }, () => {
                // fail call back
                // todo
            });

        });
    }

    setAmKycListRequested(requested) {
        if (!requested) {
            OfiKycService.defaultRequestAmKycList(this._ofiKycService, this._ngRedux);
        }
    }

    getAmKycList(amKycList: any) {
        if (amKycList.length > 0 && amKycList.findIndex((kyc) => kyc.kycID === this.kycId) !== -1) {
            const kyc = amKycList.filter((kyc) => kyc.kycID === this.kycId)[0];
            this.currentInvestor = kyc;
            const phoneNumber = (kyc.investorPhoneCode && kyc.investorPhoneNumber) ? `${kyc.investorPhoneCode} ${kyc.investorPhoneNumber}` : '';
            const approvalDateRequestTs = mDateHelper.dateStrToUnixTimestamp(kyc.lastUpdated, 'YYYY-MM-DD HH:mm:ss');
            const approvalDateRequest = mDateHelper.unixTimestampToDateStr(approvalDateRequestTs, 'DD / MM / YYYY');

            this.investorData = {
                'kycID': kyc.kycID,
                'investorWalletID': kyc.investorWalletID,
                'companyName': kyc.investorCompanyName,
                'firstName': kyc.investorFirstName,
                'lastName': kyc.investorLastName,
                'email': kyc.investorEmail,
                'telephoneNumber': phoneNumber,
                'approvalDate': approvalDateRequest
            };

            this.investorForm.setValue({
                companyName: kyc.investorCompanyName,
                clientReference: kyc.clientReference,
                firstName: kyc.investorFirstName,
                lastName: kyc.investorLastName,
                email: kyc.investorEmail,
                phoneNumber: phoneNumber,
                approvalDateRequest: approvalDateRequest,
            });

            this.amCompany = kyc.companyName;
            this.investorWalletId = kyc.investorWalletID;

            // Get the fund access for investor walletID and render it.
            this._ofiFundShareService.requestInvestorFundAccess({investorWalletId: this.investorWalletId}).then((data) => {
                _.get(data, '[1].Data', []).forEach((row) => {
                    this.investorWalletData[row['shareID']] = row;
                });
                this.updateFundAccess();
            }).catch((e) => {

            });
        }
    }

    requestAllFundShareList(requested: boolean) {

        if (!requested) {
            OfiFundShareService.defaultRequestIznesShareList(this._ofiFundShareService, this._ngRedux);
        }
    }

    updateAllFundShareList(shareData: { [shareId: string]: AllFundShareDetail }) {
        this.tableData = immutableHelper.reduce(shareData, (result, item) => {
            result.push({
                id: item.get('fundShareID', ''),
                fundName: item.get('fundName', ''),
                shareName: item.get('fundShareName', ''),
                isin: item.get('isin', ''),
                max: ((1 + Math.min(item.get('maxRedemptionFee', 0), item.get('maxSubscriptionFee', 0))) * 100 - 100).toFixed(5),
                minInvestment: item.get('minSubsequentSubscriptionInAmount', 0),
            });
            return result;
        }, []);
    }

    updateFundAccess() {
        this.tableData.forEach((row) => {
            this.access[row['id']] = {
                access: !!this.investorWalletData[row['id']],
                changed: false,
                entry: (!!this.investorWalletData[row['id']] ? this.investorWalletData[row['id']]['entryFee'] : 0) / 100000,
                exit: (!!this.investorWalletData[row['id']] ? this.investorWalletData[row['id']]['exitFee'] : 0) / 100000,
                max: row['max'],
                minInvestment: row['minInvestment'],
                override: (!!this.investorWalletData[row['id']] ? (this.investorWalletData[row['id']]['minInvestOverride'] == 1 ? 1 : 0) : false),
                overrideAmount: (!!this.investorWalletData[row['id']] ? this.investorWalletData[row['id']]['minInvestVal'] : 0) / 100000,
                overrideDocument: (!!this.investorWalletData[row['id']] ? this.investorWalletData[row['id']]['minInvestDocument'] : ''),
                overrideDocumentTitle: (!!this.investorWalletData[row['id']] ? this.investorWalletData[row['id']]['fileTitle'] : ''),
                newOverride: false
            };
        });
        this._changeDetectorRef.markForCheck();
    }

    onClickAccess(item) {
        item['access'] = !item['access'];
        item['changed'] = !item['changed'];

        if (!item['access']) {
            item['entry'] = 0;
            item['exit'] = 0;
            item['override'] = false;
        }
    }

    checkFee(id, type) {
        if (isNaN(parseFloat(this.access[id][type])) || !isFinite(this.access[id][type])) this.access[id][type] = 0;
        this.access[id][type] = Math.round((this.access[id][type]) * 10000) / 10000;
        if (this.access[id][type] < 0) this.access[id][type] = 0;
        if (this.access[id][type] > this.access[id]['max']) this.access[id][type] = this.access[id]['max'];
    }

    openOverrideModal(id) {
        this.currentOverride = id;
        this.showOverrideModal = true;
    }

    closeOverrideModal(type) {

        if (type == 1) {
            this.access[this.currentOverride]['newOverride'] = true;
            this.access[this.currentOverride]['override'] = true;
            this.access[this.currentOverride]['overrideAmount'] = this.newOverride['amount'];
        }
        if (type == 2) {
            this.access[this.currentOverride]['newOverride'] = true;
            this.access[this.currentOverride]['override'] = false;
            this.access[this.currentOverride]['overrideAmount'] = 0;
        }

        if (type != 0) {
            if (type == 2 || this.newOverride['document'].length == 0) {
                this.access[this.currentOverride]['overrideDocumentTitle'] = '';
                this.uploadFiles[this.currentOverride] = {};
            } else {
                this.access[this.currentOverride]['overrideDocumentTitle'] = this.newOverride['document'][0]['name'];
                this.uploadFiles[this.currentOverride] = this.newOverride['document'];
            }
        }


        this.newOverride = {
            amount: 0,
            document: ''
        };
        this.currentOverride = 0;
        this.showOverrideModal = false;
    }

    onDropFiles(event) {
        this.newOverride['document'] = _.filter(event.files, function (file) {
            return file.status !== 'uploaded-file';
        });
    }
}
