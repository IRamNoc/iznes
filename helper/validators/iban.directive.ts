import {AbstractControl} from '@angular/forms';

export function ibanValidator(c: AbstractControl) {
    const IBAN_REGEXP = new RegExp(/\b^[A-Za-z]{2}[A-Za-z0-9]{12,32}\b/);

    return IBAN_REGEXP.test(c.value) ? null : {
        iban: true
    };
}