/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {SagaHelper, Common} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import _ from 'lodash';
import {fromJS} from "immutable";

import {MyUserService} from '@setl/core-req-services';

import {
    getConnectedWallet,
    getMyDetail
} from '@setl/core-store';



@Component({
    styleUrls: ['./myaccount.component.scss'],
    templateUrl: './myaccount.component.html',
})


export class SetlMyAccountComponent {

    @select(['user', 'myDetail', 'firstName']) getMyFirstname;

    public myValue;

    constructor(
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private myUserService: MyUserService
    ) {
        ngRedux.subscribe(() => this.updateState());
        this.updateState();

        this.getMyFirstname.subscribe((getMyFirstname) => this.myFirstName(getMyFirstname));
    }

    updateState() {
        const newState = this.ngRedux.getState();
        const newWalletId = getConnectedWallet(newState);

        const myDetails = getMyDetail(newState);

        console.log(newWalletId);
        console.log(myDetails);
    }

    myFirstName(firstName){
        console.log(firstName);
    }

    submit() {
        console.log(this.myValue);

        const asyncTaskPipe = this.myUserService.saveMyUserDetails({
            displayName: 'display',
            firstName: this.myValue,
            lastName: 'last',
            mobilePhone: '0000000000',
            addressPrefix: '',
            address1: 'at home',
            address2: '',
            address3: '',
            address4: '',
            postalCode: '00000',
            country: '00000',
            memorableQuestion: 'who let the dogs out',
            memorableAnswer: 'woof woof woof woof woof',
            profileText: ''
        });

        // Get response from set active wallet
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            function (data) {
                console.log('success: ');
                console.log(data); // success
            },
            function (data) {
                console.log('error: ');
                console.log(data); // error
            })
        );
    }

}
