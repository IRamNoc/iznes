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
    transform(value: string, args: string[]): string {
        const pieces = parseFloat(value).toFixed(2).split('')
        let ii = pieces.length - 3
        while ((ii -= 3) > 0) {
            pieces.splice(ii, 0, ',');
        }
        return pieces.join('');

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
