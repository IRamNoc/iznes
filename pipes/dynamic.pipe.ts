import { Pipe, PipeTransform, Inject } from '@angular/core';
import { TranslatePipe } from '@setl/utils/pipes/translate.pipe';
import { AssetPipe } from '@setl/utils/pipes/asset.pipe';
import { MoneyValuePipe } from '@setl/utils/pipes/money-value.pipe';

@Pipe({
    name: 'dynamic',
})

export class DynamicPipe implements PipeTransform {
    constructor(
        private translatePipe: TranslatePipe,
        private assetPipe: AssetPipe,
        private moneyValuePipe: MoneyValuePipe,
    ) {}

    transform(value: any, ...args: any[]): any {
        const type = args[0];

      switch (type) {
          case 'translate':
              return this.translatePipe.transform(value, args[1]);
          case 'asset':
              return this.assetPipe.transform(value, args[1]);
          case 'moneyValue':
              return this.moneyValuePipe.transform(value, args[1]);
          default:
              return value;
        }
  }
}
