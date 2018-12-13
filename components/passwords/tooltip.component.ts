import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MultilingualService } from '@setl/multilingual';
import { select } from '@angular-redux/store';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-password-tooltip',
    template: `<i *ngIf="showTooltip" class="fa fa-info-circle"
                  [tooltip]="{text: passwordStrengthText, size: 'medium'}"></i>`,
})
export class PasswordTooltipComponent implements OnInit, OnDestroy {
    public passwordStrengthText: string = '';
    public showTooltip: boolean = true;
    private subscription: Subscription;
    @select(['user', 'siteSettings', 'language']) languageOb;

    constructor(private translate: MultilingualService, private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.subscription = this.languageOb.subscribe(() => {
            this.showTooltip = false;
            this.setPasswordStrengthText();
        });
    }

    setPasswordStrengthText() {
        this.passwordStrengthText = `${this.translate.translate(
            'The password must be at least 8 characters long and satisfy 3 of the following rules:')}
            <ul class="mt-1">
                <li>${this.translate.translate('One uppercase letter')}</li>
                <li>${this.translate.translate('One lowercase letter')}</li>
                <li>${this.translate.translate('One number')}</li>
                <li>${this.translate.translate('One symbol')}</li>
                <li>${this.translate.translate('One international character')}</li>
            </ul>`;
        this.changeDetectorRef.detectChanges();
        this.showTooltip = true;
    }

    ngOnDestroy() {
        this.changeDetectorRef.detach();
        this.subscription.unsubscribe();
    }
}
