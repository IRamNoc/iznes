import { NgModule } from '@angular/core';
import { StrTruncatePipe } from './str-truncate.pipe';
import { DynamicPipe } from './dynamic.pipe';
import { TranslatePipe } from './translate.pipe';
import { AssetPipe } from './asset.pipe';
import { MoneyValuePipe } from './money-value.pipe';
import { TruncatePipe } from './truncate.pipe';
import { PercentagePipe } from './percentage.pipe';
import { NumberConvertPipe } from './numberConvert.pipe';
import { CapitalizePipe } from './capitalise.pipe';
import { PaddingPipe } from './padding.pipe';
import { DateXPipe } from './datex.pipe';

export { TranslatePipe } from './translate.pipe';
export { DateXPipe } from './datex.pipe';
export { MoneyValuePipe } from './money-value.pipe';
export { NumberConvertPipe } from './numberConvert.pipe';

@NgModule({
    declarations: [
        TranslatePipe,
        TruncatePipe,
        AssetPipe,
        MoneyValuePipe,
        NumberConvertPipe,
        CapitalizePipe,
        PaddingPipe,
        DateXPipe,
        PercentagePipe,
        StrTruncatePipe,
        DynamicPipe,
    ],
    exports: [
        TranslatePipe,
        TruncatePipe,
        AssetPipe,
        MoneyValuePipe,
        NumberConvertPipe,
        CapitalizePipe,
        PaddingPipe,
        DateXPipe,
        PercentagePipe,
        StrTruncatePipe,
        DynamicPipe,
    ],
    providers: [
        TranslatePipe,
        AssetPipe,
        MoneyValuePipe,
        TruncatePipe,
        PercentagePipe,
        NumberConvertPipe,
        CapitalizePipe,
        PaddingPipe,
        DateXPipe,
    ],
})

export class SetlPipesModule {
}
