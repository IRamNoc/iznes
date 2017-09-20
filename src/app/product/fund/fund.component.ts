/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { FundInterface } from './fund.interface';

@Component({
    selector: 'fund',
    styleUrls: ['./fund.component.scss'],
    templateUrl: './fund.component.html',
})
export class SetlFundComponent implements OnInit {

    //https://plnkr.co/edit/clTbNP7MHBbBbrUp20vr?p=preview

    public fundForm: FormGroup;
    public share: object = {};
    public isNewFund = false; // btn new part
    public currentShareIx = 0;
    public currentCopy: any;

    constructor(private _fb: FormBuilder) { }

    ngOnInit() {
        this.fundForm = this._fb.group({
            fundName: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundLei: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundSicavFcp: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundSicavId: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            shares: this._fb.array([])
        });

        // add address
        this.addShare();

        /* subscribe to addresses value changes */
        // this.fundForm.controls['addresses'].valueChanges.subscribe(x => {
        //   console.log(x);
        // })
    }

    newFund() {
        this.isNewFund = true;
    }

    initShare(shareCopy?) {
        // donc l'idée c'est de créer un objet vide
        // parse shareCopy et créer un json avec les valeurs pré-remplies de la copie
        // par contre il l'ajoute à la fin faut voir si on peut le mettre là où il est supposé être
        let fieldValue = '';
        if (shareCopy){
            fieldValue = 'salut';
        }
        return this._fb.group({
        // Administratif
            isin: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            portfolioCode: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            shareName: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundShareStatus: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundAddressPrefix: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundAddress1: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundAddress2: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundAddress3: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundAddress4: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundCodePostal: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            leiCode: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            shareType: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            incomeAllocation: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            shareCurrency: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            portfolioCurrency: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            approvalDate: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            creationDate: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            dissolutionDate: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            sidePocket: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundInLiquidation: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            valuationFrequency: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundBusinessDayRule: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            applicableRight: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundEstimated: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            estimatedNavDate: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            amfDisclosure: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            reportingCountry: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            endOfFirstYearDate: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            closingDate: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
        // Services
            assetManagementCompany: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            managementCompanyAddressPrefix: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            managementCompanyAddress1: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            managementCompanyAddress2: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            managementCompanyAddress3: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            managementCompanyAddress4: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            managementCompanyCodePostal: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            delegatedAssetManagementCompany: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            delegatedManagementCompanyAddressPrefix: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            delegatedManagementCompanyAddress1: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            delegatedManagementCompanyAddress2: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            delegatedManagementCompanyAddress3: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            delegatedManagementCompanyAddress4: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            delegatedManagementCompanyCodePostal: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            delegationFxTreasury: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            promoter: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            statutoryAdvisor: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            cacRenewalDate: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            compensator: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            finInvestAllocAdviser: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            custodian: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            depositary: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            subCustodian: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            orderAgent: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            primeBroker: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            registryAccountManager: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            adminAccountManager: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            administratorNav: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
        // Catégorie
            assetClass: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            subAssetClass: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            graphicalArea: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundSri: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundCopromotion: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
        // Juridique
            supervisoryAuthority: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            amfClassification: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            ucitsIVClassification: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            legalNature: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            formOfOpcvm: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundUcitsOfUcits: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundFeeder: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundMaster: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
        // Frais
            maxIndirectFees: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            maxManagementFees: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            prospectusCalcBasis: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            actualCalcBasis: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            provisionedActualManagementFees: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            acquiredSubscriptionFees: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            acquiredRedemptionFees: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            maxSubscriptionFees: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            maxRedemptionFees: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            outPerformanceFee: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            hurdle: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            highWaterMark: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            vmfFirstCollectionDate: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            vmfBillingMonth: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            vmfFrequency: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundAcquisitionOnRedemption: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
        // Risque
            fundGuaranteeOfCapital: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            methodOfEngagement: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            regulatoryLevelOfLeverage: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            srri: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            mainRisks: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
        // Profile
            subscriberProfile: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundDedicated: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundReserved: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            accessCondition: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            investmentHorizon: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundPeaEligibility: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundTaxRatio90Percent: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundReverseSolicitation: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
        // Caractéristique
            initialNav: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            knownNav: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            decimalisation: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            formOfUnit: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            formOfRedemption: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            formOfsubscription: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            minInitSubscription: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            minSubscriptionvalue: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            minsubscriptionUnits: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundSwingPricing: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundAdmissionToBlockchain: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundCurrencyHedgedAmount: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundGuaranteeOrProtection: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
        // Calendrier
            srSchedule: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            valuationPrice: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundDvp: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            dateCalculationConditions: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            cashDeliveryDate: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            settlementDate: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            subscriptionCutOff: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            subscriptionCutOffHour: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            advancedNotice: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            redemptionCutOff: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            redemptionCutOffHour: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            redemptionAdvancedNotice: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            blockingPeriod: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            gate: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            salePurchaseConditions: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            initialNavDate: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            settlementDateOnInitial: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
            fundSwitchFreePossibility: [
                '',
                Validators.compose([
                    Validators.required,
                ])
            ],
        // Documents
            fundDocDici: [
                ''
            ],
            fundDocProductSheet: [
                ''
            ]
        });
    }

