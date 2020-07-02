import * as _ from 'lodash';
/* Core/Angular imports. */
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    Input,
    OnInit,
    ViewChild,
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
/* Clarity */
import { ClrDatagridStateInterface } from '@clr/angular';

@Component({
    selector: 'app-manage-transfers',
    templateUrl: './manage-transfers.component.html',
    styleUrls: ['./manage-transfers.component.scss'],
})
export class ManageTransfersComponent implements OnInit, OnDestroy {
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
    confirmModal = {};

    // Locale
    language = 'en';

    @select(['ofi', 'ofiCurrencies', 'currencies']) currenciesObs;
    @select(['ofi', 'ofiTransfers', 'manageTransfers', 'transferList']) transferObs;
    @select(['ofi', 'ofiTransfers', 'manageTransfers', 'totalResults']) readonly totalResults$: Observable<number>;

    @select(['ofi', 'ofiTransfers']) tempObs;

    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private router: Router,
                private redux: NgRedux<any>,
                private logService: LogService,
                private transferService: TransferInOutService,
                public translate: MultilingualService,
                private ofiCurrenciesService: OfiCurrenciesService,
                private route: ActivatedRoute,
                ) {
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
        this.datagridParams = new DatagridParams(this.itemPerPage);

        this.transferService.defaultRequestManageTransfersList();
        this.subscriptions.push(
            this.transferObs.subscribe(transfers => this.transferListItems = this.transferObjectToList(transfers)));
        this.subscriptions.push(this.tempObs.subscribe(transfers => console.log(transfers)));
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
            const accountKeeper = transfer.accountKeeperID;
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
            const theoricalDate = transfer.theoricalDate;
            const transferStatus = transfer.transferStatus;
            const dateEntered = transfer.dateEntered;

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
            };
        });
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
                this.logService.log('cancel order success', data); // success
                this.resetConfirmModalValue();
            },
            (data) => {
                this.logService.log('Error: ', data);
                this.resetConfirmModalValue();
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
