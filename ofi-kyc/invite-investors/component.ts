import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Location} from '@angular/common';
import {OfiKycService} from '../../ofi-req-services/ofi-kyc/service';
import {immutableHelper} from '@setl/utils';
import {select} from '@angular-redux/store';
import {Subscription} from 'rxjs/Subscription';
import {AlertsService} from '@setl/jaspero-ng2-alerts';

@Component({
    selector: 'app-invite-investors',
    styleUrls: ['./component.css'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OfiInviteInvestorsComponent implements OnInit, OnDestroy {
    invitationForm: FormGroup;
    investor: any;
    language: string;
    /* Observables */
    @select(['user', 'siteSettings', 'language']) languageObs;
    private subscriptions: Array<Subscription> = [];

    /* Constructor. */
    constructor(private _fb: FormBuilder,
                private _changeDetectorRef: ChangeDetectorRef,
                private _location: Location,
                private alertsService: AlertsService,
                private _ofiKycService: OfiKycService) {
        this.invitationForm = this._fb.group({
            investors: this._fb.array([])
        });
        this.addInvestor(this.invitationForm);
    }

    /**
     * Check whether we have multiple invites
     * Use to render the send invite button
     * @return {boolean}
     */
    get hasMultipleInvites(): boolean {
        const invitesControl: FormArray = <FormArray> this.invitationForm.controls['investors'];
        const numInvites: number = invitesControl.length;
        return (numInvites > 1);
    }

    ngOnInit(): void {
        this.subscriptions.push(this.languageObs.subscribe(language => this.language = language));
    }

    ngOnDestroy(): void {
        /* Detach the change detector on destroy. */
        this._changeDetectorRef.detach();

        /* Unsubscribe Observables. */
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }

    getControls(frmGrp: FormGroup, key: string) {
        return (<FormArray>frmGrp.controls[key]).controls;
    }

    addInvestor(formObj) {
        const control = <FormArray>formObj.controls['investors'];
        const addrCtrl = this._fb.group({
            email: [
                '',
                Validators.compose([
                    Validators.required,
                    Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
                ])
            ],
            firstName: [
                '',
            ],
            lastName: [
                '',
            ]
        });
        control.push(addrCtrl);
    }

    removeInvestor(formObj, i: number) {
        const control = <FormArray>formObj.controls['investors'];
        control.removeAt(i);
    }

    /**
     * Send out invitation(s)
     * @param formValues
     */
    save(formValues): void {
        let message = '<p><b>An invitation email to IZNES was sent to:</b></p><table class="table grid"><tbody>';
        for (const inv of formValues.investors) message += '<tr><td>' + inv.email + '</td></tr>';
        message += '</tbody></table>';
        this.alertsService.create('success', message);

        // make the request
        const requestData = constructInvitationRequest(formValues, this.language);
        this._ofiKycService.sendInvestInvitations(requestData).then(() => {
            // success call back
            this.resetForm(formValues);
            this.markForCheck();
        }, () => {
            // fail call back
            // todo
        });
    }

    resetForm(formObj) {
        if (formObj.investors.length > 1) {
            for (let i = formObj.investors.length; i > 1; i--) {
                this.removeInvestor(this.invitationForm, i - 1);
            }
        }
        this.invitationForm.reset();
    }

    goBack() {
        this._location.back();
    }

    markForCheck() {
        this._changeDetectorRef.markForCheck();
    }
}

/**
 * construct invitation request with form value.
 */
function constructInvitationRequest(formValue, lang) {
    const investors = immutableHelper.reduce(formValue.investors, (result, item) => {
        result.push({
            email: item.get('email', ''),
            firstname: item.get('firstName', ''),
            lastname: item.get('lastName', '')
        });
        return result;
    }, []);

    return {
        assetManagerName: 'OFI',
        amCompanyName: 'OFI Am Management',
        investors,
        lang
    };
}
