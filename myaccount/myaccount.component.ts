/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import {SagaHelper, Common} from '@setl/utils';
import {NgRedux, select} from '@angular-redux/store';
import _ from 'lodash';
import {AlertsService} from '@setl/jaspero-ng2-alerts';
import {FormGroup, FormControl, Validators, AbstractControl} from '@angular/forms';

import {MyUserService} from '@setl/core-req-services';

import {
    getConnectedWallet,
    getMyDetail,
    SET_NEW_PASSWORD
} from '@setl/core-store';

@Component({
    styleUrls: ['./myaccount.component.scss'],
    templateUrl: './myaccount.component.html',
})

export class SetlMyAccountComponent {

    @select(['user', 'myDetail', 'firstName']) getMyFirstname;
    @select(['user', 'myDetail']) getUserDetails;

    public countries = ['United Kingdom', 'France'];

    userDetailsForm: FormGroup;
    changePassForm: FormGroup;

    displayName: AbstractControl;
    firstName: AbstractControl;
    lastName: AbstractControl;
    mobilePhone: AbstractControl;
    addressPrefix: AbstractControl;
    address1: AbstractControl;
    address2: AbstractControl;
    address3: AbstractControl;  // City or Town
    address4: AbstractControl;  // State or Area
    postalCode: AbstractControl;
    country: AbstractControl;
    memorableQuestion: AbstractControl;
    memorableAnswer: AbstractControl;
    profileText: AbstractControl;

    oldPassword: AbstractControl;
    password: AbstractControl;
    passwordConfirm: AbstractControl;

    public showPasswords = false;

