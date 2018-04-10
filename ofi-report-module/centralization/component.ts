import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {NgRedux, select} from '@angular-redux/store';

import {Subject} from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
})
export class CentralizationReportComponent implements OnInit, OnDestroy {

    filterInput = new FormControl('');
    searchFilter: string;
    sports = ['Tennis', 'Football', 'Handball', 'Baseball', 'Badminton', 'Bowling', 'Curling'];
    colors = ['Blue', 'Red', 'Green', 'Pink', 'Black', 'White', 'Orange'];
    genders = ['Male', 'Female'];
    currencies = ['€', '$', '£'];
    available = ['Available', 'Blocked'];
    names = ['Laurent', 'David', 'Albert', 'Ollie', 'Ming', 'Dan', 'Anthony', 'Mathieu', 'Merwan'];

    fakeDatas = [];
    filteredDatas = [];

    unsubscribe = new Subject();

    constructor(
        // private _fb: FormBuilder,
        // private ngRedux: NgRedux<any>,
    ) {
        this.filterInput.valueChanges
            .takeUntil(this.unsubscribe)
            .subscribe((v) => {
                this.searchFilter = v;
                this.requestSearch(null);
            });
        for (let i = 0; i < 1000; i++) {

            const startDateRef = this.convertDate(new Date(+(new Date()) - Math.floor(Math.random() * 10000000000)));
            this.fakeDatas.push({
                isin: Math.floor(Math.random() * Math.floor(1000)),
                shareName: this.names[Math.floor(Math.random() * Math.floor(this.names.length))],
                navDate: Math.floor(Math.random() * Math.floor(1000000)),
                settlementDate: startDateRef,
                shareCurrency: this.currencies[Math.floor(Math.random() * Math.floor(this.currencies.length))],
                latestNav: this.convertDate(new Date(startDateRef).setDate(new Date(startDateRef).getDate() + Math.floor(Math.random() * 1000))),
                aum: this.sports[Math.floor(Math.random() * Math.floor(this.sports.length))],
                netPositionShareCurrency: Math.random().toString(36).substring(7),
                netPositionPerCentAum: this.available[Math.floor(Math.random() * Math.floor(this.available.length))],
            });
        }
        this.requestSearch(null);
    }

    ngOnInit() {

    }

    ngOnDestroy() {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    requestSearch(form) {
        this.filteredDatas = this.fakeDatas;

        if (!this.searchFilter) {
            return;
        }
        const searchRegex = new RegExp(this.searchFilter, 'i');

        this.filteredDatas = this.filteredDatas.filter((item) => {
            return searchRegex.test(item.isin.toString())
                || searchRegex.test(item.shareName.toString());
        });

    }

    convertDate(inputDate) {
        let today: any = new Date(inputDate);
        let dd: any = today.getDate();
        let mm: any = today.getMonth() + 1;
        let yyyy: any = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        return yyyy + '/' + mm + '/' + dd;
    }

    onClickExportCentralizationReport() {
        console.log('onClickExportCentralizationReport');
    }

    onClickViewCorrespondingOrders() {
        console.log('onClickViewCorrespondingOrders');
    }

    onClickViewCentralizationHistory() {
        console.log('onClickViewCentralizationHistory');
    }

    onClickDownloadCorrespondingOrders() {
        console.log('onClickDownloadCorrespondingOrders');
    }

    onClickDownloadCentralizationHistory() {
        console.log('onClickDownloadCentralizationHistory');
    }
}
