/* Core/Angular imports. */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, EventEmitter,
    Input, Output, ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { ConfirmationService, SagaHelper } from '@setl/utils';
import { FileService } from '@setl/core-req-services';
import { NgRedux } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import { OfiKycService } from "@ofi/ofi-main/ofi-req-services/ofi-kyc/service";
import { MessagesService } from "@setl/core-messages/index";
import { Datagrid } from '@clr/angular';

/* Redux */


@Component({
    selector: 'access-table',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiFundAccessTable {

    tableData: any;
    oldTableData: any;

    @Input() set tableDataArr(tableData) {
        this.tableData = tableData;
        this.oldTableData = JSON.parse(JSON.stringify(tableData));
    }

    investorData = {};
    amCompany = '';

    @Input() set otherData(data) {
        this.investorData = data['investorData'];
        this.amCompany = data['amCompany'];
    }

    @Output() back: EventEmitter<any> = new EventEmitter();

    changes = [];
    showOverrideModal = false;
    currentOverride: number = 0;
    newOverride = {
        amount: 0,
        document: '',
    };
    uploadFiles = {};

    changeTypes = {
        1: 'Permission Granted',
        2: 'Permission Removed',
        3: 'Fees Changed',
        4: 'Override Changed',
    };

    /* Constructor. */
    constructor(private _location: Location,
                private _confirmationService: ConfirmationService,
                private _ngRedux: NgRedux<any>,
                private toasterService: ToasterService,
                private _messagesService: MessagesService,
                private _ofiKycService: OfiKycService,
                private _changeDetectorRef: ChangeDetectorRef,
                private fileService: FileService) {

    }

    onClickAccess(id) {
        let index = this.tableData.findIndex((i) => i.id == id);

        this.tableData[index]['access'] = !this.tableData[index]['access'];
        this.tableData[index]['accessChanged'] = !this.tableData[index]['accessChanged'];

        if (!this.tableData[index]['access']) {
            this.tableData[index]['entry'] = this.oldTableData[index]['entry'];
            this.tableData[index]['exit'] = this.oldTableData[index]['exit'];
            this.tableData[index]['newOverride'] = this.oldTableData[index]['newOverride'];
        }

        this.updateChanges('access');
    }

    checkFee(id, type) {
        let index = this.tableData.findIndex((i) => i.id == id);

        if (isNaN(parseFloat(this.tableData[index][type])) || !isFinite(this.tableData[index][type])) this.tableData[index][type] = 0;
        this.tableData[index][type] = Math.round((this.tableData[index][type]) * 10000) / 10000;
        if (this.tableData[index][type] < 0) this.tableData[index][type] = 0;
        if (this.tableData[index][type] > this.tableData[index]['max']) this.tableData[index][type] = this.tableData[index]['max'];
        this.updateChanges('fees');
    }

    openOverrideModal(id) {
        this.currentOverride = id;
        this.showOverrideModal = true;
    }

    closeOverrideModal(type) {

        if (type == 1) {
            this.tableData[this.currentOverride]['newOverride'] = true;
            this.tableData[this.currentOverride]['override'] = true;
            this.tableData[this.currentOverride]['overrideAmount'] = this.newOverride['amount'];
        }
        if (type == 2) {
            this.tableData[this.currentOverride]['newOverride'] = true;
            this.tableData[this.currentOverride]['override'] = false;
            this.tableData[this.currentOverride]['overrideAmount'] = 0;
        }

        if (type != 0) {
            if (type == 2 || this.newOverride['document'].length == 0) {
                this.tableData[this.currentOverride]['overrideDocumentTitle'] = '';
                this.uploadFiles[this.currentOverride] = {};
            } else {
                this.tableData[this.currentOverride]['overrideDocumentTitle'] = this.newOverride['document'][0]['name'];
                this.uploadFiles[this.currentOverride] = this.newOverride['document'];
            }
            this.updateChanges('overrides');
        }


        this.newOverride = {
            amount: 0,
            document: '',
        };
        this.currentOverride = 0;
        this.showOverrideModal = false;
    }

    onDropFiles(event) {
        this.newOverride['document'] = _.filter(event.files, (file) => {
            return file.status !== 'uploaded-file';
        });
    }

    updateChanges(type) {
        this.changes = [];
        Object.keys(this.oldTableData).forEach((key) => {
            let change = '';
            if (this.oldTableData[key]['access'] != this.tableData[key]['access']) {
                change = this.changeTypes[(this.tableData[key]['access'] ? 1 : 2)];
            }
            if (this.oldTableData[key]['entry'] != this.tableData[key]['entry'] ||
                this.oldTableData[key]['exit'] != this.tableData[key]['exit']) {
                change += (change != '' ? ', ' : '') + this.changeTypes[3];
            }
            if (this.oldTableData[key]['newOverride'] != this.tableData[key]['newOverride']) {
                change += (change != '' ? ', ' : '') + this.changeTypes[4];
            }
            if (change != '') {
                this.changes.push({
                    id: this.oldTableData[key].id,
                    isin: this.oldTableData[key].isin,
                    fundName: this.oldTableData[key].fundName,
                    shareName: this.oldTableData[key].shareName,
                    changes: change,
                });
            }
        });
        this._changeDetectorRef.markForCheck();
    }

    backBtn() {
        this.back.emit();
    }

    confirmSave() {
        let message = (Object.keys(this.changes).length == 0 ?
                'No changes have been made to the Investors\' Fund Access permissions.'
                :
                'Please confirm the changes made to the Investors\' Fund Access permissions.'
        );

        this._confirmationService.create('Confirm Fund Share Access:', message, {
            confirmText: 'Confirm Access and Save Changes',
            declineText: 'Cancel',
            btnClass: 'primary'
        }).subscribe((ans) => {
            if (ans.resolved) {
                this.saveData();
            }
        });
    }

    saveData() {

        let changedData = this.tableData.filter((i) => this.changes.findIndex((j) => j.id == i.id) > -1);

        let promises = [];
        let uploadData = {};

        Object.keys(changedData).forEach((key) => {
            if (changedData[key]['newOverride'] && changedData[key]['override']) {
                promises.push(new Promise((resolve, reject) => {

                    if (_.isEmpty(this.uploadFiles[key])) {
                        resolve();
                        return;
                    }

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
            if (changedData[key]['newOverride'] && !changedData[key]['override']) {
                //remove file
                changedData[key]['overrideDocument'] = '';
            }
        });

        Promise.all(promises).then(() => {
            Object.keys(uploadData).forEach((key) => {
                changedData[key]['overrideDocument'] = uploadData[key]['fileHash'];
            });

            this._ofiKycService.saveFundAccess({
                access: changedData
            }).then(() => {

                // success call back
                this.toasterService.pop('success', this.investorData['companyName'] + '\'s shares authorisation has been successfully updated');

                let recipientsArr = [this.investorData['investorWalletID']];
                let subjectStr = this.amCompany + ' has updated your access';

                let bodyStr = 'Hello ' + this.investorData['firstName'] + ',<br><br>' + this.amCompany + ' has made updates on your access list.';
                bodyStr += '<br><br>Click on the button below to go to the Funds shares page to see all changes and begin trading on IZNES<br><br><a class="btn" href="/#/list-of-funds/0">Start Trading</a><br><br>Thank you,<br><br>The IZNES team.';
                this._messagesService.sendMessage(recipientsArr, subjectStr, bodyStr);

                this.backBtn();
            }, () => {
                // fail call back
                // todo
            });

        });

    }

}
