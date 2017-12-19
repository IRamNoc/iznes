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
