import * as math from 'mathjs';

/**
 * round to the decimal specified, either using normal rounding or round down(ceil), round up(floor)
 * The purpose of the function is try to achieve the following:
 * 1. Avoid javascript float point number error notation. (fixed by using format(), similar with toFixed in built-in, but
 * allow us to pass in {notation: 'fixed'} to force javascript to show number as normal form)
 * 2. Avoid number showing as scientific notation: 2.3e45
 *
 * @param {number} num
 * @param {number} numDecimal
 * @param {"normal" | "ceil" | "floor"} roundMethod
 * @return {number}
 */
export function fixToDecimal(num: number, numDecimal: number = 0, roundMethod: 'normal' | 'ceil' | 'floor'): number {

    switch (roundMethod) {
    case 'normal':
        return Number(math.format(num, { notation: 'fixed', precision: numDecimal }));
    case 'ceil':
        // ceil it first before fixed.
        num = (Math.ceil(num * Math.pow(10, numDecimal)) / Math.pow(10, numDecimal));

        return Number(math.format(num, { notation: 'fixed', precision: numDecimal }));
    case 'floor':
        // floor it first before fixed.
        num = (Math.floor(num * Math.pow(10, numDecimal)) / Math.pow(10, numDecimal));

        return Number(math.format(num, { notation: 'fixed', precision: numDecimal }));
    }

}

export function lowerRoundedQuantity(num: number, decimal: number = 0) {
    return math.format(Number(Math.floor(parseFloat(num + 'e' + decimal)) + 'e-' + decimal), 14);
}