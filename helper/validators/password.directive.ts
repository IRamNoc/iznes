export function passwordValidator(formControl) {
    const password = formControl.value;

    const minLength = 8;
    const validLength = password.length >= minLength;

    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const numbers = /[0-9]/;
    const symbols = /[$-/:-?{-~!"^_`\[\]]/;
    const unicode = /\u00A0-\uFFFF/;

    const hasUppercase = uppercase.test(password);
    const hasLowercase = lowercase.test(password);
    const hasNumber = numbers.test(password);
    const hasSymbol = symbols.test(password);
    const hasUnicode = unicode.test(password);

    const valid = [
            hasUppercase,
            hasLowercase,
            hasNumber,
            hasSymbol,
            hasUnicode
        ]
            .filter(v => v)
            .length
    ;
    const validValidators = valid >= 3;

    if (validValidators && validLength) {
        return null;
    }

    return {
        valid: false,
        rules: !validValidators,
        length: !validLength,
        uppercase : !hasUppercase,
        lowercase : !hasLowercase,
        number : !hasNumber,
        symbol : !hasSymbol,
        unicode : !hasUnicode
    };
}