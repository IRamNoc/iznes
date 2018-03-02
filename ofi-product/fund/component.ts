import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormGroup, Validators, FormBuilder} from '@angular/forms';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';

@Component({
    templateUrl: './component.html',
    styleUrls: ['./component.css'],
})
export class FundComponent implements OnInit, OnDestroy {

    selectedUmbrella: number;
    // mock data
    umbrellaItems = [
        {
            id: 0,
            text: 'none'
        },
        {
            id: 1,
            text: 'umbrella 1'
        },
        {
            id: 2,
            text: 'umbrella 2'
        },
        {
            id: 3,
            text: 'umbrella 3'
        },
        {
            id: 4,
            text: 'umbrella 4'
        },
    ];

    // forms
    umbrellaForm: FormGroup;
    fundForm: FormGroup;


    isFundFormVisible = false;

    unSubscribe: Subject<any> = new Subject();

    constructor(private location: Location, private router: Router, private fb: FormBuilder) {

        this.umbrellaForm = fb.group({
            'umbrellaFund': ['', Validators.required],
            'umbrellaFundName': {value: 'nem', disabled: true},
            'umbrellaLei': {value: 'lei', disabled: true},
            'umbrellaFundDomicile': {value: 'dom', disabled: true},
        });

        this.fundForm = fb.group({
            'fundStructure': ['', Validators.required],
            'umbrellaName': '',
            'fundName': ['', Validators.required],
            'AuMFund': ['', Validators.required],
            'AuMFundDate': ['', Validators.required],
            'lei': [''],
            'registeredOfficeName': [''],
            'registeredOfficeAddress': [''],
            'fundDomicile': ['', Validators.required],
            'isEuDirectiveRelevant': ['', Validators.required],
            'euDirectiveType': ['', Validators.required],
            'UCITSVersion': ['', Validators.required],
            'fundLegalForm': ['', Validators.required],
            'nationalNomenclatureOfLegalForm': ['', Validators.required],
            'homeCountryLegalType': ['', Validators.required],
            'fundCreationDate': [''],
            'fundLaunchDate': [''],
            'fundCurrency': ['', Validators.required],
            'fundStructureType': ['', Validators.required],
            'fiscalYearEnd': ['', Validators.required],
            'fundOrFunds': ['', Validators.required],
            'managementCompany': ['', Validators.required],
            'fundAdmin': ['', Validators.required],
            'custodianBank': ['', Validators.required],
            'investmentManager': [''],
            'principalPromoter': [''],
            'payingAgent': [''],
            'fundManagers': [''],
            'transfertAgent': ['', Validators.required],
            'centralizingAgent': ['', Validators.required],
            'dedicatedFund': ['', Validators.required],
            'portfolioCurrencyHedge': ['', Validators.required],

            'giin': [''],
            'delegatedManagementCompany': [''],
            'investmentAdvisor': [''],
            'auditor': [''],
            'taxAuditor': [''],
            'legalAdvisor': [''],
            'directors': [''],
            'pocket': [''],
            'hasEmbeddedDerivatives': [''],
            'hasCapitalPreservation': [''],
            'capitalPreservationLevel': [''],
            'capitalPreservationPeriod': [''],
            'hasCppi': [''],
            'cppiMultiplier': [''],
            'hasHedgeFundStrategy': [''],
            'isLeveraged': [''],
            'has130/30Strategy': [''],
            'isFundTargetingEos': [''],
            'isFundTargetingSri': [''],
            'isPassiveFund': [''],
            'hasSecurityLending': [''],
            'hasSwap': [''],
            'hasDurationHedge': [''],
            'investmentObjective': [''],
        });


        this.umbrellaForm.controls['umbrellaFund'].valueChanges
            .takeUntil(this.unSubscribe)
            .subscribe((d) => {
                if (!d.length) {
                    this.selectedUmbrella = null;
                } else {
                    this.selectedUmbrella = d[0].id;
                    this.umbrellaForm.controls['umbrellaFundName'].setValue('umbrella' + d[0].id);
                }
            });
    }

    ngOnInit() {

    }

    // forms
    submitUmbrellaForm(): void {
        this.isFundFormVisible = true;
    }

    submitFundForm() {

    }

    onClickBack() {
        this.location.back();
    }

    ngOnDestroy() {
        this.unSubscribe.next();
        this.unSubscribe.complete();
    }

}
