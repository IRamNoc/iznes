/**
 * capitialise first letter.
 * @param string
 * @return {string}
 */
export function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 *  padding number from left.
 *
 * @param num
 * @param width
 * @param fill
 * @return {string}
 */
export function pad(num: number, width: number, fill: string): string {
    const numberStr = num.toString();
    const len = numberStr.length;
    return len >= width ? numberStr : new Array(width - len + 1).join(fill) + numberStr;
}

/**
 * Round number up, with specific decimal place.
 * @param {number} num
 * @param {number} numDecimal
 * @return {number}
 */
export function numberRoundUp(num: number, numDecimal: number = 2) {
    if (numDecimal < 0) {
        throw new Error('Number of decimal have to be positive number');
    }

    const divider = Math.pow(10, numDecimal);
    let rVal = num * divider;
    rVal = Math.ceil(rVal);
    return rVal / divider;
}

/**
 * Comma Separate a number
 * @param {number | string} val
 * @return {string}
 */
export function commaSeparateNumber(val: number | string): string {
    val = val.toString().replace(/,/g, '');
    return (val).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Safe base64 encode from browser, btoa something cause issue.
 * try to encode "Documents KYC : veuillez aider {{investorCompanyName}} à finaliser son dossier client" with btoa
 * @param str
 * @return {string}
 */
export function b64EncodeUnicode(str: string): string {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode(Number('0x' + p1));
        }));
}

/**
 * Safe base64 encode from browser, atob something cause issue.
 * try to decode
 * "RG9jdW1lbnRzIEtZQyA6IHZldWlsbGV6IGFpZGVyIHt7aW52ZXN0b3JDb21wYW55TmFtZX19IMOgIGZpbmFsaXNlciBzb24gZG9zc2llciBjbGllbnQ="
 * with atob
 * @param str
 * @return {string}
 */
export function b64DecodeUnicode(str: string): string {
    // Going backwards: from bytestream, to percent-encoding, to original string.
    return decodeURIComponent(atob(str).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
}

/**
 * Safely parse the json string with try catch.
 * @param {string} jsonStr
 * @return {object}
 */
export function safeJsonParse(jsonStr: string): object {
    let returnVal = {};
    try {
       returnVal = JSON.parse(jsonStr);
    } catch (e) {
        //console.log(e);
    }

    return returnVal;
}

