import {Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';


@Component({
    selector: 'setl-balances',
    templateUrl: './balances.component.html',
    styleUrls: ['./balances.component.css']
})
export class SetlBalancesComponent implements OnInit, AfterViewInit {

    @ViewChild('myDataGrid') myDataGrid;

    public assets;

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
                asset: 'XXXXXXXXXXXXXXXXXXXPayment_Bank1|EUR',
                total: '100',
                encumbered: '1',
                free: '99'
            },
        ];
    }

    ngOnInit() {

        console.log(this.myDataGrid);

        //this.myDataGrid.resize();
    }

    ngAfterViewInit() {
        // this.someInput.resize();
        console.log('tes');
        console.log(this.someInput)
        this.myDataGrid.resize();
    }

}

