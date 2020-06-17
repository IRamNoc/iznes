import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LogService } from '@setl/utils';
import { TransferInOutService } from '../transfer-in-out.service';
import { MultilingualService } from '@setl/multilingual';

@Component({
    selector: 'app-create-transfer',
    templateUrl: './create-transfer.component.html',
    styleUrls: ['./create-transfer.component.scss'],
})
export class CreateTransferComponent implements OnInit {
    placeTransferFormGroup: FormGroup;
    type = 'operation';
    direction = 'in';
    accountKeeperList =  [
        { id: 1, text: "Société Générale Securities Services France"},
        { id: 2, text: "Société Générale Securities Services Luxembourg"},
        { id: 3, text: "BNP Paribas Securities France"},
        { id: 4, text: "BNP Paribas Securities Luxembourg"},
        { id: 5, text: "CACEIS Fund Administration"},
        { id: 6, text: "CACEIS Bank, Luxembourg"},
        { id: 7, text: "JPMORGAN Bank Luxembourg"},
        { id: 8, text: "State Street Bank Luxembourg"},
        { id: 9, text: "State Street Global Services France" },
    ];

    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private router: Router,
                private redux: NgRedux<any>,
                private logService: LogService,
                private transferService: TransferInOutService,
                public translate: MultilingualService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.placeTransferFormGroup = this.fb.group({
            amCompany: ['', Validators.required],
            amBic: [{ value: '', disabled: true }],
            amShareFund: ['', Validators.required],
            amShareFundISIN: [{ value: '', disabled: true }],
            investorCompany: ['', Validators.required],
            investorReference: [{ value: '', disabled: true }],
            investorWallet: ['', Validators.required],
            investorWalletReference: [{ value: '', disabled: true }],
            quantity: [0, Validators.required],
            unitPrice: [0, Validators.required],
            amount: [0, Validators.required],
            currency: [{ value: '', disabled: true }],
            theoricalDate: [new Date().toISOString().slice(0, -1), Validators.required],
            initialDate: [new Date().toISOString().slice(0, -1), Validators.required],
            externalReference: [''],
            accountKeeper: ['', Validators.required],
            comment: [''],
            createdBy: [{ value: 'IZNES', disabled: true }],
            dateEntered: [new Date().toISOString().slice(0, -1), Validators.required],
        });
    }

    handleDropdownItemSelect(event, value) {
        return this.placeTransferFormGroup.controls[value].setValue(event.text);
    }

    handleSubmitButtonClick() {

    }

    handleCancelButtonClick() {

    }

}
