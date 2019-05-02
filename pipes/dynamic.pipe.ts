import { Pipe, PipeTransform, Inject } from '@angular/core';
import { TranslatePipe } from './translate.pipe';
import { AssetPipe } from './asset.pipe';
import { MoneyValuePipe } from './money-value.pipe';
import { TruncatePipe } from './truncate.pipe';
import { PercentagePipe } from './percentage.pipe';
import { NumberConvertPipe } from './numberConvert.pipe';
import { CapitalizePipe } from './capitalise.pipe';
import { PaddingPipe } from './padding.pipe';
import { DateXPipe } from './datex.pipe';

@Pipe({
    name: 'dynamic',
})

export class DynamicPipe implements PipeTransform {
    constructor(
        private translatePipe: TranslatePipe,
        private assetPipe: AssetPipe,
        private moneyValuePipe: MoneyValuePipe,
        private truncatePipe: TruncatePipe,
        private percentagePipe: PercentagePipe,
        private numberConvertPipe: NumberConvertPipe,
        private capitalizePipe: CapitalizePipe,
        private paddingPipe: PaddingPipe,
        private dateXPipe: DateXPipe,
    ) {}

    transform(value: any, ...args: any[]): any {
        const [type, ...params] = args;

        switch (type) {
            case 'translate':
                return this.translatePipe.transform(value, params[0]);
            case 'asset':
                return this.assetPipe.transform(value, params[0]);
            case 'moneyValue':
                return this.moneyValuePipe.transform(value, params[0]);
            case 'truncate':
                return this.truncatePipe.transform(value, params);
            case 'percentage':
                return this.percentagePipe.transform(value);
            case 'numberConvert':
                return this.numberConvertPipe.transform(value, params[0]);
            case 'capitalize':
                return this.capitalizePipe.transform(value);
            case 'padding':
                return this.paddingPipe.transform(value, params[0], params[1]);
            case 'datex':
                return this.dateXPipe.transform(value, params[0]);
            default:
                return value;
        }
    }
}
