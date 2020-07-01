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
import { Subscription } from 'rxjs';
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
    transferListItems: [];
    currencyList: any[];
    subscriptions: Array<Subscription> = [];
    public showColumnSpacer: boolean = true;

    @Input() isImported: boolean;
    @Input() linkRoute: string;
    @ViewChild('ordersDataGrid') transferDatagrid: any;

    /* Datagrid server driven */
    total: number;
    readonly itemPerPage = 10;
    private datagridParams: DatagridParams;
    loading = true;

    // Locale
    language = 'en';

    @select(['ofi', 'ofiCurrencies', 'currencies']) currenciesObs;

    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private router: Router,
                private redux: NgRedux<any>,
                private logService: LogService,
                private transferService: TransferInOutService,
                public translate: MultilingualService,
                private ofiCurrenciesService: OfiCurrenciesService,
                private route: ActivatedRoute) {
        this.ofiCurrenciesService.getCurrencyList();
        this.subscriptions.push(this.currenciesObs.subscribe(c => this.getCurrencyList(c)));
    }

    ngOnInit() {
        this.datagridParams = new DatagridParams(this.itemPerPage);
        this.transferService.fetchIznesTransferList(
            (res) => {
                this.transferListItems = this.transferObjectToList(res[1].Data);
                this.loading = false;
                this.resizeDatagridRemoveSpacers();
                console.log(this.transferListItems);
            },
            (error) => {
                console.log(error);
            });
    }

    refresh(state: ClrDatagridStateInterface) {

        if (!state.page) {
            return;
        }

        //this.manageOrdersService.setOrderListPage(state.page.from / state.page.size + 1);
        this.datagridParams.applyState(state);
    }

    transferObjectToList(listTransfer) {
        return listTransfer.map((orderId) => {
            const referenceID = orderId.referenceID;
            const externalReference = orderId.externalReference;
            const accountKeeper = orderId.accountKeeperID;
            const transferDirection = orderId.transferDirection;
            const assetManagementCompany = orderId.assetManagementCompanyName;
            const investorCompany = orderId.investorCompanyName;
            const investorWallet = orderId.accountLabel;
            const shareISIN = orderId.fundShareISIN;
            const shareName = orderId.fundShareName;
            const currency = this.currencyList[orderId.currency]['text'] || 'EUR';
            const quantity = orderId.quantity;
            const unitPrice = orderId.price;
            const amount = quantity * unitPrice;
            const theoricalDate = orderId.theoricalDate;
            const transferStatus = orderId.transferStatus;
            const dateEntered = orderId.dateEntered;

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

    ngOnDestroy(): void {
        this.cdr.detach();
        this.subscriptions.map(subscription => subscription.unsubscribe());
    }
}
