import { ChangeDetectionStrategy, Component, OnInit, AfterViewInit, OnDestroy, EventEmitter, Output, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { take } from 'rxjs/operators';
import { ToasterService } from 'angular2-toaster';
import * as kycFormHelper from '../../my-requests/kyc-form-helper';
import { OfiKycService } from '../../../ofi-req-services/ofi-kyc/service';
import { SagaHelper } from '../../../../utils';
import { MultilingualService } from '../../../../multilingual';
import { KycMyInformations } from '../../../ofi-store/ofi-kyc';
import { SET_KYC_PARTY_SELECTIONS } from '../../../ofi-store/ofi-kyc/my-informations';
import { KycPartySelections } from '../../../ofi-store/ofi-kyc/my-informations/model';

@Component({
    selector: 'kyc-welcome',
    templateUrl: './component.html',
})
export class OfiKycWelcomeComponent implements OnInit, AfterViewInit, OnDestroy {
    @Output() completed: EventEmitter<boolean> = new EventEmitter();
    @Output('kycPartySelections') kycPartySelectionsOutput: EventEmitter<KycPartySelections> = new EventEmitter();
    public kycPartySelectionsForm: FormGroup;
    public kycPartySelections: KycPartySelections;
    public firstname: string;
    public investorType: number;
    public invitedAs: 'iznes'|'id2s'|'nowcp';
    private unsubscribe: Subject<any> = new Subject();
    public fadeIn: boolean = false;
    public contentMaxHeight: number;
    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformation$: Observable<KycMyInformations>;
    @select(['user', 'connected', 'connectedWallet']) connectedWallet$: Observable<number>;

    constructor(
        private ofiKycService: OfiKycService,
        private ngRedux: NgRedux<any>,
        private toasterService: ToasterService,
        public translate: MultilingualService,
        private changeDetector: ChangeDetectorRef,
    ) {}

    ngOnInit() {
        this.createKycPartySelectionsForm();
        this.getUsersKycInfo();
    }

    ngAfterViewInit() {
        this.fadeInContent();
    }

    /**
     * Subscribes to get Users KYC Info
     *
     * @returns {void}
     */
    private getUsersKycInfo(): void {
        this.kycMyInformation$
            .takeUntil(this.unsubscribe)
            .subscribe((d) => {
                this.firstname = d.firstName;
                this.investorType = d.investorType;

                // Get invited party selection
                const invitedSelection = kycFormHelper.getPartySelectionFromInvestorType(this.investorType)
                this.invitedAs = kycFormHelper.getPartyNameFromInvestorType(this.investorType);

                // Set KYC Party Selections or Get From Investor Type
                this.kycPartySelections = d.kycPartySelections
                    ? { ...d.kycPartySelections, ...invitedSelection }
                    : invitedSelection;

                this.updateKycPartySelectionsForm(invitedSelection);
            });
    }

    /**
     * Creates the Party Selection Form
     *
     * @returns {void}
     */
    private createKycPartySelectionsForm(): void {
        this.kycPartySelectionsForm = new FormGroup({
            nowCPIssuer: new FormControl(),
            nowCPInvestor: new FormControl(),
            id2sCustodian: new FormControl(),
            id2sIPA: new FormControl(),
            iznes: new FormControl(),
        },
        this.validateFormSelections as ValidatorFn,
        );
    }

    /**
     * Validate Form Selections
     * Returns error if both ID2S Custdian and IPA are checked
     *
     * @param {FormGroup} form
     * @returns {ValidationErrors}
     */
    private validateFormSelections(form: FormGroup): ValidationErrors {
        if (form.get('id2sCustodian').value && form.get('id2sIPA').value) {
            return { invalidParties: true }
        }

        return null;
    }

    /**
     * Update KYC Party Selctions Form
     *
     * @param {KycPartySelections} invitedSelection
     * @returns {void}
     */
    private updateKycPartySelectionsForm(invitedSelection: KycPartySelections): void {
       this.kycPartySelectionsForm.reset();

       // Set form values
       this.kycPartySelectionsForm.patchValue({
            nowCPIssuer: !!this.kycPartySelections.nowCPIssuer,
            nowCPInvestor: !!this.kycPartySelections.nowCPInvestor,
            id2sCustodian: !!this.kycPartySelections.id2sCustodian,
            id2sIPA: !!this.kycPartySelections.id2sIPA,
            iznes: !!this.kycPartySelections.iznes,
       })

        // Disable control/s for invited party selection/s
        Object.keys(invitedSelection).forEach(c => this.kycPartySelectionsForm.get(c).disable());
    }

    /**
     * Saves the party selections
     *
     * @returns {Promise<void>}
     */
    public async handleSavePartySelection(): Promise<void> {
        const walletId = await this.connectedWallet$.pipe(take(1)).toPromise();
        const partySelections = JSON.stringify(this.kycPartySelectionsForm.getRawValue());
        const asyncTaskPipe = this.ofiKycService.setKycPartySelections({ walletId, partySelections });

        this.ngRedux.dispatch(SagaHelper.runAsync(
            [SET_KYC_PARTY_SELECTIONS],
            [],
            asyncTaskPipe,
            {},
            () => {
                this.completed.emit(true);
                // Don't show success toaster for IZNES as they have no selection to make, but still save to DB as needed for logic in KYC
                if (this.invitedAs !== 'iznes') {
                    this.toasterService.pop('success', this.translate.translate('Successfully saved your selections'));
                }

                this.kycPartySelectionsOutput.next(this.kycPartySelections);
            },
            () => {
                this.toasterService.pop('error', this.translate.translate('Something went wrong. Please try again later'));
            }),
        );
    }

    /**
     * Fades in once the max-height of the content has been set
     *
     * @returns {void}
     */
    private fadeInContent(): void {
        setTimeout(() => {
            this.fadeIn = true;
            this.changeDetector.detectChanges();
        }, 200);
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
