import * as _ from 'lodash';
import * as moment from 'moment';
/* Core/Angular imports. */
import {
    AfterViewInit,
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
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, combineLatest as observableCombineLatest, Subscription, zip } from 'rxjs';
import { LogService } from '@setl/utils';
import { MultilingualService } from '@setl/multilingual';
import { DatagridParams } from './datagrid-params';
import { TransferInOutService } from '../transfer-in-out.service';
import { OfiCurrenciesService } from '@ofi/ofi-main/ofi-req-services/ofi-currencies/service';
import { PermissionsService } from '@setl/utils/services/permissions';
import { ToasterService, Toast } from 'angular2-toaster';
/* Clarity */
import { ClrDatagridStateInterface } from '@clr/angular';

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
    hasPermissionUpdate: boolean = false;
    hasPermissionCancel: boolean = false;
    updatePermission: boolean = false;

    transferStatusListItems: object = ['pending', 'validated'];

    /** Date */
    datePickerConfig: object;
    fundAdministratorItems: any;

    @select(['ofi', 'ofiCurrencies', 'currencies']) currenciesObs;
    @select(['ofi', 'ofiTransfers', 'manageTransfers', 'transferList']) transferObs;
    @select(['ofi', 'ofiTransfers', 'manageTransfers', 'totalResults']) readonly totalResults$: Observable<number>;

    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private router: Router,
                private redux: NgRedux<any>,
                private logService: LogService,
                private transferService: TransferInOutService,
                public translate: MultilingualService,
                private ofiCurrenciesService: OfiCurrenciesService,
                public permissionsService: PermissionsService,
                private toaster: ToasterService,
                private route: ActivatedRoute,
                @Inject('product-config') productConfig,
                ) {
        this.fundAdministratorItems = productConfig.fundItems.fundAdministratorItems;
        this.initDatePickerConfig();
        this.ofiCurrenciesService.getCurrencyList();
        this.subscriptions.push(this.currenciesObs.subscribe(c => this.getCurrencyList(c)));
    }

    appSubscribe<T>(
        obs: Observable<T>,
        next?: (value: T) => void,
        error?: (error: any) => void,
        complete?: () => void,
    )
    { }

    ngOnInit() {
        this.initForm();
        this.datagridParams = new DatagridParams(this.itemPerPage);

        this.permissionsService.hasPermission('manageTransferI/O', 'canUpdate').then(
            hasPermission => this.hasPermissionUpdate = hasPermission);
        this.permissionsService.hasPermission('manageTransferI/O', 'canDelete').then(
            hasPermission => this.hasPermissionCancel = hasPermission);
        this.transferService.defaultRequestManageTransfersList();
        this.subscriptions.push(
            this.transferObs.subscribe(transfers => this.transferListItems = this.transferObjectToList(transfers)));
        this.appSubscribe(this.totalResults$, (total) => {
            console.log(total);
            this.total = total;
            this.lastPage = Math.ceil(this.total / this.itemPerPage);
            this.detectChanges(true);
        });
    }

    refresh(state: ClrDatagridStateInterface) {

        if (!state.page) {
            return;
        }

        this.transferService.setOrderListPage(state.page.from / state.page.size + 1);
        this.datagridParams.applyState(state);
    }

    transferObjectToList(listTransfer) {
        this.loading = false;

        return _.toArray(listTransfer).map((transfer) => {
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
            };
        });
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
            title: `Cancel transfer #${referenceId}`,
            body: 'Are you sure you want to cancel this transfer ?',
        };
    }

    resetConfirmModalValue() {
        this.isConfirmModalDisplayed = false;
        this.confirmModal = {};
    }

    handleModalConfirmButtonClick(targetedTransfer) {
        this.transferService.defaultRequestCancelTransfer(
            targetedTransfer.referenceID,
            (data) => {
                this.logService.log('cancel transfer success', data); // success
                this.toaster.pop('success', 'Your transfer I/O has been succesfully cancelled.');
                this.resetConfirmModalValue();
            },
            (data) => {
                this.logService.log('Error: ', data);
                this.toaster.pop('error', 'Your transfer I/O has not been cancelled.');
                this.resetConfirmModalValue();
            });
    }

    openTransferDetails(index) {
        this.detailModal = { ... this.transferListItems[index] };
        this.detailModal['dateEntered'] = moment(this.detailModal['dateEntered'].dateEntered).format('YYYY-MM-DD');
        if (this.detailModal['transferStatus'] !== 'pending' || !this.hasPermissionUpdate) {
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
                this.toaster.pop('success', 'Your transfer I/O has been succesfully updated.');
                this.resetDetailModalValue();
            },
            (data) => {
                this.logService.log('Error: ', data);
                this.toaster.pop('error', 'Your transfer I/O has not been updated.');
                this.resetDetailModalValue();
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
