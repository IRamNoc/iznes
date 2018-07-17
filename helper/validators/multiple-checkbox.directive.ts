import {FormControl} from '@angular/forms';

export function multipleCheckboxValidator(formGroup) {
    for (let key in formGroup.controls) {
        if (formGroup.controls.hasOwnProperty(key)) {
            let control: FormControl = <FormControl>formGroup.controls[key];
            if (!control.disabled && control.value) {
                return null;
            }
        }
    }

    return {
        multipleCheckbox: {
            valid: false
        }
    };
}