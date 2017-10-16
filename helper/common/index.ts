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
