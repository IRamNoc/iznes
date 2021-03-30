import {AbstractControl} from '@angular/forms';
import {isValidIBAN} from 'ibantools';


export function mainIbanValidator(c: AbstractControl) {
    const value = c.value;

    if(value && isValidIBAN(value)){
        return null;
    }

    if (!value) {
        return null;
    }

    return {
        iban: true
    };
}