    addShare(shareCopy?) {
        const control = <FormArray>this.fundForm.controls['shares'];
        const addrCtrl = this.initShare(shareCopy);

        control.push(addrCtrl);

        /* subscribe to individual address value changes */
        // addrCtrl.valueChanges.subscribe(x => {
        //   console.log(x);
        // })
    }

    setCurrentShare(ix) {
        this.currentShareIx = ix;
    }

    removeShare(i: number) {
        if (confirm('Are you sure you want to delete this share?')) {
            if (i > 0) {
                const control = <FormArray>this.fundForm.controls['shares'];
                control.removeAt(i);
                this.currentShareIx = i - 1;
            }
        }
    }

    copyShare() {
        this.currentCopy = this.fundForm.controls['shares'].value[this.currentShareIx];
    }

    pasteShare() {
        if (this.currentCopy !== '') {
            this.removeShare(this.currentShareIx);
            this.addShare(this.currentCopy);
        }
    }

    save(model: FundInterface) {
        // call API to save
        // ...
        console.log(model);
    }
}



/*
import {Component, OnInit} from '@angular/core';
import {SagaHelper, Common} from '@setl/utils';
import {FormGroup, FormArray, FormBuilder, Validators} from '@angular/forms';
import {Customer} from './fund.interface';

import {
    getConnectedWallet
} from '@setl/core-store';

@Component({
    styleUrls: ['./fund.component.scss'],
    templateUrl: './fund.component.html',
})

export class SetlFundComponent {

    fakeDatas = [
        {fund:'OFI1', isin:'123'},
        {fund:'OFI2', isin:'123'},
        {fund:'OFI3', isin:'123'},
        {fund:'OFI4', isin:'123'},
        {fund:'OFI5', isin:'123'},
        {fund:'OFI6', isin:'123'},
        {fund:'OFI7', isin:'123'}
    ];

    isNewFund = false; // btn new part
    public fundForm: FormGroup;

    allShares = [
        {share: 0, subLevel: 0}
    ];
    currentShareIx = 0;

    constructor(private _fb: FormBuilder) {
        this.fundForm = this._fb.group({
            fundName: [
                '',
                [
                    Validators.required,
                    Validators.minLength(5)
                ]
            ],
            shares: this._fb.array([])
        });

        this.addShare();
    }

    initShare() {
        return this._fb.group({
            shareName: [
                '',
                Validators.required
            ]
        });
    }

    addShare() {
        const control = <FormArray>this.fundForm.controls['shares'];
        const addrCtrl = this.initShare();

        control.push(addrCtrl);

        this.allShares.push({share: this.allShares.length, subLevel: 0});
        // this.setCurrentShare(this.allShares.length - 1); // create a bug in console

        // subscribe to individual address value changes
        // addrCtrl.valueChanges.subscribe(x => {
        //   console.log(x);
        // })
    }

    removeShare(i: number) {
        if (i > 0) {
            const control = <FormArray>this.fundForm.controls['shares'];
            control.removeAt(i);

            this.allShares.splice(i, 1);
            this.setCurrentShare((i > 1) ? (i - 1) : 0);
        } else {
            alert('Can\' delete the first one !');
        }
    }

    newFund() {
        console.log('newFund');
        this.isNewFund = true;
    }

    setCurrentShare(ix) {
        this.currentShareIx = ix;
    }

    changeSubLevel(share, index) {
        // of a specific part
        this.allShares[share].subLevel = index;
    }

    copyPart(index) {
        console.log('copy'+index);
    }

    pastePart(index) {
        console.log('paste'+index);
    }

    saveForm(model: Customer) {
        console.log(model);
    }
}
*/