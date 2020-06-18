import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgRedux, select } from '@angular-redux/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
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
    managementCompanySelected: any = {};
    shareList = [];
    filteredShareList = [];
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
    @select(['ofi', 'ofiProduct', 'ofiFund', 'fundList', 'iznFundList']) fundListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'requestedIznesShare']) requestedShareListObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShareList', 'iznShareList']) shareListObs;

    /* For IZNES Admins */
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'requested']) requestedFundShareObs;
    @select(['ofi', 'ofiProduct', 'ofiFundShare', 'fundShare']) fundShareObs;

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

        this.subscriptions.push(this.requestedFundShareObs
            .subscribe(() => this.ofiFundShareService.fetchIznesAdminShareList()));
        this.subscriptions.push(this.fundShareObs.subscribe(shares => this.shareList = shares));
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

    updateBicOnAmSelect(event) {
        /*
        this.managementCompanySelected = Object.keys(this.managementCompanyAccessList)
        .find((key) => {
            if (this.managementCompanyAccessList[key].companyID === event.id) {
                return this.managementCompanyAccessList[key];
            }
        });
        */
        console.log('result :', this.managementCompanySelected);
        console.log(this.shareList);
    }

    handleSubmitButtonClick() {

    }

    handleCancelButtonClick() {

    }

}
