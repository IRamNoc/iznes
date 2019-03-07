import {AbstractControl} from '@angular/forms';

export function swiftNameAddressValidator(c: AbstractControl) {
    const value = c.value;
    var re = new RegExp("^[a-zA-Z0-9/\-\?:\(\)\.,'+ ]{0,35}$");

    if(value && re.test(value)){
        return null;
    }

    return {
        swiftNameAddress: true
    };
}
