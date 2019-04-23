import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MultilingualService } from '@setl/multilingual';
import { Location } from '@angular/common';
import { ToasterService } from 'angular2-toaster';
import { OfiMandateInvestorService } from '../../ofi-req-services/ofi-mandate-investor/service';
import { AppObservableHandler } from '@setl/utils/decorators/app-observable-handler';
import { OfiFundDataService } from '../../ofi-data-service/product/fund/ofi-fund-data-service';
import { Observable, of } from 'rxjs';
import get from 'lodash/get';
import { OfiKycService } from '../../ofi-req-services/ofi-kyc/service';
import { AlertsService } from '@setl/jaspero-ng2-alerts';
import { MandateInvestorDataService } from '../../ofi-data-service/mandate-investor/ofi-mandate-investor-data.service';
import { map, first } from 'rxjs/operators';
import { select } from '@angular-redux/store';
import { buildInvestorTypeList, InvestorType, InvestorTypeList } from '../../shared/investor-types';

const emailRegex = /^(((\([A-z0-9]+\))?[^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@AppObservableHandler
@Component({
    selector: 'izn-portfolio-manager-invite',
    templateUrl: 'pm-invite.component.html',
    styleUrls: ['pm-invite.component.scss'],
})
export class PortfolioManagerInviteComponent implements OnInit {

    inviteForm: FormGroup;
    languages = this.lang.translate([
        { id: 'fr', text: 'Français' },
        { id: 'en', text: 'English' },
    ]);
    investorTypes: InvestorTypeList = buildInvestorTypeList(
        InvestorType.FundOfFundsManager,
        InvestorType.DiscretionaryManager
    );
    investorTypes$: Observable<InvestorTypeList>;

    fundSelectList$: Observable<{ id: string, text: string }[]>;
    investorSelectList$: Observable<{ id: string, text: string }[]>;
    @select(['user', 'siteSettings', 'language']) language$: Observable<string>;

    constructor(
        private fb: FormBuilder,
        private lang: MultilingualService,
        private location: Location,
        private toaster: ToasterService,
        private ofiFundDataService: OfiFundDataService,
        private ofiKycService: OfiKycService,
        private alerts: AlertsService,
        private changeDetector: ChangeDetectorRef,
        private mandateInvestorService: MandateInvestorDataService,
    ) { }

    get f() {
        return (<FormArray>this.inviteForm.controls.portfolioManagers).controls;
    }

    ngOnInit() {
        this.inviteForm = this.fb.group({
            portfolioManagers: this.fb.array([]),
        });
        this.fundSelectList$ = this.ofiFundDataService.getFundSelectList();
        this.investorSelectList$ = this.mandateInvestorService.listArray().pipe(map((investors) => {
            return investors.map((inv) => {
                const displayName = (inv.investorType === InvestorType.RetailMandate) ? `${inv.firstName} ${inv.lastName}` : inv.companyName;
                return {
                    id: `${inv.id}`,
                    text: `${displayName} (${inv.walletName})`
                };
            });
        }));
        this.investorTypes$ = this.language$.flatMap(() => of(this.lang.translate(this.investorTypes)));
        this.addInvestor();
    }

    addInvestor() {
        const portfolioManagerForm = this.fb.group({
            email: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(emailRegex),
                ])
            ],
            language: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            investorType: [[this.investorTypes[0]], Validators.required],
            fundList: [[]],
            investorList: [[]],
        });
        (<FormArray>this.inviteForm.controls['portfolioManagers']).push(portfolioManagerForm);

        portfolioManagerForm.valueChanges.subscribe((portfolioManager) => {
            const fundList = portfolioManagerForm.get('fundList');
            const investorList = portfolioManagerForm.get('investorList');
            fundList.setValidators([]);
            investorList.setValidators([]);
            if (this.isFundOfFundsManager(portfolioManager)) {
                investorList.setErrors(null);
                fundList.setValidators(Validators.required);
            }
            if (this.isDiscretionaryManager(portfolioManager)) {
                fundList.setErrors(null);
                investorList.setValidators(Validators.required);
            }
        });
    }

    save(): void {
        const requestData = constructInvitationRequest(this.inviteForm.value);

        this.ofiKycService.sendInvestInvitations(requestData).then((response) => {
            const emailAddressList = response[1].Data[0].existingEmailAddresses;
            const alreadyInitiatedList = response[1].Data[0].alreadyInitiatedEmailAddresses;
            const validEmailList = [];
            const invalidEmailList = [];

            (this.inviteForm.get('portfolioManagers').value).map((investor) => {
                if ((emailAddressList.indexOf(investor.email) === -1) && alreadyInitiatedList.indexOf(investor.email) === -1) {
                    validEmailList.push(investor.email);
                } else {
                    invalidEmailList.push(investor.email);
                }
            });

            // Email addresses which are not linked to a user account
            if (validEmailList.length > 0) {
                this.displayInvitationSuccessModal(validEmailList).pipe(first()).subscribe(() => {
                    // Everyone invited, redirect back
                    if (this.inviteForm.get('portfolioManagers').value.length === validEmailList.length) {
                        this.location.back();
                    }
                });
            }

            // Email addresses which are already linked to a user account
            if (invalidEmailList.length > 0) {
                this.displayExistingEmailAddressToaster(invalidEmailList);
            }

            this.resetForm(this.inviteForm.value);
            this.markForCheck();
        });
    }

    displayInvitationSuccessModal(emails: Array<string>): Observable<any> {
        let message = '<p><b>';

        message += this.lang.translate('An invitation email to IZNES was sent to:');
        message += '</b></p><table class="table grid" > <tbody>';

        for (const email of emails) {
            message += '<tr><td>' + email + '</td></tr>';
        }
        message += '</tbody></table>';

        return this.alerts.create('success', message);
    }

    displayExistingEmailAddressToaster(invalidEmailAddressList: Array<string>) {
        invalidEmailAddressList.map((emailAddress) => {
            this.toaster.pop(
                'warning',
                this.lang.translate('A user has already created an account with the following email address: @emailAddress@', { 'emailAddress': emailAddress }),
            );
        });
    }

    isFundOfFundsManager(investor): boolean {
        return get(investor, 'investorType.0.id', 0) === InvestorType.FundOfFundsManager;
    }

    isDiscretionaryManager(investor): boolean {
        return get(investor, 'investorType.0.id', 0) === InvestorType.DiscretionaryManager;
    }

    msg(message, firstName, lastName) {
        return this.lang.translate( `${message} @firstName@ @lastName@`, { firstName, lastName } );
    }

    resetForm(formObj) {
        for (let i = formObj.portfolioManagers.length; i > 1; i--) {
            this.removeInvestor(i - 1);
        }
        this.inviteForm.reset();
    }

    goBack() {
        this.location.back();
    }

    markForCheck() {
        this.changeDetector.markForCheck();
    }

    removeInvestor(i: number) {
        (<FormArray>this.inviteForm.controls['portfolioManagers']).removeAt(i);
    }
}

/**
 * construct invitation request with form value.
 */
function constructInvitationRequest(formValue) {
    const investors = formValue.portfolioManagers.map(item => ({
        investorType: get(item, 'investorType.0.id'),
        email: get(item, 'email', ''),
        firstname: get(item, 'firstName', ''),
        lastname: get(item, 'lastName', ''),
        lang: get(item, 'language', 'fr'),
        fundList: (get(item, 'fundList') || []).map(f => f.id),
        investorList: (get(item, 'investorList') || []).map(i => i.id),
    }));

    return {
        assetManagerName: 'OFI',
        amCompanyName: 'OFI Am Management',
        investors,
    };
}
