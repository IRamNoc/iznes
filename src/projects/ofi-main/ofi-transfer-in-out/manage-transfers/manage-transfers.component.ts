import * as _ from 'lodash';
import * as moment from 'moment';
/* Core/Angular imports. */
import {
    ChangeDetectorRef,
    Component,
    OnDestroy,
    Input,
    OnInit,
    ViewChild,
    Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs';
import { LogService } from '@setl/utils';
import { MultilingualService } from '@setl/multilingual';
import { DatagridParams } from './datagrid-params';
import { ofiManageTransferActions } from '../../ofi-store';
import { TransferInOutService } from '../transfer-in-out.service';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import { PermissionsService } from '@setl/utils/services/permissions';
import { ToasterService, Toast } from 'angular2-toaster';
/* Clarity */
import { ClrDatagridStateInterface } from '@clr/angular';

import { getMyDetail } from '@setl/core-store';
import { MessagesService } from '@setl/core-messages/index';

@Component({
    selector: 'app-manage-transfers',
    templateUrl: './manage-transfers.component.html',
    styleUrls: ['./manage-transfers.component.scss'],
})
export class ManageTransfersComponent implements OnInit, OnDestroy {
    toastTimer;
    timerToast: Toast;
    toasterConfig: any = {
        type: 'warning',
        title: '',
        timeout: 0,
        tapToDismiss: false,
    };
    searchForm: FormGroup;
    transferListItems: any[];
    currencyList: any[];
    subscriptions: Array<Subscription> = [];
    public showColumnSpacer: boolean = true;

    @Input() isImported: boolean;
    @Input() linkRoute: string;
    @ViewChild('transferDataGrid') transferDatagrid: any;

    /* Datagrid server driven */
    total: number;
    lastPage: number;
    readonly itemPerPage = 10;
    rowOffset = 0;
    private datagridParams: DatagridParams;
    loading = true;
    isConfirmModalDisplayed = false;
    isDetailModalDisplayed = false;
    confirmModal = {};
    detailModal = {};

    // Locale
    language = 'en';
    updateTransferFormGroup: FormGroup;
    canUpdateBtn: boolean = false;
    userType = '';
    hasPermissionUpdate: boolean = false;
    hasPermissionCancel: boolean = false;
    hasPermissionInsert: boolean = false;
    updatePermission: boolean = false;
    confirmBtnState: boolean = false;
    validateBtnState: boolean = false;

    transferStatusListItems: object = ['pending', 'validated'];

    /** Date */
    datePickerConfig: object;
    fundAdministratorItems: any;

    @select(['ofi', 'ofiCurrencies', 'currencies']) currenciesObs;
    @select(['ofi', 'ofiTransfers', 'manageTransfers', 'transferList']) transferObs;
    @select(['user', 'myDetail']) myDetailsOb;

    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private redux: NgRedux<any>,
                private logService: LogService,
                private transferService: TransferInOutService,
                public translate: MultilingualService,
                private ofiCurrenciesService: OfiCurrenciesService,
                public permissionsService: PermissionsService,
                private toaster: ToasterService,
                private messagesService: MessagesService,
                @Inject('product-config') productConfig,
                ) {
        this.fundAdministratorItems = productConfig.fundItems.fundAdministratorItems;
        this.initDatePickerConfig();
        this.ofiCurrenciesService.getCurrencyList();
        this.subscriptions.push(this.currenciesObs.subscribe(c => this.getCurrencyList(c)));
    }

    ngOnInit() {
        const currentState = this.redux.getState();
        this.userType = getMyDetail(currentState).userTypeStr;
        this.initForm();
        this.datagridParams = new DatagridParams(this.itemPerPage);

        // Get all permissions parameters
        this.permissionsService.hasPermission('manageTransferI/O', 'canUpdate').then(
            hasPermission => this.hasPermissionUpdate = hasPermission);
        this.permissionsService.hasPermission('manageTransferI/O', 'canInsert').then(
            hasPermission => this.hasPermissionInsert = hasPermission);
        this.permissionsService.hasPermission('manageTransferI/O', 'canDelete').then(
            hasPermission => this.hasPermissionCancel = hasPermission);

        this.transferService.defaultRequestManageTransfersList({ itemPerPage: this.itemPerPage, rowOffset: this.rowOffset });
        this.subscriptions.push(
            this.transferObs.subscribe(transfers => this.transferListItems = this.transferObjectToList(transfers)));
    }

    // Trigger refresh function when sort or page change is triggered on transfer list table
    refresh(state: ClrDatagridStateInterface) {
        if (!state.page)
            return;

        if(state.page.from !== this.rowOffset) {
            this.rowOffset = state.page.from;
            this.transferService.defaultRequestManageTransfersList({ itemPerPage: this.itemPerPage, rowOffset: this.rowOffset });
            this.transferService.setOrderListPage(state.page.from / state.page.size + 1);
        }

        if (state.sort)
            this.transferListItems = _.orderBy(this.transferListItems, [state.sort.by], [state.sort.reverse ? 'asc' : 'desc']);

        this.datagridParams.applyState(state);
    }

    // Converts Transfer List Object to Array
    transferObjectToList(listTransfer) {
        let transfers = _.toArray(listTransfer).map((transfer) => {
            const referenceID = transfer.referenceID;
            const externalReference = transfer.externalReference;
            const accountKeeper = _.find(this.fundAdministratorItems, { id: transfer.accountKeeperID }).text;
            const transferDirection = transfer.transferDirection;
            const assetManagementCompany = transfer.assetManagementCompanyName;
            const investorCompany = transfer.investorCompanyName;
            const investorWallet = transfer.accountLabel;
            const shareISIN = transfer.fundShareISIN;
            const shareName = transfer.fundShareName;
            const currency = this.currencyList[transfer.currency]['text'] || 'EUR';
            const quantity = transfer.quantity;
            const unitPrice = transfer.price;
            const amount = quantity * unitPrice;
            const theoricalDate = moment(transfer.theoricalDate).format('YYYY-MM-DD');
            const transferStatus = transfer.transferStatus;
            const dateEntered = transfer.dateEntered;
            const comment = transfer.comment;
            const totalResult = transfer.totalResult;

            return {
                referenceID,
                externalReference,
                accountKeeper,
                transferDirection,
                assetManagementCompany,
                investorCompany,
                investorWallet,
                shareISIN,
                shareName,
                currency,
                quantity,
                unitPrice,
                amount,
                theoricalDate,
                transferStatus,
                dateEntered,
                comment,
                totalResult,
            };
        });

        // Sorting transfer by refrenceID DESC by default
        transfers = _.orderBy(transfers, ['referenceID'], ['desc']);

        // set how many pages will be for handle paginatin
        this.total = _.get(transfers, '[0].totalResult', 0);
        ofiManageTransferActions.setTotalResults(this.total);
        this.lastPage = Math.ceil(this.total / this.itemPerPage);
        this.detectChanges(true);
        this.loading = false;
        return transfers;
    }

    initDatePickerConfig() {
        this.datePickerConfig = {
            firstDayOfWeek: 'mo',
            format: 'YYYY-MM-DD',
            closeOnSelect: true,
            disableKeypress: true,
            locale: this.language,
        };
    }

    initForm() {
        this.updateTransferFormGroup = this.fb.group({
            quantity: [{ value: 0, disabled: !this.updatePermission }, Validators.required],
            unitPrice: [{ value: 0, disabled: !this.updatePermission }, Validators.required],
            theoricalDate: [{ value: '', disabled: !this.updatePermission }, Validators.required],
            initialDate: [{ value: '', disabled: !this.updatePermission }, Validators.required],
            transferStatus: [{ value: '', disabled: !this.updatePermission }, Validators.required],
            externalReference: [{ value: '', disabled: !this.updatePermission }],
            comment: [{ value: '', disabled: !this.updatePermission }],
        });

        // update amount on quantity input change
        this.updateTransferFormGroup.get('quantity').valueChanges.subscribe((value: number) => {
            this.detailModal['amount'] = value * this.updateTransferFormGroup.controls['unitPrice'].value;
        });

        // update amount on price input change
        this.updateTransferFormGroup.get('unitPrice').valueChanges.subscribe((value: number) => {
            this.detailModal['amount'] = value * this.updateTransferFormGroup.controls['quantity'].value;
        });

        // after change, check if form is valid
        this.updateTransferFormGroup.valueChanges.subscribe(() => {
            this.canUpdateBtn = this.updateTransferFormGroup.valid;
        });
    }

    updateForm(transfer) {
        this.updateTransferFormGroup.controls['quantity'].setValue(transfer.quantity);
        this.updateTransferFormGroup.controls['unitPrice'].setValue(transfer.unitPrice);
        this.updateTransferFormGroup.controls['theoricalDate'].setValue(moment(transfer.theoricalDate));
        this.updateTransferFormGroup.controls['initialDate'].setValue(moment(transfer.initialDate));
        this.updateTransferFormGroup.controls['externalReference'].setValue(transfer.externalReference);
        this.updateTransferFormGroup.controls['comment'].setValue(transfer.comment);
        this.updateTransferFormGroup.controls['transferStatus'].setValue(transfer.transferStatus);
        this.updatePermission ? this.updateTransferFormGroup.enable() : this.updateTransferFormGroup.disable();
    }

    cancelTransfer(index) {
        const referenceId = this.transferListItems[index].referenceID;

        this.isConfirmModalDisplayed = true;
        this.confirmModal = {
            targetedTransfer: this.transferListItems[index],
            title: `${this.translate.translate(`Cancel transfer #${referenceId}`)}`,
            body: `${this.translate.translate('Are you sure you want to cancel this transfer ?')}`,
        };
    }

    resetConfirmModalValue() {
        this.isConfirmModalDisplayed = false;
        this.confirmModal = {};
    }

    // Function is triggered when iznesadmin user wants to cancel a transfer and confirm with modal his transfer cancellation
    handleModalConfirmButtonClick(targetedTransfer) {
        this.transferService.defaultRequestCancelTransfer(
            targetedTransfer.referenceID,
            (response) => {
                this.logService.log('cancel transfer success'); // success
                this.toaster.pop('success', `${this.translate.translate('Your transfer I/O has been succesfully cancelled.')}`);
                this.resetConfirmModalValue();

                const data = _.get(response, '[1].Data[0]',null);

                const recipientsArr = [data.investorWalletID, data.amWalletID];
                const subjectStr = this.translate.translate(
                    'TRANSFER CANCELLATION #@referenceID@', { referenceID: data.referenceID }
                );

                const bodyStr = `
                ${this.translate.translate(
                    'Hello, transfer order #@referenceID@ has been cancelled without your prior approval. This operation is definitively cancelled and will not impact Iznes registry', { referenceID: data.referenceID })}.
                    <br><br>
                    ${this.translate.translate('Thank you')},
                    <br><br>${this.translate.translate('The IZNES team')}
                `;

                this.messagesService.sendMessage(recipientsArr, subjectStr, bodyStr);
            },
            (data) => {
                this.logService.log('Error: ', data);
                this.toaster.pop('error', `${this.translate.translate('Your transfer I/O has not been cancelled.')}`);
                this.resetConfirmModalValue();
            });
    }

    // opens modal to get transfer informations // when a user have update permission rights, he can modify some informations if transfer has "pending" status
    openTransferDetails(index) {
        this.detailModal = { ... this.transferListItems[index] };
        this.detailModal['dateEntered'] = moment(this.detailModal['dateEntered'].dateEntered).format('YYYY-MM-DD');
        if (!this.hasPermissionUpdate || this.detailModal['transferStatus'] !== 'pending') {
            this.updatePermission = false;
        } else {
            this.updatePermission = true;
        }
        this.updateForm(this.detailModal);
        this.isDetailModalDisplayed = true;
    }

    handleDropdownTransferStatusSelect(event) {
        this.detailModal['transferStatus'] = event.text;
    }

    resetDetailModalValue() {
        this.isDetailModalDisplayed = false;
        this.detailModal = {};
        this.updateTransferFormGroup.controls['quantity'].setValue('');
        this.updateTransferFormGroup.controls['unitPrice'].setValue('');
        this.updateTransferFormGroup.controls['theoricalDate'].setValue('');
        this.updateTransferFormGroup.controls['initialDate'].setValue('');
        this.updateTransferFormGroup.controls['externalReference'].setValue('');
        this.updateTransferFormGroup.controls['comment'].setValue('');
        this.updateTransferFormGroup.controls['transferStatus'].setValue('');
    }
    
    handleModalUpdateButtonClick(referenceId) {
        const request = {
            referenceID: referenceId,
            price: this.updateTransferFormGroup.controls['unitPrice'].value,
            quantity: this.updateTransferFormGroup.controls['quantity'].value,
            theoricalDate: moment(this.updateTransferFormGroup.controls['theoricalDate'].value)
                .format('YYYY-MM-DD HH:mm:ss'),
            initialDate: moment(this.updateTransferFormGroup.controls['initialDate'].value)
                .format('YYYY-MM-DD HH:mm:ss'),
            externalReference: this.updateTransferFormGroup.controls['externalReference'].value,
            comment: this.updateTransferFormGroup.controls['comment'].value || '',
            transferStatus: this.detailModal['transferStatus'],
        };

        this.transferService.defaultRequestUpdateTransfer(
            request,
            (data) => {
                this.logService.log('update transfer success', data);
                this.toaster.pop('success', `${this.translate.translate('Your transfer I/O has been succesfully updated.')}`);
                this.resetDetailModalValue();
            },
            (data) => {
                this.logService.log('Error: ', data);
                this.toaster.pop('error', `${this.translate.translate('Your transfer I/O has not been updated.')}`);
                this.resetDetailModalValue();
            });
    }

    confirmTransfer(index) {
        this.confirmBtnState = true;

        this.transferService.defaultRequestConfirmTransfer(
            this.transferListItems[index].referenceID,
            (response) => {
                this.logService.log('confirm transfer success');
                this.toaster.pop('success', 'Your transfer I/O has been succesfully confirmed.');
                this.confirmBtnState = false;

                const data = _.get(response, '[1].Data[0]',null);
                const recipientsArr = [data.investorWalletID, data.amWalletID];
                const subjectStr = this.translate.translate(
                    'TAKING TRANSFER #@referenceID@ INTO ACCOUNT', { referenceID: data.referenceID }
                );

                const bodyStr = `
                ${this.translate.translate(
                    'Hello, transfer order #@referenceID@ has been definitively taken into account under the Iznes registry', { referenceID: data.referenceID })}.
                    <br><br>
                    ${this.translate.translate('Thank you')},
                    <br><br>${this.translate.translate('The IZNES team')}
                `;

                this.messagesService.sendMessage(recipientsArr, subjectStr, bodyStr);
            },
            (data) => {
                this.logService.log('Error: ', data);
                this.toaster.pop('error', `${this.translate.translate('Your transfer I/O has not been confirmed.')}`);
                this.confirmBtnState = false;
            });
    }

    validateTransfer(index) {
        this.validateBtnState = true;

        this.transferService.defaultRequestValidateTransfer(
            this.transferListItems[index].referenceID,
            (response) => {
                this.logService.log('validate transfer success');
                this.toaster.pop('success', `${this.translate.translate('Your transfer I/O has been succesfully validated.')}`);
                this.validateBtnState = false;

                const data = _.get(response, '[1].Data[0]',null);
   
                const recipientsArr = [data.investorWalletID, data.amWalletID];
                const subjectStr = this.translate.translate(
                    'VALIDATION OF TRANSFER #@referenceID@', { referenceID: data.referenceID }
                );

                const bodyStr = `
                ${this.translate.translate(
                    'Hello, transfer order #@referenceID@ has been released. Please note transfer need to be confirmed to be taken into account under the Iznes registry', { referenceID: data.referenceID })}.
                    <br><br>%@link@%<br><br>
                    ${this.translate.translate('Thank you')},
                    <br><br>${this.translate.translate('The IZNES team')}
                `;

                const action = {
                    type: 'messageWithLink',
                    data: {
                        links: [
                            {
                                link: '/#/transfer-in-out',
                                anchorCss: 'btn',
                                anchorText: this.translate.translate('View transfers'),
                            },
                        ],
                    },
                };

                this.messagesService.sendMessage(recipientsArr, subjectStr, bodyStr, action as any);
            },
            (data) => {
                this.logService.log('Error: ', data);
                this.toaster.pop('error', `${this.translate.translate('Your transfer I/O has not been validated.')}`);
                this.validateBtnState = false;
            });
    }

    /**
     * Returns a single line of text to space the datagrid column correctly
     * Strips all non-alphanumeric characters and replaces them with '_'
     * @param text
     */
    public getColumnSpaceText(text: string) {
        return typeof text === 'string' ? text.replace(/[\W_]+/g, '_') : text;
    }

    /**
     * Get the list of currencies from redux
     *
     * @param {Object[]} data
     * @memberof OfiNavFundView
     */
    getCurrencyList(data) {
        if (data) {
            this.currencyList = data.toJS();
        }
    }

    /**
     * Resizes the datagrid and removes the spacer elements
     * The column space elements are a bit of a hack to get the Datagrid to correctly set the cell size
     * hopefully this will be fixed in a Clarity update soon...
     */
    public resizeDatagridRemoveSpacers() {
        if (this.transferDatagrid) {
            setTimeout(
                () => {
                    this.transferDatagrid.resize();
                    this.showColumnSpacer = false;
                },
                1000,
            );
        }
    }

    detectChanges(detect = false) {
        this.cdr.markForCheck();
        if (detect) {
            this.cdr.detectChanges();
        }
    }

    ngOnDestroy(): void {
        this.cdr.detach();
        this.subscriptions.map(subscription => subscription.unsubscribe());
    }
}
