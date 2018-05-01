import mathjs from 'mathjs';

const NumberScale = 100000;

export function multiply(num1: number, num2: number): number {
    if (typeof num1 !== 'number') {
        num1 = Number(num1);
    }

    if (typeof num2 !== 'number') {
        num2 = Number(num2);
    }

    return Number(mathjs.format(mathjs.chain(num1).multiply(num2).divide(NumberScale).done(), {
        notation: 'fixed',
        precision: 0
    }));
}

export function divide(num1: number, num2: number): number {
    if (typeof num1 !== 'number') {
        num1 = Number(num1);
    }

    if (typeof num2 !== 'number') {
        num2 = Number(num2);
    }

    return Number(mathjs.format(mathjs.chain(num1).divide(num2).multiply(NumberScale).done(), {
        notation: 'fixed',
        precision: 0
    }));
}

export function plus(num1: number, num2: number): number {
    if (typeof num1 !== 'number') {
        num1 = Number(num1);
    }

    if (typeof num2 !== 'number') {
        num2 = Number(num2);
    }

    return Number(mathjs.format(mathjs.chain(num1).add(num2).done(), {notation: 'fixed', precision: 0}));
}

export function subtract(num1: number, num2: number): number {
    if (typeof num1 !== 'number') {
        num1 = Number(num1);
    }

    if (typeof num2 !== 'number') {
        num2 = Number(num2);
    }

    return Number(mathjs.format(mathjs.chain(num1).subtract(num2).done(), {notation: 'fixed', precision: 0}));
}

export function toNormalScale(num: number, numDecimal: number): number {
    return mathjs.format(mathjs.chain(num).divide(NumberScale).done(), {notation: 'fixed', precision: numDecimal});
}