    constructor(
        private alertsService: AlertsService,
        private ngRedux: NgRedux<any>,
        private changeDetectorRef: ChangeDetectorRef,
        private myUserService: MyUserService
    ) {
        ngRedux.subscribe(() => this.updateState());

        // changeUserDetails form

        this.userDetailsForm = new FormGroup({
            'displayName': new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(2)
                ])
            ),
            'firstName': new FormControl(
                '',
                Validators.required
            ),
            'lastName': new FormControl(
                '',
                Validators.required
            ),
            'mobilePhone': new FormControl(
                '',
                Validators.required
            ),
            'addressPrefix': new FormControl(
                '',
                Validators.required
            ),
            'address1': new FormControl(
                '',
                Validators.required
            ),
            'address2': new FormControl(
                ''
            ),
            'address3': new FormControl(    // City or Town
                '',
                Validators.required
            ),
            'address4': new FormControl(    // State or Area
                ''
            ),
            'postalCode': new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    //Validators.pattern(/^[a-zA-Z0-9]{5}$/)
                ])
            ),
            'country': new FormControl(
                '',
                Validators.required
            ),
            'memorableQuestion': new FormControl(
                '',
                Validators.required
            ),
            'memorableAnswer': new FormControl(
                '',
                Validators.required
            ),
            'profileText': new FormControl(
                ''
            )
        });

        this.displayName = this.userDetailsForm.controls['displayName'];
        this.firstName = this.userDetailsForm.controls['firstName'];
        this.lastName = this.userDetailsForm.controls['lastName'];
        this.mobilePhone = this.userDetailsForm.controls['mobilePhone'];
        this.addressPrefix = this.userDetailsForm.controls['addressPrefix'];
        this.address1 = this.userDetailsForm.controls['address1'];
        this.address2 = this.userDetailsForm.controls['address2'];
        this.address3 = this.userDetailsForm.controls['address3'];
        this.address4 = this.userDetailsForm.controls['address4'];
        this.postalCode = this.userDetailsForm.controls['postalCode'];
        this.country = this.userDetailsForm.controls['country'];
        this.memorableQuestion = this.userDetailsForm.controls['memorableQuestion'];
        this.memorableAnswer = this.userDetailsForm.controls['memorableAnswer'];
        this.profileText = this.userDetailsForm.controls['profileText'];

        // changePassword form

        this.changePassForm = new FormGroup({
            'oldPassword': new FormControl(
                '',
                Validators.required
            ),
            'password': new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6)
                ])
            ),
            'passwordConfirm': new FormControl(
                '',
                Validators.compose([
                    Validators.required,
                    Validators.minLength(6)
                ])
            )
        }, this.passwordValidator);

        this.oldPassword = this.changePassForm.controls['oldPassword'];
        this.password = this.changePassForm.controls['password'];
        this.passwordConfirm = this.changePassForm.controls['passwordConfirm'];

        this.updateState();

        // this.getMyFirstname.subscribe((getMyFirstname) => this.myFirstName(getMyFirstname));
        this.getUserDetails.subscribe((getUserDetails) => this.myUserDetails(getUserDetails));
    }

    passwordValidator(g: FormGroup) {
        const oldNew = g.get('oldPassword').value !== g.get('password').value ? null : {'oldNew': true};
        const mismatch = g.get('password').value === g.get('passwordConfirm').value ? null : {'mismatch': true};
        return (oldNew) ? oldNew : mismatch;
    }

    toggleShowPasswords(){
        this.showPasswords = (this.showPasswords === false) ? true : false;
    }

    changePass(formValues){
        // console.log(formValues);

        const asyncTaskPipe = this.myUserService.saveNewPassword({
            oldPassword: formValues.oldPassword,
            newPassword: formValues.password
        });

        // Get response
        this.ngRedux.dispatch(
            SagaHelper.runAsync(
                [SET_NEW_PASSWORD], // redux success
                [], // redux fail
                asyncTaskPipe,
                {},
                (data) => { // anonymous : don't' loose this context
                    // console.clear();
                    // console.log('success: ');
                    // console.log(data); // success
                    // console.log(data[1].Data[0].Token); // token
                    this.changePassForm.reset();
                    this.alertsService.create('success', `
                        Your password has been successfully changed!
                    `);
                },
                {} // fail
            )
        );

    }

    updateState() {
        const newState = this.ngRedux.getState();
        const newWalletId = getConnectedWallet(newState);

        const myDetails = getMyDetail(newState);

        // console.log(newWalletId);
        // console.log(myDetails);
    }

    myFirstName(firstName) {
        // console.log(firstName);
    }

    myUserDetails(userDetails){
        if(userDetails.displayName) this.displayName.setValue(userDetails.displayName);
        if(userDetails.firstName) this.firstName.setValue(userDetails.firstName);
        if(userDetails.lastName) this.lastName.setValue(userDetails.lastName);
        if(userDetails.mobilePhone) this.mobilePhone.setValue(userDetails.mobilePhone);
        if(userDetails.addressPrefix) this.addressPrefix.setValue(userDetails.addressPrefix);
        if(userDetails.address1) this.address1.setValue(userDetails.address1);
        if(userDetails.address2) this.address2.setValue(userDetails.address2);
        if(userDetails.address3) this.address3.setValue(userDetails.address3);
        if(userDetails.address4) this.address4.setValue(userDetails.address4);
        if(userDetails.postalCode) this.postalCode.setValue(userDetails.postalCode);
        if(userDetails.country) this.country.setValue([{text: userDetails.country, id: userDetails.country}]); // array for ng-select
        if(userDetails.memorableQuestion) this.memorableQuestion.setValue(userDetails.memorableQuestion);
        if(userDetails.memorableAnswer) this.memorableAnswer.setValue(userDetails.memorableAnswer);
        if(userDetails.profileText) this.profileText.setValue(userDetails.profileText);
    }

    submitDetails(formValues) {
        // console.log(formValues);

        const asyncTaskPipe = this.myUserService.saveMyUserDetails({
            displayName: formValues.displayName,
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            mobilePhone: formValues.mobilePhone,
            addressPrefix: formValues.addressPrefix,
            address1: formValues.address1,
            address2: formValues.address2,
            address3: formValues.address3,
            address4: formValues.address4,
            postalCode: formValues.postalCode,
            country: formValues.country[0].id,
            memorableQuestion: formValues.memorableQuestion,
            memorableAnswer: formValues.memorableAnswer,
            profileText: formValues.profileText
        });

        // Get response from set active wallet
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            (data) => {
                // console.log('success: ', data);
                this.alertsService.create('success', `Your form has been saved successfully!`);

            },
            (data) => {
                // console.log('error: ', data);
                this.alertsService.create('error', JSON.stringify(data));
            })
        );
    }

    // function toNg2SelectItems(arr: Array<string>):Array<object>{
    //
    //     const arrImu = fromJS(arr);
    //
    //     arrImu.map(function(resultArr, thisItem){
    //         resultArr.push({
    //             id: thisItem.name,
    //             text: thisItem.fullName
    //         })
    //         return resultArr;
    //     }, []);
    //
    //     return arrImu.toJS();
    // }

}
