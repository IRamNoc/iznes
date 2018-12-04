/* Core/Angular imports. */
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component, EventEmitter,
    Input, Output, ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import * as _ from 'lodash';
import { ConfirmationService, SagaHelper } from '@setl/utils/index';
import { FileService } from '@setl/core-req-services';
import { NgRedux } from '@angular-redux/store';
import { ToasterService } from 'angular2-toaster';
import { OfiKycService } from '@ofi/ofi-main/ofi-req-services/ofi-kyc/service';
import { MessagesService } from '@setl/core-messages/index';
import { MultilingualService } from '@setl/multilingual';

const DIVIDER_NUMBER = 100000;

@Component({
    selector: 'access-table',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
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
    constructor(private location: Location,
                private confirmationService: ConfirmationService,
                private ngRedux: NgRedux<any>,
                private toasterService: ToasterService,
                private messagesService: MessagesService,
                private ofiKycService: OfiKycService,
                private changeDetectorRef: ChangeDetectorRef,
                private translate: MultilingualService,
                private fileService: FileService,
    ) {
    }

    onClickAccess(id) {
        const index = this.tableData.findIndex(i => i.id === Number(id));

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
        const index = this.tableData.findIndex(i => i.id === Number(id));

        if (isNaN(parseFloat(this.tableData[index][type])) || !isFinite(this.tableData[index][type])) this.tableData[index][type] = 0;
        this.tableData[index][type] = Math.round((this.tableData[index][type]) * DIVIDER_NUMBER) / DIVIDER_NUMBER;
        if (this.tableData[index][type] < 0) this.tableData[index][type] = 0;
        if (this.tableData[index][type] > this.tableData[index]['max']) this.tableData[index][type] = this.tableData[index]['max'];
        this.updateChanges('fees');
    }

    openOverrideModal(id) {
        this.currentOverride = id;
        this.showOverrideModal = true;
    }

    /**
     * Close override modal
     *
     * @param {number} type
     */
    closeOverrideModal(type: number) {
        if (type === 1) {
            this.tableData[this.currentOverride]['newOverride'] = true;
            this.tableData[this.currentOverride]['override'] = true;
            this.tableData[this.currentOverride]['overrideAmount'] = this.newOverride['amount'];
        }
        if (type === 2) {
            this.tableData[this.currentOverride]['newOverride'] = true;
            this.tableData[this.currentOverride]['override'] = false;
            this.tableData[this.currentOverride]['overrideAmount'] = 0;
        }

        if (type !== 0) {
            if (type === 2 || this.newOverride['document'].length === 0) {
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
            if (this.oldTableData[key]['access'] !== this.tableData[key]['access']) {
                change = this.changeTypes[(this.tableData[key]['access'] ? 1 : 2)];
            }
            if (this.oldTableData[key]['entry'] !== this.tableData[key]['entry'] ||
                this.oldTableData[key]['exit'] !== this.tableData[key]['exit']) {
                change += (change !== '' ? ', ' : '') + this.changeTypes[3];
            }
            if (this.oldTableData[key]['newOverride'] !== this.tableData[key]['newOverride']) {
                change += (change !== '' ? ', ' : '') + this.changeTypes[4];
            }
            if (change !== '') {
                this.changes.push({
                    id: this.oldTableData[key].id,
                    isin: this.oldTableData[key].isin,
                    fundName: this.oldTableData[key].fundName,
                    shareName: this.oldTableData[key].shareName,
                    changes: change,
                });
            }
        });
        this.changeDetectorRef.markForCheck();
    }

    backBtn() {
        this.back.emit();
    }

    confirmSave() {
        const message = (Object.keys(this.changes).length === 0
            ? this.translate.translate('No changes have been made to the Investors\' Fund Access permissions.')
            : this.translate.translate('Please confirm the changes made to the Investors\' Fund Access permissions.')
        );

        this.confirmationService.create(this.translate.translate('Confirm Fund Share Access'), message, {
            confirmText: this.translate.translate('Confirm Access and Save Changes'),
            declineText: this.translate.translate('Cancel'),
            btnClass: 'primary',
        }).subscribe((ans) => {
            if (ans.resolved) {
                this.saveData();
            }
        });
    }

    saveData() {
        const changedData = this.tableData.filter(i => this.changes.findIndex(j => j.id === Number(i.id)) > -1);
        const promises = [];
        const uploadData = {};

        Object.keys(changedData).forEach((key) => {
            if (changedData[key]['newOverride'] && changedData[key]['override']) {
                changedData[key]['overrideAmount'] = changedData[key]['overrideAmount'].replace(/\s+/g, '');

                promises.push(new Promise((resolve, reject) => {
                    if (_.isEmpty(this.uploadFiles[key])) {
                        resolve();
                        return;
                    }

                    const asyncTaskPipe = this.fileService.addFile({
                        files: this.uploadFiles[key],
                    });
                    this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
                        asyncTaskPipe,
                        ((data) => {

                            uploadData[key] = data[1].Data[0][0];
                            resolve();
                        }),
                    ));
                }));
            }
            if (changedData[key]['newOverride'] && !changedData[key]['override']) {
                // remove file
                changedData[key]['overrideDocument'] = '';
            }
        });

        Promise.all(promises).then(() => {
            Object.keys(uploadData).forEach((key) => {
                changedData[key]['overrideDocument'] = uploadData[key]['fileHash'];
            });

            this.ofiKycService.saveFundAccess({
                access: changedData,
            }).then(() => {
                // success call back
                this.toasterService.pop(
                    'success',
                    this.translate.translate(
                        '@investorName@\'s shares authorisation has been successfully updated',
                        { 'investorName': this.getInvestorCompanyName() },
                    ),
                );

                console.error(this.investorData['investorWalletID']);

                const recipientsArr = [this.investorData['investorWalletID']];
                const subjectStr = this.translate.translate(
                    '@amCompany@ has updated your access',
                    { 'amCompany': this.amCompany },
                );

                const bodyStr = `
                    ${this.translate.translate(
                        'Hello @investorFirstName@, @amCompany@ has made updates on your access list', { 'investorFirstName': this.getInvestorFirstName(), 'amCompany': this.amCompany })}.
                        <br><br>
                        ${this.translate.translate('Click on the button below to go to the Funds shares page to see all changes and begin trading on IZNES')}.
                        <br><br>%@link@%<br><br>
                        ${this.translate.translate('Thank you')},
                        <br><br>${this.translate.translate('The IZNES team')}.
                `;

                const action = {
                    type: 'messageWithLink',
                    data: {
                        links: [
                            {
                                link: '/#/list-of-funds/0',
                                anchorCss: 'btn',
                                anchorText: this.translate.translate('Start Trading'),
                            },
                        ],
                    },
                };

                this.messagesService.sendMessage(recipientsArr, subjectStr, bodyStr, action as any);

                this.backBtn();
            }, () => {
                // fail call back
                // todo
            });
        });
    }

    /**
     * Get investor company name
     * If portfolio manager, we return wallet.
     * @return {string}
     */
    getInvestorCompanyName() {
        const investorCompanyName = this.investorData['companyName'];
        return investorCompanyName ? investorCompanyName : this.getInvestorWalletName();
    }

    /**
     * Get investor company name
     * If portfolio manager, we return wallet.
     * @return {string}
     */
    getInvestorFirstName() {
        const investorFirstName = this.investorData['firstName'];
        return investorFirstName ? investorFirstName : this.getInvestorWalletName();
    }

    /**
     * Get investor wallet name.
     * @return {string}
     */
    getInvestorWalletName() {
        return this.investorData['investorWalletName'];
    }
}
