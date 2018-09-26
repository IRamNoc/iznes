export function sirenValidator(formControl){
    const siren = formControl.value;

    const validator = /^[0-9]{9}$/;

    const valid = validator.test(siren);

    if(valid){
        return null;
    }

    return {
        validSiren: true
    }
}

export function siretValidator(formControl){
    const siret = formControl.value;

    const validator = /^[0-9]{14}$/;

    const valid = validator.test(siret);

    if(valid){
        return null;
    }

    return {
        validSiret: true
    }
}