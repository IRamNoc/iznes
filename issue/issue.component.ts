import {Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';


@Component({
    selector: 'setl-issue',
    templateUrl: './issue.component.html',
    styleUrls: ['./issue.component.css']
})
export class SetlIssueComponent implements OnInit, AfterViewInit {

    @ViewChild('myDataGrid') myDataGrid;

    public assets
    public singleAsset;
    public singleAssetHistory;

    constructor(private ref: ChangeDetectorRef) {

        this.assets = [
            {
                id: '1',
                identifier: 'FR0001',
                asset: 'LEI0001|OFI RS Dynamique C D',
                total: '987,654,321',
                encumbered: '321',
                free: '987,654,000'
            },
            {
                id: '2',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '3',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '1',
                identifier: 'FR0001',
                asset: 'LEI0001|OFI RS Dynamique C D',
                total: '987,654,321',
                encumbered: '321',
                free: '987,654,000'
            },
            {
                id: '2',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '3',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '1',
                identifier: 'FR0001',
                asset: 'LEI0001|OFI RS Dynamique C D',
                total: '987,654,321',
                encumbered: '321',
                free: '987,654,000'
            },
            {
                id: '2',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '3',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '1',
                identifier: 'FR0001',
                asset: 'LEI0001|OFI RS Dynamique C D',
                total: '987,654,321',
                encumbered: '321',
                free: '987,654,000'
            },
            {
                id: '2',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '3',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '1',
                identifier: 'FR0001',
                asset: 'LEI0001|OFI RS Dynamique C D',
                total: '987,654,321',
                encumbered: '321',
                free: '987,654,000'
            },
            {
                id: '2',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '3',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '1',
                identifier: 'FR0001',
                asset: 'LEI0001|OFI RS Dynamique C D',
                total: '987,654,321',
                encumbered: '321',
                free: '987,654,000'
            },
            {
                id: '2',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '3',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '1',
                identifier: 'FR0001',
                asset: 'LEI0001|OFI RS Dynamique C D',
                total: '987,654,321',
                encumbered: '321',
                free: '987,654,000'
            },
            {
                id: '2',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
            {
                id: '3',
                identifier: 'EUR',
                asset: 'Payment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
        ];

        this.singleAsset = [
            {
                id: '1',
                address: 'd332bad22159a6ea1122f032b57cfd92',
                total: '987,654,321',
                encumbered: '321',
                free: '987,654,000'
            },
            {
                id: '2',
                address: '2219a822bf8087aa5e82788ec2a87cc5',
                total: '100',
                encumbered: '1',
                free: '99'
            },
        ];

        this.singleAssetHistory = [
            {
                id: '1',
                txid: '037d8a00b9',
                asset: 'Payment_Bank1|EUR',
                amount: '987,654,321',
                time: '2017-04-18 10:24:16 UTC',
                type: 'Issue Asset'
            },
            {
                id: '2',
                txid: '16a91bd771',
                asset: 'Contract',
                amount: '987,654,321',
                time: '2017-04-18 10:24:16 UTC',
                type: 'Contract Commitment'
            },
            {
                id: '3',
                txid: '423336b76f',
                asset: 'Contract',
                amount: '987,654,321',
                time: '2017-04-18 10:24:16 UTC',
                type: 'Contract Commitment'
            }
        ];
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.myDataGrid.resize();
    }

}

