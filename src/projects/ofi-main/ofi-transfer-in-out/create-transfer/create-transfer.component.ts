import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { take, takeUntil, filter, map, switchMap } from 'rxjs/operators';
import { LogService } from '@setl/utils';
import { TransferInOutService } from '../transfer-in-out.service';
import { OfiFundService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund/fund.service';
import { OfiFundShareService } from '@ofi/ofi-main/ofi-req-services/ofi-product/fund-share/service';
import { MultilingualService } from '@setl/multilingual';
import {
    OfiManagementCompanyService,
} from '../../ofi-req-services/ofi-product/management-company/management-company.service';

@Component({
    selector: 'app-create-transfer',
    templateUrl: './create-transfer.component.html',
    styleUrls: ['./create-transfer.component.scss'],
})
export class CreateTransferComponent implements OnInit {
    placeTransferFormGroup: FormGroup;
    type = 'operation';
    direction = 'in';
    managementCompanyAccessList = [];
    mananagementCompanyItems = [];
    managementCompanySelected = {};
    shareList = [];
    filteredShareList = [];
    shareSelected = {};
    investorShareList = [];
    subscriptions: Array<Subscription> = [];
    accountKeeperList =  [
        { id: 1, text: 'Société Générale Securities Services France' },
        { id: 2, text: 'Société Générale Securities Services Luxembourg' },
        { id: 3, text: 'BNP Paribas Securities France' },
        { id: 4, text: 'BNP Paribas Securities Luxembourg' },
        { id: 5, text: 'CACEIS Fund Administration' },
        { id: 6, text: 'CACEIS Bank, Luxembourg' },
        { id: 7, text: 'JPMORGAN Bank Luxembourg' },
        { id: 8, text: 'State Street Bank Luxembourg' },
        { id: 9, text: 'State Street Global Services France' },
    ];

    /*
        getmanagementcompanylist
        izngetadminfundlist
        izngetadminfundsharelist
    */

    @select([
        'ofi',
        'ofiProduct',
        'ofiManagementCompany',
        'managementCompanyList',
        'managementCompanyList',
    ]) managementCompanyAccessListOb;

    /* For IZNES Admins */
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) fundShareObs;
    @select(['ofi', 'ofiProduct']) fundShareInvestorObs;
    @select(['user']) userDetailOb;


    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private router: Router,
                private redux: NgRedux<any>,
                private logService: LogService,
                private transferService: TransferInOutService,
                private ofiFundService: OfiFundService,
                private ofiManagementCompanyService: OfiManagementCompanyService,
                private ofiFundShareService: OfiFundShareService,
                public translate: MultilingualService,
                private route: ActivatedRoute) { }

    ngOnInit() {
        this.initForm();
        this.subscriptions.push(this.managementCompanyAccessListOb
            .subscribe((d) => {
                this.managementCompanyAccessList = d;
                this.mananagementCompanyItems = Object.keys(this.managementCompanyAccessList).map((key) => {
                    return {
                        id: this.managementCompanyAccessList[key].companyID,
                        text: this.managementCompanyAccessList[key].companyName,
                    };
                });
            }),
        );

        this.subscriptions.push(this.fundShareObs.subscribe(shares => this.shareList = shares));
        this.ofiFundShareService.fetchIznesAdminShareList();
        this.ofiManagementCompanyService.getManagementCompanyList();
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

    handleDropdownAmSelect(event) {
        this.placeTransferFormGroup.controls['amShareFund'].setValue('');
        this.placeTransferFormGroup.controls['amShareFundISIN'].setValue('');
        this.shareSelected = {};

        for (const key in this.managementCompanyAccessList) {
            if (this.managementCompanyAccessList[key].companyID === event.id) {
                this.managementCompanySelected = this.managementCompanyAccessList[key];
            }
        }

        this.filteredShareList = Object.keys(this.shareList).map((key) => {
            if (this.shareList[key].managementCompanyId === event.id) {
                return {
                    id: key,
                    text: this.shareList[key].fundShareName,
                };
            }
        });
    }

    handleDropdownShareSelect(event) {
        this.shareSelected = this.shareList[event.id];

        this.fundShareObs
        .subscribe((fundShareDocs) => {
            console.log(fundShareDocs);
        });
        
        this.fundShareInvestorObs
        .subscribe((fundShareDocs) => {
            console.log(fundShareDocs);
        });

        this.userDetailOb
        .subscribe((fundShareDocs) => {
            console.log(fundShareDocs);
        });

        this.ofiFundShareService.fetchInvestorShareByID(this.shareSelected['fundShareID']);
    }

    handleSubmitButtonClick() {

    }

    handleCancelButtonClick() {

    }

}
