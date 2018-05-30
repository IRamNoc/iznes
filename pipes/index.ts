import {NgModule, Pipe, PipeTransform} from '@angular/core';
import {pad} from '../helper/common';
import * as moment from 'moment';

@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, args: string[]): string {
        const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
        const trail = args.length > 1 ? args[1] : '...';
        return value.length > limit ? value.substring(0, limit).trim() + trail : value;
    }
}

@Pipe({
    name: 'asset'
})
export class AssetPipe implements PipeTransform {
    transform(value: string, args: string[]): string {
        value = value.replace('|', '<span class="asset-pipe">|</span>');
        return value;
    }
}

@Pipe({
    name: 'moneyValue'
})
export class MoneyValuePipe implements PipeTransform {
    private DECIMAL_SEPARATOR: string;
    private THOUSANDS_SEPARATOR: string;
    private PADDING: string;
    private ROUND_UP_DECIMALS: any;

    constructor() {
        // TODO comes from configuration settings
        this.DECIMAL_SEPARATOR = '.';
        this.THOUSANDS_SEPARATOR = ' ';
        this.PADDING = '00000';
        this.ROUND_UP_DECIMALS = [4, 5];
    }

    //   transform(value: string, args: string[]): string {
    //     const pieces = ( parseFloat(value)).toFixed(2).split('')
    //     let ii = pieces.length - 3
    //     while ((ii -= 3) > 0) {
    //         pieces.splice(ii, 0, ',');
    //     }
    //     return pieces.join('');
    //
    // }

    transform(value: any, fractionSize: number = 2): any {
        if (typeof value !== 'number') {
            value = Number(value);
        }
        if (value === '' || value === null || isNaN(value)) {
            value = 0;
        }
        if (typeof value !== 'undefined' && !isNaN(value.toString().replace(/ /g, ''))) {
            const newValue = (this.ROUND_UP_DECIMALS.indexOf(Number(fractionSize)) !== -1)
                ? this.roundUp(value, fractionSize)
                : value;

            // fix if round up give only an integer
            const fixInteger = this.round(newValue.toString().indexOf('.') === -1 ? newValue + '.0' : newValue, fractionSize);

            let [integer, fraction = ''] = (fixInteger || '').toString()
                .split(this.DECIMAL_SEPARATOR);

            fraction = fractionSize > 0
                ? this.DECIMAL_SEPARATOR + (fraction + this.PADDING).substring(0, fractionSize)
                : '';

            integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR) || '0';

            return integer + fraction;
        } else {
            return value;
        }
    }

    parse(value: any, fractionSize: number = 2): any {
        let returnValue;
        if (typeof value !== 'undefined' && !isNaN(value.toString().replace(/ /g, ''))) {
            const newValue = (this.ROUND_UP_DECIMALS.indexOf(Number(fractionSize)) !== -1)
                ? this.roundUp(value, fractionSize).toString()
                : value.toString();
            const fixInteger = (newValue.indexOf('.') === -1) ? newValue + '.0' : newValue; // fix if round up give only an integer

            let [integer, fraction = ''] = (fixInteger || '').split(this.DECIMAL_SEPARATOR);

            integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, 'g'), '');

            fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
                ? this.DECIMAL_SEPARATOR + (fraction + this.PADDING).substring(0, fractionSize)
                : '';

            try {
                returnValue = Number(integer + fraction);
            } catch (e) {
                returnValue = 0;
            }
            return returnValue;
        } else {
            return 0;
        }
    }

    private roundUp(value, decimals) {
        // if integer sup to 273 999 999 999 this function will not work properly with 5 decimals
        // The Number.MAX_SAFE_INTEGER constant represents the maximum safe integer in JavaScript (2 53 - 1).
        // Possible solution : https://www.npmjs.com/package/big-integer
        const cleanedValue = Number(Number(value.toString().replace(/ /g, '')) + 'e' + decimals);
        return Number(Math.round(cleanedValue) + 'e-' + decimals);
    }

    private round(number, precision) {
        var shift = function (number, exponent) {
            var numArray = ("" + number).split("e");
            return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + exponent) : exponent));
        };
        return shift(Math.round(shift(number, +precision)), -precision);
    }
}

@Pipe({name: 'capitalize'})
export class CapitalizePipe implements PipeTransform {

    transform(value: string) {
        if (value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
        return value;
    }

}

@Pipe({name: 'padding'})
export class PaddingPipe implements PipeTransform {
    transform(value: string, width: number = 0, fill: string = '0'): string {
        return pad(Number(value), width, fill);
    }
}

@Pipe({name: 'datex'})
export class DateXPipe implements PipeTransform {
    transform(date: string, format): string {
        return moment(date).format(format);
    }
}

@Pipe({name: 'percentage'})
export class PercentagePipe implements PipeTransform {
    transform(value: any): any {
        if (value !== null) {
            if (typeof value !== 'number') {
                value = Number(value);
            }
            return value.toFixed(2) + '%';
        }
        return '';
    }
}

@NgModule({
    declarations: [
        TruncatePipe,
        AssetPipe,
        MoneyValuePipe,
        CapitalizePipe,
        PaddingPipe,
        DateXPipe,
        PercentagePipe
    ],
    exports: [
        TruncatePipe,
        AssetPipe,
        MoneyValuePipe,
        CapitalizePipe,
        PaddingPipe,
        DateXPipe,
        PercentagePipe
    ]
})

export class SetlPipesModule {
}
