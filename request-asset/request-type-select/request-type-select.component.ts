import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import {
    WalletNodeRequestService,
    InitialisationService,
    MyWalletsService,
} from '@setl/core-req-services';
import { walletHelper } from '@setl/utils';

@Component({
    selector: 'app-request-type-select',
    templateUrl: './request-type-select.component.html',
    styleUrls: ['./request-type-select.component.css'],
})
export class RequestTypeSelectComponent implements OnInit, OnDestroy {

    @Output() requestType = new EventEmitter<number>();
    @Output() fromRelationship = new EventEmitter<number>();
    @Output() walletFrom = new EventEmitter<number>();
    @Output() addressTo = new EventEmitter<string>();

    connectedWalletId: number;
    requestTypeForm: FormGroup;
    subscriptionsArray: Subscription[] = [];

    requestTypes = [
        { id: 1, text: 'Connection' },
        { id: 2, text: 'Address' },
    ];
    selectedRequestType: number;

    walletAddressList: any[];
    walletDirectoryListRaw: any[];
    walletDirectoryList: any[];
    walletRelationships: any[];

    // Wallet ID
    @select(['user', 'connected', 'connectedWallet']) walletIdOb: Observable<any>;

    // myWalletAddress
    @select(['wallet', 'myWalletAddress', 'requestedAddressList']) requestedWalletAddressListOb: Observable<any>;
    @select(['wallet', 'myWalletAddress', 'requestedLabel']) requestedWalletAddressLabelsOb: Observable<any>;
    @select(['wallet', 'myWalletAddress', 'addressList']) walletAddressListOb: Observable<any>;

    // walletDirectory
    @select(['wallet', 'walletDirectory', 'walletList']) walletDirectoryListOb: Observable<any>;

    // walletRelationship
    @select(['wallet', 'walletRelationship', 'requestedToRelationship']) requestedWalletRelationshipListOb: Observable<any>;
    @select(['wallet', 'walletRelationship', 'toRelationshipList']) walletRelationshipListOb: Observable<any>;

    constructor(private ngRedux: NgRedux<any>,
                private walletNodeRequestService: WalletNodeRequestService,
                private myWalletService: MyWalletsService) {

        this.requestTypeForm = new FormGroup({
            type: new FormControl('', Validators.required),
            fromRelationship: new FormControl('', Validators.required),
            walletFrom: new FormControl('', Validators.required),
            addressTo: new FormControl('', Validators.required),
        });

        this.initWalletIdSubscription();
        this.initWalletDirectorySubscriptions();
        this.initMyWalletSubscriptions();
        this.initWalletRelationshipsSubscriptions();
    }

    ngOnInit() {
    }

    private initWalletIdSubscription(): void {
        this.subscriptionsArray.push(
            this.walletIdOb.subscribe((walletId: number) => {
                this.connectedWalletId = walletId;
                // Reset form
                this.requestTypeForm.reset();
                // Refresh toRelationships
                InitialisationService.requestToRelationship(
                    this.ngRedux, this.myWalletService, this.connectedWalletId);
            }),
        );
    }

    private initWalletRelationshipsSubscriptions(): void {
        this.subscriptionsArray.push(
            this.requestedWalletRelationshipListOb.subscribe((requested) => {
                if (!requested) {
                    InitialisationService.requestToRelationship(
                        this.ngRedux, this.myWalletService, this.connectedWalletId);
                }
            }),
            this.walletRelationshipListOb.subscribe((walletList) => {
                if (Object.keys(walletList).length) {
                    this.walletRelationships = walletHelper.walletToRelationshipToSelectItem(
                        walletList, this.walletDirectoryList);
                }
            }),
        );
    }

    private initWalletDirectorySubscriptions(): void {
        this.subscriptionsArray.push(
            this.walletDirectoryListOb.subscribe((walletList) => {
                this.walletDirectoryListRaw = walletList;
                this.walletDirectoryList = walletHelper.walletAddressListToSelectItem(walletList, 'walletName');
            }),
        );
    }

    private initMyWalletSubscriptions(): void {
        this.subscriptionsArray.push(
            this.requestedWalletAddressListOb.subscribe((requested) => {
                if (!requested) {
                    InitialisationService.requestWalletAddresses(
                        this.ngRedux, this.walletNodeRequestService, this.connectedWalletId);
                }
            }),
            this.requestedWalletAddressLabelsOb.subscribe((requested) => {
                if (!requested && this.connectedWalletId !== 0) {
                    MyWalletsService.defaultRequestWalletLabel(
                        this.ngRedux, this.myWalletService, this.connectedWalletId);
                }
            }),
            this.walletAddressListOb.subscribe((walletAddressList) => {
                this.walletAddressList = walletHelper.walletAddressListToSelectItem(walletAddressList, 'label');
            }),
        );
    }

    onRequestTypeSelect($event): void {
        this.selectedRequestType = $event.id;
        this.requestType.emit($event.id);
    }

    onRelationshipSelect($event): void {
        const walletName = $event.text;

        Object.keys(this.walletDirectoryListRaw).forEach((item) => {
            if (this.walletDirectoryListRaw[item].walletName === walletName) {
                this.fromRelationship.emit(this.walletDirectoryListRaw[item].walletID);
            }
        });
    }

    onWalletSelect($event): void {
        this.walletFrom.emit($event.id);
    }

    onAddressSelect($event): void {
        this.addressTo.emit($event.id);
    }

    ngOnDestroy() {
        for (const subscription of this.subscriptionsArray) {
            subscription.unsubscribe();
        }
    }
}
