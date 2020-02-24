/* Core/Angular imports. */
import { ChangeDetectionStrategy, Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { select, NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ToasterService } from 'angular2-toaster';
import * as kycFormHelper from '../../my-requests/kyc-form-helper';
import { KycMyInformations } from '../../../ofi-store/ofi-kyc';
import { OfiKycService } from '../../../ofi-req-services/ofi-kyc/service';
import { SagaHelper } from '../../../../utils';
import { MultilingualService } from '../../../../multilingual';


@Component({
    selector: 'kyc-welcome',
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfiKycWelcomeComponent implements OnInit, OnDestroy {
    @Output() completed: EventEmitter<boolean> = new EventEmitter();
    public kycPartySelectionsForm: FormGroup;
    public kycPartySelections: kycFormHelper.kycPartySelections;
    public firstname: string;
    public investorType: number;
    public isInvitedAsIznes: boolean;
    private unsubscribe: Subject<any> = new Subject();
    @select(['ofi', 'ofiKyc', 'myInformations']) kycMyInformations: Observable<KycMyInformations>;

    constructor(
        private ofiKycService: OfiKycService,
        private ngRedux: NgRedux<any>,
        private toasterService: ToasterService,
        public translate: MultilingualService,
    ) {}

    ngOnInit() {
        this.createKycPartySelectionsForm();

        /* Subscribe for this user's connected info. */
        this.kycMyInformations
            .takeUntil(this.unsubscribe)
            .subscribe((d) => {
                this.firstname = d.firstName;
                this.investorType = d.investorType;

                // Get invited party selection
                const invitedSelection = kycFormHelper.getPartySelectionFromInvestorType(this.investorType)
                this.isInvitedAsIznes = kycFormHelper.isIZNES(invitedSelection);

                // Set KYC Party Selections or Get From Investor Type
                this.kycPartySelections = d.kycPartySelections ? d.kycPartySelections : invitedSelection;

                this.updateKycPartySelectionsForm();
            });
    }

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
     * Validation Form Selections
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

    private updateKycPartySelectionsForm(): void {
       this.kycPartySelectionsForm.reset();

        // NowCP Issuer
        if (kycFormHelper.isNowCPIssuer(this.kycPartySelections)) {
            this.kycPartySelectionsForm.get('nowCPIssuer').patchValue(true);
            this.kycPartySelectionsForm.get('nowCPIssuer').disable();
        }

        // NowCP Investor
        if (kycFormHelper.isNowCPInvestor(this.kycPartySelections)) {
            this.kycPartySelectionsForm.get('nowCPInvestor').patchValue(true);
            this.kycPartySelectionsForm.get('nowCPInvestor').disable();
        }

        // ID2S Custodian
        if (kycFormHelper.isID2SCustodian(this.kycPartySelections)) {
            this.kycPartySelectionsForm.get('id2sCustodian').patchValue(true);
            this.kycPartySelectionsForm.get('id2sCustodian').disable();
        }

        // ID2S IPA
        if (kycFormHelper.isID2SIPA(this.kycPartySelections)) {
            this.kycPartySelectionsForm.get('id2sIPA').patchValue(true);
            this.kycPartySelectionsForm.get('id2sIPA').disable();
        }
    }

    handleSavePartySelection(): void {
        const partySelections = JSON.stringify(this.kycPartySelections);

        const asyncTaskPipe = this.ofiKycService.setKycPartySelections(partySelections);
        this.ngRedux.dispatch(SagaHelper.runAsyncCallback(
            asyncTaskPipe,
            () => {
                this.completed.emit(true);
            },
            () => {
                this.toasterService.pop('error', this.translate.translate('Something went wrong. Please try again later'));
            }),
        );
    }


    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }
}
