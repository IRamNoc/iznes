import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {NgRedux} from '@angular-redux/store';
import {Unsubscribe} from 'redux';
import {Subscription} from 'rxjs/Subscription';

@Component({
    selector: 'app-send-asset',
    templateUrl: './send-asset.component.html',
    styleUrls: ['./send-asset.component.css']
})
export class SendAssetComponent implements OnInit, OnDestroy {
    // Observable subscription array.
    subscriptionsArry: Array<Subscription> = [];

    sendAssetForm: FormGroup;

    // Redux unsubscription
    reduxUnsubscribe: Unsubscribe;

    constructor(private ngRedux: NgRedux<any>) {
        this.reduxUnsubscribe = ngRedux.subscribe(() => this.updateState());
        this.updateState();

        /**
         * Issuer Asset form
         */
        this.sendAssetForm = new FormGroup({
            asset: new FormControl('', Validators.required),
            recipient: new FormControl('', Validators.required),
            amount: new FormControl('', Validators.required),
        });
    }

    ngOnInit() {
        //
    }

    updateState() {
        //
    }

    sendAsset() {
        console.log('Send Asset');
    }

    ngOnDestroy() {
        this.reduxUnsubscribe();

        for (const subscription of this.subscriptionsArry) {
            subscription.unsubscribe();
        }
    }

}

