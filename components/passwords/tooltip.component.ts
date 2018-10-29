import {Component} from '@angular/core';
import {MultilingualService} from '@setl/multilingual';

@Component({
    selector : 'app-password-tooltip',
    template : '<i class="fa fa-info-circle" [tooltip]="{text: passwordStrengthText, size: \'medium\'}"></i>'
})
export class PasswordTooltipComponent{
    passwordStrengthText;

    constructor(private _translate : MultilingualService) {
        this.passwordStrengthText = this._translate.translate('The password must be at least 8 characters long and satisfy 3 of the following rules: ') + `
        <ul class="mt-1">
            <li>${this._translate.translate('One uppercase letter')}</li>
            <li>${this._translate.translate('One lowercase letter')}</li>
            <li>${this._translate.translate('One number')}</li>
            <li>${this._translate.translate('One symbol')}</li>
            <li>${this._translate.translate('One international character')}</li>
        </ul>
        `;
    }
}