import {NgModule} from '@angular/core';
import {Pipe, PipeTransform} from '@angular/core';

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

    constructor() {
        // TODO comes from configuration settings
        this.DECIMAL_SEPARATOR = '.';
        this.THOUSANDS_SEPARATOR = ',';
        this.PADDING = '00000';
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

    transform(value: number | string, fractionSize: number = 2): string {
        let [integer, fraction = ''] = (value || '').toString()
            .split(this.DECIMAL_SEPARATOR);

        fraction = fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + this.PADDING).substring(0, fractionSize)
            : '';

        integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

        return integer + fraction;
    }

    parse(value: string, fractionSize: number = 2): number {
        let [integer, fraction = ''] = (value || '').split(this.DECIMAL_SEPARATOR);

        integer = integer.replace(new RegExp(this.THOUSANDS_SEPARATOR, 'g'), '');

        fraction = parseInt(fraction, 10) > 0 && fractionSize > 0
            ? this.DECIMAL_SEPARATOR + (fraction + this.PADDING).substring(0, fractionSize)
            : '';

        return Number(integer + fraction);
    }
}

@Pipe({
    name: 'moneyValueOfi'
})
export class MoneyValueOfiPipe implements PipeTransform {
    transform(value: string, args: string[]): string {
        const pieces = ( parseFloat(value) / 5 ).toFixed(2).split('')
        let ii = pieces.length - 3
        while ((ii -= 3) > 0) {
            pieces.splice(ii, 0, ',');
        }
        return pieces.join('');

    }
}

@NgModule({
    declarations: [
        TruncatePipe,
        AssetPipe,
        MoneyValuePipe,
        MoneyValueOfiPipe
    ],
    exports: [
        TruncatePipe,
        AssetPipe,
        MoneyValuePipe,
        MoneyValueOfiPipe
    ]
})

export class SetlPipesModule {
}
