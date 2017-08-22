import {Component, OnInit} from '@angular/core';
import {NgRedux} from '@angular-redux/store';
import {FormBuilder, FormGroup, AbstractControl, Validators} from '@angular/forms';
import {
    getWalletAddressList,
} from '@setl/core-store';
import {List, Map, fromJS} from 'immutable';
import {
    WalletnodeTxService
} from '@setl/core-req-services';
import {SagaHelper} from '@setl/utils';
import {
    REGISTER_ISSUER_SUCCESS,
    REGISTER_ISSUER_FAIL,
    getNewIssuerRequest,
    finishRegisterIssuerNotification
} from '@setl/core-store';

@Component({
    selector: 'app-register-issuer',
    templateUrl: './register-issuer.component.html',
    styleUrls: ['./register-issuer.component.css']
})
export class RegisterIssuerComponent implements OnInit {
    walletAddressSelectItems: Array<any>;

    registerIssuerForm: FormGroup;
    issuerIdentifier: AbstractControl;
    issuerAddress: AbstractControl;

    showRegIssuerRespModal: boolean;

    currentRegisterIssuerResponse: any;

    constructor(private ngRedux: NgRedux<any>,
                private walletnodeTxService: WalletnodeTxService,
                private fb: FormBuilder) {

        ngRedux.subscribe(() => this.updateState());
        this.updateState();

        /**
         * Form control setup
         */
        this.registerIssuerForm = fb.group({
            'issueIdentifier': ['', Validators.required],
            'issuerAddress': ['', Validators.required]
        });

        this.issuerIdentifier = this.registerIssuerForm.controls['issueIdentifier'];
        this.issuerAddress = this.registerIssuerForm.controls['issuerAddress'];

    }


    ngOnInit() {
    }

    updateState() {
        const newState = this.ngRedux.getState();

        // Get wallet addresses and update wallet address items list
        const currentWalletAddressList = getWalletAddressList(newState);
        this.walletAddressSelectItems = walletAddressListToSelectItem(currentWalletAddressList);

        // Get register Issuer response
        const currentRegisterIssuerRequest = getNewIssuerRequest(newState);
        if (currentRegisterIssuerRequest.needNotify) {
            this.showResponseModal(currentRegisterIssuerRequest);

            // Set need notify to false;

            this.ngRedux.dispatch(finishRegisterIssuerNotification());
        }
    }

    registerIssuer(formValue) {
        if (this.registerIssuerForm.valid) {
            const issuerIdentifier = formValue.issueIdentifier;
            const issuerAddressSelectedArr = formValue.issuerAddress;
            const issuerAddress = issuerAddressSelectedArr[0].id;

            // Send register issuer request.

            // Create a saga pipe.
            const asyncTaskPipe = this.walletnodeTxService.registerIssuer({
                issuerIdentifier,
                issuerAddress,
                metaData: {}
            });

            // Send a saga action.
            // Actions to dispatch, when request success:  LOGIN_SUCCESS.
            // Actions to dispatch, when request fail:  RESET_LOGIN_DETAIL.
            // saga pipe function descriptor.
            // Saga pipe function arguments.
            this.ngRedux.dispatch(SagaHelper.runAsync(
                [REGISTER_ISSUER_SUCCESS],
                [REGISTER_ISSUER_FAIL],
                asyncTaskPipe, {}));

        }
        return false;
    }

    showResponseModal(currentRegisterIssuerRequest) {
        this.showRegIssuerRespModal = true;

        this.currentRegisterIssuerResponse = currentRegisterIssuerRequest;

        // console.log(currentRegisterIssuerResponse);

    }

}

/**
 * Convert wallet Address to an array the select2 can use to render a list a wallet address.
 * @param walletAddressList
 * @return {any}
 */
function walletAddressListToSelectItem(walletAddressList: Array<any>): Array<any> {
    const walletAddressListImu = fromJS(walletAddressList);
    const walletAddressSelectItem = walletAddressListImu.map(
        (thisWalletAddress) => {
            return {
                id: thisWalletAddress.get('addr'),
                text: thisWalletAddress.get('addr')
            };
        }
    );

    return walletAddressSelectItem.toJS();
}
