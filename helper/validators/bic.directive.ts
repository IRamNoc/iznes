import {AbstractControl} from '@angular/forms';

export function bicValidator(c: AbstractControl) {
    // condition 1: 1 to 4 characters are letter
    const ibanCond1 = new RegExp(/^[A-Z,a-z]{4}/);
    // condition 2: 5 to 6 are iso3166-1
    const ibanCond2 = new RegExp(/^.{4}(AF|AX|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BQ|BA|BW|BV|BR|IO|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CG|CD|CK|CR|CI|HR|CU|CW|CY|CZ|DK|DJ|DM|DO|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|GF|PF|TF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GP|GU|GT|GG|GN|GW|GY|HT|HM|VA|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|JM|JP|JE|JO|KZ|KE|KI|KP|KR|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MQ|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|NC|NZ|NI|NE|NG|NU|NF|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|GS|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TL|TG|TK|TO|TT|TN|TR|TM|TC|TV|UG|UA|AE|GB|US|UM|UY|UZ|VU|VE|VN|VG|VI|WF|EH|YE|ZM|ZW)/);
    // condition 3: 7 and 8 are two letters or two digits
    const ibanCond3 = new RegExp(/^.{6}([A-Za-z]{2}|[0-9]{2})/);

    // condition 4: 9 to 11 are three letters or three digits
    const ibanCond4 = new RegExp(/^.{8}([A-Za-z]{3}|[0-9]{3})$/);

    if (ibanCond1.test(c.value) && ibanCond2.test(c.value) && ibanCond3.test(c.value) && ibanCond4.test(c.value)) {
       return null;
    }
    return {
        bic: true,
    };
}
