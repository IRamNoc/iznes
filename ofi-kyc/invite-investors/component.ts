import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';

@Component({
    selector: 'app-invite-investors',
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiInviteInvestorsComponent implements OnDestroy {

    invitationForm: FormGroup;
    investor: object = {};

    showModal = false;
    countdown = 5;
    emailSent = false;
    emailList = [];

    private subscriptions: Array<any> = [];

    /* Constructor. */
    constructor(
        private _fb: FormBuilder,
        private _changeDetectorRef: ChangeDetectorRef,
        private _location: Location
    ) {
        this.invitationForm = this._fb.group({
            investors: this._fb.array([])
        });
        this.addInvestor(this.invitationForm);
    }

    addInvestor(formObj) {
        const control = <FormArray>formObj.controls['investors'];
        const addrCtrl = this._fb.group({
            email: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                ])
            ],
            firstName: [
                '',
            ],
            lastName: [
                '',
            ]
        });
        control.push(addrCtrl);
    }

    removeInvestor(formObj, i: number) {
        const control = <FormArray>formObj.controls['investors'];
        control.removeAt(i);
    }

    save(formValues) {
        for (const inv of formValues.investors) {
            if (this.emailList.indexOf(inv.email) === -1) {
                this.emailList.push(inv.email);
            }
        }
        this.resetForm(formValues);
        this.emailSent = true;
        this.showModal = true;
        const intervalCountdown = setInterval(() => {
            this.countdown--;
            this.markForCheck();
        }, 1000);

        setTimeout(() => {
            clearInterval(intervalCountdown);
            this.closeModal();
            this.markForCheck();
        }, 5000);
    }

    resetForm(formObj) {
        if (formObj.investors.length > 1) {
            for (let i = formObj.investors.length; i > 1; i--) {
                this.removeInvestor(this.invitationForm, i - 1);
            }
        }
        this.invitationForm.reset();
    }

    closeModal() {
        this.showModal = false;
        this.markForCheck();
    }

    goBack() {
        this._location.back();
    }

    /* On Destroy. */
    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        /* Unsunscribe Observables. */
        for (const key in this.subscriptions) {
            this.subscriptions[key].unsubscribe();
        }
    }

    markForCheck() {
        this._changeDetectorRef.markForCheck();
    }
}
