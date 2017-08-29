import {Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';

import {SagaHelper, Common} from '@setl/utils';
import {NgRedux} from '@angular-redux/store';

import _ from 'lodash';

import {fromJS} from "immutable";

import {
    getWalletHoldingByAsset,
    getConnectedWallet
} from '@setl/core-store';


@Component({
    selector: 'setl-balances',
    templateUrl: './balances.component.html',
    styleUrls: ['./balances.component.css']
})
export class SetlBalancesComponent implements OnInit, AfterViewInit {

    @ViewChild('myDataGrid') myDataGrid;

    public assets
    public singleAsset;
    public singleAssetHistory;

    public holdingByAsset;
    public currentWalletId;

    constructor(private ngRedux: NgRedux<any>) {

        ngRedux.subscribe(() => this.updateState());
        this.updateState();

        // this.assets = [
        //     {
        //         id: '1',
        //         identifier: 'FR0001',
        //         asset: 'LEI0001|OFI RS Dynamique C D',
        //         total: '987,654,321',
        //         encumbered: '321',
        //         free: '987,654,000'
        //     },
        //     {
        //         id: '2',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        //     {
        //         id: '3',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        //     {
        //         id: '1',
        //         identifier: 'FR0001',
        //         asset: 'LEI0001|OFI RS Dynamique C D',
        //         total: '987,654,321',
        //         encumbered: '321',
        //         free: '987,654,000'
        //     },
        //     {
        //         id: '2',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        //     {
        //         id: '3',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        //     {
        //         id: '1',
        //         identifier: 'FR0001',
        //         asset: 'LEI0001|OFI RS Dynamique C D',
        //         total: '987,654,321',
        //         encumbered: '321',
        //         free: '987,654,000'
        //     },
        //     {
        //         id: '2',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        //     {
        //         id: '3',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        //     {
        //         id: '1',
        //         identifier: 'FR0001',
        //         asset: 'LEI0001|OFI RS Dynamique C D',
        //         total: '987,654,321',
        //         encumbered: '321',
        //         free: '987,654,000'
        //     },
        //     {
        //         id: '2',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        //     {
        //         id: '3',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        //     {
        //         id: '1',
        //         identifier: 'FR0001',
        //         asset: 'LEI0001|OFI RS Dynamique C D',
        //         total: '987,654,321',
        //         encumbered: '321',
        //         free: '987,654,000'
        //     },
        //     {
        //         id: '2',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        //     {
        //         id: '3',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        //     {
        //         id: '1',
        //         identifier: 'FR0001',
        //         asset: 'LEI0001|OFI RS Dynamique C D',
        //         total: '987,654,321',
        //         encumbered: '321',
        //         free: '987,654,000'
        //     },
        //     {
        //         id: '2',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        //     {
        //         id: '3',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        //     {
        //         id: '1',
        //         identifier: 'FR0001',
        //         asset: 'LEI0001|OFI RS Dynamique C D',
        //         total: '987,654,321',
        //         encumbered: '321',
        //         free: '987,654,000'
        //     },
        //     {
        //         id: '2',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        //     {
        //         id: '3',
        //         identifier: 'EUR',
        //         asset: 'Payment_Bank1|EUR',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        // ];
        //
        // this.singleAsset = [
        //     {
        //         id: '1',
        //         address: 'd332bad22159a6ea1122f032b57cfd92',
        //         total: '987,654,321',
        //         encumbered: '321',
        //         free: '987,654,000'
        //     },
        //     {
        //         id: '2',
        //         address: '2219a822bf8087aa5e82788ec2a87cc5',
        //         total: '100',
        //         encumbered: '1',
        //         free: '99'
        //     },
        // ];
        //
        // this.singleAssetHistory = [
        //     {
        //         id: '1',
        //         txid: '037d8a00b9',
        //         asset: 'Payment_Bank1|EUR',
        //         amount: '987,654,321',
        //         time: '2017-04-18 10:24:16 UTC',
        //         type: 'Issue Asset'
        //     },
        //     {
        //         id: '2',
        //         txid: '16a91bd771',
        //         asset: 'Contract',
        //         amount: '987,654,321',
        //         time: '2017-04-18 10:24:16 UTC',
        //         type: 'Contract Commitment'
        //     },
        //     {
        //         id: '3',
        //         txid: '423336b76f',
        //         asset: 'Contract',
        //         amount: '987,654,321',
        //         time: '2017-04-18 10:24:16 UTC',
        //         type: 'Contract Commitment'
        //     }
        // ];
    }

    updateState() {
        const newState = this.ngRedux.getState();
        this.currentWalletId = getConnectedWallet(newState);
        this.holdingByAsset = getWalletHoldingByAsset(newState);

        console.log(this.holdingByAsset);

        this.assets = this.formatHolding();
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.myDataGrid.resize();
    }

    formatHolding() {
        let walletId = this.currentWalletId;
        let holding = this.holdingByAsset;

        console.log(holding);
        console.log(walletId);

        let holdingForWallet = holding[walletId];

        if (_.isEmpty(holdingForWallet)) {
            return [];
        }

        const holdingListImu = fromJS(holdingForWallet);
        const holdingList = holdingListImu.map(
            (thisHolding, thisHoldingKey) => {
                return {
                    asset: thisHoldingKey,
                    total: thisHolding.get('total'),
                };
            }
        );

        return holdingList.toArray();

        //         //     {
        //         id: '1',
        //         identifier: 'FR0001',
        //         asset: 'LEI0001|OFI RS Dynamique C D',
        //         total: '987,654,321',
        //         encumbered: '321',
        //         free: '987,654,000'
        //     },
    }

}

