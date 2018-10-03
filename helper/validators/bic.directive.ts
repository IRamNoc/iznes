import {AbstractControl} from '@angular/forms';
import {isValidBIC} from 'ibantools';

export function bicValidator(c: AbstractControl) {
    const value = c.value;

    if(value && isValidBIC(value)){
        return null;
    }

    return {
        bic: true
    };
}
